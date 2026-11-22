import { useSyncExternalStore } from 'react'
import { isApiConfigured } from '@/config/env'
import { ApiError } from '@/lib/api'
import type { Booking } from '@/types'
import * as remote from './api'
import { createSeedState } from './data'
import type { AdminSettings, AdminState, Driver, FleetPartner, FleetVehicle, PartnerStatus } from './types'

/**
 * The admin console's data store.
 *
 * A module-level store read through `useSyncExternalStore`, so every view
 * shares one copy and an edit made in the booking drawer shows up immediately
 * in the overview, the fleet view and finance. It lives outside React on
 * purpose: switching admin sections must not throw edits away.
 *
 * Where the data comes from depends on the build. With `VITE_API_URL` set it
 * starts empty, `refresh()` fills it from the API, and every action writes
 * through to the server. Without one it starts from seed data and changes
 * last for the browser session, which is what the deployed site does until
 * the backend is live.
 *
 * Writes are optimistic: the screen changes at once, the request goes, and if
 * the server refuses the state goes back exactly as it was and the refusal is
 * shown as a toast. That is why `guards.ts` still runs in the views — it
 * stops a doomed request being made at all — while the server has the last
 * word on anything the browser could not know, like a driver another
 * dispatcher claimed a second ago.
 *
 * Every action keeps the signature it had when this was in-memory only, so
 * no view had to change.
 */

/** Insert, or replace the item with the same id. */
function upsert<T extends { id: string }>(list: T[], item: T): T[] {
  return list.some((x) => x.id === item.id) ? list.map((x) => (x.id === item.id ? item : x)) : [...list, item]
}

/** Replace the item with `id`, which a create renames to the server's id. */
function replaceId<T extends { id: string }>(list: T[], id: string, item: T): T[] {
  return list.some((x) => x.id === id) ? list.map((x) => (x.id === id ? item : x)) : [...list, item]
}

const sameEmail = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()

function emptyState(): AdminState {
  return {
    bookings: [],
    partners: [],
    drivers: [],
    vehicles: [],
    settings: {
      defaultCommissionRate: 12,
      notifyNewBooking: true,
      notifyCancellation: true,
      dailySummary: false,
    },
    bookingQuery: '',
    openBookingId: null,
  }
}

let state: AdminState = isApiConfigured ? emptyState() : createSeedState()
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

/* ── Loading ── */

let hydrated = !isApiConfigured
let loading = false
const loadListeners = new Set<() => void>()

function setLoading(next: boolean) {
  loading = next
  loadListeners.forEach((listener) => listener())
}

/** Whether the first load has finished, so a view can tell empty from not-yet. */
export function useAdminLoading(): { loading: boolean; hydrated: boolean } {
  return useSyncExternalStore(
    (listener) => {
      loadListeners.add(listener)
      return () => loadListeners.delete(listener)
    },
    () => loadSnapshot(),
    () => loadSnapshot(),
  )
}

let snapshot = { loading: false, hydrated: !isApiConfigured }
function loadSnapshot() {
  if (snapshot.loading !== loading || snapshot.hydrated !== hydrated) {
    snapshot = { loading, hydrated }
  }
  return snapshot
}

/** The message to show for a failed call: the server's words where it gave any. */
function reason(error: unknown): string {
  if (error instanceof ApiError) return error.message
  return 'Could not reach the server. Check your connection and try again.'
}

/**
 * Runs a write against the server and puts the state back if it is refused.
 * `optimistic` has already been applied when this is called.
 */
function writeThrough(
  before: AdminState,
  work: () => Promise<void>,
): void {
  if (!isApiConfigured) return
  work().catch((error: unknown) => {
    setState(before)
    notify(reason(error), 'critical')
  })
}

export const adminActions = {
  /** Loads everything from the API. Safe to call again; the console does on open. */
  async refresh(): Promise<void> {
    if (!isApiConfigured) return
    setLoading(true)
    try {
      const data = await remote.fetchEverything()
      setState({
        ...state,
        bookings: data.bookings,
        partners: data.partners,
        drivers: data.drivers,
        vehicles: data.vehicles,
        settings: data.settings,
      })
      hydrated = true
    } catch (error) {
      notify(reason(error), 'critical')
    } finally {
      setLoading(false)
    }
  },

  /** Re-reads bookings only, after a change that rewrote several of them. */
  async refreshBookings(): Promise<void> {
    if (!isApiConfigured) return
    try {
      setState({ ...state, bookings: await remote.fetchBookings() })
    } catch (error) {
      notify(reason(error), 'critical')
    }
  },

  updateBooking(id: string, patch: Partial<Booking>) {
    const before = state
    setState({
      ...state,
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    })
    writeThrough(before, async () => {
      const saved = await remote.updateBooking(id, patch)
      // The server recomputes commission and stamps completion, so the row it
      // returns is the truth, not the one guessed here.
      setState({ ...state, bookings: state.bookings.map((b) => (b.id === id ? saved : b)) })
    })
  },

  deleteBooking(id: string) {
    const before = state
    setState({
      ...state,
      bookings: state.bookings.filter((b) => b.id !== id),
      openBookingId: state.openBookingId === id ? null : state.openBookingId,
    })
    writeThrough(before, () => remote.deleteBooking(id))
  },

  savePartner(partner: FleetPartner) {
    const before = state
    const isNew = !state.partners.some((p) => p.id === partner.id)
    setState({ ...state, partners: upsert(state.partners, partner) })
    writeThrough(before, async () => {
      const saved = await remote.savePartner(partner, isNew)
      setState({ ...state, partners: replaceId(state.partners, partner.id, saved) })
    })
  },

  /** Removes the partner with their drivers and vehicles. */
  deletePartner(id: string) {
    const before = state
    setState({
      ...state,
      partners: state.partners.filter((p) => p.id !== id),
      drivers: state.drivers.filter((d) => d.partnerId !== id),
      vehicles: state.vehicles.filter((v) => v.partnerId !== id),
    })
    writeThrough(before, () => remote.deletePartner(id))
  },

  saveDriver(driver: Driver) {
    const before = state
    const isNew = !state.drivers.some((d) => d.id === driver.id)
    setState({ ...state, drivers: upsert(state.drivers, driver) })
    writeThrough(before, async () => {
      const saved = await remote.saveDriver(driver, isNew)
      setState({ ...state, drivers: replaceId(state.drivers, driver.id, saved) })
    })
  },

  deleteDriver(id: string) {
    const before = state
    setState({ ...state, drivers: state.drivers.filter((d) => d.id !== id) })
    writeThrough(before, () => remote.deleteDriver(id))
  },

  saveVehicle(vehicle: FleetVehicle) {
    const before = state
    const isNew = !state.vehicles.some((v) => v.id === vehicle.id)
    setState({ ...state, vehicles: upsert(state.vehicles, vehicle) })
    writeThrough(before, async () => {
      const saved = await remote.saveVehicle(vehicle, isNew)
      setState({ ...state, vehicles: replaceId(state.vehicles, vehicle.id, saved) })
    })
  },

  deleteVehicle(id: string) {
    const before = state
    setState({ ...state, vehicles: state.vehicles.filter((v) => v.id !== id) })
    writeThrough(before, () => remote.deleteVehicle(id))
  },

  /**
   * Customers are derived from bookings, so editing one rewrites the contact
   * details on every booking they made.
   */
  updateCustomer(email: string, patch: { customerName: string; customerEmail: string; customerPhone: string }) {
    const before = state
    setState({
      ...state,
      bookings: state.bookings.map((b) => (sameEmail(b.customerEmail, email) ? { ...b, ...patch } : b)),
      bookingQuery: sameEmail(state.bookingQuery, email) ? patch.customerEmail : state.bookingQuery,
    })
    writeThrough(before, () => remote.updateCustomer(email, patch).then(() => undefined))
  },

  /** Deletes every booking the customer made, which is what removes them. */
  deleteCustomer(email: string) {
    const before = state
    const doomed = new Set(state.bookings.filter((b) => sameEmail(b.customerEmail, email)).map((b) => b.id))
    setState({
      ...state,
      bookings: state.bookings.filter((b) => !doomed.has(b.id)),
      openBookingId: state.openBookingId && doomed.has(state.openBookingId) ? null : state.openBookingId,
      bookingQuery: sameEmail(state.bookingQuery, email) ? '' : state.bookingQuery,
    })
    writeThrough(before, () => remote.deleteCustomer(email).then(() => undefined))
  },

  setPartnerStatus(id: string, status: PartnerStatus) {
    const before = state
    setState({
      ...state,
      partners: state.partners.map((p) => (p.id === id ? { ...p, status } : p)),
    })
    writeThrough(before, async () => {
      const saved = await remote.setPartnerStatus(id, status)
      setState({ ...state, partners: state.partners.map((p) => (p.id === id ? saved : p)) })
    })
  },

  updateSettings(patch: Partial<AdminSettings>) {
    const before = state
    setState({ ...state, settings: { ...state.settings, ...patch } })
    writeThrough(before, async () => {
      const saved = await remote.updateSettings(patch)
      setState({ ...state, settings: saved })
    })
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

  /** Clears everything on sign-out, so the next admin starts from the server. */
  reset() {
    hydrated = !isApiConfigured
    setState(isApiConfigured ? emptyState() : createSeedState())
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
  // A refusal is worth reading twice; a confirmation is not.
  window.setTimeout(() => dismissToast(id), tone === 'critical' ? 6000 : 3200)
}

export function dismissToast(id: number) {
  emitToasts(toasts.filter((t) => t.id !== id))
}
