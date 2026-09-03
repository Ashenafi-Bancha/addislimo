import type { Partner } from '@/types'
import ethiopianAirlinesLogo from '@/assets/images/image-6.png'
import ghionLogo from '@/assets/images/image-7.png'
import sheratonLogo from '@/assets/images/sheraton-addis-logo.png'
import skylightLogo from '@/assets/images/skylight-hotel-logo.png'

/**
 * Partner logos for the home-page marquee.
 *
 * A `null` logo renders the name's monogram instead — that is the intended
 * fallback for partners who have not supplied artwork, not a bug. Remote
 * Clearbit URLs are placeholders to be replaced with licensed assets.
 */

export const partnersRowOne: Partner[] = [
  { name: 'Skylight Hotel', sub: 'Luxury Hotel', logo: skylightLogo },
  { name: 'Sheraton Addis', sub: 'Five-Star Resort', logo: sheratonLogo },
  { name: 'Adwa Museum', sub: 'Cultural Heritage', logo: null },
  { name: 'African Union', sub: 'International Institution', logo: 'https://logo.clearbit.com/au.int' },
  { name: 'Ethiopian Airlines', sub: 'National Carrier', logo: ethiopianAirlinesLogo },
  { name: 'Hilton Addis Ababa', sub: 'Business Hotel', logo: 'https://logo.clearbit.com/hilton.com' },
]

export const partnersRowTwo: Partner[] = [
  { name: 'Radisson Blu', sub: 'Premier Hotel', logo: 'https://logo.clearbit.com/radissonhotels.com' },
  { name: 'UN ECA', sub: 'United Nations', logo: 'https://logo.clearbit.com/un.org' },
  { name: 'Hyatt Regency', sub: 'Luxury Hotel', logo: 'https://logo.clearbit.com/hyatt.com' },
  { name: 'Ghion Hotel', sub: 'Heritage Hotel', logo: ghionLogo },
  { name: 'Jupiter Hotel', sub: 'Business Hotel', logo: null },
  { name: 'AU Headquarters', sub: 'Diplomatic District', logo: null },
]
