import { dismissToast, useToasts } from '../store'
import { toneColor } from '../status'
import { Glyph } from './StatusBadge'

/** Confirmations for saved changes, stacked in the bottom corner. */
export default function Toaster() {
  const toasts = useToasts()
  if (toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      className="admin-toaster"
      style={{
        position: 'fixed',
        right: 20,
        bottom: 20,
        zIndex: 400,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        maxWidth: 'calc(100vw - 40px)',
      }}
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismissToast(t.id)}
          className="admin-toast-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            minWidth: 260,
            maxWidth: 380,
            padding: '12px 14px',
            borderRadius: 10,
            background: '#161616',
            border: '1px solid var(--admin-hairline-strong)',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            color: '#FFFFFF',
            fontFamily: 'var(--font-body)',
            fontSize: 13,
            fontWeight: 600,
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <Glyph
            glyph={t.tone === 'critical' ? 'cross' : 'check'}
            color={t.tone === 'neutral' ? toneColor.neutral : toneColor[t.tone]}
            size={14}
          />
          {t.message}
        </button>
      ))}
    </div>
  )
}
