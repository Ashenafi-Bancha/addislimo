import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { hashPassword, verifyPassword } from '../src/lib/password.ts'
import { newBookingReference, newId } from '../src/lib/ids.ts'
import { buildFare, isNightPickup, splitCommission } from '../src/modules/quotes/fare.ts'
import {
  assertTransition,
  canTransition,
  isEarned,
  isLive,
  isOpen,
  nextStatuses,
} from '../src/modules/bookings/status.ts'

/**
 * The rules that do not need a database.
 *
 * These are the ones money and dispatch depend on, so they are tested
 * directly rather than only through a route: a transition table that lets a
 * Pending booking reach Completed is a trip that collects revenue without
 * anyone driving it.
 *
 *   pnpm test
 */

describe('booking status transitions', () => {
  it('walks the normal path from Pending to Completed', () => {
    const path = [
      'Pending',
      'Confirmed',
      'Assigned',
      'Driver En Route',
      'In Progress',
      'Completed',
    ] as const
    for (let i = 0; i < path.length - 1; i++) {
      assert.ok(canTransition(path[i]!, path[i + 1]!), `${path[i]} → ${path[i + 1]} should be allowed`)
    }
  })

  it('refuses to skip the middle of the trip', () => {
    assert.equal(canTransition('Pending', 'Completed'), false)
    assert.equal(canTransition('Pending', 'In Progress'), false)
    assert.equal(canTransition('Confirmed', 'Completed'), false)
  })

  it('treats Completed and Cancelled as terminal', () => {
    assert.deepEqual(nextStatuses('Completed'), [])
    assert.deepEqual(nextStatuses('Cancelled'), [])
    assert.equal(canTransition('Cancelled', 'Pending'), false)
    assert.equal(canTransition('Completed', 'In Progress'), false)
  })

  it('allows cancelling from anywhere still open', () => {
    for (const status of ['Pending', 'Confirmed', 'Assigned', 'Driver En Route', 'In Progress'] as const) {
      assert.ok(canTransition(status, 'Cancelled'), `${status} should be cancellable`)
    }
  })

  it('lets dispatch step a trip back while it has not started', () => {
    assert.ok(canTransition('Assigned', 'Confirmed'))
    assert.ok(canTransition('Driver En Route', 'Assigned'))
  })

  it('refuses to start a trip with no partner', () => {
    assert.throws(
      () => assertTransition('Confirmed', 'Assigned', { partnerId: null, driverId: null }),
      /partner/i,
    )
  })

  it('refuses to send a trip on the road with no driver', () => {
    assert.throws(
      () => assertTransition('Assigned', 'Driver En Route', { partnerId: 'p-1', driverId: null }),
      /driver/i,
    )
  })

  it('allows the move once partner and driver are there', () => {
    assert.doesNotThrow(() =>
      assertTransition('Assigned', 'Driver En Route', { partnerId: 'p-1', driverId: 'd-1' }),
    )
  })

  it('names the ways out when it refuses', () => {
    assert.throws(() => assertTransition('Pending', 'Completed', { partnerId: 'p', driverId: 'd' }), {
      message: /Confirmed, Cancelled/,
    })
  })

  it('groups statuses the way the finance figures expect', () => {
    assert.ok(isEarned('Completed'))
    assert.equal(isEarned('Cancelled'), false)
    assert.equal(isEarned('In Progress'), false)

    assert.ok(isLive('In Progress'))
    assert.ok(isLive('Driver En Route'))
    assert.equal(isLive('Assigned'), false)

    assert.ok(isOpen('Pending'))
    assert.equal(isOpen('Completed'), false)
  })
})

describe('commission', () => {
  it('splits a fare so the parts add back to the whole', () => {
    const { commission, payout } = splitCommission(3400, 12)
    assert.equal(commission, 408)
    assert.equal(payout, 2992)
    assert.equal(commission + payout, 3400)
  })

  it('rounds to the cent the column stores', () => {
    const { commission, payout } = splitCommission(5440, 12)
    assert.equal(commission, 652.8)
    assert.equal(Math.round((commission + payout) * 100) / 100, 5440)
  })

  it('never exceeds the cap, whatever rate it is handed', () => {
    assert.equal(splitCommission(1000, 200).rate, 50)
    assert.equal(splitCommission(1000, -5).rate, 0)
    assert.equal(splitCommission(1000, -5).commission, 0)
  })

  it('leaves nothing to round away on a zero fare', () => {
    assert.deepEqual(splitCommission(0, 12), { commission: 0, payout: 0, rate: 12 })
  })
})

describe('night surcharge', () => {
  // Addis is UTC+3, so these are expressed with the offset the customer sees.
  it('applies between 22:00 and 05:00 local', () => {
    assert.ok(isNightPickup(new Date('2026-12-01T23:30:00+03:00')))
    assert.ok(isNightPickup(new Date('2026-12-01T02:00:00+03:00')))
    assert.ok(isNightPickup(new Date('2026-12-01T04:59:00+03:00')))
  })

  it('does not apply during the day', () => {
    assert.equal(isNightPickup(new Date('2026-12-01T05:00:00+03:00')), false)
    assert.equal(isNightPickup(new Date('2026-12-01T09:00:00+03:00')), false)
    assert.equal(isNightPickup(new Date('2026-12-01T21:59:00+03:00')), false)
  })

  it('reads the Addis hour, not the server one', () => {
    // 23:30 UTC is 02:30 in Addis: night there, not night in London.
    assert.ok(isNightPickup(new Date('2026-12-01T23:30:00Z')))
  })
})

describe('identifiers', () => {
  it('builds a booking reference from the date', () => {
    const reference = newBookingReference(new Date('2026-11-15T10:00:00Z'))
    assert.match(reference, /^AL-261115-[A-Z2-9]{4}$/)
  })

  it('leaves out characters that are misread down a phone line', () => {
    for (let i = 0; i < 200; i++) {
      const suffix = newBookingReference().split('-')[2]!
      assert.doesNotMatch(suffix, /[IO01]/)
    }
  })

  /**
   * Four characters from a 32-letter alphabet is 32^4 = 1,048,576 references
   * a day. That is not collision-proof and is not meant to be: at a few
   * hundred bookings a day the chance of any clash is well under a percent,
   * and `createBooking` retries on the primary key, so a clash costs one
   * extra insert rather than a lost booking. What matters is that the rate
   * stays in that range, which is what this pins down.
   */
  it('collides rarely enough for the insert retry to cover it', () => {
    const daily = 500
    const seen = new Set<string>()
    for (let i = 0; i < daily; i++) seen.add(newBookingReference())
    const collisions = daily - seen.size
    assert.ok(collisions <= 3, `expected almost no collisions in ${daily}, saw ${collisions}`)
  })

  it('spreads across the whole alphabet rather than favouring a few letters', () => {
    const counts = new Map<string, number>()
    for (let i = 0; i < 4000; i++) {
      for (const char of newBookingReference().split('-')[2]!) {
        counts.set(char, (counts.get(char) ?? 0) + 1)
      }
    }
    // 32 usable characters; a biased generator would leave some unused.
    assert.equal(counts.size, 32)
  })

  it('prefixes record ids the way the console does', () => {
    assert.match(newId('p'), /^p-[a-z0-9]{6}$/)
  })
})

describe('passwords', () => {
  it('verifies the right password and rejects the wrong one', async () => {
    const hash = await hashPassword('a-real-password-123')
    assert.ok(await verifyPassword('a-real-password-123', hash))
    assert.equal(await verifyPassword('a-real-password-124', hash), false)
  })

  it('never stores the password itself', async () => {
    const hash = await hashPassword('hunter2-hunter2')
    assert.ok(!hash.includes('hunter2'))
    assert.match(hash, /^scrypt\$/)
  })

  it('salts, so the same password hashes differently each time', async () => {
    const [a, b] = await Promise.all([hashPassword('same-password'), hashPassword('same-password')])
    assert.notEqual(a, b)
    assert.ok(await verifyPassword('same-password', a))
    assert.ok(await verifyPassword('same-password', b))
  })

  it('treats a malformed hash as a failure rather than throwing', async () => {
    assert.equal(await verifyPassword('x', 'not-a-hash'), false)
    assert.equal(await verifyPassword('x', 'scrypt$1$2$3'), false)
    assert.equal(await verifyPassword('x', ''), false)
  })
})
