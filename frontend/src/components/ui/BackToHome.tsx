import { useState } from 'react'
import type { Page } from '@/app/routes'

interface BackToHomeProps {
  navigate: (page: Page) => void
}

/**
 * "Back to Home" control shown on every page except the home page itself.
 *
 * Positioned absolutely at the top of `<main>` rather than fixed, so it sits
 * over each page's hero and then scrolls away instead of following the reader
 * down the page. `SiteLayout` decides when to render it.
 */
export default function BackToHome({ navigate }: BackToHomeProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      className="back-to-home"
      onClick={() => navigate('home')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Back to home page"
      style={{
        position: 'absolute',
        top: 92,
        left: 48,
        zIndex: 60,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 9,
        cursor: 'pointer',
        borderRadius: 50,
        padding: '9px 18px 9px 14px',
        fontFamily: 'var(--font-body)',
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: hovered ? '#FFFFFF' : 'rgba(255,255,255,0.82)',
        background: hovered ? 'rgba(18,18,18,0.92)' : 'rgba(10,10,10,0.72)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.32)' : 'rgba(255,255,255,0.14)'}`,
        boxShadow: hovered
          ? 'inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 26px rgba(0,0,0,0.6)'
          : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 18px rgba(0,0,0,0.45)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        transition: 'color 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontSize: 14,
          lineHeight: 1,
          // Slides left on hover, the mirror of the "→" on the quick links.
          transform: hovered ? 'translateX(-3px)' : 'translateX(0)',
          transition: 'transform 0.2s',
        }}
      >
        ←
      </span>
      Back to Home
    </button>
  )
}
