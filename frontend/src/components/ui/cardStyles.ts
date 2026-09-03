import type { CSSProperties } from 'react'

/**
 * The raised card treatment shared by the trust and service grids.
 *
 * A card is a top-down gradient tile with a lit inset hairline along its top
 * edge and a deep drop shadow, which together give it a readable physical
 * edge against the black page. On hover it lifts, the shadow deepens and the
 * border brightens.
 *
 * Kept here rather than duplicated so the two grids cannot drift apart —
 * spread it into a `style` prop and add whatever the section needs on top:
 *
 *   style={{ ...raisedCard(active), padding: '30px 28px', cursor: 'pointer' }}
 */
export function raisedCard(active: boolean): CSSProperties {
  return {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 14,
    background: active
      ? 'linear-gradient(165deg, #1B1B1B 0%, #101010 55%, #0B0B0B 100%)'
      : 'linear-gradient(165deg, #141414 0%, #0D0D0D 55%, #090909 100%)',
    border: `1px solid ${active ? 'rgba(255,255,255,0.26)' : 'rgba(255,255,255,0.09)'}`,
    boxShadow: active
      ? 'inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.6), 0 26px 55px rgba(0,0,0,0.72), 0 3px 10px rgba(0,0,0,0.5)'
      : 'inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.5), 0 14px 32px rgba(0,0,0,0.55)',
    transform: active ? 'translateY(-6px)' : 'translateY(0)',
    transition:
      'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease',
  }
}

/**
 * The gradient rule that draws across the top edge of a card on hover.
 * `from` picks which side it grows from.
 */
export function cardTopRule(active: boolean, from: 'left' | 'center' = 'left'): CSSProperties {
  return {
    position: 'absolute',
    top: 0,
    height: 2,
    background: 'var(--gold-gradient-h)',
    transition: 'width 0.4s ease',
    ...(from === 'center'
      ? { left: '50%', transform: 'translateX(-50%)', width: active ? '78%' : '0%' }
      : { left: 0, width: active ? '100%' : '0%' }),
  }
}
