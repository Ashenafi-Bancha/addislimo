import { useState } from 'react'
import { serviceCatalog } from '@/data/service-catalog'
import type { Page } from '@/app/routes'

interface Props { navigate: (p: Page) => void }

export default function Services({ navigate }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 72 }}>
      {/* Header */}
      <section style={{
        padding: '72px 32px 64px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        background: 'var(--surface)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16 }}>Our Services</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 700, lineHeight: 1.05, marginBottom: 16,
            background: 'var(--gold-gradient-h)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Premium Transportation,<br /><em>Every Journey.</em></h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ height: 1, width: 56, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
            <span style={{ color: '#FFFFFF', fontSize: 10 }}>✦</span>
            <div style={{ height: 1, width: 56, background: 'linear-gradient(to left, transparent, #FFFFFF)' }} />
          </div>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.82)', maxWidth: 560, lineHeight: 1.75 }}>
            From airport arrivals to diplomatic missions, corporate travel to city explorations, Addis Limo delivers international-standard chauffeur services across Addis Ababa.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section style={{ padding: '64px 32px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {serviceCatalog.map((s, i) => (
            <div
              key={i}
              className="card-hover"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: 'var(--surface-2)',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
              <div style={{ height: 240, overflow: 'hidden', position: 'relative', background: '#090909' }}>
                <img
                  src={s.img}
                  alt={s.title}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 0.5s ease',
                    transform: hovered === i ? 'scale(1.06)' : 'scale(1)',
                  }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(11,11,11,0.7) 0%, transparent 60%)',
                }} />
              </div>
              <div style={{ padding: '28px 32px 32px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24, fontWeight: 600,
                  color: hovered === i ? '#FFFFFF' : '#FFFFFF',
                  marginBottom: 6, transition: 'color 0.2s',
                }}>{s.title}</h3>
                <p style={{ fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: 15, color: 'rgba(255,255,255,0.75)', marginBottom: 20 }}>
                  {s.tagline}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                  {s.features.map((f, fi) => (
                    <li key={fi} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.82)' }}>
                      <span style={{ color: '#FFFFFF', fontSize: 10 }}>◆</span> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(s.page)}
                  style={{
                    background: 'transparent', color: '#FFFFFF',
                    border: '1px solid #FFFFFF', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    padding: '14px 32px', transition: 'background 0.2s',
                  }}
                >{s.cta}</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
