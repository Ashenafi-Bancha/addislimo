import { useState } from 'react'
import { pillOutline } from '@/components/ui/buttonStyles'
import { cardTopRule, raisedCard } from '@/components/ui/cardStyles'
import { homeServices } from '@/data/services'
import { fleet } from '@/data/fleet'
import { partnersRowOne, partnersRowTwo } from '@/data/partners'
import PartnerCard from '@/components/ui/PartnerCard'
import HomeHero from '@/components/sections/HomeHero'
import TrustStrip from '@/components/sections/TrustStrip'
import QuickLinks from '@/components/sections/QuickLinks'
import type { Page } from '@/app/routes'

interface HomeProps { navigate: (p: Page) => void }

export default function Home({ navigate }: HomeProps) {
  const [hovSvc, setHovSvc] = useState<number|null>(null)
  const [hovVeh, setHovVeh] = useState<number|null>(null)

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <HomeHero navigate={navigate} />

      {/* ── TRUST STRIP ── */}
      <TrustStrip />

      {/* ── QUICK LINKS ── */}
      <QuickLinks navigate={navigate} />

      {/* ── SERVICES ── */}
      <section style={{ padding: '112px 48px', maxWidth: 1380, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p className="label-caps" style={{ marginBottom: 14 }}>Our Services</p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4.5vw, 56px)', fontWeight: 700, lineHeight: 1.08,
            color: '#FFFFFF', marginBottom: 8,
          }}>Premium Transportation,</h2>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 50px)', fontWeight: 600, fontStyle: 'italic',
            background: 'var(--gold-gradient-h)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            lineHeight: 1.1, marginBottom: 24,
          }}>Every Journey.</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
            <div style={{ height: 1.5, width: 60, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
            <div style={{ width: 7, height: 7, background: '#FFFFFF', transform: 'rotate(45deg)', margin: '0 8px' }} />
            <div style={{ height: 1.5, width: 60, background: 'linear-gradient(to left, transparent, #FFFFFF)' }} />
          </div>
        </div>

        <div className="service-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
          {homeServices.map((s, i) => {
            const active = hovSvc === i
            return (
              <div key={i}
                onClick={() => navigate(s.page)}
                onMouseEnter={() => setHovSvc(i)}
                onMouseLeave={() => setHovSvc(null)}
                style={{ ...raisedCard(active), padding: '34px 30px 30px', cursor: 'pointer' }}
              >
                <div style={cardTopRule(active)} />

                <div style={{
                  fontSize: 24, marginBottom: 18, color: '#FFFFFF',
                  opacity: active ? 1 : 0.5, transition: 'opacity 0.3s',
                }}>{s.icon}</div>

                <h3 style={{
                  fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700,
                  lineHeight: 1.25, margin: '0 0 10px', color: '#FFFFFF',
                }}>{s.title}</h3>

                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{s.subtitle}</p>

                {/* Sits in the flow so the card does not resize on hover. */}
                <p style={{
                  color: '#FFFFFF', fontSize: 10.5, fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  margin: '22px 0 0',
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateX(0)' : 'translateX(-6px)',
                  transition: 'opacity 0.3s, transform 0.3s',
                }}>Learn More →</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── ADDIS PHOTO FEATURE ── */}
      <section style={{ position: 'relative', height: 520, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1604560842632-bd795d8f1275?w=1900&h=600&fit=crop&auto=format)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,3,3,0.80)' }} />
        <div style={{ position: 'absolute', left: 0, top: '12%', height: '76%', width: 3, background: 'var(--gold-gradient)' }} />

        <div className="gutter" style={{ position: 'relative', maxWidth: 1380, margin: '0 auto', padding: '0 48px', height: '100%', display: 'flex', alignItems: 'center' }}>
          <div style={{ maxWidth: 580, paddingLeft: 32 }}>
            <div style={{ display: 'flex', gap: 3, color: 'var(--gold-bright)', fontSize: 13, marginBottom: 18 }}>
              {['★','★','★','★','★'].map((s,i)=><span key={i}>{s}</span>)}
            </div>
            <p className="label-caps" style={{ marginBottom: 12 }}>Addis Ababa, Ethiopia</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(30px, 4vw, 50px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 6, color: '#FFFFFF' }}>
              Africa&apos;s capital city.
            </h2>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.1, marginBottom: 24, background: 'var(--gold-sheen)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Explored with elegance.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.8, marginBottom: 36 }}>
              Discover museums, cultural restaurants, scenic parks and vibrant neighborhoods, all with a professional chauffeur and premium vehicle.
            </p>
            <button
              onClick={() => navigate('explore')}
              style={pillOutline}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >Explore Addis</button>
          </div>
        </div>
      </section>

      {/* ── VEHICLES ── */}
      <section style={{ padding: '112px 48px', maxWidth: 1380, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <p className="label-caps" style={{ marginBottom: 12 }}>Our Fleet</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 46px)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, marginBottom: 2 }}>Travel in the</h2>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 600, fontStyle: 'italic', background: 'var(--gold-gradient-h)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.1 }}>Right Vehicle.</h2>
          </div>
          <button style={pillOutline} onClick={() => navigate('booking')}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
          >Request a Vehicle</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          {fleet.map((v, i) => (
            <div key={i}
              onMouseEnter={() => setHovVeh(i)}
              onMouseLeave={() => setHovVeh(null)}
              style={{
                background: '#111111', overflow: 'hidden', cursor: 'pointer',
                border: `1px solid ${hovVeh === i ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: hovVeh === i ? '0 16px 60px rgba(0,0,0,0.6)' : 'none',
                transform: hovVeh === i ? 'translateY(-4px)' : 'none',
                transition: 'all 0.3s',
                position: 'relative',
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
              <div style={{ height: 230, overflow: 'hidden', background: '#0a0a0a' }}>
                <img src={v.img} alt={v.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s', transform: hovVeh === i ? 'scale(1.06)' : 'scale(1)' }} />
              </div>
              <div style={{ padding: '26px 28px' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: hovVeh === i ? '#FFFFFF' : '#FFFFFF', marginBottom: 8, transition: 'color 0.2s' }}>{v.name}</h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.72)', marginBottom: 18, lineHeight: 1.6 }}>{v.desc}</p>
                <div style={{ display: 'flex', gap: 24, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 16 }}>
                  <div>
                    <p className="label-caps" style={{ fontSize: 8, marginBottom: 4 }}>Capacity</p>
                    <p style={{ fontSize: 13, color: '#FFFFFF', fontWeight: 600 }}>{v.capacity} pax</p>
                  </div>
                  <div>
                    <p className="label-caps" style={{ fontSize: 8, marginBottom: 4 }}>Luggage</p>
                    <p style={{ fontSize: 13, color: '#FFFFFF', fontWeight: 600 }}>{v.luggage}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <section style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, #0A0A0A 0%, var(--ink) 100%)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}>
        {/* Heading */}
        <div className="gutter" style={{ textAlign: 'center', marginBottom: 64, padding: '0 48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ height: 1, width: 48, background: 'linear-gradient(to right, transparent, rgba(212,175,90,0.5))' }} />
            <p className="label-caps" style={{ color: '#FFFFFF', fontSize: 9, letterSpacing: '0.3em' }}>Our Partners</p>
            <div style={{ height: 1, width: 48, background: 'linear-gradient(to left, transparent, rgba(212,175,90,0.5))' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 700,
            color: '#FFFFFF',
            lineHeight: 1.05,
            letterSpacing: '-0.01em',
          }}>Trusted by.</h2>
        </div>

        {/* Marquee row 1 — left */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 160, background: 'linear-gradient(to right, #0A0A0A, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 160, background: 'linear-gradient(to left, #0A0A0A, transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', animation: 'marqueeLeft 36s linear infinite', width: 'max-content' }}>
            {[...Array(2)].map((_, rep) => (
              <div key={rep} style={{ display: 'flex', gap: 14, paddingRight: 14 }}>
                {partnersRowOne.map((p, i) => <PartnerCard key={`r1-${rep}-${i}`} name={p.name} sub={p.sub} logo={p.logo} />)}
              </div>
            ))}
          </div>
        </div>

        {/* Marquee row 2 — right (opposite direction) */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 160, background: 'linear-gradient(to right, var(--ink), transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 160, background: 'linear-gradient(to left, var(--ink), transparent)', zIndex: 2, pointerEvents: 'none' }} />
          <div style={{ display: 'flex', animation: 'marqueeRight 40s linear infinite', width: 'max-content' }}>
            {[...Array(2)].map((_, rep) => (
              <div key={rep} style={{ display: 'flex', gap: 14, paddingRight: 14 }}>
                {partnersRowTwo.map((p, i) => <PartnerCard key={`r2-${rep}-${i}`} name={p.name} sub={p.sub} logo={p.logo} />)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER CTA SPLIT ── */}
      <section style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <div style={{ background: 'var(--gold-gradient)', padding: '60px 52px', position: 'relative' }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(6,6,6,0.5)', marginBottom: 14 }}>For Passengers</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: '#060606', lineHeight: 1.15, marginBottom: 16 }}>
                Book Your<br />Premium Journey
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(6,6,6,0.62)', lineHeight: 1.75, marginBottom: 36 }}>
                Airport transfers, corporate travel, city tours. Book now and experience Addis Ababa at its finest.
              </p>
              <button onClick={() => navigate('booking')} style={{
                background: '#060606', color: '#FFFFFF', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '13px 30px', borderRadius: '50px',
                transition: 'background 0.2s',
              }}>Book a Ride</button>
            </div>

            <div style={{ background: '#111111', padding: '60px 52px', border: '1px solid rgba(255,255,255,0.15)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
              <p className="label-caps" style={{ marginBottom: 14 }}>For Partners</p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 6 }}>
                Grow With
              </h3>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px,2.8vw,34px)', fontWeight: 600, fontStyle: 'italic', background: 'var(--gold-gradient-h)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1.15, marginBottom: 16 }}>
                Addis Limo.
              </h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, marginBottom: 36 }}>
                Hotels, vehicle owners, transport companies: join our premium partner network.
              </p>
              <button onClick={() => navigate('about')} style={pillOutline}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >Become a Partner</button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marqueeLeft  { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes marqueeRight { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        @media(max-width:720px){
          section>div>div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}
        }
      `}</style>
    </div>
  )
}
