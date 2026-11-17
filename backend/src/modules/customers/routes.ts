import { Router } from 'express'
import { z } from 'zod'
import { query, transaction } from '../../db/pool.ts'
import { conflict, notFound } from '../../lib/errors.ts'
import { emailField, param, parseBody, phoneField, requiredText, route } from '../../lib/http.ts'
import { requireAdmin, requireWriter } from '../../middleware/auth.ts'
import { LIVE_STATUSES, REVENUE_STATUSES } from '../bookings/status.ts'
import type { Customer } from '../../types/index.ts'

export const customerRoutes = Router()

/**
 * Customers are not a table.
 *
 * There is no sign-up on the site: a customer is whoever has booked, so they
 * are a grouping of bookings on email — exactly what `deriveCustomers` does
 * in the console today, moved into SQL so the figures come back already
 * totalled instead of every booking crossing the wire to be summed in a
 * browser.
 *
 * Which means editing a customer rewrites their bookings, and deleting one
 * deletes their bookings. That is surprising enough to be worth saying out
 * loud in the confirmation, which `/delete-check` does.
 */

const CUSTOMER_QUERY = `
  SELECT lower(customer_email) AS key,
         (array_agg(customer_email ORDER BY scheduled_at DESC))[1] AS email,
         (array_agg(customer_name  ORDER BY scheduled_at DESC))[1] AS name,
         (array_agg(customer_phone ORDER BY scheduled_at DESC))[1] AS phone,
         count(*)::bigint AS trips,
         count(*) FILTER (WHERE status = ANY($1::text[]))::bigint AS completed_trips,
         COALESCE(sum(amount) FILTER (WHERE status = ANY($1::text[])), 0) AS total_spend,
         min(created_at) AS first_booked_at,
         max(scheduled_at) AS last_trip_at,
         -- The service they book most. mode() is an ordered-set aggregate, so
         -- it groups with everything else here instead of needing a
         -- correlated subquery the GROUP BY cannot see into.
         mode() WITHIN GROUP (ORDER BY service_id) AS top_service
    FROM bookings b
   GROUP BY lower(b.customer_email)
`

interface CustomerRow {
  email: string
  name: string
  phone: string
  trips: number
  completed_trips: number
  total_spend: number
  first_booked_at: Date
  last_trip_at: Date
  top_service: string
}

const toCustomer = (row: CustomerRow): Customer => ({
  email: row.email,
  name: row.name,
  phone: row.phone,
  trips: Number(row.trips),
  completedTrips: Number(row.completed_trips),
  totalSpend: Number(row.total_spend),
  firstBookedAt: row.first_booked_at.toISOString(),
  lastTripAt: row.last_trip_at.toISOString(),
  topService: row.top_service,
})

customerRoutes.get(
  '/',
  requireAdmin,
  route(async (_req, res) => {
    const result = await query<CustomerRow>(
      `${CUSTOMER_QUERY} ORDER BY max(scheduled_at) DESC`,
      [REVENUE_STATUSES],
    )
    res.json(result.rows.map(toCustomer))
  }),
)

customerRoutes.get(
  '/:email',
  requireAdmin,
  route(async (req, res) => {
    const result = await query<CustomerRow>(
      `${CUSTOMER_QUERY} HAVING lower(customer_email) = lower($2)`,
      [REVENUE_STATUSES, param(req, 'email')],
    )
    const row = result.rows[0]
    if (!row) throw notFound('That customer')
    res.json(toCustomer(row))
  }),
)

/** Rewrites the contact details on every booking they made. */
customerRoutes.patch(
  '/:email',
  requireWriter,
  route(async (req, res) => {
    const patch = parseBody(
      z.object({
        customerName: requiredText('A name', 120),
        customerEmail: emailField,
        customerPhone: phoneField,
      }),
      req.body,
    )

    const updated = await transaction(async (client) => {
      const result = await client.query(
        `UPDATE bookings
            SET customer_name = $2, customer_email = $3, customer_phone = $4, updated_at = now()
          WHERE lower(customer_email) = lower($1)`,
        [param(req, 'email'), patch.customerName, patch.customerEmail, patch.customerPhone],
      )
      return result.rowCount ?? 0
    })

    if (updated === 0) throw notFound('That customer')
    res.json({ updatedBookings: updated, ...patch })
  }),
)

customerRoutes.get(
  '/:email/delete-check',
  requireAdmin,
  route(async (req, res) => {
    const impact = await customerImpact(param(req, 'email'))
    if (impact.total === 0) throw notFound('That customer')
    res.json({
      allowed: impact.live === 0,
      reason:
        impact.live > 0
          ? `This customer is on a trip right now (${impact.liveRefs.join(', ')}). Delete them once it has finished.`
          : undefined,
      consequences: [
        `All ${impact.total} booking(s) for this customer will be deleted.`,
        ...(impact.completed > 0
          ? [`Revenue from ${impact.completed} completed trip(s) leaves the finance figures.`]
          : []),
      ],
    })
  }),
)

customerRoutes.delete(
  '/:email',
  requireWriter,
  route(async (req, res) => {
    const impact = await customerImpact(param(req, 'email'))
    if (impact.total === 0) throw notFound('That customer')
    if (impact.live > 0) {
      throw conflict(
        `This customer is on a trip right now (${impact.liveRefs.join(', ')}). Delete them once it has finished.`,
        'customer_on_trip',
      )
    }

    const deleted = await transaction(async (client) => {
      const result = await client.query(
        'DELETE FROM bookings WHERE lower(customer_email) = lower($1)',
        [param(req, 'email')],
      )
      return result.rowCount ?? 0
    })

    res.json({ deletedBookings: deleted })
  }),
)

async function customerImpact(email: string): Promise<{
  total: number
  live: number
  liveRefs: string[]
  completed: number
}> {
  const result = await query<{
    total: number
    live: number
    refs: string[]
    completed: number
  }>(
    `SELECT count(*)::bigint AS total,
            count(*) FILTER (WHERE status = ANY($2::text[]))::bigint AS live,
            (array_agg(id) FILTER (WHERE status = ANY($2::text[])))[1:3] AS refs,
            count(*) FILTER (WHERE status = ANY($3::text[]))::bigint AS completed
       FROM bookings WHERE lower(customer_email) = lower($1)`,
    [email, LIVE_STATUSES, REVENUE_STATUSES],
  )
  const row = result.rows[0]
  return {
    total: Number(row?.total ?? 0),
    live: Number(row?.live ?? 0),
    liveRefs: row?.refs?.filter(Boolean) ?? [],
    completed: Number(row?.completed ?? 0),
  }
}
