import { useMemo, useState } from 'react'
import type { Page } from '@/app/routes'
import { useMediaQuery } from '@/hooks'
import { datedFilename, downloadCsv, toCsv } from '../csv'
import { formatETB } from '../format'
import { comparisonWindows, partnerPerformance, percentChange, totalsBetween } from '../selectors'
import { notify, useAdminStore } from '../store'
import EmptyState from '../ui/EmptyState'
import FilterTabs from '../ui/FilterTabs'
import Icon from '../ui/Icon'
import PageHeader from '../ui/PageHeader'
import StatTile from '../ui/StatTile'
import { buttonSecondary, cellPrimary, cellSecondary, panel, panelHeader, panelSubtitle, panelTitle, tabular, td, th } from '../ui/styles'

type Period = '7' | '30' | 'all'

const periodLabel: Record<Period, string> = { '7': 'Last 7 days', '30': 'Last 30 days', all: 'All time' }

interface FinanceViewProps {
  navigate: (page: Page) => void
}

export default function FinanceView({ navigate }: FinanceViewProps) {
  const state = useAdminStore()
  const wide = useMediaQuery('(min-width: 900px)')
  const [period, setPeriod] = useState<Period>('30')

  const { totals, deltas, payouts } = useMemo(() => {
    if (period === 'all') {
      const start = new Date(0)
      const end = new Date(8640000000000000)
      const t = totalsBetween(state.bookings, start, end)
      return {
        totals: t,
        deltas: null,
        payouts: partnerPerformance(state).filter((p) => p.trips > 0),
      }
    }
    const days = Number(period)
    const { current, previous } = comparisonWindows(days)
    const now = totalsBetween(state.bookings, current[0], current[1])
    const before = totalsBetween(state.bookings, previous[0], previous[1])
    return {
      totals: now,
      deltas: {
        revenue: percentChange(now.revenue, before.revenue),
        commission: percentChange(now.commission, before.commission),
        payout: percentChange(now.revenue - now.commission, before.revenue - before.commission),
        average: percentChange(now.trips ? now.revenue / now.trips : 0, before.trips ? before.revenue / before.trips : 0),
      },
      payouts: partnerPerformance(state, current[0], current[1]).filter((p) => p.trips > 0),
    }
  }, [state, period])

  const sorted = [...payouts].sort((a, b) => b.revenue - a.revenue)
  const payoutTotal = totals.revenue - totals.commission
  const average = totals.trips ? Math.round(totals.revenue / totals.trips) : 0
  const comparedTo = period === '7' ? 'previous 7 days' : 'previous 30 days'
  const effectiveRate = totals.revenue ? Math.round((totals.commission / totals.revenue) * 1000) / 10 : 0

  const exportCsv = () => {
    const csv = toCsv(sorted, [
      { header: 'Partner', value: (p) => p.partner.name },
      { header: 'Completed trips', value: (p) => p.trips },
      { header: 'Gross (ETB)', value: (p) => p.revenue },
      { header: 'Commission rate (%)', value: (p) => p.partner.commissionRate },
      { header: 'Commission (ETB)', value: (p) => p.commission },
      { header: 'Payout owed (ETB)', value: (p) => p.revenue - p.commission },
    ])
    downloadCsv(datedFilename(`payouts-${period === 'all' ? 'all-time' : `${period}d`}`), csv)
    notify('Payout report exported', 'good')
  }

  return (
    <>
      <PageHeader
        title="Finance"
        description="Earnings from completed trips and what each partner is owed. Cancelled trips are excluded."
        actions={
          <FilterTabs
            label="Reporting period"
            value={period}
            onChange={setPeriod}
            tabs={(['7', '30', 'all'] as Period[]).map((p) => ({ id: p, label: periodLabel[p] }))}
          />
        }
      />

      <div className="admin-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 16 }}>
        <StatTile label="Gross bookings" value={formatETB(totals.revenue)} icon="finance" delta={deltas?.revenue} comparedTo={comparedTo}
          footnote={deltas ? undefined : <AllTime text={`${totals.trips} completed trips`} />} />
        <StatTile label="Commission earned" value={formatETB(totals.commission)} icon="trendUp" delta={deltas?.commission} comparedTo={comparedTo}
          footnote={deltas ? undefined : <AllTime text={`${effectiveRate}% effective rate`} />} />
        <StatTile label="Owed to partners" value={formatETB(payoutTotal)} icon="partners" delta={deltas?.payout} comparedTo={comparedTo}
          footnote={deltas ? undefined : <AllTime text={`${sorted.length} partners paid`} />} />
        <StatTile label="Average trip value" value={formatETB(average)} icon="bookings" delta={deltas?.average} comparedTo={comparedTo}
          footnote={deltas ? undefined : <AllTime text="Across completed trips" />} />
      </div>

      <section style={{ ...panel, overflow: 'hidden' }} aria-labelledby="fin-payouts">
        <div style={panelHeader}>
          <div>
            <h2 id="fin-payouts" style={panelTitle}>Partner payouts</h2>
            <p style={panelSubtitle}>{periodLabel[period]} · gross minus Addis Limo commission</p>
          </div>
          <button onClick={exportCsv} disabled={sorted.length === 0} className="admin-btn-secondary" style={buttonSecondary}>
            <Icon name="download" size={16} />
            Export
          </button>
        </div>

        {sorted.length === 0 ? (
          <EmptyState icon="finance" title="No completed trips in this period" description="Choose a longer period to see payouts." />
        ) : wide ? (
          <div className="admin-table-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr>
                  <th style={th}>Partner</th>
                  <th style={{ ...th, textAlign: 'right' }}>Trips</th>
                  <th style={{ ...th, textAlign: 'right' }}>Gross</th>
                  <th style={{ ...th, textAlign: 'right' }}>Rate</th>
                  <th style={{ ...th, textAlign: 'right' }}>Commission</th>
                  <th style={{ ...th, textAlign: 'right' }}>Payout owed</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((p) => (
                  <tr key={p.partner.id}>
                    <td style={td}>
                      <span style={cellPrimary}>{p.partner.name}</span>
                      <span style={cellSecondary}>{p.partner.contactName}</span>
                    </td>
                    <td style={{ ...td, textAlign: 'right', ...tabular }}>{p.trips}</td>
                    <td style={{ ...td, textAlign: 'right', ...tabular }}>{formatETB(p.revenue)}</td>
                    <td style={{ ...td, textAlign: 'right', ...tabular }}>{p.partner.commissionRate}%</td>
                    <td style={{ ...td, textAlign: 'right', ...tabular }}>{formatETB(p.commission)}</td>
                    <td style={{ ...td, textAlign: 'right', color: '#FFFFFF', fontWeight: 700, ...tabular }}>{formatETB(p.revenue - p.commission)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td style={{ ...td, fontWeight: 700, color: '#FFFFFF', borderBottom: 'none', background: 'rgba(255,255,255,0.03)' }}>Total</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 700, color: '#FFFFFF', borderBottom: 'none', background: 'rgba(255,255,255,0.03)', ...tabular }}>{totals.trips}</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 700, color: '#FFFFFF', borderBottom: 'none', background: 'rgba(255,255,255,0.03)', ...tabular }}>{formatETB(totals.revenue)}</td>
                  <td style={{ ...td, textAlign: 'right', color: 'var(--admin-text-muted)', borderBottom: 'none', background: 'rgba(255,255,255,0.03)', ...tabular }}>{effectiveRate}%</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 700, color: '#FFFFFF', borderBottom: 'none', background: 'rgba(255,255,255,0.03)', ...tabular }}>{formatETB(totals.commission)}</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 700, color: '#FFFFFF', borderBottom: 'none', background: 'rgba(255,255,255,0.03)', ...tabular }}>{formatETB(payoutTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {sorted.map((p) => (
              <li key={p.partner.id} style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'var(--font-body)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600, color: '#FFFFFF' }}>{p.partner.name}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', ...tabular }}>{formatETB(p.revenue - p.commission)}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--admin-text-muted)', marginTop: 4, ...tabular }}>
                  {p.trips} trips · {formatETB(p.revenue)} gross · {formatETB(p.commission)} at {p.partner.commissionRate}%
                </div>
              </li>
            ))}
            <li style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-body)', fontWeight: 700, color: '#FFFFFF', background: 'rgba(255,255,255,0.03)' }}>
              <span>Total owed</span>
              <span style={tabular}>{formatETB(payoutTotal)}</span>
            </li>
          </ul>
        )}
      </section>

      <p style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 2px 0', fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--admin-text-muted)' }}>
        <Icon name="sliders" size={14} />
        New partners start on the default commission of {state.settings.defaultCommissionRate}%.
        <button onClick={() => navigate('admin-settings')} style={{ background: 'none', border: 'none', padding: 0, color: '#FFFFFF', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', font: 'inherit' }}>
          Change in Settings
        </button>
      </p>
    </>
  )
}

function AllTime({ text }: { text: string }) {
  return <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--admin-text-faint)' }}>{text}</p>
}
