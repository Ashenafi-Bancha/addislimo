import { useState } from 'react'
import { trustBadges } from '@/data/trust'
import { differentiators } from '@/data/services'

/**
 * "Why Addis Limo" — the trust section, directly beneath the home hero.
 *
 * Three layers, smallest to largest: a compact heading, a slim row of
 * headline figures, then the six reasons as raised cards. Each card is a
 * gradient tile with a lit inset hairline along its top edge and a deep drop
 * shadow, so it reads as a physical edge against the black page; on hover it
 * lifts, the shadow deepens and a gradient rule draws across the top.
 */
export default function TrustStrip() {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section
      className="section-tall"
      style={{
        background: '#0A0A0A',
        padding: '84px 48px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ maxWidth: 1380, margin: '0 auto' }}>
        {/* Heading — kept deliberately small so the cards carry the section. */}
        <div style={{ textAlign: 'center', marginBottom: 34 }}>
          <p className="label-caps" style={{ marginBottom: 12 }}>Why Addis Limo</p>
          <h2
            className="trust-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(21px, 2.4vw, 32px)',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            Reliable.{' '}
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 600,
                background: 'var(--gold-gradient-h)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Refined.
            </span>{' '}
            Ready.
          </h2>
        </div>

        {/* Headline figures, as a slim rule-separated row rather than cards. */}
        <div
          className="trust-stats"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '14px 0',
            marginBottom: 46,
          }}
        >
          {trustBadges.map((b, i) => (
            <div
              key={b.label}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 9,
                padding: '0 26px',
                borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 700,
                  lineHeight: 1,
                  background: 'var(--gold-gradient-h)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {b.value}
              </span>
              <span className="label-caps" style={{ color: 'rgba(255,255,255,0.62)' }}>
                {b.label}
              </span>
            </div>
          ))}
        </div>

        {/* The six reasons, as raised cards. */}
        <div
          className="trust-grid"
          style={{
            display: 'grid',
            // 360px settles six cards into 3 + 3 on desktop rather than a
            // ragged 4 + 2, then steps down to 2 and 1 on smaller screens.
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 18,
          }}
        >
          {differentiators.map((t, i) => {
            const active = hovered === i
            return (
              <div
                key={t.n}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  padding: '30px 28px 28px',
                  borderRadius: 14,
                  background: active
                    ? 'linear-gradient(165deg, #1B1B1B 0%, #101010 55%, #0B0B0B 100%)'
                    : 'linear-gradient(165deg, #141414 0%, #0D0D0D 55%, #090909 100%)',
                  border: `1px solid ${active ? 'rgba(255,255,255,0.26)' : 'rgba(255,255,255,0.09)'}`,
                  // Inset hairline on the top edge reads as a lit bevel; the
                  // outer shadows lift the card off the page.
                  boxShadow: active
                    ? 'inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.6), 0 26px 55px rgba(0,0,0,0.72), 0 3px 10px rgba(0,0,0,0.5)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.5), 0 14px 32px rgba(0,0,0,0.55)',
                  transform: active ? 'translateY(-6px)' : 'translateY(0)',
                  transition:
                    'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease',
                }}
              >
                {/* Gradient rule that draws in from the left on hover. */}
                <div
                  style={{
                    position: 'absolute', top: 0, left: 0,
                    width: active ? '100%' : '0%', height: 2,
                    background: 'var(--gold-gradient-h)',
                    transition: 'width 0.4s ease',
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      background: 'var(--gold-gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {t.n}
                  </span>
                  <span
                    style={{
                      height: 1,
                      width: active ? 34 : 22,
                      background: 'var(--gold-gradient-h)',
                      opacity: active ? 0.9 : 0.45,
                      transition: 'width 0.3s ease, opacity 0.3s ease',
                    }}
                  />
                </div>

                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#FFFFFF',
                    margin: '0 0 8px',
                    lineHeight: 1.25,
                  }}
                >
                  {t.label}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.6)',
                    margin: 0,
                  }}
                >
                  {t.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
