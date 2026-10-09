import type { CSSProperties } from 'react'
import type { Page } from '@/app/routes'
import { useContent } from '@/features/cms'
import { useMediaQuery, useParallax } from '@/hooks'

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
 *
 * The photograph is edited in the admin's Website Content section.
 */

const scrollCueKeyframes = `
  @keyframes scrollLine { 0%{opacity:1;transform:scaleY(1) translateY(0)} 100%{opacity:0;transform:scaleY(0.5) translateY(12px)} }
`

export default function HomeHero({ navigate }: HomeHeroProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const hero = useContent('home_hero')
  // The photograph drifts slower than the page, which gives the hero depth.
  const photoRef = useParallax<HTMLDivElement>(0.12, 70)
  const headlineLines = hero.headline.split('\n').filter((line) => line.trim())

  const headline = (
    <div className="hero-stage">
      <h1 className="hero-step" style={{ margin: '0 0 4px', lineHeight: 0.92, ['--hero-step' as string]: '1' }}>
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
          {headlineLines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </span>
      </h1>
      <h1 className="hero-step" style={{ margin: '0 0 clamp(20px, 3vh, 36px)', lineHeight: 1, ['--hero-step' as string]: '2' }}>
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
          {hero.headlineAccent}
        </span>
      </h1>
    </div>
  )

  const divider = (
    <div
      className="hero-step"
      style={{
        ['--hero-step' as string]: '3',
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
      className="hero-step"
      style={{
        ['--hero-step' as string]: '4',
        fontFamily: 'var(--font-body)',
        fontSize: 16,
        fontWeight: 400,
        color: 'rgba(255,255,255,0.72)',
        lineHeight: 1.75,
        marginBottom: 'clamp(24px, 4vh, 48px)',
        maxWidth: 540,
      }}
    >
      {hero.intro}
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
      className="hero-step"
      style={{
        ['--hero-step' as string]: '5',
        display: 'flex',
        gap: isMobile ? 12 : 16,
        flexWrap: 'wrap',
        alignItems: 'stretch',
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      <button
        onClick={() => navigate('booking')}
        className="shine shine-dark press"
        style={{
          ...ctaBase,
          background: 'var(--gold-gradient)',
          color: '#0C0B09',
          border: 'none',
          fontWeight: 800,
          padding: isMobile ? '18px 24px' : '16px 40px',
          boxShadow: '0 2px 24px rgba(255,255,255,0.10)',
        }}
      >
        Book Your Ride
      </button>
      <button
        onClick={() => navigate('explore')}
        className="shine press"
        style={{
          ...ctaBase,
          background: 'transparent',
          color: '#FFFFFF',
          border: '1.5px solid #FFFFFF',
        }}
      >
        Explore Addis
      </button>
      {/* Three stacked full-width buttons crowd a phone, and "Get Quote" goes
          to the same place as "Book Your Ride", so it is desktop only. */}
      {!isMobile && (
        <button
          onClick={() => navigate('booking')}
          className="shine press"
          style={{
            ...ctaBase,
            background: 'transparent',
            color: 'rgba(255,255,255,0.88)',
            border: '1.5px solid rgba(255,255,255,0.42)',
          }}
        >
          Get Quote
        </button>
      )}
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
      <section className="hero-full grain" style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>
        {/* The frame matches the source's 16:9 ratio, so `cover` crops nothing
            and the whole photograph is on screen. */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', marginTop: 72, flexShrink: 0 }}>
          <img
            src={hero.image}
            alt="The Addis Ababa skyline"
            fetchPriority="high"
            className="kenburns"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Long gradient so the photograph dissolves into the page rather
              than ending on a hard edge. */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(12,11,9,0.12) 0%, rgba(12,11,9,0.04) 32%, rgba(12,11,9,0.5) 72%, rgba(12,11,9,0.9) 90%, #0C0B09 100%)',
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
    <section className="hero-full grain" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      <div ref={photoRef} style={{ position: 'absolute', inset: '-90px 0' }}>
        <div
          className="kenburns"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${hero.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />
      </div>
      {/* The photograph is already a night scene, so it needs far less
          darkening than a daylight one: enough to hold the headline on the
          left, almost nothing on the right where the skyline reads. */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,8,7,0.18)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(9,8,7,0.82) 0%, rgba(9,8,7,0.45) 48%, rgba(9,8,7,0.05) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, #090807 0%, transparent 100%)' }} />

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
