import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useReveal } from '@/hooks/useReveal'

/**
 * Counts a headline figure up when it first comes into view.
 *
 * The figures on the site are written as display strings ("70+", "10+",
 * "24 / 7", "Vetted"), so anything that does not start with a number is
 * rendered untouched, and whatever follows the number ("+") is kept. A
 * reader who prefers less motion sees the final value immediately.
 */
export default function CountUp({ value, duration = 1100 }: { value: string; duration?: number }) {
  const { ref, visible } = useReveal<HTMLSpanElement>()
  const reduced = useReducedMotion()
  const match = /^(\d+)(.*)$/.exec(value.trim())
  const target = match ? Number(match[1]) : null
  const suffix = match ? match[2] : ''
  const [shown, setShown] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    if (target === null || !visible || reduced) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      // Decelerating, so the number lands softly rather than stopping dead.
      const eased = 1 - Math.pow(1 - t, 3)
      setShown(Math.round(target * eased))
      if (t < 1) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame.current)
  }, [target, visible, reduced, duration])

  if (target === null) return <span ref={ref}>{value}</span>

  return (
    <span ref={ref} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {reduced || !visible ? target : shown}
      {suffix}
    </span>
  )
}
