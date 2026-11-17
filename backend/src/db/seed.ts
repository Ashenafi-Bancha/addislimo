import { env } from '../config/env.ts'
import { closePool, query, transaction } from './pool.ts'
import { newBookingReference, newId } from '../lib/ids.ts'
import { countAdmins, createAdmin } from '../modules/auth/service.ts'
import { splitCommission } from '../modules/quotes/pricing.ts'

/**
 * Seed data: the catalogue, and one of everything else.
 *
 * The catalogue — services and vehicle classes — is not sample data. It is
 * the client's actual offer, taken from `frontend/src/features/booking/
 * booking.data.ts`, and the booking wizard does not work without it. It is
 * upserted, so running this again after a price change does not undo the
 * change.
 *
 * The operations rows are the same single set the console ships with today
 * (`frontend/src/features/admin/data.ts`): one partner, one driver, one
 * vehicle and one completed Bole-to-hotel trip, so Overview and Finance show
 * real figures rather than zeroes. They are inserted only into an empty
 * database, so this can never scribble over live bookings.
 *
 *   pnpm seed
 */

const SERVICES = [
  ['airport', 'Airport Transfer', 'Bole International to your hotel or Airbnb', 3400, 1],
  ['city', 'Point-to-Point', 'Direct transfer between two points in the city', 1800, 2],
  ['hourly', 'Hourly Service', 'A driver at your disposal, by the hour or the day', 4800, 3],
  ['corporate', 'Executive / Corporate', 'Business and organizational travel', 5200, 4],
  ['diplomatic', 'Diplomatic & Embassy', 'Embassy, mission and delegation travel', 6500, 5],
  ['city-tour', 'City Tour', 'Guided tour across the capital’s districts', 5600, 6],
  ['summit', 'Summit & Conference', 'AU, ECA, AICC and UNECA venue transfers', 6000, 7],
  ['expat', 'Expat Transport', 'Standing arrangements for residents in Addis', 4200, 8],
  ['wedding', 'Wedding', 'Bridal party, family and guest transport', 9000, 9],
  ['prom', 'Prom', 'Prom and graduation night transport', 7500, 10],
] as const

const VEHICLE_CLASSES = [
  ['sedan', 'Executive Sedan', '1–3', 'Premium comfort', '🚗', 1.0, 1, 3, 1],
  ['suv', 'Premium SUV', '1–4', 'Spacious & commanding', '🚙', 1.25, 1, 4, 2],
  ['luxury', 'Luxury SUV', '1–4', 'Top-tier comfort', '🚙', 1.6, 1, 4, 3],
  ['van', 'Business Van', '5–7', 'Groups & delegations', '🚐', 1.45, 5, 7, 4],
] as const

async function seedCatalogue(): Promise<void> {
  for (const [id, label, description, baseFare, sortOrder] of SERVICES) {
    await query(
      `INSERT INTO services (id, label, description, base_fare, sort_order)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, description = EXCLUDED.description`,
      [id, label, description, baseFare, sortOrder],
    )
  }

  for (const [id, label, capacity, note, img, multiplier, min, max, sortOrder] of VEHICLE_CLASSES) {
    await query(
      `INSERT INTO vehicle_classes (id, label, capacity_label, note, img, multiplier, seats_min, seats_max, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE SET label = EXCLUDED.label, capacity_label = EXCLUDED.capacity_label,
            note = EXCLUDED.note, img = EXCLUDED.img`,
      [id, label, capacity, note, img, multiplier, min, max, sortOrder],
    )
  }

  console.log(`[seed] catalogue: ${SERVICES.length} services, ${VEHICLE_CLASSES.length} vehicle classes`)
}

/** Yesterday at a fixed hour, in Addis time, as an instant. */
function yesterdayAt(hour: number, minute: number): Date {
  const now = new Date()
  const addis = new Date(now.getTime() + 3 * 60 * 60 * 1000)
  addis.setUTCDate(addis.getUTCDate() - 1)
  addis.setUTCHours(hour, minute, 0, 0)
  return new Date(addis.getTime() - 3 * 60 * 60 * 1000)
}

async function seedOperations(): Promise<void> {
  const existing = await query<{ total: number }>('SELECT count(*)::bigint AS total FROM partners')
  if (Number(existing.rows[0]?.total ?? 0) > 0) {
    console.log('[seed] partners already present, leaving operations data alone')
    return
  }

  await transaction(async (client) => {
    const partnerId = newId('p')
    const commissionRate = 12

    await client.query(
      `INSERT INTO partners (id, name, type, contact_name, phone, email, commission_rate, status, rating)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        partnerId,
        'Bole Executive Cars',
        'Transport Company',
        'Selam Tesfaye',
        '+251 911 234 567',
        'dispatch@boleexecutive.example.com',
        commissionRate,
        'Active',
        4.8,
      ],
    )

    const driverId = newId('d')
    await client.query(
      `INSERT INTO drivers (id, partner_id, name, phone, licence_no, status, rating)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [driverId, partnerId, 'Dawit Bekele', '+251 911 765 432', 'AA-DL-44821', 'Available', 4.9],
    )

    const vehicleId = newId('v')
    await client.query(
      `INSERT INTO vehicles (id, partner_id, make, model, year, plate, vehicle_class, seats, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [vehicleId, partnerId, 'Toyota', 'Land Cruiser', 2023, 'AA-3-B41829', 'luxury', 4, 'Available'],
    )

    // The trip the business exists for: a Bole arrival to a hotel, completed
    // yesterday so the 7-day figures have something in them.
    const amount = 3400
    const split = splitCommission(amount, commissionRate)
    const scheduledAt = yesterdayAt(9, 30)
    const reference = newBookingReference(scheduledAt)

    await client.query(
      `INSERT INTO bookings (
         id, customer_name, customer_email, customer_phone, service_id, pickup, destination,
         scheduled_at, passengers, luggage, vehicle_class, partner_id, driver_id, vehicle_id,
         amount, commission, commission_rate, status, notes, source, created_at, completed_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)`,
      [
        reference,
        'Hanna Girma',
        'hanna.girma@example.com',
        '+251 912 345 678',
        'airport',
        'Bole International Airport, Terminal 2',
        'Sheraton Addis, Taitu Street',
        scheduledAt,
        2,
        3,
        'luxury',
        partnerId,
        driverId,
        vehicleId,
        amount,
        split.commission,
        split.rate,
        'Completed',
        'Arriving from Nairobi, meet at arrivals.',
        'website',
        new Date(scheduledAt.getTime() - 2 * 24 * 60 * 60 * 1000),
        new Date(scheduledAt.getTime() + 55 * 60 * 1000),
      ],
    )

    await client.query(
      `INSERT INTO booking_events (booking_id, actor, kind, to_status, detail)
       VALUES ($1, 'seed', 'created', 'Pending', 'Seeded sample trip')`,
      [reference],
    )

    console.log(
      `[seed] operations: 1 partner, 1 driver, 1 vehicle, 1 completed trip (${reference}, ${amount} ETB, ${split.commission} commission)`,
    )
  })
}

async function seedAdmin(): Promise<void> {
  if ((await countAdmins()) > 0) {
    console.log('[seed] an admin account already exists, leaving it alone')
    return
  }
  if (!env.seedAdmin.password) {
    console.log(
      '[seed] no admin account created: set SEED_ADMIN_PASSWORD in backend/.env and run `pnpm seed` again',
    )
    return
  }
  if (env.seedAdmin.password.length < 10) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 10 characters.')
  }

  const account = await createAdmin({
    email: env.seedAdmin.email,
    password: env.seedAdmin.password,
    name: env.seedAdmin.name,
    role: 'admin',
  })
  // The password is never echoed, here or in a log line.
  console.log(`[seed] admin account created for ${account.email}`)
}

async function main(): Promise<void> {
  await seedCatalogue()
  await seedOperations()
  await seedAdmin()
  console.log('[seed] done')
}

main()
  .then(closePool)
  .catch(async (error: Error) => {
    console.error(`[seed] ${error.message}`)
    await closePool().catch(() => {})
    process.exit(1)
  })
