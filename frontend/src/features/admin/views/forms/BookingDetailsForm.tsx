import { useState, type FormEvent } from 'react'
import { serviceOptions } from '@/features/booking/booking.data'
import type { Booking, ServiceId } from '@/types'
import { formatETB } from '../../format'
import { adminActions, notify } from '../../store'
import Field, { formGrid } from '../../ui/Field'
import { input, select } from '../../ui/styles'
import { FormActions } from './PartnerForm'
import { isEmail, isPhone } from './validate'

/** ISO timestamp to the `YYYY-MM-DDTHH:mm` a datetime-local input expects, in local time. */
function toLocalInput(iso: string): string {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

interface BookingDetailsFormProps {
  booking: Booking
  onDone: () => void
}

/**
 * The trip itself: who, where, when, and the price. Dispatch (driver,
 * vehicle, status) stays in the drawer's main view.
 */
export default function BookingDetailsForm({ booking, onDone }: BookingDetailsFormProps) {
  const [serviceId, setServiceId] = useState<ServiceId>(booking.serviceId)
  const [customerName, setCustomerName] = useState(booking.customerName)
  const [customerPhone, setCustomerPhone] = useState(booking.customerPhone)
  const [customerEmail, setCustomerEmail] = useState(booking.customerEmail)
  const [pickup, setPickup] = useState(booking.pickup)
  const [destination, setDestination] = useState(booking.destination)
  const [scheduledAt, setScheduledAt] = useState(toLocalInput(booking.scheduledAt))
  const [passengers, setPassengers] = useState(String(booking.passengers))
  const [amount, setAmount] = useState(String(booking.amount))
  const [tried, setTried] = useState(false)

  // The commission rate is fixed when the trip is priced; a new price keeps it.
  const rate = booking.amount > 0 ? booking.commission / booking.amount : 0
  const amountNumber = Number(amount)
  const paxNumber = Number(passengers)
  const when = new Date(scheduledAt)

  const errors = {
    customerName: customerName.trim() ? '' : 'Enter the customer’s name.',
    customerPhone: isPhone(customerPhone) ? '' : 'Enter a phone number.',
    customerEmail: isEmail(customerEmail) ? '' : 'Enter a valid email address.',
    pickup: pickup.trim() ? '' : 'Enter the pickup point.',
    destination: destination.trim() ? '' : 'Enter the destination.',
    scheduledAt: scheduledAt && !Number.isNaN(when.getTime()) ? '' : 'Choose the pickup date and time.',
    passengers: Number.isInteger(paxNumber) && paxNumber >= 1 && paxNumber <= 60 ? '' : 'Enter 1 to 60 passengers.',
    amount: amount.trim() !== '' && amountNumber >= 0 ? '' : 'Enter the price in ETB.',
  }
  const valid = Object.values(errors).every((e) => !e)
  const show = (e: string) => (tried ? e : '')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!valid) return
    adminActions.updateBooking(booking.id, {
      serviceId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      pickup: pickup.trim(),
      destination: destination.trim(),
      scheduledAt: when.toISOString(),
      passengers: paxNumber,
      amount: amountNumber,
      commission: Math.round(amountNumber * rate),
    })
    notify(`${booking.id} details saved`, 'good')
    onDone()
  }

  return (
    <form onSubmit={submit} noValidate style={{ paddingTop: 16 }}>
      <div className="admin-form-grid" style={formGrid}>
        <Field label="Service" htmlFor="bf-service" style={{ gridColumn: '1 / -1' }}>
          <select id="bf-service" value={serviceId} onChange={(e) => setServiceId(e.target.value as ServiceId)} style={select}>
            {serviceOptions.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Pickup date and time" htmlFor="bf-when" error={show(errors.scheduledAt)}>
          <input id="bf-when" type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} style={input} />
        </Field>
        <Field label="Passengers" htmlFor="bf-pax" error={show(errors.passengers)}>
          <input id="bf-pax" type="number" inputMode="numeric" min={1} value={passengers} onChange={(e) => setPassengers(e.target.value)} style={input} />
        </Field>
        <Field label="Pickup" htmlFor="bf-pickup" error={show(errors.pickup)} style={{ gridColumn: '1 / -1' }}>
          <input id="bf-pickup" value={pickup} onChange={(e) => setPickup(e.target.value)} style={input} />
        </Field>
        <Field label="Destination" htmlFor="bf-dest" error={show(errors.destination)} style={{ gridColumn: '1 / -1' }}>
          <input id="bf-dest" value={destination} onChange={(e) => setDestination(e.target.value)} style={input} />
        </Field>
        <Field label="Customer name" htmlFor="bf-name" error={show(errors.customerName)} style={{ gridColumn: '1 / -1' }}>
          <input id="bf-name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} style={input} />
        </Field>
        <Field label="Customer phone" htmlFor="bf-phone" error={show(errors.customerPhone)}>
          <input id="bf-phone" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} style={input} />
        </Field>
        <Field label="Customer email" htmlFor="bf-email" error={show(errors.customerEmail)}>
          <input id="bf-email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} style={input} />
        </Field>
        <Field
          label="Price (ETB)"
          htmlFor="bf-amount"
          error={show(errors.amount)}
          hint={`Commission stays at ${Math.round(rate * 100)}%: ${formatETB(Math.round((amountNumber || 0) * rate))} on this price.`}
          style={{ gridColumn: '1 / -1' }}
        >
          <input id="bf-amount" type="number" inputMode="numeric" min={0} step={50} value={amount} onChange={(e) => setAmount(e.target.value)} style={{ ...input, maxWidth: 200 }} />
        </Field>
      </div>

      <FormActions onCancel={onDone} submitLabel="Save details" />
    </form>
  )
}
