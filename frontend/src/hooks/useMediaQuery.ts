import { useEffect, useState } from 'react'

/**
 * Subscribe to a CSS media query from JS.
 *
 * The initial value is read synchronously in the `useState` initialiser, so
 * the first paint is already correct and layouts that branch on it do not
 * flash the wrong variant.
 *
 *   const isMobile = useMediaQuery('(max-width: 768px)')
 *
 * Prefer plain CSS media queries where they can do the job; reach for this
 * only when the two layouts differ structurally rather than in styling.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const sync = () => setMatches(mql.matches)
    sync()
    mql.addEventListener('change', sync)
    // A second signal, for belt and braces: `change` is the correct event and
    // fires on real resize and orientation change, but listening to `resize`
    // too costs nothing and covers browsers where it is unreliable. Note that
    // headless viewport emulation typically dispatches neither, so a layout
    // that branches on this will only look right after a reload there.
    window.addEventListener('resize', sync)
    return () => {
      mql.removeEventListener('change', sync)
      window.removeEventListener('resize', sync)
    }
  }, [query])

  return matches
}
