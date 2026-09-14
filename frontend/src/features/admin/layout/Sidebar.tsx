import type { AdminConsolePage, Page } from '@/app/routes'
import BrandMark from '@/components/ui/BrandMark'
import { site } from '@/config/site'
import { initialsOf } from '@/lib/utils'
import { adminNav } from '../nav'
import type { AdminSession } from '../session'
import Icon from '../ui/Icon'

interface SidebarProps {
  current: AdminConsolePage
  navigate: (page: Page) => void
  session: AdminSession
  onSignOut: () => void
  /** Counts shown beside a nav item, e.g. bookings awaiting confirmation. */
  badges: Partial<Record<AdminConsolePage, number>>
  /** Mobile drawer only: close after choosing a destination. */
  onNavigated?: () => void
  onClose?: () => void
}

export default function Sidebar({ current, navigate, session, onSignOut, badges, onNavigated, onClose }: SidebarProps) {
  const go = (page: Page) => {
    navigate(page)
    onNavigated?.()
  }

  return (
    <aside
      aria-label="Admin navigation"
      style={{
        width: 256,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--admin-sidebar)',
        borderRight: '1px solid var(--admin-hairline)',
      }}
    >
      {/* Brand */}
      <div
        style={{
          height: 64,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '0 16px 0 18px',
          borderBottom: '1px solid var(--admin-hairline)',
        }}
      >
        <button
          onClick={() => go('admin')}
          style={{ display: 'flex', alignItems: 'center', gap: 11, background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit' }}
        >
          <BrandMark size={34} />
          <span style={{ textAlign: 'left' }}>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {site.name}
            </span>
            <span
              style={{
                display: 'block',
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--admin-text-muted)',
                marginTop: 5,
              }}
            >
              Operations
            </span>
          </span>
        </button>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="admin-icon-btn"
            style={{ width: 34, height: 34, display: 'grid', placeItems: 'center', background: 'transparent', border: '1px solid var(--admin-hairline)', borderRadius: 8, color: 'rgba(255,255,255,0.8)', cursor: 'pointer' }}
          >
            <Icon name="close" size={16} />
          </button>
        )}
      </div>

      {/* Sections */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '14px 10px' }}>
        {adminNav.map((group) => (
          <div key={group.label} style={{ marginBottom: 18 }}>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--admin-text-faint)',
                margin: '0 10px 6px',
              }}
            >
              {group.label}
            </p>
            {group.items.map((item) => {
              const active = item.page === current
              const badge = badges[item.page]
              return (
                <button
                  key={item.page}
                  onClick={() => go(item.page)}
                  aria-current={active ? 'page' : undefined}
                  className="admin-nav-item"
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 38,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                    padding: '0 10px',
                    marginBottom: 2,
                    borderRadius: 8,
                    border: 'none',
                    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: active ? '#FFFFFF' : 'rgba(255,255,255,0.66)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 13.5,
                    fontWeight: active ? 700 : 500,
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.12s, color 0.12s',
                  }}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      style={{ position: 'absolute', left: -10, top: 9, bottom: 9, width: 3, borderRadius: '0 3px 3px 0', background: 'var(--gold-gradient)' }}
                    />
                  )}
                  <Icon name={item.icon} size={17} style={{ opacity: active ? 1 : 0.8 }} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {typeof badge === 'number' && badge > 0 && (
                    <span
                      aria-label={`${badge} need attention`}
                      style={{
                        minWidth: 20,
                        height: 20,
                        padding: '0 6px',
                        borderRadius: 999,
                        display: 'grid',
                        placeItems: 'center',
                        background: 'rgba(250,178,25,0.16)',
                        border: '1px solid rgba(250,178,25,0.35)',
                        color: '#FFFFFF',
                        fontSize: 11,
                        fontWeight: 700,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer: public site + account */}
      <div style={{ flexShrink: 0, padding: 10, borderTop: '1px solid var(--admin-hairline)' }}>
        <button
          onClick={() => go('home')}
          className="admin-nav-item"
          style={{
            width: '100%',
            height: 36,
            display: 'flex',
            alignItems: 'center',
            gap: 11,
            padding: '0 10px',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            color: 'rgba(255,255,255,0.62)',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          <Icon name="external" size={16} />
          View public site
        </button>

        <div
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: 10,
            borderRadius: 10,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--admin-hairline)',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 34,
              height: 34,
              flexShrink: 0,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              background: 'var(--gold-gradient)',
              color: '#060606',
              fontFamily: 'var(--font-body)',
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {initialsOf(session.name)}
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {session.name}
            </span>
            <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'var(--admin-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {session.email}
            </span>
          </span>
          <button
            onClick={onSignOut}
            aria-label="Sign out"
            title="Sign out"
            className="admin-icon-btn"
            style={{ width: 32, height: 32, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'transparent', border: '1px solid var(--admin-hairline)', borderRadius: 8, color: 'rgba(255,255,255,0.75)', cursor: 'pointer' }}
          >
            <Icon name="logout" size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
