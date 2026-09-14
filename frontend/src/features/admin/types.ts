import type { Booking, VehicleClassId } from '@/types'

/**
 * Operations entities used only by the admin console.
 *
 * Named `Fleet*` because `Partner` and `Vehicle` in `src/types` already mean
 * the marketing concepts (partner logos, fleet showcase cards). These are the
 * businesses and cars that actually fulfil trips.
 */

export type PartnerStatus = 'Active' | 'Pending' | 'Suspended'

export interface FleetPartner {
  id: string
  name: string
  type: 'Transport Company' | 'Vehicle Owner' | 'Tour Operator' | 'Events Transport'
  contactName: string
  phone: string
  email: string
  /** Percentage Addis Limo keeps on this partner's trips. */
  commissionRate: number
  status: PartnerStatus
  /** Average customer rating, 0 when the partner has no trips yet. */
  rating: number
  joinedAt: string
}

export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty'

export interface Driver {
  id: string
  name: string
  phone: string
  partnerId: string
  licenceNo: string
  /** Stored availability. "On Trip" is derived from live bookings instead. */
  status: Exclude<DriverStatus, 'On Trip'>
  rating: number
}

export type VehicleStatus = 'Available' | 'On Trip' | 'Maintenance'

export interface FleetVehicle {
  id: string
  partnerId: string
  make: string
  model: string
  year: number
  plate: string
  vehicleClass: VehicleClassId
  seats: number
  /** Stored availability. "On Trip" is derived from live bookings instead. */
  status: Exclude<VehicleStatus, 'On Trip'>
}

/** A customer, derived by grouping bookings on email. */
export interface Customer {
  email: string
  name: string
  phone: string
  trips: number
  completedTrips: number
  totalSpend: number
  firstBookedAt: string
  lastTripAt: string
  topService: Booking['serviceId']
}

export interface AdminSettings {
  /**
   * The rate a newly approved partner starts on. Partners carry their own
   * negotiated `commissionRate`, and bookings keep the commission they were
   * priced at, so changing this rewrites nothing.
   */
  defaultCommissionRate: number
  notifyNewBooking: boolean
  notifyCancellation: boolean
  dailySummary: boolean
}

export interface AdminState {
  bookings: Booking[]
  partners: FleetPartner[]
  drivers: Driver[]
  vehicles: FleetVehicle[]
  settings: AdminSettings
  /** Search carried from the top bar into the bookings list. */
  bookingQuery: string
  /** The booking shown in the detail drawer, openable from any section. */
  openBookingId: string | null
}

/** Sections of the console, one per admin route. */
export type AdminSection =
  | 'overview'
  | 'bookings'
  | 'partners'
  | 'fleet'
  | 'customers'
  | 'finance'
  | 'settings'
