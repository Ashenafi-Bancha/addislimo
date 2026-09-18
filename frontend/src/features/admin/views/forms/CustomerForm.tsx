import { useState, type FormEvent } from 'react'
import { adminActions, notify } from '../../store'
import type { Customer } from '../../types'
import Drawer from '../../ui/Drawer'
import Field, { formGrid } from '../../ui/Field'
import { input } from '../../ui/styles'
import { FormActions } from './PartnerForm'
import { isEmail, isPhone } from './validate'

interface CustomerFormProps {
  customer: Customer | null
  onClose: () => void
}

/**
 * Edits a customer's contact details. A customer is every booking under one
 * email, so the change is written to all of them.
 */
export default function CustomerForm({ customer, onClose }: CustomerFormProps) {
  return (
    <Drawer
      open={customer !== null}
      onClose={onClose}
      label={customer ? `Edit ${customer.name}` : 'Edit customer'}
      title="Edit customer"
      subtitle={customer ? `Updates all ${customer.trips} of their bookings.` : undefined}
    >
      {customer && <CustomerFields key={customer.email} customer={customer} onClose={onClose} />}
    </Drawer>
  )
}

function CustomerFields({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  const [name, setName] = useState(customer.name)
  const [email, setEmail] = useState(customer.email)
  const [phone, setPhone] = useState(customer.phone)
  const [tried, setTried] = useState(false)

  const errors = {
    name: name.trim() ? '' : 'Enter the customer’s name.',
    email: isEmail(email) ? '' : 'Enter a valid email address.',
    phone: isPhone(phone) ? '' : 'Enter a phone number, e.g. +251 911 000 000.',
  }
  const valid = Object.values(errors).every((e) => !e)
  const show = (e: string) => (tried ? e : '')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!valid) return
    adminActions.updateCustomer(customer.email, {
      customerName: name.trim(),
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
    })
    notify(`${name.trim()} updated`, 'good')
    onClose()
  }

  return (
    <form onSubmit={submit} noValidate style={{ paddingTop: 16 }}>
      <div className="admin-form-grid" style={formGrid}>
        <Field label="Full name" htmlFor="cf-name" error={show(errors.name)} style={{ gridColumn: '1 / -1' }}>
          <input id="cf-name" value={name} onChange={(e) => setName(e.target.value)} style={input} autoComplete="name" />
        </Field>
        <Field
          label="Email"
          htmlFor="cf-email"
          error={show(errors.email)}
          hint="If another customer already uses this email, their bookings are combined."
          style={{ gridColumn: '1 / -1' }}
        >
          <input id="cf-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} autoComplete="email" />
        </Field>
        <Field label="Phone" htmlFor="cf-phone" error={show(errors.phone)} style={{ gridColumn: '1 / -1' }}>
          <input id="cf-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={input} autoComplete="tel" />
        </Field>
      </div>

      <FormActions onCancel={onClose} submitLabel="Save changes" />
    </form>
  )
}
