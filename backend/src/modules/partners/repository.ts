import type { Queryable } from '../../db/pool.ts'
import { pool, query } from '../../db/pool.ts'
import type { FleetPartner, PartnerStatus, PartnerType } from '../../types/index.ts'

export interface PartnerRow {
  id: string
  name: string
  type: PartnerType
  contact_name: string
  phone: string
  email: string
  commission_rate: number
  status: PartnerStatus
  rating: number
  joined_at: Date
}

const COLUMNS = `id, name, type, contact_name, phone, email, commission_rate, status, rating, joined_at`

export function toPartner(row: PartnerRow): FleetPartner {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    contactName: row.contact_name,
    phone: row.phone,
    email: row.email,
    commissionRate: Number(row.commission_rate),
    status: row.status,
    rating: Number(row.rating),
    joinedAt: row.joined_at.toISOString(),
  }
}

export async function list(): Promise<FleetPartner[]> {
  const result = await query<PartnerRow>(`SELECT ${COLUMNS} FROM partners ORDER BY name ASC`)
  return result.rows.map(toPartner)
}

export async function byId(id: string, client: Queryable = pool): Promise<FleetPartner | null> {
  const result = await client.query<PartnerRow>(`SELECT ${COLUMNS} FROM partners WHERE id = $1`, [id])
  const row = result.rows[0]
  return row ? toPartner(row) : null
}

export interface PartnerInput {
  name: string
  type: PartnerType
  contactName: string
  phone: string
  email: string
  commissionRate: number
  status: PartnerStatus
}

export async function insert(
  id: string,
  input: PartnerInput,
  client: Queryable = pool,
): Promise<FleetPartner> {
  const result = await client.query<PartnerRow>(
    `INSERT INTO partners (id, name, type, contact_name, phone, email, commission_rate, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING ${COLUMNS}`,
    [
      id,
      input.name,
      input.type,
      input.contactName,
      input.phone,
      input.email,
      input.commissionRate,
      input.status,
    ],
  )
  return toPartner(result.rows[0]!)
}

export async function update(
  id: string,
  input: PartnerInput,
  client: Queryable = pool,
): Promise<FleetPartner> {
  const result = await client.query<PartnerRow>(
    `UPDATE partners SET name = $2, type = $3, contact_name = $4, phone = $5, email = $6,
            commission_rate = $7, status = $8, updated_at = now()
      WHERE id = $1 RETURNING ${COLUMNS}`,
    [
      id,
      input.name,
      input.type,
      input.contactName,
      input.phone,
      input.email,
      input.commissionRate,
      input.status,
    ],
  )
  return toPartner(result.rows[0]!)
}

export async function setStatus(
  id: string,
  status: PartnerStatus,
  client: Queryable = pool,
): Promise<FleetPartner | null> {
  const result = await client.query<PartnerRow>(
    `UPDATE partners SET status = $2, updated_at = now() WHERE id = $1 RETURNING ${COLUMNS}`,
    [id, status],
  )
  const row = result.rows[0]
  return row ? toPartner(row) : null
}

/** Drivers and vehicles cascade; bookings do not, which is the guard's job. */
export async function remove(id: string, client: Queryable = pool): Promise<boolean> {
  const result = await client.query('DELETE FROM partners WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

/**
 * What deleting this partner would take with it, and what stops it.
 * Mirrors `checkPartnerDelete` in the console's `guards.ts`.
 */
export async function deleteImpact(id: string): Promise<{
  bookings: number
  drivers: number
  vehicles: number
  sampleRefs: string[]
}> {
  const [bookings, fleet] = await Promise.all([
    query<{ total: number; refs: string[] }>(
      `SELECT count(*)::bigint AS total,
              (array_agg(id ORDER BY scheduled_at DESC))[1:3] AS refs
         FROM bookings WHERE partner_id = $1`,
      [id],
    ),
    query<{ drivers: number; vehicles: number }>(
      `SELECT (SELECT count(*)::bigint FROM drivers  WHERE partner_id = $1) AS drivers,
              (SELECT count(*)::bigint FROM vehicles WHERE partner_id = $1) AS vehicles`,
      [id],
    ),
  ])
  return {
    bookings: Number(bookings.rows[0]?.total ?? 0),
    drivers: Number(fleet.rows[0]?.drivers ?? 0),
    vehicles: Number(fleet.rows[0]?.vehicles ?? 0),
    sampleRefs: bookings.rows[0]?.refs?.filter(Boolean) ?? [],
  }
}
