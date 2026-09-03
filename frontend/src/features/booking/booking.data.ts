import type { ServiceOption, VehicleOption } from '@/types'

/**
 * Options offered by the five-step booking wizard.
 *
 * These will come from `GET /services` and `GET /vehicles` once the API
 * exists; the shapes already match `src/types`.
 */

export const stepLabels = ['Service', 'Route', 'Schedule', 'Details', 'Confirm']

export const serviceOptions: ServiceOption[] = [
  { id: 'airport', label: 'Airport Transfer', desc: 'Bole International to your hotel or Airbnb' },
  { id: 'city', label: 'Point-to-Point', desc: 'Direct transfer between two points in the city' },
  { id: 'hourly', label: 'Hourly Service', desc: 'A driver at your disposal, by the hour or the day' },
  { id: 'corporate', label: 'Executive / Corporate', desc: 'Business and organizational travel' },
  { id: 'diplomatic', label: 'Diplomatic & Embassy', desc: 'Embassy, mission and delegation travel' },
  { id: 'city-tour', label: 'City Tour', desc: 'Guided tour across the capital’s districts' },
  { id: 'summit', label: 'Summit & Conference', desc: 'AU, ECA, AICC and UNECA venue transfers' },
  { id: 'expat', label: 'Expat Transport', desc: 'Standing arrangements for residents in Addis' },
  { id: 'wedding', label: 'Wedding', desc: 'Bridal party, family and guest transport' },
  { id: 'prom', label: 'Prom', desc: 'Prom and graduation night transport' },
]

export const vehicleOptions: VehicleOption[] = [
  { id: 'sedan', label: 'Executive Sedan', capacity: '1–3', img: '🚗', note: 'Premium comfort' },
  { id: 'suv', label: 'Premium SUV', capacity: '1–4', img: '🚙', note: 'Spacious & commanding' },
  { id: 'luxury', label: 'Luxury SUV', capacity: '1–4', img: '🚙', note: 'Top-tier comfort' },
  { id: 'van', label: 'Business Van', capacity: '5–7', img: '🚐', note: 'Groups & delegations' },
]
