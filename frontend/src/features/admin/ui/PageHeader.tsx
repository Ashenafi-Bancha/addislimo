import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: ReactNode
  actions?: ReactNode
}

/**
 * The title block at the top of each admin section.
 *
 * Playfair survives here, at a modest size and in plain white — enough to
 * carry the brand into the console without the marketing site's sheen.
 */
export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div
      className="admin-page-header"
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        marginBottom: 22,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(24px, 2.4vw, 30px)',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h1>
        {description && (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--admin-text-muted)', margin: '6px 0 0' }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>{actions}</div>}
    </div>
  )
}
