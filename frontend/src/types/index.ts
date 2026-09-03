/**
 * Domain types shared across features.
 *
 * These deliberately mirror the shape the Express API will return, so that
 * swapping the mock data under `src/data` and `src/features` for real `fetch`
 * calls is a change of source, not a change of type.
 */

/**
 * Services the client sells, per their service document. `city-tour`, `summit`
 * and `expat` come from page 2; `wedding` and `prom` are separate entries under
 * "other service" on page 5.
 */
export type ServiceId =
  | 'airport'
  | 'city'
  | 'hourly'
  | 'corporate'
  | 'diplomatic'
  | 'city-tour'
  | 'summit'
  | 'expat'
  | 'wedding'
  | 'prom'

export type VehicleClassId = 'sedan' | 'suv' | 'luxury' | 'van'

export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Assigned'
  | 'Driver En Route'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'

/** A service the customer can pick in step 1 of the booking flow. */
export interface ServiceOption {
  id: ServiceId
  label: string
  desc: string
}

/** A vehicle class the customer can pick in step 4 of the booking flow. */
export interface VehicleOption {
  id: VehicleClassId
  label: string
  /** Passenger range, e.g. `'1–3'`. */
  capacity: string
  /** Emoji stand-in until the client supplies fleet photography. */
  img: string
  note: string
}

/** A fleet card on the marketing pages. */
export interface Vehicle {
  name: string
  capacity: string
  luggage: string
  desc: string
  img: string
}

/** Everything the booking wizard collects before it is sent to the API. */
export interface BookingDraft {
  service: ServiceId | ''
  pickup: string
  destination: string
  date: string
  time: string
  passengers: string
  luggage: string
  vehicle: VehicleClassId | ''
  firstName: string
  lastName: string
  email: string
  phone: string
  notes: string
}

/** A booking as the API will return it. */
export interface Booking {
  id: string
  customer: string
  service: string
  pickup: string
  dest: string
  /** ISO-ish `YYYY-MM-DD HH:mm` for now; will become a real timestamp. */
  date: string
  partner: string
  vehicle: string
  driver: string
  /** Gross booking value in ETB. */
  amount: number
  /** Addis Limo's cut in ETB. */
  commission: number
  status: BookingStatus
}

/** A partner hotel, airline or fleet operator shown as social proof. */
export interface Partner {
  name: string
  sub: string
  logo: string | null
}
