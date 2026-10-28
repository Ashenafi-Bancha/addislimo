import brandMark from '@/assets/images/addis-limo-mark.webp'
import { site } from '@/config/site'

interface BrandMarkProps {
  size?: number
}

/**
 * The square brand mark: the crowned lion lifted out of the logo.
 *
 * The full lockup is a wide strip, which collapses to an unreadable smear in
 * a 34px square, so small placements — the admin sidebar, the topbar, the
 * sign-in card — get this crop instead. The header and footer use the whole
 * logo, where there is width for it.
 */
export default function BrandMark({ size = 40 }: BrandMarkProps) {
  return (
    <img
      src={brandMark}
      alt={site.name}
      width={size}
      height={size}
      style={{ width: size, height: size, flexShrink: 0, display: 'block', objectFit: 'contain' }}
    />
  )
}
