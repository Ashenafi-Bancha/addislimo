import { formatCurrency } from '@/lib/utils'
import { startOfDay } from './selectors'

/**
 * Formatting for the admin console. Dates use the en-GB day-month order and a
 * 24-hour clock, which is how operations staff in Addis Ababa read a schedule.
 */

const DAY = 24 * 60 * 60 * 1000

export const formatETB = (amount: number) => formatCurrency(amount)

/** `12900` -> `ETB 12.9K`, for axis ticks and tight tiles. */
export function formatCompactETB(amount: number): string {
  if (Math.abs(amount) < 1000) return `ETB ${amount}`
  if (Math.abs(amount) < 1_000_000) return `ETB ${trimDecimal(amount / 1000)}K`
  return `ETB ${trimDecimal(amount / 1_000_000)}M`
}

/** Axis ticks don't need the currency on every label. */
export function formatCompact(amount: number): string {
  if (Math.abs(amount) < 1000) return String(amount)
  if (Math.abs(amount) < 1_000_000) return `${trimDecimal(amount / 1000)}K`
  return `${trimDecimal(amount / 1_000_000)}M`
}

function trimDecimal(n: number): string {
  return (Math.round(n * 10) / 10).toString()
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatLongDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

/** "Today", "Tomorrow", "Yesterday", or a short date. */
export function relativeDay(iso: string, now: Date = new Date()): string {
  const diff = Math.round((startOfDay(new Date(iso)).getTime() - startOfDay(now).getTime()) / DAY)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  return formatDate(iso)
}

export function formatSchedule(iso: string): string {
  return `${relativeDay(iso)}, ${formatTime(iso)}`
}

export function timeAgo(iso: string, now: Date = new Date()): string {
  const minutes = Math.round((now.getTime() - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.round(days / 30)
  return `${months} month${months === 1 ? '' : 's'} ago`
}

/** `12.4` -> `+12.4%`. */
export function formatSignedPercent(value: number): string {
  const rounded = Math.round(value * 10) / 10
  return `${rounded > 0 ? '+' : ''}${rounded}%`
}
