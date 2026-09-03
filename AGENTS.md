# Addis Limo

A pnpm workspace holding a **frontend** (live) and a **backend** (not started
— `backend/` is a documented placeholder with no code). Premium chauffeur and
transportation platform for Addis Ababa.

The frontend is a React + Vite + Tailwind CSS app running inside Figma Make.

## Development server

A Vite development server is **already running** on `$PORT` (default 8443).
You don't need to start it manually.

- Preview URL: the user can access the running app through the preview panel
- Hot reload: changes to source files are reflected immediately

## Project structure

This is the canonical project structure. Start with task-relevant files below.
Only follow imports or inspect other files when required, when a documented
path is missing, or when the repository contradicts this guide.

### Workspace root

- `package.json` — workspace scripts. They only delegate to `frontend/`; the
  Figma Make harness calls `pnpm run dev` / `pnpm run build` here, so the
  script *names* must not change
- `pnpm-workspace.yaml` — lists `frontend` (add `backend` when it is scaffolded)
- `tsconfig.base.json` — compiler options both apps extend
- `.figma/make/` — harness hooks (`dev`, `install`, `build`/`deploy`, `format`)
  and `site.json`, which supplies the page title and meta tags
- `dist/` — build output, git-ignored, published by `.figma/make/deploy`
- `docs/ARCHITECTURE.md` — how the pieces fit together
- `docs/CLIENT-BRIEF.md` — the client's service PDF mapped to the files that
  own each item. **Read it before changing service or destination content**
- `backend/README.md` — the planned Node/Express/Postgres API. **Do not start
  building it unless asked**

### `frontend/`

- `vite.config.ts` — React, Tailwind v4 and Figma Make plugins; the `@` alias
  for `src`; `build.outDir` pointed at `../dist`
- `index.html` — Vite shell with `#root`, loading `src/main.tsx`
- `src/main.tsx` — entrypoint; mounts `<RouterProvider><App /></RouterProvider>`
- `src/app/routes.ts` — **every page's id, URL, title and chrome.** Single
  source of truth for navigation
- `src/app/App.tsx` — maps each page id to its component
- `src/app/router.tsx` — small hash router; exposes `useRouter` / `useNavigate`
- `src/pages/*.tsx` — one component per page, each taking `{ navigate }`
- `src/components/layout/` — `Nav`, `Footer`, `SiteLayout`
- `src/components/sections/` — self-contained page sections a page composes
  (`HomeHero`, `TrustStrip`, `QuickLinks`). Reach for this when a section
  grows past a screenful of JSX inside a page
- `src/components/ui/` — shared presentational pieces and the pill button
  style objects
- `src/config/site.ts` — brand name, tagline, contact details, socials, header
  nav. **Contact info and copy belong here, never inline in a component**
- `src/config/env.ts` — typed access to `VITE_*` variables
- `src/data/` — static site copy: services, fleet, destinations, partners
- `src/features/booking/`, `src/features/admin/` — feature-scoped options and
  mock data
- `src/lib/api/` — `fetch` wrapper and endpoint map for the future backend;
  nothing calls it yet
- `src/lib/utils/`, `src/hooks/` — small shared helpers
- `src/types/index.ts` — domain types shared across features
- `src/styles/tokens.css` — design tokens; `src/styles/index.css` — globals;
  `src/styles/responsive.css` — **all mobile adaptation lives here**, not in
  per-page `<style>` blocks. Most phones in Ethiopia are the primary target,
  so check every change at 375px
- `src/assets/images/` — bundled partner logos

`frontend/README.md` covers conventions and the list of known placeholders.

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, `@vitejs/plugin-react`
- Formatting: oxfmt (run from the workspace root)

There is deliberately **no router library** — see `src/app/router.tsx`.

## Styling

Tailwind CSS v4 via the `@tailwindcss/vite` plugin. `src/styles/index.css`
imports Tailwind with `@import 'tailwindcss';`, then the design tokens from
`./tokens.css`. Global CSS and Tailwind v4 theme customization go in those two
files. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/styles/index.css`, so global font wiring belongs
there. Keep CSS `@import` statements first, then `@font-face` rules and
font-family defaults.

Pages are styled with **inline `style` objects** reading CSS custom properties
(`var(--ink)`, `var(--gold-gradient)`), inherited from the Figma Make export.
Match that idiom when editing an existing page; Tailwind classes are fine in
new components. The `--gold-*` token names are historical — the live palette is
white/silver.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`),
  or escape them in single-quoted strings. An unescaped apostrophe in a
  single-quoted string breaks the build.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.
- Import with the `@/` alias, not long relative chains.
- Run `pnpm typecheck` before declaring frontend work finished.

## Adding a page

1. Add an entry to `src/app/routes.ts`.
2. Create the component in `src/pages/`.
3. Register it in `pageComponents` in `src/app/App.tsx` — TypeScript fails the
   build if you forget.
4. Add it to `mainNav` in `src/config/site.ts` if it belongs in the header.
