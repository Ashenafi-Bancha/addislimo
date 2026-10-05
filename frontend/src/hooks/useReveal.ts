import { useEffect, useRef, useState } from 'react'

/**
 * Reveals an element the first time it scrolls into view.
 *
 * One IntersectionObserver per element, disconnected as soon as it fires, so
 * nothing keeps observing while the reader moves on. Elements already on
 * screen at load reveal immediately, so the first paint is never blank.
 *
 * `rootMargin` starts the animation slightly before the element reaches the
 * viewport edge, which stops the reader from watching it begin.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options: { once?: boolean } = {}) {
  const { once = true } = options
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Without the API, or in a window with no measurable viewport (a hidden
    // frame, a thumbnailer), nothing can ever intersect, so show it now
    // rather than leave the section blank.
    if (typeof IntersectionObserver === 'undefined' || !window.innerHeight) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  return { ref, visible }
}
