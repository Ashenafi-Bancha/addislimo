/**
 * Explore Addis — the tour catalogue.
 *
 * Every entry below comes from the client's service document ("Addis limo
 * service", Canva, Aug 2026), pages 3–5. The categories are the document's own
 * headings, in its order: Museum & Historical Landmark Tours, Park, Hiking,
 * Authentic Shopping, Family activities, Malls, Architecture, Entertainment,
 * cultural restaurant, Food and drink.
 *
 * Descriptions are written for the site; the client did not supply copy. Photography
 * is placeholder Unsplash imagery assigned per category — swap `imagePool` for
 * real photography when the client supplies it.
 */

export type Category =
  | 'all'
  | 'museums'
  | 'parks'
  | 'hiking'
  | 'shopping'
  | 'family'
  | 'malls'
  | 'architecture'
  | 'entertainment'
  | 'restaurants'
  | 'food'

/** Tabs above the destination grid, in the client document's order. */
export const categories: { id: Category; label: string }[] = [
  { id: 'all', label: 'All Experiences' },
  { id: 'museums', label: 'Museums & Landmarks' },
  { id: 'parks', label: 'Parks' },
  { id: 'hiking', label: 'Hiking' },
  { id: 'shopping', label: 'Authentic Shopping' },
  { id: 'family', label: 'Family Activities' },
  { id: 'malls', label: 'Malls' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'restaurants', label: 'Cultural Restaurants' },
  { id: 'food', label: 'Food & Drink' },
]

export interface Destination {
  cat: Exclude<Category, 'all'>
  name: string
  desc: string
  img: string
  tag: string
}

/**
 * Placeholder photography, grouped by mood and cycled per category so no two
 * adjacent cards repeat. Replace with real images keyed by destination name.
 */
const imagePool: Record<'heritage' | 'nature' | 'city' | 'dining', string[]> = {
  heritage: [
    'https://images.unsplash.com/photo-1771350386143-20e64673331e?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1604560842632-bd795d8f1275?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1734865934450-719ef6f59a37?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1771350369025-47ef35c52e32?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1771350368994-9d87f0d8431f?w=500&h=320&fit=crop&auto=format',
  ],
  nature: [
    'https://images.unsplash.com/photo-1771350368994-9d87f0d8431f?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1771350369025-47ef35c52e32?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1734865934450-719ef6f59a37?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1771350386143-20e64673331e?w=500&h=320&fit=crop&auto=format',
  ],
  city: [
    'https://images.unsplash.com/photo-1734865934450-719ef6f59a37?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1771350369025-47ef35c52e32?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1604560842632-bd795d8f1275?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1503365194569-df4e1d04cec1?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=500&h=320&fit=crop&auto=format',
  ],
  dining: [
    'https://images.unsplash.com/photo-1630861413071-a424a4d6d155?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1630861412757-d9743d318312?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1630861412229-67e2acb44b7a?w=500&h=320&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1503365194569-df4e1d04cec1?w=500&h=320&fit=crop&auto=format',
  ],
}

type Entry = Omit<Destination, 'img' | 'cat'>

function build(
  cat: Destination['cat'],
  mood: keyof typeof imagePool,
  entries: Entry[],
): Destination[] {
  const pool = imagePool[mood]
  return entries.map((entry, i) => ({ ...entry, cat, img: pool[i % pool.length] }))
}

/* ── Museum & Historical Landmark Tours (document p.3) ── */
const museums = build('museums', 'heritage', [
  { name: 'Tseka Negest Be’ata LeMariam Museum', desc: 'Church museum holding imperial relics and Ethiopian Orthodox treasures.', tag: 'Museum' },
  { name: 'Bilalul Habeshi Community Museum', desc: 'Community museum tracing the early history of Islam in Ethiopia.', tag: 'Museum' },
  { name: 'Holy Trinity Cathedral Museum', desc: 'The cathedral museum beside Ethiopia’s most important Orthodox church.', tag: 'Heritage' },
  { name: 'Ethiopian National Museum', desc: 'Home to Lucy, one of the oldest hominid fossils ever discovered.', tag: 'Museum' },
  { name: 'Ethiopian Postal Museum', desc: 'A century of Ethiopian stamps, mail and communication history.', tag: 'Museum' },
  { name: 'Zoological Natural History Museum', desc: 'Ethiopia’s endemic wildlife and natural history collections.', tag: 'Natural History' },
  { name: 'Addis Ababa Museum', desc: 'The story of the capital, from Menelik’s founding to the present city.', tag: 'City History' },
  { name: 'Adwa Museum', desc: 'Commemorating the historic Ethiopian victory at the Battle of Adwa.', tag: 'History' },
  { name: 'African Unbound Museum', desc: 'Pan-African history and the continent’s independence movements.', tag: 'Museum' },
  { name: 'Entoto St. Mary Church Museum', desc: 'Imperial artefacts on the Entoto hilltop where Addis Ababa began.', tag: 'Heritage' },
  { name: 'Ethiopian Science Museum', desc: 'Modern science and technology exhibits in central Addis Ababa.', tag: 'Science' },
  { name: 'Ethnological Museum', desc: 'Inside Haile Selassie’s former palace on the university campus.', tag: 'Museum' },
  { name: 'Grand Anwar Mosque', desc: 'The largest mosque in Addis Ababa, a landmark of the Merkato quarter.', tag: 'Landmark' },
  { name: 'ZOMA Museum', desc: 'Contemporary African art set in remarkable earthen architecture.', tag: 'Art & Culture' },
  { name: 'Women’s Rehabilitation and Skill Enhancement Center', desc: 'A social enterprise showcasing crafts made by Ethiopian women.', tag: 'Community' },
  { name: 'Palace Museum', desc: 'Imperial state rooms and regalia inside the historic palace grounds.', tag: 'Heritage' },
  { name: 'Greek Orthodox Church', desc: 'A quiet landmark of the capital’s long-established Greek community.', tag: 'Landmark' },
  { name: 'Menbere Patriarch Museum and Library', desc: 'Manuscripts and ecclesiastical treasures of the Ethiopian Patriarchate.', tag: 'Library' },
])

/* ── Park (document p.3) ── */
const parks = build('parks', 'nature', [
  { name: 'Entoto Mountain & Entoto Park', desc: 'Forested hilltops above Addis with panoramic views over the capital.', tag: 'Nature' },
  { name: 'Friendship Park I', desc: 'Riverside city park with landscaped walkways and open lawns.', tag: 'Park' },
  { name: 'Friendship Park II', desc: 'The second phase of the Friendship Park development along the river.', tag: 'Park' },
  { name: 'Gullele Botanical Garden', desc: 'A green sanctuary of rare Ethiopian flora and quiet walking trails.', tag: 'Botanical' },
  { name: 'Unity Park', desc: 'Restored historic grounds within the National Palace compound.', tag: 'Park' },
])

/* ── Hiking (document p.4) ── */
const hiking = build('hiking', 'nature', [
  { name: 'Gullele Botanic Garden', desc: 'Gentle marked trails through indigenous highland forest.', tag: 'Hiking · Easy' },
  { name: 'Kake Mountain', desc: 'Highland ridge walk with wide views over the surrounding countryside.', tag: 'Hiking · Moderate' },
  { name: 'Yeka Forest (Washa Mikael)', desc: 'A green retreat inside the city, ending at a rock-hewn church site.', tag: 'Hiking · Easy' },
  { name: 'Wochecha Mountain', desc: 'A challenging climb rewarded with panoramic summit views.', tag: 'Hiking · Hard' },
  { name: 'Entoto Mountain & Entoto Park', desc: 'Historic hilltop trails through eucalyptus forest above the city.', tag: 'Hiking · Moderate' },
  { name: 'Legahar Train Station to Mayor’s Office', desc: 'A walking route through the city’s civic and railway heritage.', tag: 'City Walk' },
  { name: 'Meskel Square to 6 Kilo', desc: 'An urban walk past monuments, campuses and the university quarter.', tag: 'City Walk' },
])

/* ── Authentic Shopping (document p.4) ── */
const shopping = build('shopping', 'city', [
  { name: 'Merkato', desc: 'The largest open-air market in Africa, a vivid sensory experience.', tag: 'Market' },
  { name: 'Shiro Meda', desc: 'Traditional textile market for authentic handwoven Ethiopian dress.', tag: 'Textiles' },
  { name: 'Post Office Market', desc: 'Souvenir and craft stalls clustered around the central post office.', tag: 'Souvenirs' },
  { name: 'Leather Market at Hilton', desc: 'Quality Ethiopian leather goods in a curated hotel-side setting.', tag: 'Leather' },
  { name: 'Leather Market in Bole', desc: 'Leather workshops and boutiques along the Bole district.', tag: 'Leather' },
])

/* ── Family activities (document p.4) ── */
const family = build('family', 'nature', [
  { name: 'Entoto Adventure Park', desc: 'Zip lines, rope courses and outdoor adventure above the city.', tag: 'Adventure' },
  { name: 'Golf Club', desc: 'The capital’s golf course, open for a relaxed day out.', tag: 'Sport' },
  { name: 'Children’s World', desc: 'Rides and play areas built for younger children.', tag: 'Kids' },
  { name: 'Aquamarine', desc: 'Water park and family entertainment complex in Addis Ababa.', tag: 'Family Fun' },
  { name: 'Friendship Children’s Park', desc: 'Open green space and playgrounds for an easy family afternoon.', tag: 'Kids' },
])

/* ── Malls (document p.4) ── */
const malls = build('malls', 'city', [
  { name: 'Century Mall', desc: 'Shopping, dining and a cinema under one roof.', tag: 'Shopping & Leisure' },
  { name: 'Gast Mall', desc: 'Retail and entertainment in the heart of the city.', tag: 'Shopping' },
  { name: 'Eliana Mall', desc: 'Contemporary mall with shops, restaurants and family entertainment.', tag: 'Shopping' },
  { name: 'Ambassador Mall', desc: 'Long-established retail and leisure destination in central Addis.', tag: 'Shopping' },
])

/* ── Architecture (document p.4) ── */
const architecture = build('architecture', 'heritage', [
  { name: 'Holy Trinity Cathedral', desc: 'The most significant Orthodox cathedral in Ethiopia, richly detailed.', tag: 'Architecture' },
  { name: 'ZOMA Museum', desc: 'Award-winning earthen architecture built with traditional techniques.', tag: 'Architecture' },
  { name: 'Ethnological Museum', desc: 'The former imperial palace, an architectural landmark in its own right.', tag: 'Architecture' },
  { name: 'Abrehot Library', desc: 'Ethiopia’s landmark national library and a striking modern build.', tag: 'Modern' },
  { name: 'Bole Medhanialem', desc: 'One of the largest Orthodox churches in Africa, a Bole landmark.', tag: 'Architecture' },
])

/* ── Entertainment (document p.5) ── */
const entertainment = build('entertainment', 'dining', [
  { name: 'African Jazz Village', desc: 'Live jazz and African music in a relaxed evening setting.', tag: 'Live Music' },
  { name: 'Ensira Pottery Center', desc: 'Where tradition meets art. Ethiopian pottery you can try yourself.', tag: 'Arts' },
  { name: 'Fendika Cultural Center', desc: 'Azmari music, traditional dance and Ethiopian arts in an intimate venue.', tag: 'Live Culture' },
  { name: 'Moseb Music Center', desc: 'A venue for Ethiopian music and evening performances.', tag: 'Live Music' },
  { name: 'Totot Cultural Restaurant', desc: 'Traditional food paired with nightly music and dance.', tag: 'Dinner & Show' },
])

/* ── cultural restaurant (document p.5) ── */
const restaurants = build('restaurants', 'dining', [
  { name: '2000 Habesha Cultural Restaurant', desc: 'Authentic Ethiopian cuisine with live music and traditional dance.', tag: 'Cultural Dining' },
  { name: 'Yod Abyssinia Traditional Restaurant', desc: 'A classic traditional restaurant with spectacular cultural shows.', tag: 'Cultural Dining' },
  { name: 'Totot Traditional Food Hall', desc: 'Generous traditional platters in a long-standing Addis institution.', tag: 'Cultural Dining' },
  { name: 'Kategna Cultural Restaurant', desc: 'Warm ambiance and exquisite injera-based traditional dishes.', tag: 'Cultural Dining' },
  { name: 'Mitmita', desc: 'Ethiopian home cooking with the spice the restaurant is named for.', tag: 'Traditional' },
  { name: 'Dashen Terara Traditional Restaurant', desc: 'Highland Ethiopian dishes served in a traditional setting.', tag: 'Traditional' },
])

/* ── Food and drink (document p.5) ── */
const food = build('food', 'dining', [
  { name: 'Meskott Restaurant', desc: 'Contemporary dining with an Ethiopian and international menu.', tag: 'Restaurant' },
  { name: 'Castelli’s Restaurant', desc: 'A legendary Addis Italian restaurant, beloved for decades.', tag: 'Fine Dining' },
  { name: 'Entoto Beth Artisan', desc: 'Artisan cafe with specialty Ethiopian coffee and hillside views.', tag: 'Artisan Coffee' },
  { name: 'Tomoca Coffee', desc: 'The iconic Addis Ababa coffee house, roasting since 1953.', tag: 'Coffee' },
  { name: 'Marcus Addis', desc: 'Modern restaurant and bar for an elevated evening out.', tag: 'Restaurant' },
  { name: 'Hotto Restaurant', desc: 'Comfortable all-day dining in the capital.', tag: 'Restaurant' },
  { name: 'Ramada Brazilian Restaurant', desc: 'Brazilian churrasco grill inside the Ramada hotel.', tag: 'Grill' },
  { name: 'Dukamo Coffee', desc: 'Specialty Ethiopian single-origin coffee, freshly roasted.', tag: 'Coffee' },
  { name: 'Toco Coffee', desc: 'A relaxed specialty coffee spot for a slower morning.', tag: 'Coffee' },
])

export const destinations: Destination[] = [
  ...museums,
  ...parks,
  ...hiking,
  ...shopping,
  ...family,
  ...malls,
  ...architecture,
  ...entertainment,
  ...restaurants,
  ...food,
]
