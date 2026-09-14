import { useCallback, useEffect, useState } from 'react'
import { useRouter } from '@/app/router'
import { isAdminConsolePage, type Page } from '@/app/routes'
import AdminShell from '@/features/admin/layout/AdminShell'
import { sectionForPage } from '@/features/admin/nav'
import { getSession, signOut, type AdminSession } from '@/features/admin/session'
import { adminActions } from '@/features/admin/store'
import BookingDrawer from '@/features/admin/views/BookingDrawer'
import BookingsView from '@/features/admin/views/BookingsView'
import CustomersView from '@/features/admin/views/CustomersView'
import FinanceView from '@/features/admin/views/FinanceView'
import FleetView from '@/features/admin/views/FleetView'
import OverviewView from '@/features/admin/views/OverviewView'
import PartnersView from '@/features/admin/views/PartnersView'
import SettingsView from '@/features/admin/views/SettingsView'

interface Props {
  navigate: (p: Page) => void
}

/**
 * The admin console. One component serves every `/admin/*` route; the current
 * page decides which section renders, so the shell stays mounted while an
 * admin moves between sections.
 */
export default function AdminDashboard({ navigate }: Props) {
  const { page } = useRouter()
  const [session] = useState<AdminSession | null>(getSession)

  // Not signed in: go to the sign-in page instead of flashing the console.
  useEffect(() => {
    if (!session) navigate('admin-login')
  }, [session, navigate])

  const handleSignOut = useCallback(() => {
    signOut()
    adminActions.closeBooking()
    navigate('admin-login')
  }, [navigate])

  if (!session || !isAdminConsolePage(page)) return null

  const { section } = sectionForPage(page)

  return (
    <AdminShell current={page} navigate={navigate} session={session} onSignOut={handleSignOut}>
      {section === 'overview' && <OverviewView navigate={navigate} session={session} />}
      {section === 'bookings' && <BookingsView />}
      {section === 'partners' && <PartnersView />}
      {section === 'fleet' && <FleetView />}
      {section === 'customers' && <CustomersView navigate={navigate} />}
      {section === 'finance' && <FinanceView navigate={navigate} />}
      {section === 'settings' && <SettingsView session={session} onSignOut={handleSignOut} />}
      <BookingDrawer />
    </AdminShell>
  )
}
