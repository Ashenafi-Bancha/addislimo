import type { Booking } from '@/types'
import type { AdminSettings, AdminState, Driver, FleetPartner, FleetVehicle } from './types'

/**
 * Seed data for the admin console.
 *
 * Every export here stands in for an API response. Until the backend exists,
 * the console runs on this in memory: edits made in the UI last for the
 * browser session and reset on reload.
 *
 * Dates are relative to the moment the console loads, so the sample trip is
 * always "tomorrow" rather than frozen on the day this file was written.
 * Places come from the client's service document (see docs/CLIENT-BRIEF.md).
 * Names, phone numbers and plates are fictional; emails use the reserved
 * example.com domain.
 */

const DAY = 24 * 60 * 60 * 1000

/** Midnight today, local time. */
function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

/** A calendar day relative to today, at a fixed clock time. */
function onDay(dayOffset: number, time: string): string {
  const [h, m] = time.split(':').map(Number)
  const d = new Date(startOfToday().getTime() + dayOffset * DAY)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

/* ── One of each, set in Addis Ababa ──
 *
 * A single record per feature: enough to see how every screen works, and
 * nothing an admin has to clear away before real data arrives. The trip is
 * the one the business exists for: a Bole International arrival to a hotel,
 * scheduled for tomorrow morning and already dispatched.
 */

export const seedPartners: FleetPartner[] = [
  {
    id: 'p-bole-exec',
    name: 'Bole Executive Cars',
    type: 'Transport Company',
    contactName: 'Tesfaye Alemu',
    phone: '+251 911 204 118',
    email: 'dispatch@boleexecutive.example.com',
    commissionRate: 12,
    status: 'Active',
    rating: 4.9,
    joinedAt: onDay(-120, '09:00'),
  },
]

export const seedDrivers: Driver[] = [
  { id: 'd-01', name: 'Dawit Mekonnen', phone: '+251 912 044 681', partnerId: 'p-bole-exec', licenceNo: 'AA-DL-197320', status: 'Available', rating: 4.9 },
]

export const seedVehicles: FleetVehicle[] = [
  { id: 'v-01', partnerId: 'p-bole-exec', make: 'Toyota', model: 'Land Cruiser', year: 2023, plate: 'AA 3-B20958', vehicleClass: 'suv', seats: 4, status: 'Available' },
]

const rows: (Omit<Booking, 'createdAt' | 'commission'> & { leadDays: number })[] = [
  {
    id: 'AL-XK9281',
    customerName: 'Almaz Bekele',
    customerEmail: 'almaz.bekele@example.com',
    customerPhone: '+251 913 225 680',
    serviceId: 'airport',
    pickup: 'Bole International Airport',
    destination: 'Sheraton Addis',
    scheduledAt: onDay(1, '08:30'),
    passengers: 2,
    partnerId: 'p-bole-exec',
    driverId: 'd-01',
    vehicleId: 'v-01',
    amount: 3400,
    status: 'Assigned',
    leadDays: 2,
    notes: 'Meet at arrivals with a name sign. Two suitcases.',
  },
]

const rateByPartner = new Map(seedPartners.map((p) => [p.id, p.commissionRate]))

export const seedBookings: Booking[] = rows.map(({ leadDays, ...row }) => ({
  ...row,
  createdAt: new Date(new Date(row.scheduledAt).getTime() - leadDays * DAY).toISOString(),
  commission: Math.round((row.amount * (rateByPartner.get(row.partnerId) ?? 10)) / 100),
}))

export const seedSettings: AdminSettings = {
  defaultCommissionRate: 12,
  notifyNewBooking: true,
  notifyCancellation: true,
  dailySummary: false,
}

export function createSeedState(): AdminState {
  return {
    bookings: seedBookings,
    partners: seedPartners,
    drivers: seedDrivers,
    vehicles: seedVehicles,
    settings: seedSettings,
    bookingQuery: '',
    openBookingId: null,
  }
}
