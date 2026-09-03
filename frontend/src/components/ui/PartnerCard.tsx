import type { Partner } from '@/types'
import { initialsOf } from '@/lib/utils'

/**
 * A partner tile in the home-page marquee.
 *
 * Falls back to a monogram when `logo` is null, and again at runtime if the
 * image fails to load — several partner logos are hot-linked from Clearbit.
 */
export default function PartnerCard({ name, sub, logo }: Partner) {
  const initials = initialsOf(name)
  return (
    <div style={{
      background: '#0E0E0E',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 3,
      padding: '20px 28px',
      display: 'flex', alignItems: 'center', gap: 16,
      minWidth: 220, flexShrink: 0,
      backdropFilter: 'blur(8px)',
      transition: 'border-color 0.3s, background 0.3s',
      cursor: 'default',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.25)'; (e.currentTarget as HTMLDivElement).style.background = '#141414' }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLDivElement).style.background = '#0E0E0E' }}
    >
      {/* Logo / monogram */}
      <div style={{
        width: 52, height: 44, flexShrink: 0, borderRadius: 2,
        background: logo ? '#FFFFFF' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${logo ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.09)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        padding: logo ? '6px' : '0',
      }}>
        {logo ? (
          <img
            src={logo}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.92 }}
            onError={e => {
              const img = e.currentTarget as HTMLImageElement
              const fb = img.nextElementSibling as HTMLElement
              img.style.display = 'none'
              if (fb) fb.style.display = 'flex'
            }}
          />
        ) : null}
        <span style={{
          display: logo ? 'none' : 'flex',
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
          color: '#FFFFFF', letterSpacing: '0.05em',
        }}>{initials}</span>
      </div>
      {/* Text */}
      <div>
        <p style={{
          fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700,
          color: '#FFFFFF', letterSpacing: '0.01em', marginBottom: 2, whiteSpace: 'nowrap',
        }}>{name}</p>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700,
          color: 'rgba(255,255,255,0.40)', letterSpacing: '0.18em', textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>{sub}</p>
      </div>
    </div>
  )
}
