import { Router } from 'express'
import { z } from 'zod'
import { env } from '../../config/env.ts'
import { emailField, parseBody, route } from '../../lib/http.ts'
import { requireAdmin } from '../../middleware/auth.ts'
import { rateLimit } from '../../middleware/rateLimit.ts'
import { changePassword, SESSION_COOKIE, signIn, signOut } from './service.ts'

export const authRoutes = Router()

const credentials = z.object({
  email: emailField,
  password: z.string().min(1, 'Enter your password.').max(200),
})

/**
 * The cookie the browser gets. `httpOnly` keeps it away from any script on the
 * page, so a content-injection bug cannot read it; `sameSite: 'lax'` means a
 * form on another site cannot ride it; `secure` in production means it never
 * travels in the clear.
 *
 * The frontend and the API sit on different hosts in production, so the
 * cookie must be `SameSite=None; Secure` there — set CROSS_SITE_COOKIE=1 when
 * that is the deployment, and give the API a subdomain of the site when it is
 * not, which is both simpler and safer.
 */
function cookieOptions(expires: Date) {
  const crossSite = process.env.CROSS_SITE_COOKIE === '1'
  return {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: crossSite ? ('none' as const) : ('lax' as const),
    expires,
    path: '/',
  }
}

/**
 * A slow outer limit on top of the per-account lockout in the service. The
 * lockout stops one account being ground down; this stops one address working
 * through a list of them.
 */
const loginLimit = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: 'Too many sign-in attempts from this address. Wait a few minutes.',
})

authRoutes.post(
  '/login',
  loginLimit,
  route(async (req, res) => {
    const { email, password } = parseBody(credentials, req.body)
    const result = await signIn(email, password, {
      ip: req.ip ?? '',
      userAgent: req.get('user-agent') ?? '',
    })
    res.cookie(SESSION_COOKIE, result.token, cookieOptions(result.expiresAt))
    res.json({ account: result.account, expiresAt: result.expiresAt.toISOString() })
  }),
)

authRoutes.post(
  '/logout',
  route(async (req, res) => {
    if (req.sessionToken) await signOut(req.sessionToken)
    res.clearCookie(SESSION_COOKIE, { path: '/' })
    res.status(204).end()
  }),
)

/** The console calls this on load to decide whether to show the sign-in page. */
authRoutes.get('/me', (req, res) => {
  if (!req.admin) {
    res.status(401).json({ message: 'Not signed in.' })
    return
  }
  res.json({ account: req.admin })
})

authRoutes.post(
  '/password',
  requireAdmin,
  route(async (req, res) => {
    const body = parseBody(
      z.object({
        currentPassword: z.string().min(1, 'Enter your current password.'),
        newPassword: z
          .string()
          .min(10, 'Use at least 10 characters.')
          .max(200)
          .refine((value) => value.trim().length >= 10, 'Use at least 10 characters.'),
      }),
      req.body,
    )
    await changePassword(req.admin!.id, body.currentPassword, body.newPassword)
    res.clearCookie(SESSION_COOKIE, { path: '/' })
    res.json({ message: 'Password changed. Sign in again with the new one.' })
  }),
)
