import { useMemo, useState, type ReactNode } from 'react'
import { hrefFor } from '@/app/routes'
import { contentActions, useContent, type ContentKey, type SiteContent } from '@/features/cms'
import { blankItem, type ContentGroup } from '@/features/cms/schema'
import { notify } from '../../store'
import ConfirmDialog from '../../ui/ConfirmDialog'
import Drawer from '../../ui/Drawer'
import Icon from '../../ui/Icon'
import SearchField from '../../ui/SearchField'
import { buttonGhost, buttonPrimary, buttonSecondary, panel } from '../../ui/styles'
import { AddButton, ItemFields, OrderButtons, SmallIconButton } from './fields'

type Item = Record<string, unknown>

/**
 * Strips whitespace from both ends of every string before saving. Nobody
 * means to type a trailing space, and it is invisible in a form.
 */
function trimStrings(value: unknown): unknown {
  if (typeof value === 'string') return value.trim()
  if (Array.isArray(value)) return value.map(trimStrings)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value as Item).map(([k, v]) => [k, trimStrings(v)]))
  }
  return value
}

interface ContentEditorProps {
  group: ContentGroup
  onBack: () => void
}

/**
 * Edits one content group. Changes are a draft until Save; Save writes the
 * whole group at once, which is how the backend will take it too.
 */
export default function ContentEditor({ group, onBack }: ContentEditorProps) {
  const saved = useContent(group.key)
  const [draft, setDraft] = useState<unknown>(saved)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const dirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved])
  const edited = contentActions.isEdited(group.key)

  const save = () => {
    const result = contentActions.save(group.key, trimStrings(draft) as SiteContent[ContentKey])
    if (result.ok) {
      setDraft(trimStrings(draft))
      notify(`${group.title} saved`, 'good')
    } else {
      notify(result.error, 'critical')
    }
  }

  const reset = () => {
    const result = contentActions.reset(group.key)
    setConfirmReset(false)
    if (!result.ok) return notify(result.error, 'critical')
    notify(`${group.title} restored`, 'neutral')
    onBack()
  }

  const back = () => (dirty ? setConfirmLeave(true) : onBack())

  return (
    <>
      <button onClick={back} className="admin-btn-ghost" style={{ ...buttonGhost, padding: '0 10px 0 6px', marginBottom: 14, marginLeft: -6 }}>
        <Icon name="arrowLeft" size={16} />
        Website Content
      </button>

      <div className="admin-page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 22 }}>
        <div style={{ minWidth: 0, maxWidth: 640 }}>
          <p style={{ margin: '0 0 6px', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-text-faint)' }}>
            {group.area}
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 2.4vw, 30px)', fontWeight: 700, color: '#FFFFFF', margin: 0, lineHeight: 1.15 }}>
            {group.title}
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--admin-text-muted)', margin: '6px 0 0' }}>{group.description}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {dirty && (
            <span role="status" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--font-body)', fontSize: 12.5, color: '#FFFFFF' }}>
              <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--status-warning)' }} />
              Unsaved changes
            </span>
          )}
          <a href={hrefFor(group.page)} target="_blank" rel="noopener noreferrer" className="admin-btn-secondary" style={{ ...buttonSecondary, textDecoration: 'none' }}>
            <Icon name="external" size={15} />
            View on site
          </a>
          <button onClick={save} disabled={!dirty} className="admin-btn" style={{ ...buttonPrimary, opacity: dirty ? 1 : 0.45, cursor: dirty ? 'pointer' : 'default' }}>
            <Icon name="check" size={15} strokeWidth={2} />
            Save
          </button>
        </div>
      </div>

      {group.kind === 'singleton' ? (
        <section style={{ ...panel, padding: 'clamp(16px, 3vw, 24px)' }}>
          <ItemFields fields={group.fields} value={draft as Item} idPrefix={group.key} onChange={setDraft} />
        </section>
      ) : (
        <CollectionList group={group} items={draft as Item[]} onChange={setDraft} />
      )}

      {edited && (
        <p style={{ margin: '18px 0 0', fontFamily: 'var(--font-body)', fontSize: 12.5, color: 'var(--admin-text-muted)' }}>
          This section has saved edits.{' '}
          <button onClick={() => setConfirmReset(true)} style={{ background: 'none', border: 'none', padding: 0, color: '#FFFFFF', textDecoration: 'underline', textUnderlineOffset: 3, cursor: 'pointer', font: 'inherit' }}>
            Restore the original content
          </button>
        </p>
      )}

      <ConfirmDialog
        open={confirmLeave}
        title="Leave without saving?"
        confirmLabel="Discard changes"
        cancelLabel="Keep editing"
        onConfirm={onBack}
        onClose={() => setConfirmLeave(false)}
      >
        Your changes to {group.title} have not been saved and will be lost.
      </ConfirmDialog>

      <ConfirmDialog
        open={confirmReset}
        title={`Restore ${group.title}?`}
        confirmLabel="Restore original"
        onConfirm={reset}
        onClose={() => setConfirmReset(false)}
      >
        Your saved edits to this section are removed, and the website shows its original content again.
      </ConfirmDialog>
    </>
  )
}

/* ── Collections: a list of like items, each edited in a drawer ── */

function CollectionList({ group, items, onChange }: { group: ContentGroup; items: Item[]; onChange: (next: Item[]) => void }) {
  const [editing, setEditing] = useState<number | null>(null)
  const [removing, setRemoving] = useState<number | null>(null)
  const [query, setQuery] = useState('')
  const titleKey = group.itemTitleKey ?? 'title'
  const subtitleKey = group.itemSubtitleKey
  const imageKey = group.itemImageKey

  const q = query.trim().toLowerCase()
  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => !q || Object.values(item).some((v) => typeof v === 'string' && !v.startsWith('data:') && v.toLowerCase().includes(q)))

  // Reordering a filtered list would be confusing, so it waits for a clear search.
  const canReorder = !q

  const add = () => {
    onChange([...items, blankItem(group.fields)])
    setQuery('')
    setEditing(items.length)
  }

  return (
    <section style={{ ...panel, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center', padding: 14, borderBottom: '1px solid var(--admin-hairline)' }}>
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--admin-text-muted)' }}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </span>
        {items.length > 8 && (
          <SearchField value={query} onChange={setQuery} placeholder={`Search ${group.title.toLowerCase()}`} style={{ flex: '1 1 200px', maxWidth: 320 }} />
        )}
        <span style={{ marginLeft: 'auto' }}>
          <AddButton label="Add new" onClick={add} style={{ background: 'var(--admin-raised)', borderStyle: 'solid' }} />
        </span>
      </div>

      {visible.length === 0 ? (
        <p style={{ margin: 0, padding: 28, textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: 13.5, color: 'var(--admin-text-muted)' }}>
          {items.length === 0 ? 'Nothing here yet. Add the first one.' : 'Nothing matches that search.'}
        </p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {visible.map(({ item, index }) => (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              {imageKey && (
                <span style={{ width: 64, height: 44, flexShrink: 0, borderRadius: 6, overflow: 'hidden', background: '#0B0B0B', border: '1px solid var(--admin-hairline)' }}>
                  {item[imageKey] ? <img src={String(item[imageKey])} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /> : null}
                </span>
              )}
              <button
                type="button"
                onClick={() => setEditing(index)}
                style={{ flex: 1, minWidth: 0, background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {String(item[titleKey] || 'Untitled')}
                </span>
                {subtitleKey && item[subtitleKey] ? (
                  <span style={{ display: 'block', marginTop: 2, fontSize: 12.5, color: 'var(--admin-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {String(item[subtitleKey])}
                  </span>
                ) : null}
              </button>
              <span className="admin-content-order" style={{ display: 'inline-flex', gap: 6 }}>
                {canReorder && <OrderButtons index={index} length={items.length} onMove={(to) => onChange(reorder(items, index, to))} />}
              </span>
              <SmallIconButton label={`Edit ${String(item[titleKey] || 'item')}`} icon="edit" onClick={() => setEditing(index)} />
              <SmallIconButton label={`Delete ${String(item[titleKey] || 'item')}`} icon="trash" danger onClick={() => setRemoving(index)} />
            </li>
          ))}
        </ul>
      )}

      <Drawer
        open={editing !== null && items[editing] !== undefined}
        onClose={() => setEditing(null)}
        label={`Edit ${group.title}`}
        title={editing !== null && items[editing] ? String(items[editing][titleKey] || 'New item') : ''}
        subtitle={`${group.title} · changes publish when you press Save`}
      >
        {editing !== null && items[editing] && (
          <DrawerBody>
            <ItemFields
              fields={group.fields}
              value={items[editing]}
              idPrefix={`${group.key}-${editing}`}
              onChange={(next) => onChange(items.map((x, i) => (i === editing ? next : x)))}
            />
            <div style={{ position: 'sticky', bottom: -24, margin: '24px -20px -24px', padding: '14px 20px', display: 'flex', justifyContent: 'flex-end', background: '#0A0A0A', borderTop: '1px solid var(--admin-hairline)' }}>
              <button onClick={() => setEditing(null)} className="admin-btn" style={buttonPrimary}>Done</button>
            </div>
          </DrawerBody>
        )}
      </Drawer>

      <ConfirmDialog
        open={removing !== null}
        title={`Delete ${removing !== null ? String(items[removing]?.[titleKey] || 'this item') : ''}?`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (removing !== null) onChange(items.filter((_, i) => i !== removing))
          setRemoving(null)
        }}
        onClose={() => setRemoving(null)}
      >
        It leaves the website when you press Save.
      </ConfirmDialog>
    </section>
  )
}

function DrawerBody({ children }: { children: ReactNode }) {
  return <div style={{ paddingTop: 16 }}>{children}</div>
}

function reorder<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}
