import { useMemo } from 'react'
import type { Page } from '@/app/routes'
import { useMediaQuery } from '@/hooks'
import type { Booking } from '@/types'
import RevenueChart from '../charts/RevenueChart'
import { formatCompactETB, formatETB, formatSchedule, formatTime } from '../format'
import {
  comparisonWindows,
  countByStatus,
  dailyRevenue,
  isToday,
  needsAttention,
  partnerPerformance,
  percentChange,
  serviceLabel,
  totalsBetween,
  BOOKING_STATUSES,
} from '../selectors'
import type { AdminSession } from '../session'
import { bookingStatusMeta } from '../status'
import { adminActions, useAdminStore } from '../store'
import EmptyState from '../ui/EmptyState'
import Icon from '../ui/Icon'
import PageHeader from '../ui/PageHeader'
import StatTile from '../ui/StatTile'
import StatusBadge, { Glyph } from '../ui/StatusBadge'
import { buttonSecondary, panel, panelHeader, panelSubtitle, panelTitle, tabular } from '../ui/styles'
import { toneColor } from '../status'

interface OverviewViewProps {
  navigate: (page: Page) => void
  session: AdminSession
}

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function OverviewView({ navigate, session }: OverviewViewProps) {
  const state = useAdminStore()
  const wide = useMediaQuery('(min-width: 1100px)')

  const stats = useMemo(() => {
    const { current, previous } = comparisonWindows(7)
    const now = totalsBetween(state.bookings, current[0], current[1])
    const before = totalsBetween(state.bookings, previous[0], previous[1])
    return {
      now,
      revenueDelta: percentChange(now.revenue, before.revenue),
      commissionDelta: percentChange(now.commission, before.commission),
      tripsDelta: percentChange(now.trips, before.trips),
    }
  }, [state.bookings])

  const chart = useMemo(() => dailyRevenue(state.bookings, 14), [state.bookings])
  const chartTotal = chart.reduce((sum, d) => sum + d.revenue, 0)
  const attention = useMemo(() => needsAttention(state.bookings), [state.bookings])
  const pending = attention.filter((b) => b.status === 'Pending').length
  const counts = useMemo(() => countByStatus(state.bookings), [state.bookings])

  const today = useMemo(
    () =>
      state.bookings
        .filter((b) => isToday(b.scheduledAt) && b.status !== 'Cancelled')
        .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)),
    [state.bookings],
  )

  const topPartners = useMemo(() => {
    const { current } = comparisonWindows(30)
    return partnerPerformance(state, current[0], current[1])
      .filter((p) => p.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }, [state])
  const topRevenue = topPartners[0]?.revenue ?? 0

  const open = (b: Booking) => adminActions.openBooking(b.id)

  // Shared role accounts ("Operations Admin") have no first name to greet.
  const isRoleAccount = /\b(admin|operations|team|desk)\b/i.test(session.name)
  const salutation = isRoleAccount ? greeting() : `${greeting()}, ${session.name.split(' ')[0]}`

  const rangeLabel = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const chartRange = chart.length ? `${rangeLabel(chart[0].date)} to ${rangeLabel(chart[chart.length - 1].date)}` : ''

  return (
    <>
      <PageHeader
        title={salutation}
        description={
          pending > 0
            ? `${pending} booking${pending === 1 ? '' : 's'} waiting for confirmation and ${today.length} trip${today.length === 1 ? '' : 's'} on today's schedule.`
            : `Everything is confirmed. ${today.length} trip${today.length === 1 ? '' : 's'} on today's schedule.`
        }
        actions={
          <button onClick={() => navigate('admin-bookings')} className="admin-btn-secondary" style={buttonSecondary}>
            <Icon name="bookings" size={16} />
            All bookings
          </button>
        }
      />

      {/* Headline figures */}
      <div className="admin-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 16 }}>
        <StatTile label="Revenue, last 7 days" value={formatETB(stats.now.revenue)} icon="finance" delta={stats.revenueDelta} comparedTo="previous 7 days" />
        <StatTile label="Commission earned" value={formatETB(stats.now.commission)} icon="trendUp" delta={stats.commissionDelta} comparedTo="previous 7 days" />
        <StatTile label="Trips completed" value={String(stats.now.trips)} icon="check" delta={stats.tripsDelta} comparedTo="previous 7 days" />
        <StatTile
          label="Awaiting confirmation"
          value={String(pending)}
          icon="clock"
          onClick={() => navigate('admin-bookings')}
          footnote={
            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--admin-text-muted)' }}>
              {pending > 0 ? (
                <>
                  <Glyph glyph="clock" color={toneColor.warning} size={12} />
                  Review in Bookings
                  <Icon name="chevronRight" size={13} />
                </>
              ) : (
                <>
                  <Glyph glyph="check" color={toneColor.good} size={12} />
                  Nothing to confirm
                </>
              )}
            </p>
          }
        />
      </div>

      {/* Chart + today's schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: wide ? 'minmax(0, 1.7fr) minmax(0, 1fr)' : 'minmax(0, 1fr)', gap: 16, marginBottom: 16 }}>
        <section style={panel} aria-labelledby="ov-revenue">
          <div style={panelHeader}>
            <div>
              <h2 id="ov-revenue" style={panelTitle}>Revenue, last 14 days</h2>
              <p style={panelSubtitle}>Completed trips, {chartRange}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 18, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', ...tabular }}>{formatCompactETB(chartTotal)}</div>
              <div style={panelSubtitle}>14-day total</div>
            </div>
          </div>
          <div style={{ padding: '8px 16px 12px' }}>
            <RevenueChart data={chart} />
          </div>
        </section>

        <section style={{ ...panel, display: 'flex', flexDirection: 'column' }} aria-labelledby="ov-today">
          <div style={panelHeader}>
            <div>
              <h2 id="ov-today" style={panelTitle}>Today's schedule</h2>
              <p style={panelSubtitle}>{today.length} trip{today.length === 1 ? '' : 's'}</p>
            </div>
          </div>
          {today.length === 0 ? (
            <EmptyState icon="clock" title="No trips today" description="Upcoming bookings appear here on the day." />
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: '6px 0', flex: 1, overflowY: 'auto', maxHeight: 300 }}>
              {today.map((b) => (
                <li key={b.id}>
                  <button
                    onClick={() => open(b)}
                    className="admin-row"
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '10px 20px', background: 'transparent', border: 'none', textAlign: 'left', color: 'inherit' }}
                  >
                    <span style={{ width: 44, flexShrink: 0, fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 700, color: '#FFFFFF', ...tabular }}>
                      {formatTime(b.scheduledAt)}
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b.customerName}
                      </span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--admin-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {serviceLabel(b.serviceId)} · {b.pickup}
                      </span>
                    </span>
                    <StatusBadge label={b.status} meta={bookingStatusMeta[b.status]} size="sm" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Attention, status mix, partners */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <section style={panel} aria-labelledby="ov-attention">
          <div style={panelHeader}>
            <div>
              <h2 id="ov-attention" style={panelTitle}>Needs attention</h2>
              <p style={panelSubtitle}>Unconfirmed, or confirmed with no driver</p>
            </div>
          </div>
          {attention.length === 0 ? (
            <EmptyState icon="check" title="All caught up" description="Every open booking is confirmed and assigned." />
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: '6px 0' }}>
              {attention.slice(0, 5).map((b) => {
                const isPending = b.status === 'Pending'
                return (
                  <li key={b.id}>
                    <button
                      onClick={() => open(b)}
                      className="admin-row"
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 20px', background: 'transparent', border: 'none', textAlign: 'left', color: 'inherit' }}
                    >
                      <Glyph glyph={isPending ? 'clock' : 'ring'} color={isPending ? toneColor.warning : toneColor.neutral} size={13} />
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, color: '#FFFFFF' }}>
                          {isPending ? 'Confirm booking' : 'Assign a driver'}
                        </span>
                        <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--admin-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {b.id} · {b.customerName} · {formatSchedule(b.scheduledAt)}
                        </span>
                      </span>
                      <Icon name="chevronRight" size={15} style={{ color: 'var(--admin-text-faint)' }} />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section style={panel} aria-labelledby="ov-status">
          <div style={panelHeader}>
            <div>
              <h2 id="ov-status" style={panelTitle}>Bookings by status</h2>
              <p style={panelSubtitle}>{state.bookings.length} bookings in total</p>
            </div>
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: '10px 20px 16px' }}>
            {BOOKING_STATUSES.map((s) => {
              const n = counts[s]
              const share = state.bookings.length ? n / state.bookings.length : 0
              return (
                <li key={s} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 28px', alignItems: 'center', gap: 12, padding: '6px 0' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.85)', whiteSpace: 'nowrap' }}>
                    <Glyph glyph={bookingStatusMeta[s].glyph} color={toneColor[bookingStatusMeta[s].tone]} size={11} />
                    {s}
                  </span>
                  {/* Meter: the track is a lighter step of the same neutral. */}
                  <span style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <span style={{ display: 'block', height: '100%', width: `${share * 100}%`, borderRadius: 999, background: 'rgba(255,255,255,0.72)' }} />
                  </span>
                  <span style={{ textAlign: 'right', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: '#FFFFFF', ...tabular }}>{n}</span>
                </li>
              )
            })}
          </ul>
        </section>

        <section style={panel} aria-labelledby="ov-partners">
          <div style={panelHeader}>
            <div>
              <h2 id="ov-partners" style={panelTitle}>Top partners</h2>
              <p style={panelSubtitle}>Completed revenue, last 30 days</p>
            </div>
            <button onClick={() => navigate('admin-partners')} className="admin-btn-secondary" style={{ ...buttonSecondary, height: 32, padding: '0 10px', fontSize: 12.5 }}>
              View all
            </button>
          </div>
          {topPartners.length === 0 ? (
            <EmptyState icon="partners" title="No completed trips yet" />
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: '10px 20px 16px' }}>
              {topPartners.map((p) => (
                <li key={p.partner.id} style={{ padding: '7px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 600, color: '#FFFFFF' }}>
                      {p.partner.name}
                      <span style={{ color: 'var(--admin-text-muted)', fontWeight: 500 }}> · {p.trips} trips</span>
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: '#FFFFFF', ...tabular }}>{formatCompactETB(p.revenue)}</span>
                  </div>
                  <span style={{ display: 'block', height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <span style={{ display: 'block', height: '100%', width: `${(p.revenue / topRevenue) * 100}%`, borderRadius: 999, background: 'rgba(255,255,255,0.72)' }} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
