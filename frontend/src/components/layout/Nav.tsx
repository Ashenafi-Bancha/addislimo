import { useState } from 'react'
import type { Page } from '@/app/routes'
import brandLogo from '@/assets/images/addis-limo-logo.webp'
import { mainNav as links, primaryCta, site } from '@/config/site'
import { useScrolled } from '@/hooks'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { t } from '@/features/i18n'

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
      <div className="nav-bar" style={{ maxWidth: 1380, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: scrolled ? 64 : 76, transition: 'height 0.3s cubic-bezier(0.22, 1, 0.36, 1)' }}>

          {/* Logo. The artwork carries the name and the tagline, so the header
              sets it alone: a second "Addis Limo" in type beside it would read
              as the name twice. It shrinks with the bar on scroll. */}
          <button onClick={() => navigate('home')} aria-label={`${site.name} — ${t('home')}`} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0, flexShrink: 0 }}>
            <img
              src={brandLogo}
              alt={site.name}
              className="nav-logo"
              width={427}
              height={96}
              style={{
                height: scrolled ? 36 : 44,
                width: 'auto',
                display: 'block',
                flexShrink: 0,
                transition: 'height 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            />
          </button>

          {/* Desktop nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 22 }} className="hide-mobile">
            {links.map(l => (
              <button key={l.page} onClick={() => navigate(l.page)} className="nav-link" data-active={current === l.page} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: current === l.page ? '#FFFFFF' : '#FFFFFF',
                opacity: current === l.page ? 1 : 0.82,
                transition: 'color 0.2s, opacity 0.2s', padding: 0,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; (e.currentTarget as HTMLElement).style.opacity = '1' }}
                onMouseLeave={e => { if (current !== l.page) { (e.currentTarget as HTMLElement).style.color = '#FFFFFF'; (e.currentTarget as HTMLElement).style.opacity = '0.82' } }}
              >{t(l.label)}</button>
            ))}
          </nav>

          {/* Right: language + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hide-mobile">
            <LanguageSwitcher compact />
            <button
              onClick={() => navigate(primaryCta.page)}
              style={{
                background: 'var(--gold-gradient)',
                color: '#0C0B09',
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
              {t(primaryCta.label)}
            </button>
          </div>

          {/* Mobile: a compact booking CTA sits beside the hamburger, so the
              primary action is reachable without opening the menu. */}
          <div className="show-mobile nav-mobile-actions" style={{ display: 'none', alignItems: 'center', gap: 14 }}>
            <LanguageSwitcher compact />
            <button
              className="nav-mobile-cta"
              onClick={() => navigate(primaryCta.page)}
              style={{
                background: 'var(--gold-gradient)',
                color: '#0C0B09',
                border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 800,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                padding: '10px 18px',
                borderRadius: 50,
                boxShadow: '0 2px 16px rgba(255,255,255,0.14)',
                whiteSpace: 'nowrap',
              }}
            >{t(primaryCta.label)}</button>

            <button onClick={() => setOpen(!open)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 }} aria-label={t('Menu')} aria-expanded={open}>
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
            }}>{t(l.label)}</button>
          ))}
          <button onClick={() => { navigate(primaryCta.page); setOpen(false) }} style={{
            marginTop: 18, width: '100%', borderRadius: '50px',
            background: 'var(--gold-gradient)', color: '#0C0B09',
            border: 'none', cursor: 'pointer',
            fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 800,
            letterSpacing: '0.16em', textTransform: 'uppercase', padding: '14px 0',
          }}>{t(primaryCta.label)}</button>
        </div>
      )}

      <style>{`
        @media(max-width:1240px){.hide-mobile{display:none!important}.show-mobile{display:flex!important}}
        @media(min-width:1241px){.show-mobile{display:none!important}}
      `}</style>
    </header>
  )
}
