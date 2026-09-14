import { serviceOptions } from '@/features/booking/booking.data'
import type { Booking, BookingStatus, ServiceId } from '@/types'
import type {
  AdminState,
  Customer,
  Driver,
  DriverStatus,
  FleetPartner,
  FleetVehicle,
  VehicleStatus,
} from './types'

/**
 * Derived data for the admin console.
 *
 * Every figure the console displays is computed here from the store rather
 * than typed in, so the overview, finance and fleet views always agree with
 * each other and with any edit made in the booking drawer.
 */

const DAY = 24 * 60 * 60 * 1000

export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Statuses that count as earned revenue. Cancelled trips never do. */
export const REVENUE_STATUSES: ReadonlySet<BookingStatus> = new Set(['Completed'])

/** Trips that are happening right now — their driver and vehicle are busy. */
export const LIVE_STATUSES: ReadonlySet<BookingStatus> = new Set(['Driver En Route', 'In Progress'])

/** Everything still to be fulfilled. */
export const OPEN_STATUSES: ReadonlySet<BookingStatus> = new Set([
  'Pending',
  'Confirmed',
  'Assigned',
  'Driver En Route',
  'In Progress',
])

export const BOOKING_STATUSES: BookingStatus[] = [
  'Pending',
  'Confirmed',
  'Assigned',
  'Driver En Route',
  'In Progress',
  'Completed',
  'Cancelled',
]

const serviceLabels = new Map(serviceOptions.map((s) => [s.id, s.label]))

export function serviceLabel(id: ServiceId): string {
  return serviceLabels.get(id) ?? id
}

export function indexById<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map((item) => [item.id, item]))
}

/* ── Periods ── */

export interface PeriodTotals {
  revenue: number
  commission: number
  trips: number
}

/** Earned totals for completed trips scheduled in [from, to). */
export function totalsBetween(bookings: Booking[], from: Date, to: Date): PeriodTotals {
  let revenue = 0
  let commission = 0
  let trips = 0
  for (const b of bookings) {
    if (!REVENUE_STATUSES.has(b.status)) continue
    const t = new Date(b.scheduledAt).getTime()
    if (t < from.getTime() || t >= to.getTime()) continue
    revenue += b.amount
    commission += b.commission
    trips += 1
  }
  return { revenue, commission, trips }
}

/** The last `days` whole days including today, and the same span before it. */
export function comparisonWindows(days: number, now: Date = new Date()) {
  const end = new Date(startOfDay(now).getTime() + DAY)
  const start = new Date(end.getTime() - days * DAY)
  const prevStart = new Date(start.getTime() - days * DAY)
  return { current: [start, end] as const, previous: [prevStart, start] as const }
}

/** Percentage change, or `null` when there is nothing to compare against. */
export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

/* ── Chart ── */

export interface DailyRevenue {
  date: Date
  revenue: number
  trips: number
  isToday: boolean
}

/** Completed-trip revenue for each of the last `days` days, oldest first. */
export function dailyRevenue(bookings: Booking[], days: number, now: Date = new Date()): DailyRevenue[] {
  const today = startOfDay(now).getTime()
  const buckets: DailyRevenue[] = Array.from({ length: days }, (_, i) => ({
    date: new Date(today - (days - 1 - i) * DAY),
    revenue: 0,
    trips: 0,
    isToday: i === days - 1,
  }))
  for (const b of bookings) {
    if (!REVENUE_STATUSES.has(b.status)) continue
    const day = startOfDay(new Date(b.scheduledAt)).getTime()
    const index = days - 1 - Math.round((today - day) / DAY)
    if (index < 0 || index >= days) continue
    buckets[index].revenue += b.amount
    buckets[index].trips += 1
  }
  return buckets
}

/* ── Bookings ── */

export function isToday(iso: string, now: Date = new Date()): boolean {
  return startOfDay(new Date(iso)).getTime() === startOfDay(now).getTime()
}

/** Open bookings that need a human: unconfirmed, or confirmed without a driver. */
export function needsAttention(bookings: Booking[]): Booking[] {
  return bookings
    .filter((b) => b.status === 'Pending' || (b.status === 'Confirmed' && !b.driverId))
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
}

export function countByStatus(bookings: Booking[]): Record<BookingStatus, number> {
  const counts = Object.fromEntries(BOOKING_STATUSES.map((s) => [s, 0])) as Record<BookingStatus, number>
  for (const b of bookings) counts[b.status] += 1
  return counts
}

/* ── Fleet ── */

function busyIds(bookings: Booking[], key: 'driverId' | 'vehicleId'): Set<string> {
  const ids = new Set<string>()
  for (const b of bookings) {
    const id = b[key]
    if (id && LIVE_STATUSES.has(b.status)) ids.add(id)
  }
  return ids
}

/** A driver is "On Trip" when a live booking says so, whatever their stored status. */
export function driverStatuses(state: AdminState): Map<string, DriverStatus> {
  const busy = busyIds(state.bookings, 'driverId')
  return new Map(state.drivers.map((d) => [d.id, busy.has(d.id) ? 'On Trip' : d.status]))
}

export function vehicleStatuses(state: AdminState): Map<string, VehicleStatus> {
  const busy = busyIds(state.bookings, 'vehicleId')
  return new Map(state.vehicles.map((v) => [v.id, busy.has(v.id) ? 'On Trip' : v.status]))
}

export function vehicleLabel(v: FleetVehicle): string {
  return `${v.make} ${v.model}`
}

/* ── Partners ── */

export interface PartnerPerformance {
  partner: FleetPartner
  drivers: Driver[]
  vehicles: FleetVehicle[]
  trips: number
  revenue: number
  commission: number
}

export function partnerPerformance(state: AdminState, from?: Date, to?: Date): PartnerPerformance[] {
  return state.partners.map((partner) => {
    let trips = 0
    let revenue = 0
    let commission = 0
    for (const b of state.bookings) {
      if (b.partnerId !== partner.id || !REVENUE_STATUSES.has(b.status)) continue
      const t = new Date(b.scheduledAt).getTime()
      if (from && t < from.getTime()) continue
      if (to && t >= to.getTime()) continue
      trips += 1
      revenue += b.amount
      commission += b.commission
    }
    return {
      partner,
      drivers: state.drivers.filter((d) => d.partnerId === partner.id),
      vehicles: state.vehicles.filter((v) => v.partnerId === partner.id),
      trips,
      revenue,
      commission,
    }
  })
}

/* ── Customers ── */

export function deriveCustomers(bookings: Booking[]): Customer[] {
  const groups = new Map<string, Booking[]>()
  for (const b of bookings) {
    const key = b.customerEmail.toLowerCase()
    const list = groups.get(key)
    if (list) list.push(b)
    else groups.set(key, [b])
  }

  return [...groups.values()].map((list) => {
    const sorted = [...list].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
    const completed = sorted.filter((b) => REVENUE_STATUSES.has(b.status))
    const serviceCounts = new Map<ServiceId, number>()
    for (const b of sorted) serviceCounts.set(b.serviceId, (serviceCounts.get(b.serviceId) ?? 0) + 1)
    const topService = [...serviceCounts.entries()].sort((a, b) => b[1] - a[1])[0][0]
    const latest = sorted[sorted.length - 1]

    return {
      email: latest.customerEmail,
      name: latest.customerName,
      phone: latest.customerPhone,
      trips: sorted.length,
      completedTrips: completed.length,
      totalSpend: completed.reduce((sum, b) => sum + b.amount, 0),
      firstBookedAt: [...sorted].sort((a, b) => a.createdAt.localeCompare(b.createdAt))[0].createdAt,
      lastTripAt: latest.scheduledAt,
      topService,
    }
  })
}
