import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { forbidden, unauthorized } from '../lib/errors.ts'
import { accountForToken, SESSION_COOKIE } from '../modules/auth/service.ts'
import type { AdminAccount } from '../types/index.ts'

/**
 * Who is calling, and whether they are allowed to.
 *
 * Every admin route goes through `requireAdmin`. Nothing trusts a header, an
 * id in the body or anything else the browser can choose: the only input is
 * the session cookie, and the account comes from the database each time, so
 * disabling an account or signing it out takes effect on the next request
 * rather than whenever a token happens to expire.
 */

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminAccount
      sessionToken?: string
    }
  }
}

/** Reads the session if there is one, without requiring it. */
export const loadSession: RequestHandler = (req, _res, next) => {
  const token = req.cookies?.[SESSION_COOKIE]
  if (typeof token !== 'string' || token.length === 0) return next()

  accountForToken(token)
    .then((account) => {
      if (account) {
        req.admin = account
        req.sessionToken = token
      }
      next()
    })
    .catch(next)
}

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  if (!req.admin) {
    next(unauthorized('Sign in to the admin console to do that.'))
    return
  }
  next()
}

/**
 * Roles, for when the client adds dispatchers who should not be able to
 * change commission rates or delete a customer's history.
 */
export function requireRole(...roles: AdminAccount['role'][]): RequestHandler {
  return (req, _res, next) => {
    if (!req.admin) {
      next(unauthorized('Sign in to the admin console to do that.'))
      return
    }
    if (!roles.includes(req.admin.role)) {
      next(forbidden('Your account does not have access to this.'))
      return
    }
    next()
  }
}

/** `viewer` accounts can read everything and change nothing. */
export const requireWriter = requireRole('admin', 'dispatcher')
