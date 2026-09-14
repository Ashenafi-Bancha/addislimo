import { useEffect, useRef, useState } from 'react'

/**
 * Track an element's rendered width.
 *
 * Charts draw in real pixels at whatever width they are given instead of
 * scaling a fixed SVG, so text and bar widths stay the same size on a phone
 * as on a laptop instead of shrinking with the drawing.
 */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    setWidth(el.getBoundingClientRect().width)
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, width] as const
}
