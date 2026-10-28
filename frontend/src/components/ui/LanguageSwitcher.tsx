import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { languages, setLang, t, useLang } from '@/features/i18n'

interface LanguageSwitcherProps {
  /** `compact` drops the language code, leaving the globe alone. */
  compact?: boolean
}

/**
 * Language picker: a globe that opens the list of languages.
 *
 * It replaced a two-button toggle. A toggle has to show every language at
 * once, which costs header room that the logo now uses and stops working the
 * moment a third language is added; a globe is the one icon travellers read
 * without a label, in either script.
 *
 * The menu is positioned `fixed` off the trigger's box rather than absolutely
 * inside it, because this sits in the admin sidebar as well, inside a
 * scrolling column that would otherwise clip it. That means the menu cannot
 * follow the page, so it closes on scroll and on resize.
 *
 * The choice is remembered in this browser, so a returning visitor lands in
 * the language they picked last time.
 */
export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const lang = useLang()
  const [open, setOpen] = useState(false)
  const [box, setBox] = useState<{ top: number; right: number } | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuId = `lang-menu-${useId().replace(/:/g, '')}`
  const current = languages.find((l) => l.id === lang) ?? languages[0]

  // Measure before paint so the menu never shows up in the wrong corner first.
  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const height = menuRef.current?.offsetHeight ?? 110
    const below = window.innerHeight - rect.bottom
    setBox({
      top: below < height + 16 ? rect.top - height - 8 : rect.bottom + 8,
      right: Math.max(8, window.innerWidth - rect.right),
    })
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  const choose = (id: typeof languages[number]['id']) => {
    setLang(id)
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="lang-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={`${t('Language')}: ${current.label}`}
      >
        <GlobeIcon />
        {!compact && (
          <span className="lang-trigger-code" lang={current.id}>
            {current.short}
          </span>
        )}
        <svg className="lang-trigger-caret" width="9" height="6" viewBox="0 0 9 6" fill="none" aria-hidden="true">
          <path d="M1 1.25 4.5 4.75 8 1.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          className="lang-menu"
          style={{ top: box?.top ?? -9999, right: box?.right ?? 8, visibility: box ? 'visible' : 'hidden' }}
        >
          {languages.map((l) => (
            <button
              key={l.id}
              type="button"
              role="menuitemradio"
              aria-checked={lang === l.id}
              lang={l.id}
              className="lang-menu-option"
              onClick={() => choose(l.id)}
            >
              <span>{l.label}</span>
              <span aria-hidden="true" className="lang-menu-tick">
                {lang === l.id ? '✓' : ''}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  )
}

function GlobeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M12 3c2.4 2.4 3.6 5.4 3.6 9S14.4 18.6 12 21c-2.4-2.4-3.6-5.4-3.6-9S9.6 5.4 12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}
