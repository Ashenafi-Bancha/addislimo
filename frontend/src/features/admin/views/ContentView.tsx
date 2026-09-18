import { useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import { hrefFor } from '@/app/routes'
import { contentActions, useAllContent } from '@/features/cms'
import { contentGroups, type ContentGroup } from '@/features/cms/schema'
import { notify } from '../store'
import Icon from '../ui/Icon'
import PageHeader from '../ui/PageHeader'
import { buttonSecondary, panel } from '../ui/styles'
import ContentEditor from './content/ContentEditor'

const areas: ContentGroup['area'][] = ['Business', 'Home page', 'Pages']

/**
 * Website Content: every editable part of the public site, grouped the way
 * a visitor meets it. Pick a card to edit that part.
 */
export default function ContentView() {
  const content = useAllContent()
  const [activeKey, setActiveKey] = useState<ContentGroup['key'] | null>(null)
  const importRef = useRef<HTMLInputElement>(null)
  const active = contentGroups.find((g) => g.key === activeKey)

  if (active) return <ContentEditor key={active.key} group={active} onBack={() => setActiveKey(null)} />

  const edited = new Set(contentActions.editedKeys())

  const exportContent = () => {
    const blob = new Blob([contentActions.exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'published.json'
    a.click()
    URL.revokeObjectURL(url)
    notify('Content exported as published.json', 'good')
  }

  const importContent = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const result = contentActions.importJson(await file.text())
    notify(result.ok ? 'Content imported' : result.error, result.ok ? 'good' : 'critical')
  }

  return (
    <>
      <PageHeader
        title="Website Content"
        description="Edit the text, photos and lists on the public website."
        actions={
          <>
            <button onClick={() => importRef.current?.click()} className="admin-btn-secondary" style={buttonSecondary}>
              <Icon name="upload" size={15} />
              Import
            </button>
            <input ref={importRef} type="file" accept="application/json,.json" onChange={importContent} hidden />
            <button onClick={exportContent} className="admin-btn-secondary" style={buttonSecondary}>
              <Icon name="download" size={15} />
              Export
            </button>
            <a href={hrefFor('home')} target="_blank" rel="noopener noreferrer" className="admin-btn-secondary" style={{ ...buttonSecondary, textDecoration: 'none' }}>
              <Icon name="globe" size={15} />
              View website
            </a>
          </>
        }
      />

      {/* Where saved edits go, until the backend exists. */}
      <div
        role="note"
        style={{
          ...panel,
          display: 'flex',
          gap: 12,
          alignItems: 'flex-start',
          padding: '14px 16px',
          marginBottom: 24,
          boxShadow: 'none',
          background: 'rgba(255,255,255,0.03)',
        }}
      >
        <Icon name="alert" size={17} style={{ color: 'var(--status-warning)', marginTop: 1 }} />
        <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.82)' }}>
          <strong style={{ color: '#FFFFFF' }}>Saved edits show on the website in this browser straight away.</strong>{' '}
          Visitors see them once the backend is connected. Until then, press <strong style={{ color: '#FFFFFF' }}>Export</strong> and
          send the file to your developer to publish.
        </p>
      </div>

      {areas.map((area) => (
        <section key={area} style={{ marginBottom: 28 }}>
          <h2 style={{ margin: '0 0 12px', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-text-faint)' }}>
            {area}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {contentGroups
              .filter((g) => g.area === area)
              .map((g) => {
                const value = content[g.key]
                const count = Array.isArray(value) ? value.length : null
                return (
                  <button
                    key={g.key}
                    onClick={() => setActiveKey(g.key)}
                    className="admin-content-card"
                    style={{
                      ...panel,
                      boxShadow: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      padding: 16,
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: 'inherit',
                      fontFamily: 'var(--font-body)',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, width: '100%' }}>
                      <span style={{ fontSize: 14.5, fontWeight: 700, color: '#FFFFFF' }}>{g.title}</span>
                      <Icon name="edit" size={15} style={{ color: 'var(--admin-text-muted)' }} />
                    </span>
                    <span style={{ fontSize: 12.5, lineHeight: 1.5, color: 'var(--admin-text-muted)' }}>{g.description}</span>
                    <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 4 }}>
                      {count !== null && <Chip>{count} {count === 1 ? 'item' : 'items'}</Chip>}
                      {edited.has(g.key) && <Chip strong>Edited</Chip>}
                    </span>
                  </button>
                )
              })}
          </div>
        </section>
      ))}
    </>
  )
}

function Chip({ children, strong }: { children: ReactNode; strong?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 22,
        padding: '0 9px',
        borderRadius: 999,
        fontSize: 11.5,
        fontWeight: 600,
        color: strong ? '#060606' : 'rgba(255,255,255,0.75)',
        background: strong ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.06)',
        border: strong ? 'none' : '1px solid var(--admin-hairline)',
      }}
    >
      {children}
    </span>
  )
}
