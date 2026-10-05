import CountUp from '@/components/ui/CountUp'
import Reveal from '@/components/ui/Reveal'
import { cardTopRule, raisedCard } from '@/components/ui/cardStyles'
import type { Differentiator } from '@/data/services'
import { useContent } from '@/features/cms'
import { useTilt } from '@/hooks'

/**
 * "Why Addis Limo" — the trust section, directly beneath the partner row.
 *
 * Three layers, smallest to largest: a compact heading, a slim row of
 * headline figures that count up as they arrive, then the six reasons as
 * cards that tip towards the pointer. The card treatment itself lives in
 * `components/ui/cardStyles.ts`, shared with the service grid on the home
 * page.
 */
export default function TrustStrip() {
  const trustBadges = useContent('trust_badges')
  const differentiators = useContent('why_addis_limo')
  const { whyEyebrow } = useContent('home_sections')

  return (
    <section
      className="section-tall"
      style={{
        background: '#0A0A0A',
        padding: '84px 48px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div style={{ maxWidth: 1380, margin: '0 auto' }}>
        {/* Heading — kept deliberately small so the cards carry the section. */}
        <Reveal style={{ textAlign: 'center', marginBottom: 34 }}>
          <p className="label-caps" style={{ marginBottom: 12 }}>{whyEyebrow}</p>
          <h2
            className="trust-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(21px, 2.4vw, 32px)',
              fontWeight: 700,
              color: '#FFFFFF',
              margin: 0,
              lineHeight: 1.25,
            }}
          >
            Reliable.{' '}
            <span
              style={{
                fontStyle: 'italic',
                fontWeight: 600,
                background: 'var(--gold-gradient-h)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Refined.
            </span>{' '}
            Ready.
          </h2>
        </Reveal>

        {/* Headline figures, as a slim rule-separated row rather than cards. */}
        <div
          className="trust-stats"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '14px 0',
            marginBottom: 46,
          }}
        >
          {trustBadges.map((b, i) => (
            <Reveal
              key={b.label}
              index={i}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 9,
                padding: '0 26px',
                borderLeft: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 700,
                  lineHeight: 1,
                  background: 'var(--gold-gradient-h)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                <CountUp value={b.value} />
              </span>
              <span className="label-caps" style={{ color: 'rgba(255,255,255,0.62)' }}>
                {b.label}
              </span>
            </Reveal>
          ))}
        </div>

        {/* The six reasons, as raised cards. */}
        <div
          className="trust-grid"
          style={{
            display: 'grid',
            // 360px settles six cards into 3 + 3 on desktop rather than a
            // ragged 4 + 2, then steps down to 2 and 1 on smaller screens.
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 18,
          }}
        >
          {differentiators.map((t, i) => (
            <ReasonCard key={t.n} reason={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** One numbered reason, tipping towards the pointer as it is read. */
function ReasonCard({ reason, index }: { reason: Differentiator; index: number }) {
  const tilt = useTilt({ max: 6 })
  const active = tilt.active

  return (
    <Reveal variant="lift" index={index}>
      <div
        ref={tilt.ref}
        {...tilt.handlers}
        className={tilt.className}
        style={{ ...raisedCard(active), padding: '30px 28px 28px', height: '100%' }}
      >
        <span aria-hidden="true" className="tilt-sheen" />
        {/* Gradient rule that draws in from the left on hover. */}
        <div style={cardTopRule(active)} />

        <div className="tilt-layer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.05em',
                background: 'var(--gold-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {reason.n}
            </span>
            <span
              style={{
                height: 1,
                width: active ? 34 : 22,
                background: 'var(--gold-gradient-h)',
                opacity: active ? 0.9 : 0.45,
                transition: 'width 0.3s ease, opacity 0.3s ease',
              }}
            />
          </div>

          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 18,
              fontWeight: 700,
              color: '#FFFFFF',
              margin: '0 0 8px',
              lineHeight: 1.25,
            }}
          >
            {reason.label}
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.6)',
              margin: 0,
            }}
          >
            {reason.desc}
          </p>
        </div>
      </div>
    </Reveal>
  )
}
