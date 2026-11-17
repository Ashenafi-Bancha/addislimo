import { createHash } from 'node:crypto'
import { env } from '../../config/env.ts'
import { query, queryOne } from '../../db/pool.ts'
import { unauthorized, tooManyRequests } from '../../lib/errors.ts'
import { newId, newSessionToken } from '../../lib/ids.ts'
import { fakeVerify, hashPassword, verifyPassword } from '../../lib/password.ts'
import type { AdminAccount } from '../../types/index.ts'

/**
 * Admin sign-in.
 *
 * This replaces the UI gate in `frontend/src/features/admin/session.ts`, whose
 * one account was hard-coded and readable in the JavaScript bundle. What
 * changes here: the password is a scrypt hash nobody can reverse, the browser
 * holds an opaque token rather than a claim it can edit, signing out actually
 * revokes it, and the server decides who you are on every request.
 *
 * The token is stored hashed. A leaked database backup is then a list of
 * useless digests rather than a set of working sessions.
 */

const MAX_FAILURES = 5
const LOCKOUT_MINUTES = 15

export const SESSION_COOKIE = 'addislimo_session'

const hashToken = (token: string): string => createHash('sha256').update(token).digest('hex')

interface AdminRow {
  id: string
  email: string
  password_hash: string
  name: string
  role: AdminAccount['role']
  active: boolean
}

export function toAccount(row: Pick<AdminRow, 'id' | 'email' | 'name' | 'role'>): AdminAccount {
  return { id: row.id, email: row.email, name: row.name, role: row.role }
}

/**
 * Recent failures for this email, so a restart does not hand an attacker a
 * fresh allowance. Counted per account rather than per IP: the account is
 * what is being attacked, and an IP is cheap to change.
 */
async function recentFailures(email: string): Promise<number> {
  const row = await queryOne<{ failures: number }>(
    `SELECT count(*)::bigint AS failures
       FROM login_attempts
      WHERE lower(email) = lower($1)
        AND successful = false
        AND at > now() - ($2 || ' minutes')::interval
        AND at > COALESCE(
              (SELECT max(at) FROM login_attempts
                WHERE lower(email) = lower($1) AND successful = true),
              '-infinity'::timestamptz)`,
    [email, LOCKOUT_MINUTES],
  )
  return Number(row?.failures ?? 0)
}

async function recordAttempt(email: string, ip: string, successful: boolean): Promise<void> {
  await query('INSERT INTO login_attempts (email, ip, successful) VALUES ($1, $2, $3)', [
    email,
    ip,
    successful,
  ])
}

export interface SignInResult {
  account: AdminAccount
  token: string
  expiresAt: Date
}

export async function signIn(
  email: string,
  password: string,
  context: { ip: string; userAgent: string },
): Promise<SignInResult> {
  const failures = await recentFailures(email)
  if (failures >= MAX_FAILURES) {
    throw tooManyRequests(
      `Too many failed attempts. Try again in ${LOCKOUT_MINUTES} minutes, or reset the password.`,
    )
  }

  const row = await queryOne<AdminRow>(
    `SELECT id, email, password_hash, name, role, active
       FROM admin_users WHERE lower(email) = lower($1)`,
    [email],
  )

  // Unknown email still pays for a hash, so the response time cannot be used
  // to work out which addresses have accounts.
  const ok = row ? await verifyPassword(password, row.password_hash) : (await fakeVerify(), false)

  if (!row || !ok || !row.active) {
    await recordAttempt(email, context.ip, false)
    // One message for every failure: wrong password, unknown account and
    // disabled account are indistinguishable from outside.
    throw unauthorized('That email and password do not match an account.')
  }

  await recordAttempt(email, context.ip, true)

  const token = newSessionToken()
  const expiresAt = new Date(Date.now() + env.sessionHours * 60 * 60 * 1000)
  await query(
    `INSERT INTO admin_sessions (token_hash, admin_id, expires_at, user_agent, ip)
     VALUES ($1, $2, $3, $4, $5)`,
    [hashToken(token), row.id, expiresAt, context.userAgent.slice(0, 500), context.ip],
  )
  await query('UPDATE admin_users SET last_login_at = now() WHERE id = $1', [row.id])

  // Housekeeping on a path that already writes, rather than a timer that has
  // to be kept alive and monitored.
  await query('DELETE FROM admin_sessions WHERE expires_at < now()')

  return { account: toAccount(row), token, expiresAt }
}

/** The account a token belongs to, or `null` if it is unknown or expired. */
export async function accountForToken(token: string): Promise<AdminAccount | null> {
  const row = await queryOne<AdminRow>(
    `SELECT u.id, u.email, u.password_hash, u.name, u.role, u.active
       FROM admin_sessions s
       JOIN admin_users u ON u.id = s.admin_id
      WHERE s.token_hash = $1 AND s.expires_at > now() AND u.active`,
    [hashToken(token)],
  )
  return row ? toAccount(row) : null
}

export async function signOut(token: string): Promise<void> {
  await query('DELETE FROM admin_sessions WHERE token_hash = $1', [hashToken(token)])
}

/** Every other session for this admin, e.g. after a password change. */
export async function signOutEverywhere(adminId: string): Promise<void> {
  await query('DELETE FROM admin_sessions WHERE admin_id = $1', [adminId])
}

export async function changePassword(
  adminId: string,
  currentPassword: string,
  nextPassword: string,
): Promise<void> {
  const row = await queryOne<AdminRow>(
    'SELECT id, email, password_hash, name, role, active FROM admin_users WHERE id = $1',
    [adminId],
  )
  if (!row || !(await verifyPassword(currentPassword, row.password_hash))) {
    throw unauthorized('That is not your current password.')
  }
  await query('UPDATE admin_users SET password_hash = $2 WHERE id = $1', [
    adminId,
    await hashPassword(nextPassword),
  ])
  // Signing every other device out is the point of changing a password.
  await signOutEverywhere(adminId)
}

export async function createAdmin(input: {
  email: string
  password: string
  name: string
  role?: AdminAccount['role']
}): Promise<AdminAccount> {
  const id = newId('u')
  const row = await queryOne<AdminRow>(
    `INSERT INTO admin_users (id, email, password_hash, name, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, password_hash, name, role, active`,
    [id, input.email.toLowerCase(), await hashPassword(input.password), input.name, input.role ?? 'admin'],
  )
  return toAccount(row!)
}

export async function countAdmins(): Promise<number> {
  const row = await queryOne<{ total: number }>('SELECT count(*)::bigint AS total FROM admin_users')
  return Number(row?.total ?? 0)
}
