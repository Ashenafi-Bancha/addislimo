import { randomBytes, randomUUID } from 'node:crypto'

/**
 * Identifiers, in the shapes the frontend already shows.
 *
 * Record ids keep the console's `p-k3x9q2` form (`features/admin/guards.ts`),
 * so a row created through the API and one created in the console before it
 * existed look the same. Booking references keep the customer-facing
 * `AL-261115-7Q4K` form that `features/booking/request.ts` generates, so a
 * reference quoted on the phone from a pre-backend booking still parses.
 */

const ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789'

/** `p-k3x9q2`, `d-m2p8ra`, `v-q7w1zs`. */
export function newId(prefix: string): string {
  const bytes = randomBytes(6)
  let id = ''
  for (const byte of bytes) id += ID_ALPHABET[byte % ID_ALPHABET.length]
  return `${prefix}-${id}`
}

/** No I, O, 0 or 1: these get read aloud down a phone line. */
const REFERENCE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function newBookingReference(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const day = `${String(now.getUTCFullYear()).slice(2)}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}`
  const bytes = randomBytes(4)
  let suffix = ''
  for (const byte of bytes) suffix += REFERENCE_ALPHABET[byte % REFERENCE_ALPHABET.length]
  return `AL-${day}-${suffix}`
}

/** For rows nobody reads the id of. */
export const newUuid = (): string => randomUUID()

/**
 * A session token. 32 random bytes, base64url: long enough that guessing is
 * not a strategy, short enough for a cookie.
 */
export const newSessionToken = (): string => randomBytes(32).toString('base64url')
