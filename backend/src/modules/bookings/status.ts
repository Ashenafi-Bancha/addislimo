import { conflict } from '../../lib/errors.ts'
import type { BookingStatus } from '../../types/index.ts'

/**
 * What a booking is allowed to do next.
 *
 * The admin console offers a status dropdown; without this, a trip could go
 * from Pending straight to Completed and collect revenue for a journey nobody
 * drove, or come back from Cancelled a week later. The sets here are the same
 * ones `frontend/src/features/admin/selectors.ts` groups by, so the two agree
 * on what "open", "live" and "earned" mean.
 */

/**
 * Kept as a literal tuple rather than `readonly BookingStatus[]`: the route
 * schemas build `z.enum` from it, and a widened `string[]` would validate
 * every status as plain text and hand the service layer an unchecked value.
 */
export const BOOKING_STATUSES = [
  'Pending',
  'Confirmed',
  'Assigned',
  'Driver En Route',
  'In Progress',
  'Completed',
  'Cancelled',
] as const satisfies readonly BookingStatus[]

/** Counts as earned revenue. A cancelled trip never does. */
export const REVENUE_STATUSES: readonly BookingStatus[] = ['Completed']

/** Happening now: the driver and vehicle are busy. */
export const LIVE_STATUSES: readonly BookingStatus[] = ['Driver En Route', 'In Progress']

/** Still to be fulfilled. */
export const OPEN_STATUSES: readonly BookingStatus[] = [
  'Pending',
  'Confirmed',
  'Assigned',
  'Driver En Route',
  'In Progress',
]

const TRANSITIONS: Record<BookingStatus, readonly BookingStatus[]> = {
  Pending: ['Confirmed', 'Cancelled'],
  Confirmed: ['Assigned', 'Cancelled'],
  Assigned: ['Driver En Route', 'Confirmed', 'Cancelled'],
  'Driver En Route': ['In Progress', 'Assigned', 'Cancelled'],
  'In Progress': ['Completed', 'Cancelled'],
  // Terminal. Revenue has been counted, or deliberately not counted; moving
  // out of either would rewrite a closed period's figures.
  Completed: [],
  Cancelled: [],
}

/** Dispatch must have given the trip to someone before it can move on. */
const REQUIRES_PARTNER: readonly BookingStatus[] = [
  'Assigned',
  'Driver En Route',
  'In Progress',
  'Completed',
]

/** Nobody is driving unless a driver is assigned. */
const REQUIRES_DRIVER: readonly BookingStatus[] = ['Driver En Route', 'In Progress', 'Completed']

export const isLive = (status: BookingStatus): boolean => LIVE_STATUSES.includes(status)
export const isOpen = (status: BookingStatus): boolean => OPEN_STATUSES.includes(status)
export const isEarned = (status: BookingStatus): boolean => REVENUE_STATUSES.includes(status)

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
  return from === to || (TRANSITIONS[from]?.includes(to) ?? false)
}

export function nextStatuses(from: BookingStatus): BookingStatus[] {
  return [...(TRANSITIONS[from] ?? [])]
}

/**
 * Throws unless the move is legal and the booking is equipped for where it is
 * going. The message names the way out, because the person reading it is a
 * dispatcher mid-shift, not a developer.
 */
export function assertTransition(
  from: BookingStatus,
  to: BookingStatus,
  booking: { partnerId: string | null; driverId: string | null },
): void {
  if (from === to) return

  if (!canTransition(from, to)) {
    const allowed = nextStatuses(from)
    throw conflict(
      allowed.length === 0
        ? `This booking is ${from.toLowerCase()} and cannot change status again.`
        : `A ${from.toLowerCase()} booking cannot go straight to ${to.toLowerCase()}. It can become: ${allowed.join(', ')}.`,
      'invalid_transition',
    )
  }

  if (REQUIRES_PARTNER.includes(to) && !booking.partnerId) {
    throw conflict(
      `Give this trip to a partner before marking it ${to.toLowerCase()}.`,
      'partner_required',
    )
  }

  if (REQUIRES_DRIVER.includes(to) && !booking.driverId) {
    throw conflict(`Assign a driver before marking this trip ${to.toLowerCase()}.`, 'driver_required')
  }
}
