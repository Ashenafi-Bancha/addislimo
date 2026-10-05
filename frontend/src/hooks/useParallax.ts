import { useEffect, useRef } from 'react'
import { useMediaQuery } from './useMediaQuery'
import { useReducedMotion } from './useReducedMotion'

/**
 * Drifts an element against the scroll, for depth behind a hero.
 *
 * The offset is written straight to the element's transform inside one
 * animation frame per scroll burst, never through state. Phones are left
 * out: a parallax layer is the first thing to tear on a cheap device, and
 * the stacked mobile hero has no room for the effect to read anyway.
 *
 * `speed` is a fraction of the distance scrolled; 0.18 moves the layer about
 * a fifth as fast as the page.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed = 0.18, maxShift = 90) {
  const ref = useRef<T>(null)
  const wide = useMediaQuery('(min-width: 769px)')
  const reduced = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node || !wide || reduced) {
      if (node) node.style.transform = ''
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      // How far the element's centre sits from the viewport's centre.
      const fromCentre = rect.top + rect.height / 2 - window.innerHeight / 2
      const shift = Math.max(-maxShift, Math.min(maxShift, -fromCentre * speed))
      node.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [speed, maxShift, wide, reduced])

  return ref
}
