import SiteLayout from '@/components/layout/SiteLayout'
import About from '@/pages/About'
import AdminDashboard from '@/pages/AdminDashboard'
import AdminLogin from '@/pages/AdminLogin'
import AirportTransfer from '@/pages/AirportTransfer'
import Booking from '@/pages/Booking'
import Confirmation from '@/pages/Confirmation'
import Corporate from '@/pages/Corporate'
import ExploreAddis from '@/pages/ExploreAddis'
import Home from '@/pages/Home'
import Services from '@/pages/Services'
import { useRouter } from './router'
import { routes, type Page } from './routes'

/** `null` is allowed so a guarded page can render nothing while it redirects. */
type PageComponent = (props: { navigate: (page: Page) => void }) => React.ReactElement | null

/**
 * Every page id maps to exactly one component. `routes.ts` decides the URL and
 * whether the site chrome is drawn; this map only decides what renders.
 */
const pageComponents: Record<Page, PageComponent> = {
  home: Home,
  services: Services,
  airport: AirportTransfer,
  explore: ExploreAddis,
  corporate: Corporate,
  booking: Booking,
  about: About,
  // No dedicated contact page yet — the About page carries the contact block.
  contact: About,
  confirmation: Confirmation,
  'admin-login': AdminLogin,
  // The console reads the current page itself to pick a section.
  admin: AdminDashboard,
  'admin-bookings': AdminDashboard,
  'admin-partners': AdminDashboard,
  'admin-fleet': AdminDashboard,
  'admin-customers': AdminDashboard,
  'admin-finance': AdminDashboard,
  'admin-settings': AdminDashboard,
}

export default function App() {
  const { page, navigate } = useRouter()
  const Page = pageComponents[page]

  return (
    <SiteLayout chrome={routes[page].chrome} page={page} navigate={navigate}>
      <Page navigate={navigate} />
    </SiteLayout>
  )
}
