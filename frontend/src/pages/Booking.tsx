import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import type { Page } from '@/app/routes'
import Reveal from '@/components/ui/Reveal'
import { serviceOptions, stepLabels, vehicleOptions } from '@/features/booking/booking.data'
import { useContent } from '@/features/cms'

interface Props {
  navigate: (p: Page) => void
}

type Step = 1 | 2 | 3 | 4 | 5

/**
 * The five-step booking flow.
 *
 * Shaped around how someone actually fills a form on a phone: one decision
 * per screen, labels that float out of the way, errors that appear under the
 * field they belong to and only after the reader has tried to move on, and a
 * running summary so nobody has to scroll back to check what they chose.
 *
 * Nothing is submitted anywhere yet. `submit` hands over to the confirmation
 * page; it becomes `POST /bookings` (see `lib/api/endpoints.ts`).
 */
export default function Booking({ navigate }: Props) {
  const business = useContent('business')
  const [step, setStep] = useState<Step>(1)
  const [tried, setTried] = useState<Record<number, boolean>>({})

  const [service, setService] = useState('')
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [passengers, setPassengers] = useState('1')
  const [luggage, setLuggage] = useState('1')
  const [vehicle, setVehicle] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  /** Today, as the date input wants it, so nobody books a trip in the past. */
  const today = useMemo(() => {
    const d = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  }, [])

  const errors: Record<number, Record<string, string>> = {
    1: { service: service ? '' : 'Choose the service you need.' },
    2: {
      pickup: pickup.trim() ? '' : 'Where should the chauffeur collect you?',
      destination: destination.trim() ? '' : 'Where are you going?',
    },
    3: {
      date: !date ? 'Choose the date of your trip.' : date < today ? 'That date has passed. Choose today or later.' : '',
      time: time ? '' : 'Choose a pickup time.',
    },
    4: { vehicle: vehicle ? '' : 'Choose a vehicle class.' },
    5: {
      firstName: firstName.trim() ? '' : 'Enter your first name.',
      lastName: lastName.trim() ? '' : 'Enter your last name.',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? '' : 'Enter a valid email address.',
      phone: phone.trim() === '' || phone.replace(/\D/g, '').length >= 7 ? '' : 'Enter a reachable phone number.',
    },
  }

  const stepValid = (n: Step) => Object.values(errors[n]).every((e) => !e)
  const showError = (n: Step, key: string) => (tried[n] ? errors[n][key] : '')

  const go = (next: Step) => {
    setStep(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const next = () => {
    setTried((t) => ({ ...t, [step]: true }))
    if (stepValid(step) && step < 5) go((step + 1) as Step)
  }

  const back = () => {
    if (step > 1) go((step - 1) as Step)
  }

  const submit = () => {
    setTried((t) => ({ ...t, 5: true }))
    if ([1, 2, 3, 4, 5].every((n) => stepValid(n as Step))) navigate('confirmation')
  }

  const serviceLabel = serviceOptions.find((s) => s.id === service)?.label ?? ''
  const vehicleLabel = vehicleOptions.find((v) => v.id === vehicle)?.label ?? ''

  const summary: [string, string][] = [
    ['Service', serviceLabel],
    ['Pickup', pickup.trim()],
    ['Destination', destination.trim()],
    ['Date and time', date && time ? `${date} at ${time}` : ''],
    ['Travellers', `${passengers} passenger${passengers === '1' ? '' : 's'}, ${luggage} bag${luggage === '1' ? '' : 's'}`],
    ['Vehicle', vehicleLabel],
  ]

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 72 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(40px, 6vw, 72px) 20px 80px' }}>
        {/* Header */}
        <Reveal style={{ marginBottom: 34, maxWidth: 680 }}>
          <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 12 }}>Reservation</p>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4.6vw, 52px)',
              fontWeight: 700,
              lineHeight: 1.08,
              margin: '0 0 14px',
              color: '#FFFFFF',
            }}
          >
            Book your journey{' '}
            <span style={{ fontStyle: 'italic', fontWeight: 600, background: 'var(--gold-gradient-h)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              in five steps.
            </span>
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.62)', margin: 0 }}>
            It takes about a minute. We confirm the chauffeur, the vehicle and the price before anything is charged.
          </p>
        </Reveal>

        <div className="booking-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 28, alignItems: 'start' }}>
          <div>
            {/* Progress */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, color: '#FFFFFF' }}>
                  Step {step} of 5
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 500 }}> · {stepLabels[step - 1]}</span>
                </p>
                <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                  {Math.round((step / 5) * 100)}% complete
                </p>
              </div>

              <div className="step-rail" style={{ ['--step-progress' as string]: String(step / 5) }}>
                <span />
              </div>

              {/* Completed steps stay reachable, so a change is two taps away. */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
                {stepLabels.map((label, i) => {
                  const n = (i + 1) as Step
                  const done = step > n
                  const current = step === n
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => done && go(n)}
                      disabled={!done && !current}
                      aria-current={current ? 'step' : undefined}
                      className="press booking-step-chip"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 7,
                        padding: '7px 13px',
                        borderRadius: 999,
                        cursor: done ? 'pointer' : 'default',
                        background: current ? 'rgba(255,255,255,0.1)' : 'transparent',
                        border: `1px solid ${current ? 'rgba(255,255,255,0.5)' : done ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)'}`,
                        color: current ? '#FFFFFF' : done ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                        fontFamily: 'var(--font-body)',
                        fontSize: 11.5,
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                      }}
                    >
                      <span aria-hidden="true" style={{ fontSize: 11 }}>{done ? '✓' : n}</span>
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step content */}
            <div
              key={step}
              className="step-panel"
              style={{
                background: 'linear-gradient(165deg, #1A1713 0%, #13110E 55%, #0F0E0C 100%)',
                border: '1px solid rgba(255,255,255,0.09)',
                borderRadius: 18,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 20px 46px rgba(0,0,0,0.5)',
                padding: 'clamp(20px, 3.4vw, 34px)',
              }}
            >
              {step === 1 && (
                <StepShell title="What do you need?" lead="Pick the service closest to your trip. You can tell us more at the end.">
                  <div role="radiogroup" aria-label="Service" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
                    {serviceOptions.map((s) => (
                      <ChoiceCard key={s.id} selected={service === s.id} onSelect={() => setService(s.id)} title={s.label} subtitle={s.desc} />
                    ))}
                  </div>
                  {showError(1, 'service') && <p className="field-error" style={{ marginTop: 14 }}>{errors[1].service}</p>}
                </StepShell>
              )}

              {step === 2 && (
                <StepShell title="Where are you going?" lead="A hotel name, a landmark or a full address all work.">
                  <div style={{ display: 'grid', gap: 18 }}>
                    <Field id="bk-pickup" label="Pickup location" value={pickup} error={showError(2, 'pickup')} hint="For arrivals, Bole International Airport is the usual pickup.">
                      <input id="bk-pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder=" " autoComplete="off" />
                    </Field>
                    <Field id="bk-destination" label="Destination" value={destination} error={showError(2, 'destination')}>
                      <input id="bk-destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder=" " autoComplete="off" />
                    </Field>
                  </div>
                </StepShell>
              )}

              {step === 3 && (
                <StepShell title="When shall we collect you?" lead="Give us the local time in Addis Ababa.">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 18 }}>
                    <Field id="bk-date" label="Date" value={date} error={showError(3, 'date')}>
                      <input id="bk-date" type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} placeholder=" " />
                    </Field>
                    <Field id="bk-time" label="Pickup time" value={time} error={showError(3, 'time')}>
                      <input id="bk-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder=" " />
                    </Field>
                    <Field id="bk-passengers" label="Passengers" value={passengers}>
                      <select id="bk-passengers" value={passengers} onChange={(e) => setPassengers(e.target.value)}>
                        {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n}>{n}</option>)}
                      </select>
                    </Field>
                    <Field id="bk-luggage" label="Luggage pieces" value={luggage}>
                      <select id="bk-luggage" value={luggage} onChange={(e) => setLuggage(e.target.value)}>
                        {[0, 1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}
                      </select>
                    </Field>
                  </div>
                </StepShell>
              )}

              {step === 4 && (
                <StepShell title="Which vehicle class?" lead="The exact car comes from our partner network, matched to your class.">
                  <div role="radiogroup" aria-label="Vehicle class" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                    {vehicleOptions.map((v) => (
                      <ChoiceCard
                        key={v.id}
                        selected={vehicle === v.id}
                        onSelect={() => setVehicle(v.id)}
                        title={v.label}
                        subtitle={`${v.capacity} passengers · ${v.note}`}
                        glyph={v.img}
                      />
                    ))}
                  </div>
                  {showError(4, 'vehicle') && <p className="field-error" style={{ marginTop: 14 }}>{errors[4].vehicle}</p>}
                </StepShell>
              )}

              {step === 5 && (
                <StepShell title="Where do we confirm?" lead={`We reply by email, and by WhatsApp if you leave a number. Dispatch answers ${business.hours}.`}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 18 }}>
                    <Field id="bk-first" label="First name" value={firstName} error={showError(5, 'firstName')}>
                      <input id="bk-first" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder=" " autoComplete="given-name" />
                    </Field>
                    <Field id="bk-last" label="Last name" value={lastName} error={showError(5, 'lastName')}>
                      <input id="bk-last" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder=" " autoComplete="family-name" />
                    </Field>
                    <Field id="bk-email" label="Email address" value={email} error={showError(5, 'email')}>
                      <input id="bk-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " autoComplete="email" inputMode="email" />
                    </Field>
                    <Field id="bk-phone" label="Phone or WhatsApp" value={phone} error={showError(5, 'phone')} hint="Optional, but it is the fastest way to reach you.">
                      <input id="bk-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder=" " autoComplete="tel" inputMode="tel" />
                    </Field>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Field id="bk-notes" label="Anything we should know?" value={notes}>
                        <textarea id="bk-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder=" " />
                      </Field>
                    </div>
                  </div>
                </StepShell>
              )}
            </div>

            {/* Actions */}
            <div className="booking-actions" style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
              {step > 1 && (
                <button
                  type="button"
                  onClick={back}
                  className="press"
                  style={{
                    background: 'transparent',
                    color: 'rgba(255,255,255,0.85)',
                    border: '1px solid rgba(255,255,255,0.22)',
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    padding: '15px 24px',
                  }}
                >
                  ← Back
                </button>
              )}

              <button
                type="button"
                onClick={step < 5 ? next : submit}
                className="booking-next shine shine-dark press"
                style={{
                  marginLeft: 'auto',
                  background: 'var(--gold-gradient)',
                  color: '#0C0B09',
                  border: 'none',
                  borderRadius: 999,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  padding: '16px 34px',
                  boxShadow: '0 4px 28px rgba(255,255,255,0.16)',
                }}
              >
                {step < 5 ? 'Continue →' : 'Request this booking'}
              </button>
            </div>

            {/* Said once, under the final action, rather than buried in a panel. */}
            {step === 5 && (
              <p style={{ margin: '14px 0 0', fontSize: 12.5, lineHeight: 1.7, color: 'rgba(255,255,255,0.45)' }}>
                Sending this does not charge anything. Our team confirms the vehicle and the price with you first.
              </p>
            )}
          </div>

          {/* Running summary */}
          <aside
            className="booking-summary"
            style={{
              position: 'sticky',
              top: 96,
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.09)',
              background: 'rgba(255,255,255,0.025)',
              padding: '22px 22px 20px',
            }}
          >
            <p className="label-caps" style={{ marginBottom: 16 }}>Your booking</p>
            <dl style={{ margin: 0, display: 'grid', gap: 13 }}>
              {summary.map(([key, value]) => (
                <div key={key}>
                  <dt style={{ fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.38)' }}>{key}</dt>
                  <dd
                    style={{
                      margin: '4px 0 0',
                      fontFamily: 'var(--font-body)',
                      fontSize: 13.5,
                      lineHeight: 1.5,
                      color: value ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {value || 'Not chosen yet'}
                  </dd>
                </div>
              ))}
            </dl>
            <p style={{ margin: '18px 0 0', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 12, lineHeight: 1.65, color: 'rgba(255,255,255,0.45)' }}>
              Prefer to talk? Call {business.phone}.
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}

function StepShell({ title, lead, children }: { title: string; lead: string; children: ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 2.6vw, 28px)', fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px', lineHeight: 1.2 }}>{title}</h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7, margin: '0 0 26px' }}>{lead}</p>
      {children}
    </div>
  )
}

/**
 * A labelled field. The label floats up once the control holds a value or
 * has focus, which is why `value` is passed separately: date, time and
 * select controls never report an empty placeholder to CSS.
 */
function Field({
  id,
  label,
  value,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  value: string
  error?: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <div className={`field${value ? ' is-filled' : ''}${error ? ' is-invalid' : ''}`}>
        {children}
        <label htmlFor={id} className="field-label">
          {label}
        </label>
      </div>
      {error ? <p className="field-error">{error}</p> : hint ? <p className="field-hint">{hint}</p> : null}
    </div>
  )
}

function ChoiceCard({
  selected,
  onSelect,
  title,
  subtitle,
  glyph,
}: {
  selected: boolean
  onSelect: () => void
  title: string
  subtitle: string
  glyph?: string
}) {
  return (
    <button type="button" role="radio" aria-checked={selected} onClick={onSelect} className={`choice${selected ? ' is-selected' : ''}`} style={style.choiceInner}>
      <span className="choice-tick" aria-hidden="true">{selected ? '✓' : ''}</span>
      {glyph && <span style={{ display: 'block', fontSize: 26, marginBottom: 10 }} aria-hidden="true">{glyph}</span>}
      <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontSize: 16.5, fontWeight: 600, color: '#FFFFFF', marginBottom: 5 }}>{title}</span>
      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 12.5, lineHeight: 1.55, color: 'rgba(255,255,255,0.58)' }}>{subtitle}</span>
    </button>
  )
}

const style: Record<string, CSSProperties> = {
  choiceInner: { height: '100%' },
}
