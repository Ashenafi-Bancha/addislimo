import type { NextFunction, Request, RequestHandler, Response } from 'express'
import { z } from 'zod'
import { badRequest, HttpError } from './errors.ts'

/**
 * The small amount of plumbing between Express and a route handler.
 */

/**
 * Express 5 forwards a rejected promise to the error handler on its own, but
 * only for handlers it recognises as returning one. Wrapping is still the
 * clearer contract: every async route is explicitly tied to the error
 * middleware rather than relying on a framework detail.
 */
export function route(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    handler(req, res, next).catch(next)
  }
}

/**
 * A path parameter, proven to exist.
 *
 * `req.params.id` is typed `string | undefined`, which is honest: nothing ties
 * the handler to the pattern that matched it. Rather than assert it away at
 * twenty call sites, this checks once and 404s if a route is ever mounted
 * without the parameter it reads.
 */
export function param(req: Request, name: string): string {
  const value = req.params[name]
  if (typeof value !== 'string' || value.length === 0) {
    throw new HttpError(404, 'That address is missing part of its path.')
  }
  return value
}

/** Turns a Zod failure into the field map the frontend forms already render. */
function toDetails(error: z.ZodError): Record<string, string> {
  const details: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_'
    details[key] ??= issue.message
  }
  return details
}

export function parseBody<T extends z.ZodTypeAny>(schema: T, body: unknown): z.infer<T> {
  const result = schema.safeParse(body)
  if (!result.success) {
    throw badRequest('Some of these details need fixing.', toDetails(result.error))
  }
  return result.data
}

export function parseQuery<T extends z.ZodTypeAny>(schema: T, query: unknown): z.infer<T> {
  const result = schema.safeParse(query)
  if (!result.success) {
    throw badRequest('That filter is not valid.', toDetails(result.error))
  }
  return result.data
}

/* ── Field types used across more than one module ── */

export const trimmed = (max: number) => z.string().trim().max(max)

export const requiredText = (field: string, max = 200) =>
  z.string().trim().min(1, `${field} is required.`).max(max, `${field} is too long.`)

export const emailField = z
  .string()
  .trim()
  .min(1, 'An email address is required.')
  .max(254)
  .email('Enter a valid email address.')
  .transform((value) => value.toLowerCase())

export const phoneField = z
  .string()
  .trim()
  .max(40)
  .refine((value) => value === '' || value.replace(/\D/g, '').length >= 7, {
    message: 'Enter a reachable phone number.',
  })

/** An ISO timestamp, or a `YYYY-MM-DD` date, as a Date. */
export const isoDate = z
  .string()
  .trim()
  .refine((value) => !Number.isNaN(Date.parse(value)), { message: 'Enter a valid date.' })
  .transform((value) => new Date(value))

/** Query strings arrive as strings; this reads a positive integer out of one. */
export const positiveInt = (fallback: number, max: number) =>
  z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => (value === undefined || value === '' ? fallback : Number(value)))
    .refine((value) => Number.isInteger(value) && value > 0 && value <= max, {
      message: `Enter a whole number from 1 to ${max}.`,
    })
