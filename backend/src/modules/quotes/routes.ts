import { Router } from 'express'
import { z } from 'zod'
import { isoDate, parseBody, requiredText, route } from '../../lib/http.ts'
import { rateLimit } from '../../middleware/rateLimit.ts'
import { quote } from './pricing.ts'

/**
 * What a trip would cost, without booking it.
 *
 * Public, so the wizard can show a figure at step 4 rather than asking
 * someone to commit to an unnamed price. It writes nothing, which is why the
 * rate limit is loose compared to the one on creating a booking.
 */

export const quoteRoutes = Router()

quoteRoutes.post(
  '/estimate',
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    message: 'Too many quote requests. Slow down a moment.',
  }),
  route(async (req, res) => {
    const input = parseBody(
      z.object({
        serviceId: requiredText('A service', 40),
        vehicleClassId: requiredText('A vehicle class', 40),
        passengers: z.coerce.number().int().min(1).max(60).default(1),
        scheduledAt: isoDate.optional(),
      }),
      req.body,
    )

    res.json(
      await quote({
        serviceId: input.serviceId,
        vehicleClassId: input.vehicleClassId,
        passengers: input.passengers,
        scheduledAt: input.scheduledAt ?? new Date(),
      }),
    )
  }),
)
