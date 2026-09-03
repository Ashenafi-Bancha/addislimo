import { contact } from '@/config/site'

/**
 * The trust strip that sits directly under the home hero.
 *
 * The figures are rounded claims requested by the client rather than live
 * counts. For reference, the catalogue currently holds 11 services
 * (`data/service-catalog.ts`) and 69 destinations (`data/destinations.ts`),
 * so "70+" is one entry ahead of what the site actually lists — worth either
 * adding a destination or confirming the real number with the client.
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
    value: '10+',
    label: 'Services',
    desc: 'Airport, corporate, summit, expat, events and city transfers.',
  },
  {
    icon: '◉',
    value: '70+',
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
