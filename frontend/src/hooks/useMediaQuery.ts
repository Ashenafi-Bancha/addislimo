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
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])

  return matches
}
