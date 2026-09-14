import type { BookingStatus } from '@/types'
import type { DriverStatus, PartnerStatus, VehicleStatus } from './types'

/**
 * How each status is presented.
 *
 * Colour is reserved for state that means something: needs action (warning),
 * finished well (good), failed (critical). Everything in motion stays in the
 * brand's neutral silver. Because good and critical are nearly identical to a
 * red-green colourblind reader, colour is never the only channel — every
 * status also has a distinct glyph, and the badge always prints its label.
 */

export type StatusTone = 'good' | 'warning' | 'critical' | 'neutral' | 'muted'

export type StatusGlyph = 'check' | 'cross' | 'clock' | 'ring' | 'dot' | 'arrow' | 'pulse' | 'pause' | 'wrench'

export interface StatusMeta {
  tone: StatusTone
  glyph: StatusGlyph
}

export const toneColor: Record<StatusTone, string> = {
  good: 'var(--status-good)',
  warning: 'var(--status-warning)',
  critical: 'var(--status-critical)',
  neutral: '#FFFFFF',
  muted: 'rgba(255,255,255,0.45)',
}

export const bookingStatusMeta: Record<BookingStatus, StatusMeta> = {
  Pending: { tone: 'warning', glyph: 'clock' },
  Confirmed: { tone: 'neutral', glyph: 'ring' },
  Assigned: { tone: 'neutral', glyph: 'dot' },
  'Driver En Route': { tone: 'neutral', glyph: 'arrow' },
  'In Progress': { tone: 'neutral', glyph: 'pulse' },
  Completed: { tone: 'good', glyph: 'check' },
  Cancelled: { tone: 'critical', glyph: 'cross' },
}

export const driverStatusMeta: Record<DriverStatus, StatusMeta> = {
  Available: { tone: 'good', glyph: 'check' },
  'On Trip': { tone: 'neutral', glyph: 'pulse' },
  'Off Duty': { tone: 'muted', glyph: 'pause' },
}

export const vehicleStatusMeta: Record<VehicleStatus, StatusMeta> = {
  Available: { tone: 'good', glyph: 'check' },
  'On Trip': { tone: 'neutral', glyph: 'pulse' },
  Maintenance: { tone: 'warning', glyph: 'wrench' },
}

export const partnerStatusMeta: Record<PartnerStatus, StatusMeta> = {
  Active: { tone: 'good', glyph: 'check' },
  Pending: { tone: 'warning', glyph: 'clock' },
  Suspended: { tone: 'critical', glyph: 'cross' },
}
