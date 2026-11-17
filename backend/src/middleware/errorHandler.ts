import type { ErrorRequestHandler, RequestHandler } from 'express'
import { env } from '../config/env.ts'
import { HttpError } from '../lib/errors.ts'

/**
 * The only place a response body is written for a failure.
 *
 * An `HttpError` is something a route decided to say, so it is passed on as
 * written. Anything else is a bug: it is logged in full here and reduced to a
 * flat 500 on the way out, because an unexpected error's message is as likely
 * to contain a connection string as a sentence.
 */

export const notFoundHandler: RequestHandler = (req, res) => {
  res.status(404).json({ message: `No route for ${req.method} ${req.path}.` })
}

export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (res.headersSent) return

  if (error instanceof HttpError) {
    res.status(error.status).json({
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
      ...(error.code ? { code: error.code } : {}),
    })
    return
  }

  // Body parser failures arrive as a plain Error with a status.
  const status = (error as { status?: number; statusCode?: number }).status
    ?? (error as { statusCode?: number }).statusCode
  if (status === 400 && error instanceof SyntaxError) {
    res.status(400).json({ message: 'That request body is not valid JSON.' })
    return
  }

  console.error(`[error] ${req.method} ${req.originalUrl}`, error)

  res.status(500).json({
    message: 'Something went wrong at our end. Please try again.',
    ...(env.isProduction ? {} : { debug: (error as Error).message }),
  })
}
