import { api, endpoints } from '@/lib/api'
import type { Booking } from '@/types'
import type { AdminSettings, Driver, FleetPartner, FleetVehicle, PartnerStatus } from './types'

/**
 * The console's calls to the API, in one file.
 *
 * `store.ts` decides what happens to the screen; this decides what is sent.
 * Every function here is named after the action in the store that calls it,
 * which is the mapping `lib/api/endpoints.ts` was written to anticipate.
 *
 * The server owns the arithmetic it is responsible for: a booking's
 * commission is recomputed there from the partner's rate, so this never
 * sends one. It also owns every refusal — a driver on another trip, a
 * partner with history — and those come back as an `ApiError` whose message
 * is written to be shown.
 */

interface BookingListResponse {
  items: Booking[]
  total: number
}

export async function fetchEverything(): Promise<{
  bookings: Booking[]
  partners: FleetPartner[]
  drivers: Driver[]
  vehicles: FleetVehicle[]
  settings: AdminSettings
}> {
  // One round trip each, in parallel: the console shows all of it at once, so
  // there is nothing to gain by sequencing them.
  const [bookings, partners, drivers, vehicles, settings] = await Promise.all([
    api.get<BookingListResponse>(endpoints.bookings.list, { query: { limit: 500 } }),
    api.get<FleetPartner[]>(endpoints.partners.list),
    api.get<Driver[]>(endpoints.drivers.list),
    api.get<FleetVehicle[]>(endpoints.vehicles.list),
    api.get<AdminSettings>(endpoints.admin.settings),
  ])

  return { bookings: bookings.items, partners, drivers, vehicles, settings }
}

export const fetchBookings = async (): Promise<Booking[]> =>
  (await api.get<BookingListResponse>(endpoints.bookings.list, { query: { limit: 500 } })).items

export const updateBooking = (id: string, patch: Partial<Booking>): Promise<Booking> =>
  api.patch<Booking>(endpoints.bookings.update(id), patch)

export const deleteBooking = (id: string): Promise<void> =>
  api.delete<void>(endpoints.bookings.remove(id))

/**
 * The console's forms carry a whole record and do not know whether it is new,
 * so the id decides: one the server issued means an update, one made locally
 * means a create. The server allocates the real id on a create, which is why
 * the created record is returned and swapped in.
 */
export function savePartner(partner: FleetPartner, isNew: boolean): Promise<FleetPartner> {
  const body = {
    name: partner.name,
    type: partner.type,
    contactName: partner.contactName,
    phone: partner.phone,
    email: partner.email,
    commissionRate: partner.commissionRate,
    status: partner.status,
  }
  return isNew
    ? api.post<FleetPartner>(endpoints.partners.create, body)
    : api.put<FleetPartner>(endpoints.partners.byId(partner.id), body)
}

export const setPartnerStatus = (id: string, status: PartnerStatus): Promise<FleetPartner> =>
  api.patch<FleetPartner>(endpoints.partners.updateStatus(id), { status })

export const deletePartner = (id: string): Promise<void> =>
  api.delete<void>(endpoints.partners.byId(id))

export function saveDriver(driver: Driver, isNew: boolean): Promise<Driver> {
  const body = {
    partnerId: driver.partnerId,
    name: driver.name,
    phone: driver.phone,
    licenceNo: driver.licenceNo,
    status: driver.status,
    rating: driver.rating,
  }
  return isNew
    ? api.post<Driver>(endpoints.drivers.create, body)
    : api.put<Driver>(endpoints.drivers.byId(driver.id), body)
}

export const deleteDriver = (id: string): Promise<void> =>
  api.delete<void>(endpoints.drivers.byId(id))

export function saveVehicle(vehicle: FleetVehicle, isNew: boolean): Promise<FleetVehicle> {
  const body = {
    partnerId: vehicle.partnerId,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    plate: vehicle.plate,
    vehicleClass: vehicle.vehicleClass,
    seats: vehicle.seats,
    status: vehicle.status,
  }
  return isNew
    ? api.post<FleetVehicle>(endpoints.vehicles.create, body)
    : api.put<FleetVehicle>(endpoints.vehicles.byId(vehicle.id), body)
}

export const deleteVehicle = (id: string): Promise<void> =>
  api.delete<void>(endpoints.vehicles.byId(id))

/** Customers are a grouping of bookings, so both of these rewrite bookings. */
export const updateCustomer = (
  email: string,
  patch: { customerName: string; customerEmail: string; customerPhone: string },
): Promise<unknown> => api.patch(endpoints.customers.byEmail(email), patch)

export const deleteCustomer = (email: string): Promise<unknown> =>
  api.delete(endpoints.customers.byEmail(email))

export const updateSettings = (patch: Partial<AdminSettings>): Promise<AdminSettings> =>
  api.patch<AdminSettings>(endpoints.admin.settings, patch)
