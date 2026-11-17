/**
 * The JSON the API returns.
 *
 * These mirror `frontend/src/types/index.ts` and
 * `frontend/src/features/admin/types.ts` field for field. The frontend was
 * written against these shapes long before this server existed, so they are a
 * contract, not a preference: renaming `scheduledAt` here breaks a screen
 * there. Anything added must be additive.
 */

export type ServiceId = string
export type VehicleClassId = string

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Assigned'
  | 'Driver En Route'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'

export type PartnerStatus = 'Active' | 'Pending' | 'Suspended'
export type PartnerType =
  | 'Transport Company'
  | 'Vehicle Owner'
  | 'Tour Operator'
  | 'Events Transport'

export type StoredDriverStatus = 'Available' | 'Off Duty'
export type DriverStatus = StoredDriverStatus | 'On Trip'
export type StoredVehicleStatus = 'Available' | 'Maintenance'
export type VehicleStatus = StoredVehicleStatus | 'On Trip'

export type BookingSource = 'website' | 'whatsapp' | 'phone' | 'email' | 'admin'

export interface ServiceOption {
  id: ServiceId
  label: string
  desc: string
  /** Base fare in ETB, before the vehicle-class multiplier. */
  baseFare: number
}

export interface VehicleOption {
  id: VehicleClassId
  label: string
  capacity: string
  img: string
  note: string
  seatsMin: number
  seatsMax: number
}

export interface Booking {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceId: ServiceId
  pickup: string
  destination: string
  scheduledAt: string
  createdAt: string
  passengers: number
  luggage: number
  vehicleClass: VehicleClassId | null
  /** `null` until dispatch gives the trip to a partner. */
  partnerId: string | null
  driverId: string | null
  vehicleId: string | null
  amount: number
  commission: number
  /** The rate the commission was worked out at, kept for the audit trail. */
  commissionRate: number
  status: BookingStatus
  notes: string
  source: BookingSource
  cancelledReason: string | null
  updatedAt: string
  completedAt: string | null
}

export interface BookingEvent {
  id: number
  bookingId: string
  at: string
  actor: string
  kind: 'created' | 'status' | 'assigned' | 'updated' | 'priced'
  fromStatus: BookingStatus | null
  toStatus: BookingStatus | null
  detail: string
}

export interface FleetPartner {
  id: string
  name: string
  type: PartnerType
  contactName: string
  phone: string
  email: string
  commissionRate: number
  status: PartnerStatus
  rating: number
  joinedAt: string
}

export interface Driver {
  id: string
  partnerId: string
  name: string
  phone: string
  licenceNo: string
  status: StoredDriverStatus
  rating: number
  /** Stored status, or `On Trip` when a live booking says otherwise. */
  liveStatus: DriverStatus
}

export interface FleetVehicle {
  id: string
  partnerId: string
  make: string
  model: string
  year: number
  plate: string
  vehicleClass: VehicleClassId
  seats: number
  status: StoredVehicleStatus
  liveStatus: VehicleStatus
}

export interface Customer {
  email: string
  name: string
  phone: string
  trips: number
  completedTrips: number
  totalSpend: number
  firstBookedAt: string
  lastTripAt: string
  topService: ServiceId
}

export interface AdminSettings {
  defaultCommissionRate: number
  notifyNewBooking: boolean
  notifyCancellation: boolean
  dailySummary: boolean
}

export interface AdminAccount {
  id: string
  email: string
  name: string
  role: 'admin' | 'dispatcher' | 'viewer'
}
