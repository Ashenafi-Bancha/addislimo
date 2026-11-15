import { contact } from '@/config/site'

/**
 * The trust strip that sits directly under the home hero.
 *
 * The figures are rounded claims requested by the client, but they are
 * checked against the catalogue rather than taken on trust: it holds 11
 * services (`data/service-catalog.ts`) and 69 destinations
 * (`data/destinations.ts`). "70+" used to sit one entry ahead of what the
 * site actually lists, which is the kind of small overstatement a visitor can
 * disprove by counting the cards, so it now says "69". Raise it when the
 * catalogue does.
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
    value: '69',
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
