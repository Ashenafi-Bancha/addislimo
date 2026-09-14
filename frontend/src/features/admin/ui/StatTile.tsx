import type { ReactNode } from 'react'
import { formatSignedPercent } from '../format'
import Icon, { type IconName } from './Icon'
import { panel } from './styles'

interface StatTileProps {
  label: string
  value: string
  icon: IconName
  /** Percentage change vs `comparedTo`. `null` when there is no prior data. */
  delta?: number | null
  comparedTo?: string
  /** Whether a rise is good news. Revenue: yes. Cancellations: no. */
  higherIsBetter?: boolean
  /** Replaces the delta line, e.g. for a count that needs action. */
  footnote?: ReactNode
  onClick?: () => void
}

/**
 * A headline figure: label, value, and change against a named period.
 *
 * The value is set in the sans, not the display serif — a number is data, and
 * Playfair at this size reads as decoration. The delta arrow repeats what the
 * colour says, so direction is clear without relying on red and green.
 */
export default function StatTile({
  label,
  value,
  icon,
  delta,
  comparedTo,
  higherIsBetter = true,
  footnote,
  onClick,
}: StatTileProps) {
  const hasDelta = typeof delta === 'number' && Number.isFinite(delta)
  const up = hasDelta && (delta as number) > 0.05
  const down = hasDelta && (delta as number) < -0.05
  const good = (up && higherIsBetter) || (down && !higherIsBetter)
  const bad = (down && higherIsBetter) || (up && !higherIsBetter)
  const deltaColor = good ? 'var(--status-good)' : bad ? 'var(--status-critical)' : 'var(--admin-text-muted)'

  const Tag = onClick ? 'button' : 'div'

  return (
    <Tag
      onClick={onClick}
      className={onClick ? 'admin-stat admin-stat-action' : 'admin-stat'}
      style={{
        ...panel,
        padding: '18px 20px',
        textAlign: 'left',
        width: '100%',
        cursor: onClick ? 'pointer' : 'default',
        color: 'inherit',
        font: 'inherit',
        display: 'block',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--admin-text-muted)' }}>
          {label}
        </span>
        <span
          className="admin-stat-icon"
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--admin-hairline)',
            color: 'rgba(255,255,255,0.75)',
          }}
        >
          <Icon name={icon} size={15} />
        </span>
      </div>

      <p
        className="admin-stat-value"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(22px, 2.2vw, 28px)',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: '#FFFFFF',
          margin: '10px 0 8px',
          lineHeight: 1.1,
        }}
      >
        {value}
      </p>

      {footnote ?? (
        <p style={{ display: 'flex', alignItems: 'center', gap: 6, margin: 0, fontFamily: 'var(--font-body)', fontSize: 12 }}>
          {hasDelta ? (
            <>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: deltaColor, fontWeight: 700 }}>
                {up && <Icon name="trendUp" size={13} strokeWidth={2} />}
                {down && <Icon name="trendDown" size={13} strokeWidth={2} />}
                {formatSignedPercent(delta as number)}
              </span>
              <span className="admin-stat-compared" style={{ color: 'var(--admin-text-faint)' }}>vs {comparedTo}</span>
            </>
          ) : (
            <span style={{ color: 'var(--admin-text-faint)' }}>No prior data to compare</span>
          )}
        </p>
      )}
    </Tag>
  )
}
