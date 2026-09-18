import { useEffect, useState, type FormEvent } from 'react'
import type { Page } from '@/app/routes'
import BrandMark from '@/components/ui/BrandMark'
import { site } from '@/config/site'
import { getSession, signIn } from '@/features/admin/session'
import Icon, { type IconName } from '@/features/admin/ui/Icon'
import { buttonPrimary, fieldLabel, input } from '@/features/admin/ui/styles'
import { useMediaQuery } from '@/hooks'

interface Props {
  navigate: (p: Page) => void
}

const capabilities: { icon: IconName; text: string }[] = [
  { icon: 'bookings', text: 'Confirm and dispatch every booking' },
  { icon: 'fleet', text: 'Manage partners, drivers and vehicles' },
  { icon: 'finance', text: 'Track commission and partner payouts' },
]

export default function AdminLogin({ navigate }: Props) {
  const compact = useMediaQuery('(max-width: 900px)')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Already signed in this session: skip straight to the console.
  useEffect(() => {
    if (getSession()) navigate('admin')
  }, [navigate])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Enter your email address and password.')
      return
    }
    setLoading(true)
    // A short pause so the button state is visible; the real check will be a
    // network call to POST /auth/login.
    window.setTimeout(() => {
      const session = signIn(email, password)
      setLoading(false)
      if (session) navigate('admin')
      else setError('That email and password do not match an admin account.')
    }, 600)
  }

  return (
    <div className="admin-console" style={{ minHeight: '100vh', display: 'flex', background: 'var(--admin-page)', color: '#FFFFFF' }}>
      {/* Brand panel */}
      {!compact && (
        <aside
          style={{
            flex: '0 0 46%',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '44px 52px',
            borderRight: '1px solid var(--admin-hairline)',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(https://images.unsplash.com/photo-1771350368994-9d87f0d8431f?w=1400&h=1000&fit=crop&auto=format)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(165deg, rgba(5,5,5,0.55) 0%, rgba(5,5,5,0.82) 55%, rgba(5,5,5,0.96) 100%)' }} />

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 13 }}>
            <BrandMark size={42} />
            <div>
              <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1 }}>{site.name}</p>
              <p style={{ margin: '5px 0 0', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Operations</p>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 2.8vw, 40px)', fontWeight: 700, lineHeight: 1.1 }}>
              Every trip,
              <br />
              <span style={{ fontStyle: 'italic', fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>in one place.</span>
            </p>
            <ul style={{ listStyle: 'none', margin: '28px 0 0', padding: 0, display: 'grid', gap: 14 }}>
              {capabilities.map((c) => (
                <li key={c.text} style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--font-body)', fontSize: 14, color: 'rgba(255,255,255,0.85)' }}>
                  <span style={{ width: 34, height: 34, borderRadius: 9, display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.14)' }}>
                    <Icon name={c.icon} size={16} />
                  </span>
                  {c.text}
                </li>
              ))}
            </ul>
          </div>

          <p style={{ position: 'relative', margin: 0, fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
            &copy; {new Date().getFullYear()} {site.name} · Authorised staff only
          </p>
        </aside>
      )}

      {/* Form. A div, not <main>: SiteLayout already provides the page landmark. */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: compact ? '32px 20px' : '48px 40px' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          {compact && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 36, textAlign: 'center' }}>
              <BrandMark size={44} />
              <div>
                <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', lineHeight: 1 }}>{site.name}</p>
                <p style={{ margin: '5px 0 0', fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--admin-text-muted)' }}>Operations</p>
              </div>
            </div>
          )}

          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, lineHeight: 1.1, textAlign: 'center' }}>Sign in</h1>
          <p style={{ margin: '8px 0 32px', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--admin-text-muted)', textAlign: 'center' }}>
            Use your Addis Limo Admin account.
          </p>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: 18 }}>
            <div>
              <label htmlFor="admin-email" style={fieldLabel}>Email address</label>
              <div style={{ position: 'relative' }}>
                <span style={fieldIcon}><Icon name="mail" size={16} /></span>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  placeholder="you@addislimo.com"
                  aria-invalid={Boolean(error)}
                  className="admin-input"
                  style={{ ...input, height: 46, paddingLeft: 40, fontSize: 14.5 }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" style={fieldLabel}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={fieldIcon}><Icon name="lock" size={16} /></span>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Your password"
                  aria-invalid={Boolean(error)}
                  className="admin-input"
                  style={{ ...input, height: 46, paddingLeft: 40, paddingRight: 46, fontSize: 14.5 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 34, height: 34, display: 'grid', placeItems: 'center', background: 'transparent', border: 'none', borderRadius: 7, color: 'var(--admin-text-muted)', cursor: 'pointer' }}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={17} />
                </button>
              </div>
            </div>

            <div aria-live="assertive">
              {error && (
                <p
                  role="alert"
                  style={{
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '11px 13px',
                    borderRadius: 9,
                    background: 'rgba(208,59,59,0.10)',
                    border: '1px solid rgba(208,59,59,0.4)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 13,
                    color: '#FFFFFF',
                  }}
                >
                  <Icon name="alert" size={16} style={{ color: 'var(--status-critical)' }} />
                  {error}
                </p>
              )}
            </div>

            <button type="submit" disabled={loading} className="admin-btn" style={{ ...buttonPrimary, height: 48, fontSize: 14.5 }}>
              {loading ? (
                <>
                  <span aria-hidden="true" style={{ width: 16, height: 16, border: '2px solid rgba(0,0,0,0.25)', borderTopColor: '#060606', borderRadius: '50%', animation: 'adminSpin 0.7s linear infinite' }} />
                  Signing in
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <button
            onClick={() => navigate('home')}
            style={{ marginTop: 30, display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', padding: 0, fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: 'var(--admin-text-muted)', cursor: 'pointer' }}
          >
            <Icon name="arrowLeft" size={15} />
            Return to website
          </button>
        </div>
      </div>

      <style>{`@keyframes adminSpin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

const fieldIcon = {
  position: 'absolute' as const,
  left: 13,
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--admin-text-faint)',
  pointerEvents: 'none' as const,
}
