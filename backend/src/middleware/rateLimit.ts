import type { RequestHandler } from 'express'
import { tooManyRequests } from '../lib/errors.ts'

/**
 * A fixed-window limiter, in memory.
 *
 * It exists to stop one browser hammering the public booking endpoint, not to
 * stop a distributed attack: a single process cannot. Sign-in has a second,
 * stricter limit that survives restarts because it counts rows in
 * `login_attempts` — see `modules/auth/service.ts`.
 *
 * Behind more than one instance this becomes per-instance, at which point it
 * moves to Redis. The shape of the call does not change when it does.
 */

interface Window {
  count: number
  resetAt: number
}

export function rateLimit(options: {
  windowMs: number
  max: number
  message: string
  /** Defaults to the caller's IP. */
  key?: (req: Parameters<RequestHandler>[0]) => string
}): RequestHandler {
  const windows = new Map<string, Window>()
  let lastSweep = Date.now()

  return (req, res, next) => {
    const now = Date.now()

    // Sweep expired keys occasionally, so a long-running process does not
    // accumulate a window per address it has ever seen.
    if (now - lastSweep > options.windowMs) {
      for (const [key, window] of windows) {
        if (window.resetAt <= now) windows.delete(key)
      }
      lastSweep = now
    }

    const key = options.key?.(req) ?? req.ip ?? 'unknown'
    const window = windows.get(key)

    if (!window || window.resetAt <= now) {
      windows.set(key, { count: 1, resetAt: now + options.windowMs })
      next()
      return
    }

    window.count += 1
    if (window.count > options.max) {
      const seconds = Math.ceil((window.resetAt - now) / 1000)
      res.setHeader('Retry-After', String(seconds))
      next(tooManyRequests(options.message))
      return
    }

    next()
  }
}
