import { useMemo, useState } from 'react'
import type { Page } from '@/app/routes'
import { useMediaQuery } from '@/hooks'
import { initialsOf } from '@/lib/utils'
import { datedFilename, downloadCsv, toCsv } from '../csv'
import { formatDate, formatETB, timeAgo } from '../format'
import { deriveCustomers, serviceLabel } from '../selectors'
import { adminActions, notify, useAdminStore } from '../store'
import type { Customer } from '../types'
import EmptyState from '../ui/EmptyState'
import FilterTabs from '../ui/FilterTabs'
import Icon from '../ui/Icon'
import PageHeader from '../ui/PageHeader'
import SearchField from '../ui/SearchField'
import { buttonSecondary, cellPrimary, cellSecondary, panel, tabular, td, th } from '../ui/styles'

type Sort = 'spend' | 'recent' | 'trips'

interface CustomersViewProps {
  navigate: (page: Page) => void
}

export default function CustomersView({ navigate }: CustomersViewProps) {
  const state = useAdminStore()
  const wide = useMediaQuery('(min-width: 900px)')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>('spend')

  const customers = useMemo(() => deriveCustomers(state.bookings), [state.bookings])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return customers
      .filter((c) => !q || `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q))
      .sort((a, b) =>
        sort === 'spend'
          ? b.totalSpend - a.totalSpend
          : sort === 'trips'
            ? b.trips - a.trips
            : b.lastTripAt.localeCompare(a.lastTripAt),
      )
  }, [customers, query, sort])

  const repeat = customers.filter((c) => c.trips > 1).length

  // A customer's bookings are one search away in the bookings list.
  const viewBookings = (c: Customer) => {
    adminActions.setBookingQuery(c.email)
    navigate('admin-bookings')
  }

  const exportCsv = () => {
    const csv = toCsv(rows, [
      { header: 'Name', value: (c) => c.name },
      { header: 'Email', value: (c) => c.email },
      { header: 'Phone', value: (c) => c.phone },
      { header: 'Bookings', value: (c) => c.trips },
      { header: 'Completed trips', value: (c) => c.completedTrips },
      { header: 'Total spend (ETB)', value: (c) => c.totalSpend },
      { header: 'Most booked', value: (c) => serviceLabel(c.topService) },
      { header: 'Last trip', value: (c) => formatDate(c.lastTripAt) },
    ])
    downloadCsv(datedFilename('customers'), csv)
    notify(`Exported ${rows.length} customers`, 'good')
  }

  return (
    <>
      <PageHeader
        title="Customers"
        description={`${customers.length} customers · ${repeat} have booked more than once`}
        actions={
          <button onClick={exportCsv} disabled={rows.length === 0} className="admin-btn-secondary" style={buttonSecondary}>
            <Icon name="download" size={16} />
            Export CSV
          </button>
        }
      />

      <section style={{ ...panel, overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', padding: 14, borderBottom: '1px solid var(--admin-hairline)' }}>
          <SearchField value={query} onChange={setQuery} placeholder="Search name, email or phone" style={{ flex: '1 1 240px', maxWidth: 380 }} />
          <div style={{ marginLeft: 'auto' }}>
            <FilterTabs
              label="Sort customers"
              value={sort}
              onChange={setSort}
              tabs={[
                { id: 'spend', label: 'Top spend' },
                { id: 'trips', label: 'Most trips' },
                { id: 'recent', label: 'Recent' },
              ]}
            />
          </div>
        </div>

        {rows.length === 0 ? (
          <EmptyState icon="customers" title="No customers match" />
        ) : wide ? (
          <div className="admin-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 820 }}>
              <thead>
                <tr>
                  <th style={th}>Customer</th>
                  <th style={th}>Phone</th>
                  <th style={{ ...th, textAlign: 'right' }}>Bookings</th>
                  <th style={{ ...th, textAlign: 'right' }}>Total spend</th>
                  <th style={th}>Most booked</th>
                  <th style={th}>Last trip</th>
                  <th style={{ ...th, width: 36 }}><span className="sr-only">Bookings</span></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((c) => (
                  <tr
                    key={c.email}
                    className="admin-row"
                    tabIndex={0}
                    onClick={() => viewBookings(c)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), viewBookings(c))}
                    aria-label={`View bookings for ${c.name}`}
                  >
                    <td style={td}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <Avatar name={c.name} />
                        <span style={{ minWidth: 0 }}>
                          <span style={cellPrimary}>{c.name}</span>
                          <span style={cellSecondary}>{c.email}</span>
                        </span>
                      </span>
                    </td>
                    <td style={{ ...td, whiteSpace: 'nowrap', ...tabular }}>{c.phone}</td>
                    <td style={{ ...td, textAlign: 'right', ...tabular }}>
                      {c.trips}
                      {c.trips > c.completedTrips && <span style={cellSecondary}>{c.completedTrips} completed</span>}
                    </td>
                    <td style={{ ...td, textAlign: 'right', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', ...tabular }}>{formatETB(c.totalSpend)}</td>
                    <td style={td}>{serviceLabel(c.topService)}</td>
                    <td style={{ ...td, whiteSpace: 'nowrap' }}>
                      <span style={{ color: '#FFFFFF' }}>{formatDate(c.lastTripAt)}</span>
                      <span style={cellSecondary}>first booked {timeAgo(c.firstBookedAt)}</span>
                    </td>
                    <td style={{ ...td, color: 'var(--admin-text-faint)' }}><Icon name="chevronRight" size={16} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {rows.map((c) => (
              <li key={c.email}>
                <button
                  onClick={() => viewBookings(c)}
                  className="admin-row"
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left', color: 'inherit', fontFamily: 'var(--font-body)' }}
                >
                  <Avatar name={c.name} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{ fontSize: 14.5, fontWeight: 600, color: '#FFFFFF' }}>{c.name}</span>
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', ...tabular }}>{formatETB(c.totalSpend)}</span>
                    </span>
                    <span style={{ display: 'block', fontSize: 12.5, color: 'var(--admin-text-muted)', marginTop: 3 }}>
                      {c.trips} booking{c.trips === 1 ? '' : 's'} · {serviceLabel(c.topService)} · last {formatDate(c.lastTripAt)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

function Avatar({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 36,
        height: 36,
        flexShrink: 0,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid var(--admin-hairline-strong)',
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: 700,
        color: '#FFFFFF',
      }}
    >
      {initialsOf(name)}
    </span>
  )
}
