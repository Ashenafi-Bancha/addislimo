import type { Queryable } from '../../db/pool.ts'
import { pool, query } from '../../db/pool.ts'
import type { Booking, BookingEvent, BookingStatus } from '../../types/index.ts'
import { LIVE_STATUSES } from './status.ts'

/**
 * Every statement that touches `bookings`.
 *
 * The service layer above decides what is allowed; this decides how it is
 * written down. Keeping the SQL here means the column list exists once, so a
 * new column is added in one place rather than in the six queries that would
 * otherwise each select their own idea of a booking.
 */

export interface BookingRow {
  id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  service_id: string
  pickup: string
  destination: string
  scheduled_at: Date
  passengers: number
  luggage: number
  vehicle_class: string | null
  partner_id: string | null
  driver_id: string | null
  vehicle_id: string | null
  amount: number
  commission: number
  commission_rate: number
  status: BookingStatus
  notes: string
  source: Booking['source']
  cancelled_reason: string | null
  created_at: Date
  updated_at: Date
  completed_at: Date | null
}

const COLUMNS = `
  id, customer_name, customer_email, customer_phone, service_id, pickup, destination,
  scheduled_at, passengers, luggage, vehicle_class, partner_id, driver_id, vehicle_id,
  amount, commission, commission_rate, status, notes, source, cancelled_reason,
  created_at, updated_at, completed_at
`

export function toBooking(row: BookingRow): Booking {
  return {
    id: row.id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    serviceId: row.service_id,
    pickup: row.pickup,
    destination: row.destination,
    scheduledAt: row.scheduled_at.toISOString(),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    completedAt: row.completed_at ? row.completed_at.toISOString() : null,
    passengers: row.passengers,
    luggage: row.luggage,
    vehicleClass: row.vehicle_class,
    partnerId: row.partner_id,
    driverId: row.driver_id,
    vehicleId: row.vehicle_id,
    amount: Number(row.amount),
    commission: Number(row.commission),
    commissionRate: Number(row.commission_rate),
    status: row.status,
    notes: row.notes,
    source: row.source,
    cancelledReason: row.cancelled_reason,
  }
}

export interface BookingFilters {
  status?: BookingStatus | undefined
  from?: Date | undefined
  to?: Date | undefined
  /** Matches the reference, the customer, or either end of the route. */
  q?: string | undefined
  partnerId?: string | undefined
  driverId?: string | undefined
  customerEmail?: string | undefined
  limit?: number | undefined
  offset?: number | undefined
}

/**
 * Builds the WHERE clause shared by `list` and `count`, so a filtered page and
 * its total can never disagree about what was being filtered.
 */
function where(filters: BookingFilters): { sql: string; params: unknown[] } {
  const clauses: string[] = []
  const params: unknown[] = []
  const add = (clause: string, value: unknown) => {
    params.push(value)
    clauses.push(clause.replace('$?', `$${params.length}`))
  }

  if (filters.status) add('status = $?', filters.status)
  if (filters.from) add('scheduled_at >= $?', filters.from)
  if (filters.to) add('scheduled_at < $?', filters.to)
  if (filters.partnerId) add('partner_id = $?', filters.partnerId)
  if (filters.driverId) add('driver_id = $?', filters.driverId)
  if (filters.customerEmail) add('lower(customer_email) = lower($?)', filters.customerEmail)

  if (filters.q) {
    // One search box over the four things a dispatcher actually knows: the
    // reference the customer quoted, their name, their email, or the route.
    params.push(`%${filters.q.trim()}%`)
    const p = `$${params.length}`
    clauses.push(
      `(id ILIKE ${p} OR customer_name ILIKE ${p} OR customer_email ILIKE ${p}
        OR pickup ILIKE ${p} OR destination ILIKE ${p})`,
    )
  }

  return { sql: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params }
}

export async function list(filters: BookingFilters = {}): Promise<Booking[]> {
  const { sql, params } = where(filters)
  const limit = filters.limit ?? 500
  const offset = filters.offset ?? 0
  const result = await query<BookingRow>(
    `SELECT ${COLUMNS} FROM bookings ${sql}
      ORDER BY scheduled_at DESC, created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset],
  )
  return result.rows.map(toBooking)
}

export async function count(filters: BookingFilters = {}): Promise<number> {
  const { sql, params } = where(filters)
  const result = await query<{ total: number }>(
    `SELECT count(*)::bigint AS total FROM bookings ${sql}`,
    params,
  )
  return Number(result.rows[0]?.total ?? 0)
}

export async function byId(id: string, client: Queryable = pool): Promise<Booking | null> {
  const result = await client.query<BookingRow>(
    `SELECT ${COLUMNS} FROM bookings WHERE id = $1`,
    [id],
  )
  const row = result.rows[0]
  return row ? toBooking(row) : null
}

/** Locks the row for the life of the transaction, for read-modify-write. */
export async function byIdForUpdate(id: string, client: Queryable): Promise<Booking | null> {
  const result = await client.query<BookingRow>(
    `SELECT ${COLUMNS} FROM bookings WHERE id = $1 FOR UPDATE`,
    [id],
  )
  const row = result.rows[0]
  return row ? toBooking(row) : null
}

export interface NewBooking {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceId: string
  pickup: string
  destination: string
  scheduledAt: Date
  passengers: number
  luggage: number
  vehicleClass: string | null
  partnerId: string | null
  amount: number
  commission: number
  commissionRate: number
  status: BookingStatus
  notes: string
  source: Booking['source']
}

export async function insert(booking: NewBooking, client: Queryable = pool): Promise<Booking> {
  const result = await client.query<BookingRow>(
    `INSERT INTO bookings (
       id, customer_name, customer_email, customer_phone, service_id, pickup, destination,
       scheduled_at, passengers, luggage, vehicle_class, partner_id, amount, commission,
       commission_rate, status, notes, source
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
     RETURNING ${COLUMNS}`,
    [
      booking.id,
      booking.customerName,
      booking.customerEmail,
      booking.customerPhone,
      booking.serviceId,
      booking.pickup,
      booking.destination,
      booking.scheduledAt,
      booking.passengers,
      booking.luggage,
      booking.vehicleClass,
      booking.partnerId,
      booking.amount,
      booking.commission,
      booking.commissionRate,
      booking.status,
      booking.notes,
      booking.source,
    ],
  )
  return toBooking(result.rows[0]!)
}

/** Columns the service layer is allowed to write, mapped to their SQL names. */
const UPDATABLE = {
  customerName: 'customer_name',
  customerEmail: 'customer_email',
  customerPhone: 'customer_phone',
  serviceId: 'service_id',
  pickup: 'pickup',
  destination: 'destination',
  scheduledAt: 'scheduled_at',
  passengers: 'passengers',
  luggage: 'luggage',
  vehicleClass: 'vehicle_class',
  partnerId: 'partner_id',
  driverId: 'driver_id',
  vehicleId: 'vehicle_id',
  amount: 'amount',
  commission: 'commission',
  commissionRate: 'commission_rate',
  status: 'status',
  notes: 'notes',
  cancelledReason: 'cancelled_reason',
  completedAt: 'completed_at',
} as const

export type BookingPatch = Partial<{
  -readonly [K in keyof typeof UPDATABLE]: K extends 'scheduledAt' | 'completedAt'
    ? Date | null
    : Booking[K extends keyof Booking ? K : never]
}>

export async function update(
  id: string,
  patch: BookingPatch,
  client: Queryable = pool,
): Promise<Booking> {
  const sets: string[] = []
  const params: unknown[] = []

  for (const [key, column] of Object.entries(UPDATABLE)) {
    if (!(key in patch)) continue
    params.push((patch as Record<string, unknown>)[key])
    sets.push(`${column} = $${params.length}`)
  }

  if (sets.length === 0) {
    const existing = await byId(id, client)
    if (!existing) throw new Error(`Booking ${id} disappeared mid-update.`)
    return existing
  }

  sets.push('updated_at = now()')
  params.push(id)

  const result = await client.query<BookingRow>(
    `UPDATE bookings SET ${sets.join(', ')} WHERE id = $${params.length} RETURNING ${COLUMNS}`,
    params,
  )
  return toBooking(result.rows[0]!)
}

export async function remove(id: string, client: Queryable = pool): Promise<boolean> {
  const result = await client.query('DELETE FROM bookings WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

/** Deletes every booking a customer made. Returns how many went. */
export async function removeByCustomer(email: string, client: Queryable = pool): Promise<number> {
  const result = await client.query('DELETE FROM bookings WHERE lower(customer_email) = lower($1)', [
    email,
  ])
  return result.rowCount ?? 0
}

/* ── Live assignments ── */

/**
 * The drivers and vehicles busy on a trip right now. `selectors.ts` in the
 * console derives the same set client-side; the API sends it so every caller
 * gets the same answer.
 */
export async function liveAssignments(): Promise<{ drivers: Set<string>; vehicles: Set<string> }> {
  const result = await query<{ driver_id: string | null; vehicle_id: string | null }>(
    `SELECT driver_id, vehicle_id FROM bookings
      WHERE status = ANY($1::text[]) AND (driver_id IS NOT NULL OR vehicle_id IS NOT NULL)`,
    [LIVE_STATUSES],
  )
  const drivers = new Set<string>()
  const vehicles = new Set<string>()
  for (const row of result.rows) {
    if (row.driver_id) drivers.add(row.driver_id)
    if (row.vehicle_id) vehicles.add(row.vehicle_id)
  }
  return { drivers, vehicles }
}

/* ── Events ── */

export async function addEvent(
  event: {
    bookingId: string
    actor: string
    kind: BookingEvent['kind']
    fromStatus?: BookingStatus | null
    toStatus?: BookingStatus | null
    detail?: string
  },
  client: Queryable = pool,
): Promise<void> {
  await client.query(
    `INSERT INTO booking_events (booking_id, actor, kind, from_status, to_status, detail)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      event.bookingId,
      event.actor,
      event.kind,
      event.fromStatus ?? null,
      event.toStatus ?? null,
      event.detail ?? '',
    ],
  )
}

export async function eventsFor(bookingId: string): Promise<BookingEvent[]> {
  const result = await query<{
    id: number
    booking_id: string
    at: Date
    actor: string
    kind: BookingEvent['kind']
    from_status: BookingStatus | null
    to_status: BookingStatus | null
    detail: string
  }>(
    `SELECT id, booking_id, at, actor, kind, from_status, to_status, detail
       FROM booking_events WHERE booking_id = $1 ORDER BY at ASC, id ASC`,
    [bookingId],
  )
  return result.rows.map((row) => ({
    id: Number(row.id),
    bookingId: row.booking_id,
    at: row.at.toISOString(),
    actor: row.actor,
    kind: row.kind,
    fromStatus: row.from_status,
    toStatus: row.to_status,
    detail: row.detail,
  }))
}
