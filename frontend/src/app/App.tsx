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

type PageComponent = (props: { navigate: (page: Page) => void }) => React.ReactElement

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
  admin: AdminDashboard,
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
