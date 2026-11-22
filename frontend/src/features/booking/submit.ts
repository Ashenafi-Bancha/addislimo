import { isApiConfigured } from '@/config/env'
import { api, ApiError, endpoints } from '@/lib/api'
import type { Booking } from '@/types'
import { newReference, rememberRequest, type BookingRequest } from './request'

/**
 * Sending a finished booking.
 *
 * Two ways, and which one is used depends on whether this build has an API
 * behind it:
 *
 *   with `VITE_API_URL` set — `POST /bookings`. Dispatch has the booking the
 *   moment the customer presses the button, with a reference the server
 *   allocated and a row in the database.
 *
 *   without it — the reference is generated here and the confirmation screen
 *   hands the booking to WhatsApp, mail or the phone, as it has since before
 *   the backend existed.
 *
 * Both paths are real. The difference is who is holding the request at the
 * end, and the confirmation screen says which, because telling someone their
 * booking is received when it is sitting in their own browser is the failure
 * this whole path was built to avoid.
 *
 * The network can also fail with the API configured. That falls back rather
 * than erroring: a customer who has filled in five steps should not lose them
 * because dispatch's server is restarting.
 */

export interface SubmitInput {
  serviceId: string
  serviceLabel: string
  pickup: string
  destination: string
  date: string
  time: string
  passengers: string
  luggage: string
  vehicleClass: string
  vehicleLabel: string
  firstName: string
  lastName: string
  email: string
  phone: string
  notes: string
}

export type SubmitOutcome =
  /** The server has it. Nothing more is asked of the customer. */
  | { delivered: true; request: BookingRequest; booking: Booking }
  /** It is on this device only, and the customer sends it. */
  | { delivered: false; request: BookingRequest; reason: 'no-api' | 'unreachable' }

/** The wizard's separate date and time fields as one instant. */
function scheduledAt(date: string, time: string): Date {
  const local = new Date(`${date}T${time}`)
  return Number.isNaN(local.getTime()) ? new Date(`${date}T${time}:00`) : local
}

function toRequest(input: SubmitInput, reference: string, delivered: boolean): BookingRequest {
  return {
    reference,
    submittedAt: new Date().toISOString(),
    delivered,
    service: input.serviceLabel,
    pickup: input.pickup,
    destination: input.destination,
    date: input.date,
    time: input.time,
    passengers: input.passengers,
    luggage: input.luggage,
    vehicle: input.vehicleLabel,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    notes: input.notes,
  }
}

export async function submitBooking(input: SubmitInput): Promise<SubmitOutcome> {
  if (!isApiConfigured) {
    const request = toRequest(input, newReference(), false)
    rememberRequest(request)
    return { delivered: false, request, reason: 'no-api' }
  }

  try {
    const response = await api.post<{ reference: string; booking: Booking }>(
      endpoints.bookings.create,
      {
        customerName: `${input.firstName} ${input.lastName}`.trim(),
        customerEmail: input.email,
        customerPhone: input.phone,
        serviceId: input.serviceId,
        pickup: input.pickup,
        destination: input.destination,
        scheduledAt: scheduledAt(input.date, input.time).toISOString(),
        passengers: Number(input.passengers),
        luggage: Number(input.luggage),
        vehicleClass: input.vehicleClass,
        notes: input.notes,
      },
    )

    // The server's reference, not the one this device would have invented.
    const request = toRequest(input, response.reference, true)
    rememberRequest(request)
    return { delivered: true, request, booking: response.booking }
  } catch (error) {
    // A 4xx means this booking is wrong and resending it will not help, so
    // let the wizard show why. Anything else is the server's problem, not the
    // customer's: fall back to the channels that do not need it.
    if (error instanceof ApiError && error.status >= 400 && error.status < 500) throw error

    const request = toRequest(input, newReference(), false)
    rememberRequest(request)
    return { delivered: false, request, reason: 'unreachable' }
  }
}
