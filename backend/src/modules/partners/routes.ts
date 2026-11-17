import { Router } from 'express'
import { z } from 'zod'
import { query } from '../../db/pool.ts'
import { conflict, notFound } from '../../lib/errors.ts'
import { emailField, param, parseBody, phoneField, requiredText, route } from '../../lib/http.ts'
import { newId } from '../../lib/ids.ts'
import { requireAdmin, requireWriter } from '../../middleware/auth.ts'
import * as repo from './repository.ts'

export const partnerRoutes = Router()

const partnerSchema = z.object({
  name: requiredText('A business name', 160),
  type: z.enum(['Transport Company', 'Vehicle Owner', 'Tour Operator', 'Events Transport']),
  contactName: requiredText('A contact person', 120),
  phone: phoneField.refine((value) => value.length > 0, 'Enter a phone number.'),
  email: emailField,
  commissionRate: z.coerce
    .number()
    .min(0, 'Enter a percentage from 0 to 50.')
    .max(50, 'Enter a percentage from 0 to 50.'),
  status: z.enum(['Active', 'Pending', 'Suspended']).default('Active'),
})

partnerRoutes.get(
  '/',
  requireAdmin,
  route(async (_req, res) => {
    res.json(await repo.list())
  }),
)

partnerRoutes.get(
  '/:id',
  requireAdmin,
  route(async (req, res) => {
    const partner = await repo.byId(param(req, 'id'))
    if (!partner) throw notFound('That partner')
    res.json(partner)
  }),
)

partnerRoutes.post(
  '/',
  requireWriter,
  route(async (req, res) => {
    const input = parseBody(partnerSchema, req.body)
    res.status(201).json(await repo.insert(newId('p'), input))
  }),
)

partnerRoutes.put(
  '/:id',
  requireWriter,
  route(async (req, res) => {
    const input = parseBody(partnerSchema, req.body)
    const existing = await repo.byId(param(req, 'id'))
    if (!existing) throw notFound('That partner')
    // Changing the rate changes what future trips earn. Trips already priced
    // keep the commission stored on them — see bookings/service.ts.
    res.json(await repo.update(param(req, 'id'), input))
  }),
)

partnerRoutes.patch(
  '/:id/status',
  requireWriter,
  route(async (req, res) => {
    const { status } = parseBody(
      z.object({ status: z.enum(['Active', 'Pending', 'Suspended']) }),
      req.body,
    )

    if (status === 'Suspended') {
      // Suspending is how a partner with history is retired, so it must not
      // strand a trip that is happening right now.
      const live = await query<{ id: string }>(
        `SELECT id FROM bookings
          WHERE partner_id = $1 AND status IN ('Driver En Route', 'In Progress') LIMIT 3`,
        [param(req, 'id')],
      )
      if (live.rowCount && live.rowCount > 0) {
        throw conflict(
          `This partner has a trip under way (${live.rows.map((r) => r.id).join(', ')}). Suspend them once it has finished.`,
          'partner_has_live_trip',
        )
      }
    }

    const partner = await repo.setStatus(param(req, 'id'), status)
    if (!partner) throw notFound('That partner')
    res.json(partner)
  }),
)

/**
 * What deleting would cost, so the console can show it before asking. The
 * same figures the confirmation dialog in `guards.ts` renders.
 */
partnerRoutes.get(
  '/:id/delete-check',
  requireAdmin,
  route(async (req, res) => {
    const partner = await repo.byId(param(req, 'id'))
    if (!partner) throw notFound('That partner')
    const impact = await repo.deleteImpact(param(req, 'id'))
    const consequences: string[] = []
    if (impact.vehicles) consequences.push(`Their ${impact.vehicles} vehicle(s) will be deleted too.`)
    if (impact.drivers) consequences.push(`Their ${impact.drivers} driver(s) will be deleted too.`)
    res.json({
      allowed: impact.bookings === 0,
      reason:
        impact.bookings > 0
          ? `This partner has ${impact.bookings} booking(s) on record, and deleting them would erase commission and payout history. Suspend the partner instead: they stop receiving trips and their history stays.`
          : undefined,
      consequences,
    })
  }),
)

partnerRoutes.delete(
  '/:id',
  requireWriter,
  route(async (req, res) => {
    const partner = await repo.byId(param(req, 'id'))
    if (!partner) throw notFound('That partner')

    const impact = await repo.deleteImpact(param(req, 'id'))
    if (impact.bookings > 0) {
      throw conflict(
        `${partner.name} has ${impact.bookings} booking(s) on record. Deleting them would erase commission and payout history — suspend them instead.`,
        'partner_has_bookings',
      )
    }

    await repo.remove(param(req, 'id'))
    res.status(204).end()
  }),
)
