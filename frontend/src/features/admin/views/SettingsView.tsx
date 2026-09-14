import { useState, type ReactNode } from 'react'
import { contact, site } from '@/config/site'
import { formatETB } from '../format'
import type { AdminSession } from '../session'
import { adminActions, notify, useAdminStore } from '../store'
import type { AdminSettings } from '../types'
import Icon from '../ui/Icon'
import PageHeader from '../ui/PageHeader'
import { buttonDanger, buttonPrimary, input, panel, panelHeader, panelSubtitle, panelTitle, tabular } from '../ui/styles'

interface SettingsViewProps {
  session: AdminSession
  onSignOut: () => void
}

export default function SettingsView({ session, onSignOut }: SettingsViewProps) {
  const { settings } = useAdminStore()
  const [rate, setRate] = useState(settings.defaultCommissionRate)
  const rateChanged = rate !== settings.defaultCommissionRate
  const example = 10000
  const exampleCommission = Math.round((example * rate) / 100)

  const saveRate = () => {
    adminActions.updateSettings({ defaultCommissionRate: rate })
    notify(`Default commission set to ${rate}%`, 'good')
  }

  const toggle = (key: keyof Pick<AdminSettings, 'notifyNewBooking' | 'notifyCancellation' | 'dailySummary'>, label: string) => {
    const next = !settings[key]
    adminActions.updateSettings({ [key]: next })
    notify(`${label} ${next ? 'on' : 'off'}`)
  }

  return (
    <>
      <PageHeader title="Settings" description="Pricing defaults, notifications and your account." />

      <div style={{ display: 'grid', gap: 16, maxWidth: 860 }}>
        {/* Commission */}
        <Panel title="Default commission" subtitle="The rate new partners start on. Partners with a negotiated rate keep it, and past bookings keep the rate they were priced at.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              aria-label="Default commission rate"
              style={{ flex: '1 1 240px', accentColor: '#FFFFFF' }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="number"
                min={5}
                max={30}
                value={rate}
                onChange={(e) => setRate(Math.min(30, Math.max(5, Number(e.target.value) || 5)))}
                aria-label="Commission percentage"
                className="admin-input"
                style={{ ...input, width: 76, textAlign: 'right', ...tabular }}
              />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--admin-text-muted)' }}>%</span>
            </div>
          </div>

          <div
            style={{
              marginTop: 16,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 10,
            }}
          >
            {[
              { label: 'Example booking', value: formatETB(example) },
              { label: `Addis Limo keeps (${rate}%)`, value: formatETB(exampleCommission) },
              { label: `Partner receives (${100 - rate}%)`, value: formatETB(example - exampleCommission) },
            ].map((c) => (
              <div key={c.label} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--admin-hairline)' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--admin-text-muted)' }}>{c.label}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 700, color: '#FFFFFF', marginTop: 4, ...tabular }}>{c.value}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            {rateChanged && (
              <button onClick={() => setRate(settings.defaultCommissionRate)} className="admin-btn-ghost" style={{ ...buttonPrimary, background: 'transparent', color: 'rgba(255,255,255,0.8)', boxShadow: 'none', border: '1px solid transparent' }}>
                Reset
              </button>
            )}
            <button onClick={saveRate} disabled={!rateChanged} className="admin-btn" style={buttonPrimary}>
              Save commission
            </button>
          </div>
        </Panel>

        {/* Notifications */}
        <Panel title="Notifications" subtitle="Emails sent to the operations inbox once the booking system is connected.">
          <Toggle label="New booking received" description="An email for every booking made on the website." checked={settings.notifyNewBooking} onChange={() => toggle('notifyNewBooking', 'New booking emails')} />
          <Toggle label="Cancellations" description="An email when a customer or admin cancels a trip." checked={settings.notifyCancellation} onChange={() => toggle('notifyCancellation', 'Cancellation emails')} />
          <Toggle label="Daily summary" description="Tomorrow's schedule and anything unassigned, every evening at 18:00." checked={settings.dailySummary} onChange={() => toggle('dailySummary', 'Daily summary')} last />
        </Panel>

        {/* Business profile */}
        <Panel title="Business profile" subtitle="Shown on the public website. Ask your developer to change these details.">
          <dl style={{ margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px 20px' }}>
            {[
              ['Business name', site.name],
              ['Email', contact.email],
              ['Phone', contact.phone],
              ['Address', contact.address],
              ['Hours', contact.hours],
              ['Currency', site.currency],
            ].map(([k, v]) => (
              <div key={k}>
                <dt style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--admin-text-muted)' }}>{k}</dt>
                <dd style={{ margin: '3px 0 0', fontFamily: 'var(--font-body)', fontSize: 14, color: '#FFFFFF' }}>{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>

        {/* Account */}
        <Panel title="Account" subtitle="You are signed in for this browser session.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <span style={{ width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.07)', border: '1px solid var(--admin-hairline-strong)', color: '#FFFFFF' }}>
              <Icon name="user" size={20} />
            </span>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, fontWeight: 700, color: '#FFFFFF' }}>{session.name}</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--admin-text-muted)' }}>{session.email} · {session.role}</div>
            </div>
            <button onClick={onSignOut} className="admin-btn-danger" style={buttonDanger}>
              <Icon name="logout" size={15} />
              Sign out
            </button>
          </div>
        </Panel>
      </div>
    </>
  )
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section style={panel}>
      <div style={panelHeader}>
        <div>
          <h2 style={panelTitle}>{title}</h2>
          <p style={panelSubtitle}>{subtitle}</p>
        </div>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </section>
  )
}

function Toggle({ label, description, checked, onChange, last }: { label: string; description: string; checked: boolean; onChange: () => void; last?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 0', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.05)' }}>
      <div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: '#FFFFFF' }}>{label}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--admin-text-muted)', marginTop: 2 }}>{description}</div>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        style={{
          position: 'relative',
          width: 44,
          height: 24,
          flexShrink: 0,
          borderRadius: 999,
          border: `1px solid ${checked ? 'transparent' : 'var(--admin-hairline-strong)'}`,
          background: checked ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 22 : 2,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: checked ? '#060606' : 'rgba(255,255,255,0.75)',
            transition: 'left 0.15s',
          }}
        />
      </button>
    </div>
  )
}
