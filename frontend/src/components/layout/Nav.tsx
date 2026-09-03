import { useState } from 'react'
import type { Page } from '@/app/routes'
import { mainNav as links, primaryCta, site } from '@/config/site'
import { useScrolled } from '@/hooks'

interface NavProps { current: Page; navigate: (p: Page) => void }

export default function Nav({ current, navigate }: NavProps) {
  const scrolled = useScrolled(40)
  const [open, setOpen] = useState(false)

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(4,4,4,0.98)' : 'rgba(4,4,4,0.75)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255,255,255,0.18)',
      transition: 'background 0.3s',
    }}>
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

          {/* Logo */}
          <button onClick={() => navigate('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Circular emblem */}
            <div style={{ position: 'relative', width: 48, height: 48, flexShrink: 0 }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="22.5" stroke="url(#nc1)" strokeWidth="1.4"/>
                <circle cx="24" cy="24" r="18" stroke="url(#nc2)" strokeWidth="0.6" strokeDasharray="2 3"/>
                <text x="24" y="30" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="14" fontWeight="700" fill="url(#nt1)" letterSpacing="1">{site.monogram}</text>
                <defs>
                  <linearGradient id="nc1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFFFF"/><stop offset=".5" stopColor="rgba(200,200,200,0.9)"/><stop offset="1" stopColor="rgba(180,180,180,0.7)"/>
                  </linearGradient>
                  <linearGradient id="nc2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="rgba(200,200,200,0.9)" stopOpacity=".6"/><stop offset="1" stopColor="rgba(180,180,180,0.7)" stopOpacity=".3"/>
                  </linearGradient>
                  <linearGradient id="nt1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFFFFF"/><stop offset=".5" stopColor="rgba(200,200,200,0.9)"/><stop offset="1" stopColor="#FFFFFF"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span className="nav-brand-name" style={{
                fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700,
                letterSpacing: '0.18em', textTransform: 'uppercase', whiteSpace: 'nowrap',
                background: 'var(--gold-gradient-h)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                lineHeight: 1,
              }}>{site.name.toUpperCase()}</span>
              <span className="nav-brand-tagline" style={{ fontFamily: 'var(--font-body)', fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.78)' }}>
                {site.tagline}
              </span>
            </div>
          </button>

          {/* Desktop nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="hide-mobile">
            {links.map(l => (
              <button key={l.page} onClick={() => navigate(l.page)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 11.5, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: current === l.page ? '#FFFFFF' : '#FFFFFF',
                opacity: current === l.page ? 1 : 0.82,
                transition: 'color 0.2s, opacity 0.2s', padding: 0,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; (e.currentTarget as HTMLElement).style.opacity = '1' }}
                onMouseLeave={e => { if (current !== l.page) { (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; (e.currentTarget as HTMLElement).style.opacity = '0.82' } }}
              >{l.label}</button>
            ))}
          </nav>

          {/* Right: phone + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hide-mobile">
            <button
              onClick={() => navigate(primaryCta.page)}
              style={{
                background: 'var(--gold-gradient)',
                color: '#060606',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800,
                letterSpacing: '0.16em', textTransform: 'uppercase',
                padding: '10px 24px',
                borderRadius: '50px',
                boxShadow: '0 2px 20px rgba(255,255,255,0.12)',
                transition: 'box-shadow 0.2s, transform 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 32px rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 20px rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {primaryCta.label}
            </button>
          </div>

          {/* Mobile: a compact booking CTA sits beside the hamburger, so the
              primary action is reachable without opening the menu. */}
          <div className="show-mobile nav-mobile-actions" style={{ display: 'none', alignItems: 'center', gap: 14 }}>
            <button
              onClick={() => navigate(primaryCta.page)}
              style={{
                background: 'var(--gold-gradient)',
                color: '#060606',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 800,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                padding: '10px 18px',
                borderRadius: 50,
                boxShadow: '0 2px 16px rgba(255,255,255,0.14)',
                whiteSpace: 'nowrap',
              }}
            >{primaryCta.label}</button>

            <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 }} aria-label="Menu" aria-expanded={open}>
              {[0,1,2].map(i => <span key={i} style={{ display: 'block', width: 22, height: 2, background: '#FFFFFF' }} />)}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: 'rgba(4,4,4,0.99)', borderTop: '1px solid rgba(255,255,255,0.2)', padding: '20px 32px 28px' }}>
          {links.map(l => (
            <button key={l.page} onClick={() => { navigate(l.page); setOpen(false) }} style={{
              display: 'block', width: '100%', textAlign: 'left',
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600,
              color: current === l.page ? '#FFFFFF' : '#FFFFFF',
              padding: '12px 0', letterSpacing: '0.08em', textTransform: 'uppercase',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}>{l.label}</button>
          ))}
          <button onClick={() => { navigate(primaryCta.page); setOpen(false) }} style={{
            marginTop: 18, width: '100%', borderRadius: '50px',
            background: 'var(--gold-gradient)', color: '#060606',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 800,
            letterSpacing: '0.16em', textTransform: 'uppercase', padding: '14px 0',
          }}>{primaryCta.label}</button>
        </div>
      )}

      <style>{`
        @media(max-width:980px){.hide-mobile{display:none!important}.show-mobile{display:flex!important}}
        @media(min-width:981px){.show-mobile{display:none!important}}
      `}</style>
    </header>
  )
}
