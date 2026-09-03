import type { CSSProperties } from 'react'
import type { Page } from '@/app/routes'
import { useMediaQuery } from '@/hooks'

interface HomeHeroProps {
  navigate: (page: Page) => void
}

/**
 * The home page hero, in two structurally different layouts.
 *
 * Desktop keeps the full-bleed photograph with the headline set over it.
 * Phones get a stacked layout instead — the photograph on top, the text
 * beneath — because text over a darkened image is hard to read on a small
 * screen, and because cropping a landscape photo into a portrait viewport
 * throws most of the picture away.
 *
 * The two differ in structure, not just in styling, so they branch in JS
 * rather than in CSS. Only one is ever in the DOM, so the browser downloads
 * one image.
 */

/** 16:9 source. The mobile frame matches that ratio so nothing is cropped. */
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1771350368994-9d87f0d8431f?w=1600&h=900&fit=crop&auto=format'
const HERO_IMAGE_WIDE =
  'https://images.unsplash.com/photo-1771350368994-9d87f0d8431f?w=1920&h=1080&fit=crop&auto=format'

const scrollCueKeyframes = `
  @keyframes scrollLine { 0%{opacity:1;transform:scaleY(1) translateY(0)} 100%{opacity:0;transform:scaleY(0.5) translateY(12px)} }
`

export default function HomeHero({ navigate }: HomeHeroProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')

  const headline = (
    <>
      <h1 style={{ margin: '0 0 4px', lineHeight: 0.92 }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(38px, 5.6vw, 76px)',
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 0.95,
            textShadow: '0 2px 40px rgba(0,0,0,0.5)',
          }}
        >
          Experience<br />the Capital City<br />of Africa
        </span>
      </h1>
      <h1 style={{ margin: '0 0 clamp(20px, 3vh, 36px)', lineHeight: 1 }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(27px, 3.9vw, 53px)',
            fontWeight: 600,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.82)',
            letterSpacing: '-0.01em',
            textShadow: '0 2px 30px rgba(0,0,0,0.4)',
          }}
        >
          in Class.
        </span>
      </h1>
    </>
  )

  const divider = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        marginBottom: 'clamp(16px, 2.5vh, 28px)',
      }}
    >
      <div style={{ height: 1.5, width: 56, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
      <div style={{ width: 7, height: 7, background: '#FFFFFF', transform: 'rotate(45deg)', margin: '0 10px', flexShrink: 0 }} />
      <div style={{ height: 1.5, width: 56, background: 'linear-gradient(to left, transparent, #FFFFFF)' }} />
    </div>
  )

  const body = (
    <p
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 16,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.72)',
        lineHeight: 1.75,
        marginBottom: 'clamp(24px, 4vh, 48px)',
        maxWidth: 540,
      }}
    >
      Premium chauffeur and transportation services in Addis Ababa, designed for travelers,
      executives, businesses, events and unforgettable journeys.
    </p>
  )

  /* On phones every button spans the column; on desktop they sit in a row. */
  const ctaBase: CSSProperties = {
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    borderRadius: isMobile ? 10 : 2,
    width: isMobile ? '100%' : 'auto',
    padding: isMobile ? '17px 24px' : '15px 40px',
    fontSize: isMobile ? 12 : 11,
  }

  const ctas = (
    <div
      style={{
        display: 'flex',
        gap: isMobile ? 12 : 16,
        flexWrap: 'wrap',
        alignItems: 'stretch',
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      <button
        onClick={() => navigate('booking')}
        style={{
          ...ctaBase,
          background: 'var(--gold-gradient)',
          color: '#060606',
          border: 'none',
          fontWeight: 800,
          padding: isMobile ? '18px 24px' : '16px 40px',
          boxShadow: '0 2px 24px rgba(255,255,255,0.10)',
          transition: 'box-shadow 0.2s, transform 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 40px rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 24px rgba(255,255,255,0.10)'; e.currentTarget.style.transform = 'translateY(0)' }}
      >
        Book Your Ride
      </button>
      <button
        onClick={() => navigate('explore')}
        style={{
          ...ctaBase,
          background: 'transparent',
          color: '#FFFFFF',
          border: '1.5px solid #FFFFFF',
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
      >
        Explore Addis
      </button>
      <button
        onClick={() => navigate('booking')}
        style={{
          ...ctaBase,
          background: 'transparent',
          color: 'rgba(255,255,255,0.88)',
          border: '1.5px solid rgba(255,255,255,0.42)',
          transition: 'background 0.2s, border-color 0.2s, color 0.2s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFFFFF'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.42)'; e.currentTarget.style.color = 'rgba(255,255,255,0.88)'; e.currentTarget.style.background = 'transparent' }}
      >
        Get Quote
      </button>
    </div>
  )

  const scrollCue = (
    <div
      style={{
        position: 'absolute',
        bottom: 32,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        color: 'rgba(255,255,255,0.7)',
      }}
    >
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase' }}>
        Scroll
      </span>
      <div style={{ width: 1.5, height: 36, background: 'linear-gradient(to bottom, #FFFFFF, transparent)', animation: 'scrollLine 1.8s ease infinite' }} />
    </div>
  )

  /* ── Phone: photograph on top, text beneath ── */
  if (isMobile) {
    return (
      <section className="hero-full" style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        {/* The frame matches the source's 16:9 ratio, so `cover` crops nothing
            and the whole photograph is on screen. */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', marginTop: 72, flexShrink: 0 }}>
          <img
            src={HERO_IMAGE}
            alt="The Addis Ababa skyline"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Long gradient so the photograph dissolves into the page rather
              than ending on a hard edge. */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(6,6,6,0.35) 0%, rgba(6,6,6,0.10) 30%, rgba(6,6,6,0.55) 72%, rgba(6,6,6,0.92) 90%, #060606 100%)',
            }}
          />
        </div>

        {/* Text sits on flat black, so it is at full contrast. */}
        <div style={{ position: 'relative', padding: '4px 20px 118px', marginTop: -28 }}>
          {headline}
          {divider}
          {body}
          {ctas}
        </div>

        {scrollCue}
        <style>{scrollCueKeyframes}</style>
      </section>
    )
  }

  /* ── Desktop: full-bleed photograph with the headline over it ── */
  return (
    <section className="hero-full" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${HERO_IMAGE_WIDE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
        }}
      />
      {/* Left-heavy overlay so text stays readable while the right reveals the city. */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(3,3,3,0.52)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(3,3,3,0.72) 0%, rgba(3,3,3,0.38) 55%, rgba(3,3,3,0.10) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, #030303 0%, transparent 100%)' }} />

      <div
        className="gutter"
        style={{
          position: 'relative',
          maxWidth: 1380,
          margin: '0 auto',
          padding: '0 48px',
          paddingTop: 'clamp(88px, 12vh, 140px)',
          paddingBottom: 'clamp(88px, 12vh, 140px)',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: 720 }}>
          {headline}
          {divider}
          {body}
          {ctas}
        </div>
      </div>

      {scrollCue}
      <style>{scrollCueKeyframes}</style>
    </section>
  )
}
