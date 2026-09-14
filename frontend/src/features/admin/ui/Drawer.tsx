import { useEffect, useRef, type ReactNode } from 'react'
import Icon from './Icon'
import { iconButton } from './styles'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  subtitle?: ReactNode
  children: ReactNode
  footer?: ReactNode
  /** Accessible name when `title` is not plain text. */
  label: string
}

/**
 * A panel that slides in from the right over the current view.
 *
 * Detail and edit screens open here instead of navigating away, so an admin
 * working down a list never loses their place or their filters. Escape and
 * the backdrop close it; focus moves into it on open and back on close.
 */
export default function Drawer({ open, onClose, title, subtitle, children, footer, label }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  // Held in a ref so a parent passing a fresh callback on every render does
  // not re-run the effect below and pull focus out of the field being edited.
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      returnFocus.current?.focus?.()
    }
  }, [open])

  if (!open) return null

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300 }}>
      <div
        onClick={onClose}
        className="admin-fade-in"
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.62)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className="admin-drawer admin-slide-in"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(480px, 100vw)',
          display: 'flex',
          flexDirection: 'column',
          background: '#0B0B0B',
          borderLeft: '1px solid var(--admin-hairline-strong)',
          boxShadow: '-24px 0 60px rgba(0,0,0,0.6)',
          outline: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            padding: '18px 20px',
            borderBottom: '1px solid var(--admin-hairline)',
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 17, fontWeight: 700, color: '#FFFFFF' }}>{title}</div>
            {subtitle && (
              <div style={{ fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--admin-text-muted)', marginTop: 4 }}>
                {subtitle}
              </div>
            )}
          </div>
          <button onClick={onClose} aria-label="Close" style={{ ...iconButton, width: 34, height: 34 }}>
            <Icon name="close" size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px' }}>{children}</div>

        {footer && (
          <div
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              flexWrap: 'wrap',
              padding: '14px 20px',
              borderTop: '1px solid var(--admin-hairline)',
              background: '#0A0A0A',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
