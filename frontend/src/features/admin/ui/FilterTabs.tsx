interface FilterTab<T extends string> {
  id: T
  label: string
  count?: number
}

interface FilterTabsProps<T extends string> {
  tabs: FilterTab<T>[]
  value: T
  onChange: (id: T) => void
  label: string
}

/**
 * Segmented filter with counts. Scrolls sideways on a narrow screen rather
 * than wrapping, so the row keeps its height.
 */
export default function FilterTabs<T extends string>({ tabs, value, onChange, label }: FilterTabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="admin-scroll-x"
      style={{ display: 'flex', gap: 4, overflowX: 'auto', scrollbarWidth: 'none', padding: 2 }}
    >
      {tabs.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              height: 34,
              padding: '0 12px',
              borderRadius: 8,
              border: `1px solid ${active ? 'var(--admin-hairline-strong)' : 'transparent'}`,
              background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: active ? '#FFFFFF' : 'rgba(255,255,255,0.62)',
              fontFamily: 'var(--font-body)',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span
                style={{
                  minWidth: 20,
                  height: 18,
                  padding: '0 6px',
                  borderRadius: 999,
                  display: 'inline-grid',
                  placeItems: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  fontVariantNumeric: 'tabular-nums',
                  background: active ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)',
                  color: active ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
