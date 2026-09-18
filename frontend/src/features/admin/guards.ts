import type { Booking } from '@/types'
import { LIVE_STATUSES, OPEN_STATUSES } from './selectors'
import type { AdminState } from './types'

/**
 * What deleting a record would break, checked before the admin is asked to
 * confirm.
 *
 * The rule throughout: history stays intact. A partner with trips behind
 * them carries finance history (commission, payouts), so they are suspended,
 * never deleted. A driver or vehicle can go once no open trip still needs
 * them; completed trips keep their reference and show "Removed driver".
 */

export interface DeleteCheck {
  allowed: boolean
  /** Why it is blocked, when it is. */
  reason?: string
  /** What else goes with it, listed in the confirmation. */
  consequences: string[]
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`

const refs = (bookings: Booking[]) => bookings.slice(0, 3).map((b) => b.id).join(', ') + (bookings.length > 3 ? '…' : '')

export function checkPartnerDelete(state: AdminState, partnerId: string): DeleteCheck {
  const trips = state.bookings.filter((b) => b.partnerId === partnerId)
  if (trips.length > 0) {
    return {
      allowed: false,
      reason: `This partner has ${plural(trips.length, 'booking')} on record, and deleting them would erase commission and payout history. Suspend the partner instead: they stop receiving trips and their history stays.`,
      consequences: [],
    }
  }
  const drivers = state.drivers.filter((d) => d.partnerId === partnerId).length
  const vehicles = state.vehicles.filter((v) => v.partnerId === partnerId).length
  const consequences = []
  if (vehicles) consequences.push(`Their ${plural(vehicles, 'vehicle')} will be deleted too.`)
  if (drivers) consequences.push(`Their ${plural(drivers, 'driver')} will be deleted too.`)
  return { allowed: true, consequences }
}

function checkAssignee(state: AdminState, key: 'driverId' | 'vehicleId', id: string, noun: string): DeleteCheck {
  const open = state.bookings.filter((b) => b[key] === id && OPEN_STATUSES.has(b.status))
  if (open.length > 0) {
    return {
      allowed: false,
      reason: `This ${noun} is assigned to ${plural(open.length, 'open booking')} (${refs(open)}). Reassign ${open.length === 1 ? 'it' : 'them'} first, then delete.`,
      consequences: [],
    }
  }
  const past = state.bookings.filter((b) => b[key] === id).length
  return {
    allowed: true,
    consequences: past ? [`${plural(past, 'past booking')} will show "Removed ${noun}".`] : [],
  }
}

export const checkDriverDelete = (state: AdminState, id: string) => checkAssignee(state, 'driverId', id, 'driver')

export const checkVehicleDelete = (state: AdminState, id: string) => checkAssignee(state, 'vehicleId', id, 'vehicle')

export function checkBookingDelete(state: AdminState, id: string): DeleteCheck {
  const booking = state.bookings.find((b) => b.id === id)
  if (booking && LIVE_STATUSES.has(booking.status)) {
    return {
      allowed: false,
      reason: 'This trip is under way. Finish or cancel it before deleting the record.',
      consequences: [],
    }
  }
  return {
    allowed: true,
    consequences: booking?.status === 'Completed' ? ['Its revenue and commission leave the finance figures.'] : [],
  }
}

export function checkCustomerDelete(state: AdminState, email: string): DeleteCheck {
  const key = email.toLowerCase()
  const theirs = state.bookings.filter((b) => b.customerEmail.toLowerCase() === key)
  const live = theirs.filter((b) => LIVE_STATUSES.has(b.status))
  if (live.length > 0) {
    return {
      allowed: false,
      reason: `This customer is on a trip right now (${refs(live)}). Delete them once it has finished.`,
      consequences: [],
    }
  }
  const completed = theirs.filter((b) => b.status === 'Completed').length
  const consequences = [`All ${plural(theirs.length, 'booking')} for this customer will be deleted.`]
  if (completed) consequences.push(`Revenue from ${plural(completed, 'completed trip')} leaves the finance figures.`)
  return { allowed: true, consequences }
}

/** A short unique id for records created in the console, e.g. `d-k3x9q2`. */
export function newId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}
