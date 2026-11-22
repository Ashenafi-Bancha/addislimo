import { useState, type CSSProperties } from 'react'
import type { Page } from '@/app/routes'
import { channelsFor, recallRequest, toText } from '@/features/booking/request'
import { useContent } from '@/features/cms'
import { t, tf } from '@/features/i18n'

interface Props { navigate: (p: Page) => void }

/**
 * The last step of the booking: sending it.
 *
 * This screen used to say the request "has been received" and show a
 * reference rolled from `Math.random()` on every render. Nothing had been
 * received — there is no backend, so the five steps the reader had just
 * filled in went nowhere. A chauffeur booking that quietly evaporates is
 * worse than no booking form at all.
 *
 * So the reader finishes the job here, through a channel they already have:
 * WhatsApp, their mail app, or the phone. Each one arrives with the whole
 * booking written out, so dispatch gets the same details either way. Once
 * `POST /bookings` exists this becomes the receipt it always pretended to be,
 * and these buttons stay as the fallback when the call fails.
 */
export default function Confirmation({ navigate }: Props) {
  const business = useContent('business')
  const [request] = useState(recallRequest)
  const [sentVia, setSentVia] = useState<string | null>(null)

  // Someone opened /booking/confirmed directly, or the tab was reopened.
  if (!request) {
    return (
      <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 'var(--nav-h)', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '80px 32px', textAlign: 'center' }}>
          <p className="label-caps" style={{ color: 'var(--gold)', marginBottom: 16 }}>{t('Nothing to send')}</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.15, marginBottom: 16 }}>
            {t('We do not have a booking open.')}
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.75, marginBottom: 36 }}>
            {t('Bookings are held for the visit that made them, so this page is empty after the tab is closed. Start again and it takes a minute.')}
          </p>
          <button onClick={() => navigate('booking')} className="shine shine-dark press" style={primaryButton}>
            {t('Book a Ride')}
          </button>
        </div>
      </div>
    )
  }

  const channels = channelsFor(request, business)
  const send = (via: string) => setSentVia(via)
  // Dispatch already has it, or it is still on this device and the reader
  // sends it. The screen says whichever is true; claiming the first when the
  // second is the case is the failure this page exists to avoid.
  const delivered = request.delivered === true

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toText(request))
      setSentVia('clipboard')
    } catch {
      /* No clipboard permission: the summary below is selectable by hand. */
    }
  }

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 'var(--nav-h)' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '72px 32px 96px', width: '100%' }}>

        {/* Reference */}
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <div style={{ display: 'flex', gap: 3, color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 16, justifyContent: 'center' }}>
            {['★','★','★','★','★'].map((s, i) => <span key={i}>{s}</span>)}
          </div>
          <p className="label-caps" style={{ color: 'var(--gold)', marginBottom: 14 }}>
            {delivered ? t('Booking received') : t('One step left')}
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(30px, 5vw, 50px)',
            fontWeight: 700, lineHeight: 1.1, marginBottom: 16, color: '#FFFFFF',
          }}>
            {delivered ? t('We have your') : t('Send us your')}{' '}
            <em style={{ fontWeight: 600, background: 'var(--gold-gradient-h)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {t('request.')}
            </em>
          </h1>
          <p style={{ fontSize: 15.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            {delivered
              ? t('It is with our dispatch desk now. We confirm the vehicle, the chauffeur and the price with you before anything is final. Quote your reference if you call.')
              : t('Your booking is ready, with every detail filled in. Choose how to reach our dispatch desk and we confirm the vehicle, the chauffeur and the price before anything is final.')}
          </p>
        </div>

        {delivered && (
          <p style={{
            textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.55)',
            margin: '0 0 20px', lineHeight: 1.7,
          }}>
            {t('Nothing else is needed. If you would rather talk it through, these reach us directly.')}
          </p>
        )}

        {/* The channels. WhatsApp first: it is how most of Addis gets hold of
            a business, and it reaches a phone rather than an inbox. When the
            booking is already with dispatch these are a way to talk to a
            person, not the thing that delivers it. */}
        <div style={{ display: 'grid', gap: 12, marginBottom: 36 }}>
          {channels.whatsapp && (
            <a href={channels.whatsapp} target="_blank" rel="noopener noreferrer" onClick={() => send('whatsapp')} style={{ ...channelCard, background: 'rgba(37,211,102,0.10)', borderColor: 'rgba(37,211,102,0.38)' }}>
              <span aria-hidden="true" style={{ ...channelIcon, background: 'rgba(37,211,102,0.14)' }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                </svg>
              </span>
              <span>
                <strong style={channelTitle}>{delivered ? t('Talk to us on WhatsApp') : t('Send on WhatsApp')}</strong>
                <span style={channelNote}>
                  {delivered
                    ? t('Opens with your booking written out, in case you want to add anything.')
                    : t('Fastest. Opens with your booking written out, ready to send.')}
                </span>
              </span>
              <span aria-hidden="true" style={channelArrow}>→</span>
            </a>
          )}

          <a href={channels.email} onClick={() => send('email')} style={channelCard}>
            <span aria-hidden="true" style={channelIcon}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <span>
              <strong style={channelTitle}>{t('Send by email')}</strong>
              <span style={channelNote}>{tf('Opens your mail app with the booking addressed to {email}.', { email: business.email })}</span>
            </span>
            <span aria-hidden="true" style={channelArrow}>→</span>
          </a>

          {channels.phone && (
            <a href={channels.phone} onClick={() => send('phone')} style={channelCard}>
              <span aria-hidden="true" style={channelIcon}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.19h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </span>
              <span>
                <strong style={channelTitle}>{tf('Call {phone}', { phone: business.phone })}</strong>
                <span style={channelNote}>{tf('Dispatch answers {hours}. Quote your reference.', { hours: business.hours })}</span>
              </span>
              <span aria-hidden="true" style={channelArrow}>→</span>
            </a>
          )}
        </div>

        {sentVia && (
          <p role="status" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: 'rgba(255,255,255,0.05)', border: '1px solid var(--gold-muted)',
            borderRadius: 10, padding: '14px 20px', marginBottom: 36,
            fontSize: 13.5, color: 'rgba(255,255,255,0.85)',
          }}>
            <span aria-hidden="true" style={{ color: 'var(--gold)' }}>✓</span>
            {sentVia === 'clipboard'
              ? t('Booking copied. Paste it wherever you like.')
              : t('Opened. Send the message and dispatch will confirm shortly.')}
          </p>
        )}

        {/* What they are sending, so nothing is taken on trust. */}
        <div style={{
          background: 'var(--surface-2)', border: '1px solid rgba(255,255,255,0.14)',
          borderRadius: 14, padding: 'clamp(24px, 4vw, 34px)', marginBottom: 32,
          position: 'relative', overflow: 'hidden', textAlign: 'left',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 24 }}>
            <div>
              <p className="label-caps" style={{ color: 'var(--gold)', marginBottom: 8, fontSize: 9 }}>{t('Your reference')}</p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 27, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.08em', margin: 0 }}>
                {request.reference}
              </p>
            </div>
            <button onClick={copy} style={copyButton}>{t('Copy details')}</button>
          </div>

          <div style={{ display: 'grid', gap: '14px 28px', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))' }}>
            {([
              [t('Service'), request.service],
              [t('Pickup'), request.pickup],
              [t('Destination'), request.destination],
              [t('Date and time'), tf('{date} at {time}', { date: request.date, time: request.time })],
              [t('Travellers'), tf('{p} passenger(s), {l} bag(s)', { p: request.passengers, l: request.luggage })],
              [t('Vehicle'), request.vehicle],
              [t('Name'), `${request.firstName} ${request.lastName}`],
              [t('Email'), request.email],
              ...(request.phone ? [[t('Phone'), request.phone]] : []),
            ] as [string, string][]).map(([key, value]) => (
              <div key={key}>
                <p className="label-caps" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 4, fontSize: 9 }}>{key}</p>
                <p style={{ color: '#FFFFFF', fontSize: 14, margin: 0, overflowWrap: 'anywhere' }}>{value}</p>
              </div>
            ))}
          </div>

          {request.notes.trim() && (
            <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="label-caps" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 6, fontSize: 9 }}>{t('Notes')}</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.65, margin: 0 }}>{request.notes.trim()}</p>
            </div>
          )}
        </div>

        <p style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, textAlign: 'center', marginBottom: 32 }}>
          {t('Nothing is charged here. Dispatch confirms the vehicle, the chauffeur and the price with you first.')}
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('home')} className="shine shine-dark press" style={primaryButton}>{t('Return Home')}</button>
          <button onClick={() => navigate('contact')} className="shine press" style={ghostButton}>{t('Contact Addis Limo')}</button>
        </div>
      </div>
    </div>
  )
}

const channelCard: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  alignItems: 'center',
  gap: 16,
  padding: '18px 20px',
  borderRadius: 12,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.16)',
  textDecoration: 'none',
  textAlign: 'left',
  transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
}

const channelIcon: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 10,
  display: 'grid',
  placeItems: 'center',
  background: 'rgba(255,255,255,0.07)',
  flexShrink: 0,
}

const channelTitle: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontSize: 15,
  fontWeight: 700,
  color: '#FFFFFF',
  marginBottom: 3,
}

const channelNote: CSSProperties = {
  display: 'block',
  fontSize: 12.5,
  color: 'rgba(255,255,255,0.6)',
  lineHeight: 1.5,
}

const channelArrow: CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: 17 }

const copyButton: CSSProperties = {
  background: 'transparent',
  color: 'rgba(255,255,255,0.8)',
  border: '1px solid rgba(255,255,255,0.22)',
  borderRadius: 50,
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  padding: '9px 16px',
}

const primaryButton: CSSProperties = {
  background: 'var(--gold-gradient)',
  color: 'var(--ink)',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  padding: '14px 32px',
  borderRadius: 50,
  boxShadow: '0 2px 24px rgba(255,255,255,0.10)',
}

const ghostButton: CSSProperties = {
  background: 'transparent',
  color: '#FFFFFF',
  border: '1px solid #FFFFFF',
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  padding: '14px 32px',
  borderRadius: 50,
}
