import { Router } from 'express'
import { z } from 'zod'
import { badRequest, conflict, notFound } from '../../lib/errors.ts'
import { param, parseBody, phoneField, requiredText, route } from '../../lib/http.ts'
import { newId } from '../../lib/ids.ts'
import { requireAdmin, requireWriter } from '../../middleware/auth.ts'
import * as partnersRepo from '../partners/repository.ts'
import * as repo from './repository.ts'

export const driverRoutes = Router()

const driverSchema = z.object({
  partnerId: requiredText('A partner', 40),
  name: requiredText('A name', 120),
  phone: phoneField.refine((value) => value.length > 0, 'Enter a phone number.'),
  licenceNo: requiredText('A licence number', 60),
  status: z.enum(['Available', 'Off Duty']).default('Available'),
  rating: z.coerce.number().min(0).max(5).default(0),
})

async function assertPartner(partnerId: string): Promise<void> {
  const partner = await partnersRepo.byId(partnerId)
  if (!partner) {
    throw badRequest('That partner does not exist.', { partnerId: 'Add a partner first; every driver belongs to one.' })
  }
}

driverRoutes.get(
  '/',
  requireAdmin,
  route(async (req, res) => {
    const partnerId = typeof req.query.partnerId === 'string' ? req.query.partnerId : undefined
    res.json(await repo.list(partnerId))
  }),
)

driverRoutes.post(
  '/',
  requireWriter,
  route(async (req, res) => {
    const input = parseBody(driverSchema, req.body)
    await assertPartner(input.partnerId)
    res.status(201).json(await repo.insert(newId('d'), input))
  }),
)

driverRoutes.get(
  '/:id',
  requireAdmin,
  route(async (req, res) => {
    const driver = await repo.byId(param(req, 'id'))
    if (!driver) throw notFound('That driver')
    res.json(driver)
  }),
)

driverRoutes.put(
  '/:id',
  requireWriter,
  route(async (req, res) => {
    const input = parseBody(driverSchema, req.body)
    const existing = await repo.byId(param(req, 'id'))
    if (!existing) throw notFound('That driver')
    await assertPartner(input.partnerId)

    // Moving a driver to another partner would orphan them from any trip
    // they are on, which the composite foreign key would refuse anyway.
    if (input.partnerId !== existing.partnerId) {
      const impact = await repo.deleteImpact(param(req, 'id'))
      if (impact.open > 0) {
        throw conflict(
          `${existing.name} is on ${impact.open} open booking(s) (${impact.openRefs.join(', ')}). Reassign those before moving them to another partner.`,
          'driver_has_open_bookings',
        )
      }
    }

    // Taking a driver off duty while they are mid-trip would contradict the
    // trip itself, which derives "On Trip" from the booking.
    if (input.status === 'Off Duty' && existing.liveStatus === 'On Trip') {
      throw conflict(`${existing.name} is on a trip right now.`, 'driver_busy')
    }

    res.json(await repo.update(param(req, 'id'), input))
  }),
)

driverRoutes.get(
  '/:id/delete-check',
  requireAdmin,
  route(async (req, res) => {
    const driver = await repo.byId(param(req, 'id'))
    if (!driver) throw notFound('That driver')
    const impact = await repo.deleteImpact(param(req, 'id'))
    res.json({
      allowed: impact.open === 0,
      reason:
        impact.open > 0
          ? `This driver is assigned to ${impact.open} open booking(s) (${impact.openRefs.join(', ')}). Reassign them first, then delete.`
          : undefined,
      consequences: impact.past > 0 ? [`${impact.past} past booking(s) will show "Removed driver".`] : [],
    })
  }),
)

driverRoutes.delete(
  '/:id',
  requireWriter,
  route(async (req, res) => {
    const driver = await repo.byId(param(req, 'id'))
    if (!driver) throw notFound('That driver')

    const impact = await repo.deleteImpact(param(req, 'id'))
    if (impact.open > 0) {
      throw conflict(
        `${driver.name} is assigned to ${impact.open} open booking(s) (${impact.openRefs.join(', ')}). Reassign them first, then delete.`,
        'driver_has_open_bookings',
      )
    }

    // Past bookings keep their row; the foreign key sets driver_id to null,
    // which is what makes them read "Removed driver".
    await repo.remove(param(req, 'id'))
    res.status(204).end()
  }),
)
