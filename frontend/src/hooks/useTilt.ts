import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useMediaQuery } from './useMediaQuery'
import { useReducedMotion } from './useReducedMotion'

interface TiltOptions {
  /** Degrees of rotation at the far edge of the card. */
  max?: number
  /** How far the card rises while tilted, in pixels. */
  lift?: number
  scale?: number
  perspective?: number
}

/**
 * Tilts a card towards the pointer, with a highlight that follows it.
 *
 * The angles are written to CSS custom properties on the element rather than
 * through React state, so moving the pointer never re-renders anything; the
 * class and the transform in `motion.css` do the rest. Updates are coalesced
 * into one animation frame, so a fast sweep across a grid stays cheap.
 *
 * Returns nothing on touch screens (where there is no pointer to follow and
 * a card could stay stuck mid-tilt) or when the reader prefers less motion.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>({ max = 7, lift = -6, scale = 1.012, perspective = 900 }: TiltOptions = {}) {
  const ref = useRef<T>(null)
  const frame = useRef(0)
  const [active, setActive] = useState(false)
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduced = useReducedMotion()
  const enabled = finePointer && !reduced

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<T>) => {
      if (!enabled) return
      const node = ref.current
      if (!node) return
      const { clientX, clientY } = event

      cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const rect = node.getBoundingClientRect()
        const px = (clientX - rect.left) / rect.width
        const py = (clientY - rect.top) / rect.height
        // Pointer above centre tips the top edge away from the reader.
        node.style.setProperty('--tilt-x', `${(0.5 - py) * max * 2}deg`)
        node.style.setProperty('--tilt-y', `${(px - 0.5) * max * 2}deg`)
        node.style.setProperty('--tilt-px', `${px * 100}%`)
        node.style.setProperty('--tilt-py', `${py * 100}%`)
      })
    },
    [enabled, max],
  )

  const onPointerEnter = useCallback(() => {
    if (!enabled) return
    const node = ref.current
    if (!node) return
    node.style.setProperty('--tilt-lift', `${lift}px`)
    node.style.setProperty('--tilt-scale', String(scale))
    node.style.setProperty('--tilt-perspective', `${perspective}px`)
    setActive(true)
  }, [enabled, lift, scale, perspective])

  const onPointerLeave = useCallback(() => {
    cancelAnimationFrame(frame.current)
    const node = ref.current
    if (node) {
      node.style.setProperty('--tilt-x', '0deg')
      node.style.setProperty('--tilt-y', '0deg')
    }
    setActive(false)
  }, [])

  return {
    ref,
    /** True while the pointer is over the card, for hover styling. */
    active,
    /** Spread onto the card element. */
    handlers: enabled ? { onPointerMove, onPointerEnter, onPointerLeave } : {},
    className: `tilt${active ? ' is-tilting' : ''}`,
  }
}
