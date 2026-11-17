import { Router } from 'express'
import { z } from 'zod'
import { query } from '../../db/pool.ts'
import { notFound } from '../../lib/errors.ts'
import { parseBody, route } from '../../lib/http.ts'
import { requireRole } from '../../middleware/auth.ts'
import type { ServiceOption, VehicleOption } from '../../types/index.ts'

/**
 * The catalogue the booking wizard is built from: the services in step 1 and
 * the vehicle classes in step 4.
 *
 * Public to read — the wizard needs it before anyone signs in — and admin to
 * write, because the fares here are what `quotes/pricing.ts` multiplies.
 */

export const serviceRoutes = Router()

interface ServiceRow {
  id: string
  label: string
  description: string
  base_fare: number
  sort_order: number
  active: boolean
}

interface ClassRow {
  id: string
  label: string
  capacity_label: string
  note: string
  img: string
  multiplier: number
  seats_min: number
  seats_max: number
}

const toService = (row: ServiceRow): ServiceOption => ({
  id: row.id,
  label: row.label,
  desc: row.description,
  baseFare: Number(row.base_fare),
})

const toClass = (row: ClassRow): VehicleOption => ({
  id: row.id,
  label: row.label,
  capacity: row.capacity_label,
  img: row.img,
  note: row.note,
  seatsMin: row.seats_min,
  seatsMax: row.seats_max,
})

serviceRoutes.get(
  '/',
  route(async (_req, res) => {
    const result = await query<ServiceRow>(
      'SELECT id, label, description, base_fare, sort_order, active FROM services WHERE active ORDER BY sort_order, label',
    )
    res.json(result.rows.map(toService))
  }),
)

serviceRoutes.get(
  '/vehicle-classes',
  route(async (_req, res) => {
    const result = await query<ClassRow>(
      'SELECT id, label, capacity_label, note, img, multiplier, seats_min, seats_max FROM vehicle_classes ORDER BY sort_order, label',
    )
    res.json(result.rows.map(toClass))
  }),
)

/** Repricing a service. Only a full admin: this changes what customers pay. */
serviceRoutes.patch(
  '/:id',
  requireRole('admin'),
  route(async (req, res) => {
    const patch = parseBody(
      z.object({
        label: z.string().trim().min(1).max(120).optional(),
        description: z.string().trim().max(400).optional(),
        baseFare: z.coerce.number().min(0).max(1_000_000).optional(),
        active: z.boolean().optional(),
      }),
      req.body,
    )

    const result = await query<ServiceRow>(
      `UPDATE services
          SET label       = COALESCE($2, label),
              description = COALESCE($3, description),
              base_fare   = COALESCE($4, base_fare),
              active      = COALESCE($5, active)
        WHERE id = $1
        RETURNING id, label, description, base_fare, sort_order, active`,
      [req.params.id, patch.label ?? null, patch.description ?? null, patch.baseFare ?? null, patch.active ?? null],
    )

    const row = result.rows[0]
    if (!row) throw notFound('That service')
    res.json(toService(row))
  }),
)
