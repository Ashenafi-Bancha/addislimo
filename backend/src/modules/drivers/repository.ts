import type { Queryable } from '../../db/pool.ts'
import { pool, query } from '../../db/pool.ts'
import type { Driver, StoredDriverStatus } from '../../types/index.ts'
import { LIVE_STATUSES, OPEN_STATUSES } from '../bookings/status.ts'

export interface DriverRow {
  id: string
  partner_id: string
  name: string
  phone: string
  licence_no: string
  status: StoredDriverStatus
  rating: number
  /** Added by the queries below, not a column. */
  on_trip?: boolean
}

const COLUMNS = `d.id, d.partner_id, d.name, d.phone, d.licence_no, d.status, d.rating`

/**
 * "On Trip" is never stored. It is a fact about the bookings table, so it is
 * computed in the same query rather than cached on the row where a crashed
 * request could leave it stuck.
 */
const LIVE_FLAG = `
  EXISTS (
    SELECT 1 FROM bookings b
     WHERE b.driver_id = d.id AND b.status = ANY($LIVE::text[])
  ) AS on_trip
`

export function toDriver(row: DriverRow): Driver {
  const status = row.status
  return {
    id: row.id,
    partnerId: row.partner_id,
    name: row.name,
    phone: row.phone,
    licenceNo: row.licence_no,
    status,
    rating: Number(row.rating),
    liveStatus: row.on_trip ? 'On Trip' : status,
  }
}

export async function list(partnerId?: string): Promise<Driver[]> {
  const params: unknown[] = [LIVE_STATUSES]
  let filter = ''
  if (partnerId) {
    params.push(partnerId)
    filter = `WHERE d.partner_id = $${params.length}`
  }
  const result = await query<DriverRow>(
    `SELECT ${COLUMNS}, ${LIVE_FLAG.replace('$LIVE', '$1')}
       FROM drivers d ${filter} ORDER BY d.name ASC`,
    params,
  )
  return result.rows.map(toDriver)
}

export async function byId(id: string, client: Queryable = pool): Promise<Driver | null> {
  const result = await client.query<DriverRow>(
    `SELECT ${COLUMNS}, ${LIVE_FLAG.replace('$LIVE', '$2')} FROM drivers d WHERE d.id = $1`,
    [id, LIVE_STATUSES],
  )
  const row = result.rows[0]
  return row ? toDriver(row) : null
}

export interface DriverInput {
  partnerId: string
  name: string
  phone: string
  licenceNo: string
  status: StoredDriverStatus
  rating: number
}

export async function insert(id: string, input: DriverInput, client: Queryable = pool): Promise<Driver> {
  const result = await client.query<DriverRow>(
    `INSERT INTO drivers (id, partner_id, name, phone, licence_no, status, rating)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id, partner_id, name, phone, licence_no, status, rating`,
    [id, input.partnerId, input.name, input.phone, input.licenceNo, input.status, input.rating],
  )
  return toDriver(result.rows[0]!)
}

export async function update(id: string, input: DriverInput, client: Queryable = pool): Promise<Driver> {
  const result = await client.query<DriverRow>(
    `UPDATE drivers SET partner_id = $2, name = $3, phone = $4, licence_no = $5,
            status = $6, rating = $7, updated_at = now()
      WHERE id = $1
     RETURNING id, partner_id, name, phone, licence_no, status, rating`,
    [id, input.partnerId, input.name, input.phone, input.licenceNo, input.status, input.rating],
  )
  return toDriver(result.rows[0]!)
}

export async function remove(id: string, client: Queryable = pool): Promise<boolean> {
  const result = await client.query('DELETE FROM drivers WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

/**
 * Open trips still needing this driver, and how many past ones reference
 * them. Mirrors `checkDriverDelete` in the console's `guards.ts`: open trips
 * block the delete, past trips simply lose the name.
 */
export async function deleteImpact(id: string): Promise<{
  open: number
  openRefs: string[]
  past: number
}> {
  const result = await query<{ open: number; refs: string[]; past: number }>(
    `SELECT count(*) FILTER (WHERE status = ANY($2::text[]))::bigint AS open,
            (array_agg(id ORDER BY scheduled_at) FILTER (WHERE status = ANY($2::text[])))[1:3] AS refs,
            count(*)::bigint AS past
       FROM bookings WHERE driver_id = $1`,
    [id, OPEN_STATUSES],
  )
  const row = result.rows[0]
  return {
    open: Number(row?.open ?? 0),
    openRefs: row?.refs?.filter(Boolean) ?? [],
    past: Number(row?.past ?? 0),
  }
}
