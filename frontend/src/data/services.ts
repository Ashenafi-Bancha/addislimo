import type { Page } from '@/app/routes'

/** Service cards on the home page. Each one deep-links to where it is sold. */
export interface HomeService {
  title: string
  subtitle: string
  /** Glyph stand-in until the client supplies an icon set. */
  icon: string
  page: Page
}

export const homeServices: HomeService[] = [
  { title: 'Airport Transfer', subtitle: 'Bole International to your hotel or Airbnb, met at arrivals.', icon: '✈', page: 'airport' },
  { title: 'City Tour', subtitle: 'Bole, Kazanchis, Piassa, Mexico: the capital, district by district.', icon: '◉', page: 'explore' },
  { title: 'Summit & Conference', subtitle: 'African Union, ECA, AICC and UNECA delegation transfers.', icon: '◈', page: 'corporate' },
  { title: 'Expat Transport', subtitle: 'Standing arrangements for residents in Bole, CMC, Sarbet and beyond.', icon: '▣', page: 'booking' },
  { title: 'Executive & Corporate', subtitle: 'Professional chauffeurs for businesses, embassies and delegations.', icon: '◇', page: 'corporate' },
  { title: 'Point-to-Point', subtitle: 'Direct transport from one meeting or location to the next.', icon: '⟶', page: 'booking' },
  { title: 'Hourly Service', subtitle: 'A driver at your disposal for the hours or the day you need.', icon: '◷', page: 'booking' },
  { title: 'Weddings & Prom', subtitle: 'Elegant transport for weddings, prom and graduation nights.', icon: '✧', page: 'services' },
]

/** Reasons-to-believe strip on the home page. */
export interface Differentiator {
  n: string
  label: string
  desc: string
}

export const differentiators: Differentiator[] = [
  { n: '01', label: 'Verified Partner Network', desc: 'Every vehicle and chauffeur in our network is vetted and approved.' },
  { n: '02', label: 'Premium Vehicles', desc: 'Executive sedans, luxury SUVs and business vans, always immaculate.' },
  { n: '03', label: 'Professional Chauffeurs', desc: 'Trained, uniformed and dedicated to your comfort and privacy.' },
  { n: '04', label: 'Reliable Scheduling', desc: 'On-time, every time. Your schedule is our priority.' },
  { n: '05', label: 'Full Coordination', desc: 'We manage every detail. You simply arrive and travel in style.' },
  { n: '06', label: 'International Standard', desc: 'Service quality designed for global executives and discerning travelers.' },
]

/**
 * Service-area chips. Not rendered anywhere yet — kept because the home hero
 * is expected to gain a coverage strip once the client confirms the areas.
 */
export const serviceAreas = [
  'Airport Transfers',
  'Bole Road',
  'Kazanchis',
  'AU Headquarters',
  'Corporate Travel',
  'Weddings & Events',
  'City Tours',
]
