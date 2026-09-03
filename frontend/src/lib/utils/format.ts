import { site } from '@/config/site'

/** `3200` -> `'ETB 3,200'` */
export function formatCurrency(amount: number, currency: string = site.currency): string {
  return `${currency} ${amount.toLocaleString('en-US')}`
}

/** `'2026-08-18'` + `'14:30'` -> `'18 Aug 2026 at 14:30'` */
export function formatDateTime(date: string, time?: string): string {
  if (!date) return 'Not set'
  const parsed = new Date(time ? `${date}T${time}` : date)
  if (Number.isNaN(parsed.getTime())) return time ? `${date} at ${time}` : date
  const day = parsed.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  return time ? `${day} at ${time}` : day
}

/** `'Skylight Hotel'` -> `'SH'` — the monogram fallback when a logo is missing. */
export function initialsOf(name: string, max = 2): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, max)
    .toUpperCase()
}
