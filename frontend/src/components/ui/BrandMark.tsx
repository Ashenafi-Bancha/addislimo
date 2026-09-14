import { useId } from 'react'
import { site } from '@/config/site'

interface BrandMarkProps {
  size?: number
}

/**
 * The circular "AL" emblem.
 *
 * SVG gradients are referenced by id, and ids are document-global — two copies
 * of the mark with hard-coded ids would silently share (or lose) their fills.
 * `useId` gives each instance its own.
 */
export default function BrandMark({ size = 40 }: BrandMarkProps) {
  const uid = useId().replace(/:/g, '')
  const ring = `bm-ring-${uid}`
  const inner = `bm-inner-${uid}`

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" style={{ flexShrink: 0, display: 'block' }}>
      <circle cx="24" cy="24" r="22.5" stroke={`url(#${ring})`} strokeWidth="1.4" />
      <circle cx="24" cy="24" r="18" stroke={`url(#${inner})`} strokeWidth="0.6" strokeDasharray="2 3" />
      <text x="24" y="30" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="14" fontWeight="700" fill="#FFFFFF" letterSpacing="1">
        {site.monogram}
      </text>
      <defs>
        <linearGradient id={ring} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset=".5" stopColor="rgba(200,200,200,0.9)" />
          <stop offset="1" stopColor="rgba(180,180,180,0.7)" />
        </linearGradient>
        <linearGradient id={inner} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(200,200,200,0.9)" stopOpacity=".6" />
          <stop offset="1" stopColor="rgba(180,180,180,0.7)" stopOpacity=".3" />
        </linearGradient>
      </defs>
    </svg>
  )
}
