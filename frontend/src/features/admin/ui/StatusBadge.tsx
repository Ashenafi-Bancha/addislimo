import type { StatusGlyph, StatusMeta } from '../status'
import { toneColor } from '../status'

interface StatusBadgeProps {
  label: string
  meta: StatusMeta
  size?: 'sm' | 'md'
}

/**
 * A status pill: glyph + label on a neutral chip.
 *
 * The label text stays in neutral ink and only the glyph carries the status
 * colour, so the text is always legible and meaning never depends on hue.
 */
export default function StatusBadge({ label, meta, size = 'md' }: StatusBadgeProps) {
  const color = toneColor[meta.tone]
  const small = size === 'sm'

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: small ? 6 : 7,
        height: small ? 22 : 26,
        padding: small ? '0 8px 0 7px' : '0 10px 0 8px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.10)',
        fontFamily: 'var(--font-body)',
        fontSize: small ? 11.5 : 12,
        fontWeight: 600,
        color: meta.tone === 'muted' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.92)',
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}
    >
      <Glyph glyph={meta.glyph} color={color} size={small ? 10 : 11} />
      {label}
    </span>
  )
}

export function Glyph({ glyph, color, size = 11 }: { glyph: StatusGlyph; color: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 12 12',
    fill: 'none',
    'aria-hidden': true as const,
    style: { flexShrink: 0, display: 'block' },
  }

  switch (glyph) {
    case 'check':
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="6" fill={color} />
          <path d="M3.4 6.2l1.8 1.8 3.4-3.6" stroke="#070707" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'cross':
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="6" fill={color} />
          <path d="M4 4l4 4M8 4l-4 4" stroke="#070707" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="5.2" stroke={color} strokeWidth="1.6" />
          <path d="M6 3.4V6l1.8 1.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )
    case 'ring':
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="4.4" stroke={color} strokeWidth="1.8" />
        </svg>
      )
    case 'dot':
      return (
        <svg {...common}>
          <circle cx="6" cy="6" r="4" fill={color} />
        </svg>
      )
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M2 6h7M6.4 3l3 3-3 3" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'pause':
      return (
        <svg {...common}>
          <path d="M4.2 3v6M7.8 3v6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'wrench':
      return (
        <svg {...common}>
          <path d="M7.6 1.6a2.6 2.6 0 0 0-2.5 3.4L1.7 8.4a1 1 0 0 0 1.4 1.4L6.5 6.4a2.6 2.6 0 0 0 3.4-2.5L8.4 5.4 6.6 3.6z" fill={color} />
        </svg>
      )
    case 'pulse':
      return (
        <span style={{ position: 'relative', width: size, height: size, display: 'inline-block', flexShrink: 0 }} aria-hidden="true">
          <span className="admin-pulse" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, opacity: 0.35 }} />
          <span style={{ position: 'absolute', inset: '25%', borderRadius: '50%', background: color }} />
        </span>
      )
  }
}
