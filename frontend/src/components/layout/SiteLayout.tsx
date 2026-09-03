import type { ReactNode } from 'react'
import type { Page, RouteDefinition } from '@/app/routes'
import Footer from './Footer'
import Nav from './Nav'

interface SiteLayoutProps {
  /** `site` draws the public header and footer; `bare` renders the page alone. */
  chrome: RouteDefinition['chrome']
  page: Page
  navigate: (page: Page) => void
  children: ReactNode
}

/**
 * The frame around every page: brand background, header and footer.
 *
 * The admin console and its sign-in screen opt out via `chrome: 'bare'` in
 * `routes.ts` — they have their own sidebar and full-bleed layout.
 */
export default function SiteLayout({ chrome, page, navigate, children }: SiteLayoutProps) {
  const withChrome = chrome === 'site'

  return (
    <div
      style={{
        fontFamily: 'var(--font-body)',
        background: 'var(--ink)',
        color: 'var(--ivory)',
        minHeight: '100vh',
      }}
    >
      {withChrome && <Nav current={page} navigate={navigate} />}

      {/* Keyed on the page so the fade-in replays on every navigation. */}
      <main key={page} className="page-enter">
        {children}
      </main>

      {withChrome && <Footer navigate={navigate} />}
    </div>
  )
}
