import type { CSSProperties, KeyboardEvent } from 'react'
import Icon from './Icon'
import { input } from './styles'

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  onSubmit?: () => void
  style?: CSSProperties
  label?: string
}

export default function SearchField({ value, onChange, placeholder, onSubmit, style, label }: SearchFieldProps) {
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSubmit?.()
    if (e.key === 'Escape' && value) onChange('')
  }

  return (
    <div style={{ position: 'relative', minWidth: 0, ...style }}>
      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-faint)', pointerEvents: 'none' }}>
        <Icon name="search" size={16} />
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className="admin-input"
        style={{ ...input, paddingLeft: 38, paddingRight: value ? 34 : 12 }}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          style={{
            position: 'absolute',
            right: 6,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 26,
            height: 26,
            display: 'grid',
            placeItems: 'center',
            background: 'transparent',
            border: 'none',
            borderRadius: 6,
            color: 'var(--admin-text-muted)',
            cursor: 'pointer',
          }}
        >
          <Icon name="close" size={14} />
        </button>
      )}
    </div>
  )
}
