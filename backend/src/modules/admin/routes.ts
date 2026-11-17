import { Router } from 'express'
import { z } from 'zod'
import { query, queryOne } from '../../db/pool.ts'
import { isoDate, parseBody, parseQuery, positiveInt, route } from '../../lib/http.ts'
import { requireAdmin, requireRole, requireWriter } from '../../middleware/auth.ts'
import type { AdminSettings } from '../../types/index.ts'
import { metrics, openBoard, payouts } from './metrics.ts'

export const adminRoutes = Router()

adminRoutes.use(requireAdmin)

adminRoutes.get(
  '/metrics',
  route(async (req, res) => {
    const { days, chartDays } = parseQuery(
      z.object({ days: positiveInt(7, 365), chartDays: positiveInt(14, 365) }),
      req.query,
    )
    res.json(await metrics(days, chartDays))
  }),
)

adminRoutes.get(
  '/payouts',
  route(async (req, res) => {
    const range = parseQuery(
      z.object({ from: isoDate.optional(), to: isoDate.optional() }),
      req.query,
    )
    res.json(await payouts(range.from, range.to))
  }),
)

/** The dispatcher's board: everything still to be fulfilled, soonest first. */
adminRoutes.get(
  '/board',
  route(async (_req, res) => {
    res.json(await openBoard())
  }),
)

/* ── Settings ── */

interface SettingsRow {
  default_commission_rate: number
  notify_new_booking: boolean
  notify_cancellation: boolean
  daily_summary: boolean
}

const toSettings = (row: SettingsRow): AdminSettings => ({
  defaultCommissionRate: Number(row.default_commission_rate),
  notifyNewBooking: row.notify_new_booking,
  notifyCancellation: row.notify_cancellation,
  dailySummary: row.daily_summary,
})

adminRoutes.get(
  '/settings',
  route(async (_req, res) => {
    const row = await queryOne<SettingsRow>(
      'SELECT default_commission_rate, notify_new_booking, notify_cancellation, daily_summary FROM settings WHERE id',
    )
    res.json(toSettings(row!))
  }),
)

adminRoutes.patch(
  '/settings',
  requireWriter,
  route(async (req, res) => {
    const patch = parseBody(
      z
        .object({
          defaultCommissionRate: z.coerce.number().min(0).max(50).optional(),
          notifyNewBooking: z.boolean().optional(),
          notifyCancellation: z.boolean().optional(),
          dailySummary: z.boolean().optional(),
        })
        .refine((body) => Object.keys(body).length > 0, 'Nothing to change.'),
      req.body,
    )

    // The default rate is what a newly approved partner starts on. Partners
    // carry their own negotiated rate and bookings keep the commission they
    // were priced at, so changing this rewrites nothing that already exists.
    const result = await query<SettingsRow>(
      `UPDATE settings
          SET default_commission_rate = COALESCE($1, default_commission_rate),
              notify_new_booking      = COALESCE($2, notify_new_booking),
              notify_cancellation     = COALESCE($3, notify_cancellation),
              daily_summary           = COALESCE($4, daily_summary),
              updated_at              = now()
        WHERE id
        RETURNING default_commission_rate, notify_new_booking, notify_cancellation, daily_summary`,
      [
        patch.defaultCommissionRate ?? null,
        patch.notifyNewBooking ?? null,
        patch.notifyCancellation ?? null,
        patch.dailySummary ?? null,
      ],
    )
    res.json(toSettings(result.rows[0]!))
  }),
)

/* ── Accounts ── */

adminRoutes.get(
  '/accounts',
  requireRole('admin'),
  route(async (_req, res) => {
    const result = await query<{
      id: string
      email: string
      name: string
      role: string
      active: boolean
      created_at: Date
      last_login_at: Date | null
    }>(
      'SELECT id, email, name, role, active, created_at, last_login_at FROM admin_users ORDER BY created_at ASC',
    )
    res.json(
      result.rows.map((row) => ({
        id: row.id,
        email: row.email,
        name: row.name,
        role: row.role,
        active: row.active,
        createdAt: row.created_at.toISOString(),
        lastLoginAt: row.last_login_at ? row.last_login_at.toISOString() : null,
      })),
    )
  }),
)
