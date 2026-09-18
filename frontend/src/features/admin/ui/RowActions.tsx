import type { MouseEvent } from 'react'
import Icon from './Icon'
import { iconButton } from './styles'

interface RowActionsProps {
  /** Names the record, so screen readers hear "Edit Elite Cars". */
  label: string
  onEdit?: () => void
  onDelete?: () => void
}

/**
 * Edit and delete buttons for a table row, list item or card.
 *
 * Clicks stop here, so a row that opens something on click does not also
 * open when one of these is pressed.
 */
export default function RowActions({ label, onEdit, onDelete }: RowActionsProps) {
  const run = (fn?: () => void) => (e: MouseEvent) => {
    e.stopPropagation()
    fn?.()
  }

  return (
    <span style={{ display: 'inline-flex', gap: 6 }} onKeyDown={(e) => e.stopPropagation()}>
      {onEdit && (
        <button type="button" onClick={run(onEdit)} aria-label={`Edit ${label}`} title="Edit" className="admin-icon-btn" style={small}>
          <Icon name="edit" size={15} />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={run(onDelete)}
          aria-label={`Delete ${label}`}
          title="Delete"
          className="admin-icon-btn-danger"
          style={{ ...small, borderColor: 'rgba(208,59,59,0.35)' }}
        >
          <Icon name="trash" size={15} />
        </button>
      )}
    </span>
  )
}

const small = { ...iconButton, width: 32, height: 32, borderRadius: 8 }
