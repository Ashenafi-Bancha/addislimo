import type { SiteContent } from '@/features/cms'

/**
 * A submitted booking, and the ways it reaches the dispatch desk.
 *
 * There is no backend yet, so a booking cannot be stored and a confirmation
 * cannot be emailed automatically. What the site can do is compose the
 * request and hand it to a channel the reader already has: WhatsApp, their
 * mail app, or the phone. That is a real delivery, not a pretend one, and it
 * is the whole reason the confirmation screen no longer claims a request was
 * "received" when nothing left the browser.
 *
 * When `POST /bookings` exists this file keeps its shape: `toText` becomes the
 * body of the request, and the channels below stay as the fallback for a
 * failed call.
 */

export interface BookingRequest {
  reference: string
  /** ISO timestamp of the moment the reader submitted. */
  submittedAt: string
  /**
   * True when the API accepted it, so dispatch already has the booking and
   * the confirmation screen can say so. False when it is still sitting in
   * this browser waiting to be sent by WhatsApp, mail or phone. See
   * `submit.ts`.
   */
  delivered?: boolean
  service: string
  pickup: string
  destination: string
  date: string
  time: string
  passengers: string
  luggage: string
  vehicle: string
  firstName: string
  lastName: string
  email: string
  phone: string
  notes: string
}

const STORAGE_KEY = 'addislimo.booking.last'

/**
 * `AL-261115-7Q4K`: the date makes a reference sortable and recognisable on
 * the phone, the suffix keeps two bookings on one day apart. Generated once,
 * at submit, and carried with the booking — the confirmation screen used to
 * roll a fresh random number on every render, so a reader who refreshed was
 * looking at a different booking number than the one they had just been given.
 */
export function newReference(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const day = `${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no I/O/0/1
  let suffix = ''
  const random = globalThis.crypto?.getRandomValues?.(new Uint8Array(4))
  for (let i = 0; i < 4; i++) {
    suffix += alphabet[(random ? random[i] : Math.floor(Math.random() * 256)) % alphabet.length]
  }
  return `AL-${day}-${suffix}`
}

/**
 * Keeps the request across the navigation to the confirmation screen, and
 * across a reload of it — someone who refreshes, or comes back to the tab
 * later to send it, still has their booking. `sessionStorage` because it
 * belongs to this visit, and because the fields include a name and a phone
 * number that have no business outliving the tab.
 */
export function rememberRequest(request: BookingRequest): void {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(request))
  } catch {
    /* Private mode, or storage disabled. The confirmation screen copes. */
  }
}

export function recallRequest(): BookingRequest | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as BookingRequest
    return parsed && typeof parsed.reference === 'string' ? parsed : null
  } catch {
    return null
  }
}

export function forgetRequest(): void {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    /* Nothing stored it in the first place. */
  }
}

/**
 * The booking as a person reads it, in English regardless of the site's
 * language: it is addressed to the dispatch desk, not to the visitor, and a
 * dispatcher reading a WhatsApp message needs the place names and the labels
 * in the script they work in.
 */
export function toText(request: BookingRequest): string {
  const lines = [
    `Booking request ${request.reference}`,
    '',
    `Service:     ${request.service}`,
    `Pickup:      ${request.pickup}`,
    `Destination: ${request.destination}`,
    `When:        ${request.date} at ${request.time}`,
    `Travellers:  ${request.passengers} passenger(s), ${request.luggage} bag(s)`,
    `Vehicle:     ${request.vehicle}`,
    '',
    `Name:        ${request.firstName} ${request.lastName}`,
    `Email:       ${request.email}`,
    request.phone.trim() ? `Phone:       ${request.phone}` : '',
    request.notes.trim() ? `\nNotes:\n${request.notes.trim()}` : '',
  ]
  return lines.filter((line) => line !== '').join('\n')
}

export interface Channels {
  whatsapp: string | null
  email: string
  phone: string | null
}

/**
 * Where the reader can send the request, given what the client has filled in.
 *
 * A channel is `null` when its number is still blank in Website Content, so
 * the confirmation screen offers what exists rather than a dead link. Email
 * is always there: it is the one address the site has always had.
 */
export function channelsFor(request: BookingRequest, business: SiteContent['business']): Channels {
  const text = toText(request)
  const whatsapp = business.whatsapp.replace(/\D/g, '')
  const phone = business.phoneHref.replace(/[^\d+]/g, '')
  const subject = `Booking request ${request.reference} — ${request.firstName} ${request.lastName}`

  return {
    whatsapp: whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}` : null,
    email: `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`,
    phone: phone ? `tel:${phone}` : null,
  }
}
