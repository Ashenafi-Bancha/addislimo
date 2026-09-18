import type { CSSProperties, ReactNode } from 'react'
import { fieldLabel, input } from './styles'

interface FieldProps {
  label: string
  htmlFor: string
  hint?: ReactNode
  error?: string
  children: ReactNode
  style?: CSSProperties
}

/** A labelled form control with an optional hint or error beneath it. */
export default function Field({ label, htmlFor, hint, error, children, style }: FieldProps) {
  return (
    <div style={style}>
      <label htmlFor={htmlFor} style={fieldLabel}>{label}</label>
      {children}
      {error ? (
        <p role="alert" style={{ ...note, color: '#FFFFFF' }}>
          <span aria-hidden="true" style={{ color: 'var(--status-critical)', marginRight: 6 }}>●</span>
          {error}
        </p>
      ) : (
        hint && <p style={note}>{hint}</p>
      )}
    </div>
  )
}

const note: CSSProperties = {
  margin: '6px 0 0',
  fontFamily: 'var(--font-body)',
  fontSize: 12,
  lineHeight: 1.5,
  color: 'var(--admin-text-muted)',
}

/** Multi-line text input sharing the single-line input's look. */
export const textarea: CSSProperties = {
  ...input,
  height: 'auto',
  minHeight: 84,
  padding: '10px 12px',
  lineHeight: 1.5,
  resize: 'vertical',
}

/** Two-column form grid that folds to one column on phones (see admin.css). */
export const formGrid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 16,
}
