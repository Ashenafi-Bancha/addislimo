import { contact, quickLinks, site, type QuickLink } from '@/config/site'
import { brandValues, partnerTypes } from '@/data/about'
import { airportDestinationGroups, airportFeatures, airportSteps, type DestinationGroup } from '@/data/airport'
import { corporateClients, corporateFeatures, corporateVenues } from '@/data/corporate'
import { destinations, type Destination } from '@/data/destinations'
import { fleet } from '@/data/fleet'
import { partnersRowOne, partnersRowTwo } from '@/data/partners'
import { serviceCatalog, type CatalogService } from '@/data/service-catalog'
import { differentiators, homeServices, type Differentiator, type HomeService } from '@/data/services'
import { trustBadges, type TrustBadge } from '@/data/trust'
import type { Partner, Vehicle } from '@/types'
import airportHeroImage from '@/assets/images/bole-international-airlines.jpg'

/**
 * Everything on the public site that the admin console can edit.
 *
 * Each key is one content group, the unit the admin saves and the backend will
 * store as one row (`PUT /content/:key`, the Denver Black Limo `site_settings`
 * model). The defaults are the copy already in `src/data` and
 * `src/config/site.ts`, so a site nobody has edited renders exactly as before.
 */

export interface IconCard {
  icon: string
  title: string
  desc: string
}

export interface SiteContent {
  business: {
    tagline: string
    slogan: string
    email: string
    phone: string
    /** Digits only, for `tel:` links. Blank shows the phone as plain text. */
    phoneHref: string
    /** Digits only, for `wa.me` links. Blank shows "coming soon". */
    whatsapp: string
    address: string
    hours: string
    instagram: string
    facebook: string
    x: string
    linkedin: string
    tiktok: string
  }
  home_hero: {
    /** One line per row of the headline. */
    headline: string
    headlineAccent: string
    intro: string
    image: string
  }
  home_sections: {
    whyEyebrow: string
    servicesEyebrow: string
    servicesTitle: string
    servicesTitleAccent: string
    featureImage: string
    featureEyebrow: string
    featureTitle: string
    featureTitleAccent: string
    featureText: string
    fleetEyebrow: string
    fleetTitle: string
    fleetTitleAccent: string
    partnersEyebrow: string
    partnersTitle: string
    passengerTitle: string
    passengerText: string
    partnerText: string
  }
  trust_badges: TrustBadge[]
  why_addis_limo: Differentiator[]
  quick_links: QuickLink[]
  home_services: HomeService[]
  fleet: Vehicle[]
  partner_logos: { rowOne: Partner[]; rowTwo: Partner[] }
  services: CatalogService[]
  airport: {
    heroImage: string
    steps: { n: number; title: string; desc: string }[]
    features: IconCard[]
    destinationGroups: DestinationGroup[]
  }
  corporate: {
    clients: string[]
    features: IconCard[]
    venues: string[]
  }
  destinations: Destination[]
  about: {
    values: { title: string; desc: string }[]
    partnerTypes: { type: string; desc: string }[]
  }
}

export type ContentKey = keyof SiteContent

const socialHref = (label: string) => {
  const hrefs: Record<string, string> = {
    Instagram: 'https://instagram.com',
    Facebook: 'https://facebook.com',
    'X (Twitter)': 'https://x.com',
    LinkedIn: 'https://linkedin.com',
    TikTok: 'https://tiktok.com',
  }
  return hrefs[label] ?? ''
}

export const contentDefaults: SiteContent = {
  business: {
    tagline: site.tagline,
    slogan: site.slogan,
    email: contact.email,
    phone: contact.phone,
    phoneHref: contact.phoneHref,
    whatsapp: contact.whatsapp,
    address: contact.address,
    hours: contact.hours,
    instagram: socialHref('Instagram'),
    facebook: socialHref('Facebook'),
    x: socialHref('X (Twitter)'),
    linkedin: socialHref('LinkedIn'),
    tiktok: socialHref('TikTok'),
  },
  home_hero: {
    headline: 'Experience\nthe Capital City\nof Africa',
    headlineAccent: 'in Class.',
    intro:
      'Premium chauffeur and transportation services in Addis Ababa, designed for travelers, executives, businesses, events and unforgettable journeys.',
    image: 'https://images.unsplash.com/photo-1771350368994-9d87f0d8431f?w=1920&h=1080&fit=crop&auto=format',
  },
  home_sections: {
    whyEyebrow: 'Why Addis Limo',
    servicesEyebrow: 'Our Services',
    servicesTitle: 'Premium Transportation,',
    servicesTitleAccent: 'Every Journey.',
    featureImage: 'https://images.unsplash.com/photo-1604560842632-bd795d8f1275?w=1900&h=600&fit=crop&auto=format',
    featureEyebrow: 'Addis Ababa, Ethiopia',
    featureTitle: "Africa's capital city.",
    featureTitleAccent: 'Explored with elegance.',
    featureText:
      'Discover museums, cultural restaurants, scenic parks and vibrant neighborhoods, all with a professional chauffeur and premium vehicle.',
    fleetEyebrow: 'Our Fleet',
    fleetTitle: 'Travel in the',
    fleetTitleAccent: 'Right Vehicle.',
    partnersEyebrow: 'Our Partners',
    partnersTitle: 'Trusted by.',
    passengerTitle: 'Book Your\nPremium Journey',
    passengerText:
      'Airport transfers, corporate travel, city tours. Book now and experience Addis Ababa at its finest.',
    partnerText: 'Hotels, vehicle owners, transport companies: join our premium partner network.',
  },
  trust_badges: trustBadges,
  why_addis_limo: differentiators,
  quick_links: quickLinks,
  home_services: homeServices,
  fleet,
  partner_logos: { rowOne: partnersRowOne, rowTwo: partnersRowTwo },
  services: serviceCatalog,
  airport: {
    heroImage: airportHeroImage,
    steps: airportSteps,
    features: airportFeatures,
    destinationGroups: airportDestinationGroups,
  },
  corporate: {
    clients: corporateClients,
    features: corporateFeatures,
    venues: corporateVenues,
  },
  destinations,
  about: { values: brandValues, partnerTypes },
}
