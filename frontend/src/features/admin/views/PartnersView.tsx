import { useMemo, useState } from 'react'
import { formatCompactETB, timeAgo } from '../format'
import { comparisonWindows, partnerPerformance, type PartnerPerformance } from '../selectors'
import { partnerStatusMeta } from '../status'
import { adminActions, notify, useAdminStore } from '../store'
import type { PartnerStatus } from '../types'
import EmptyState from '../ui/EmptyState'
import FilterTabs from '../ui/FilterTabs'
import Icon from '../ui/Icon'
import PageHeader from '../ui/PageHeader'
import SearchField from '../ui/SearchField'
import StatusBadge from '../ui/StatusBadge'
import { buttonDanger, buttonGhost, buttonPrimary, buttonSecondary, panel, tabular } from '../ui/styles'

type Filter = 'all' | PartnerStatus

export default function PartnersView() {
  const state = useAdminStore()
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  const performance = useMemo(() => {
    const { current } = comparisonWindows(30)
    return partnerPerformance(state, current[0], current[1])
  }, [state])

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: state.partners.length, Active: 0, Pending: 0, Suspended: 0 }
    for (const p of state.partners) c[p.status] += 1
    return c
  }, [state.partners])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return performance
      .filter((p) => filter === 'all' || p.partner.status === filter)
      .filter((p) => !q || `${p.partner.name} ${p.partner.contactName} ${p.partner.type}`.toLowerCase().includes(q))
      // Pending applications first: they are the ones waiting on a decision.
      .sort((a, b) => Number(b.partner.status === 'Pending') - Number(a.partner.status === 'Pending') || b.revenue - a.revenue)
  }, [performance, filter, query])

  return (
    <>
      <PageHeader
        title="Partners"
        description={`${counts.Active} active fleet partners · ${counts.Pending} awaiting approval`}
      />

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
        <FilterTabs
          label="Filter partners by status"
          value={filter}
          onChange={setFilter}
          tabs={[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'Active', label: 'Active', count: counts.Active },
            { id: 'Pending', label: 'Pending', count: counts.Pending },
            { id: 'Suspended', label: 'Suspended', count: counts.Suspended },
          ]}
        />
        <SearchField value={query} onChange={setQuery} placeholder="Search partners" style={{ flex: '1 1 220px', maxWidth: 340, marginLeft: 'auto' }} />
      </div>

      {rows.length === 0 ? (
        <div style={panel}>
          <EmptyState icon="partners" title="No partners match" description="Try another status or search." />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {rows.map((p) => (
            <PartnerCard key={p.partner.id} data={p} />
          ))}
        </div>
      )}
    </>
  )
}

function PartnerCard({ data }: { data: PartnerPerformance }) {
  const { partner, drivers, vehicles, trips, revenue } = data
  const [confirmSuspend, setConfirmSuspend] = useState(false)

  const setStatus = (status: PartnerStatus, message: string, tone: 'good' | 'critical' | 'neutral') => {
    adminActions.setPartnerStatus(partner.id, status)
    notify(message, tone)
    setConfirmSuspend(false)
  }

  return (
    <article style={{ ...panel, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>{partner.name}</h2>
          <p style={{ margin: '3px 0 0', fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--admin-text-muted)' }}>
            {partner.type} · joined {timeAgo(partner.joinedAt)}
          </p>
        </div>
        <StatusBadge label={partner.status} meta={partnerStatusMeta[partner.status]} size="sm" />
      </header>

      <div style={{ display: 'grid', gap: 6, fontFamily: 'var(--font-body)', fontSize: 13 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.85)' }}>
          <Icon name="user" size={14} style={{ color: 'var(--admin-text-faint)' }} />
          {partner.contactName}
        </span>
        <a href={`tel:${partner.phone.replace(/\s/g, '')}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.85)', textDecoration: 'none', ...tabular }}>
          <Icon name="phone" size={14} style={{ color: 'var(--admin-text-faint)' }} />
          {partner.phone}
        </a>
        <a href={`mailto:${partner.email}`} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.85)', textDecoration: 'none', overflowWrap: 'anywhere' }}>
          <Icon name="mail" size={14} style={{ color: 'var(--admin-text-faint)' }} />
          {partner.email}
        </a>
      </div>

      <dl
        style={{
          margin: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: 8,
          padding: '12px 0',
          borderTop: '1px solid var(--admin-hairline)',
          borderBottom: '1px solid var(--admin-hairline)',
        }}
      >
        {[
          ['Vehicles', String(vehicles.length)],
          ['Drivers', String(drivers.length)],
          ['Trips 30d', String(trips)],
          ['Revenue', revenue ? formatCompactETB(revenue).replace('ETB ', '') : '0'],
        ].map(([k, v]) => (
          <div key={k}>
            <dt style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--admin-text-faint)', whiteSpace: 'nowrap' }}>{k}</dt>
            <dd style={{ margin: '3px 0 0', fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: '#FFFFFF', ...tabular }}>{v}</dd>
          </div>
        ))}
      </dl>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--admin-text-muted)' }}>
        <span>
          Commission <strong style={{ color: '#FFFFFF', ...tabular }}>{partner.commissionRate}%</strong>
        </span>
        {partner.rating > 0 ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Icon name="star" size={13} style={{ color: '#FFFFFF' }} />
            <strong style={{ color: '#FFFFFF', ...tabular }}>{partner.rating.toFixed(1)}</strong> rating
          </span>
        ) : (
          <span>No ratings yet</span>
        )}
      </div>

      {/* Actions depend on where the partner is in their lifecycle. */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto' }}>
        {partner.status === 'Pending' && (
          <>
            <button onClick={() => setStatus('Active', `${partner.name} approved`, 'good')} className="admin-btn" style={{ ...buttonPrimary, flex: 1 }}>
              <Icon name="check" size={15} strokeWidth={2} />
              Approve
            </button>
            <button onClick={() => setStatus('Suspended', `${partner.name} declined`, 'critical')} className="admin-btn-danger" style={{ ...buttonDanger, flex: 1 }}>
              Decline
            </button>
          </>
        )}

        {partner.status === 'Active' &&
          (confirmSuspend ? (
            <>
              <button onClick={() => setConfirmSuspend(false)} className="admin-btn-ghost" style={{ ...buttonGhost, flex: 1 }}>Keep active</button>
              <button onClick={() => setStatus('Suspended', `${partner.name} suspended`, 'critical')} className="admin-btn-danger" style={{ ...buttonDanger, flex: 1 }}>
                Confirm suspend
              </button>
            </>
          ) : (
            <button onClick={() => setConfirmSuspend(true)} className="admin-btn-ghost" style={{ ...buttonGhost, flex: 1, justifyContent: 'center' }}>
              Suspend partner
            </button>
          ))}

        {partner.status === 'Suspended' && (
          <button onClick={() => setStatus('Active', `${partner.name} reinstated`, 'good')} className="admin-btn-secondary" style={{ ...buttonSecondary, flex: 1 }}>
            Reinstate
          </button>
        )}
      </div>
    </article>
  )
}
