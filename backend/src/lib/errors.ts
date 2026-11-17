/**
 * The errors a route is allowed to throw.
 *
 * `frontend/src/lib/api/client.ts` reads `message` off a JSON error body and
 * shows it, so every message here is written for the person who will read it
 * on screen, not for a log line. Anything that is not an `HttpError` is a bug
 * and becomes a flat 500 with no detail, because an unexpected error's message
 * is as likely to be a connection string as a sentence.
 *
 * The fields are assigned in the constructor body rather than declared as
 * parameter properties: Node runs this file with `--experimental-strip-types`,
 * which erases types and refuses any TypeScript that would have emitted code
 * of its own.
 */

export class HttpError extends Error {
  readonly status: number
  /** Field-level problems, keyed by field name. */
  readonly details: Record<string, string> | undefined
  /** A stable string the client can branch on, where the status is not enough. */
  readonly code: string | undefined

  constructor(
    status: number,
    message: string,
    details?: Record<string, string>,
    code?: string,
  ) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.details = details
    this.code = code
  }
}

export const badRequest = (message: string, details?: Record<string, string>) =>
  new HttpError(400, message, details)

export const unauthorized = (message = 'Sign in to continue.') => new HttpError(401, message)

export const forbidden = (message = 'You do not have access to this.') => new HttpError(403, message)

export const notFound = (what = 'That record') => new HttpError(404, `${what} was not found.`)

/**
 * The record exists but the request would break a rule — a partner with
 * bookings, a driver already on a trip. `guards.ts` in the admin console asks
 * the same questions before offering a confirm button; this is the server
 * refusing when something got past it.
 */
export const conflict = (message: string, code?: string) =>
  new HttpError(409, message, undefined, code)

export const tooManyRequests = (message: string) => new HttpError(429, message)

export const unprocessable = (message: string, details?: Record<string, string>) =>
  new HttpError(422, message, details)
