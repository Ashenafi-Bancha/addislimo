import type { Page } from '@/app/routes'

/**
 * Brand, contact and navigation facts.
 *
 * Anything a client would want changed on a phone call belongs here rather
 * than hard-coded in a component — phone numbers, the tagline, social links,
 * which pages appear in the header.
 */

export const site = {
  name: 'Addis Limo',
  /** Rendered under the logo mark. */
  tagline: 'Premium Transportation',
  /**
   * The client's strapline, from page 1 of their service document. Their
   * original reads "Experince the capital city of africa in class" — the
   * spelling and capitalisation are corrected here for display.
   */
  slogan: 'Experience the capital city of Africa in class.',
  monogram: 'AL',
  description:
    'Premium chauffeur and transportation platform in Addis Ababa offering reliable booking, partner-managed luxury vehicles, and seamless service for travelers and businesses.',
  city: 'Addis Ababa',
  country: 'Ethiopia',
  currency: 'ETB',
} as const

export const contact = {
  email: 'info@addislimo.com',
  /** Placeholder until the client supplies the live line. */
  phone: '+251 (coming soon)',
  /** Digits only, for `tel:` / `wa.me` links. Empty until confirmed. */
  phoneHref: '',
  whatsapp: '',
  address: 'Addis Ababa, Ethiopia',
  hours: '24 / 7',
} as const

export const socials: { label: string; href: string }[] = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Facebook', href: 'https://facebook.com' },
  { label: 'X (Twitter)', href: 'https://x.com' },
  { label: 'LinkedIn', href: 'https://linkedin.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
]

export interface NavLink {
  label: string
  page: Page
}

/** Links shown in the desktop header and the mobile drawer. */
export const mainNav: NavLink[] = [
  { label: 'Home', page: 'home' },
  { label: 'Services', page: 'services' },
  { label: 'Airport', page: 'airport' },
  { label: 'Corporate', page: 'corporate' },
  { label: 'Explore Addis', page: 'explore' },
  { label: 'About Us', page: 'about' },
]

/** The single call-to-action pinned to the right of the header. */
export const primaryCta = { label: 'Book Now', page: 'booking' as Page }

export interface QuickLink extends NavLink {
  /** One line of context under the label. */
  desc: string
}

/**
 * The shortcut grid on the home page, between the trust strip and the service
 * cards. Six destinations someone most often arrives looking for, so they can
 * skip the scroll.
 */
export const quickLinks: QuickLink[] = [
  { label: 'Book a Ride', desc: 'Five steps, from service to confirmation.', page: 'booking' },
  { label: 'Airport Transfer', desc: 'Bole International to your hotel or Airbnb.', page: 'airport' },
  { label: 'Explore Addis', desc: 'Museums, parks, markets, food and nightlife.', page: 'explore' },
  { label: 'Corporate & Summit', desc: 'Delegations, embassies and conference venues.', page: 'corporate' },
  { label: 'All Services', desc: 'The full catalogue, from hourly to weddings.', page: 'services' },
  { label: 'About Addis Limo', desc: 'Who we are and how the network works.', page: 'about' },
]
