import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { DEFAULT_PAGE, hrefFor, pageFromHash, routes, type Page } from './routes'
import { site } from '@/config/site'

/**
 * A deliberately small hash router.
 *
 * The app started life as `useState<Page>` inside `App`, which meant no
 * shareable URLs and no back button. This keeps that simplicity (no extra
 * dependency, no nested route trees) while giving every page a real address
 * like `#/booking`. If the app ever grows nested or parameterised routes,
 * swap this file for `react-router-dom` — nothing outside it knows how
 * navigation is implemented, because everything goes through `useRouter()`.
 */

interface RouterValue {
  page: Page
  navigate: (page: Page) => void
  hrefFor: (page: Page) => string
}

const RouterContext = createContext<RouterValue | null>(null)

function currentPage(): Page {
  if (typeof window === 'undefined') return DEFAULT_PAGE
  return pageFromHash(window.location.hash)
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>(currentPage)

  // The hash is the source of truth: back/forward and pasted links both work.
  useEffect(() => {
    const onHashChange = () => setPage(currentPage())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.title = `${routes[page].title} · ${site.name}`
  }, [page])

  const navigate = useCallback((next: Page) => {
    const href = hrefFor(next)
    if (window.location.hash === href) {
      // Same page requested (e.g. logo click while already home): no history
      // entry, but still honour the scroll-to-top the user expects.
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.location.hash = href
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const value = useMemo<RouterValue>(() => ({ page, navigate, hrefFor }), [page, navigate])

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export function useRouter(): RouterValue {
  const value = useContext(RouterContext)
  if (!value) throw new Error('useRouter must be used inside <RouterProvider>')
  return value
}

/** Convenience hook for components that only need to move the user around. */
export function useNavigate(): (page: Page) => void {
  return useRouter().navigate
}
