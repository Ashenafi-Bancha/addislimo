import type { Booking, BookingStatus, ServiceId } from '@/types'
import type { AdminSettings, AdminState, Driver, FleetPartner, FleetVehicle } from './types'

/**
 * Seed data for the admin console.
 *
 * Every export here stands in for an API response. Until the backend exists,
 * the console runs on this in memory: edits made in the UI last for the
 * browser session and reset on reload.
 *
 * Trip times are generated relative to the moment the console loads, so
 * "today", "upcoming" and the last-14-days chart always look current rather
 * than frozen on the day this file was written. Places come from the client's
 * service document (see docs/CLIENT-BRIEF.md). Names, phone numbers and
 * plates are fictional; emails use the reserved example.com domain.
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

/** Minutes from the current moment — for trips that are live right now. */
function fromNow(minutes: number): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString()
}

/* ── Partners ── */

export const seedPartners: FleetPartner[] = [
  { id: 'p-elite', name: 'Elite Cars', type: 'Transport Company', contactName: 'Tesfaye Alemu', phone: '+251 911 204 118', email: 'dispatch@elitecars.example.com', commissionRate: 12, status: 'Active', rating: 4.9, joinedAt: onDay(-410, '09:00') },
  { id: 'p-royal', name: 'Royal Fleet', type: 'Transport Company', contactName: 'Meron Tadesse', phone: '+251 911 330 452', email: 'ops@royalfleet.example.com', commissionRate: 12, status: 'Active', rating: 4.8, joinedAt: onDay(-365, '09:00') },
  { id: 'p-diplomat', name: 'Diplomat Cars', type: 'Transport Company', contactName: 'Samuel Girma', phone: '+251 912 118 906', email: 'bookings@diplomatcars.example.com', commissionRate: 15, status: 'Active', rating: 4.9, joinedAt: onDay(-300, '09:00') },
  { id: 'p-citytours', name: 'City Tours Co.', type: 'Tour Operator', contactName: 'Hanna Bekele', phone: '+251 913 507 221', email: 'hello@citytours.example.com', commissionRate: 10, status: 'Active', rating: 4.7, joinedAt: onDay(-210, '09:00') },
  { id: 'p-events', name: 'Events Fleet', type: 'Events Transport', contactName: 'Dawit Haile', phone: '+251 911 872 340', email: 'events@eventsfleet.example.com', commissionRate: 12, status: 'Active', rating: 4.8, joinedAt: onDay(-150, '09:00') },
  { id: 'p-sunrise', name: 'Sunrise Rides', type: 'Vehicle Owner', contactName: 'Abel Worku', phone: '+251 914 663 019', email: 'abel@sunriserides.example.com', commissionRate: 10, status: 'Pending', rating: 0, joinedAt: onDay(-3, '15:20') },
]

/* ── Drivers ── */

export const seedDrivers: Driver[] = [
  { id: 'd-01', name: 'Tesfaye Abebe', phone: '+251 911 402 115', partnerId: 'p-elite', licenceNo: 'AA-DL-208441', status: 'Available', rating: 4.9 },
  { id: 'd-02', name: 'Bekele Assefa', phone: '+251 911 518 730', partnerId: 'p-elite', licenceNo: 'AA-DL-211093', status: 'Available', rating: 4.8 },
  { id: 'd-03', name: 'Dawit Mekonnen', phone: '+251 912 044 681', partnerId: 'p-royal', licenceNo: 'AA-DL-197320', status: 'Available', rating: 4.9 },
  { id: 'd-04', name: 'Yonas Tilahun', phone: '+251 912 377 504', partnerId: 'p-royal', licenceNo: 'AA-DL-224118', status: 'Off Duty', rating: 4.6 },
  { id: 'd-11', name: 'Biruk Negash', phone: '+251 913 090 262', partnerId: 'p-royal', licenceNo: 'AA-DL-230577', status: 'Available', rating: 4.7 },
  { id: 'd-05', name: 'Solomon Kebede', phone: '+251 911 655 948', partnerId: 'p-diplomat', licenceNo: 'AA-DL-185602', status: 'Available', rating: 5.0 },
  { id: 'd-06', name: 'Kidus Alemayehu', phone: '+251 914 210 377', partnerId: 'p-diplomat', licenceNo: 'AA-DL-201784', status: 'Available', rating: 4.9 },
  { id: 'd-07', name: 'Yohannes Tesema', phone: '+251 913 781 450', partnerId: 'p-citytours', licenceNo: 'AA-DL-215936', status: 'Available', rating: 4.8 },
  { id: 'd-08', name: 'Mulugeta Desta', phone: '+251 911 936 012', partnerId: 'p-citytours', licenceNo: 'AA-DL-209355', status: 'Off Duty', rating: 4.6 },
  { id: 'd-09', name: 'Girma Shiferaw', phone: '+251 912 563 889', partnerId: 'p-events', licenceNo: 'AA-DL-192648', status: 'Available', rating: 4.9 },
  { id: 'd-10', name: 'Henok Wolde', phone: '+251 914 128 603', partnerId: 'p-events', licenceNo: 'AA-DL-226017', status: 'Available', rating: 4.7 },
  { id: 'd-12', name: 'Eyob Fikre', phone: '+251 915 347 290', partnerId: 'p-sunrise', licenceNo: 'AA-DL-238840', status: 'Off Duty', rating: 0 },
]

/* ── Vehicles ── */

export const seedVehicles: FleetVehicle[] = [
  { id: 'v-01', partnerId: 'p-elite', make: 'BMW', model: '7 Series', year: 2023, plate: 'AA 3-B45821', vehicleClass: 'sedan', seats: 3, status: 'Available' },
  { id: 'v-02', partnerId: 'p-elite', make: 'Mercedes-Benz', model: 'S-Class', year: 2022, plate: 'AA 3-C10774', vehicleClass: 'luxury', seats: 3, status: 'Available' },
  { id: 'v-03', partnerId: 'p-royal', make: 'Mercedes-Benz', model: 'E-Class', year: 2021, plate: 'AA 3-A77310', vehicleClass: 'sedan', seats: 3, status: 'Available' },
  { id: 'v-04', partnerId: 'p-royal', make: 'Toyota', model: 'Land Cruiser', year: 2022, plate: 'AA 3-B20958', vehicleClass: 'suv', seats: 4, status: 'Available' },
  { id: 'v-05', partnerId: 'p-royal', make: 'Toyota', model: 'HiAce', year: 2020, plate: 'AA 3-A63402', vehicleClass: 'van', seats: 7, status: 'Maintenance' },
  { id: 'v-06', partnerId: 'p-diplomat', make: 'Toyota', model: 'Land Cruiser V8', year: 2023, plate: 'AA 3-D30115', vehicleClass: 'suv', seats: 4, status: 'Available' },
  { id: 'v-07', partnerId: 'p-diplomat', make: 'Mercedes-Benz', model: 'GLS', year: 2022, plate: 'AA 3-D41887', vehicleClass: 'luxury', seats: 4, status: 'Available' },
  { id: 'v-08', partnerId: 'p-citytours', make: 'Toyota', model: 'Corolla Cross', year: 2022, plate: 'AA 3-B88046', vehicleClass: 'suv', seats: 4, status: 'Available' },
  { id: 'v-09', partnerId: 'p-citytours', make: 'Toyota', model: 'HiAce', year: 2021, plate: 'AA 3-A52219', vehicleClass: 'van', seats: 7, status: 'Available' },
  { id: 'v-10', partnerId: 'p-events', make: 'BMW', model: '5 Series', year: 2022, plate: 'AA 3-C66703', vehicleClass: 'sedan', seats: 3, status: 'Available' },
  { id: 'v-11', partnerId: 'p-events', make: 'Mercedes-Benz', model: 'V-Class', year: 2021, plate: 'AA 3-C29451', vehicleClass: 'van', seats: 7, status: 'Available' },
  { id: 'v-12', partnerId: 'p-sunrise', make: 'Hyundai', model: 'Tucson', year: 2021, plate: 'AA 3-E01362', vehicleClass: 'suv', seats: 4, status: 'Maintenance' },
]

/* ── Bookings ── */

const customers = {
  james: { customerName: 'James Mwangi', customerEmail: 'james.mwangi@example.com', customerPhone: '+251 911 760 204' },
  sophie: { customerName: 'Sophie Laurent', customerEmail: 'sophie.laurent@example.com', customerPhone: '+251 911 184 552' },
  marcus: { customerName: 'Marcus Chen', customerEmail: 'marcus.chen@example.com', customerPhone: '+251 912 903 417' },
  almaz: { customerName: 'Almaz Bekele', customerEmail: 'almaz.bekele@example.com', customerPhone: '+251 913 225 680' },
  ahmed: { customerName: 'Ahmed Hassan', customerEmail: 'ahmed.hassan@example.com', customerPhone: '+251 911 441 097' },
  sarah: { customerName: 'Sarah Thompson', customerEmail: 'sarah.thompson@example.com', customerPhone: '+251 914 580 336' },
  liya: { customerName: 'Liya Getachew', customerEmail: 'liya.getachew@example.com', customerPhone: '+251 912 617 048' },
  daniel: { customerName: 'Daniel Okafor', customerEmail: 'daniel.okafor@example.com', customerPhone: '+251 911 309 865' },
  hiwot: { customerName: 'Hiwot Tadesse', customerEmail: 'hiwot.tadesse@example.com', customerPhone: '+251 913 842 119' },
  omar: { customerName: 'Omar Farouk', customerEmail: 'omar.farouk@example.com', customerPhone: '+251 915 026 773' },
  emma: { customerName: 'Emma Rossi', customerEmail: 'emma.rossi@example.com', customerPhone: '+251 911 695 402' },
  kenji: { customerName: 'Kenji Watanabe', customerEmail: 'kenji.watanabe@example.com', customerPhone: '+251 912 470 931' },
} as const

type Row = {
  id: string
  who: keyof typeof customers
  serviceId: ServiceId
  pickup: string
  destination: string
  scheduledAt: string
  passengers: number
  partnerId: string
  driverId: string | null
  vehicleId: string | null
  amount: number
  status: BookingStatus
  /** How many days before the trip the booking was made. */
  leadDays: number
  notes?: string
}

const rows: Row[] = [
  // Past
  { id: 'AL-QH2051', who: 'emma', serviceId: 'airport', pickup: 'Bole International Airport', destination: 'Sheraton Addis', scheduledAt: onDay(-13, '07:30'), passengers: 2, partnerId: 'p-elite', driverId: 'd-01', vehicleId: 'v-01', amount: 3400, status: 'Completed', leadDays: 6 },
  { id: 'AL-TN7730', who: 'kenji', serviceId: 'summit', pickup: 'Hyatt Regency', destination: 'African Union Headquarters', scheduledAt: onDay(-12, '10:00'), passengers: 1, partnerId: 'p-diplomat', driverId: 'd-05', vehicleId: 'v-06', amount: 7800, status: 'Completed', leadDays: 9 },
  { id: 'AL-BD4418', who: 'hiwot', serviceId: 'hourly', pickup: 'Hilton Addis Ababa', destination: 'Multiple stops', scheduledAt: onDay(-11, '09:00'), passengers: 2, partnerId: 'p-royal', driverId: 'd-03', vehicleId: 'v-03', amount: 6400, status: 'Completed', leadDays: 2 },
  { id: 'AL-MW0962', who: 'emma', serviceId: 'city-tour', pickup: 'Skylight Hotel', destination: 'Unity Park and Entoto', scheduledAt: onDay(-10, '14:00'), passengers: 3, partnerId: 'p-citytours', driverId: 'd-07', vehicleId: 'v-08', amount: 5800, status: 'Completed', leadDays: 4 },
  { id: 'AL-RS3307', who: 'daniel', serviceId: 'corporate', pickup: 'UNECA Conference Center', destination: 'Sheraton Addis', scheduledAt: onDay(-9, '18:30'), passengers: 3, partnerId: 'p-royal', driverId: 'd-11', vehicleId: 'v-04', amount: 4200, status: 'Completed', leadDays: 5 },
  { id: 'AL-VB6643', who: 'ahmed', serviceId: 'airport', pickup: 'Ramada Addis', destination: 'Bole International Airport', scheduledAt: onDay(-9, '06:00'), passengers: 1, partnerId: 'p-elite', driverId: 'd-02', vehicleId: 'v-02', amount: 3800, status: 'Cancelled', leadDays: 3, notes: 'Cancelled by customer: flight rebooked.' },
  { id: 'AL-PQ4472', who: 'sophie', serviceId: 'diplomatic', pickup: 'Old Airport, Sarbet', destination: 'UNECA Conference Center', scheduledAt: onDay(-8, '16:00'), passengers: 2, partnerId: 'p-diplomat', driverId: 'd-06', vehicleId: 'v-07', amount: 5200, status: 'Completed', leadDays: 7, notes: 'Confirm driver identity with the embassy 24 hours ahead.' },
  { id: 'AL-CW1157', who: 'sarah', serviceId: 'wedding', pickup: 'Bole Medhanialem', destination: 'Sheraton Addis', scheduledAt: onDay(-7, '11:00'), passengers: 4, partnerId: 'p-events', driverId: 'd-09', vehicleId: 'v-10', amount: 16500, status: 'Completed', leadDays: 30, notes: 'White ribbons on the vehicle. Bride pickup first.' },
  { id: 'AL-HK5580', who: 'hiwot', serviceId: 'city', pickup: 'CMC', destination: 'Kazanchis', scheduledAt: onDay(-6, '08:30'), passengers: 1, partnerId: 'p-royal', driverId: 'd-03', vehicleId: 'v-03', amount: 2100, status: 'Completed', leadDays: 1 },
  { id: 'AL-RT8831', who: 'marcus', serviceId: 'summit', pickup: 'Addis International Convention Center', destination: 'Hilton Addis Ababa', scheduledAt: onDay(-5, '13:00'), passengers: 2, partnerId: 'p-diplomat', driverId: 'd-05', vehicleId: 'v-06', amount: 8600, status: 'Completed', leadDays: 12 },
  { id: 'AL-JY2294', who: 'liya', serviceId: 'prom', pickup: 'Bole', destination: 'Skylight Hotel', scheduledAt: onDay(-4, '19:00'), passengers: 4, partnerId: 'p-events', driverId: 'd-10', vehicleId: 'v-11', amount: 6800, status: 'Completed', leadDays: 14 },
  { id: 'AL-XK9281', who: 'kenji', serviceId: 'airport', pickup: 'Bole International Airport', destination: 'Hyatt Regency', scheduledAt: onDay(-3, '07:00'), passengers: 1, partnerId: 'p-elite', driverId: 'd-01', vehicleId: 'v-01', amount: 3400, status: 'Completed', leadDays: 4 },
  { id: 'AL-EG6015', who: 'james', serviceId: 'expat', pickup: 'Wello Sefer', destination: 'Bole Edna Mall', scheduledAt: onDay(-3, '15:30'), passengers: 2, partnerId: 'p-royal', driverId: 'd-11', vehicleId: 'v-04', amount: 3200, status: 'Completed', leadDays: 2 },
  { id: 'AL-LM2219', who: 'almaz', serviceId: 'city-tour', pickup: 'Sheraton Addis', destination: 'Merkato and Holy Trinity Cathedral', scheduledAt: onDay(-2, '10:00'), passengers: 5, partnerId: 'p-citytours', driverId: 'd-08', vehicleId: 'v-09', amount: 6200, status: 'Completed', leadDays: 6 },
  { id: 'AL-ZP4903', who: 'omar', serviceId: 'airport', pickup: 'Hilton Addis Ababa', destination: 'Bole International Airport', scheduledAt: onDay(-2, '21:00'), passengers: 1, partnerId: 'p-elite', driverId: 'd-02', vehicleId: 'v-02', amount: 3800, status: 'Cancelled', leadDays: 1, notes: 'No-show. Customer unreachable at pickup.' },
  { id: 'AL-NA8126', who: 'daniel', serviceId: 'corporate', pickup: 'Kazanchis', destination: 'African Union Headquarters', scheduledAt: onDay(-1, '09:30'), passengers: 2, partnerId: 'p-diplomat', driverId: 'd-06', vehicleId: 'v-07', amount: 4600, status: 'Completed', leadDays: 3 },
  { id: 'AL-FC7342', who: 'james', serviceId: 'hourly', pickup: 'Continental Hotel', destination: 'Multiple stops', scheduledAt: onDay(-1, '17:00'), passengers: 1, partnerId: 'p-royal', driverId: 'd-03', vehicleId: 'v-03', amount: 4800, status: 'Completed', leadDays: 2 },

  // Today, relative to now so live states always make sense
  { id: 'AL-GU1478', who: 'marcus', serviceId: 'airport', pickup: 'Bole International Airport', destination: 'Sheraton Addis', scheduledAt: fromNow(-240), passengers: 1, partnerId: 'p-elite', driverId: 'd-01', vehicleId: 'v-01', amount: 3400, status: 'Completed', leadDays: 2 },
  { id: 'AL-SK5061', who: 'kenji', serviceId: 'summit', pickup: 'Hyatt Regency', destination: 'UNECA Conference Center', scheduledAt: fromNow(-35), passengers: 2, partnerId: 'p-diplomat', driverId: 'd-05', vehicleId: 'v-06', amount: 7800, status: 'In Progress', leadDays: 5 },
  { id: 'AL-DE3390', who: 'emma', serviceId: 'airport', pickup: 'Skylight Hotel', destination: 'Bole International Airport', scheduledAt: fromNow(25), passengers: 2, partnerId: 'p-elite', driverId: 'd-02', vehicleId: 'v-02', amount: 3400, status: 'Driver En Route', leadDays: 3 },
  { id: 'AL-WA7215', who: 'sophie', serviceId: 'hourly', pickup: 'Sheraton Addis', destination: 'Multiple stops', scheduledAt: fromNow(150), passengers: 2, partnerId: 'p-royal', driverId: 'd-11', vehicleId: 'v-04', amount: 6400, status: 'Assigned', leadDays: 4 },
  { id: 'AL-OB9054', who: 'hiwot', serviceId: 'city', pickup: 'CMC', destination: 'Bole Edna Mall', scheduledAt: fromNow(240), passengers: 1, partnerId: 'p-royal', driverId: null, vehicleId: null, amount: 2200, status: 'Confirmed', leadDays: 1 },
  { id: 'AL-IV2687', who: 'omar', serviceId: 'diplomatic', pickup: 'Old Airport, Sarbet', destination: 'Addis International Convention Center', scheduledAt: fromNow(300), passengers: 3, partnerId: 'p-diplomat', driverId: null, vehicleId: null, amount: 5200, status: 'Pending', leadDays: 1, notes: 'Delegation of three. Needs confirmation from the mission office.' },

  // Upcoming
  { id: 'AL-YT4436', who: 'almaz', serviceId: 'wedding', pickup: 'Bole Medhanialem', destination: 'Sheraton Addis', scheduledAt: onDay(1, '08:00'), passengers: 4, partnerId: 'p-events', driverId: null, vehicleId: null, amount: 17200, status: 'Confirmed', leadDays: 21, notes: 'Decorated vehicle. Photography stop at Unity Park.' },
  { id: 'AL-KL0819', who: 'daniel', serviceId: 'airport', pickup: 'Bole International Airport', destination: 'Hilton Addis Ababa', scheduledAt: onDay(1, '14:00'), passengers: 1, partnerId: 'p-elite', driverId: 'd-01', vehicleId: 'v-01', amount: 3400, status: 'Assigned', leadDays: 3 },
  { id: 'AL-CM6602', who: 'marcus', serviceId: 'summit', pickup: 'Hilton Addis Ababa', destination: 'African Union Headquarters', scheduledAt: onDay(2, '09:00'), passengers: 2, partnerId: 'p-diplomat', driverId: 'd-06', vehicleId: 'v-07', amount: 8600, status: 'Assigned', leadDays: 8 },
  { id: 'AL-PR5127', who: 'liya', serviceId: 'prom', pickup: 'CMC', destination: 'Skylight Hotel', scheduledAt: onDay(2, '19:30'), passengers: 4, partnerId: 'p-events', driverId: null, vehicleId: null, amount: 6800, status: 'Pending', leadDays: 9, notes: 'Two couples. Return trip at 23:30.' },
  { id: 'AL-UH3348', who: 'kenji', serviceId: 'city-tour', pickup: 'Hyatt Regency', destination: 'Entoto Park', scheduledAt: onDay(3, '10:00'), passengers: 2, partnerId: 'p-citytours', driverId: 'd-07', vehicleId: 'v-08', amount: 5800, status: 'Confirmed', leadDays: 5 },
  { id: 'AL-BX9710', who: 'james', serviceId: 'expat', pickup: 'Old Airport, Sarbet', destination: 'Kazanchis', scheduledAt: onDay(3, '16:00'), passengers: 1, partnerId: 'p-royal', driverId: null, vehicleId: null, amount: 3200, status: 'Pending', leadDays: 2 },
  { id: 'AL-NE1583', who: 'sophie', serviceId: 'airport', pickup: 'Ramada Addis', destination: 'Bole International Airport', scheduledAt: onDay(4, '07:15'), passengers: 2, partnerId: 'p-elite', driverId: 'd-02', vehicleId: 'v-02', amount: 3800, status: 'Confirmed', leadDays: 6 },
]

const rateByPartner = new Map(seedPartners.map((p) => [p.id, p.commissionRate]))

export const seedBookings: Booking[] = rows.map(({ who, leadDays, ...row }) => ({
  ...row,
  ...customers[who],
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
