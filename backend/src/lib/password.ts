import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'

/**
 * Password hashing with scrypt from the standard library.
 *
 * scrypt is memory-hard and ships with Node, so there is no native module to
 * rebuild on every deploy — which is the usual reason a project ends up with
 * something weaker. Parameters are stored in the hash string, so raising the
 * cost later does not invalidate existing passwords: an old hash still
 * verifies with the parameters it was made with.
 *
 * Format: scrypt$N$r$p$keylen$salt$key, salt and key base64url.
 */

const scrypt = promisify(scryptCallback) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>

const PARAMS = { N: 2 ** 15, r: 8, p: 1, keylen: 64 } as const
// scrypt needs roughly 128 * N * r bytes; the default cap is below that at N=2^15.
const maxmem = 256 * PARAMS.N * PARAMS.r

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16)
  const key = await scrypt(password.normalize('NFKC'), salt, PARAMS.keylen, { ...PARAMS, maxmem })
  return [
    'scrypt',
    PARAMS.N,
    PARAMS.r,
    PARAMS.p,
    PARAMS.keylen,
    salt.toString('base64url'),
    key.toString('base64url'),
  ].join('$')
}

/**
 * Always does the work, even for a malformed hash, and always compares in
 * constant time: the time a wrong answer takes should not say whether the
 * email exists.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$')
  if (parts.length !== 7 || parts[0] !== 'scrypt') return false

  const [, nRaw, rRaw, pRaw, keylenRaw, saltRaw, keyRaw] = parts as [
    string, string, string, string, string, string, string,
  ]
  const N = Number(nRaw)
  const r = Number(rRaw)
  const p = Number(pRaw)
  const keylen = Number(keylenRaw)
  if (![N, r, p, keylen].every((n) => Number.isInteger(n) && n > 0)) return false

  const expected = Buffer.from(keyRaw, 'base64url')
  if (expected.length !== keylen) return false

  try {
    const actual = await scrypt(password.normalize('NFKC'), Buffer.from(saltRaw, 'base64url'), keylen, {
      N,
      r,
      p,
      maxmem: 256 * N * r,
    })
    return timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}

/**
 * Burns roughly the time a real verification takes. Called when the email is
 * unknown, so that answering "no such account" costs the same as answering
 * "wrong password" and the response time stops being an account oracle.
 */
export async function fakeVerify(): Promise<void> {
  await scrypt('decoy', randomBytes(16), PARAMS.keylen, { ...PARAMS, maxmem })
}
