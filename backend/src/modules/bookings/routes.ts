import { Router } from 'express'
import { z } from 'zod'
import {
  emailField,
  isoDate,
  param,
  parseBody,
  parseQuery,
  phoneField,
  positiveInt,
  requiredText,
  route,
} from '../../lib/http.ts'
import { requireAdmin, requireWriter } from '../../middleware/auth.ts'
import { rateLimit } from '../../middleware/rateLimit.ts'
import { BOOKING_STATUSES } from './status.ts'
import {
  createBooking,
  deleteBooking,
  getBookingWithHistory,
  listBookings,
  updateBooking,
} from './service.ts'

export const bookingRoutes = Router()

const statusField = z.enum(BOOKING_STATUSES)

/* ── Public: the booking wizard ── */

const createSchema = z.object({
  customerName: requiredText('A name', 120),
  customerEmail: emailField,
  customerPhone: phoneField.default(''),
  serviceId: requiredText('A service', 40),
  pickup: requiredText('A pickup location', 300),
  destination: requiredText('A destination', 300),
  scheduledAt: isoDate,
  passengers: z.coerce.number().int().min(1, 'At least one passenger.').max(60),
  luggage: z.coerce.number().int().min(0).max(60).default(0),
  vehicleClass: requiredText('A vehicle class', 40),
  notes: z.string().trim().max(2000).default(''),
})

/**
 * The public endpoint, so it is the one that gets abused. The limit is
 * generous enough for a family booking three airport runs in a row and tight
 * enough that a script cannot fill the dispatch board.
 */
const createLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'That is a lot of bookings from one place. Call the dispatch desk and we will sort it out.',
})

bookingRoutes.post(
  '/',
  createLimit,
  route(async (req, res) => {
    const input = parseBody(createSchema, req.body)
    const booking = await createBooking(input)
    // The reference is what the customer quotes on the phone, so it leads.
    res.status(201).json({
      reference: booking.id,
      booking,
      message: 'Booking received. Dispatch will confirm your vehicle and chauffeur shortly.',
    })
  }),
)

/* ── Admin ── */

const listSchema = z.object({
  status: statusField.optional(),
  from: isoDate.optional(),
  to: isoDate.optional(),
  q: z.string().trim().max(200).optional(),
  partnerId: z.string().trim().max(40).optional(),
  driverId: z.string().trim().max(40).optional(),
  customerEmail: z.string().trim().max(254).optional(),
  limit: positiveInt(200, 1000),
  offset: z
    .union([z.string(), z.number()])
    .optional()
    .transform((value) => (value === undefined || value === '' ? 0 : Number(value)))
    .refine((value) => Number.isInteger(value) && value >= 0, 'Offset must be zero or more.'),
})

bookingRoutes.get(
  '/',
  requireAdmin,
  route(async (req, res) => {
    const filters = parseQuery(listSchema, req.query)
    res.json(await listBookings(filters))
  }),
)

bookingRoutes.get(
  '/:id',
  requireAdmin,
  route(async (req, res) => {
    res.json(await getBookingWithHistory(param(req, 'id')))
  }),
)

const updateSchema = z
  .object({
    customerName: requiredText('A name', 120).optional(),
    customerEmail: emailField.optional(),
    customerPhone: phoneField.optional(),
    serviceId: z.string().trim().max(40).optional(),
    pickup: requiredText('A pickup location', 300).optional(),
    destination: requiredText('A destination', 300).optional(),
    scheduledAt: isoDate.optional(),
    passengers: z.coerce.number().int().min(1).max(60).optional(),
    luggage: z.coerce.number().int().min(0).max(60).optional(),
    vehicleClass: z.string().trim().max(40).nullable().optional(),
    partnerId: z.string().trim().max(40).nullable().optional(),
    driverId: z.string().trim().max(40).nullable().optional(),
    vehicleId: z.string().trim().max(40).nullable().optional(),
    amount: z.coerce.number().min(0).max(10_000_000).optional(),
    status: statusField.optional(),
    notes: z.string().trim().max(2000).optional(),
    cancelledReason: z.string().trim().max(500).optional(),
  })
  .refine((body) => Object.keys(body).length > 0, { message: 'Nothing to change.' })

bookingRoutes.patch(
  '/:id',
  requireWriter,
  route(async (req, res) => {
    const patch = parseBody(updateSchema, req.body)
    res.json(await updateBooking(param(req, 'id'), patch, req.admin!.email))
  }),
)

/** The status dropdown, separated so the audit trail records the reason. */
bookingRoutes.patch(
  '/:id/status',
  requireWriter,
  route(async (req, res) => {
    const body = parseBody(
      z.object({ status: statusField, cancelledReason: z.string().trim().max(500).optional() }),
      req.body,
    )
    res.json(await updateBooking(param(req, 'id'), body, req.admin!.email))
  }),
)

bookingRoutes.delete(
  '/:id',
  requireWriter,
  route(async (req, res) => {
    await deleteBooking(param(req, 'id'), req.admin!.email)
    res.status(204).end()
  }),
)
