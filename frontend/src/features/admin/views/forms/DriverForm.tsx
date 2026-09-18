import { useState, type FormEvent } from 'react'
import { newId } from '../../guards'
import { adminActions, notify, useAdminStore } from '../../store'
import type { Driver } from '../../types'
import Drawer from '../../ui/Drawer'
import Field, { formGrid } from '../../ui/Field'
import { input, select } from '../../ui/styles'
import { FormActions } from './PartnerForm'
import { isPhone } from './validate'

interface DriverFormProps {
  /** `undefined` keeps the drawer closed; `null` opens it for a new driver. */
  driver: Driver | null | undefined
  onClose: () => void
}

export default function DriverForm({ driver, onClose }: DriverFormProps) {
  const open = driver !== undefined
  return (
    <Drawer
      open={open}
      onClose={onClose}
      label={driver ? `Edit ${driver.name}` : 'Add driver'}
      title={driver ? 'Edit driver' : 'Add driver'}
      subtitle={driver ? driver.name : 'A chauffeur working for one of the partners.'}
    >
      {open && <DriverFields key={driver?.id ?? 'new'} driver={driver} onClose={onClose} />}
    </Drawer>
  )
}

function DriverFields({ driver, onClose }: { driver: Driver | null; onClose: () => void }) {
  const { partners, drivers } = useAdminStore()
  const [name, setName] = useState(driver?.name ?? '')
  const [phone, setPhone] = useState(driver?.phone ?? '')
  const [partnerId, setPartnerId] = useState(driver?.partnerId ?? partners[0]?.id ?? '')
  const [licenceNo, setLicenceNo] = useState(driver?.licenceNo ?? '')
  const [status, setStatus] = useState<Driver['status']>(driver?.status ?? 'Available')
  const [tried, setTried] = useState(false)

  const licence = licenceNo.trim().toUpperCase()
  const licenceTaken = drivers.some((d) => d.id !== driver?.id && d.licenceNo.toUpperCase() === licence)

  const errors = {
    name: name.trim() ? '' : 'Enter the driver’s full name.',
    phone: isPhone(phone) ? '' : 'Enter a phone number, e.g. +251 911 000 000.',
    partnerId: partnerId ? '' : 'Add a partner first; every driver works for one.',
    licenceNo: !licence ? 'Enter the licence number.' : licenceTaken ? 'Another driver already has this licence number.' : '',
  }
  const valid = Object.values(errors).every((e) => !e)
  const show = (e: string) => (tried ? e : '')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!valid) return
    const saved: Driver = {
      id: driver?.id ?? newId('d'),
      name: name.trim(),
      phone: phone.trim(),
      partnerId,
      licenceNo: licence,
      status,
      rating: driver?.rating ?? 0,
    }
    adminActions.saveDriver(saved)
    notify(driver ? `${saved.name} updated` : `${saved.name} added`, 'good')
    onClose()
  }

  return (
    <form onSubmit={submit} noValidate style={{ paddingTop: 16 }}>
      <div className="admin-form-grid" style={formGrid}>
        <Field label="Full name" htmlFor="df-name" error={show(errors.name)} style={{ gridColumn: '1 / -1' }}>
          <input id="df-name" value={name} onChange={(e) => setName(e.target.value)} style={input} autoComplete="name" />
        </Field>
        <Field label="Phone" htmlFor="df-phone" error={show(errors.phone)}>
          <input id="df-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={input} autoComplete="tel" />
        </Field>
        <Field label="Licence number" htmlFor="df-licence" error={show(errors.licenceNo)}>
          <input id="df-licence" value={licenceNo} onChange={(e) => setLicenceNo(e.target.value)} style={{ ...input, textTransform: 'uppercase' }} />
        </Field>
        <Field label="Partner" htmlFor="df-partner" error={show(errors.partnerId)} style={{ gridColumn: '1 / -1' }}>
          <select id="df-partner" value={partnerId} onChange={(e) => setPartnerId(e.target.value)} style={select}>
            {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field
          label="Availability"
          htmlFor="df-status"
          hint={'"On trip" is set automatically while a booking is under way.'}
          style={{ gridColumn: '1 / -1' }}
        >
          <select id="df-status" value={status} onChange={(e) => setStatus(e.target.value as Driver['status'])} style={select}>
            <option>Available</option>
            <option>Off Duty</option>
          </select>
        </Field>
      </div>

      <FormActions onCancel={onClose} submitLabel={driver ? 'Save changes' : 'Add driver'} />
    </form>
  )
}
