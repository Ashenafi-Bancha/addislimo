import type { Booking } from '@/types'

/**
 * Placeholder operations data for the admin console.
 *
 * Every export here is a stand-in for an API response — `bookings` for
 * `GET /bookings`, `metrics` for `GET /admin/metrics`. `statusColors` and
 * `navItems` are presentation config and will stay client-side.
 */

export const bookings: Booking[] = [
  { id: 'AL-XK9281', customer: 'James Mwangi', service: 'Airport Transfer', pickup: 'Bole Airport', dest: 'Sheraton Addis', date: '2026-08-18 14:30', partner: 'Elite Cars', vehicle: 'BMW 7 Series', driver: 'Tesfaye A.', amount: 3200, commission: 320, status: 'Confirmed' },
  { id: 'AL-PQ4472', customer: 'Sophie Laurent', service: 'Hourly Chauffeur', pickup: 'Hilton Hotel', dest: 'Multiple Stops', date: '2026-08-18 09:00', partner: 'Royal Fleet', vehicle: 'Mercedes E-Class', driver: 'Dawit M.', amount: 4800, commission: 480, status: 'In Progress' },
  { id: 'AL-RT8831', customer: 'Marcus Chen', service: 'Corporate Transfer', pickup: 'AU Headquarters', dest: 'UN ECA', date: '2026-08-18 11:00', partner: 'Diplomat Cars', vehicle: 'Toyota Land Cruiser', driver: 'Solomon K.', amount: 2500, commission: 250, status: 'Completed' },
  { id: 'AL-LM2219', customer: 'Almaz Bekele', service: 'City Tour', pickup: 'Radisson Blu', dest: 'Various Landmarks', date: '2026-08-19 08:00', partner: 'City Tours Co.', vehicle: 'Toyota Corolla', driver: 'Yohannes T.', amount: 5600, commission: 560, status: 'Pending' },
  { id: 'AL-VB6643', customer: 'Ahmed Hassan', service: 'Airport Transfer', pickup: 'Hyatt Regency', dest: 'Bole Airport', date: '2026-08-19 16:45', partner: 'Elite Cars', vehicle: 'Mercedes S-Class', driver: 'Bekele A.', amount: 3800, commission: 380, status: 'Assigned' },
  { id: 'AL-CW1157', customer: 'Sarah Thompson', service: 'Wedding Transport', pickup: 'Continental Hotel', dest: 'Ghion Hotel', date: '2026-08-20 10:00', partner: 'Events Fleet', vehicle: 'BMW 5 Series', driver: 'Girma S.', amount: 8200, commission: 820, status: 'Confirmed' },
]

export const statusColors: Record<string, string> = {
  'Pending': 'rgba(255,255,255,0.82)',
  'Confirmed': '#4CAF50',
  'Assigned': '#2196F3',
  'In Progress': '#9C27B0',
  'Completed': 'rgba(255,255,255,0.70)',
  'Cancelled': '#f44336',
  'Driver En Route': '#FF9800',
}

export const metrics = [
  { label: "Today's Bookings", value: '12', sub: '3 pending confirmation', trend: '+' },
  { label: 'Confirmed', value: '8', sub: 'Ready to dispatch', trend: '+' },
  { label: "Today's Revenue", value: 'ETB 42,800', sub: 'Gross booking value', trend: '+' },
  { label: 'Commission Today', value: 'ETB 4,280', sub: '10% average rate', trend: '+' },
  { label: 'Active Partners', value: '14', sub: '3 vehicles available', trend: '=' },
  { label: 'Completed Trips', value: '156', sub: 'This month', trend: '+' },
]

/** Sections of the admin console that are actually implemented. */
export type View = 'dashboard' | 'bookings' | 'partners' | 'commissions'

export const navItems: { id: View; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'partners', label: 'Partners' },
  { id: 'commissions', label: 'Commissions' },
]
