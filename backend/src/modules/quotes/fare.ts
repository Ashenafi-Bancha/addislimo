/**
 * The fare rules, as arithmetic.
 *
 * Separate from `pricing.ts` because that file reaches the database for the
 * current fares, and none of this needs to: these are the rules themselves,
 * so they can be read, reasoned about and tested without a Postgres running.
 *
 * The rule is deliberately one a dispatcher can repeat from memory and a
 * customer can check on the phone: a base fare for the service, multiplied by
 * the vehicle class, plus a surcharge for a night pickup, plus a flat charge
 * for each passenger past what the class seats comfortably. No distance
 * component — nothing in the system knows where anywhere is, and inventing a
 * figure from a straight line between two place names would be worse than a
 * stated fare.
 */

/** Pickups between these hours cost more; drivers are harder to find. */
export const NIGHT_FROM_HOUR = 22
export const NIGHT_TO_HOUR = 5
export const NIGHT_SURCHARGE_RATE = 0.15

/** ETB for each passenger above the class's comfortable maximum. */
export const EXTRA_PASSENGER_FEE = 150

/** Fares are quoted to the nearest 10 ETB; nobody hands over change. */
export const ROUNDING = 10

/** Addis is UTC+3 all year, so a pickup hour needs no timezone database. */
export const ADDIS_OFFSET_HOURS = 3

export const roundFare = (value: number): number => Math.round(value / ROUNDING) * ROUNDING

export function addisHour(date: Date): number {
  return (date.getUTCHours() + ADDIS_OFFSET_HOURS) % 24
}

export function isNightPickup(date: Date): boolean {
  const hour = addisHour(date)
  return hour >= NIGHT_FROM_HOUR || hour < NIGHT_TO_HOUR
}

export interface FareLine {
  label: string
  amount: number
}

export interface FareInput {
  serviceLabel: string
  classLabel: string
  baseFare: number
  multiplier: number
  seatsMax: number
  passengers: number
  scheduledAt: Date
}

/** The itemised fare: what it costs, and why. */
export function buildFare(input: FareInput): { amount: number; lines: FareLine[] } {
  const lines: FareLine[] = []

  const base = roundFare(input.baseFare * input.multiplier)
  lines.push({ label: `${input.serviceLabel}, ${input.classLabel}`, amount: base })
  let total = base

  if (isNightPickup(input.scheduledAt)) {
    const surcharge = roundFare(total * NIGHT_SURCHARGE_RATE)
    lines.push({ label: `Night pickup (${NIGHT_FROM_HOUR}:00–0${NIGHT_TO_HOUR}:00)`, amount: surcharge })
    total += surcharge
  }

  const extra = Math.max(0, input.passengers - input.seatsMax)
  if (extra > 0) {
    const fee = extra * EXTRA_PASSENGER_FEE
    lines.push({
      label: `${extra} passenger${extra === 1 ? '' : 's'} above ${input.seatsMax}`,
      amount: fee,
    })
    total += fee
  }

  return { amount: total, lines }
}

/**
 * Splits a gross fare into what the partner keeps and what Addis Limo does.
 * Rounded to the cent the column stores, so the two always add back up to the
 * amount rather than drifting a hundredth apart.
 */
export function splitCommission(
  amount: number,
  ratePercent: number,
): { commission: number; payout: number; rate: number } {
  const rate = Math.min(Math.max(ratePercent, 0), 50)
  const commission = Math.round(amount * rate) / 100
  return { commission, payout: Math.round((amount - commission) * 100) / 100, rate }
}
