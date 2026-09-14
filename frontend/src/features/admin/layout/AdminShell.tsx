import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AdminConsolePage, Page } from '@/app/routes'
import { useMediaQuery } from '@/hooks'
import { sectionForPage } from '../nav'
import { needsAttention } from '../selectors'
import type { AdminSession } from '../session'
import { useAdminStore } from '../store'
import Toaster from '../ui/Toaster'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

interface AdminShellProps {
  current: AdminConsolePage
  navigate: (page: Page) => void
  session: AdminSession
  onSignOut: () => void
  children: ReactNode
}

/**
 * The frame of the admin console: sidebar, top bar, content and toasts.
 *
 * On a laptop the sidebar is always there. On a phone it becomes a drawer
 * behind the menu button — a permanent 256px column would leave a phone with
 * a sliver of content, and a horizontally scrolling tab strip hides most of
 * the sections off-screen.
 */
export default function AdminShell({ current, navigate, session, onSignOut, children }: AdminShellProps) {
  const state = useAdminStore()
  const compact = useMediaQuery('(max-width: 1024px)')
  const [menuOpen, setMenuOpen] = useState(false)

  const attention = useMemo(() => needsAttention(state.bookings), [state.bookings])
  const badges = useMemo(
    () => ({
      'admin-bookings': state.bookings.filter((b) => b.status === 'Pending').length,
      'admin-partners': state.partners.filter((p) => p.status === 'Pending').length,
    }),
    [state.bookings, state.partners],
  )

  // Leaving compact layout with the drawer open must not strand the overlay.
  useEffect(() => {
    if (!compact) setMenuOpen(false)
  }, [compact])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const sidebar = (
    <Sidebar
      current={current}
      navigate={navigate}
      session={session}
      onSignOut={onSignOut}
      badges={badges}
      onNavigated={compact ? () => setMenuOpen(false) : undefined}
      onClose={compact ? () => setMenuOpen(false) : undefined}
    />
  )

  return (
    <div className="admin-console" style={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-page)', color: '#FFFFFF' }}>
      {!compact && <div style={{ position: 'sticky', top: 0, height: '100vh', flexShrink: 0 }}>{sidebar}</div>}

      {compact && menuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 250 }}>
          <div
            onClick={() => setMenuOpen(false)}
            className="admin-fade-in"
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
          />
          <div className="admin-slide-in-left" style={{ position: 'absolute', top: 0, left: 0, bottom: 0, maxWidth: '86vw', boxShadow: '24px 0 60px rgba(0,0,0,0.6)' }}>
            {sidebar}
          </div>
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Topbar
          navigate={navigate}
          session={session}
          onSignOut={onSignOut}
          onOpenMenu={compact ? () => setMenuOpen(true) : undefined}
          compact={compact}
          attention={attention}
          sectionLabel={sectionForPage(current).label}
        />
        <div
          className="admin-content"
          style={{
            width: '100%',
            maxWidth: 1440,
            margin: '0 auto',
            padding: compact ? '20px 16px 48px' : '28px 32px 56px',
          }}
        >
          {children}
        </div>
      </div>

      <Toaster />
    </div>
  )
}
