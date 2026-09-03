import { useState } from 'react'
import { categories, destinations, type Category } from '@/data/destinations'
import type { Page } from '@/app/routes'

interface Props { navigate: (p: Page) => void }

export default function ExploreAddis({ navigate }: Props) {
  const [active, setActive] = useState<Category>('all')
  const [hovered, setHovered] = useState<number | null>(null)

  const filtered = active === 'all' ? destinations : destinations.filter(d => d.cat === active)

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 72 }}>
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: 460, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1771350368994-9d87f0d8431f?w=1800&h=600&fit=crop&auto=format)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(11,11,11,0.9) 50%, rgba(11,11,11,0.5))' }} />
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '80px 32px', width: '100%' }}>
          <div style={{ display: 'flex', gap: 3, color: 'rgba(255,255,255,0.80)', fontSize: 12, marginBottom: 16 }}>
            {['★','★','★','★','★'].map((s,i)=><span key={i}>{s}</span>)}
          </div>
          <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16 }}>Addis Ababa · Ethiopia</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 68px)',
            fontWeight: 700, lineHeight: 1.05, marginBottom: 24, maxWidth: 640,
            background: 'var(--gold-gradient-h)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Explore Addis.<br /><em>Experience More.</em></h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', maxWidth: 520, lineHeight: 1.75, marginBottom: 36 }}>
            Discover the culture, history, food, nature and energy of Ethiopia&apos;s capital with comfortable private transportation.
          </p>
          <button
            onClick={() => navigate('booking')}
            style={{
              background: 'var(--gold-gradient)', color: '#060606',
              border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '14px 32px', borderRadius: '50px',
              boxShadow: '0 2px 24px rgba(255,255,255,0.10)',
              transition: 'box-shadow 0.2s, transform 0.15s',
            }}
          >Plan My Tour</button>
        </div>
      </section>

      {/* Category filter */}
      <section style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'var(--surface)', position: 'sticky', top: 72, zIndex: 50 }}>
        <div className="gutter" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
          <div style={{ display: 'flex', gap: 2, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: active === c.id ? '#FFFFFF' : 'rgba(255,255,255,0.75)',
                  padding: '20px 20px',
                  borderBottom: `2px solid ${active === c.id ? '#FFFFFF' : 'transparent'}`,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
              >{c.label}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations grid */}
      <section style={{ padding: '56px 32px', maxWidth: 1280, margin: '0 auto' }}>
        <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: 13, marginBottom: 32 }}>
          {filtered.length} experience{filtered.length !== 1 ? 's' : ''} · Private chauffeur available for all destinations
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {filtered.map((d, i) => (
            <div
              key={i}
              className="card-hover"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ background: 'var(--surface-2)', overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
              <div style={{ height: 200, overflow: 'hidden', position: 'relative', background: '#090909' }}>
                <img
                  src={d.img}
                  alt={d.name}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    transition: 'transform 0.5s',
                    transform: hovered === i ? 'scale(1.06)' : 'scale(1)',
                  }}
                />
                <div style={{ position: 'absolute', top: 14, left: 14 }}>
                  <span style={{
                    background: 'rgba(11,11,11,0.8)', color: '#FFFFFF',
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.1em',
                    textTransform: 'uppercase', padding: '5px 10px',
                    border: '1px solid rgba(255,255,255,0.3)',
                  }}>{d.tag}</span>
                </div>
              </div>
              <div style={{ padding: '24px 24px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 19, fontWeight: 600,
                  color: hovered === i ? '#FFFFFF' : '#FFFFFF',
                  marginBottom: 8, transition: 'color 0.2s', lineHeight: 1.2,
                }}>{d.name}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, marginBottom: 20 }}>{d.desc}</p>
                <button
                  onClick={() => navigate('booking')}
                  style={{
                    background: 'transparent', color: '#FFFFFF',
                    border: '1px solid #FFFFFF', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    padding: '10px 20px', transition: 'background 0.2s',
                  }}
                >Book a Ride</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Build your day CTA */}
      <section style={{ background: 'var(--surface)', padding: '80px 32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 3, color: 'rgba(255,255,255,0.80)', fontSize: 12, marginBottom: 16, justifyContent: 'center' }}>
            {['★','★','★','★','★'].map((s,i)=><span key={i}>{s}</span>)}
          </div>
          <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16 }}>Custom Itinerary</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 600, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 8,
          }}>Create Your Addis Experience</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ height: 1, width: 56, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
            <span style={{ color: '#FFFFFF', fontSize: 10 }}>✦</span>
            <div style={{ height: 1, width: 56, background: 'linear-gradient(to left, transparent, #FFFFFF)' }} />
          </div>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 36 }}>
            Choose your museums, restaurants, parks and cultural experiences. We coordinate the chauffeur and route. You simply explore.
          </p>
          <button
            onClick={() => navigate('booking')}
            style={{
              background: 'var(--gold-gradient)', color: '#060606',
              border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '14px 40px',
              boxShadow: '0 2px 24px rgba(255,255,255,0.10)',
              transition: 'box-shadow 0.2s, transform 0.15s',
            }}
          >Request Custom Experience</button>
        </div>
      </section>
    </div>
  )
}
