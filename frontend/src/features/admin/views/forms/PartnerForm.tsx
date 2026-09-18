import { useState, type FormEvent } from 'react'
import { newId } from '../../guards'
import { adminActions, notify, useAdminStore } from '../../store'
import type { FleetPartner, PartnerStatus } from '../../types'
import Drawer from '../../ui/Drawer'
import Field, { formGrid } from '../../ui/Field'
import { buttonGhost, buttonPrimary, input, select } from '../../ui/styles'
import { isEmail, isPhone } from './validate'

const partnerTypes: FleetPartner['type'][] = ['Transport Company', 'Vehicle Owner', 'Tour Operator', 'Events Transport']
const statuses: PartnerStatus[] = ['Active', 'Pending', 'Suspended']

interface PartnerFormProps {
  /** `undefined` keeps the drawer closed; `null` opens it for a new partner. */
  partner: FleetPartner | null | undefined
  onClose: () => void
}

export default function PartnerForm({ partner, onClose }: PartnerFormProps) {
  const open = partner !== undefined
  return (
    <Drawer
      open={open}
      onClose={onClose}
      label={partner ? `Edit ${partner.name}` : 'Add partner'}
      title={partner ? 'Edit partner' : 'Add partner'}
      subtitle={partner ? partner.name : 'A transport company, owner or operator in the network.'}
    >
      {open && <PartnerFields key={partner?.id ?? 'new'} partner={partner} onClose={onClose} />}
    </Drawer>
  )
}

function PartnerFields({ partner, onClose }: { partner: FleetPartner | null; onClose: () => void }) {
  const { settings } = useAdminStore()
  const [name, setName] = useState(partner?.name ?? '')
  const [type, setType] = useState<FleetPartner['type']>(partner?.type ?? 'Transport Company')
  const [contactName, setContactName] = useState(partner?.contactName ?? '')
  const [phone, setPhone] = useState(partner?.phone ?? '')
  const [email, setEmail] = useState(partner?.email ?? '')
  const [rate, setRate] = useState(String(partner?.commissionRate ?? settings.defaultCommissionRate))
  const [status, setStatus] = useState<PartnerStatus>(partner?.status ?? 'Active')
  const [tried, setTried] = useState(false)

  const rateNumber = Number(rate)
  const errors = {
    name: name.trim() ? '' : 'Enter the business name.',
    contactName: contactName.trim() ? '' : 'Enter who to contact.',
    phone: isPhone(phone) ? '' : 'Enter a phone number, e.g. +251 911 000 000.',
    email: isEmail(email) ? '' : 'Enter a valid email address.',
    rate: rate.trim() !== '' && rateNumber >= 0 && rateNumber <= 50 ? '' : 'Enter a percentage from 0 to 50.',
  }
  const valid = Object.values(errors).every((e) => !e)
  const show = (e: string) => (tried ? e : '')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!valid) return
    const saved: FleetPartner = {
      id: partner?.id ?? newId('p'),
      name: name.trim(),
      type,
      contactName: contactName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      commissionRate: rateNumber,
      status,
      rating: partner?.rating ?? 0,
      joinedAt: partner?.joinedAt ?? new Date().toISOString(),
    }
    adminActions.savePartner(saved)
    notify(partner ? `${saved.name} updated` : `${saved.name} added`, 'good')
    onClose()
  }

  return (
    <form onSubmit={submit} noValidate style={{ paddingTop: 16 }}>
      <div className="admin-form-grid" style={formGrid}>
        <Field label="Business name" htmlFor="pf-name" error={show(errors.name)} style={{ gridColumn: '1 / -1' }}>
          <input id="pf-name" value={name} onChange={(e) => setName(e.target.value)} style={input} autoComplete="organization" />
        </Field>
        <Field label="Type" htmlFor="pf-type">
          <select id="pf-type" value={type} onChange={(e) => setType(e.target.value as FleetPartner['type'])} style={select}>
            {partnerTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Status" htmlFor="pf-status">
          <select id="pf-status" value={status} onChange={(e) => setStatus(e.target.value as PartnerStatus)} style={select}>
            {statuses.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Contact person" htmlFor="pf-contact" error={show(errors.contactName)} style={{ gridColumn: '1 / -1' }}>
          <input id="pf-contact" value={contactName} onChange={(e) => setContactName(e.target.value)} style={input} autoComplete="name" />
        </Field>
        <Field label="Phone" htmlFor="pf-phone" error={show(errors.phone)}>
          <input id="pf-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={input} autoComplete="tel" />
        </Field>
        <Field label="Email" htmlFor="pf-email" error={show(errors.email)}>
          <input id="pf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} autoComplete="email" />
        </Field>
        <Field
          label="Commission"
          htmlFor="pf-rate"
          error={show(errors.rate)}
          hint="Percentage Addis Limo keeps on each trip. Existing bookings keep the rate they were priced at."
          style={{ gridColumn: '1 / -1' }}
        >
          <div style={{ position: 'relative', maxWidth: 160 }}>
            <input id="pf-rate" type="number" inputMode="decimal" min={0} max={50} step={0.5} value={rate} onChange={(e) => setRate(e.target.value)} style={{ ...input, paddingRight: 30 }} />
            <span aria-hidden="true" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--admin-text-muted)' }}>%</span>
          </div>
        </Field>
      </div>

      <FormActions onCancel={onClose} submitLabel={partner ? 'Save changes' : 'Add partner'} />
    </form>
  )
}

/** Cancel and submit, pinned to the bottom of the drawer. */
export function FormActions({ onCancel, submitLabel }: { onCancel: () => void; submitLabel: string }) {
  return (
    <div
      style={{
        position: 'sticky',
        bottom: -24,
        margin: '24px -20px -24px',
        padding: '14px 20px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 10,
        background: '#0A0A0A',
        borderTop: '1px solid var(--admin-hairline)',
      }}
    >
      <button type="button" onClick={onCancel} className="admin-btn-ghost" style={buttonGhost}>Cancel</button>
      <button type="submit" className="admin-btn" style={buttonPrimary}>{submitLabel}</button>
    </div>
  )
}
