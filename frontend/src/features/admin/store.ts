import { useSyncExternalStore } from 'react'
import type { Booking } from '@/types'
import { createSeedState } from './data'
import type { AdminSettings, AdminState, PartnerStatus } from './types'

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
 */

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
