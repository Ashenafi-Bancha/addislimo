import { query } from '../../db/pool.ts'
import { LIVE_STATUSES, OPEN_STATUSES, REVENUE_STATUSES } from '../bookings/status.ts'
import { toBooking, type BookingRow } from '../bookings/repository.ts'
import type { Booking, BookingStatus } from '../../types/index.ts'

/**
 * Every figure the console shows, computed in the database.
 *
 * `frontend/src/features/admin/selectors.ts` computes these in the browser
 * from the whole booking list, which works for seed data and stops working
 * the first month the business has a few thousand trips. The definitions are
 * the same ones — only `Completed` is revenue, a cancelled trip never is,
 * "live" means a driver is out — so the two agree while the console still
 * has its in-memory fallback.
 *
 * Addis is UTC+3 with no daylight saving, so a "day" is fixed to that offset
 * rather than to whatever timezone the server happens to be in. A booking at
 * 1am in Addis belongs to that day's figures, not to the previous one.
 */

const ADDIS_TZ = 'Africa/Addis_Ababa'

export interface PeriodTotals {
  revenue: number
  commission: number
  trips: number
}

export interface MetricsResponse {
  window: { days: number; from: string; to: string }
  current: PeriodTotals
  previous: PeriodTotals
  change: { revenue: number | null; commission: number | null; trips: number | null }
  today: { trips: number; revenue: number; scheduled: number }
  awaitingConfirmation: number
  live: number
  countByStatus: Record<BookingStatus, number>
  dailyRevenue: { date: string; revenue: number; trips: number; isToday: boolean }[]
  needsAttention: Booking[]
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

async function totalsBetween(from: Date, to: Date): Promise<PeriodTotals> {
  const result = await query<{ revenue: number; commission: number; trips: number }>(
    `SELECT COALESCE(sum(amount), 0)     AS revenue,
            COALESCE(sum(commission), 0) AS commission,
            count(*)::bigint             AS trips
       FROM bookings
      WHERE status = ANY($1::text[]) AND scheduled_at >= $2 AND scheduled_at < $3`,
    [REVENUE_STATUSES, from, to],
  )
  const row = result.rows[0]
  return {
    revenue: Number(row?.revenue ?? 0),
    commission: Number(row?.commission ?? 0),
    trips: Number(row?.trips ?? 0),
  }
}

export async function metrics(days = 7, chartDays = 14): Promise<MetricsResponse> {
  // Midnight in Addis, as an instant, so every window below lines up with the
  // calendar day a dispatcher means.
  const bounds = await query<{ today_start: Date; tomorrow_start: Date }>(
    `SELECT date_trunc('day', now() AT TIME ZONE $1) AT TIME ZONE $1              AS today_start,
            (date_trunc('day', now() AT TIME ZONE $1) + interval '1 day') AT TIME ZONE $1 AS tomorrow_start`,
    [ADDIS_TZ],
  )
  const todayStart = bounds.rows[0]!.today_start
  const windowEnd = bounds.rows[0]!.tomorrow_start
  const DAY = 24 * 60 * 60 * 1000
  const windowStart = new Date(windowEnd.getTime() - days * DAY)
  const previousStart = new Date(windowStart.getTime() - days * DAY)

  const [current, previous, today, statuses, chart, attention, live] = await Promise.all([
    totalsBetween(windowStart, windowEnd),
    totalsBetween(previousStart, windowStart),

    query<{ trips: number; revenue: number; scheduled: number }>(
      `SELECT count(*) FILTER (WHERE status = ANY($1::text[]))::bigint AS trips,
              COALESCE(sum(amount) FILTER (WHERE status = ANY($1::text[])), 0) AS revenue,
              count(*)::bigint AS scheduled
         FROM bookings
        WHERE scheduled_at >= $2 AND scheduled_at < $3`,
      [REVENUE_STATUSES, todayStart, windowEnd],
    ),

    query<{ status: BookingStatus; total: number }>(
      'SELECT status, count(*)::bigint AS total FROM bookings GROUP BY status',
    ),

    query<{ day: Date; revenue: number; trips: number }>(
      `WITH days AS (
         SELECT generate_series(
           date_trunc('day', now() AT TIME ZONE $2) - make_interval(days => $1 - 1),
           date_trunc('day', now() AT TIME ZONE $2),
           interval '1 day'
         ) AS day
       )
       SELECT d.day,
              COALESCE(sum(b.amount), 0) AS revenue,
              count(b.id)::bigint        AS trips
         FROM days d
         LEFT JOIN bookings b
           ON date_trunc('day', b.scheduled_at AT TIME ZONE $2) = d.day
          AND b.status = ANY($3::text[])
        GROUP BY d.day
        ORDER BY d.day ASC`,
      [chartDays, ADDIS_TZ, REVENUE_STATUSES],
    ),

    // Unconfirmed, or confirmed with nobody driving: the queue a dispatcher
    // works through, soonest pickup first.
    query<BookingRow>(
      `SELECT id, customer_name, customer_email, customer_phone, service_id, pickup, destination,
              scheduled_at, passengers, luggage, vehicle_class, partner_id, driver_id, vehicle_id,
              amount, commission, commission_rate, status, notes, source, cancelled_reason,
              created_at, updated_at, completed_at
         FROM bookings
        WHERE status = 'Pending' OR (status = 'Confirmed' AND driver_id IS NULL)
        ORDER BY scheduled_at ASC
        LIMIT 50`,
    ),

    query<{ total: number }>(
      'SELECT count(*)::bigint AS total FROM bookings WHERE status = ANY($1::text[])',
      [LIVE_STATUSES],
    ),
  ])

  const countByStatus = Object.fromEntries(
    (
      [
        'Pending',
        'Confirmed',
        'Assigned',
        'Driver En Route',
        'In Progress',
        'Completed',
        'Cancelled',
      ] as BookingStatus[]
    ).map((status) => [status, 0]),
  ) as Record<BookingStatus, number>
  for (const row of statuses.rows) countByStatus[row.status] = Number(row.total)

  const todayRow = today.rows[0]
  const todayStartMs = todayStart.getTime()

  return {
    window: { days, from: windowStart.toISOString(), to: windowEnd.toISOString() },
    current,
    previous,
    change: {
      revenue: percentChange(current.revenue, previous.revenue),
      commission: percentChange(current.commission, previous.commission),
      trips: percentChange(current.trips, previous.trips),
    },
    today: {
      trips: Number(todayRow?.trips ?? 0),
      revenue: Number(todayRow?.revenue ?? 0),
      scheduled: Number(todayRow?.scheduled ?? 0),
    },
    awaitingConfirmation: countByStatus.Pending,
    live: Number(live.rows[0]?.total ?? 0),
    countByStatus,
    dailyRevenue: chart.rows.map((row) => ({
      date: row.day.toISOString(),
      revenue: Number(row.revenue),
      trips: Number(row.trips),
      isToday: row.day.getTime() === todayStartMs,
    })),
    needsAttention: attention.rows.map(toBooking),
  }
}

export interface PartnerPayout {
  partnerId: string
  partnerName: string
  status: string
  commissionRate: number
  trips: number
  gross: number
  commission: number
  /** What the partner is owed: gross less Addis Limo's cut. */
  payout: number
  drivers: number
  vehicles: number
}

/**
 * Per-partner money for a period. The commission summed here is the one each
 * booking was priced at, never a rate applied after the fact — which is why
 * a partner's rate can be renegotiated without last month's payouts moving.
 */
export async function payouts(from?: Date, to?: Date): Promise<{
  from: string | null
  to: string | null
  totals: { gross: number; commission: number; payout: number; trips: number }
  partners: PartnerPayout[]
}> {
  const result = await query<{
    partner_id: string
    partner_name: string
    status: string
    commission_rate: number
    trips: number
    gross: number
    commission: number
    drivers: number
    vehicles: number
  }>(
    `SELECT p.id    AS partner_id,
            p.name  AS partner_name,
            p.status,
            p.commission_rate,
            count(b.id)::bigint               AS trips,
            COALESCE(sum(b.amount), 0)        AS gross,
            COALESCE(sum(b.commission), 0)    AS commission,
            (SELECT count(*)::bigint FROM drivers  d WHERE d.partner_id = p.id) AS drivers,
            (SELECT count(*)::bigint FROM vehicles v WHERE v.partner_id = p.id) AS vehicles
       FROM partners p
       LEFT JOIN bookings b
         ON b.partner_id = p.id
        AND b.status = ANY($1::text[])
        AND ($2::timestamptz IS NULL OR b.scheduled_at >= $2)
        AND ($3::timestamptz IS NULL OR b.scheduled_at <  $3)
      GROUP BY p.id, p.name, p.status, p.commission_rate
      ORDER BY COALESCE(sum(b.amount), 0) DESC, p.name ASC`,
    [REVENUE_STATUSES, from ?? null, to ?? null],
  )

  const partners: PartnerPayout[] = result.rows.map((row) => {
    const gross = Number(row.gross)
    const commission = Number(row.commission)
    return {
      partnerId: row.partner_id,
      partnerName: row.partner_name,
      status: row.status,
      commissionRate: Number(row.commission_rate),
      trips: Number(row.trips),
      gross,
      commission,
      payout: Math.round((gross - commission) * 100) / 100,
      drivers: Number(row.drivers),
      vehicles: Number(row.vehicles),
    }
  })

  return {
    from: from ? from.toISOString() : null,
    to: to ? to.toISOString() : null,
    totals: {
      gross: partners.reduce((sum, p) => sum + p.gross, 0),
      commission: partners.reduce((sum, p) => sum + p.commission, 0),
      payout: partners.reduce((sum, p) => sum + p.payout, 0),
      trips: partners.reduce((sum, p) => sum + p.trips, 0),
    },
    partners,
  }
}

/** Open trips, for a dispatcher's board. */
export async function openBoard(): Promise<Booking[]> {
  const result = await query<BookingRow>(
    `SELECT id, customer_name, customer_email, customer_phone, service_id, pickup, destination,
            scheduled_at, passengers, luggage, vehicle_class, partner_id, driver_id, vehicle_id,
            amount, commission, commission_rate, status, notes, source, cancelled_reason,
            created_at, updated_at, completed_at
       FROM bookings WHERE status = ANY($1::text[]) ORDER BY scheduled_at ASC`,
    [OPEN_STATUSES],
  )
  return result.rows.map(toBooking)
}
