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
    /** `adminActions.deleteBooking`. */
    remove: (id: string) => `/bookings/${id}`,
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
    /** POST creates, PUT updates, DELETE removes. `adminActions.savePartner` / `deletePartner`. */
    create: '/partners',
  },
  drivers: {
    list: '/drivers',
    /** PUT updates, DELETE removes. */
    byId: (id: string) => `/drivers/${id}`,
    create: '/drivers',
  },
  vehicles: {
    list: '/vehicles',
    /** PUT updates, DELETE removes. */
    byId: (id: string) => `/vehicles/${id}`,
    create: '/vehicles',
  },
  customers: {
    /** Derived server-side by grouping bookings, as `deriveCustomers` does now. */
    list: '/customers',
    /** PATCH rewrites contact details on their bookings; DELETE removes them. */
    byEmail: (email: string) => `/customers/${encodeURIComponent(email)}`,
  },
  content: {
    /** Every edited content group, keyed as in `features/cms/content.ts`. Public. */
    all: '/content',
    /** Replace one group. Admin only. `contentActions.save`. */
    byKey: (key: string) => `/content/${key}`,
    /** Image upload for the content editor; returns `{ url }`. */
    upload: '/content/images',
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
