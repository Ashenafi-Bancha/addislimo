import { useState, type ChangeEvent, type CSSProperties } from 'react'
import { formatBytes, prepareImage } from '@/features/cms/image'
import { blankItem, type FieldSpec } from '@/features/cms/schema'
import Field, { formGrid, textarea } from '../../ui/Field'
import Icon from '../../ui/Icon'
import { buttonSecondary, iconButton, input, select } from '../../ui/styles'

/**
 * Inputs for every field type in the content schema. Each takes a value and
 * reports a new one; nothing here saves. The editor holds the draft and
 * writes it when the admin presses Save.
 */

type Item = Record<string, unknown>

/** The fields of one form, laid out in two columns (one on phones). */
export function ItemFields({ fields, value, onChange, idPrefix }: { fields: FieldSpec[]; value: Item; onChange: (next: Item) => void; idPrefix: string }) {
  return (
    <div className="admin-form-grid" style={formGrid}>
      {fields.map((f) => {
        const id = `${idPrefix}-${f.key}`
        const wide = f.full || f.type === 'objectList' || f.type === 'stringList' || f.type === 'image'
        return (
          <Field key={f.key} label={f.label} htmlFor={id} hint={f.hint} style={wide ? { gridColumn: '1 / -1' } : undefined}>
            <FieldInput id={id} spec={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
          </Field>
        )
      })}
    </div>
  )
}

function FieldInput({ id, spec, value, onChange }: { id: string; spec: FieldSpec; value: unknown; onChange: (v: unknown) => void }) {
  switch (spec.type) {
    case 'textarea':
      return <textarea id={id} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} placeholder={spec.placeholder} rows={3} style={textarea} />
    case 'number':
      return (
        <input
          id={id}
          type="number"
          value={Number.isFinite(Number(value)) ? String(value) : ''}
          onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
          style={{ ...input, maxWidth: 140 }}
        />
      )
    case 'select':
      return (
        <select id={id} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} style={select}>
          {spec.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )
    case 'image':
      return <ImageInput id={id} value={String(value ?? '')} onChange={onChange} />
    case 'stringList':
      return <StringList id={id} value={Array.isArray(value) ? (value as string[]) : []} onChange={onChange} />
    case 'objectList':
      return <ObjectList id={id} spec={spec} value={Array.isArray(value) ? (value as Item[]) : []} onChange={onChange} />
    default:
      return <input id={id} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)} placeholder={spec.placeholder} style={input} />
  }
}

/* ── Images ── */

function ImageInput({ id, value, onChange }: { id: string; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ tone: 'good' | 'critical'; text: string } | null>(null)
  const [broken, setBroken] = useState(false)

  const upload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = '' // lets the same file be chosen again after an error
    if (!file) return
    setBusy(true)
    setMessage(null)
    try {
      const prepared = await prepareImage(file)
      onChange(prepared.dataUrl)
      setBroken(false)
      const shrunk = prepared.bytes < prepared.originalBytes ? `, resized from ${formatBytes(prepared.originalBytes)} to ${formatBytes(prepared.bytes)}` : ''
      setMessage({ tone: 'good', text: `${file.name} added${shrunk}. Press Save to publish it.` })
    } catch (error) {
      setMessage({ tone: 'critical', text: error instanceof Error ? error.message : 'That image could not be used.' })
    } finally {
      setBusy(false)
    }
  }

  const isUpload = value.startsWith('data:')

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div
          style={{
            width: 112,
            height: 72,
            flexShrink: 0,
            borderRadius: 8,
            overflow: 'hidden',
            display: 'grid',
            placeItems: 'center',
            background: '#0B0B0B',
            border: '1px solid var(--admin-hairline-strong)',
            color: 'var(--admin-text-faint)',
          }}
        >
          {value && !broken ? (
            <img src={value} alt="" onError={() => setBroken(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <Icon name="image" size={22} />
          )}
        </div>
        <div style={{ flex: '1 1 220px', minWidth: 0, display: 'grid', gap: 8 }}>
          <input
            id={id}
            value={isUpload ? 'Uploaded image' : value}
            readOnly={isUpload}
            onChange={(e) => {
              setBroken(false)
              onChange(e.target.value)
            }}
            placeholder="Paste an image link, or upload"
            style={{ ...input, color: isUpload ? 'var(--admin-text-muted)' : '#FFFFFF' }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <label className="admin-btn-secondary" style={{ ...buttonSecondary, height: 34, fontSize: 12.5, opacity: busy ? 0.6 : 1 }}>
              <Icon name="upload" size={15} />
              {busy ? 'Preparing…' : 'Upload'}
              <input type="file" accept="image/*" onChange={upload} disabled={busy} style={srOnly} />
            </label>
            {value && (
              <button type="button" onClick={() => onChange('')} className="admin-btn-ghost" style={{ ...buttonSecondary, height: 34, fontSize: 12.5, background: 'transparent' }}>
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
      {broken && value && !isUpload && <p style={{ ...note, color: '#FFFFFF' }}>That link does not load an image. Check the address.</p>}
      {message && (
        <p role="status" style={{ ...note, color: '#FFFFFF' }}>
          <span aria-hidden="true" style={{ color: message.tone === 'good' ? 'var(--status-good)' : 'var(--status-critical)', marginRight: 6 }}>●</span>
          {message.text}
        </p>
      )}
    </div>
  )
}

/* ── Lists ── */

function move<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list
  const next = [...list]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function StringList({ id, value, onChange }: { id: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div style={{ display: 'grid', gap: 8 }}>
      {value.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            id={i === 0 ? id : undefined}
            aria-label={`Item ${i + 1}`}
            value={item}
            onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))}
            style={{ ...input, flex: 1, minWidth: 0 }}
          />
          <OrderButtons index={i} length={value.length} onMove={(to) => onChange(move(value, i, to))} />
          <SmallIconButton label={`Remove item ${i + 1}`} icon="trash" danger onClick={() => onChange(value.filter((_, j) => j !== i))} />
        </div>
      ))}
      <AddButton label="Add item" onClick={() => onChange([...value, ''])} />
    </div>
  )
}

function ObjectList({ id, spec, value, onChange }: { id: string; spec: FieldSpec; value: Item[]; onChange: (v: Item[]) => void }) {
  const [open, setOpen] = useState<number | null>(null)
  const fields = spec.itemFields ?? []
  const titleKey = spec.itemTitleKey ?? fields[0]?.key

  return (
    <div id={id} style={{ display: 'grid', gap: 8 }}>
      {value.map((item, i) => {
        const expanded = open === i
        return (
          <div key={i} style={{ border: '1px solid var(--admin-hairline-strong)', borderRadius: 10, background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 8px 8px 12px' }}>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : i)}
                aria-expanded={expanded}
                style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', textAlign: 'left', color: '#FFFFFF', fontFamily: 'var(--font-body)', fontSize: 13.5 }}
              >
                <Icon name={expanded ? 'chevronDown' : 'chevronRight'} size={15} style={{ color: 'var(--admin-text-muted)' }} />
                <span style={{ color: 'var(--admin-text-faint)', fontVariantNumeric: 'tabular-nums' }}>{i + 1}.</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{String(item[titleKey] || 'Untitled')}</span>
              </button>
              <OrderButtons index={i} length={value.length} onMove={(to) => { onChange(move(value, i, to)); setOpen(null) }} />
              <SmallIconButton
                label={`Remove ${String(item[titleKey] || 'item')}`}
                icon="trash"
                danger
                onClick={() => {
                  onChange(value.filter((_, j) => j !== i))
                  setOpen(null)
                }}
              />
            </div>
            {expanded && (
              <div style={{ padding: '4px 14px 16px', borderTop: '1px solid var(--admin-hairline)' }}>
                <div style={{ height: 12 }} />
                <ItemFields fields={fields} value={item} idPrefix={`${id}-${i}`} onChange={(next) => onChange(value.map((x, j) => (j === i ? next : x)))} />
              </div>
            )}
          </div>
        )
      })}
      <AddButton
        label={`Add to ${spec.label.toLowerCase()}`}
        onClick={() => {
          onChange([...value, blankItem(fields)])
          setOpen(value.length)
        }}
      />
    </div>
  )
}

export function OrderButtons({ index, length, onMove }: { index: number; length: number; onMove: (to: number) => void }) {
  return (
    <>
      <SmallIconButton label="Move up" icon="arrowUp" disabled={index === 0} onClick={() => onMove(index - 1)} />
      <SmallIconButton label="Move down" icon="arrowDown" disabled={index === length - 1} onClick={() => onMove(index + 1)} />
    </>
  )
}

export function SmallIconButton({
  label,
  icon,
  onClick,
  danger,
  disabled,
}: {
  label: string
  icon: 'arrowUp' | 'arrowDown' | 'trash' | 'edit'
  onClick: () => void
  danger?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={danger ? 'admin-icon-btn-danger' : 'admin-icon-btn'}
      style={{
        ...iconButton,
        width: 32,
        height: 32,
        borderRadius: 8,
        flexShrink: 0,
        borderColor: danger ? 'rgba(208,59,59,0.35)' : 'var(--admin-hairline)',
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      <Icon name={icon} size={15} />
    </button>
  )
}

export function AddButton({ label, onClick, style }: { label: string; onClick: () => void; style?: CSSProperties }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="admin-btn-secondary"
      style={{
        ...buttonSecondary,
        justifySelf: 'start',
        height: 34,
        fontSize: 12.5,
        background: 'transparent',
        borderStyle: 'dashed',
        ...style,
      }}
    >
      <Icon name="plus" size={15} strokeWidth={2} />
      {label}
    </button>
  )
}

const note: CSSProperties = {
  margin: '8px 0 0',
  fontFamily: 'var(--font-body)',
  fontSize: 12,
  lineHeight: 1.5,
  color: 'var(--admin-text-muted)',
}

const srOnly: CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0,0,0,0)',
  border: 0,
}
