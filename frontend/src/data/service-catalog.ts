import type { Page } from '@/app/routes'

/**
 * The full service catalogue rendered on the Services page.
 *
 * Every entry maps to a heading in the client's service document ("Addis limo
 * service", Canva, Aug 2026): the four transport services on page 2, the
 * corporate section on page 3, the tour categories on pages 3–5, and the five
 * items under "other service" on page 5.
 */

export interface CatalogService {
  title: string
  tagline: string
  img: string
  features: string[]
  page: Page
  cta: string
}

export const serviceCatalog: CatalogService[] = [
  {
    // Document p.2 — "Airport transfer hotel/Airbnb"
    title: 'Airport Transfer: Hotel & Airbnb',
    tagline: 'Arrive in Addis with confidence.',
    img: 'https://images.unsplash.com/photo-1504150558240-0b4fd8946624?w=800&h=500&fit=crop&auto=format',
    features: ['Bole International pickup', 'Meet & greet at arrivals', 'Sheraton, Hilton, Hyatt', 'Continental, Skylight, Ramada', 'Best Western', 'Any Airbnb or residence'],
    page: 'airport',
    cta: 'Book Airport Transfer',
  },
  {
    // Document p.2 — "City tour"
    title: 'City Tour',
    tagline: 'See the capital, district by district.',
    img: 'https://images.unsplash.com/photo-1771350369025-47ef35c52e32?w=800&h=500&fit=crop&auto=format',
    features: ['Bole Main Road', 'Bole Edna Mall Road', 'Kazanchis', '4 Kilo Bet Mengist', 'Piassa & Adwa', 'Mexico Bank Skyscrapers'],
    page: 'explore',
    cta: 'Plan a City Tour',
  },
  {
    // Document p.2 — "Summit"
    title: 'Summit & Conference',
    tagline: 'Delegation transport, on the summit clock.',
    img: 'https://images.unsplash.com/photo-1503365194569-df4e1d04cec1?w=800&h=500&fit=crop&auto=format',
    features: ['African Union Headquarters', 'ECA Conference Center', 'Addis International Convention Center', 'UNECA Conference Center', 'Multi-vehicle coordination', 'Priority scheduling'],
    page: 'corporate',
    cta: 'Request Summit Transport',
  },
  {
    // Document p.2 — "EXpats"
    title: 'Expat Transport',
    tagline: 'A standing driver for life in Addis.',
    img: 'https://images.unsplash.com/photo-1570019112093-f46196e5e474?w=800&h=500&fit=crop&auto=format',
    features: ['Bole', 'Wello Sefer', 'Old Airport Sarbet', 'Kazanchis', 'CMC', 'Standing or ad-hoc arrangements'],
    page: 'booking',
    cta: 'Arrange Expat Transport',
  },
  {
    // Document p.3 — "Executive & Corporate Services"
    title: 'Executive & Corporate',
    tagline: 'Executive travel, without the friction.',
    img: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=800&h=500&fit=crop&auto=format',
    features: ['Account management', 'Monthly invoicing', 'Priority scheduling', 'Multi-passenger coordination', 'Conference transfers', 'NGO & embassy service'],
    page: 'corporate',
    cta: 'Request Corporate Service',
  },
  {
    // Document pp.3–5 — the tour categories, gathered under one entry
    title: 'Tours & Experiences',
    tagline: 'Museums, parks, hiking, markets, food.',
    img: 'https://images.unsplash.com/photo-1771350386143-20e64673331e?w=800&h=500&fit=crop&auto=format',
    features: ['Museums & historical landmarks', 'Parks & hiking', 'Authentic shopping & malls', 'Family activities', 'Architecture & entertainment', 'Cultural restaurants, food & drink'],
    page: 'explore',
    cta: 'Explore Addis',
  },
  {
    // Document p.5 — "other service"
    title: 'Point-to-Point City Transfers',
    tagline: 'Direct. Precise. Reliable.',
    img: 'https://images.unsplash.com/photo-1771350368994-9d87f0d8431f?w=800&h=500&fit=crop&auto=format',
    features: ['Direct transport between two points', 'Meeting to meeting', 'City-wide coverage', 'Fixed transparent pricing', 'On-demand or pre-booked', 'Executive chauffeur'],
    page: 'booking',
    cta: 'Book City Transfer',
  },
  {
    // Document p.5 — "other service"
    title: 'Hourly Service',
    tagline: 'A driver at your disposal.',
    img: 'https://images.unsplash.com/photo-1782225601955-a2a39cef7df1?w=800&h=500&fit=crop&auto=format',
    features: ['By the hour or the full day', 'Driver stays with you', 'Multiple stops', 'Dedicated vehicle', 'Business meetings', 'Events & shopping'],
    page: 'booking',
    cta: 'Book Hourly Service',
  },
  {
    // Document p.5 — "other service"
    title: 'Diplomatic & Embassy Transport',
    tagline: 'Discreet transport for missions and delegations.',
    img: 'https://images.unsplash.com/photo-1734865934450-719ef6f59a37?w=800&h=500&fit=crop&auto=format',
    features: ['Embassy and mission travel', 'Discreet and professional', 'Reliable scheduling', 'Airport transfers', 'Delegation support', 'Confidentiality assured'],
    page: 'booking',
    cta: 'Request Diplomatic Service',
  },
  {
    // Document p.5 — "other service"
    title: 'Wedding',
    tagline: 'Elegant transport for the day that matters.',
    img: 'https://images.unsplash.com/photo-1604560842632-bd795d8f1275?w=800&h=500&fit=crop&auto=format',
    features: ['Bride and groom vehicle', 'Guest and family transfers', 'Decorated premium vehicles', 'Venue-to-venue coordination', 'Photography stops', 'Group scheduling'],
    page: 'booking',
    cta: 'Plan Wedding Transport',
  },
  {
    // Document p.5 — "other service"
    title: 'Prom',
    tagline: 'Arrive at prom in style.',
    img: 'https://images.unsplash.com/photo-1630861412757-d9743d318312?w=800&h=500&fit=crop&auto=format',
    features: ['Prom and graduation nights', 'Group bookings', 'Premium vehicle classes', 'Parent-arranged reservations', 'Fixed pick-up and return times', 'Vetted chauffeurs'],
    page: 'booking',
    cta: 'Book Prom Transport',
  },
]
