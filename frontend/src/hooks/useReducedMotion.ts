import { useMediaQuery } from './useMediaQuery'

/**
 * True when the reader has asked their device for less animation.
 *
 * Every motion hook checks this and does nothing when it is true, which
 * matches the `prefers-reduced-motion` block in `styles/motion.css`.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
