import { useState } from 'react'
import { airportDestinationGroups, airportFeatures, airportSteps } from '@/data/airport'
import type { Page } from '@/app/routes'

interface Props { navigate: (p: Page) => void }

export default function AirportTransfer({ navigate }: Props) {
  const [flightNum, setFlightNum] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [dest, setDest] = useState('')
  const [pax, setPax] = useState('1')
  const [veh, setVeh] = useState('Executive Sedan')
  const [group, setGroup] = useState(airportDestinationGroups[0].id)

  const activeGroup = airportDestinationGroups.find(g => g.id === group) ?? airportDestinationGroups[0]

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', paddingTop: 72 }}>
      {/* Hero */}
      <section style={{ position: 'relative', minHeight: 480, display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1503365194569-df4e1d04cec1?w=1800&h=700&fit=crop&auto=format)',
          backgroundSize: 'cover', backgroundPosition: 'center',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(11,11,11,0.82)' }} />
        <div style={{ position: 'relative', maxWidth: 1280, margin: '0 auto', padding: '80px 32px', width: '100%' }}>
          <div style={{ display: 'flex', gap: 3, color: 'rgba(255,255,255,0.80)', fontSize: 12, marginBottom: 16 }}>
            {['★','★','★','★','★'].map((s,i)=><span key={i}>{s}</span>)}
          </div>
          <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16 }}>Bole International Airport</p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 68px)',
            fontWeight: 700, lineHeight: 1.05, marginBottom: 24, maxWidth: 700,
            background: 'var(--gold-gradient-h)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Arrive in Addis.<br /><em>Travel with Confidence.</em></h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', maxWidth: 540, lineHeight: 1.75 }}>
            From Bole International Airport to your hotel, residence, office or destination, enjoy a seamless private chauffeur experience.
          </p>
        </div>
      </section>

      {/* Booking panel */}
      <section style={{ padding: '0 32px', marginTop: -48, position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="booking-glass" style={{ padding: '40px 48px' }}>
            <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 4 }}>Airport: Bole International Airport</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: '#FFFFFF', marginBottom: 32 }}>
              Book Your Airport Transfer
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0 28px', alignItems: 'end' }}>
              <div>
                <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 4, fontSize: 10 }}>Flight Number</label>
                <input className="input-gold" placeholder="e.g. ET 502" value={flightNum} onChange={e => setFlightNum(e.target.value)} />
              </div>
              <div>
                <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 4, fontSize: 10 }}>Arrival Date</label>
                <input className="input-gold" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ colorScheme: 'dark' }} />
              </div>
              <div>
                <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 4, fontSize: 10 }}>Arrival Time</label>
                <input className="input-gold" type="time" value={time} onChange={e => setTime(e.target.value)} style={{ colorScheme: 'dark' }} />
              </div>
              <div>
                <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 4, fontSize: 10 }}>Destination</label>
                <input className="input-gold" placeholder="Hotel, address..." value={dest} onChange={e => setDest(e.target.value)} />
              </div>
              <div>
                <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 4, fontSize: 10 }}>Passengers</label>
                <select className="input-gold" value={pax} onChange={e => setPax(e.target.value)}>
                  {[1,2,3,4,5,6,7].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="label-caps" style={{ color: 'rgba(255,255,255,0.85)', display: 'block', marginBottom: 4, fontSize: 10 }}>Vehicle</label>
                <select className="input-gold" value={veh} onChange={e => setVeh(e.target.value)}>
                  <option>Executive Sedan</option>
                  <option>Premium SUV</option>
                  <option>Luxury SUV</option>
                  <option>Business Van</option>
                </select>
              </div>
              <div>
                <button
                  onClick={() => navigate('booking')}
                  style={{
                    background: 'var(--gold-gradient)', color: '#060606',
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 800,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    padding: '14px 16px', width: '100%',
                    boxShadow: '0 2px 24px rgba(255,255,255,0.10)',
                    transition: 'box-shadow 0.2s, transform 0.15s',
                  }}
                >Book Transfer</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section style={{ padding: '96px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 12 }}>How It Works</p>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 600, color: '#FFFFFF' }}>Four Simple Steps</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 }}>
            <div style={{ height: 1, width: 56, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
            <span style={{ color: '#FFFFFF', fontSize: 10 }}>✦</span>
            <div style={{ height: 1, width: 56, background: 'linear-gradient(to left, transparent, #FFFFFF)' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {airportSteps.map(s => (
            <div key={s.n} style={{ background: 'var(--surface-2)', padding: '40px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
              <div style={{
                width: 48, height: 48, border: '1px solid #FFFFFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                fontFamily: 'var(--font-display)', fontSize: 18, color: '#FFFFFF', fontWeight: 700,
              }}>{s.n}</div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: '#FFFFFF', marginBottom: 10 }}>{s.title}</h4>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: 'var(--surface)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 12 }}>Service Features</p>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 600, color: '#FFFFFF' }}>Everything Included</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 16 }}>
              <div style={{ height: 1, width: 56, background: 'linear-gradient(to right, transparent, #FFFFFF)' }} />
              <span style={{ color: '#FFFFFF', fontSize: 10 }}>✦</span>
              <div style={{ height: 1, width: 56, background: 'linear-gradient(to left, transparent, #FFFFFF)' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '28px 48px' }}>
            {airportFeatures.map((f, i) => (
              <div key={i} style={{ display: 'flex', gap: 20 }}>
                <div style={{ fontSize: 22, color: '#FFFFFF', flexShrink: 0, marginTop: 2 }}>{f.icon}</div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: '#FFFFFF', marginBottom: 6 }}>{f.title}</h4>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where we take you — tabbed destination groups from the client document */}
      <section style={{ padding: '80px 32px', maxWidth: 1100, margin: '0 auto' }}>
        <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16 }}>Popular Destinations</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, color: '#FFFFFF', marginBottom: 8 }}>Where We Take You</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.70)', marginBottom: 32, fontStyle: 'italic' }}>
          Sample destinations. We serve any address in Addis Ababa.
        </p>

        {/* Tab row */}
        <div style={{ display: 'flex', gap: 2, overflowX: 'auto', scrollbarWidth: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: 28 }}>
          {airportDestinationGroups.map(g => (
            <button
              key={g.id}
              onClick={() => setGroup(g.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: group === g.id ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                padding: '14px 22px', whiteSpace: 'nowrap',
                borderBottom: `2px solid ${group === g.id ? '#FFFFFF' : 'transparent'}`,
                marginBottom: -1,
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >{g.label}</button>
          ))}
        </div>

        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.72)', lineHeight: 1.7, marginBottom: 28, maxWidth: 620 }}>
          {activeGroup.blurb}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {activeGroup.places.map(place => (
            <div key={place} style={{
              border: '1px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '50px',
              fontSize: 13, color: 'rgba(255,255,255,0.85)',
              transition: 'border-color 0.2s, color 0.2s', cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFFFFF'; e.currentTarget.style.color = '#FFFFFF' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' }}
            >{place}</div>
          ))}
          <div style={{
            border: '1px dashed rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '50px',
            fontSize: 13, color: 'rgba(255,255,255,0.30)',
          }}>+ Any Location in Addis</div>
        </div>
      </section>
    </div>
  )
}
