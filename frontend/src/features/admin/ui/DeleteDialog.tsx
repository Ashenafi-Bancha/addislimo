import type { DeleteCheck } from '../guards'
import ConfirmDialog from './ConfirmDialog'
import { t, tf } from '@/features/i18n'

interface DeleteDialogProps {
  /** What is being deleted, e.g. "partner". */
  noun: string
  /** Its name, e.g. "Elite Cars". `null` keeps the dialog closed. */
  name: string | null
  check: DeleteCheck | null
  onConfirm: () => void
  onClose: () => void
}

/**
 * The confirmation every delete goes through: it names the record, lists what
 * goes with it, and turns into an explanation when the delete is not allowed.
 */
export default function DeleteDialog({ noun, name, check, onConfirm, onClose }: DeleteDialogProps) {
  const open = name !== null && check !== null
  const allowed = check?.allowed ?? false

  return (
    <ConfirmDialog
      open={open}
      title={allowed ? tf('Delete {name}?', { name: name ?? '' }) : tf('{name} cannot be deleted', { name: name ?? '' })}
      confirmLabel={allowed ? tf('Delete {noun}', { noun: t(noun) }) : undefined}
      tone={allowed ? 'danger' : 'neutral'}
      onConfirm={onConfirm}
      onClose={onClose}
    >
      {allowed ? (
        <>
          <p style={{ margin: 0 }}>{t('This cannot be undone.')}</p>
          {check && check.consequences.length > 0 && (
            <ul style={{ margin: '10px 0 0', paddingLeft: 18, display: 'grid', gap: 4 }}>
              {check.consequences.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p style={{ margin: 0 }}>{check?.reason}</p>
      )}
    </ConfirmDialog>
  )
}
