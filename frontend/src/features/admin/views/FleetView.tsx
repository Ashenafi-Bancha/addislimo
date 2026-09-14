import { useMemo, useState } from 'react'
import { useMediaQuery } from '@/hooks'
import { vehicleOptions } from '@/features/booking/booking.data'
import { driverStatuses, indexById, REVENUE_STATUSES, vehicleLabel, vehicleStatuses } from '../selectors'
import { driverStatusMeta, vehicleStatusMeta } from '../status'
import { useAdminStore } from '../store'
import type { DriverStatus, VehicleStatus } from '../types'
import EmptyState from '../ui/EmptyState'
import FilterTabs from '../ui/FilterTabs'
import Icon from '../ui/Icon'
import PageHeader from '../ui/PageHeader'
import SearchField from '../ui/SearchField'
import StatusBadge, { Glyph } from '../ui/StatusBadge'
import { toneColor } from '../status'
import { cellPrimary, cellSecondary, panel, tabular, td, th } from '../ui/styles'

type Tab = 'vehicles' | 'drivers'

const classLabels = new Map(vehicleOptions.map((v) => [v.id, v.label]))

export default function FleetView() {
  const state = useAdminStore()
  const wide = useMediaQuery('(min-width: 900px)')
  const [tab, setTab] = useState<Tab>('vehicles')
  const [query, setQuery] = useState('')

  const partners = useMemo(() => indexById(state.partners), [state.partners])
  const vStatus = useMemo(() => vehicleStatuses(state), [state])
  const dStatus = useMemo(() => driverStatuses(state), [state])

  const tripsByDriver = useMemo(() => {
    const m = new Map<string, number>()
    for (const b of state.bookings) {
      if (b.driverId && REVENUE_STATUSES.has(b.status)) m.set(b.driverId, (m.get(b.driverId) ?? 0) + 1)
    }
    return m
  }, [state.bookings])

  const q = query.trim().toLowerCase()

  const vehicles = useMemo(
    () =>
      state.vehicles.filter(
        (v) => !q || `${vehicleLabel(v)} ${v.plate} ${partners.get(v.partnerId)?.name ?? ''}`.toLowerCase().includes(q),
      ),
    [state.vehicles, q, partners],
  )

  const drivers = useMemo(
    () =>
      state.drivers.filter(
        (d) => !q || `${d.name} ${d.phone} ${d.licenceNo} ${partners.get(d.partnerId)?.name ?? ''}`.toLowerCase().includes(q),
      ),
    [state.drivers, q, partners],
  )

  const vehicleSummary = useMemo(() => tally(state.vehicles.map((v) => vStatus.get(v.id)!), ['Available', 'On Trip', 'Maintenance']), [state.vehicles, vStatus])
  const driverSummary = useMemo(() => tally(state.drivers.map((d) => dStatus.get(d.id)!), ['Available', 'On Trip', 'Off Duty']), [state.drivers, dStatus])

  return (
    <>
      <PageHeader
        title="Fleet & Drivers"
        description={`${state.vehicles.length} vehicles and ${state.drivers.length} drivers across ${state.partners.length} partners`}
      />

      {/* Availability at a glance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 16 }}>
        <Summary title="Vehicles" icon="car" items={vehicleSummary.map(([s, n]) => ({ label: s, n, meta: vehicleStatusMeta[s as VehicleStatus] }))} />
        <Summary title="Drivers" icon="users" items={driverSummary.map(([s, n]) => ({ label: s, n, meta: driverStatusMeta[s as DriverStatus] }))} />
      </div>

      <section style={{ ...panel, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', padding: 14, borderBottom: '1px solid var(--admin-hairline)' }}>
          <FilterTabs
            label="Fleet list"
            value={tab}
            onChange={setTab}
            tabs={[
              { id: 'vehicles', label: 'Vehicles', count: vehicles.length },
              { id: 'drivers', label: 'Drivers', count: drivers.length },
            ]}
          />
          <SearchField
            value={query}
            onChange={setQuery}
            placeholder={tab === 'vehicles' ? 'Search model, plate or partner' : 'Search name, phone or licence'}
            style={{ flex: '1 1 220px', maxWidth: 360, marginLeft: 'auto' }}
          />
        </div>

        {tab === 'vehicles' ? (
          vehicles.length === 0 ? (
            <EmptyState icon="car" title="No vehicles match" />
          ) : wide ? (
            <div className="admin-table-wrap">
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
                <thead>
                  <tr>
                    <th style={th}>Vehicle</th>
                    <th style={th}>Plate</th>
                    <th style={th}>Class</th>
                    <th style={{ ...th, textAlign: 'right' }}>Seats</th>
                    <th style={th}>Partner</th>
                    <th style={th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => {
                    const s = vStatus.get(v.id)!
                    return (
                      <tr key={v.id}>
                        <td style={td}>
                          <span style={cellPrimary}>{vehicleLabel(v)}</span>
                          <span style={cellSecondary}>{v.year}</span>
                        </td>
                        <td style={{ ...td, ...tabular, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{v.plate}</td>
                        <td style={td}>{classLabels.get(v.vehicleClass) ?? v.vehicleClass}</td>
                        <td style={{ ...td, textAlign: 'right', ...tabular }}>{v.seats}</td>
                        <td style={td}>{partners.get(v.partnerId)?.name}</td>
                        <td style={td}><StatusBadge label={s} meta={vehicleStatusMeta[s]} size="sm" /></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {vehicles.map((v) => {
                const s = vStatus.get(v.id)!
                return (
                  <li key={v.id} style={mobileItem}>
                    <span style={mobileTop}>
                      <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{vehicleLabel(v)}</span>
                      <StatusBadge label={s} meta={vehicleStatusMeta[s]} size="sm" />
                    </span>
                    <span style={mobileSub}>
                      <span style={tabular}>{v.plate}</span> · {classLabels.get(v.vehicleClass)} · {v.seats} seats
                    </span>
                    <span style={mobileSub}>{partners.get(v.partnerId)?.name} · {v.year}</span>
                  </li>
                )
              })}
            </ul>
          )
        ) : drivers.length === 0 ? (
          <EmptyState icon="users" title="No drivers match" />
        ) : wide ? (
          <div className="admin-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr>
                  <th style={th}>Driver</th>
                  <th style={th}>Phone</th>
                  <th style={th}>Partner</th>
                  <th style={{ ...th, textAlign: 'right' }}>Trips</th>
                  <th style={{ ...th, textAlign: 'right' }}>Rating</th>
                  <th style={th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((d) => {
                  const s = dStatus.get(d.id)!
                  return (
                    <tr key={d.id}>
                      <td style={td}>
                        <span style={cellPrimary}>{d.name}</span>
                        <span style={{ ...cellSecondary, ...tabular }}>{d.licenceNo}</span>
                      </td>
                      <td style={{ ...td, whiteSpace: 'nowrap', ...tabular }}>
                        <a href={`tel:${d.phone.replace(/\s/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{d.phone}</a>
                      </td>
                      <td style={td}>{partners.get(d.partnerId)?.name}</td>
                      <td style={{ ...td, textAlign: 'right', ...tabular }}>{tripsByDriver.get(d.id) ?? 0}</td>
                      <td style={{ ...td, textAlign: 'right', ...tabular }}>{d.rating > 0 ? d.rating.toFixed(1) : 'New'}</td>
                      <td style={td}><StatusBadge label={s} meta={driverStatusMeta[s]} size="sm" /></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {drivers.map((d) => {
              const s = dStatus.get(d.id)!
              return (
                <li key={d.id} style={mobileItem}>
                  <span style={mobileTop}>
                    <span style={{ fontWeight: 700, color: '#FFFFFF' }}>{d.name}</span>
                    <StatusBadge label={s} meta={driverStatusMeta[s]} size="sm" />
                  </span>
                  <span style={mobileSub}>
                    <a href={`tel:${d.phone.replace(/\s/g, '')}`} style={{ color: 'inherit', textDecoration: 'none', ...tabular }}>{d.phone}</a> · {partners.get(d.partnerId)?.name}
                  </span>
                  <span style={mobileSub}>
                    {tripsByDriver.get(d.id) ?? 0} trips · {d.rating > 0 ? `${d.rating.toFixed(1)} rating` : 'New driver'}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </>
  )
}

function tally(statuses: string[], order: string[]): [string, number][] {
  return order.map((s) => [s, statuses.filter((x) => x === s).length])
}

function Summary({
  title,
  icon,
  items,
}: {
  title: string
  icon: 'car' | 'users'
  items: { label: string; n: number; meta: { tone: keyof typeof toneColor; glyph: Parameters<typeof Glyph>[0]['glyph'] } }[]
}) {
  const total = items.reduce((sum, i) => sum + i.n, 0)
  return (
    <div style={{ ...panel, padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon name={icon} size={16} style={{ color: 'var(--admin-text-muted)' }} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: '#FFFFFF' }}>{title}</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--admin-text-muted)', ...tabular }}>{total} total</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))`, gap: 8 }}>
        {items.map((i) => (
          <div key={i.label}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 700, color: '#FFFFFF', lineHeight: 1.1, ...tabular }}>{i.n}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
              <Glyph glyph={i.meta.glyph} color={toneColor[i.meta.tone]} size={10} />
              {i.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const mobileItem = {
  display: 'grid',
  gap: 4,
  padding: '14px 16px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  fontFamily: 'var(--font-body)',
}

const mobileTop = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, fontSize: 14.5 }

const mobileSub = { display: 'block', fontSize: 12.5, color: 'var(--admin-text-muted)' }
