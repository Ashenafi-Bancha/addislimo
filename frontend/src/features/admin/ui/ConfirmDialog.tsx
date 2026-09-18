import { useEffect, useRef, type ReactNode } from 'react'
import Icon from './Icon'
import { buttonDanger, buttonGhost, buttonPrimary } from './styles'

interface ConfirmDialogProps {
  open: boolean
  title: string
  children: ReactNode
  /** Omit to show a single "OK": the dialog then only explains. */
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'neutral'
  onConfirm?: () => void
  onClose: () => void
}

/**
 * A small centred dialog for decisions that cannot be undone.
 *
 * Deleting is the only irreversible thing the console does, so it always asks
 * here first and says exactly what goes with it. When something cannot be
 * deleted (a partner with trip history), the same dialog explains why and
 * offers no confirm button.
 */
export default function ConfirmDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'danger',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const returnTo = document.activeElement as HTMLElement | null
    // Focus the safe choice, so Enter never deletes by accident.
    cancelRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onCloseRef.current()
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      window.removeEventListener('keydown', onKey, true)
      returnTo?.focus?.()
    }
  }, [open])

  if (!open) return null

  const canConfirm = Boolean(confirmLabel && onConfirm)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'grid', placeItems: 'center', padding: 16 }}>
      <div
        onClick={onClose}
        className="admin-fade-in"
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="admin-fade-in"
        style={{
          position: 'relative',
          width: 'min(440px, 100%)',
          background: '#0D0D0D',
          border: '1px solid var(--admin-hairline-strong)',
          borderRadius: 14,
          boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
          padding: 22,
        }}
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span
            aria-hidden="true"
            style={{
              flexShrink: 0,
              width: 38,
              height: 38,
              borderRadius: 10,
              display: 'grid',
              placeItems: 'center',
              background: tone === 'danger' ? 'rgba(208,59,59,0.12)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${tone === 'danger' ? 'rgba(208,59,59,0.45)' : 'var(--admin-hairline-strong)'}`,
              color: '#FFFFFF',
            }}
          >
            <Icon name={tone === 'danger' ? 'trash' : 'alert'} size={17} />
          </span>
          <div style={{ minWidth: 0 }}>
            <h2 id="confirm-title" style={{ margin: '2px 0 8px', fontFamily: 'var(--font-body)', fontSize: 16, fontWeight: 700, color: '#FFFFFF' }}>
              {title}
            </h2>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, lineHeight: 1.6, color: 'rgba(255,255,255,0.78)' }}>{children}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
          <button ref={cancelRef} onClick={onClose} className="admin-btn-ghost" style={buttonGhost}>
            {canConfirm ? cancelLabel : 'OK'}
          </button>
          {canConfirm && (
            <button
              onClick={onConfirm}
              className={tone === 'danger' ? 'admin-btn-danger' : 'admin-btn'}
              style={tone === 'danger' ? { ...buttonDanger, background: 'rgba(208,59,59,0.16)' } : buttonPrimary}
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
