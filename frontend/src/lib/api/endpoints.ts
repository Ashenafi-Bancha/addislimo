/**
 * The API surface the Express backend is expected to expose.
 *
 * Keeping the paths in one object means the day the backend lands, the only
 * thing to reconcile is this file, not a scatter of string literals. Nothing
 * calls these yet: the public pages read from `src/data`, and the admin
 * console reads the in-memory store in `features/admin/store.ts`, whose
 * actions are named after the calls listed here.
 */

export const endpoints = {
  bookings: {
    create: '/bookings',
    /** Supports `?status=`, `?from=`, `?to=` and `?q=` to match the admin filters. */
    list: '/bookings',
    byId: (id: string) => `/bookings/${id}`,
    /** Status, driver, vehicle and notes. `adminActions.updateBooking`. */
    update: (id: string) => `/bookings/${id}`,
    updateStatus: (id: string) => `/bookings/${id}/status`,
  },
  quotes: {
    estimate: '/quotes/estimate',
  },
  services: {
    list: '/services',
  },
  partners: {
    list: '/partners',
    byId: (id: string) => `/partners/${id}`,
    /** Approve, suspend or reinstate. `adminActions.setPartnerStatus`. */
    updateStatus: (id: string) => `/partners/${id}/status`,
  },
  drivers: {
    list: '/drivers',
    byId: (id: string) => `/drivers/${id}`,
  },
  vehicles: {
    list: '/vehicles',
    byId: (id: string) => `/vehicles/${id}`,
  },
  customers: {
    /** Derived server-side by grouping bookings, as `deriveCustomers` does now. */
    list: '/customers',
  },
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  admin: {
    metrics: '/admin/metrics',
    /** Per-partner gross, commission and payout for a period. */
    payouts: '/admin/payouts',
    settings: '/admin/settings',
  },
} as const
