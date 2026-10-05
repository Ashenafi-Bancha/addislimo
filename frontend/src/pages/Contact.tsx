import { useState, type CSSProperties, type FormEvent, type ReactNode, type Ref } from 'react'
import type { Page } from '@/app/routes'
import Reveal from '@/components/ui/Reveal'
import { pillGhost, pillGold } from '@/components/ui/buttonStyles'
import { cardTopRule, raisedCard } from '@/components/ui/cardStyles'
import { site } from '@/config/site'
import { useContent } from '@/features/cms'
import { useTilt } from '@/hooks/useTilt'

interface Props {
  navigate: (p: Page) => void
}

/**
 * Contact.
 *
 * Every detail comes from Website Content, so the client changes a phone
 * number in the admin rather than asking for a deploy. The form has no
 * backend yet: it opens the reader's mail app with the message filled in,
 * which is honest and works today, and becomes `POST /contact` later.
 */
export default function Contact({ navigate }: Props) {
  const business = useContent('business')
  const phoneHref = business.phoneHref.replace(/[^\d+]/g, '')
  const whatsapp = business.whatsapp.replace(/\D/g, '')

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 72 }}>
      {/* Hero */}
      <section className="halo" style={{ position: 'relative', padding: '92px 32px 64px', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <Reveal>
            <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 14 }}>Talk to us</p>
          </Reveal>
          <Reveal index={1}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(34px, 5vw, 62px)',
                fontWeight: 700,
                lineHeight: 1.05,
                margin: '0 0 18px',
                color: '#FFFFFF',
              }}
            >
              Every journey starts{' '}
              <span style={{ fontStyle: 'italic', fontWeight: 600, background: 'var(--gold-gradient-h)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                with a conversation.
              </span>
            </h1>
          </Reveal>
          <Reveal index={2}>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.72)', margin: 0 }}>
              Reserve a chauffeur, plan a delegation, or ask anything about our service in {site.city}. Our dispatch desk answers {business.hours}.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Ways to reach us */}
      <section style={{ padding: '0 32px 24px', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          <ContactCard
            index={0}
            icon="☎"
            label="Call dispatch"
            value={business.phone}
            href={phoneHref ? `tel:${phoneHref}` : undefined}
            note={phoneHref ? 'Tap to call' : 'Number coming soon'}
          />
          <ContactCard
            index={1}
            icon="✉"
            label="Email"
            value={business.email}
            href={`mailto:${business.email}`}
            note="We reply the same day"
          />
          <ContactCard
            index={2}
            icon="✆"
            label="WhatsApp"
            value={whatsapp ? `+${whatsapp}` : 'Coming soon'}
            href={whatsapp ? `https://wa.me/${whatsapp}` : undefined}
            note={whatsapp ? 'Message us anytime' : 'Being set up'}
          />
          <ContactCard index={3} icon="◉" label="Where we operate" value={business.address} note={`Dispatch ${business.hours}`} />
        </div>
      </section>

      {/* Message form */}
      <section style={{ padding: '64px 32px 96px', maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 36, alignItems: 'start' }}>
          <Reveal variant="left">
            <p className="label-caps" style={{ marginBottom: 12 }}>Send a message</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(26px, 3.2vw, 40px)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.15, margin: '0 0 16px' }}>
              Tell us about your trip.
            </h2>
            <p style={{ fontSize: 14.5, lineHeight: 1.8, color: 'rgba(255,255,255,0.66)', margin: '0 0 28px' }}>
              Share the date, the pickup point and how many travellers. We confirm the vehicle, the chauffeur and the price before anything is booked.
            </p>
            <button onClick={() => navigate('booking')} className="shine press" style={{ ...pillGhost, padding: '14px 30px' }}>
              Or book in five steps
            </button>
          </Reveal>

          <Reveal variant="right">
            <MessageForm email={business.email} />
          </Reveal>
        </div>
      </section>
    </div>
  )
}

function ContactCard({
  index,
  icon,
  label,
  value,
  href,
  note,
}: {
  index: number
  icon: string
  label: string
  value: string
  href?: string
  note: string
}) {
  const tilt = useTilt<HTMLAnchorElement | HTMLDivElement>({ max: 6 })
  const body = (
    <>
      <span aria-hidden="true" className="tilt-sheen" />
      <span style={{ ...cardTopRule(tilt.active, 'center') }} />
      <div className="tilt-layer-sm" style={{ position: 'relative' }}>
        <div style={{ fontSize: 22, color: '#FFFFFF', opacity: tilt.active ? 1 : 0.55, transition: 'opacity 0.3s', marginBottom: 14 }} aria-hidden="true">
          {icon}
        </div>
        <p className="label-caps" style={{ marginBottom: 8 }}>{label}</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 600, color: '#FFFFFF', margin: '0 0 6px', overflowWrap: 'anywhere' }}>{value}</p>
        <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{note}</p>
      </div>
    </>
  )

  const style: CSSProperties = { ...raisedCard(tilt.active), padding: '26px 24px', display: 'block', textDecoration: 'none', height: '100%' }

  return (
    <Reveal variant="lift" index={index}>
      {href ? (
        <a ref={tilt.ref as Ref<HTMLAnchorElement>} {...tilt.handlers} className={tilt.className} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" style={style}>
          {body}
        </a>
      ) : (
        <div ref={tilt.ref as Ref<HTMLDivElement>} {...tilt.handlers} className={tilt.className} style={style}>
          {body}
        </div>
      )}
    </Reveal>
  )
}

/**
 * Composes a mail message from the fields. Until the backend exists this is
 * the only way a message reaches the business without pretending to send
 * something, so the button says exactly what it does.
 */
function MessageForm({ email }: { email: string }) {
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [tried, setTried] = useState(false)

  const errors = {
    name: name.trim() ? '' : 'Please enter your name.',
    from: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from.trim()) ? '' : 'Please enter a valid email address.',
    message: message.trim().length > 4 ? '' : 'Please tell us what you need.',
  }
  const valid = Object.values(errors).every((e) => !e)

  const submit = (event: FormEvent) => {
    event.preventDefault()
    setTried(true)
    if (!valid) return
    const body = [
      `Name: ${name.trim()}`,
      `Email: ${from.trim()}`,
      phone.trim() ? `Phone: ${phone.trim()}` : '',
      '',
      message.trim(),
    ]
      .filter(Boolean)
      .join('\n')
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Enquiry from ${name.trim()}`)}&body=${encodeURIComponent(body)}`
  }

  return (
    <form onSubmit={submit} noValidate style={{ ...raisedCard(false), padding: 'clamp(22px, 4vw, 34px)' }}>
      <div style={{ display: 'grid', gap: 16 }}>
        <FormField id="ct-name" label="Your name" error={tried ? errors.name : ''}>
          <input id="ct-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" style={fieldStyle} />
        </FormField>
        <FormField id="ct-email" label="Email" error={tried ? errors.from : ''}>
          <input id="ct-email" type="email" value={from} onChange={(e) => setFrom(e.target.value)} autoComplete="email" style={fieldStyle} />
        </FormField>
        <FormField id="ct-phone" label="Phone (optional)" error="">
          <input id="ct-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" style={fieldStyle} />
        </FormField>
        <FormField id="ct-message" label="How can we help?" error={tried ? errors.message : ''}>
          <textarea
            id="ct-message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Airport pickup on 12 June, two travellers, arriving from Nairobi."
            style={{ ...fieldStyle, height: 'auto', padding: '12px 14px', lineHeight: 1.6, resize: 'vertical' }}
          />
        </FormField>

        <button type="submit" className="shine shine-dark press" style={{ ...pillGold, width: '100%', padding: '16px 28px' }}>
          Write this message
        </button>
        <p style={{ margin: 0, fontSize: 12, lineHeight: 1.6, color: 'rgba(255,255,255,0.45)' }}>
          This opens your email app with the message ready, so you can see exactly what is sent. Prefer to talk? Call the dispatch desk above.
        </p>
      </div>
    </form>
  )
}

function FormField({ id, label, error, children }: { id: string; label: string; error: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="label-caps" style={{ display: 'block', marginBottom: 8 }}>
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" style={{ margin: '7px 0 0', fontSize: 12.5, color: '#FFFFFF' }}>
          <span aria-hidden="true" style={{ color: 'var(--status-critical)', marginRight: 6 }}>●</span>
          {error}
        </p>
      )}
    </div>
  )
}

const fieldStyle: CSSProperties = {
  width: '100%',
  height: 48,
  padding: '0 14px',
  borderRadius: 10,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.14)',
  color: '#FFFFFF',
  fontFamily: 'var(--font-body)',
  fontSize: 14.5,
  outline: 'none',
  colorScheme: 'dark',
  transition: 'border-color 0.2s, background 0.2s',
}
