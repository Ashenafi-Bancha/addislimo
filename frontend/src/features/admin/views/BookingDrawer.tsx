import { useMemo, useState, type ReactNode } from 'react'
import type { Booking, BookingStatus } from '@/types'
import { formatETB, formatSchedule, timeAgo } from '../format'
import { checkBookingDelete } from '../guards'
import {
  BOOKING_STATUSES,
  driverStatuses,
  indexById,
  serviceLabel,
  vehicleLabel,
  vehicleStatuses,
} from '../selectors'
import { bookingStatusMeta } from '../status'
import { adminActions, notify, useAdminStore } from '../store'
import DeleteDialog from '../ui/DeleteDialog'
import Drawer from '../ui/Drawer'
import Icon, { type IconName } from '../ui/Icon'
import RowActions from '../ui/RowActions'
import StatusBadge from '../ui/StatusBadge'
import { buttonDanger, buttonGhost, buttonPrimary, fieldLabel, input, select, tabular } from '../ui/styles'
import BookingDetailsForm from './forms/BookingDetailsForm'

/** Statuses that describe a trip someone is already driving or about to. */
const NEEDS_DRIVER: ReadonlySet<BookingStatus> = new Set(['Assigned', 'Driver En Route', 'In Progress'])

/** Opens for whichever booking the store says is open, from any section. */
export default function BookingDrawer() {
  const state = useAdminStore()
  const booking = state.bookings.find((b) => b.id === state.openBookingId) ?? null

  return (
    <Drawer
      open={booking !== null}
      onClose={adminActions.closeBooking}
      label={booking ? `Booking ${booking.id}` : 'Booking'}
      title={booking ? booking.id : ''}
      subtitle={booking ? `${serviceLabel(booking.serviceId)} · booked ${timeAgo(booking.createdAt)}` : undefined}
      footer={null}
    >
      {/* Keyed so each booking starts from its own saved values. */}
      {booking && <BookingEditor key={booking.id} booking={booking} />}
    </Drawer>
  )
}

/**
 * Two modes: dispatch (driver, vehicle, status, notes) is where an admin
 * spends the day; "edit details" changes the trip itself.
 */
function BookingEditor({ booking }: { booking: Booking }) {
  const [editingDetails, setEditingDetails] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const state = useAdminStore()
  const deleteCheck = useMemo(() => (deleting ? checkBookingDelete(state, booking.id) : null), [deleting, state, booking.id])

  const confirmDelete = () => {
    adminActions.deleteBooking(booking.id)
    notify(`${booking.id} deleted`, 'critical')
  }

  return (
    <>
      {editingDetails ? (
        <BookingDetailsForm booking={booking} onDone={() => setEditingDetails(false)} />
      ) : (
        <DispatchEditor booking={booking} onEditDetails={() => setEditingDetails(true)} onDelete={() => setDeleting(true)} />
      )}
      <DeleteDialog
        noun="booking"
        name={deleting ? booking.id : null}
        check={deleteCheck}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(false)}
      />
    </>
  )
}

function DispatchEditor({ booking, onEditDetails, onDelete }: { booking: Booking; onEditDetails: () => void; onDelete: () => void }) {
  const state = useAdminStore()
  const [status, setStatus] = useState<BookingStatus>(booking.status)
  const [driverId, setDriverId] = useState(booking.driverId ?? '')
  const [vehicleId, setVehicleId] = useState(booking.vehicleId ?? '')
  const [notes, setNotes] = useState(booking.notes ?? '')
  const [confirmingCancel, setConfirmingCancel] = useState(false)

  const partner = useMemo(() => indexById(state.partners).get(booking.partnerId), [state.partners, booking.partnerId])
  const drivers = useMemo(() => state.drivers.filter((d) => d.partnerId === booking.partnerId), [state.drivers, booking.partnerId])
  const vehicles = useMemo(() => state.vehicles.filter((v) => v.partnerId === booking.partnerId), [state.vehicles, booking.partnerId])
  const driverState = useMemo(() => driverStatuses(state), [state])
  const vehicleState = useMemo(() => vehicleStatuses(state), [state])

  // Assigning a driver to an unassigned booking moves it along the workflow.
  const assigningNow = !booking.driverId && driverId !== ''
  const autoAssign = assigningNow && (status === 'Pending' || status === 'Confirmed')
  const finalStatus: BookingStatus = autoAssign ? 'Assigned' : status

  const missingDriver = NEEDS_DRIVER.has(finalStatus) && !driverId
  const missingVehicle = driverId !== '' && !vehicleId

  const dirty =
    status !== booking.status ||
    driverId !== (booking.driverId ?? '') ||
    vehicleId !== (booking.vehicleId ?? '') ||
    notes !== (booking.notes ?? '')

  const closed = booking.status === 'Cancelled' || booking.status === 'Completed'
  const rate = booking.amount > 0 ? Math.round((booking.commission / booking.amount) * 100) : 0

  const save = () => {
    adminActions.updateBooking(booking.id, {
      status: finalStatus,
      driverId: driverId || null,
      vehicleId: vehicleId || null,
      notes: notes.trim() || undefined,
    })
    notify(
      autoAssign ? `${booking.id} saved and moved to Assigned` : `${booking.id} saved`,
      'good',
    )
    adminActions.closeBooking()
  }

  const cancel = () => {
    adminActions.updateBooking(booking.id, { status: 'Cancelled' })
    notify(`${booking.id} cancelled`, 'critical')
    adminActions.closeBooking()
  }

  return (
    <>
      {/* Status and headline facts */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '16px 0' }}>
        <StatusBadge label={booking.status} meta={bookingStatusMeta[booking.status]} />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontWeight: 700, color: '#FFFFFF', ...tabular }}>
            {formatETB(booking.amount)}
          </span>
          <RowActions label={`booking ${booking.id}`} onEdit={onEditDetails} onDelete={onDelete} />
        </span>
      </div>

      <Section title="Schedule">
        <Fact icon="clock" label="Pickup" value={formatSchedule(booking.scheduledAt)} />
        <Fact icon="users" label="Passengers" value={String(booking.passengers)} />
      </Section>

      <Section title="Route">
        <div style={{ position: 'relative', paddingLeft: 26 }}>
          <span aria-hidden="true" style={{ position: 'absolute', left: 8, top: 12, bottom: 12, width: 1, background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), rgba(255,255,255,0.12))' }} />
          <RoutePoint icon="pin" label="Pickup" value={booking.pickup} />
          <RoutePoint icon="flag" label="Destination" value={booking.destination} />
        </div>
      </Section>

      <Section title="Customer">
        <Fact icon="user" label="Name" value={booking.customerName} />
        <Fact icon="phone" label="Phone" value={<a href={`tel:${booking.customerPhone.replace(/\s/g, '')}`} style={linkStyle}>{booking.customerPhone}</a>} />
        <Fact icon="mail" label="Email" value={<a href={`mailto:${booking.customerEmail}`} style={linkStyle}>{booking.customerEmail}</a>} />
      </Section>

      <Section title="Dispatch">
        <Fact
          icon="partners"
          label="Partner"
          value={
            partner ? (
              <>
                {partner.name}
                <a
                  href={`tel:${partner.phone.replace(/\s/g, '')}`}
                  style={{ ...linkStyle, display: 'block', marginTop: 2, fontSize: 12.5, whiteSpace: 'nowrap', color: 'var(--admin-text-muted)' }}
                >
                  {partner.phone}
                </a>
              </>
            ) : (
              'Unknown partner'
            )
          }
        />

        <div style={{ display: 'grid', gap: 14, marginTop: 14 }}>
          <div>
            <label htmlFor="bd-driver" style={fieldLabel}>Driver</label>
            <select id="bd-driver" value={driverId} onChange={(e) => setDriverId(e.target.value)} disabled={closed} style={select}>
              <option value="">Unassigned</option>
              {driverId && !drivers.some((d) => d.id === driverId) && <option value={driverId}>Removed driver</option>}
              {drivers.map((d) => {
                const s = driverState.get(d.id)
                const busyElsewhere = s === 'On Trip' && d.id !== booking.driverId
                return (
                  <option key={d.id} value={d.id}>
                    {d.name}{s && s !== 'Available' ? ` (${busyElsewhere ? 'on another trip' : s.toLowerCase()})` : ''}
                  </option>
                )
              })}
            </select>
            {autoAssign && (
              <p style={hintStyle}>Saving will move this booking to Assigned.</p>
            )}
          </div>

          <div>
            <label htmlFor="bd-vehicle" style={fieldLabel}>Vehicle</label>
            <select id="bd-vehicle" value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} disabled={closed} style={select}>
              <option value="">Unassigned</option>
              {vehicleId && !vehicles.some((v) => v.id === vehicleId) && <option value={vehicleId}>Removed vehicle</option>}
              {vehicles.map((v) => {
                const s = vehicleState.get(v.id)
                return (
                  <option key={v.id} value={v.id} disabled={s === 'Maintenance'}>
                    {vehicleLabel(v)} · {v.plate}{s && s !== 'Available' ? ` (${s.toLowerCase()})` : ''}
                  </option>
                )
              })}
            </select>
            {missingVehicle && <p style={hintStyle}>Choose the vehicle this driver will use.</p>}
          </div>

          <div>
            <label htmlFor="bd-status" style={fieldLabel}>Status</label>
            <select id="bd-status" value={status} onChange={(e) => setStatus(e.target.value as BookingStatus)} disabled={closed} style={select}>
              {BOOKING_STATUSES.filter((s) => s !== 'Cancelled').map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {missingDriver && (
              <p role="alert" style={{ ...hintStyle, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Icon name="alert" size={13} style={{ color: 'var(--status-warning)' }} />
                Assign a driver before marking it {finalStatus}.
              </p>
            )}
          </div>
        </div>
      </Section>

      <Section title="Payment">
        <Row label="Booking value" value={formatETB(booking.amount)} />
        <Row label={`Addis Limo commission (${rate}%)`} value={formatETB(booking.commission)} />
        <Row label={`Payout to ${partner?.name ?? 'partner'}`} value={formatETB(booking.amount - booking.commission)} strong />
      </Section>

      <Section title="Notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Instructions for dispatch or the driver"
          rows={3}
          style={{ ...input, height: 'auto', padding: '10px 12px', lineHeight: 1.5, resize: 'vertical' }}
        />
      </Section>

      {/* Actions, pinned to the bottom of the drawer */}
      <div
        className="admin-drawer-actions"
        style={{
          position: 'sticky',
          bottom: -24,
          margin: '20px -20px -24px',
          padding: '14px 20px',
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          alignItems: 'center',
          background: '#0A0A0A',
          borderTop: '1px solid var(--admin-hairline)',
        }}
      >
        {confirmingCancel ? (
          <>
            <p className="admin-action-note" style={{ flex: '1 1 100%', margin: '0 0 4px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.85)' }}>
              Cancel {booking.id}? The customer is not notified automatically.
            </p>
            <button onClick={() => setConfirmingCancel(false)} className="admin-btn-ghost admin-action-secondary" style={buttonGhost}>Keep booking</button>
            <div className="admin-action-spacer" style={{ flex: 1 }} />
            <button onClick={cancel} className="admin-btn-danger admin-action-primary" style={buttonDanger}>Yes, cancel booking</button>
          </>
        ) : (
          <>
            {!closed && (
              <button onClick={() => setConfirmingCancel(true)} className="admin-btn-danger admin-action-secondary" style={buttonDanger}>
                Cancel booking
              </button>
            )}
            <div className="admin-action-spacer" style={{ flex: 1 }} />
            <button onClick={adminActions.closeBooking} className="admin-btn-ghost admin-action-secondary" style={buttonGhost}>Close</button>
            {!closed && (
              <button onClick={save} disabled={!dirty || missingDriver || missingVehicle} className="admin-btn admin-action-primary" style={buttonPrimary}>
                Save changes
              </button>
            )}
          </>
        )}
      </div>
    </>
  )
}

const linkStyle = { color: '#FFFFFF', textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.3)', textUnderlineOffset: 3 }

const hintStyle = {
  margin: '6px 0 0',
  fontFamily: 'var(--font-body)',
  fontSize: 12,
  color: 'var(--admin-text-muted)',
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ padding: '16px 0', borderTop: '1px solid var(--admin-hairline)' }}>
      <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--admin-text-faint)' }}>
        {title}
      </h3>
      {children}
    </section>
  )
}

function Fact({ icon, label, value }: { icon: IconName; label: string; value: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '6px 0' }}>
      <span style={{ color: 'var(--admin-text-faint)', paddingTop: 1 }}>
        <Icon name={icon} size={16} />
      </span>
      <span style={{ flex: '0 0 92px', fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--admin-text-muted)' }}>{label}</span>
      <span style={{ flex: 1, minWidth: 0, fontFamily: 'var(--font-body)', fontSize: 13.5, color: '#FFFFFF', overflowWrap: 'anywhere' }}>{value}</span>
    </div>
  )
}

function RoutePoint({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <div style={{ position: 'relative', padding: '6px 0' }}>
      <span style={{ position: 'absolute', left: -26, top: 7, width: 17, height: 17, display: 'grid', placeItems: 'center', background: '#0B0B0B', color: 'rgba(255,255,255,0.8)' }}>
        <Icon name={icon} size={15} />
      </span>
      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 11.5, color: 'var(--admin-text-muted)' }}>{label}</span>
      <span style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, color: '#FFFFFF', marginTop: 1 }}>{value}</span>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: 12,
        padding: '8px 0',
        borderTop: strong ? '1px solid var(--admin-hairline)' : 'none',
        marginTop: strong ? 4 : 0,
      }}
    >
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: strong ? '#FFFFFF' : 'var(--admin-text-muted)', fontWeight: strong ? 600 : 400 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 13.5, color: '#FFFFFF', fontWeight: strong ? 700 : 600, ...tabular }}>{value}</span>
    </div>
  )
}
