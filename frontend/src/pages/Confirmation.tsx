import type { Page } from '@/app/routes'
interface Props { navigate: (p: Page) => void }

export default function Confirmation({ navigate }: Props) {
  const bookingId = 'AL-' + Math.random().toString(36).substring(2, 8).toUpperCase()

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 72, display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '80px 32px', textAlign: 'center', width: '100%' }}>
        {/* Gold checkmark */}
        <div style={{
          width: 80, height: 80,
          border: '2px solid #FFFFFF',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 36px',
          fontSize: 32, color: '#FFFFFF',
        }}>✓</div>

        <div style={{ display: 'flex', gap: 3, color: 'rgba(255,255,255,0.80)', fontSize: 14, marginBottom: 16, justifyContent: 'center' }}>
          {['★','★','★','★','★'].map((s,i)=><span key={i}>{s}</span>)}
        </div>
        <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16 }}>Booking Submitted</p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(32px, 5vw, 52px)',
          fontWeight: 700, lineHeight: 1.1, marginBottom: 8,
          background: 'var(--gold-gradient-h)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>Your Journey Is<br /><em>Confirmed.</em></h1>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ height: 1, width: 56, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
          <span style={{ color: '#FFFFFF', fontSize: 10 }}>✦</span>
          <div style={{ height: 1, width: 56, background: 'linear-gradient(to left, transparent, #FFFFFF)' }} />
        </div>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 48 }}>
          Thank you for choosing Addis Limo. Your booking request has been received and our team will confirm your chauffeur and vehicle shortly.
        </p>

        {/* Booking details */}
        <div style={{
          background: 'var(--surface-2)',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '36px 40px', marginBottom: 40, textAlign: 'left',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
          <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 20, fontSize: 9 }}>Booking Reference</p>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32, fontWeight: 700, color: '#FFFFFF',
            letterSpacing: '0.1em', marginBottom: 28,
          }}>{bookingId}</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px', fontSize: 14 }}>
            {[
              ['Status', 'Pending Confirmation'],
              ['Driver Status', 'Being Assigned'],
              ['Expected Response', 'Within 2 hours'],
              ['Contact Method', 'Email / WhatsApp'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="label-caps" style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 4, fontSize: 9 }}>{k}</p>
                <p style={{ color: '#FFFFFF', fontWeight: 500 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
          padding: '16px 28px', marginBottom: 48,
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#FFFFFF',
            animation: 'pulse 2s infinite',
          }} />
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
            Our team is reviewing your booking and will contact you shortly.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('home')}
            style={{
              background: 'var(--gold-gradient)', color: '#060606',
              border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '14px 32px', borderRadius: '50px',
              boxShadow: '0 2px 24px rgba(255,255,255,0.10)',
              transition: 'box-shadow 0.2s, transform 0.15s',
            }}
          >Return Home</button>
          <button
            style={{
              background: 'transparent', color: '#FFFFFF',
              border: '1px solid #FFFFFF', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '14px 32px', transition: 'background 0.2s',
            }}
          >Contact Addis Limo</button>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(0.8); }
          }
        `}</style>
      </div>
    </div>
  )
}
