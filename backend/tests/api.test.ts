import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'

/**
 * The API against a real database.
 *
 * These exist because the rules that matter most are the ones no unit test
 * reaches: a foreign key that refuses a driver from the wrong partner, a
 * partial unique index that stops the same driver being sent on two trips, a
 * transaction that rolls back. Mocking Postgres would test the mock.
 *
 * They need a database and they will drop its schema, so they refuse to run
 * without DATABASE_URL pointing somewhere disposable:
 *
 *   docker run -d --name addislimo-test -e POSTGRES_PASSWORD=test \
 *     -e POSTGRES_USER=test -e POSTGRES_DB=test -p 5438:5432 postgres:18-alpine
 *   DATABASE_URL=postgres://test:test@localhost:5438/test \
 *     SESSION_SECRET=0123456789012345678901234567890123456789 \
 *     pnpm test
 */

const hasDatabase = Boolean(process.env.DATABASE_URL && process.env.SESSION_SECRET)

if (!hasDatabase) {
  describe('api integration', () => {
    it('skipped: set DATABASE_URL and SESSION_SECRET to run these', { skip: true }, () => {})
  })
} else {
  const { createApp } = await import('../src/app.ts')
  const { closePool, query } = await import('../src/db/pool.ts')
  const { migrate } = await import('../src/db/migrate.ts')
  const { createAdmin } = await import('../src/modules/auth/service.ts')

  let base = ''
  let server: import('node:http').Server
  let cookie = ''

  const ADMIN = { email: 'test-admin@addislimo.test', password: 'test-password-1234' }

  /** fetch with the session cookie attached, and JSON in and out. */
  async function call(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<{ status: number; body: any }> {
    const response = await fetch(`${base}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(cookie ? { Cookie: cookie } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    })
    const setCookie = response.headers.get('set-cookie')
    if (setCookie) cookie = setCookie.split(';')[0]!
    const text = await response.text()
    return { status: response.status, body: text ? JSON.parse(text) : null }
  }

  before(async () => {
    process.argv.push('--reset')
    await migrate({ silent: true })
    process.argv = process.argv.filter((a) => a !== '--reset')

    // The catalogue the wizard prices against.
    await query(
      `INSERT INTO services (id, label, description, base_fare) VALUES ('airport', 'Airport Transfer', '', 3400)`,
    )
    await query(
      `INSERT INTO vehicle_classes (id, label, capacity_label, multiplier, seats_min, seats_max)
       VALUES ('luxury', 'Luxury SUV', '1-4', 1.6, 1, 4), ('van', 'Business Van', '5-7', 1.45, 5, 7)`,
    )
    await createAdmin({ ...ADMIN, name: 'Test Admin' })

    await new Promise<void>((resolve) => {
      server = createApp().listen(0, () => {
        const address = server.address()
        base = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}/api`
        resolve()
      })
    })
  })

  after(async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()))
    await closePool()
  })

  /* ── state shared down the suite, in the order a booking really moves ── */
  let partnerId = ''
  let otherPartnerId = ''
  let driverId = ''
  let otherDriverId = ''
  let vehicleId = ''
  let vanId = ''
  let reference = ''

  describe('public endpoints', () => {
    it('serves the catalogue without a session', async () => {
      const { status, body } = await call('GET', '/services')
      assert.equal(status, 200)
      assert.equal(body[0].id, 'airport')
    })

    it('quotes a fare', async () => {
      const { status, body } = await call('POST', '/quotes/estimate', {
        serviceId: 'airport',
        vehicleClassId: 'luxury',
        passengers: 2,
        scheduledAt: '2026-12-01T09:00:00+03:00',
      })
      assert.equal(status, 200)
      assert.equal(body.amount, 5440)
    })

    it('takes a booking and prices it', async () => {
      const { status, body } = await call('POST', '/bookings', {
        customerName: 'Test Customer',
        customerEmail: 'customer@example.test',
        customerPhone: '+251911000000',
        serviceId: 'airport',
        pickup: 'Bole International Airport',
        destination: 'Sheraton Addis',
        scheduledAt: '2026-12-01T09:00:00+03:00',
        passengers: 2,
        luggage: 2,
        vehicleClass: 'luxury',
      })
      assert.equal(status, 201)
      assert.match(body.reference, /^AL-\d{6}-[A-Z2-9]{4}$/)
      assert.equal(body.booking.status, 'Pending')
      assert.equal(body.booking.amount, 5440)
      assert.equal(body.booking.partnerId, null)
      reference = body.reference
    })

    it('refuses a booking in the past', async () => {
      const { status } = await call('POST', '/bookings', {
        customerName: 'Test',
        customerEmail: 'past@example.test',
        serviceId: 'airport',
        pickup: 'A',
        destination: 'B',
        scheduledAt: '2020-01-01T09:00:00Z',
        passengers: 1,
        vehicleClass: 'luxury',
      })
      assert.equal(status, 400)
    })

    it('keeps the admin list behind a session', async () => {
      const { status } = await call('GET', '/bookings')
      assert.equal(status, 401)
    })
  })

  describe('authentication', () => {
    it('rejects a wrong password without saying which half was wrong', async () => {
      const { status, body } = await call('POST', '/auth/login', {
        email: ADMIN.email,
        password: 'not-the-password',
      })
      assert.equal(status, 401)
      assert.match(body.message, /do not match/i)
    })

    it('rejects an unknown account with the same message', async () => {
      const { body } = await call('POST', '/auth/login', {
        email: 'nobody@addislimo.test',
        password: 'whatever-1234',
      })
      assert.match(body.message, /do not match/i)
    })

    it('signs in and reports the account', async () => {
      const login = await call('POST', '/auth/login', ADMIN)
      assert.equal(login.status, 200)
      assert.equal(login.body.account.email, ADMIN.email)

      const me = await call('GET', '/auth/me')
      assert.equal(me.status, 200)
      assert.equal(me.body.account.role, 'admin')
    })
  })

  describe('fleet', () => {
    it('creates partners, drivers and vehicles', async () => {
      const partner = await call('POST', '/partners', {
        name: 'Test Partner',
        type: 'Transport Company',
        contactName: 'Contact',
        phone: '+251911111111',
        email: 'partner@example.test',
        commissionRate: 12,
      })
      assert.equal(partner.status, 201)
      partnerId = partner.body.id

      const other = await call('POST', '/partners', {
        name: 'Other Partner',
        type: 'Vehicle Owner',
        contactName: 'Other',
        phone: '+251922222222',
        email: 'other@example.test',
        commissionRate: 15,
      })
      otherPartnerId = other.body.id

      const driver = await call('POST', '/drivers', {
        partnerId,
        name: 'Test Driver',
        phone: '+251933333333',
        licenceNo: 'AA-1',
      })
      assert.equal(driver.status, 201)
      driverId = driver.body.id

      const otherDriver = await call('POST', '/drivers', {
        partnerId: otherPartnerId,
        name: 'Other Driver',
        phone: '+251944444444',
        licenceNo: 'AA-2',
      })
      otherDriverId = otherDriver.body.id

      const vehicle = await call('POST', '/vehicles', {
        partnerId,
        make: 'Toyota',
        model: 'Land Cruiser',
        year: 2023,
        plate: 'AA-3-B41829',
        vehicleClass: 'luxury',
        seats: 4,
      })
      assert.equal(vehicle.status, 201)
      vehicleId = vehicle.body.id

      const van = await call('POST', '/vehicles', {
        partnerId,
        make: 'Toyota',
        model: 'Hiace',
        year: 2022,
        plate: 'AA-3-V11111',
        vehicleClass: 'van',
        seats: 7,
      })
      vanId = van.body.id
    })

    it('refuses a duplicate plate whatever the case', async () => {
      const { status, body } = await call('POST', '/vehicles', {
        partnerId,
        make: 'Toyota',
        model: 'Prado',
        year: 2024,
        plate: 'aa-3-b41829',
        vehicleClass: 'luxury',
        seats: 4,
      })
      assert.equal(status, 409)
      assert.match(body.message, /plate/i)
    })

    it('refuses a driver for a partner that does not exist', async () => {
      const { status } = await call('POST', '/drivers', {
        partnerId: 'p-nope',
        name: 'Ghost',
        phone: '+251900000000',
        licenceNo: 'X',
      })
      assert.equal(status, 400)
    })
  })

  describe('dispatch rules', () => {
    it('will not skip from Pending to Completed', async () => {
      const { status, body } = await call('PATCH', `/bookings/${reference}/status`, {
        status: 'Completed',
      })
      assert.equal(status, 409)
      assert.equal(body.code, 'invalid_transition')
    })

    it('will not assign a driver before a partner', async () => {
      const { status, body } = await call('PATCH', `/bookings/${reference}`, { driverId })
      assert.equal(status, 409)
      assert.equal(body.code, 'partner_required')
    })

    it('computes commission when the partner takes the trip', async () => {
      await call('PATCH', `/bookings/${reference}/status`, { status: 'Confirmed' })
      const { body } = await call('PATCH', `/bookings/${reference}`, { partnerId })
      assert.equal(body.commissionRate, 12)
      assert.equal(body.commission, 652.8)
    })

    it("refuses a driver who belongs to another partner", async () => {
      const { status, body } = await call('PATCH', `/bookings/${reference}`, {
        driverId: otherDriverId,
      })
      assert.equal(status, 409)
      assert.equal(body.code, 'driver_wrong_partner')
    })

    it('refuses a vehicle with too few seats', async () => {
      await call('PATCH', `/bookings/${reference}`, { passengers: 6 })
      const { status, body } = await call('PATCH', `/bookings/${reference}`, { vehicleId })
      assert.equal(status, 409)
      assert.equal(body.code, 'vehicle_too_small')
      await call('PATCH', `/bookings/${reference}`, { passengers: 2 })
    })

    it('accepts a vehicle that fits', async () => {
      const { status, body } = await call('PATCH', `/bookings/${reference}`, {
        driverId,
        vehicleId,
        status: 'Assigned',
      })
      assert.equal(status, 200)
      assert.equal(body.status, 'Assigned')
      assert.equal(body.driverId, driverId)
    })

    it('shows the driver as On Trip once the trip is live', async () => {
      await call('PATCH', `/bookings/${reference}/status`, { status: 'Driver En Route' })
      const { body } = await call('GET', `/drivers/${driverId}`)
      assert.equal(body.status, 'Available')
      assert.equal(body.liveStatus, 'On Trip')
    })

    it('refuses the same driver on a second live trip', async () => {
      const second = await call('POST', '/bookings', {
        customerName: 'Second Customer',
        customerEmail: 'second@example.test',
        serviceId: 'airport',
        pickup: 'A',
        destination: 'B',
        scheduledAt: '2026-12-02T09:00:00+03:00',
        passengers: 2,
        vehicleClass: 'luxury',
      })
      const ref2 = second.body.reference
      await call('PATCH', `/bookings/${ref2}/status`, { status: 'Confirmed' })
      await call('PATCH', `/bookings/${ref2}`, { partnerId })
      const { status, body } = await call('PATCH', `/bookings/${ref2}`, {
        driverId,
        vehicleId: vanId,
        status: 'Assigned',
      })
      assert.equal(status, 409)
      assert.equal(body.code, 'driver_busy')
    })

    it('will not delete a driver mid-trip', async () => {
      const { status, body } = await call('DELETE', `/drivers/${driverId}`)
      assert.equal(status, 409)
      assert.equal(body.code, 'driver_has_open_bookings')
    })

    it('will not delete a booking mid-trip', async () => {
      const { status, body } = await call('DELETE', `/bookings/${reference}`)
      assert.equal(status, 409)
      assert.equal(body.code, 'booking_live')
    })

    it('completes the trip and stamps the time', async () => {
      await call('PATCH', `/bookings/${reference}/status`, { status: 'In Progress' })
      const { body } = await call('PATCH', `/bookings/${reference}/status`, { status: 'Completed' })
      assert.equal(body.status, 'Completed')
      assert.ok(body.completedAt)
    })

    it('freezes the price once the trip is in the finance record', async () => {
      const { status, body } = await call('PATCH', `/bookings/${reference}`, { amount: 99999 })
      assert.equal(status, 409)
      assert.equal(body.code, 'amount_frozen')
    })

    it('keeps the commission when the partner rate changes afterwards', async () => {
      await call('PUT', `/partners/${partnerId}`, {
        name: 'Test Partner',
        type: 'Transport Company',
        contactName: 'Contact',
        phone: '+251911111111',
        email: 'partner@example.test',
        commissionRate: 30,
        status: 'Active',
      })
      const { body } = await call('GET', `/bookings/${reference}`)
      assert.equal(body.booking.commission, 652.8, 'a rate change must not rewrite earned commission')
      assert.equal(body.booking.commissionRate, 12)
    })

    it('records every step in the audit trail', async () => {
      const { body } = await call('GET', `/bookings/${reference}`)
      const statuses = body.events.filter((e: any) => e.kind === 'status')
      assert.ok(statuses.length >= 4)
      assert.equal(statuses[0].fromStatus, 'Pending')
      assert.equal(body.events[0].kind, 'created')
    })
  })

  describe('partners with history', () => {
    it('refuses to delete one, and says to suspend instead', async () => {
      const { status, body } = await call('DELETE', `/partners/${partnerId}`)
      assert.equal(status, 409)
      assert.match(body.message, /suspend/i)
    })

    it('deletes one with no bookings, taking its fleet with it', async () => {
      const { status } = await call('DELETE', `/partners/${otherPartnerId}`)
      assert.equal(status, 204)
      const drivers = await call('GET', `/drivers/${otherDriverId}`)
      assert.equal(drivers.status, 404, 'the partner cascade should have removed their driver')
    })
  })

  describe('finance', () => {
    it('totals the completed trip into payouts', async () => {
      const { body } = await call('GET', '/admin/payouts')
      const partner = body.partners.find((p: any) => p.partnerId === partnerId)
      assert.equal(partner.trips, 1)
      assert.equal(partner.gross, 5440)
      assert.equal(partner.commission, 652.8)
      assert.equal(partner.payout, 4787.2)
      assert.equal(
        Math.round((partner.commission + partner.payout) * 100) / 100,
        partner.gross,
        'commission and payout must add back to gross',
      )
    })

    /**
     * The dashboard window looks backwards from today, and this trip is
     * scheduled in December, so it is deliberately not in it — the same
     * behaviour `features/admin/selectors.ts` has, where a window is
     * `[today + 1 day - N, today + 1 day)` over `scheduledAt`. Payouts take
     * no range, so that is where an unflown future trip shows up.
     */
    it('leaves a future-dated trip out of the backward-looking window', async () => {
      const { body } = await call('GET', '/admin/metrics?days=365')
      assert.equal(body.current.trips, 0)
      assert.equal(body.current.revenue, 0)
    })

    it('counts only completed trips as revenue', async () => {
      const { body } = await call('GET', '/admin/metrics')
      assert.equal(body.countByStatus.Completed, 1)
      assert.ok(body.countByStatus.Confirmed >= 1, 'the second booking is still open')

      const unbounded = await call('GET', '/admin/payouts')
      assert.equal(unbounded.body.totals.trips, 1, 'only the completed trip counts')
      assert.equal(unbounded.body.totals.gross, 5440)
    })
  })

  describe('customers', () => {
    it('derives them from bookings', async () => {
      const { body } = await call('GET', '/customers')
      const customer = body.find((c: any) => c.email === 'customer@example.test')
      assert.equal(customer.trips, 1)
      assert.equal(customer.completedTrips, 1)
      assert.equal(customer.totalSpend, 5440)
      assert.equal(customer.topService, 'airport')
    })

    it('rewrites their contact details across every booking', async () => {
      const { status, body } = await call('PATCH', '/customers/customer@example.test', {
        customerName: 'Renamed Customer',
        customerEmail: 'renamed@example.test',
        customerPhone: '+251955555555',
      })
      assert.equal(status, 200)
      assert.equal(body.updatedBookings, 1)

      const check = await call('GET', `/bookings/${reference}`)
      assert.equal(check.body.booking.customerEmail, 'renamed@example.test')
    })
  })

  describe('content', () => {
    it('reads publicly and writes only with a session', async () => {
      const saved = await call('PUT', '/content/business', { value: { phone: '+251 911 000 000' } })
      assert.equal(saved.status, 200)

      const held = cookie
      cookie = ''
      const publicRead = await call('GET', '/content')
      assert.equal(publicRead.status, 200)
      assert.equal(publicRead.body.content.business.phone, '+251 911 000 000')

      const refused = await call('PUT', '/content/business', { value: { phone: 'nope' } })
      assert.equal(refused.status, 401)
      cookie = held
    })

    it('refuses a group the site does not have', async () => {
      const { status } = await call('PUT', '/content/made_up_group', { value: {} })
      assert.equal(status, 400)
    })
  })

  describe('sessions', () => {
    it('stops working after signing out', async () => {
      const out = await call('POST', '/auth/logout')
      assert.equal(out.status, 204)
      const after = await call('GET', '/bookings')
      assert.equal(after.status, 401)
    })
  })
}
