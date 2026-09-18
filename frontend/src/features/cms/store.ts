import { useSyncExternalStore } from 'react'
import { contentDefaults, type ContentKey, type SiteContent } from './content'
import published from './published.json'

/**
 * The website's editable content, in three layers, later ones winning:
 *
 *   1. `contentDefaults` — the copy in `src/data` and `src/config/site.ts`.
 *   2. `published.json` — content exported from the admin console and
 *      committed to the repository. This is how an edit reaches visitors
 *      before the backend exists: export, commit, deploy.
 *   3. Saved edits in this browser (localStorage). They show on the public
 *      site in this browser straight away, and in every open tab.
 *
 * When the backend lands, layer 3 becomes `GET /content` and `save` becomes
 * `PUT /content/:key` (see `lib/api/endpoints.ts`). Nothing that reads content
 * through `useContent` will need to change.
 */

type Overrides = Partial<Record<ContentKey, unknown>>

const STORAGE_KEY = 'addislimo.content.v1'

const publishedLayer = published as Overrides

function readLocal(): Overrides {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {}
  } catch {
    return {}
  }
}

/**
 * A stored value only replaces the default when it has the same shape. Lists
 * replace wholesale (an emptied list stays empty); objects are merged over the
 * default, so a field added to the site later still has a value in content
 * saved before it existed.
 */
function resolve<K extends ContentKey>(key: K, layers: Overrides[]): SiteContent[K] {
  let value: unknown = contentDefaults[key]
  for (const layer of layers) {
    if (!(key in layer)) continue
    const next = layer[key]
    if (Array.isArray(value)) {
      if (Array.isArray(next)) value = next
    } else if (next && typeof next === 'object' && !Array.isArray(next)) {
      value = { ...(value as object), ...(next as object) }
    }
  }
  return value as SiteContent[K]
}

function build(local: Overrides): SiteContent {
  const keys = Object.keys(contentDefaults) as ContentKey[]
  return Object.fromEntries(keys.map((k) => [k, resolve(k, [publishedLayer, local])])) as unknown as SiteContent
}

let local: Overrides = typeof window === 'undefined' ? {} : readLocal()
let content: SiteContent = build(local)
const listeners = new Set<() => void>()

function commit(next: Overrides): SaveResult {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch (error) {
    const full = error instanceof DOMException && /quota/i.test(error.name + error.message)
    return {
      ok: false,
      error: full
        ? 'The browser has no room left for this change. Use smaller images, or image links instead of uploads.'
        : 'This browser is blocking saved data, so the change could not be kept.',
    }
  }
  local = next
  content = build(local)
  listeners.forEach((l) => l())
  return { ok: true }
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  // An edit saved in the admin tab updates a public-site tab already open.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return
    local = readLocal()
    content = build(local)
    listener()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

/** Read one content group. Re-renders when it is edited, in any tab. */
export function useContent<K extends ContentKey>(key: K): SiteContent[K] {
  return useSyncExternalStore(subscribe, () => content[key], () => content[key])
}

/** Read every group at once, for the admin editor. */
export function useAllContent(): SiteContent {
  return useSyncExternalStore(subscribe, () => content, () => content)
}

export type SaveResult = { ok: true } | { ok: false; error: string }

export const contentActions = {
  save<K extends ContentKey>(key: K, value: SiteContent[K]): SaveResult {
    return commit({ ...local, [key]: value })
  },

  /** Drop this browser's edits to one group, back to the published content. */
  reset(key: ContentKey): SaveResult {
    const next = { ...local }
    delete next[key]
    return commit(next)
  },

  /** True when this browser holds unpublished edits to the group. */
  isEdited(key: ContentKey): boolean {
    return key in local
  },

  editedKeys(): ContentKey[] {
    return Object.keys(local) as ContentKey[]
  },

  /**
   * Everything that differs from the code defaults, as the JSON that goes in
   * `features/cms/published.json`.
   */
  exportJson(): string {
    return JSON.stringify({ ...publishedLayer, ...local }, null, 2) + '\n'
  },

  /** Load an export into this browser. Unknown keys are ignored. */
  importJson(text: string): SaveResult {
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      return { ok: false, error: 'That file is not valid JSON.' }
    }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ok: false, error: 'That file is not a content export.' }
    }
    const known = Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter(([k]) => k in contentDefaults),
    ) as Overrides
    if (Object.keys(known).length === 0) return { ok: false, error: 'That file holds no website content.' }
    return commit({ ...local, ...known })
  },
}
