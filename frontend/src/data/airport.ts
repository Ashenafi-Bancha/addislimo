/**
 * Airport Transfer page content.
 *
 * The destination groups come from the client's service document ("Addis limo
 * service", Canva, Aug 2026) page 2, which lists four tabbed sets under the
 * "Airport transfer hotel/Airbnb" heading: hotels, city-tour districts, summit
 * halls and expat areas.
 */

/** Hotels named in the client document, in its order. */
export const airportHotels = [
  'Sheraton Addis',
  'Hilton Addis Ababa',
  'Hyatt Regency',
  'Continental Hotel',
  'Skylight Hotel',
  'Ramada',
  'Best Western',
]

export interface DestinationGroup {
  id: string
  label: string
  /** Shown under the tab row. */
  blurb: string
  places: string[]
}

/**
 * The four tabbed lists from the document. Rendered by the "Where we take you"
 * section on the Airport Transfer page.
 */
export const airportDestinationGroups: DestinationGroup[] = [
  {
    id: 'hotels',
    label: 'Hotels & Airbnb',
    blurb: 'Direct transfers between Bole International and your hotel or Airbnb, with meet and greet at arrivals.',
    places: [...airportHotels, 'Any Airbnb or private residence'],
  },
  {
    id: 'city-tour',
    label: 'City Tour',
    blurb: 'The districts we cover on a guided city tour, each with a chauffeur who knows the route.',
    places: [
      'Bole Main Road',
      'Bole Edna Mall Road',
      'Kazanchis',
      '4 Kilo Bet Mengist',
      'Piassa & Adwa',
      'Mexico Bank Skyscrapers',
    ],
  },
  {
    id: 'summit',
    label: 'Summit',
    blurb: 'Conference and summit venues we serve daily, including multi-vehicle delegation transfers.',
    places: [
      'African Union Headquarters',
      'ECA Conference Center',
      'Addis International Convention Center',
      'UNECA Conference Center',
    ],
  },
  {
    id: 'expats',
    label: 'Expats',
    blurb: 'Residential areas where our expat clients live and travel from, on standing or ad-hoc arrangements.',
    places: [
      'Bole',
      'Wello Sefer',
      'Old Airport Sarbet',
      'Kazanchis',
      'CMC',
    ],
  },
]

export const airportSteps = [
  { n: 1, title: 'Book', desc: 'Reserve your transfer online with flight details' },
  { n: 2, title: 'Coordinate', desc: 'We confirm your chauffeur and vehicle assignment' },
  { n: 3, title: 'Arrive', desc: 'Your chauffeur meets you at arrivals with your name' },
  { n: 4, title: 'Travel', desc: 'Relax and arrive at your destination in style' },
]

export const airportFeatures = [
  { icon: '✈', title: 'Professional Meet & Greet', desc: 'Your chauffeur awaits with a name sign at the arrivals hall.' },
  { icon: '◷', title: 'On-Time Coordination', desc: 'We coordinate around your flight schedule and arrival time.' },
  { icon: '◈', title: 'Premium Vehicles', desc: 'Executive sedans, premium SUVs and business vans available.' },
  { icon: '◇', title: 'Luggage Assistance', desc: 'Full passenger and luggage assistance from arrival to vehicle.' },
  { icon: '◉', title: 'Hotels & Airbnb', desc: 'Hotels, Airbnb, residences and offices, anywhere in Addis Ababa.' },
  { icon: '→', title: 'Departure Transfers', desc: 'Return transfers to Bole International, timed perfectly.' },
]
