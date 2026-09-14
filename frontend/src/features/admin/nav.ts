import type { AdminConsolePage } from '@/app/routes'
import type { AdminSection } from './types'
import type { IconName } from './ui/Icon'

/**
 * The console's navigation.
 *
 * Only sections that work are listed. The previous console advertised
 * fourteen items of which four did anything; a sidebar full of dead links
 * erodes trust in the rest of the tool faster than a short one does.
 */

export interface AdminNavItem {
  section: AdminSection
  page: AdminConsolePage
  label: string
  icon: IconName
}

export interface AdminNavGroup {
  label: string
  items: AdminNavItem[]
}

export const adminNav: AdminNavGroup[] = [
  {
    label: 'Operations',
    items: [
      { section: 'overview', page: 'admin', label: 'Overview', icon: 'overview' },
      { section: 'bookings', page: 'admin-bookings', label: 'Bookings', icon: 'bookings' },
    ],
  },
  {
    label: 'Network',
    items: [
      { section: 'partners', page: 'admin-partners', label: 'Partners', icon: 'partners' },
      { section: 'fleet', page: 'admin-fleet', label: 'Fleet & Drivers', icon: 'fleet' },
      { section: 'customers', page: 'admin-customers', label: 'Customers', icon: 'customers' },
    ],
  },
  {
    label: 'Business',
    items: [
      { section: 'finance', page: 'admin-finance', label: 'Finance', icon: 'finance' },
      { section: 'settings', page: 'admin-settings', label: 'Settings', icon: 'settings' },
    ],
  },
]

const allItems = adminNav.flatMap((g) => g.items)

export const sectionForPage = (page: AdminConsolePage): AdminNavItem =>
  allItems.find((item) => item.page === page) ?? allItems[0]

export const pageForSection = (section: AdminSection): AdminConsolePage =>
  (allItems.find((item) => item.section === section) ?? allItems[0]).page
