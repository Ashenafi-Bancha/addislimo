import { routes, type Page } from '@/app/routes'
import { categories } from '@/data/destinations'
import type { ContentKey } from './content'

/**
 * Declarative description of every content group the admin can edit.
 *
 * The admin's Website Content section renders its editors from these specs,
 * so adding an editable field is a one-line change here plus reading it on
 * the page. Same approach as the Denver Black Limo CMS.
 */

export type FieldType = 'text' | 'textarea' | 'number' | 'image' | 'select' | 'stringList' | 'objectList'

export interface FieldSpec {
  key: string
  label: string
  type: FieldType
  hint?: string
  placeholder?: string
  /** For `select`. */
  options?: { value: string; label: string }[]
  /** For `objectList`: the fields of each item. */
  itemFields?: FieldSpec[]
  /** For `objectList`: which item field names the row. */
  itemTitleKey?: string
  /** Span both columns of the form grid. */
  full?: boolean
}

export interface ContentGroup {
  key: ContentKey
  title: string
  description: string
  /** Where it sits in the admin's content grid. */
  area: 'Business' | 'Home page' | 'Pages'
  /** Public page that shows this content, for the "View on site" link. */
  page: Page
  /**
   * `singleton` is one form of fields. `collection` is a list of like items,
   * edited one at a time.
   */
  kind: 'singleton' | 'collection'
  fields: FieldSpec[]
  itemTitleKey?: string
  itemSubtitleKey?: string
  itemImageKey?: string
}

/** Public pages a link can point at. Admin screens are never a destination. */
const pageOptions = (Object.keys(routes) as Page[])
  .filter((p) => routes[p].chrome === 'site' && p !== 'confirmation')
  .map((p) => ({ value: p, label: routes[p].title }))

const categoryOptions = categories.filter((c) => c.id !== 'all').map((c) => ({ value: c.id, label: c.label }))

const iconHint = 'A single symbol, such as ✈ ◈ ◉ ◷ ✦'

const ICON_CARD: FieldSpec[] = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'icon', label: 'Icon', type: 'text', hint: iconHint },
  { key: 'desc', label: 'Description', type: 'textarea', full: true },
]

function partnerFields(): FieldSpec[] {
  return [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'sub', label: 'Caption', type: 'text', placeholder: 'Luxury Hotel' },
    { key: 'logo', label: 'Logo', type: 'image', hint: 'Leave blank to show the initials.', full: true },
  ]
}

export const contentGroups: ContentGroup[] = [
  /* ── Business ── */
  {
    key: 'business',
    title: 'Business & Contact',
    description: 'Phone, email, WhatsApp, address, hours and social links. Used in the footer and across the site.',
    area: 'Business',
    page: 'home',
    kind: 'singleton',
    fields: [
      { key: 'tagline', label: 'Tagline', type: 'text', hint: 'Shown beside the name in the footer.' },
      { key: 'slogan', label: 'Slogan', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'phone', label: 'Phone, as displayed', type: 'text', placeholder: '+251 911 000 000' },
      { key: 'phoneHref', label: 'Phone, digits only', type: 'text', placeholder: '251911000000', hint: 'Makes the phone number tappable. Leave blank to show it as text.' },
      { key: 'whatsapp', label: 'WhatsApp, digits only', type: 'text', placeholder: '251911000000', hint: 'Leave blank to show "coming soon".' },
      { key: 'address', label: 'Address', type: 'text', full: true },
      { key: 'hours', label: 'Hours', type: 'text' },
      { key: 'instagram', label: 'Instagram URL', type: 'text' },
      { key: 'facebook', label: 'Facebook URL', type: 'text' },
      { key: 'x', label: 'X (Twitter) URL', type: 'text' },
      { key: 'linkedin', label: 'LinkedIn URL', type: 'text' },
      { key: 'tiktok', label: 'TikTok URL', type: 'text' },
    ],
  },

  /* ── Home page ── */
  {
    key: 'home_hero',
    title: 'Hero',
    description: 'The headline, introduction and photograph at the top of the home page.',
    area: 'Home page',
    page: 'home',
    kind: 'singleton',
    fields: [
      { key: 'headline', label: 'Headline', type: 'textarea', hint: 'Each line here is a line on the page.', full: true },
      { key: 'headlineAccent', label: 'Headline, italic line', type: 'text' },
      { key: 'intro', label: 'Introduction', type: 'textarea', full: true },
      { key: 'image', label: 'Photograph', type: 'image', hint: 'Landscape, 16:9. Phones show the whole picture.', full: true },
    ],
  },
  {
    key: 'trust_badges',
    title: 'Trust Figures',
    description: 'The row of headline figures under the hero: 10+, 70+, 24/7.',
    area: 'Home page',
    page: 'home',
    kind: 'collection',
    itemTitleKey: 'value',
    itemSubtitleKey: 'label',
    fields: [
      { key: 'value', label: 'Figure', type: 'text', placeholder: '70+' },
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'icon', label: 'Icon', type: 'text', hint: iconHint },
      { key: 'desc', label: 'Description', type: 'textarea', full: true },
    ],
  },
  {
    key: 'why_addis_limo',
    title: 'Why Addis Limo',
    description: 'The numbered reason cards in the trust section.',
    area: 'Home page',
    page: 'home',
    kind: 'collection',
    itemTitleKey: 'label',
    itemSubtitleKey: 'desc',
    fields: [
      { key: 'n', label: 'Number', type: 'text', placeholder: '01' },
      { key: 'label', label: 'Title', type: 'text' },
      { key: 'desc', label: 'Description', type: 'textarea', full: true },
    ],
  },
  {
    key: 'quick_links',
    title: 'Quick Links',
    description: 'The shortcut grid that takes visitors straight to a page.',
    area: 'Home page',
    page: 'home',
    kind: 'collection',
    itemTitleKey: 'label',
    itemSubtitleKey: 'desc',
    fields: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'page', label: 'Opens', type: 'select', options: pageOptions },
      { key: 'desc', label: 'Description', type: 'text', full: true },
    ],
  },
  {
    key: 'home_services',
    title: 'Service Cards',
    description: 'The service cards under "Our Services".',
    area: 'Home page',
    page: 'home',
    kind: 'collection',
    itemTitleKey: 'title',
    itemSubtitleKey: 'subtitle',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'icon', label: 'Icon', type: 'text', hint: iconHint },
      { key: 'subtitle', label: 'Description', type: 'textarea', full: true },
      { key: 'page', label: 'Opens', type: 'select', options: pageOptions },
    ],
  },
  {
    key: 'fleet',
    title: 'Fleet',
    description: 'The vehicle cards under "Our Fleet".',
    area: 'Home page',
    page: 'home',
    kind: 'collection',
    itemTitleKey: 'name',
    itemSubtitleKey: 'desc',
    itemImageKey: 'img',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'capacity', label: 'Passengers', type: 'text', placeholder: '1–3' },
      { key: 'luggage', label: 'Luggage', type: 'text', placeholder: '2 bags' },
      { key: 'desc', label: 'Description', type: 'textarea', full: true },
      { key: 'img', label: 'Photograph', type: 'image', full: true },
    ],
  },
  {
    key: 'partner_logos',
    title: 'Partner Logos',
    description: 'The two scrolling rows under "Trusted by". A partner without a logo shows its initials.',
    area: 'Home page',
    page: 'home',
    kind: 'singleton',
    fields: [
      { key: 'rowOne', label: 'Top row', type: 'objectList', itemTitleKey: 'name', itemFields: partnerFields(), full: true },
      { key: 'rowTwo', label: 'Bottom row', type: 'objectList', itemTitleKey: 'name', itemFields: partnerFields(), full: true },
    ],
  },
  {
    key: 'home_sections',
    title: 'Section Headings',
    description: 'Headings and copy for the other home page sections, and the photo banner.',
    area: 'Home page',
    page: 'home',
    kind: 'singleton',
    fields: [
      { key: 'whyEyebrow', label: 'Trust section label', type: 'text' },
      { key: 'servicesEyebrow', label: 'Services label', type: 'text' },
      { key: 'servicesTitle', label: 'Services title', type: 'text' },
      { key: 'servicesTitleAccent', label: 'Services title, italic', type: 'text' },
      { key: 'featureImage', label: 'Banner photograph', type: 'image', full: true },
      { key: 'featureEyebrow', label: 'Banner label', type: 'text' },
      { key: 'featureTitle', label: 'Banner title', type: 'text' },
      { key: 'featureTitleAccent', label: 'Banner title, italic', type: 'text' },
      { key: 'featureText', label: 'Banner text', type: 'textarea', full: true },
      { key: 'fleetEyebrow', label: 'Fleet label', type: 'text' },
      { key: 'fleetTitle', label: 'Fleet title', type: 'text' },
      { key: 'fleetTitleAccent', label: 'Fleet title, italic', type: 'text' },
      { key: 'partnersEyebrow', label: 'Partners label', type: 'text' },
      { key: 'partnersTitle', label: 'Partners title', type: 'text' },
      { key: 'passengerTitle', label: 'Passenger card title', type: 'textarea', hint: 'Each line here is a line on the page.' },
      { key: 'passengerText', label: 'Passenger card text', type: 'textarea' },
      { key: 'partnerText', label: 'Partner card text', type: 'textarea', full: true },
    ],
  },

  /* ── Pages ── */
  {
    key: 'services',
    title: 'Services',
    description: 'The full catalogue on the Services page.',
    area: 'Pages',
    page: 'services',
    kind: 'collection',
    itemTitleKey: 'title',
    itemSubtitleKey: 'tagline',
    itemImageKey: 'img',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'img', label: 'Photograph', type: 'image', full: true },
      { key: 'features', label: 'Highlights', type: 'stringList', full: true },
      { key: 'cta', label: 'Button label', type: 'text' },
      { key: 'page', label: 'Button opens', type: 'select', options: pageOptions },
    ],
  },
  {
    key: 'destinations',
    title: 'Explore Addis',
    description: 'Every destination on the Explore Addis page, with its category and photo.',
    area: 'Pages',
    page: 'explore',
    kind: 'collection',
    itemTitleKey: 'name',
    itemSubtitleKey: 'tag',
    itemImageKey: 'img',
    fields: [
      { key: 'name', label: 'Name', type: 'text' },
      { key: 'cat', label: 'Category', type: 'select', options: categoryOptions },
      { key: 'tag', label: 'Tag', type: 'text', placeholder: 'Cultural Dining' },
      { key: 'desc', label: 'Description', type: 'textarea', full: true },
      { key: 'img', label: 'Photograph', type: 'image', full: true },
    ],
  },
  {
    key: 'airport',
    title: 'Airport Transfer',
    description: 'How it works, the features, and the "Where we take you" lists.',
    area: 'Pages',
    page: 'airport',
    kind: 'singleton',
    fields: [
      {
        key: 'steps',
        label: 'How it works',
        type: 'objectList',
        itemTitleKey: 'title',
        full: true,
        itemFields: [
          { key: 'n', label: 'Step', type: 'number' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'desc', label: 'Description', type: 'text', full: true },
        ],
      },
      { key: 'features', label: 'Features', type: 'objectList', itemTitleKey: 'title', itemFields: ICON_CARD, full: true },
      {
        key: 'destinationGroups',
        label: 'Where we take you',
        type: 'objectList',
        itemTitleKey: 'label',
        full: true,
        itemFields: [
          { key: 'label', label: 'Tab label', type: 'text' },
          { key: 'id', label: 'Short id', type: 'text', hint: 'Lowercase, no spaces. Must be unique.' },
          { key: 'blurb', label: 'Introduction', type: 'textarea', full: true },
          { key: 'places', label: 'Places', type: 'stringList', full: true },
        ],
      },
    ],
  },
  {
    key: 'corporate',
    title: 'Corporate',
    description: 'Who the corporate service is for, what it includes, and the venues served.',
    area: 'Pages',
    page: 'corporate',
    kind: 'singleton',
    fields: [
      { key: 'clients', label: 'Who we serve', type: 'stringList', full: true },
      { key: 'features', label: 'Features', type: 'objectList', itemTitleKey: 'title', itemFields: ICON_CARD, full: true },
      { key: 'venues', label: 'Venues', type: 'stringList', full: true },
    ],
  },
  {
    key: 'about',
    title: 'About Us',
    description: 'The brand values and the partner types on the About page.',
    area: 'Pages',
    page: 'about',
    kind: 'singleton',
    fields: [
      {
        key: 'values',
        label: 'Brand values',
        type: 'objectList',
        itemTitleKey: 'title',
        full: true,
        itemFields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea', full: true },
        ],
      },
      {
        key: 'partnerTypes',
        label: 'Partner types',
        type: 'objectList',
        itemTitleKey: 'type',
        full: true,
        itemFields: [
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'desc', label: 'Description', type: 'textarea', full: true },
        ],
      },
    ],
  },
]

/** A new, empty item for a list, with the first choice preselected in selects. */
export function blankItem(fields: FieldSpec[]): Record<string, unknown> {
  const item: Record<string, unknown> = {}
  for (const f of fields) {
    if (f.type === 'number') item[f.key] = 0
    else if (f.type === 'stringList' || f.type === 'objectList') item[f.key] = []
    else if (f.type === 'select') item[f.key] = f.options?.[0]?.value ?? ''
    else item[f.key] = ''
  }
  return item
}
