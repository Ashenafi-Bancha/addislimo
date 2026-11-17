import type { Queryable } from '../../db/pool.ts'
import { pool, query } from '../../db/pool.ts'
import type { FleetVehicle, StoredVehicleStatus } from '../../types/index.ts'
import { LIVE_STATUSES, OPEN_STATUSES } from '../bookings/status.ts'

export interface VehicleRow {
  id: string
  partner_id: string
  make: string
  model: string
  year: number
  plate: string
  vehicle_class: string
  seats: number
  status: StoredVehicleStatus
  on_trip?: boolean
}

const COLUMNS = `v.id, v.partner_id, v.make, v.model, v.year, v.plate, v.vehicle_class, v.seats, v.status`

const LIVE_FLAG = `
  EXISTS (
    SELECT 1 FROM bookings b
     WHERE b.vehicle_id = v.id AND b.status = ANY($LIVE::text[])
  ) AS on_trip
`

export function toVehicle(row: VehicleRow): FleetVehicle {
  return {
    id: row.id,
    partnerId: row.partner_id,
    make: row.make,
    model: row.model,
    year: row.year,
    plate: row.plate,
    vehicleClass: row.vehicle_class,
    seats: row.seats,
    status: row.status,
    liveStatus: row.on_trip ? 'On Trip' : row.status,
  }
}

export async function list(partnerId?: string): Promise<FleetVehicle[]> {
  const params: unknown[] = [LIVE_STATUSES]
  let filter = ''
  if (partnerId) {
    params.push(partnerId)
    filter = `WHERE v.partner_id = $${params.length}`
  }
  const result = await query<VehicleRow>(
    `SELECT ${COLUMNS}, ${LIVE_FLAG.replace('$LIVE', '$1')}
       FROM vehicles v ${filter} ORDER BY v.make ASC, v.model ASC`,
    params,
  )
  return result.rows.map(toVehicle)
}

export async function byId(id: string, client: Queryable = pool): Promise<FleetVehicle | null> {
  const result = await client.query<VehicleRow>(
    `SELECT ${COLUMNS}, ${LIVE_FLAG.replace('$LIVE', '$2')} FROM vehicles v WHERE v.id = $1`,
    [id, LIVE_STATUSES],
  )
  const row = result.rows[0]
  return row ? toVehicle(row) : null
}

/** The plate index is case-insensitive, so this lookup is too. */
export async function byPlate(plate: string, excludeId?: string): Promise<FleetVehicle | null> {
  const params: unknown[] = [LIVE_STATUSES, plate.trim()]
  let exclusion = ''
  if (excludeId) {
    params.push(excludeId)
    exclusion = `AND v.id <> $${params.length}`
  }
  const result = await query<VehicleRow>(
    `SELECT ${COLUMNS}, ${LIVE_FLAG.replace('$LIVE', '$1')}
       FROM vehicles v WHERE upper(btrim(v.plate)) = upper(btrim($2)) ${exclusion}`,
    params,
  )
  const row = result.rows[0]
  return row ? toVehicle(row) : null
}

export interface VehicleInput {
  partnerId: string
  make: string
  model: string
  year: number
  plate: string
  vehicleClass: string
  seats: number
  status: StoredVehicleStatus
}

export async function insert(
  id: string,
  input: VehicleInput,
  client: Queryable = pool,
): Promise<FleetVehicle> {
  const result = await client.query<VehicleRow>(
    `INSERT INTO vehicles (id, partner_id, make, model, year, plate, vehicle_class, seats, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING id, partner_id, make, model, year, plate, vehicle_class, seats, status`,
    [
      id,
      input.partnerId,
      input.make,
      input.model,
      input.year,
      input.plate,
      input.vehicleClass,
      input.seats,
      input.status,
    ],
  )
  return toVehicle(result.rows[0]!)
}

export async function update(
  id: string,
  input: VehicleInput,
  client: Queryable = pool,
): Promise<FleetVehicle> {
  const result = await client.query<VehicleRow>(
    `UPDATE vehicles SET partner_id = $2, make = $3, model = $4, year = $5, plate = $6,
            vehicle_class = $7, seats = $8, status = $9, updated_at = now()
      WHERE id = $1
     RETURNING id, partner_id, make, model, year, plate, vehicle_class, seats, status`,
    [
      id,
      input.partnerId,
      input.make,
      input.model,
      input.year,
      input.plate,
      input.vehicleClass,
      input.seats,
      input.status,
    ],
  )
  return toVehicle(result.rows[0]!)
}

export async function remove(id: string, client: Queryable = pool): Promise<boolean> {
  const result = await client.query('DELETE FROM vehicles WHERE id = $1', [id])
  return (result.rowCount ?? 0) > 0
}

export async function deleteImpact(id: string): Promise<{
  open: number
  openRefs: string[]
  past: number
}> {
  const result = await query<{ open: number; refs: string[]; past: number }>(
    `SELECT count(*) FILTER (WHERE status = ANY($2::text[]))::bigint AS open,
            (array_agg(id ORDER BY scheduled_at) FILTER (WHERE status = ANY($2::text[])))[1:3] AS refs,
            count(*)::bigint AS past
       FROM bookings WHERE vehicle_id = $1`,
    [id, OPEN_STATUSES],
  )
  const row = result.rows[0]
  return {
    open: Number(row?.open ?? 0),
    openRefs: row?.refs?.filter(Boolean) ?? [],
    past: Number(row?.past ?? 0),
  }
}
