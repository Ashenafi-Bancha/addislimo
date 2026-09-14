import type { ReactNode } from 'react'
import Icon, { type IconName } from './Icon'

interface EmptyStateProps {
  icon: IconName
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div style={{ padding: '48px 24px', textAlign: 'center' }}>
      <span
        style={{
          width: 44,
          height: 44,
          margin: '0 auto 14px',
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid var(--admin-hairline)',
          color: 'rgba(255,255,255,0.7)',
        }}
      >
        <Icon name={icon} size={20} />
      </span>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 700, color: '#FFFFFF', margin: 0 }}>{title}</p>
      {description && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--admin-text-muted)', margin: '6px auto 0', maxWidth: 360 }}>
          {description}
        </p>
      )}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  )
}
