import { languages, setLang, t, useLang } from '@/features/i18n'

interface LanguageSwitcherProps {
  /** `compact` shows the short names (EN / አማ) for the phone header. */
  compact?: boolean
}

/**
 * English / Amharic toggle. The choice is remembered in this browser, so a
 * returning visitor lands in the language they picked last time.
 */
export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const lang = useLang()

  return (
    <div className="lang-switch" role="group" aria-label={t('Language')}>
      {languages.map((l) => (
        <button
          key={l.id}
          type="button"
          lang={l.id}
          aria-pressed={lang === l.id}
          onClick={() => setLang(l.id)}
          className="lang-switch-option"
        >
          {compact ? l.short : l.label}
        </button>
      ))}
    </div>
  )
}
