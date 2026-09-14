import { useEffect, useRef, useState } from 'react'
import type { Page } from '@/app/routes'
import BrandMark from '@/components/ui/BrandMark'
import { initialsOf } from '@/lib/utils'
import { formatLongDate, formatSchedule } from '../format'
import { adminActions } from '../store'
import type { AdminSession } from '../session'
import type { Booking } from '@/types'
import Icon from '../ui/Icon'
import SearchField from '../ui/SearchField'
import { Glyph } from '../ui/StatusBadge'
import { toneColor } from '../status'

interface TopbarProps {
  navigate: (page: Page) => void
  session: AdminSession
  onSignOut: () => void
  onOpenMenu?: () => void
  compact: boolean
  attention: Booking[]
  /** Current section, shown in the bar on small screens where the sidebar is hidden. */
  sectionLabel: string
}

/** Closes a popover when the pointer lands anywhere outside it. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, close])
  return ref
}

const iconBtn = {
  position: 'relative' as const,
  width: 38,
  height: 38,
  display: 'grid',
  placeItems: 'center',
  background: 'transparent',
  border: '1px solid var(--admin-hairline)',
  borderRadius: 9,
  color: 'rgba(255,255,255,0.8)',
  cursor: 'pointer',
}

const popover = {
  position: 'absolute' as const,
  top: 'calc(100% + 8px)',
  right: 0,
  zIndex: 200,
  background: '#111111',
  border: '1px solid var(--admin-hairline-strong)',
  borderRadius: 12,
  boxShadow: '0 20px 50px rgba(0,0,0,0.65)',
  overflow: 'hidden',
}

export default function Topbar({ navigate, session, onSignOut, onOpenMenu, compact, attention, sectionLabel }: TopbarProps) {
  const [query, setQuery] = useState('')
  const [bellOpen, setBellOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const closeBell = useRef(() => setBellOpen(false)).current
  const closeAccount = useRef(() => setAccountOpen(false)).current
  const bellRef = useDismiss(bellOpen, closeBell)
  const accountRef = useDismiss(accountOpen, closeAccount)

  const submitSearch = () => {
    adminActions.setBookingQuery(query.trim())
    navigate('admin-bookings')
    setQuery('')
  }

  // Anchored to its button, a menu can run off a phone's left edge when the
  // button is not in the corner. On small screens both menus span the viewport.
  const menuPosition = compact
    ? { position: 'fixed' as const, top: 72, left: 12, right: 12, width: 'auto' }
    : {}

  const openBooking = (id: string) => {
    setBellOpen(false)
    navigate('admin-bookings')
    adminActions.openBooking(id)
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: compact ? '0 14px' : '0 28px',
        background: 'rgba(7,7,7,0.88)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--admin-hairline)',
      }}
    >
      {onOpenMenu && (
        <button onClick={onOpenMenu} aria-label="Open menu" className="admin-icon-btn" style={iconBtn}>
          <Icon name="menu" size={18} />
        </button>
      )}

      {compact && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <BrandMark size={28} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {sectionLabel}
          </span>
        </div>
      )}

      {!compact && (
        <SearchField
          value={query}
          onChange={setQuery}
          onSubmit={submitSearch}
          placeholder="Search bookings by reference, customer or place"
          label="Search bookings"
          style={{ width: 'min(420px, 100%)' }}
        />
      )}

      <div style={{ flex: 1 }} />

      {!compact && (
        <>
          <span
            title="Changes are kept for this browser session until the booking system is connected."
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              height: 28,
              padding: '0 10px',
              borderRadius: 999,
              border: '1px dashed rgba(255,255,255,0.22)',
              fontFamily: 'var(--font-body)',
              fontSize: 11.5,
              fontWeight: 600,
              color: 'var(--admin-text-muted)',
              whiteSpace: 'nowrap',
            }}
          >
            <Icon name="shield" size={13} />
            Demo data
          </span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--admin-text-muted)', whiteSpace: 'nowrap' }}>
            {formatLongDate()}
          </span>
        </>
      )}

      {/* Notifications */}
      <div ref={bellRef} style={{ position: 'relative' }}>
        <button
          onClick={() => {
            setAccountOpen(false)
            setBellOpen((v) => !v)
          }}
          aria-label={`Notifications, ${attention.length} need attention`}
          aria-expanded={bellOpen}
          className="admin-icon-btn"
          style={iconBtn}
        >
          <Icon name="bell" size={18} />
          {attention.length > 0 && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                minWidth: 16,
                height: 16,
                padding: '0 4px',
                borderRadius: 999,
                display: 'grid',
                placeItems: 'center',
                background: 'var(--status-warning)',
                color: '#060606',
                fontFamily: 'var(--font-body)',
                fontSize: 10,
                fontWeight: 800,
                boxShadow: '0 0 0 2px #070707',
              }}
            >
              {attention.length}
            </span>
          )}
        </button>

        {bellOpen && (
          <div className="admin-pop" style={{ ...popover, width: 360, ...menuPosition }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--admin-hairline)' }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: '#FFFFFF' }}>Needs attention</p>
              <p style={{ margin: '2px 0 0', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--admin-text-muted)' }}>
                {attention.length === 0 ? 'Nothing waiting on you.' : 'Unconfirmed bookings and trips without a driver.'}
              </p>
            </div>
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {attention.slice(0, 6).map((b) => {
                const pending = b.status === 'Pending'
                return (
                  <button
                    key={b.id}
                    onClick={() => openBooking(b.id)}
                    className="admin-row"
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: '12px 16px',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      textAlign: 'left',
                      color: 'inherit',
                    }}
                  >
                    <span style={{ paddingTop: 3 }}>
                      <Glyph glyph={pending ? 'clock' : 'ring'} color={pending ? toneColor.warning : toneColor.neutral} size={12} />
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, color: '#FFFFFF' }}>
                        {pending ? 'Awaiting confirmation' : 'No driver assigned'}
                        <span style={{ color: 'var(--admin-text-muted)', fontWeight: 500 }}> · {b.id}</span>
                      </span>
                      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--admin-text-muted)', marginTop: 2 }}>
                        {b.customerName} · {formatSchedule(b.scheduledAt)}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => {
                setBellOpen(false)
                navigate('admin-bookings')
              }}
              className="admin-row"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: 600,
                color: '#FFFFFF',
                textAlign: 'center',
              }}
            >
              View all bookings
            </button>
          </div>
        )}
      </div>

      {/* Account */}
      <div ref={accountRef} style={{ position: 'relative' }}>
        <button
          onClick={() => {
            setBellOpen(false)
            setAccountOpen((v) => !v)
          }}
          aria-label="Account menu"
          aria-expanded={accountOpen}
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            background: 'var(--gold-gradient)',
            border: 'none',
            color: '#060606',
            fontFamily: 'var(--font-body)',
            fontSize: 12.5,
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          {initialsOf(session.name)}
        </button>

        {accountOpen && (
          <div className="admin-pop" style={{ ...popover, width: 240, ...menuPosition }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--admin-hairline)' }}>
              <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 13.5, fontWeight: 700, color: '#FFFFFF' }}>{session.name}</p>
              <p style={{ margin: '2px 0 0', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--admin-text-muted)' }}>{session.email}</p>
              <p style={{ margin: '6px 0 0', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--admin-text-faint)' }}>
                {session.role}
              </p>
            </div>
            {[
              { label: 'Settings', icon: 'settings' as const, onClick: () => navigate('admin-settings') },
              { label: 'View public site', icon: 'external' as const, onClick: () => navigate('home') },
              { label: 'Sign out', icon: 'logout' as const, onClick: onSignOut },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setAccountOpen(false)
                  item.onClick()
                }}
                className="admin-row"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '11px 16px',
                  background: 'transparent',
                  border: 'none',
                  fontFamily: 'var(--font-body)',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.85)',
                  textAlign: 'left',
                }}
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
