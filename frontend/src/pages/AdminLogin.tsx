import { useState } from 'react'
import type { Page } from '@/app/routes'

interface Props { navigate: (p: Page) => void }

export default function AdminLogin({ navigate }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your credentials.'); return }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (email === 'admin@addislimo.com' && password === 'admin123') {
        navigate('admin')
      } else {
        setError('Invalid email or password. Please try again.')
      }
    }, 900)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--ink)',
      display: 'flex', alignItems: 'stretch',
      fontFamily: 'var(--font-body)',
    }}>

      {/* Left panel — brand visual */}
      <div style={{
        flex: '0 0 46%', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '56px 52px',
      }} className="admin-login-left">
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1604560842632-bd795d8f1275?w=1200&h=900&fit=crop&auto=format)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(3,3,3,0.45) 0%, rgba(3,3,3,0.88) 100%)' }} />
        {/* Gold left accent */}
        <div style={{ position: 'absolute', left: 0, top: '8%', height: '84%', width: 3, background: 'linear-gradient(to bottom, transparent, #FFFFFF, transparent)' }} />

        {/* Brand mark */}
        <div style={{ position: 'absolute', top: 48, left: 52, display: 'flex', alignItems: 'center', gap: 14 }}>
          <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22.5" stroke="url(#lnc1)" strokeWidth="1.4"/>
            <circle cx="24" cy="24" r="18" stroke="url(#lnc2)" strokeWidth="0.6" strokeDasharray="2 3"/>
            <text x="24" y="30" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="14" fontWeight="700" fill="url(#lnt1)" letterSpacing="1">AL</text>
            <defs>
              <linearGradient id="lnc1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF"/><stop offset=".5" stopColor="#FFFFFF"/><stop offset="1" stopColor="rgba(255,255,255,0.65)"/>
              </linearGradient>
              <linearGradient id="lnc2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF" stopOpacity=".5"/><stop offset="1" stopColor="rgba(255,255,255,0.65)" stopOpacity=".2"/>
              </linearGradient>
              <linearGradient id="lnt1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFFFFF"/><stop offset=".5" stopColor="#FFFFFF"/><stop offset="1" stopColor="#FFFFFF"/>
              </linearGradient>
            </defs>
          </svg>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#FFFFFF', lineHeight: 1 }}>ADDIS LIMO</p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)', marginTop: 3 }}>Premium Transportation</p>
          </div>
        </div>

        {/* Bottom quote */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', gap: 3, color: '#FFFFFF', fontSize: 11, marginBottom: 18 }}>
            {['★','★','★','★','★'].map((s,i)=><span key={i}>{s}</span>)}
          </div>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.5vw, 32px)',
            fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2, marginBottom: 8,
          }}>Operations Center.</p>
          <p style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 26px)',
            fontWeight: 600, fontStyle: 'italic',
            color: '#FFFFFF', lineHeight: 1.2, marginBottom: 20,
          }}>Addis Limo HQ.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 20 }}>
            <div style={{ height: 1, width: 48, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
            <div style={{ width: 6, height: 6, background: '#FFFFFF', transform: 'rotate(45deg)', margin: '0 8px', flexShrink: 0 }} />
            <div style={{ height: 1, width: 48, background: 'linear-gradient(to left, transparent, #FFFFFF)' }} />
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>
            Manage bookings, partners, commissions<br />and daily operations from one place.
          </p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px', background: '#0A0A0A',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Header */}
          <p className="label-caps" style={{ color: '#FFFFFF', fontSize: 9, letterSpacing: '0.3em', marginBottom: 12 }}>Admin Access</p>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700,
            color: '#FFFFFF', lineHeight: 1.1, marginBottom: 6, letterSpacing: '-0.01em',
          }}>Sign In</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.70)', marginBottom: 48, lineHeight: 1.6 }}>
            Access the Addis Limo operations dashboard.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Email */}
            <div>
              <label style={{
                display: 'block', fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)', marginBottom: 8,
              }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@addislimo.com"
                autoComplete="email"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#111111', border: '1px solid rgba(255,255,255,0.15)',
                  color: '#FFFFFF', fontFamily: 'var(--font-body)', fontSize: 14,
                  padding: '14px 18px', outline: 'none', borderRadius: 2,
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.50)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{
                display: 'block', fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)', marginBottom: 8,
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    background: '#111111', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#FFFFFF', fontFamily: 'var(--font-body)', fontSize: 14,
                    padding: '14px 48px 14px 18px', outline: 'none', borderRadius: 2,
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.50)'}
                  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(255,255,255,0.30)', fontSize: 12, fontFamily: 'var(--font-body)',
                    fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.30)'}
                >{showPass ? 'Hide' : 'Show'}</button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(244,67,54,0.08)', border: '1px solid rgba(244,67,54,0.25)',
                padding: '12px 16px', borderRadius: 2,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f44336', flexShrink: 0 }} />
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5 }}>{error}</p>
              </div>
            )}

            {/* Hint */}
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.02em' }}>
              Demo: admin@addislimo.com / admin123
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'rgba(212,175,90,0.5)' : 'var(--gold-gradient)',
                color: '#060606', border: 'none', cursor: loading ? 'wait' : 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                padding: '16px 0', width: '100%', borderRadius: 2,
                boxShadow: loading ? 'none' : '0 2px 24px rgba(255,255,255,0.18)',
                transition: 'box-shadow 0.2s, transform 0.15s, background 0.2s',
                marginTop: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}
              onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 6px 36px rgba(255,255,255,0.35)'; e.currentTarget.style.transform = 'translateY(-1px)' } }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 24px rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {loading
                ? <><span style={{ width: 14, height: 14, border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#060606', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />Signing In...</>
                : 'Sign In to Dashboard'
              }
            </button>
          </form>

          {/* Back link */}
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => navigate('home')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                color: 'rgba(255,255,255,0.30)', letterSpacing: '0.06em',
                transition: 'color 0.2s', padding: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.70)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.30)'}
            >← Return to Addis Limo</button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @media (max-width: 860px) { .admin-login-left { display: none !important } }
      `}</style>
    </div>
  )
}
