import { useSyncExternalStore } from 'react'
import type { Booking } from '@/types'
import { createSeedState } from './data'
import type { AdminSettings, AdminState, Driver, FleetPartner, FleetVehicle, PartnerStatus } from './types'

/**
 * The admin console's data store.
 *
 * A module-level store read through `useSyncExternalStore`, so every view
 * shares one copy of the data and an edit made in the booking drawer shows up
 * immediately in the overview, the fleet view and finance. It lives outside
 * React on purpose: switching admin sections must not throw edits away.
 *
 * Each action is the seam where an API call will go. `updateBooking` becomes
 * `PATCH /bookings/:id`, `setPartnerStatus` becomes `PATCH /partners/:id` —
 * see `lib/api/endpoints.ts`. Until then changes last for the browser session.
 *
 * Deletes do not check whether they are safe; `guards.ts` does that, and the
 * views ask it before offering the confirm button.
 */

/** Insert, or replace the item with the same id. */
function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  return list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item]
}

const sameEmail = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

let state: AdminState = createSeedState()
const listeners = new Set<() => void>()

function setState(next: AdminState) {
  state = next
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * Read the whole store. The returned object is replaced, never mutated, so
 * derive filtered or grouped data with `useMemo` keyed on it.
 */
export function useAdminStore(): AdminState {
  return useSyncExternalStore(subscribe, () => state, () => state)
}

export const adminActions = {
  updateBooking(id: string, patch: Partial<Booking>) {
    setState({
      ...state,
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    })
  },

  deleteBooking(id: string) {
    setState({
      ...state,
      bookings: state.bookings.filter((b) => b.id !== id),
      openBookingId: state.openBookingId === id ? null : state.openBookingId,
    })
  },

  savePartner(partner: FleetPartner) {
    setState({ ...state, partners: upsert(state.partners, partner) })
  },

  /** Removes the partner with their drivers and vehicles. */
  deletePartner(id: string) {
    setState({
      ...state,
      partners: state.partners.filter((p) => p.id !== id),
      drivers: state.drivers.filter((d) => d.partnerId !== id),
      vehicles: state.vehicles.filter((v) => v.partnerId !== id),
    })
  },

  saveDriver(driver: Driver) {
    setState({ ...state, drivers: upsert(state.drivers, driver) })
  },

  deleteDriver(id: string) {
    setState({ ...state, drivers: state.drivers.filter((d) => d.id !== id) })
  },

  saveVehicle(vehicle: FleetVehicle) {
    setState({ ...state, vehicles: upsert(state.vehicles, vehicle) })
  },

  deleteVehicle(id: string) {
    setState({ ...state, vehicles: state.vehicles.filter((v) => v.id !== id) })
  },

  /**
   * Customers are derived from bookings, so editing one rewrites the contact
   * details on every booking they made.
   */
  updateCustomer(email: string, patch: { customerName: string; customerEmail: string; customerPhone: string }) {
    setState({
      ...state,
      bookings: state.bookings.map((b) => (sameEmail(b.customerEmail, email) ? { ...b, ...patch } : b)),
      bookingQuery: sameEmail(state.bookingQuery, email) ? patch.customerEmail : state.bookingQuery,
    })
  },

  /** Deletes every booking the customer made, which is what removes them. */
  deleteCustomer(email: string) {
    const doomed = new Set(state.bookings.filter((b) => sameEmail(b.customerEmail, email)).map((b) => b.id))
    setState({
      ...state,
      bookings: state.bookings.filter((b) => !doomed.has(b.id)),
      openBookingId: state.openBookingId && doomed.has(state.openBookingId) ? null : state.openBookingId,
      bookingQuery: sameEmail(state.bookingQuery, email) ? '' : state.bookingQuery,
    })
  },

  setPartnerStatus(id: string, status: PartnerStatus) {
    setState({
      ...state,
      partners: state.partners.map((p) => (p.id === id ? { ...p, status } : p)),
    })
  },

  updateSettings(patch: Partial<AdminSettings>) {
    setState({ ...state, settings: { ...state.settings, ...patch } })
  },

  setBookingQuery(bookingQuery: string) {
    if (bookingQuery === state.bookingQuery) return
    setState({ ...state, bookingQuery })
  },

  openBooking(id: string) {
    setState({ ...state, openBookingId: id })
  },

  closeBooking() {
    if (state.openBookingId === null) return
    setState({ ...state, openBookingId: null })
  },
}

/* ── Toasts ── */

export interface Toast {
  id: number
  message: string
  tone: 'neutral' | 'good' | 'critical'
}

let toasts: Toast[] = []
const toastListeners = new Set<() => void>()
let nextToastId = 1

function emitToasts(next: Toast[]) {
  toasts = next
  toastListeners.forEach((listener) => listener())
}

export function useToasts(): Toast[] {
  return useSyncExternalStore(
    (listener) => {
      toastListeners.add(listener)
      return () => toastListeners.delete(listener)
    },
    () => toasts,
    () => toasts,
  )
}

/** Show a short confirmation that disappears on its own. */
export function notify(message: string, tone: Toast['tone'] = 'neutral') {
  const id = nextToastId++
  emitToasts([...toasts, { id, message, tone }])
  window.setTimeout(() => dismissToast(id), 3200)
}

export function dismissToast(id: number) {
  emitToasts(toasts.filter((t) => t.id !== id))
}
