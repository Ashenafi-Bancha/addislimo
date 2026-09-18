import { useState, type FormEvent } from 'react'
import { vehicleOptions } from '@/features/booking/booking.data'
import type { VehicleClassId } from '@/types'
import { newId } from '../../guards'
import { adminActions, notify, useAdminStore } from '../../store'
import type { FleetVehicle } from '../../types'
import Drawer from '../../ui/Drawer'
import Field, { formGrid } from '../../ui/Field'
import { input, select } from '../../ui/styles'
import { FormActions } from './PartnerForm'

interface VehicleFormProps {
  /** `undefined` keeps the drawer closed; `null` opens it for a new vehicle. */
  vehicle: FleetVehicle | null | undefined
  onClose: () => void
}

export default function VehicleForm({ vehicle, onClose }: VehicleFormProps) {
  const open = vehicle !== undefined
  return (
    <Drawer
      open={open}
      onClose={onClose}
      label={vehicle ? `Edit ${vehicle.make} ${vehicle.model}` : 'Add vehicle'}
      title={vehicle ? 'Edit vehicle' : 'Add vehicle'}
      subtitle={vehicle ? `${vehicle.make} ${vehicle.model} · ${vehicle.plate}` : 'A car a partner puts into the network.'}
    >
      {open && <VehicleFields key={vehicle?.id ?? 'new'} vehicle={vehicle} onClose={onClose} />}
    </Drawer>
  )
}

function VehicleFields({ vehicle, onClose }: { vehicle: FleetVehicle | null; onClose: () => void }) {
  const { partners, vehicles } = useAdminStore()
  const thisYear = new Date().getFullYear()

  const [partnerId, setPartnerId] = useState(vehicle?.partnerId ?? partners[0]?.id ?? '')
  const [make, setMake] = useState(vehicle?.make ?? '')
  const [model, setModel] = useState(vehicle?.model ?? '')
  const [year, setYear] = useState(String(vehicle?.year ?? thisYear))
  const [plate, setPlate] = useState(vehicle?.plate ?? '')
  const [vehicleClass, setVehicleClass] = useState<VehicleClassId>(vehicle?.vehicleClass ?? 'sedan')
  const [seats, setSeats] = useState(String(vehicle?.seats ?? 3))
  const [status, setStatus] = useState<FleetVehicle['status']>(vehicle?.status ?? 'Available')
  const [tried, setTried] = useState(false)

  const normalisedPlate = plate.trim().toUpperCase()
  const plateTaken = vehicles.some((v) => v.id !== vehicle?.id && v.plate.toUpperCase() === normalisedPlate)
  const yearNumber = Number(year)
  const seatNumber = Number(seats)

  const errors = {
    partnerId: partnerId ? '' : 'Add a partner first; every vehicle belongs to one.',
    make: make.trim() ? '' : 'Enter the make, e.g. Toyota.',
    model: model.trim() ? '' : 'Enter the model, e.g. Land Cruiser.',
    year: Number.isInteger(yearNumber) && yearNumber >= 1990 && yearNumber <= thisYear + 1 ? '' : `Enter a year from 1990 to ${thisYear + 1}.`,
    plate: !normalisedPlate ? 'Enter the plate number.' : plateTaken ? 'Another vehicle already has this plate.' : '',
    seats: Number.isInteger(seatNumber) && seatNumber >= 1 && seatNumber <= 60 ? '' : 'Enter the passenger seats, 1 to 60.',
  }
  const valid = Object.values(errors).every((e) => !e)
  const show = (e: string) => (tried ? e : '')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!valid) return
    const saved: FleetVehicle = {
      id: vehicle?.id ?? newId('v'),
      partnerId,
      make: make.trim(),
      model: model.trim(),
      year: yearNumber,
      plate: normalisedPlate,
      vehicleClass,
      seats: seatNumber,
      status,
    }
    adminActions.saveVehicle(saved)
    notify(vehicle ? `${saved.make} ${saved.model} updated` : `${saved.make} ${saved.model} added`, 'good')
    onClose()
  }

  return (
    <form onSubmit={submit} noValidate style={{ paddingTop: 16 }}>
      <div className="admin-form-grid" style={formGrid}>
        <Field label="Partner" htmlFor="vf-partner" error={show(errors.partnerId)} style={{ gridColumn: '1 / -1' }}>
          <select id="vf-partner" value={partnerId} onChange={(e) => setPartnerId(e.target.value)} style={select}>
            {partners.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </Field>
        <Field label="Make" htmlFor="vf-make" error={show(errors.make)}>
          <input id="vf-make" value={make} onChange={(e) => setMake(e.target.value)} style={input} />
        </Field>
        <Field label="Model" htmlFor="vf-model" error={show(errors.model)}>
          <input id="vf-model" value={model} onChange={(e) => setModel(e.target.value)} style={input} />
        </Field>
        <Field label="Year" htmlFor="vf-year" error={show(errors.year)}>
          <input id="vf-year" type="number" inputMode="numeric" value={year} onChange={(e) => setYear(e.target.value)} style={input} />
        </Field>
        <Field label="Plate" htmlFor="vf-plate" error={show(errors.plate)}>
          <input id="vf-plate" value={plate} onChange={(e) => setPlate(e.target.value)} style={{ ...input, textTransform: 'uppercase' }} />
        </Field>
        <Field label="Class" htmlFor="vf-class">
          <select id="vf-class" value={vehicleClass} onChange={(e) => setVehicleClass(e.target.value as VehicleClassId)} style={select}>
            {vehicleOptions.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        </Field>
        <Field label="Passenger seats" htmlFor="vf-seats" error={show(errors.seats)}>
          <input id="vf-seats" type="number" inputMode="numeric" min={1} value={seats} onChange={(e) => setSeats(e.target.value)} style={input} />
        </Field>
        <Field
          label="Availability"
          htmlFor="vf-status"
          hint={'"On trip" is set automatically while a booking is under way.'}
          style={{ gridColumn: '1 / -1' }}
        >
          <select id="vf-status" value={status} onChange={(e) => setStatus(e.target.value as FleetVehicle['status'])} style={select}>
            <option>Available</option>
            <option>Maintenance</option>
          </select>
        </Field>
      </div>

      <FormActions onCancel={onClose} submitLabel={vehicle ? 'Save changes' : 'Add vehicle'} />
    </form>
  )
}
