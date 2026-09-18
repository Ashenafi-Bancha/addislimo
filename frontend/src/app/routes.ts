/**
 * Single source of truth for every page in the app.
 *
 * Adding a page is a three-step change:
 *   1. add an entry here,
 *   2. add the component to the `pageComponents` map in `src/app/App.tsx`,
 *   3. (optional) list it in `mainNav` / `footerNav` in `src/config/site.ts`.
 */

export const routes = {
  home: { path: '/', title: 'Home', chrome: 'site' },
  services: { path: '/services', title: 'Services', chrome: 'site' },
  airport: { path: '/airport-transfer', title: 'Airport Transfer', chrome: 'site' },
  explore: { path: '/explore-addis', title: 'Explore Addis', chrome: 'site' },
  corporate: { path: '/corporate', title: 'Corporate', chrome: 'site' },
  booking: { path: '/booking', title: 'Book a Ride', chrome: 'site' },
  about: { path: '/about', title: 'About Us', chrome: 'site' },
  contact: { path: '/contact', title: 'Contact', chrome: 'site' },
  confirmation: { path: '/booking/confirmed', title: 'Booking Confirmed', chrome: 'site' },
  'admin-login': { path: '/admin/login', title: 'Admin Sign In', chrome: 'bare' },
  // Admin console: one route per section, so the back button, refresh and
  // shared links all land on the right screen. All render AdminDashboard.
  admin: { path: '/admin', title: 'Admin · Overview', chrome: 'bare' },
  'admin-bookings': { path: '/admin/bookings', title: 'Admin · Bookings', chrome: 'bare' },
  'admin-partners': { path: '/admin/partners', title: 'Admin · Partners', chrome: 'bare' },
  'admin-fleet': { path: '/admin/fleet', title: 'Admin · Fleet', chrome: 'bare' },
  'admin-customers': { path: '/admin/customers', title: 'Admin · Customers', chrome: 'bare' },
  'admin-finance': { path: '/admin/finance', title: 'Admin · Finance', chrome: 'bare' },
  'admin-content': { path: '/admin/content', title: 'Admin · Website Content', chrome: 'bare' },
  'admin-settings': { path: '/admin/settings', title: 'Admin · Settings', chrome: 'bare' },
} as const satisfies Record<string, RouteDefinition>

export interface RouteDefinition {
  /** URL fragment this page lives at, e.g. `#/booking`. */
  path: string
  /** Used for the browser tab title. */
  title: string
  /**
   * `site` renders the public Nav + Footer around the page.
   * `bare` renders the page on its own (admin console, sign-in).
   */
  chrome: 'site' | 'bare'
}

/** Every valid page id — `'home' | 'services' | ...`. */
export type Page = keyof typeof routes

export const pageIds = Object.keys(routes) as Page[]

export const DEFAULT_PAGE: Page = 'home'

export function isPage(value: unknown): value is Page {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(routes, value)
}

/** `'booking'` -> `'#/booking'` */
export function hrefFor(page: Page): string {
  return `#${routes[page].path}`
}

/** `'#/booking'` -> `'booking'`, falling back to the home page. */
export function pageFromHash(hash: string): Page {
  const path = hash.replace(/^#/, '').replace(/\/+$/, '') || '/'
  const match = pageIds.find((id) => routes[id].path === path)
  return match ?? DEFAULT_PAGE
}

/** Every page that renders inside the signed-in admin console. */
export const adminConsolePages = [
  'admin',
  'admin-bookings',
  'admin-partners',
  'admin-fleet',
  'admin-customers',
  'admin-finance',
  'admin-content',
  'admin-settings',
] as const satisfies readonly Page[]

export type AdminConsolePage = (typeof adminConsolePages)[number]

export function isAdminConsolePage(page: Page): page is AdminConsolePage {
  return (adminConsolePages as readonly Page[]).includes(page)
}
