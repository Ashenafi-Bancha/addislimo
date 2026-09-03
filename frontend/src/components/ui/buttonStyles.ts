/**
 * Inline style objects for the three pill buttons used across the site.
 *
 * The pages are styled with inline `style` objects rather than Tailwind
 * classes, so shared button treatments live here as plain objects. Spread
 * them into a `style` prop: `style={{ ...pillGold, padding: '18px 40px' }}`.
 */

export const pillGold = {
  background: 'var(--gold-gradient)',
  color: '#060606',
  border: 'none', cursor: 'pointer',
  fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 800,
  letterSpacing: '0.18em', textTransform: 'uppercase' as const,
  padding: '14px 32px', borderRadius: '50px',
  boxShadow: '0 2px 24px rgba(255,255,255,0.10)',
  transition: 'box-shadow 0.2s, transform 0.15s',
}

export const pillGhost = {
  background: 'transparent',
  color: '#FFFFFF',
  border: '1.5px solid rgba(255,255,255,0.7)',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
  letterSpacing: '0.16em', textTransform: 'uppercase' as const,
  padding: '14px 32px', borderRadius: '50px',
  transition: 'background 0.2s, color 0.2s, border-color 0.2s',
}

export const pillOutline = {
  background: 'transparent',
  color: '#FFFFFF',
  border: '1.5px solid #FFFFFF',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700,
  letterSpacing: '0.14em', textTransform: 'uppercase' as const,
  padding: '12px 28px', borderRadius: '50px',
  transition: 'background 0.2s, color 0.2s',
}
