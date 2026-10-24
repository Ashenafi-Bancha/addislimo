import { useSyncExternalStore } from 'react'

/**
 * The visitor's language. English is the source and the default; Amharic is
 * a dictionary keyed by the English text, so a string with no entry simply
 * stays in English rather than breaking.
 *
 * `t()` reads the current language directly instead of through a hook. `App`
 * subscribes with `useLang`, so a switch re-renders the whole tree (nothing in
 * it is memoised) and every `t()` call picks the new language up, without
 * remounting and losing a half-filled form.
 *
 * The Amharic dictionaries are loaded on demand, so English visitors never
 * download them. Until they arrive the page stays in English; `lang` is the
 * language actually on screen, not the one asked for.
 */

export type Lang = 'en' | 'am'

export const languages: { id: Lang; label: string; short: string }[] = [
  { id: 'en', label: 'English', short: 'EN' },
  { id: 'am', label: 'አማርኛ', short: 'አማ' },
]

const STORAGE_KEY = 'addislimo.lang'

function readStored(): Lang {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'am' ? 'am' : 'en'
  } catch {
    return 'en'
  }
}

let wanted: Lang = typeof window === 'undefined' ? 'en' : readStored()
let lang: Lang = 'en'
let am: Record<string, string> = {}
let loading: Promise<void> | null = null
const listeners = new Set<() => void>()

function apply() {
  if (typeof document !== 'undefined') document.documentElement.lang = lang
  listeners.forEach((l) => l())
}

function loadAmharic(): Promise<void> {
  loading ??= Promise.all([import('./am'), import('./am-admin')]).then(
    ([site, admin]) => {
      am = { ...admin.amAdmin, ...site.am }
    },
    (error) => {
      loading = null
      throw error
    },
  )
  return loading
}

function show(next: Lang) {
  if (next === 'en') {
    if (lang !== 'en') {
      lang = 'en'
      apply()
    }
    return
  }
  loadAmharic().then(
    () => {
      if (wanted === 'am' && lang !== 'am') {
        lang = 'am'
        apply()
      }
    },
    // Offline or a failed deploy: stay in English rather than break the page.
    () => {},
  )
}

if (typeof document !== 'undefined') document.documentElement.lang = 'en'
show(wanted)

export function getLang(): Lang {
  return lang
}

export function setLang(next: Lang) {
  if (next === wanted) return
  wanted = next
  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Private mode or blocked storage: the choice lasts for this visit only.
  }
  show(next)
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** The current language. Re-renders the caller when it changes. */
export function useLang(): Lang {
  return useSyncExternalStore(subscribe, getLang, () => 'en' as Lang)
}

const missing = new Set<string>()

/** `t('Book Now')` -> `'አሁን ይያዙ'` in Amharic, the English text otherwise. */
export function t(text: string): string {
  if (lang === 'en' || !text) return text
  const hit = am[text]
  if (hit !== undefined) return hit
  if (import.meta.env.DEV && !missing.has(text)) {
    missing.add(text)
    console.warn(`[i18n] No Amharic for: ${JSON.stringify(text)}`)
  }
  return text
}

/**
 * `t()` with `{name}` placeholders, for sentences that carry a value:
 * `tf('{n} results', { n: 4 })`. The dictionary key keeps the placeholders.
 */
export function tf(text: string, values: Record<string, string | number>): string {
  return t(text).replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m))
}

/** Fields that hold identifiers or links, never copy, so are never translated. */
const untranslated = new Set(['id', 'page', 'cat', 'img', 'image', 'heroImage', 'featureImage', 'logo', 'icon', 'email', 'phoneHref', 'whatsapp'])

/**
 * Every string inside an editable-content value, translated. Only strings the
 * dictionary knows change, so URLs, emails and an admin's own edits pass
 * through untouched. Cached per object (there is only one non-English
 * language), so a value keeps its identity between renders.
 */
export function translateContent<T>(value: T): T {
  if (lang === 'en') return value
  return deep(value) as T
}

const cache = new WeakMap<object, unknown>()

function deep(value: unknown): unknown {
  if (typeof value === 'string') return am[value] ?? value
  if (!value || typeof value !== 'object') return value
  const hit = cache.get(value)
  if (hit) return hit
  const out = Array.isArray(value)
    ? value.map(deep)
    : Object.fromEntries(Object.entries(value).map(([k, v]) => [k, untranslated.has(k) ? v : deep(v)]))
  cache.set(value, out)
  return out
}
