import { destinations } from './destinations'
import { serviceCatalog } from './service-catalog'
import { contact } from '@/config/site'

/**
 * The trust strip that sits directly under the home hero.
 *
 * Two of the four figures are counted from the real catalogue rather than
 * typed in, so they can never drift out of date when the client adds a
 * service or a destination. The other two are commitments the site already
 * makes elsewhere (the 24/7 line in `config/site.ts`, the meet-and-greet
 * promise on the Airport Transfer page).
 */

export interface TrustBadge {
  /** Glyph stand-in until the client supplies an icon set. */
  icon: string
  /** The large display-font figure. */
  value: string
  label: string
  desc: string
}

export const trustBadges: TrustBadge[] = [
  {
    icon: '◈',
    value: String(serviceCatalog.length),
    label: 'Services',
    desc: 'Airport, corporate, summit, expat, events and city transfers.',
  },
  {
    icon: '◉',
    value: String(destinations.length),
    label: 'Curated Experiences',
    desc: 'Museums, parks, hiking, markets, malls and cultural dining.',
  },
  {
    icon: '◷',
    value: contact.hours,
    label: 'Dispatch & Support',
    desc: 'Reserve ahead or call on the day. Someone is always reachable.',
  },
  {
    icon: '✦',
    value: 'Vetted',
    label: 'Partner Network',
    desc: 'Every vehicle and chauffeur in the network is checked and approved.',
  },
]
