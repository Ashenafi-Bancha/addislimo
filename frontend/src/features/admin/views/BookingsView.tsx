import { useMemo, useState, type KeyboardEvent } from 'react'
import { useMediaQuery } from '@/hooks'
import type { Booking, BookingStatus } from '@/types'
import { datedFilename, downloadCsv, toCsv } from '../csv'
import { formatDate, formatETB, formatTime } from '../format'
import { BOOKING_STATUSES, countByStatus, indexById, OPEN_STATUSES, serviceLabel, startOfDay } from '../selectors'
import { bookingStatusMeta } from '../status'
import { adminActions, notify, useAdminStore } from '../store'
import EmptyState from '../ui/EmptyState'
import FilterTabs from '../ui/FilterTabs'
import Icon from '../ui/Icon'
import PageHeader from '../ui/PageHeader'
import SearchField from '../ui/SearchField'
import StatusBadge from '../ui/StatusBadge'
import {
  buttonSecondary,
  cellPrimary,
  cellSecondary,
  panel,
  select,
  tabular,
  td,
  th,
} from '../ui/styles'

type StatusFilter = 'all' | 'open' | BookingStatus
type Scope = 'all' | 'today' | 'upcoming' | 'past'

const scopeLabels: Record<Scope, string> = {
  all: 'Any date',
  today: 'Today',
  upcoming: 'Upcoming',
  past: 'Past',
}

export default function BookingsView() {
  const state = useAdminStore()
  const wide = useMediaQuery('(min-width: 900px)')
  const [status, setStatus] = useState<StatusFilter>('open')
  const [scope, setScope] = useState<Scope>('all')
  const [newestFirst, setNewestFirst] = useState(false)

  const query = state.bookingQuery
  const setQuery = adminActions.setBookingQuery

  const partners = useMemo(() => indexById(state.partners), [state.partners])
  const drivers = useMemo(() => indexById(state.drivers), [state.drivers])

  // Search and date scope narrow the list first; status counts reflect that.
  const scoped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const todayStart = startOfDay().getTime()
    const tomorrowStart = todayStart + 24 * 60 * 60 * 1000

    return state.bookings.filter((b) => {
      const t = new Date(b.scheduledAt).getTime()
      if (scope === 'today' && (t < todayStart || t >= tomorrowStart)) return false
      if (scope === 'upcoming' && t < Date.now()) return false
      if (scope === 'past' && t >= Date.now()) return false
      if (!q) return true
      const driver = b.driverId ? drivers.get(b.driverId)?.name ?? '' : ''
      return [b.id, b.customerName, b.customerEmail, b.customerPhone, b.pickup, b.destination, driver, serviceLabel(b.serviceId), partners.get(b.partnerId)?.name ?? '']
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [state.bookings, query, scope, drivers, partners])

  const counts = useMemo(() => countByStatus(scoped), [scoped])
  const openCount = scoped.filter((b) => OPEN_STATUSES.has(b.status)).length

  const rows = useMemo(() => {
    const filtered = scoped.filter((b) =>
      status === 'all' ? true : status === 'open' ? OPEN_STATUSES.has(b.status) : b.status === status,
    )
    return filtered.sort((a, b) =>
      newestFirst ? b.scheduledAt.localeCompare(a.scheduledAt) : a.scheduledAt.localeCompare(b.scheduledAt),
    )
  }, [scoped, status, newestFirst])

  const tabs = [
    { id: 'open' as const, label: 'Open', count: openCount },
    { id: 'all' as const, label: 'All', count: scoped.length },
    ...BOOKING_STATUSES.map((s) => ({ id: s, label: s, count: counts[s] })),
  ]

  const exportCsv = () => {
    const csv = toCsv(rows, [
      { header: 'Reference', value: (b) => b.id },
      { header: 'Status', value: (b) => b.status },
      { header: 'Scheduled', value: (b) => `${formatDate(b.scheduledAt)} ${formatTime(b.scheduledAt)}` },
      { header: 'Service', value: (b) => serviceLabel(b.serviceId) },
      { header: 'Customer', value: (b) => b.customerName },
      { header: 'Phone', value: (b) => b.customerPhone },
      { header: 'Email', value: (b) => b.customerEmail },
      { header: 'Pickup', value: (b) => b.pickup },
      { header: 'Destination', value: (b) => b.destination },
      { header: 'Passengers', value: (b) => b.passengers },
      { header: 'Partner', value: (b) => partners.get(b.partnerId)?.name ?? '' },
      { header: 'Driver', value: (b) => (b.driverId ? drivers.get(b.driverId)?.name ?? '' : '') },
      { header: 'Amount (ETB)', value: (b) => b.amount },
      { header: 'Commission (ETB)', value: (b) => b.commission },
    ])
    downloadCsv(datedFilename('bookings'), csv)
    notify(`Exported ${rows.length} booking${rows.length === 1 ? '' : 's'}`, 'good')
  }

  const clearFilters = () => {
    setQuery('')
    setScope('all')
    setStatus('all')
  }

  const pendingTotal = state.bookings.filter((b) => b.status === 'Pending').length

  return (
    <>
      <PageHeader
        title="Bookings"
        description={`${state.bookings.length} bookings · ${pendingTotal} awaiting confirmation`}
        actions={
          <button onClick={exportCsv} disabled={rows.length === 0} className="admin-btn-secondary" style={buttonSecondary}>
            <Icon name="download" size={16} />
            Export CSV
          </button>
        }
      />

      <section style={{ ...panel, overflow: 'hidden' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 14, borderBottom: '1px solid var(--admin-hairline)' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <SearchField
              value={query}
              onChange={setQuery}
              placeholder="Search reference, customer, place or driver"
              label="Search bookings"
              style={{ flex: '1 1 260px' }}
            />
            <select value={scope} onChange={(e) => setScope(e.target.value as Scope)} aria-label="Date range" style={{ ...select, width: 'auto', flex: '0 0 150px' }}>
              {(Object.keys(scopeLabels) as Scope[]).map((s) => (
                <option key={s} value={s}>{scopeLabels[s]}</option>
              ))}
            </select>
            <button
              onClick={() => setNewestFirst((v) => !v)}
              className="admin-btn-secondary"
              style={{ ...buttonSecondary, height: 40, flex: '0 0 auto' }}
              aria-label={newestFirst ? 'Sorted latest first. Switch to earliest first' : 'Sorted earliest first. Switch to latest first'}
            >
              <Icon name={newestFirst ? 'trendDown' : 'trendUp'} size={15} />
              {newestFirst ? 'Latest first' : 'Earliest first'}
            </button>
          </div>
          <FilterTabs tabs={tabs} value={status} onChange={setStatus} label="Filter by status" />
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon="search"
            title="No bookings match"
            description="Try a different search, date range or status."
            action={
              <button onClick={clearFilters} className="admin-btn-secondary" style={buttonSecondary}>
                Clear filters
              </button>
            }
          />
        ) : wide ? (
          <div className="admin-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr>
                  <th style={th}>Booking</th>
                  <th style={th}>Customer</th>
                  <th style={th}>Route</th>
                  <th style={th}>Scheduled</th>
                  <th style={th}>Driver</th>
                  <th style={{ ...th, textAlign: 'right' }}>Amount</th>
                  <th style={th}>Status</th>
                  <th style={{ ...th, width: 36 }}><span className="sr-only">Open</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((b) => (
                  <BookingRow key={b.id} booking={b} driverName={b.driverId ? drivers.get(b.driverId)?.name : undefined} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {rows.map((b) => (
              <BookingCard key={b.id} booking={b} driverName={b.driverId ? drivers.get(b.driverId)?.name : undefined} />
            ))}
          </ul>
        )}

        {rows.length > 0 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--admin-hairline)', fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--admin-text-muted)' }}>
            Showing {rows.length} of {state.bookings.length} bookings
          </div>
        )}
      </section>
    </>
  )
}

function openOnKey(e: KeyboardEvent, id: string) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    adminActions.openBooking(id)
  }
}

function BookingRow({ booking: b, driverName }: { booking: Booking; driverName?: string }) {
  return (
    <tr
      className="admin-row"
      tabIndex={0}
      onClick={() => adminActions.openBooking(b.id)}
      onKeyDown={(e) => openOnKey(e, b.id)}
      aria-label={`Open booking ${b.id} for ${b.customerName}`}
    >
      <td style={td}>
        <span style={{ ...cellPrimary, ...tabular }}>{b.id}</span>
        <span style={cellSecondary}>{serviceLabel(b.serviceId)}</span>
      </td>
      <td style={td}>
        <span style={cellPrimary}>{b.customerName}</span>
        <span style={{ ...cellSecondary, ...tabular }}>{b.customerPhone}</span>
      </td>
      <td style={{ ...td, maxWidth: 260 }}>
        <span style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#FFFFFF' }}>{b.pickup}</span>
        <span style={{ ...cellSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>to {b.destination}</span>
      </td>
      <td style={{ ...td, whiteSpace: 'nowrap' }}>
        <span style={{ ...cellPrimary, ...tabular }}>{formatTime(b.scheduledAt)}</span>
        <span style={cellSecondary}>{formatDate(b.scheduledAt)}</span>
      </td>
      <td style={{ ...td, whiteSpace: 'nowrap' }}>
        {driverName ? (
          <span style={{ color: '#FFFFFF' }}>{driverName}</span>
        ) : (
          <span style={{ color: 'var(--admin-text-muted)', fontStyle: 'italic' }}>Unassigned</span>
        )}
      </td>
      <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap', color: '#FFFFFF', fontWeight: 600, ...tabular }}>{formatETB(b.amount)}</td>
      <td style={td}>
        <StatusBadge label={b.status} meta={bookingStatusMeta[b.status]} size="sm" />
      </td>
      <td style={{ ...td, color: 'var(--admin-text-faint)' }}>
        <Icon name="chevronRight" size={16} />
      </td>
    </tr>
  )
}

function BookingCard({ booking: b, driverName }: { booking: Booking; driverName?: string }) {
  return (
    <li>
      <button
        onClick={() => adminActions.openBooking(b.id)}
        className="admin-row"
        style={{
          width: '100%',
          display: 'block',
          padding: '14px 16px',
          background: 'transparent',
          border: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          textAlign: 'left',
          color: 'inherit',
          fontFamily: 'var(--font-body)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', ...tabular }}>{b.id}</span>
          <StatusBadge label={b.status} meta={bookingStatusMeta[b.status]} size="sm" />
        </span>
        <span style={{ display: 'block', fontSize: 14.5, fontWeight: 600, color: '#FFFFFF', marginTop: 8 }}>{b.customerName}</span>
        <span style={{ display: 'block', fontSize: 12.5, color: 'var(--admin-text-muted)', marginTop: 2 }}>
          {serviceLabel(b.serviceId)} · {b.pickup} to {b.destination}
        </span>
        <span style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 10, fontSize: 12.5 }}>
          <span style={{ color: 'rgba(255,255,255,0.8)', ...tabular }}>
            {formatDate(b.scheduledAt)}, {formatTime(b.scheduledAt)}
            <span style={{ color: 'var(--admin-text-muted)' }}> · {driverName ?? 'Unassigned'}</span>
          </span>
          <span style={{ fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', ...tabular }}>{formatETB(b.amount)}</span>
        </span>
      </button>
    </li>
  )
}
