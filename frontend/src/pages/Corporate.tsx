import { corporateClients, corporateFeatures, corporateVenues } from '@/data/corporate'
import type { Page } from '@/app/routes'
interface Props { navigate: (p: Page) => void }

export default function Corporate({ navigate }: Props) {
  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 72 }}>
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: 480, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=1800&h=600&fit=crop&auto=format)',
          backgroundSize: 'cover', backgroundPosition: 'center 30%',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(11,11,11,0.92) 55%, rgba(11,11,11,0.6))' }} />
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '80px 32px', width: '100%' }}>
          <div style={{ display: 'flex', gap: 3, color: 'rgba(255,255,255,0.80)', fontSize: 12, marginBottom: 16 }}>
            {['★','★','★','★','★'].map((s,i)=><span key={i}>{s}</span>)}
          </div>
          <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16 }}>Corporate & Executive</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 68px)',
            fontWeight: 700, lineHeight: 1.05, marginBottom: 24, maxWidth: 640,
            background: 'var(--gold-gradient-h)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Executive Travel,<br /><em>Without the Friction.</em></h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', maxWidth: 520, lineHeight: 1.75, marginBottom: 36 }}>
            Premium transportation services for companies, NGOs, embassies, diplomatic missions and international organizations operating in Addis Ababa.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
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
            >Request Corporate Service</button>
            <button
              style={{
                background: 'transparent', color: '#FFFFFF',
                border: '1px solid #FFFFFF', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                padding: '14px 36px', transition: 'background 0.2s',
              }}
            >Contact Our Team</button>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section style={{ padding: '80px 32px', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px 80px', alignItems: 'center' }}>
          <div>
            <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16 }}>Who We Serve</p>
            <div style={{ display: 'flex', gap: 3, color: 'rgba(255,255,255,0.80)', fontSize: 12, marginBottom: 12 }}>
              {['★','★','★','★','★'].map((s,i)=><span key={i}>{s}</span>)}
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 600, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 8,
            }}>Transportation for Every<br />Professional Need</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ height: 1, width: 56, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
              <span style={{ color: '#FFFFFF', fontSize: 10 }}>✦</span>
              <div style={{ height: 1, width: 56, background: 'linear-gradient(to left, transparent, #FFFFFF)' }} />
            </div>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, marginBottom: 32 }}>
              From airport pickups for visiting executives to full conference transportation packages for international summits, Addis Limo serves the full spectrum of professional travel in Addis Ababa.
            </p>
            <div className="gold-line" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            {corporateClients.map(c => (
              <div key={c} style={{
                background: 'var(--surface-2)', padding: '20px 20px',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{ width: 6, height: 6, background: '#FFFFFF', flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'rgba(247,245,240,0.7)', lineHeight: 1.4 }}>{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--surface)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 12 }}>Service Features</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 600, color: '#FFFFFF' }}>
              Premium Corporate Transport
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 }}>
              <div style={{ height: 1, width: 56, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
              <span style={{ color: '#FFFFFF', fontSize: 10 }}>✦</span>
              <div style={{ height: 1, width: 56, background: 'linear-gradient(to left, transparent, #FFFFFF)' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px 48px' }}>
            {corporateFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 20 }}>
                <div style={{ fontSize: 24, color: '#FFFFFF', flexShrink: 0, marginTop: 2 }}>{f.icon}</div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 8 }}>{f.title}</h4>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conference venues */}
      <section style={{ padding: '80px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 12 }}>Conference & Summit Transport</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, color: '#FFFFFF', marginBottom: 8 }}>
          Arrive Ready for Business.
        </h2>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.70)', marginBottom: 36, fontStyle: 'italic' }}>We coordinate transfers to major venues in Addis Ababa.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {corporateVenues.map(v => (
            <div key={v} style={{
              border: '1px solid rgba(255,255,255,0.2)', padding: '12px 22px',
              fontSize: 13, color: 'rgba(255,255,255,0.85)',
            }}>{v}</div>
          ))}
        </div>
      </section>

      {/* Dashboard preview CTA */}
      <section style={{ background: '#0A0A0A', padding: '72px 32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16 }}>Corporate Portal · Coming Soon</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 600, color: '#FFFFFF', marginBottom: 16 }}>
            Manage Your Organization&apos;s Travel
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 36 }}>
            Monthly invoices, employee bookings, trip history and authorized users, all in one corporate dashboard.
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
          >Set Up Corporate Account</button>
        </div>
      </section>

      <style>{`
        @media(max-width:800px){
          section > div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
