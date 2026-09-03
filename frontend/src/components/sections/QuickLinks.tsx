import { useState } from 'react'
import type { Page } from '@/app/routes'
import { quickLinks } from '@/config/site'

interface QuickLinksProps {
  navigate: (page: Page) => void
}

/**
 * Shortcut grid between the trust strip and the service cards.
 *
 * Distinct from the service cards on purpose: outlined tiles with a numbered
 * index and a travelling arrow, rather than the filled, icon-led cards below.
 * Someone who arrived knowing what they want can leave the home page here.
 */
export default function QuickLinks({ navigate }: QuickLinksProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section style={{ padding: '96px 48px 8px', maxWidth: 1380, margin: '0 auto' }}>
      {/* Heading */}
      <div style={{ marginBottom: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        <div>
          <p className="label-caps" style={{ marginBottom: 14 }}>Quick Links</p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px, 3.2vw, 40px)',
              fontWeight: 700,
              lineHeight: 1.1,
              color: '#FFFFFF',
              margin: 0,
            }}
          >
            Know what you need?{' '}
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
              Go straight there.
            </span>
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, paddingBottom: 6 }}>
          <div style={{ height: 1.5, width: 60, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
          <div style={{ width: 7, height: 7, background: '#FFFFFF', transform: 'rotate(45deg)', margin: '0 8px' }} />
        </div>
      </div>

      {/* Tiles */}
      {/* 360px keeps six tiles at a balanced 3 + 3 on desktop rather than a
          ragged 4 + 2, then steps down to 2 and 1 on smaller screens. */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 14 }}>
        {quickLinks.map((link, i) => {
          const active = hovered === i
          return (
            <button
              key={link.label}
              onClick={() => navigate(link.page)}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                appearance: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                background: active ? 'rgba(255,255,255,0.04)' : 'transparent',
                border: `1px solid ${active ? 'rgba(255,255,255,0.30)' : 'rgba(255,255,255,0.09)'}`,
                borderRadius: 3,
                padding: '26px 26px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                transition: 'background 0.25s, border-color 0.25s, transform 0.25s',
                transform: active ? 'translateY(-3px)' : 'translateY(0)',
              }}
            >
              {/* Index */}
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 15,
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: active ? '#FFFFFF' : 'rgba(255,255,255,0.28)',
                  transition: 'color 0.25s',
                  flexShrink: 0,
                  paddingTop: 2,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-display)',
                    fontSize: 19,
                    fontWeight: 600,
                    color: '#FFFFFF',
                    marginBottom: 6,
                    lineHeight: 1.25,
                  }}
                >
                  {link.label}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12.5,
                    lineHeight: 1.6,
                    color: 'rgba(255,255,255,0.55)',
                  }}
                >
                  {link.desc}
                </span>
              </span>

              {/* Travelling arrow */}
              <span
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 17,
                  lineHeight: 1.2,
                  color: active ? '#FFFFFF' : 'rgba(255,255,255,0.25)',
                  transform: active ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'transform 0.25s, color 0.25s',
                  flexShrink: 0,
                  paddingTop: 2,
                }}
                aria-hidden="true"
              >
                →
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
