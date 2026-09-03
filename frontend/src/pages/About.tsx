import { brandValues, partnerTypes } from '@/data/about'
import type { Page } from '@/app/routes'
interface Props { navigate: (p: Page) => void }

export default function About({ navigate }: Props) {
  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 72 }}>
      {/* Hero */}
      <section style={{
        background: 'var(--surface)',
        padding: '80px 32px 0',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px 80px', alignItems: 'end' }}>
            <div style={{ paddingBottom: 64 }}>
              <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16 }}>About</p>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(36px, 5vw, 60px)',
                fontWeight: 700, lineHeight: 1.05, marginBottom: 28,
                background: 'var(--gold-gradient-h)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>Addis Ababa&apos;s<br /><em>Premium Chauffeur Platform.</em></h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.82)', lineHeight: 1.8, marginBottom: 20 }}>
                Addis Limo is a premium transportation and chauffeur platform operating in Addis Ababa, Ethiopia. We connect customers with professional drivers and vehicles through our curated partner network.
              </p>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.82)', lineHeight: 1.8 }}>
                We manage the customer experience, bookings, service quality, coordination and technology, so every journey is seamless, comfortable and exactly what a premium service should be.
              </p>
            </div>
            <div style={{ height: 400, background: '#090909', overflow: 'hidden' }}>
              <img
                src="https://images.unsplash.com/photo-1771350368994-9d87f0d8431f?w=700&h=500&fit=crop&auto=format"
                alt="Addis Ababa skyline"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '80px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 48 }}>What We Stand For</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2px' }}>
          {brandValues.map((v, i) => (
            <div key={i} style={{ background: 'var(--surface-2)', padding: '40px 32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
              <div style={{ width: 32, height: 2, background: '#FFFFFF', marginBottom: 24 }} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#FFFFFF', marginBottom: 12 }}>{v.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partner section */}
      <section style={{ background: '#0A0A0A', padding: '80px 32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '48px 80px', alignItems: 'start' }}>
            <div>
              <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16 }}>Partner Network</p>
              <div style={{ display: 'flex', gap: 3, color: 'rgba(255,255,255,0.80)', fontSize: 12, marginBottom: 12 }}>
                {['★','★','★','★','★'].map((s,i)=><span key={i}>{s}</span>)}
              </div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 36, fontWeight: 600, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 8,
              }}>Grow With Addis Limo.</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ height: 1, width: 56, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
                <span style={{ color: '#FFFFFF', fontSize: 10 }}>✦</span>
                <div style={{ height: 1, width: 56, background: 'linear-gradient(to left, transparent, #FFFFFF)' }} />
              </div>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 32 }}>
                Join our premium transportation network and connect your vehicles and chauffeur services with customers looking for reliable transportation in Addis Ababa.
              </p>
              <button
                onClick={() => navigate('booking')}
                style={{
                  background: 'var(--gold-gradient)', color: '#060606',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  padding: '14px 28px', borderRadius: '50px',
                  boxShadow: '0 2px 24px rgba(255,255,255,0.10)',
                  transition: 'box-shadow 0.2s, transform 0.15s',
                }}
              >Become a Partner</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {partnerTypes.map((p, i) => (
                <div key={i} style={{ border: '1px solid rgba(255,255,255,0.1)', padding: '28px 24px' }}>
                  <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 10, fontSize: 10 }}>{p.type}</p>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65 }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Business model note */}
      <section style={{ padding: '72px 32px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16 }}>The Addis Limo Model</p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            &ldquo;Luxury without being flashy. Technology without feeling complicated. Ethiopian without looking stereotypical.&rdquo;
          </p>
        </div>
      </section>

      <style>{`
        @media(max-width:800px){
          section > div[style*="grid-template-columns: 1fr 1fr"],
          section > div[style*="grid-template-columns: 1fr 2fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
