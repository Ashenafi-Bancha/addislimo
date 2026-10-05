import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useReveal } from '@/hooks/useReveal'

type Variant = 'up' | 'left' | 'right' | 'scale' | 'lift'

interface RevealProps {
  children: ReactNode
  /** Which direction the element settles from. */
  variant?: Variant
  /** Position in a group, which staggers the start by 70ms each. */
  index?: number
  /** Milliseconds, used instead of `index` when given. */
  delay?: number
  as?: ElementType
  className?: string
  style?: CSSProperties
}

/**
 * Settles its children into place the first time they scroll into view.
 *
 * Wrap a heading, a card or a whole section. The animation is defined in
 * `styles/motion.css`, which also switches it off for readers who prefer
 * less motion, so nothing here needs to check that.
 */
export default function Reveal({
  children,
  variant = 'up',
  index,
  delay,
  as: Tag = 'div',
  className = '',
  style,
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>()
  const ms = delay ?? (index ? Math.min(index, 8) * 70 : 0)

  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${variant}${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={{ ...style, ['--reveal-delay' as string]: `${ms}ms` }}
    >
      {children}
    </Tag>
  )
}
