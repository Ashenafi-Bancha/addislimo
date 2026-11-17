import type pg from 'pg'
import { query, transaction } from '../../db/pool.ts'
import { badRequest, conflict, notFound } from '../../lib/errors.ts'
import { newBookingReference } from '../../lib/ids.ts'
import * as driversRepo from '../drivers/repository.ts'
import * as partnersRepo from '../partners/repository.ts'
import { quote, splitCommission } from '../quotes/pricing.ts'
import * as vehiclesRepo from '../vehicles/repository.ts'
import type { Booking, BookingSource, BookingStatus } from '../../types/index.ts'
import * as repo from './repository.ts'
import { assertTransition, isLive } from './status.ts'

/**
 * Everything a booking is allowed to do, and what has to be true first.
 *
 * Two rules shape this file:
 *
 * A write that touches more than one row happens in a transaction with the
 * booking row locked. Dispatch is two people on two screens at 6am; without
 * the lock, both can read "no driver yet" and both assign one.
 *
 * Money is settled when it is earned and never recalculated afterwards. The
 * commission on a completed trip is what the partner's rate was that day.
 * Raising the rate next month must leave last month's finance figures exactly
 * where they were.
 */

export interface CreateBookingInput {
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceId: string
  pickup: string
  destination: string
  scheduledAt: Date
  passengers: number
  luggage: number
  vehicleClass: string
  notes: string
  source?: BookingSource
}

/**
 * A booking from the public wizard. It arrives Pending with nobody assigned:
 * pricing is an estimate the customer has seen, dispatch owns everything
 * after that.
 */
export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  if (input.scheduledAt.getTime() < Date.now() - 60 * 60 * 1000) {
    throw badRequest('That pickup time has already passed.', {
      scheduledAt: 'Choose a time in the future.',
    })
  }

  const estimate = await quote({
    serviceId: input.serviceId,
    vehicleClassId: input.vehicleClass,
    passengers: input.passengers,
    scheduledAt: input.scheduledAt,
  })

  // A reference collision is a one-in-a-million event that would otherwise
  // surface as a primary key error on a customer's booking. Three tries puts
  // it beyond reach.
  for (let attempt = 0; attempt < 3; attempt++) {
    const id = newBookingReference()
    try {
      return await transaction(async (client) => {
        const booking = await repo.insert(
          {
            id,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            customerPhone: input.customerPhone,
            serviceId: input.serviceId,
            pickup: input.pickup,
            destination: input.destination,
            scheduledAt: input.scheduledAt,
            passengers: input.passengers,
            luggage: input.luggage,
            vehicleClass: input.vehicleClass,
            partnerId: null,
            amount: estimate.amount,
            commission: 0,
            commissionRate: 0,
            status: 'Pending',
            notes: input.notes,
            source: input.source ?? 'website',
          },
          client,
        )
        await repo.addEvent(
          {
            bookingId: booking.id,
            actor: 'customer',
            kind: 'created',
            toStatus: 'Pending',
            detail: `${estimate.amount} ETB estimated`,
          },
          client,
        )
        return booking
      })
    } catch (error) {
      if (isUniqueViolation(error, 'bookings_pkey') && attempt < 2) continue
      throw error
    }
  }

  throw conflict('Could not allocate a booking reference. Please try again.')
}

export async function listBookings(filters: repo.BookingFilters) {
  const [items, total] = await Promise.all([repo.list(filters), repo.count(filters)])
  return { items, total }
}

export async function getBooking(id: string): Promise<Booking> {
  const booking = await repo.byId(id)
  if (!booking) throw notFound('That booking')
  return booking
}

export async function getBookingWithHistory(id: string) {
  const booking = await getBooking(id)
  return { booking, events: await repo.eventsFor(id) }
}

export interface UpdateBookingInput {
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  serviceId?: string
  pickup?: string
  destination?: string
  scheduledAt?: Date
  passengers?: number
  luggage?: number
  vehicleClass?: string | null
  partnerId?: string | null
  driverId?: string | null
  vehicleId?: string | null
  amount?: number
  status?: BookingStatus
  notes?: string
  cancelledReason?: string
}

/**
 * The one write path for an existing booking: the drawer's "Edit details",
 * the status dropdown and the assignment pickers all land here, so a rule
 * cannot be enforced on one screen and missed on another.
 */
export async function updateBooking(
  id: string,
  input: UpdateBookingInput,
  actor: string,
): Promise<Booking> {
  return transaction(async (client) => {
    const before = await repo.byIdForUpdate(id, client)
    if (!before) throw notFound('That booking')

    const patch: repo.BookingPatch = {}
    const events: { kind: 'status' | 'assigned' | 'updated' | 'priced'; detail: string }[] = []

    /* ── Trip and customer details ── */
    const text = ['customerName', 'customerEmail', 'customerPhone', 'pickup', 'destination', 'notes'] as const
    for (const field of text) {
      const value = input[field]
      if (value !== undefined && value !== before[field]) {
        ;(patch as Record<string, unknown>)[field] = value
      }
    }
    if (input.serviceId !== undefined && input.serviceId !== before.serviceId) {
      await assertServiceExists(input.serviceId)
      patch.serviceId = input.serviceId
    }
    if (input.scheduledAt && input.scheduledAt.toISOString() !== before.scheduledAt) {
      patch.scheduledAt = input.scheduledAt
    }
    if (input.passengers !== undefined) patch.passengers = input.passengers
    if (input.luggage !== undefined) patch.luggage = input.luggage
    if (input.vehicleClass !== undefined) patch.vehicleClass = input.vehicleClass

    /* ── Who is fulfilling it ── */
    const nextPartnerId = input.partnerId !== undefined ? input.partnerId : before.partnerId
    let nextDriverId = input.driverId !== undefined ? input.driverId : before.driverId
    let nextVehicleId = input.vehicleId !== undefined ? input.vehicleId : before.vehicleId

    if (input.partnerId !== undefined && input.partnerId !== before.partnerId) {
      if (input.partnerId === null) {
        if (isLive(before.status)) {
          throw conflict('This trip is under way. It cannot be taken off its partner.')
        }
        nextDriverId = null
        nextVehicleId = null
      } else {
        const partner = await partnersRepo.byId(input.partnerId, client)
        if (!partner) throw badRequest('That partner does not exist.', { partnerId: 'Unknown partner.' })
        if (partner.status !== 'Active') {
          throw conflict(
            `${partner.name} is ${partner.status.toLowerCase()} and cannot take new trips.`,
            'partner_inactive',
          )
        }
        // A driver and a vehicle belong to the partner they came from, so
        // moving the trip elsewhere clears both rather than leaving a
        // combination the database would refuse anyway.
        if (input.driverId === undefined) nextDriverId = null
        if (input.vehicleId === undefined) nextVehicleId = null
      }
      patch.partnerId = input.partnerId
      events.push({ kind: 'assigned', detail: input.partnerId ? `Partner ${input.partnerId}` : 'Partner cleared' })
    }

    const passengers = patch.passengers ?? before.passengers

    if (nextDriverId !== before.driverId) {
      if (nextDriverId) await assertDriverAssignable(client, nextDriverId, nextPartnerId, id)
      patch.driverId = nextDriverId
      events.push({ kind: 'assigned', detail: nextDriverId ? `Driver ${nextDriverId}` : 'Driver cleared' })
    }

    if (nextVehicleId !== before.vehicleId) {
      if (nextVehicleId) {
        await assertVehicleAssignable(client, nextVehicleId, nextPartnerId, passengers, id)
      }
      patch.vehicleId = nextVehicleId
      events.push({ kind: 'assigned', detail: nextVehicleId ? `Vehicle ${nextVehicleId}` : 'Vehicle cleared' })
    }

    /* ── Money ──
       Re-priced while the trip is still open; frozen the moment it completes
       or is cancelled, which is what keeps a closed month closed. */
    const terminal = before.status === 'Completed' || before.status === 'Cancelled'
    const nextAmount = input.amount !== undefined ? input.amount : before.amount

    if (input.amount !== undefined && input.amount !== before.amount) {
      if (terminal) {
        throw conflict(
          `This booking is ${before.status.toLowerCase()}. Its price is part of the finance record and cannot be changed.`,
          'amount_frozen',
        )
      }
      patch.amount = input.amount
      events.push({ kind: 'priced', detail: `${before.amount} → ${input.amount} ETB` })
    }

    const partnerChanged = patch.partnerId !== undefined
    const amountChanged = patch.amount !== undefined
    if (!terminal && (partnerChanged || amountChanged)) {
      const rate = nextPartnerId
        ? (await partnersRepo.byId(nextPartnerId, client))?.commissionRate ?? 0
        : 0
      const split = splitCommission(nextAmount, rate)
      patch.commission = split.commission
      patch.commissionRate = split.rate
    }

    /* ── Status ── */
    if (input.status !== undefined && input.status !== before.status) {
      assertTransition(before.status, input.status, {
        partnerId: nextPartnerId,
        driverId: nextDriverId,
      })
      patch.status = input.status
      if (input.status === 'Completed') patch.completedAt = new Date()
      if (input.status === 'Cancelled') {
        patch.cancelledReason = input.cancelledReason?.trim() || 'Cancelled by dispatch'
      }
      events.push({ kind: 'status', detail: `${before.status} → ${input.status}` })
    } else if (input.cancelledReason !== undefined && before.status === 'Cancelled') {
      patch.cancelledReason = input.cancelledReason.trim()
    }

    const after = await writeWithConstraintMessages(() => repo.update(id, patch, client))

    for (const event of events) {
      await repo.addEvent(
        {
          bookingId: id,
          actor,
          kind: event.kind,
          fromStatus: event.kind === 'status' ? before.status : null,
          toStatus: event.kind === 'status' ? after.status : null,
          detail: event.detail,
        },
        client,
      )
    }
    if (events.length === 0 && Object.keys(patch).length > 0) {
      await repo.addEvent({ bookingId: id, actor, kind: 'updated', detail: 'Details edited' }, client)
    }

    return after
  })
}

/** `checkBookingDelete` in the console's guards, enforced. */
export async function deleteBooking(id: string, actor: string): Promise<void> {
  await transaction(async (client) => {
    const booking = await repo.byIdForUpdate(id, client)
    if (!booking) throw notFound('That booking')
    if (isLive(booking.status)) {
      throw conflict(
        'This trip is under way. Finish or cancel it before deleting the record.',
        'booking_live',
      )
    }
    await repo.remove(id, client)
    // The events cascade with the booking; the deletion itself is recorded by
    // the request log, not by a row that no longer has a parent.
    void actor
  })
}

/* ── Assignment checks ── */

async function assertDriverAssignable(
  client: pg.PoolClient,
  driverId: string,
  partnerId: string | null,
  bookingId: string,
): Promise<void> {
  const driver = await driversRepo.byId(driverId, client)
  if (!driver) throw badRequest('That driver does not exist.', { driverId: 'Unknown driver.' })
  if (!partnerId) {
    throw conflict('Give the trip to a partner before assigning one of their drivers.', 'partner_required')
  }
  if (driver.partnerId !== partnerId) {
    throw conflict(
      `${driver.name} belongs to another partner. Assign a driver from the partner fulfilling this trip.`,
      'driver_wrong_partner',
    )
  }
  if (driver.status === 'Off Duty') {
    throw conflict(`${driver.name} is off duty.`, 'driver_off_duty')
  }

  const busy = await client.query<{ id: string }>(
    `SELECT id FROM bookings
      WHERE driver_id = $1 AND id <> $2 AND status IN ('Driver En Route', 'In Progress') LIMIT 1`,
    [driverId, bookingId],
  )
  const clash = busy.rows[0]
  if (clash) {
    throw conflict(`${driver.name} is on booking ${clash.id} right now.`, 'driver_busy')
  }
}

async function assertVehicleAssignable(
  client: pg.PoolClient,
  vehicleId: string,
  partnerId: string | null,
  passengers: number,
  bookingId: string,
): Promise<void> {
  const vehicle = await vehiclesRepo.byId(vehicleId, client)
  if (!vehicle) throw badRequest('That vehicle does not exist.', { vehicleId: 'Unknown vehicle.' })
  if (!partnerId) {
    throw conflict('Give the trip to a partner before assigning one of their vehicles.', 'partner_required')
  }
  if (vehicle.partnerId !== partnerId) {
    throw conflict(
      `${vehicle.make} ${vehicle.model} belongs to another partner.`,
      'vehicle_wrong_partner',
    )
  }
  if (vehicle.status === 'Maintenance') {
    throw conflict(`${vehicle.make} ${vehicle.model} (${vehicle.plate}) is in maintenance.`, 'vehicle_maintenance')
  }
  if (vehicle.seats < passengers) {
    throw conflict(
      `${vehicle.make} ${vehicle.model} seats ${vehicle.seats}; this trip has ${passengers} passengers.`,
      'vehicle_too_small',
    )
  }

  const busy = await client.query<{ id: string }>(
    `SELECT id FROM bookings
      WHERE vehicle_id = $1 AND id <> $2 AND status IN ('Driver En Route', 'In Progress') LIMIT 1`,
    [vehicleId, bookingId],
  )
  const clash = busy.rows[0]
  if (clash) {
    throw conflict(`That vehicle is on booking ${clash.id} right now.`, 'vehicle_busy')
  }
}

async function assertServiceExists(serviceId: string): Promise<void> {
  const result = await query('SELECT 1 FROM services WHERE id = $1 AND active', [serviceId])
  if (result.rowCount === 0) {
    throw badRequest('That service is not one we offer.', { serviceId: 'Unknown service.' })
  }
}

/* ── Turning constraint violations into sentences ── */

function isUniqueViolation(error: unknown, constraint?: string): boolean {
  const code = (error as { code?: string }).code
  if (code !== '23505') return false
  if (!constraint) return true
  return (error as { constraint?: string }).constraint === constraint
}

/**
 * The partial unique indexes on live driver and vehicle assignment are the
 * only thing standing between two simultaneous dispatchers and the same
 * driver on two trips. When one of them loses that race it gets a sentence,
 * not a Postgres error string.
 */
async function writeWithConstraintMessages<T>(write: () => Promise<T>): Promise<T> {
  try {
    return await write()
  } catch (error) {
    if (isUniqueViolation(error, 'bookings_driver_live_unique')) {
      throw conflict('That driver was just put on another trip. Pick someone else.', 'driver_busy')
    }
    if (isUniqueViolation(error, 'bookings_vehicle_live_unique')) {
      throw conflict('That vehicle was just put on another trip. Pick another.', 'vehicle_busy')
    }
    throw error
  }
}
