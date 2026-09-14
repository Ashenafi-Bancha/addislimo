import { useState } from 'react'
import { useElementWidth } from '@/hooks'
import { formatCompact, formatETB } from '../format'
import type { DailyRevenue } from '../selectors'

interface RevenueChartProps {
  data: DailyRevenue[]
  height?: number
}

/**
 * Daily completed-trip revenue as a column chart.
 *
 * One series, so one colour and no legend — the panel title names what is
 * plotted. Columns are capped at 24px with a 4px rounded cap and a square
 * foot on the baseline; the grid is hairline and recessive. Only the peak day
 * carries a value label; every other value is in the hover tooltip and in the
 * screen-reader table. Today is named on the axis rather than recoloured: the
 * day is not over, and a highlighted short bar would read as a bad day.
 */

const MARGIN = { top: 22, right: 6, bottom: 30, left: 42 }
const BAR_COLOR = '#c9c9c9'
const BAR_ACTIVE = '#ffffff'

/** Round up to a tidy axis maximum with about four steps. */
function niceScale(max: number): { top: number; step: number } {
  if (max <= 0) return { top: 4000, step: 1000 }
  const rough = max / 4
  const magnitude = 10 ** Math.floor(Math.log10(rough))
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rough) ?? 10 * magnitude
  return { top: Math.ceil(max / step) * step, step }
}

/** A column with a rounded cap and a square foot. */
function columnPath(x: number, y: number, w: number, h: number): string {
  if (h <= 0) return ''
  const r = Math.min(4, w / 2, h)
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`
}

const dayLabel = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric' })
const longDate = (d: Date) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })

export default function RevenueChart({ data, height = 240 }: RevenueChartProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>()
  const [active, setActive] = useState<number | null>(null)

  const plotW = Math.max(0, width - MARGIN.left - MARGIN.right)
  const plotH = height - MARGIN.top - MARGIN.bottom
  const peak = Math.max(...data.map((d) => d.revenue), 0)
  const { top, step } = niceScale(peak)
  const ticks = Array.from({ length: Math.round(top / step) + 1 }, (_, i) => i * step)

  const band = data.length ? plotW / data.length : 0
  const barW = Math.min(24, band * 0.62)
  const y = (v: number) => MARGIN.top + plotH - (v / top) * plotH
  const peakIndex = peak > 0 ? data.findIndex((d) => d.revenue === peak) : -1

  // Thin the axis labels when the columns get narrow; always keep today.
  const labelEvery = band >= 26 ? 1 : 2
  const showLabel = (i: number) => i === data.length - 1 || (data.length - 1 - i) % labelEvery === 0

  const tip = active !== null ? data[active] : null
  const tipX = active !== null ? MARGIN.left + band * active + band / 2 : 0
  const tipWidth = 168

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', height }} onMouseLeave={() => setActive(null)}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label="Revenue from completed trips per day, last 14 days" style={{ display: 'block', overflow: 'visible' }}>
          {/* Grid and y-axis */}
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={MARGIN.left}
                x2={width - MARGIN.right}
                y1={y(t)}
                y2={y(t)}
                stroke={t === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}
                strokeWidth={1}
                shapeRendering="crispEdges"
              />
              <text
                x={MARGIN.left - 10}
                y={y(t)}
                dy="0.32em"
                textAnchor="end"
                style={{ fontFamily: 'var(--font-body)', fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontVariantNumeric: 'tabular-nums' }}
              >
                {formatCompact(t)}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const x = MARGIN.left + band * i + (band - barW) / 2
            const h = MARGIN.top + plotH - y(d.revenue)
            const isActive = active === i
            return (
              <g key={d.date.toISOString()}>
                <path d={columnPath(x, y(d.revenue), barW, h)} fill={isActive ? BAR_ACTIVE : BAR_COLOR} style={{ transition: 'fill 0.12s' }} />

                {i === peakIndex && active === null && (
                  <text
                    x={x + barW / 2}
                    y={y(d.revenue) - 8}
                    textAnchor="middle"
                    style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, fill: '#FFFFFF', fontVariantNumeric: 'tabular-nums' }}
                  >
                    {formatCompact(d.revenue)}
                  </text>
                )}

                {showLabel(i) && (
                  <text
                    x={MARGIN.left + band * i + band / 2}
                    y={height - 10}
                    textAnchor="middle"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 11,
                      fontWeight: d.isToday ? 700 : 500,
                      fill: d.isToday ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {d.isToday ? 'Today' : dayLabel(d.date)}
                  </text>
                )}

                {/* Hit target: the whole column band, far bigger than the bar. */}
                <rect
                  x={MARGIN.left + band * i}
                  y={MARGIN.top}
                  width={band}
                  height={plotH}
                  fill="transparent"
                  tabIndex={0}
                  aria-label={`${longDate(d.date)}: ${formatETB(d.revenue)} from ${d.trips} trip${d.trips === 1 ? '' : 's'}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive((v) => (v === i ? null : i))}
                  style={{ cursor: 'pointer', outline: 'none' }}
                />
              </g>
            )
          })}
        </svg>
      )}

      {tip && (
        <div
          role="status"
          style={{
            position: 'absolute',
            left: Math.min(Math.max(tipX - tipWidth / 2, 0), Math.max(width - tipWidth, 0)),
            top: Math.max(y(tip.revenue) - 72, 0),
            width: tipWidth,
            padding: '9px 11px',
            borderRadius: 9,
            background: '#1a1a1a',
            border: '1px solid rgba(255,255,255,0.16)',
            boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
            pointerEvents: 'none',
            fontFamily: 'var(--font-body)',
          }}
        >
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)' }}>
            {tip.isToday ? 'Today so far' : longDate(tip.date)}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#FFFFFF', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
            {formatETB(tip.revenue)}
          </div>
          <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 1 }}>
            {tip.trips} completed trip{tip.trips === 1 ? '' : 's'}
          </div>
        </div>
      )}

      {/* The same numbers as a table, for screen readers. */}
      <table className="sr-only">
        <caption>Revenue from completed trips per day</caption>
        <thead>
          <tr>
            <th scope="col">Day</th>
            <th scope="col">Revenue</th>
            <th scope="col">Trips</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.date.toISOString()}>
              <td>{longDate(d.date)}</td>
              <td>{formatETB(d.revenue)}</td>
              <td>{d.trips}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
