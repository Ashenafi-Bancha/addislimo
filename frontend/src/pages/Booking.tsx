import { useState } from 'react'
import { serviceOptions, stepLabels, vehicleOptions } from '@/features/booking/booking.data'
import type { Page } from '@/app/routes'

interface Props { navigate: (p: Page) => void }

type Step = 1 | 2 | 3 | 4 | 5

export default function Booking({ navigate }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [selectedService, setSelectedService] = useState('')
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

  const canNext = () => {
    if (step === 1) return !!selectedService
    if (step === 2) return !!pickup && !!destination
    if (step === 3) return !!date && !!time
    if (step === 4) return !!vehicle
    return !!firstName && !!lastName && !!email
  }

  const next = () => { if (canNext() && step < 5) setStep((step + 1) as Step) }
  const back = () => { if (step > 1) setStep((step - 1) as Step) }

  const submit = () => navigate('confirmation')

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 72 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 32px' }}>
        {/* Header */}
        <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 12 }}>Reservation</p>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, marginBottom: 16,
          background: 'var(--gold-gradient-h)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Book Your Journey
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 40 }}>
          <div style={{ height: 1, width: 56, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
          <span style={{ color: '#FFFFFF', fontSize: 10 }}>✦</span>
          <div style={{ height: 1, width: 56, background: 'linear-gradient(to left, transparent, #FFFFFF)' }} />
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 52, gap: 0 }}>
          {stepLabels.map((label, i) => {
            const n = (i + 1) as Step
            const done = step > n
            const active = step === n
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < stepLabels.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 36, height: 36,
                    background: done ? '#FFFFFF' : active ? 'transparent' : 'transparent',
                    border: `1px solid ${done || active ? '#FFFFFF' : 'rgba(247,245,240,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700,
                    color: done ? '#0B0B0B' : active ? '#FFFFFF' : 'rgba(255,255,255,0.30)',
                    transition: 'all 0.2s',
                  }}>{done ? '✓' : n}</div>
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                    color: active ? '#FFFFFF' : done ? 'rgba(255,255,255,0.6)' : 'rgba(247,245,240,0.25)',
                  }}>{label}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div style={{
                    flex: 1, height: 1, margin: '-20px 8px 0',
                    background: done ? '#FFFFFF' : 'rgba(247,245,240,0.1)',
                    transition: 'background 0.3s',
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        <div style={{ background: 'var(--surface-2)', padding: '40px 40px', minHeight: 320 }}>
          {/* Step 1: Service */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: '#FFFFFF', marginBottom: 8 }}>
                Choose Your Service
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, marginBottom: 28 }}>Select the type of transportation you need.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
                {serviceOptions.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedService(s.id)}
                    style={{
                      background: selectedService === s.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                      border: `1px solid ${selectedService === s.id ? '#FFFFFF' : 'rgba(247,245,240,0.1)'}`,
                      cursor: 'pointer', padding: '18px 20px', textAlign: 'left',
                      transition: 'all 0.2s',
                    }}
                  >
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: selectedService === s.id ? '#FFFFFF' : '#FFFFFF', marginBottom: 4 }}>{s.label}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.70)' }}>{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Route */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: '#FFFFFF', marginBottom: 8 }}>Where Are You Going?</h2>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, marginBottom: 32 }}>Enter your pickup and drop-off locations.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                <div>
                  <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 6, fontSize: 10 }}>Pickup Location</label>
                  <input
                    className="input-gold"
                    placeholder="Hotel, Bole Airport, address..."
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    style={{ fontSize: 15 }}
                  />
                </div>
                <div>
                  <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 6, fontSize: 10 }}>Destination</label>
                  <input
                    className="input-gold"
                    placeholder="Office, hotel, address..."
                    value={destination}
                    onChange={e => setDestination(e.target.value)}
                    style={{ fontSize: 15 }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Schedule */}
          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: '#FFFFFF', marginBottom: 8 }}>When Do You Need Us?</h2>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, marginBottom: 32 }}>Select your preferred date and time.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                <div>
                  <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 6, fontSize: 10 }}>Date</label>
                  <input className="input-gold" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ colorScheme: 'dark', fontSize: 15 }} />
                </div>
                <div>
                  <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 6, fontSize: 10 }}>Time</label>
                  <input className="input-gold" type="time" value={time} onChange={e => setTime(e.target.value)} style={{ colorScheme: 'dark', fontSize: 15 }} />
                </div>
                <div>
                  <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 6, fontSize: 10 }}>Passengers</label>
                  <select className="input-gold" value={passengers} onChange={e => setPassengers(e.target.value)} style={{ fontSize: 15 }}>
                    {[1,2,3,4,5,6,7].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 6, fontSize: 10 }}>Luggage Pieces</label>
                  <select className="input-gold" value={luggage} onChange={e => setLuggage(e.target.value)} style={{ fontSize: 15 }}>
                    {[0,1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Vehicle */}
          {step === 4 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: '#FFFFFF', marginBottom: 8 }}>Select Your Vehicle Class</h2>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, marginBottom: 28 }}>Actual vehicles are assigned from our partner network.</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
                {vehicleOptions.map(v => (
                  <button
                    key={v.id}
                    onClick={() => setVehicle(v.id)}
                    style={{
                      background: vehicle === v.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                      border: `1px solid ${vehicle === v.id ? '#FFFFFF' : 'rgba(247,245,240,0.1)'}`,
                      cursor: 'pointer', padding: '22px 18px', textAlign: 'center',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{v.img}</div>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: vehicle === v.id ? '#FFFFFF' : '#FFFFFF', marginBottom: 4 }}>{v.label}</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.70)' }}>{v.capacity} pax</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.30)', marginTop: 4 }}>{v.note}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Customer Info */}
          {step === 5 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: '#FFFFFF', marginBottom: 8 }}>Your Information</h2>
              <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: 14, marginBottom: 32 }}>We&apos;ll confirm your booking via email or WhatsApp.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 28px' }}>
                <div>
                  <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 6, fontSize: 10 }}>First Name</label>
                  <input className="input-gold" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div>
                  <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 6, fontSize: 10 }}>Last Name</label>
                  <input className="input-gold" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
                <div>
                  <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 6, fontSize: 10 }}>Email Address</label>
                  <input className="input-gold" type="email" placeholder="email@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 6, fontSize: 10 }}>Phone / WhatsApp</label>
                  <input className="input-gold" placeholder="+251..." value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 6, fontSize: 10 }}>Special Requests (Optional)</label>
                  <textarea
                    className="input-gold"
                    placeholder="Any special requirements, preferences or notes..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    style={{ resize: 'none', lineHeight: 1.6 }}
                  />
                </div>
              </div>
              {/* Summary */}
              <div style={{ marginTop: 28, padding: '20px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 12, fontSize: 9 }}>Booking Summary</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px', fontSize: 13 }}>
                  {[
                    ['Service', serviceOptions.find(s => s.id === selectedService)?.label || 'Not set'],
                    ['Pickup', pickup || 'Not set'],
                    ['Destination', destination || 'Not set'],
                    ['Date & Time', date && time ? `${date} at ${time}` : 'Not set'],
                    ['Passengers', passengers],
                    ['Vehicle', vehicleOptions.find(v => v.id === vehicle)?.label || 'Not set'],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <span style={{ color: 'rgba(255,255,255,0.35)' }}>{k}: </span>
                      <span style={{ color: '#FFFFFF' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 12, fontStyle: 'italic' }}>
                  Price quote will be confirmed after review by our team.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
          <button
            onClick={back}
            disabled={step === 1}
            style={{
              background: 'transparent', color: step === 1 ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.82)',
              border: `1px solid ${step === 1 ? 'rgba(247,245,240,0.1)' : 'rgba(255,255,255,0.20)'}`,
              cursor: step === 1 ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '12px 28px', transition: 'all 0.2s',
            }}
          >← Back</button>

          <div style={{ display: 'flex', gap: 8 }}>
            {stepLabels.map((_, i) => (
              <div key={i} className={`step-dot ${step === i + 1 ? 'active' : step > i + 1 ? 'active' : ''}`} />
            ))}
          </div>

          {step < 5 ? (
            <button
              onClick={next}
              disabled={!canNext()}
              style={{
                background: canNext() ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.2)',
                color: canNext() ? '#060606' : 'rgba(255,255,255,0.4)',
                border: 'none', cursor: canNext() ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                padding: '14px 32px', borderRadius: '50px',
                boxShadow: canNext() ? '0 2px 24px rgba(255,255,255,0.28)' : 'none',
                transition: 'box-shadow 0.2s, transform 0.15s',
              }}
            >Continue →</button>
          ) : (
            <button
              onClick={submit}
              disabled={!canNext()}
              style={{
                background: canNext() ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.2)',
                color: canNext() ? '#060606' : 'rgba(255,255,255,0.4)',
                border: 'none', cursor: canNext() ? 'pointer' : 'not-allowed',
                fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                padding: '14px 32px', borderRadius: '50px',
                boxShadow: canNext() ? '0 2px 24px rgba(255,255,255,0.28)' : 'none',
                transition: 'box-shadow 0.2s, transform 0.15s',
              }}
            >Submit Booking</button>
          )}
        </div>
      </div>
    </div>
  )
}
