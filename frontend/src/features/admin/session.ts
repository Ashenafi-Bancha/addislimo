/**
 * Admin sign-in session.
 *
 * This is a UI gate, not security. It stops the console opening for someone
 * who types `#/admin` without signing in, but anyone can read the credentials
 * out of the bundle. Real authentication belongs to the backend
 * (`POST /auth/login` in `lib/api/endpoints.ts`), which will issue an
 * HTTP-only session cookie; when that lands, `signIn` calls it and this file
 * stops checking a password itself.
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

/** Prototype credentials. Shown on the sign-in page in development only. */
export const DEMO_CREDENTIALS = { email: 'admin@addislimo.com', password: 'admin@2026' } as const

const DEMO_ACCOUNT: AdminSession = {
  email: DEMO_CREDENTIALS.email,
  name: 'Operations Admin',
  role: 'Administrator',
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

export function signIn(email: string, password: string): AdminSession | null {
  const ok =
    email.trim().toLowerCase() === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
  if (!ok) return null
  memorySession = DEMO_ACCOUNT
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_ACCOUNT))
  } catch {
    // Storage unavailable: the session holds for this page load only.
  }
  return DEMO_ACCOUNT
}

export function signOut() {
  memorySession = null
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing stored, nothing to clear.
  }
}
