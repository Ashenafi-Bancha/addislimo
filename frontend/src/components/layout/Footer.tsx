import type { Page } from '@/app/routes'
import { contact, site } from '@/config/site'

interface FooterProps { navigate: (p: Page) => void }

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer style={{ background: '#030303', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 72, paddingBottom: 40 }}>
      {/* Gold top accent line */}
      <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #FFFFFF, transparent)', marginBottom: 72, maxWidth: 1340, margin: '0 auto 72px' }} />

      <div style={{ maxWidth: 1340, margin: '0 auto', padding: '0 36px' }}>
        {/* Single grid row: brand col + link cols + contact col */}
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(3, 1fr) 1.5fr', gap: '48px 40px', marginBottom: 64, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 56 }}>

          {/* ── Brand column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <svg width="52" height="52" viewBox="0 0 64 64" fill="none" style={{ marginBottom: 2 }}>
              <circle cx="32" cy="32" r="30" stroke="url(#ftCircle)" strokeWidth="1.2"/>
              <text x="32" y="43" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="26" fontWeight="700" fill="url(#ftLetter)">{site.monogram}</text>
              <defs>
                <linearGradient id="ftCircle" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF"/><stop offset=".5" stopColor="#FFFFFF"/><stop offset="1" stopColor="rgba(255,255,255,0.65)"/>
                </linearGradient>
                <linearGradient id="ftLetter" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF"/><stop offset=".5" stopColor="#FFFFFF"/><stop offset="1" stopColor="#FFFFFF"/>
                </linearGradient>
              </defs>
            </svg>
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              background: 'var(--gold-gradient-h)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Addis Limo</span>
            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
              {site.tagline} · {site.city}
            </span>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 13, color: 'var(--ivory-muted)', lineHeight: 1.6, marginTop: 2 }}>
              {site.slogan}
            </p>
            <div style={{ display: 'flex', gap: 3, color: '#FFFFFF', fontSize: 11, marginTop: 2 }}>
              {['★','★','★','★','★'].map((s,i) => <span key={i}>{s}</span>)}
            </div>
          </div>
          {[
            {
              heading: 'Services',
              links: [
                { label: 'Airport Transfer', page: 'airport' as Page },
                { label: 'City Tour', page: 'explore' as Page },
                { label: 'Summit & Conference', page: 'corporate' as Page },
                { label: 'Expat Transport', page: 'services' as Page },
                { label: 'Point-to-Point & Hourly', page: 'services' as Page },
                { label: 'Diplomatic & Embassy', page: 'services' as Page },
                { label: 'Wedding & Prom', page: 'services' as Page },
              ],
            },
            {
              heading: 'Company',
              links: [
                { label: 'About Addis Limo', page: 'about' as Page },
                { label: 'Partner With Us', page: 'about' as Page },
                { label: 'Careers', page: 'about' as Page },
              ],
            },
            {
              heading: 'Support',
              links: [
                { label: 'Booking Help', page: 'booking' as Page },
                { label: 'FAQ', page: 'about' as Page },
                { label: 'Terms of Service', page: 'about' as Page },
                { label: 'Privacy Policy', page: 'about' as Page },
              ],
            },
          ].map(col => (
            <div key={col.heading}>
              <p className="label-caps" style={{ marginBottom: 20 }}>{col.heading}</p>
              {col.links.map(l => (
                <button key={l.label} onClick={() => navigate(l.page)} style={{
                  display: 'block', background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--ivory-muted)',
                  padding: '5px 0', textAlign: 'left', transition: 'color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--ivory-muted)')}
                >{l.label}</button>
              ))}
            </div>
          ))}

          <div>
            <p className="label-caps" style={{ marginBottom: 20 }}>Contact</p>

            {/* Contact rows with icons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <p style={{ fontSize: 13, color: 'var(--ivory-muted)', lineHeight: 1.55, margin: 0 }}>{contact.address}</p>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <a href={`mailto:${contact.email}`} style={{ fontSize: 13, color: '#FFFFFF', textDecoration: 'none', transition: 'opacity 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >{contact.email}</a>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.19h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <span style={{ fontSize: 13, color: 'var(--ivory-muted)' }}>{contact.phone}</span>
              </div>

              {/* WhatsApp */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(37,211,102,0.10)', border: '1px solid rgba(37,211,102,0.20)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                </div>
                <span style={{ fontSize: 13, color: 'var(--ivory-muted)' }}>WhatsApp (coming soon)</span>
              </div>
            </div>

            {/* Social media */}
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: 12 }}>Follow us on</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>

              {/* Instagram */}
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" title="Instagram" style={{
                width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
                transition: 'transform 0.2s, opacity 0.2s', opacity: 0.85, textDecoration: 'none', flexShrink: 0,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4.5" stroke="white" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
                </svg>
              </a>

              {/* Facebook */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" title="Facebook" style={{
                width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#1877F2', transition: 'transform 0.2s, opacity 0.2s', opacity: 0.85, textDecoration: 'none', flexShrink: 0,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>

              {/* X */}
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" title="X (Twitter)" style={{
                width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#000', border: '1px solid rgba(255,255,255,0.18)',
                transition: 'transform 0.2s, opacity 0.2s', opacity: 0.85, textDecoration: 'none', flexShrink: 0,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" title="LinkedIn" style={{
                width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#0A66C2', transition: 'transform 0.2s, opacity 0.2s', opacity: 0.85, textDecoration: 'none', flexShrink: 0,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </a>

              {/* TikTok */}
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" title="TikTok" style={{
                width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#010101', border: '1px solid rgba(255,255,255,0.12)',
                transition: 'transform 0.2s, opacity 0.2s', opacity: 0.85, textDecoration: 'none', flexShrink: 0,
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" fill="white"/>
                </svg>
              </a>

            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontSize: 11, color: 'var(--ivory-muted)', letterSpacing: '0.04em' }}>
            &copy; {new Date().getFullYear()} {site.name}. All rights reserved. {site.city}, {site.country}.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {[
              { label: 'Privacy Policy' },
              { label: 'Terms of Service' },
              { label: 'Cookie Policy' },
            ].map((item, i) => (
              <span key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {i > 0 && <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 10 }}>·</span>}
                <button style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  fontFamily: 'var(--font-body)', fontSize: 11,
                  color: 'rgba(255,255,255,0.30)', letterSpacing: '0.04em',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.30)'}
                >{item.label}</button>
              </span>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  )
}
