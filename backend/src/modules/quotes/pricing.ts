import { query } from '../../db/pool.ts'
import { badRequest } from '../../lib/errors.ts'
import { buildFare, type FareLine } from './fare.ts'

/**
 * A quote, priced against the fares currently in the database.
 *
 * The rules themselves live in `fare.ts`, which touches nothing: this file is
 * only the part that has to ask Postgres what a service costs today. Fares
 * are rows rather than constants so repricing is the client's to do, not a
 * deploy.
 *
 * Commission is worked out at pricing time from the partner's rate and then
 * stored on the booking. Raising a partner's rate next month must not rewrite
 * what was already earned, which is the whole reason `bookings.commission` is
 * a column rather than a join.
 */

export { isNightPickup, splitCommission } from './fare.ts'

export interface QuoteInput {
  serviceId: string
  vehicleClassId: string
  passengers: number
  /** The scheduled pickup, used for the night surcharge. */
  scheduledAt: Date
}

export interface Quote {
  amount: number
  currency: 'ETB'
  lines: FareLine[]
  /** What the customer is told before anything is confirmed. */
  note: string
}

interface PricingRow {
  service_label: string
  base_fare: number
  class_label: string
  multiplier: number
  seats_max: number
}

export async function quote(input: QuoteInput): Promise<Quote> {
  const result = await query<PricingRow>(
    `SELECT s.label AS service_label,
            s.base_fare,
            c.label  AS class_label,
            c.multiplier,
            c.seats_max
       FROM services s
       CROSS JOIN vehicle_classes c
      WHERE s.id = $1 AND c.id = $2 AND s.active`,
    [input.serviceId, input.vehicleClassId],
  )

  const pricing = result.rows[0]
  if (!pricing) {
    throw badRequest('That service and vehicle combination is not available.', {
      serviceId: 'Choose a service we offer.',
      vehicleClassId: 'Choose a vehicle class we offer.',
    })
  }

  const fare = buildFare({
    serviceLabel: pricing.service_label,
    classLabel: pricing.class_label,
    baseFare: Number(pricing.base_fare),
    multiplier: Number(pricing.multiplier),
    seatsMax: Number(pricing.seats_max),
    passengers: input.passengers,
    scheduledAt: input.scheduledAt,
  })

  return {
    amount: fare.amount,
    currency: 'ETB',
    lines: fare.lines,
    note: 'An estimate. Dispatch confirms the final fare with you before the trip.',
  }
}
