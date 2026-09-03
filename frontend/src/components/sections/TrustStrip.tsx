import { useState } from 'react'
import { trustBadges } from '@/data/trust'

/**
 * The band directly beneath the home hero.
 *
 * Deliberately not a card grid: it reads as one continuous strip divided by
 * hairlines, so it settles the page after the full-bleed hero without
 * competing with the service cards further down. The figures come from
 * `data/trust.ts`, where two of them are counted from the real catalogue.
 */
export default function TrustStrip() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section
      style={{
        background: '#0A0A0A',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'relative',
      }}
    >
      {/* Hairline of light along the seam with the hero. */}
      <div
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)',
        }}
      />

      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 48px' }}>
        <div
          className="trust-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}
        >
          {trustBadges.map((b, i) => {
            const active = hovered === i
            return (
              <div
                key={b.label}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  padding: '46px 34px',
                  textAlign: 'center',
                  position: 'relative',
                  borderLeft: '1px solid rgba(255,255,255,0.06)',
                  transition: 'background 0.25s',
                  background: active ? 'rgba(255,255,255,0.02)' : 'transparent',
                }}
              >
                {/* Accent that draws in on hover. */}
                <div
                  style={{
                    position: 'absolute', top: 0, left: '50%',
                    transform: 'translateX(-50%)',
                    width: active ? '70%' : '0%', height: 2,
                    background: 'var(--gold-gradient-h)',
                    transition: 'width 0.35s ease',
                  }}
                />

                <div
                  style={{
                    fontSize: 20,
                    color: '#FFFFFF',
                    opacity: active ? 1 : 0.4,
                    marginBottom: 16,
                    transition: 'opacity 0.25s',
                  }}
                >
                  {b.icon}
                </div>

                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(30px, 3.2vw, 42px)',
                    fontWeight: 700,
                    lineHeight: 1,
                    margin: '0 0 12px',
                    background: 'var(--gold-gradient-h)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {b.value}
                </p>

                <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 10 }}>
                  {b.label}
                </p>

                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 12.5,
                    lineHeight: 1.65,
                    color: 'rgba(255,255,255,0.52)',
                    margin: '0 auto',
                    maxWidth: 230,
                  }}
                >
                  {b.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* The first cell of every row must not show a divider. */}
      <style>{`
        .trust-grid > div:first-child { border-left: none }
        @media (max-width: 1100px) { .trust-grid > div:nth-child(odd) { border-left: none } }
      `}</style>
    </section>
  )
}
