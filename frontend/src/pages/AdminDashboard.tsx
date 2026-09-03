import { useState } from 'react'
import { bookings, metrics, navItems, statusColors, type View } from '@/features/admin/admin.data'
import type { Page } from '@/app/routes'

interface Props { navigate: (p: Page) => void }

export default function AdminDashboard({ navigate }: Props) {
  const [view, setView] = useState<View>('dashboard')
  const [commission, setCommission] = useState(10)

  const totalCommission = bookings.reduce((s, b) => s + b.commission, 0)
  const totalRevenue = bookings.reduce((s, b) => s + b.amount, 0)

  return (
    <div style={{ background: 'var(--ink)', minHeight: '100vh', display: 'flex', paddingTop: 72 }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: 'var(--surface)', flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 72, height: 'calc(100vh - 72px)',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="label-caps" style={{ color: '#FFFFFF', fontSize: 9, marginBottom: 4 }}>Admin Panel</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>Addis Limo Operations</p>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {(['dashboard', 'bookings', 'partners', 'commissions', 'divider', 'customers', 'vehicles', 'drivers', 'services', 'pricing', 'divider', 'payments', 'invoices', 'reviews', 'divider', 'analytics', 'settings'] as const).map((item, i) => {
            if (item === 'divider') return <div key={i} style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />
            const isActive = view === item
            const isClickable = navItems.some(n => n.id === item)
            return (
              <button
                key={item}
                onClick={() => isClickable && setView(item as View)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'none',
                  border: 'none', cursor: 'pointer',
                  fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.75)',
                  padding: '10px 12px',
                  textTransform: 'capitalize',
                  borderLeft: `2px solid ${isActive ? '#FFFFFF' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#FFFFFF' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.75)' }}
              >{item}</button>
            )
          })}
        </nav>
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={() => navigate('home')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.28)', padding: 0, letterSpacing: '0.05em', textAlign: 'left', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.85)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.28)'}
          >← Back to Site</button>
          <button
            onClick={() => navigate('admin-login')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.30)', padding: 0, letterSpacing: '0.05em', textAlign: 'left', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.30)'}
          >Sign Out</button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '40px 40px', overflowY: 'auto' }}>
        {/* Dashboard */}
        {view === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div style={{ display: 'flex', gap: 3, color: 'rgba(255,255,255,0.80)', fontSize: 11, marginBottom: 6 }}>
                  {['★','★','★','★','★'].map((s,i)=><span key={i}>{s}</span>)}
                </div>
                <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 6, fontSize: 10 }}>Operations Center</p>
                <h1 style={{
                  fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700,
                  background: 'var(--gold-gradient-h)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Dashboard</h1>
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.70)' }}>
                {new Date().toLocaleDateString('en-ET', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* Metrics grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 36 }}>
              {metrics.map((m, i) => (
                <div key={i} style={{ background: 'var(--surface-2)', padding: '24px 24px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="label-caps" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, marginBottom: 10 }}>{m.label}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: '#FFFFFF', marginBottom: 6 }}>{m.value}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{m.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent bookings */}
            <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: '#FFFFFF' }}>Recent Bookings</h3>
                <button
                  onClick={() => setView('bookings')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#FFFFFF', letterSpacing: '0.08em' }}
                >View All →</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {['Booking ID', 'Customer', 'Service', 'Date', 'Amount', 'Commission', 'Status'].map(h => (
                        <th key={h} style={{
                          padding: '12px 16px', textAlign: 'left',
                          fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600,
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.30)',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 6).map((b, i) => (
                      <tr key={i} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                        transition: 'background 0.15s', cursor: 'pointer',
                      }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 600 }}>{b.id}</td>
                        <td style={{ padding: '14px 16px', color: '#FFFFFF' }}>{b.customer}</td>
                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.82)' }}>{b.service}</td>
                        <td style={{ padding: '14px 16px', color: 'rgba(255,255,255,0.75)', fontSize: 12 }}>{b.date}</td>
                        <td style={{ padding: '14px 16px', color: '#FFFFFF' }}>ETB {b.amount.toLocaleString()}</td>
                        <td style={{ padding: '14px 16px', color: '#FFFFFF' }}>ETB {b.commission.toLocaleString()}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
                            color: statusColors[b.status] || 'rgba(255,255,255,0.70)',
                            border: `1px solid ${statusColors[b.status] || 'rgba(255,255,255,0.20)'}`,
                            padding: '3px 10px',
                          }}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings view */}
        {view === 'bookings' && (
          <div>
            <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 6, fontSize: 10 }}>Operations</p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 32,
              background: 'var(--gold-gradient-h)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>All Bookings</h1>
            <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {['ID', 'Customer', 'Service', 'Pickup', 'Destination', 'Date', 'Partner', 'Driver', 'Amount', 'Commission', 'Status'].map(h => (
                        <th key={h} style={{
                          padding: '12px 14px', textAlign: 'left',
                          fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 600,
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          color: 'rgba(255,255,255,0.30)', whiteSpace: 'nowrap',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 14px', color: '#FFFFFF', fontWeight: 600, whiteSpace: 'nowrap' }}>{b.id}</td>
                        <td style={{ padding: '12px 14px', color: '#FFFFFF', whiteSpace: 'nowrap' }}>{b.customer}</td>
                        <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.82)', whiteSpace: 'nowrap' }}>{b.service}</td>
                        <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.pickup}</td>
                        <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.dest}</td>
                        <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.72)', fontSize: 11, whiteSpace: 'nowrap' }}>{b.date}</td>
                        <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>{b.partner}</td>
                        <td style={{ padding: '12px 14px', color: 'rgba(255,255,255,0.75)', whiteSpace: 'nowrap' }}>{b.driver}</td>
                        <td style={{ padding: '12px 14px', color: '#FFFFFF', whiteSpace: 'nowrap' }}>ETB {b.amount.toLocaleString()}</td>
                        <td style={{ padding: '12px 14px', color: '#FFFFFF', whiteSpace: 'nowrap' }}>ETB {b.commission.toLocaleString()}</td>
                        <td style={{ padding: '12px 14px' }}>
                          <span style={{
                            fontSize: 10, fontWeight: 600,
                            color: statusColors[b.status] || 'rgba(255,255,255,0.70)',
                            border: `1px solid ${statusColors[b.status] || 'rgba(255,255,255,0.20)'}`,
                            padding: '3px 8px', whiteSpace: 'nowrap',
                          }}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Commissions view */}
        {view === 'commissions' && (
          <div>
            <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 6, fontSize: 10 }}>Revenue</p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 32,
              background: 'var(--gold-gradient-h)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Commission Management</h1>

            {/* Commission rate control */}
            <div style={{ background: 'var(--surface)', padding: '32px 32px', marginBottom: 24, border: '1px solid rgba(255,255,255,0.12)' }}>
              <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 16, fontSize: 10 }}>Global Commission Rate</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                <input
                  type="range" min={5} max={30} value={commission}
                  onChange={e => setCommission(Number(e.target.value))}
                  style={{ flex: 1, accentColor: '#FFFFFF' }}
                />
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700,
                  color: '#FFFFFF', minWidth: 80, textAlign: 'right',
                }}>{commission}%</div>
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.30)', marginTop: 8 }}>
                Addis Limo earns {commission}%. Partner receives {100 - commission}% of booking value.
              </p>
            </div>

            {/* Sample calculation */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
              {[
                { label: 'Example Booking', value: 'ETB 10,000' },
                { label: 'Partner Share', value: `ETB ${(10000 * (100 - commission) / 100).toLocaleString()}` },
                { label: 'Addis Limo Commission', value: `ETB ${(10000 * commission / 100).toLocaleString()}` },
                { label: 'Commission Rate', value: `${commission}%` },
              ].map((m, i) => (
                <div key={i} style={{
                  background: i === 2 ? 'rgba(255,255,255,0.08)' : 'var(--surface)',
                  padding: '24px 24px',
                  border: i === 2 ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.08)',
                }}>
                  <p className="label-caps" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, marginBottom: 8 }}>{m.label}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: i === 2 ? '#FFFFFF' : '#FFFFFF' }}>{m.value}</p>
                </div>
              ))}
            </div>

            {/* Commission breakdown table */}
            <div style={{ background: 'var(--surface)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, color: '#FFFFFF' }}>
                  Booking Commission Breakdown
                </h3>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    {['Booking ID', 'Customer', 'Amount', 'Partner', 'Commission', 'Payout', 'Status'].map(h => (
                      <th key={h} style={{
                        padding: '10px 16px', textAlign: 'left',
                        fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => {
                    const comm = Math.round(b.amount * commission / 100)
                    const payout = b.amount - comm
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 600 }}>{b.id}</td>
                        <td style={{ padding: '12px 16px', color: '#FFFFFF' }}>{b.customer}</td>
                        <td style={{ padding: '12px 16px', color: '#FFFFFF' }}>ETB {b.amount.toLocaleString()}</td>
                        <td style={{ padding: '12px 16px', color: 'rgba(255,255,255,0.75)' }}>{b.partner}</td>
                        <td style={{ padding: '12px 16px', color: '#FFFFFF', fontWeight: 600 }}>ETB {comm.toLocaleString()}</td>
                        <td style={{ padding: '12px 16px', color: 'rgba(247,245,240,0.7)' }}>ETB {payout.toLocaleString()}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontSize: 10, color: statusColors[b.status],
                            border: `1px solid ${statusColors[b.status]}`,
                            padding: '3px 8px',
                          }}>{b.status}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ borderTop: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.03)' }}>
                    <td colSpan={2} style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 600 }}>Total</td>
                    <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 700 }}>ETB {totalRevenue.toLocaleString()}</td>
                    <td />
                    <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 700 }}>ETB {totalCommission.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', color: '#FFFFFF', fontWeight: 700 }}>ETB {(totalRevenue - totalCommission).toLocaleString()}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Partners view */}
        {view === 'partners' && (
          <div>
            <p className="label-caps" style={{ color: '#FFFFFF', marginBottom: 6, fontSize: 10 }}>Network</p>
            <h1 style={{
              fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 32,
              background: 'var(--gold-gradient-h)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Partner Management</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              {[
                { name: 'Elite Cars', type: 'Vehicle Owner', vehicles: 4, drivers: 5, status: 'Active', trips: 89, rating: 4.9 },
                { name: 'Royal Fleet', type: 'Transport Company', vehicles: 8, drivers: 10, status: 'Active', trips: 134, rating: 4.8 },
                { name: 'Diplomat Cars', type: 'Transport Company', vehicles: 6, drivers: 7, status: 'Active', trips: 67, rating: 4.9 },
                { name: 'City Tours Co.', type: 'Tour Operator', vehicles: 3, drivers: 4, status: 'Active', trips: 43, rating: 4.7 },
                { name: 'Events Fleet', type: 'Events Transport', vehicles: 5, drivers: 6, status: 'Active', trips: 22, rating: 4.8 },
                { name: 'Sunrise Rides', type: 'Vehicle Owner', vehicles: 2, drivers: 3, status: 'Pending', trips: 0, rating: 0 },
              ].map((p, i) => (
                <div key={i} style={{ background: 'var(--surface-2)', padding: '28px 28px', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>{p.name}</h3>
                      <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.70)' }}>{p.type}</p>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 600,
                      color: p.status === 'Active' ? '#4CAF50' : '#FFFFFF',
                      border: `1px solid ${p.status === 'Active' ? '#4CAF50' : '#FFFFFF'}`,
                      padding: '3px 10px',
                    }}>{p.status}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 20 }}>
                    {[
                      ['Vehicles', p.vehicles],
                      ['Drivers', p.drivers],
                      ['Trips', p.trips],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{k}</p>
                        <p style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', color: '#FFFFFF' }}>{v}</p>
                      </div>
                    ))}
                  </div>
                  {p.rating > 0 && (
                    <p style={{ marginTop: 16, fontSize: 12, color: '#FFFFFF' }}>★ {p.rating} rating</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
