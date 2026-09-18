import type { CSSProperties } from 'react'

/**
 * Stroke icons for the admin console.
 *
 * Inline SVG rather than an icon library, to keep the dependency list at
 * React and nothing else. Every icon is drawn on a 24px grid with a 1.6px
 * stroke in `currentColor`, so it takes the colour of the text beside it.
 */

const paths = {
  overview: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
  bookings: 'M7 3v3M17 3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zM9 14l2 2 4-4',
  partners: 'M3 9h18v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M3 13h18',
  fleet: 'M5 16h14M6 16l1.5-5.5A2 2 0 0 1 9.4 9h5.2a2 2 0 0 1 1.9 1.5L18 16M4 16h16v3H4zM7 19v1.5M17 19v1.5',
  customers: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.5a6.5 6.5 0 0 1 3.5 5.5',
  finance: 'M3 7h18v11H3zM3 10h18M7 15h3M17 4H6',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 13a7.6 7.6 0 0 0 0-2l2-1.5-2-3.4-2.4.9a7.4 7.4 0 0 0-1.7-1L15 3.5h-4L10.7 6a7.4 7.4 0 0 0-1.7 1l-2.4-.9-2 3.4 2 1.5a7.6 7.6 0 0 0 0 2l-2 1.5 2 3.4 2.4-.9a7.4 7.4 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7.4 7.4 0 0 0 1.7-1l2.4.9 2-3.4z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0',
  logout: 'M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3M10 16l-4-4 4-4M6 12h10',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  chevronRight: 'M9 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  download: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  phone: 'M5 4h4l1.5 4-2.5 1.5a11 11 0 0 0 6.5 6.5l1.5-2.5 4 1.5v4a1 1 0 0 1-1 1A17 17 0 0 1 4 5a1 1 0 0 1 1-1z',
  mail: 'M4 6h16v12H4zM4 7l8 6 8-6',
  pin: 'M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  car: 'M5 16h14M6 16l1.5-5.5A2 2 0 0 1 9.4 9h5.2a2 2 0 0 1 1.9 1.5L18 16M4 16h16v3H4z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  alert: 'M12 4l9 16H3zM12 10v4M12 17h.01',
  star: 'M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z',
  trendUp: 'M4 16l6-6 4 4 6-6M14 8h6v6',
  trendDown: 'M4 8l6 6 4-4 6 6M14 16h6v-6',
  users: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  arrowLeft: 'M19 12H5M11 6l-6 6 6 6',
  lock: 'M6 11h12v10H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  eyeOff: 'M3 3l18 18M10.6 5.6A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.8 3.5M6.5 7.2A17 17 0 0 0 2.5 12S6 18.5 12 18.5a9.3 9.3 0 0 0 4.3-1M9.9 9.9a3 3 0 0 0 4.2 4.2',
  shield: 'M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z',
  sliders: 'M4 7h10M18 7h2M4 17h4M12 17h8M16 5v4M10 15v4',
  edit: 'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  plus: 'M12 5v14M5 12h14',
  upload: 'M12 20V9M7 14l5-5 5 5M5 4h14',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15.5 9.5h.01',
  content: 'M4 4h16v16H4zM4 9h16M9 9v11',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
} as const

export type IconName = keyof typeof paths

interface IconProps {
  name: IconName
  size?: number
  strokeWidth?: number
  style?: CSSProperties
  /** Give a label only when the icon stands alone; otherwise it is decorative. */
  label?: string
}

export default function Icon({ name, size = 18, strokeWidth = 1.6, style, label }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, display: 'block', ...style }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <path d={paths[name]} />
    </svg>
  )
}
