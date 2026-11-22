import { isApiConfigured } from '@/config/env'
import { api, endpoints } from '@/lib/api'

/**
 * Admin sign-in.
 *
 * With `VITE_API_URL` set this is real: `POST /auth/login` checks a scrypt
 * hash on the server and sets an httpOnly session cookie the page cannot
 * read, the account is re-read from the database on every request, and
 * signing out revokes the session rather than forgetting it locally. What is
 * kept in this browser is a name to put in the corner of the screen, not a
 * claim of access — deleting it signs nobody in.
 *
 * Without an API it falls back to the prototype gate it has always been:
 * one hard-coded account, readable by anyone who opens the bundle. That path
 * exists because the deployed site has no backend yet, and it stops the
 * console becoming unreachable in that build. It is not security, and the
 * moment `VITE_API_URL` is set it is not used.
 */

export interface AdminSession {
  email: string
  name: string
  role: string
}

const STORAGE_KEY = 'addislimo.admin.session'

/**
 * Fallback for when sessionStorage is unavailable. Without it, sign-in would
 * succeed but the dashboard guard would read nothing back and bounce the
 * admin straight back to the sign-in page.
 */
let memorySession: AdminSession | null = null

/** Prototype credentials, used only in a build with no API. Never displayed. */
export const DEMO_CREDENTIALS = { email: 'admin@addislimo.com', password: 'admin@2026' } as const

const DEMO_ACCOUNT: AdminSession = {
  email: DEMO_CREDENTIALS.email,
  name: 'Operations Admin',
  role: 'Administrator',
}

function remember(session: AdminSession | null): void {
  memorySession = session
  try {
    if (session) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    else window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable: the session holds for this page load only.
  }
}

/** Reads storage defensively: private windows and blocked storage throw. */
export function getSession(): AdminSession | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as AdminSession) : memorySession
  } catch {
    return memorySession
  }
}

interface AuthResponse {
  account: { email: string; name: string; role: string }
}

export async function signIn(email: string, password: string): Promise<AdminSession | null> {
  if (!isApiConfigured) {
    const ok =
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
    if (!ok) return null
    remember(DEMO_ACCOUNT)
    return DEMO_ACCOUNT
  }

  // A wrong password is a 401, which the client throws; the caller turns it
  // into the message under the form. Anything else is a real failure and is
  // allowed to propagate rather than being reported as "wrong password".
  const response = await api.post<AuthResponse>(endpoints.auth.login, { email, password })
  const session: AdminSession = {
    email: response.account.email,
    name: response.account.name,
    role: response.account.role,
  }
  remember(session)
  return session
}

/**
 * Asks the server who this browser is. The cookie is httpOnly, so this is the
 * only way to find out, and it is what makes a revoked or expired session
 * take effect: the console calls it on load and sends the admin back to the
 * sign-in page when it comes back empty.
 */
export async function restoreSession(): Promise<AdminSession | null> {
  if (!isApiConfigured) return getSession()
  try {
    const response = await api.get<AuthResponse>(endpoints.auth.me)
    const session: AdminSession = {
      email: response.account.email,
      name: response.account.name,
      role: response.account.role,
    }
    remember(session)
    return session
  } catch {
    remember(null)
    return null
  }
}

export async function signOut(): Promise<void> {
  remember(null)
  if (!isApiConfigured) return
  try {
    await api.post(endpoints.auth.logout)
  } catch {
    // The local session is already gone; a failed revoke is not worth
    // blocking the sign-out the admin asked for.
  }
}
