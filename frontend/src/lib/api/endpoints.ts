/**
 * The API surface the Express backend is expected to expose.
 *
 * Keeping the paths in one object means the day the backend lands, the only
 * thing to reconcile is this file — not a scatter of string literals. Nothing
 * calls these yet; the pages still read from `src/data` and the feature-level
 * `*.data.ts` mocks.
 */

export const endpoints = {
  bookings: {
    create: '/bookings',
    list: '/bookings',
    byId: (id: string) => `/bookings/${id}`,
    updateStatus: (id: string) => `/bookings/${id}/status`,
  },
  quotes: {
    estimate: '/quotes/estimate',
  },
  services: {
    list: '/services',
  },
  vehicles: {
    list: '/vehicles',
  },
  partners: {
    list: '/partners',
  },
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  admin: {
    metrics: '/admin/metrics',
    commissions: '/admin/commissions',
  },
} as const
