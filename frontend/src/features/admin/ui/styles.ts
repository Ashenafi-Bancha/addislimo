import type { CSSProperties } from 'react'

/**
 * Shared style objects for the admin console.
 *
 * Same brand as the public site — black, silver, Playfair for titles, Manrope
 * for everything else — but quieter. A tool is looked at for hours, so panels
 * sit still (no hover lift), headings lose the gradient sheen, and numbers are
 * set in the sans with tabular figures where they line up in columns.
 */

export const panel: CSSProperties = {
  background: 'var(--admin-panel)',
  border: '1px solid var(--admin-hairline)',
  borderRadius: 12,
  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 12px 30px rgba(0,0,0,0.45)',
}

export const panelHeader: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '16px 20px',
  borderBottom: '1px solid var(--admin-hairline)',
}

export const panelTitle: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 14,
  fontWeight: 700,
  color: '#FFFFFF',
  margin: 0,
  letterSpacing: '0.01em',
}

export const panelSubtitle: CSSProperties = {
  fontFamily: 'var(--font-body)',
  fontSize: 12,
  color: 'var(--admin-text-muted)',
  margin: '2px 0 0',
}

export const tabular: CSSProperties = { fontVariantNumeric: 'tabular-nums' }

/* ── Buttons ── */

const buttonBase: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  height: 38,
  padding: '0 16px',
  borderRadius: 8,
  fontFamily: 'var(--font-body)',
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.01em',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background 0.15s, border-color 0.15s, color 0.15s, box-shadow 0.15s',
}

export const buttonPrimary: CSSProperties = {
  ...buttonBase,
  background: 'var(--gold-gradient)',
  color: '#060606',
  border: '1px solid transparent',
  fontWeight: 700,
  boxShadow: '0 1px 12px rgba(255,255,255,0.10)',
}

export const buttonSecondary: CSSProperties = {
  ...buttonBase,
  background: 'var(--admin-raised)',
  color: '#FFFFFF',
  border: '1px solid var(--admin-hairline-strong)',
}

export const buttonGhost: CSSProperties = {
  ...buttonBase,
  background: 'transparent',
  color: 'rgba(255,255,255,0.78)',
  border: '1px solid transparent',
}

export const buttonDanger: CSSProperties = {
  ...buttonBase,
  background: 'transparent',
  color: '#FFFFFF',
  border: '1px solid rgba(208,59,59,0.55)',
}

export const iconButton: CSSProperties = {
  ...buttonBase,
  width: 38,
  padding: 0,
  background: 'transparent',
  color: 'rgba(255,255,255,0.78)',
  border: '1px solid var(--admin-hairline)',
}

/* ── Form controls ── */

export const fieldLabel: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--admin-text-muted)',
  marginBottom: 6,
}

export const input: CSSProperties = {
  width: '100%',
  height: 40,
  padding: '0 12px',
  borderRadius: 8,
  background: '#0B0B0B',
  border: '1px solid var(--admin-hairline-strong)',
  color: '#FFFFFF',
  fontFamily: 'var(--font-body)',
  fontSize: 13.5,
  outline: 'none',
  colorScheme: 'dark',
}

export const select: CSSProperties = {
  ...input,
  appearance: 'none',
  paddingRight: 34,
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-opacity='0.6' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  cursor: 'pointer',
}

/* ── Tables ── */

export const th: CSSProperties = {
  padding: '10px 16px',
  textAlign: 'left',
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--admin-text-faint)',
  whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--admin-hairline)',
  background: 'rgba(255,255,255,0.015)',
}

export const td: CSSProperties = {
  padding: '14px 16px',
  fontFamily: 'var(--font-body)',
  fontSize: 13.5,
  color: 'rgba(255,255,255,0.86)',
  borderBottom: '1px solid rgba(255,255,255,0.05)',
  verticalAlign: 'middle',
}

export const cellPrimary: CSSProperties = { color: '#FFFFFF', fontWeight: 600 }

export const cellSecondary: CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: 'var(--admin-text-muted)',
  marginTop: 2,
}

/** Keyboard focus ring for anything interactive that isn't a native control. */
export const focusRing = '0 0 0 2px #070707, 0 0 0 4px rgba(255,255,255,0.7)'
