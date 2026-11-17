import { Router } from 'express'
import { z } from 'zod'
import { query } from '../../db/pool.ts'
import { badRequest, conflict, notFound } from '../../lib/errors.ts'
import { param, parseBody, requiredText, route } from '../../lib/http.ts'
import { newId } from '../../lib/ids.ts'
import { requireAdmin, requireWriter } from '../../middleware/auth.ts'
import * as partnersRepo from '../partners/repository.ts'
import * as repo from './repository.ts'

export const vehicleRoutes = Router()

const thisYear = new Date().getFullYear()

const vehicleSchema = z.object({
  partnerId: requiredText('A partner', 40),
  make: requiredText('A make', 60),
  model: requiredText('A model', 60),
  year: z.coerce
    .number()
    .int()
    .min(1990, `Enter a year from 1990 to ${thisYear + 1}.`)
    .max(thisYear + 1, `Enter a year from 1990 to ${thisYear + 1}.`),
  plate: requiredText('A plate', 30).transform((value) => value.toUpperCase()),
  vehicleClass: requiredText('A vehicle class', 40),
  seats: z.coerce.number().int().min(1, 'Enter the passenger seats, 1 to 60.').max(60),
  status: z.enum(['Available', 'Maintenance']).default('Available'),
})

async function assertReferences(input: { partnerId: string; vehicleClass: string }): Promise<void> {
  const partner = await partnersRepo.byId(input.partnerId)
  if (!partner) {
    throw badRequest('That partner does not exist.', {
      partnerId: 'Add a partner first; every vehicle belongs to one.',
    })
  }
  const classRow = await query('SELECT 1 FROM vehicle_classes WHERE id = $1', [input.vehicleClass])
  if (classRow.rowCount === 0) {
    throw badRequest('That vehicle class does not exist.', { vehicleClass: 'Choose a class we offer.' })
  }
}

async function assertPlateFree(plate: string, excludeId?: string): Promise<void> {
  const clash = await repo.byPlate(plate, excludeId)
  if (clash) {
    throw conflict(
      `Another vehicle already has the plate ${clash.plate}.`,
      'plate_taken',
    )
  }
}

vehicleRoutes.get(
  '/',
  requireAdmin,
  route(async (req, res) => {
    const partnerId = typeof req.query.partnerId === 'string' ? req.query.partnerId : undefined
    res.json(await repo.list(partnerId))
  }),
)

vehicleRoutes.post(
  '/',
  requireWriter,
  route(async (req, res) => {
    const input = parseBody(vehicleSchema, req.body)
    await assertReferences(input)
    await assertPlateFree(input.plate)
    res.status(201).json(await repo.insert(newId('v'), input))
  }),
)

vehicleRoutes.get(
  '/:id',
  requireAdmin,
  route(async (req, res) => {
    const vehicle = await repo.byId(param(req, 'id'))
    if (!vehicle) throw notFound('That vehicle')
    res.json(vehicle)
  }),
)

vehicleRoutes.put(
  '/:id',
  requireWriter,
  route(async (req, res) => {
    const input = parseBody(vehicleSchema, req.body)
    const existing = await repo.byId(param(req, 'id'))
    if (!existing) throw notFound('That vehicle')
    await assertReferences(input)
    await assertPlateFree(input.plate, param(req, 'id'))

    if (input.partnerId !== existing.partnerId) {
      const impact = await repo.deleteImpact(param(req, 'id'))
      if (impact.open > 0) {
        throw conflict(
          `This vehicle is on ${impact.open} open booking(s) (${impact.openRefs.join(', ')}). Reassign those before moving it to another partner.`,
          'vehicle_has_open_bookings',
        )
      }
    }

    if (input.status === 'Maintenance' && existing.liveStatus === 'On Trip') {
      throw conflict('That vehicle is on a trip right now.', 'vehicle_busy')
    }

    res.json(await repo.update(param(req, 'id'), input))
  }),
)

vehicleRoutes.get(
  '/:id/delete-check',
  requireAdmin,
  route(async (req, res) => {
    const vehicle = await repo.byId(param(req, 'id'))
    if (!vehicle) throw notFound('That vehicle')
    const impact = await repo.deleteImpact(param(req, 'id'))
    res.json({
      allowed: impact.open === 0,
      reason:
        impact.open > 0
          ? `This vehicle is assigned to ${impact.open} open booking(s) (${impact.openRefs.join(', ')}). Reassign them first, then delete.`
          : undefined,
      consequences: impact.past > 0 ? [`${impact.past} past booking(s) will show "Removed vehicle".`] : [],
    })
  }),
)

vehicleRoutes.delete(
  '/:id',
  requireWriter,
  route(async (req, res) => {
    const vehicle = await repo.byId(param(req, 'id'))
    if (!vehicle) throw notFound('That vehicle')

    const impact = await repo.deleteImpact(param(req, 'id'))
    if (impact.open > 0) {
      throw conflict(
        `${vehicle.make} ${vehicle.model} is assigned to ${impact.open} open booking(s) (${impact.openRefs.join(', ')}). Reassign them first, then delete.`,
        'vehicle_has_open_bookings',
      )
    }

    await repo.remove(param(req, 'id'))
    res.status(204).end()
  }),
)
