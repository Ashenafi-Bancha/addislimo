# Architecture

## Shape of the repository

A pnpm workspace with two applications. Only the frontend exists today.

```
                       ┌──────────────────────────────┐
                       │  .figma/make/{dev,deploy}    │
                       │  Figma Make harness          │
                       └──────────────┬───────────────┘
                                      │ pnpm run dev / build (repo root)
                                      ▼
                       ┌──────────────────────────────┐
                       │  package.json (workspace)    │
                       │  delegates to the frontend   │
                       └──────────────┬───────────────┘
                                      ▼
   ┌──────────────────────────────────────────────┐      ┌───────────────────┐
   │  frontend/  @addislimo/frontend              │      │  backend/         │
   │  React 19 · Vite 8 · Tailwind v4 · TS        │─ ─ ─▶│  Express · Postgres│
   │  builds to <repo>/dist                       │ HTTP │  (not started)     │
   └──────────────────────────────────────────────┘      └───────────────────┘
```

## Why the root package.json only delegates

The Figma Make harness is not configurable: `.figma/make/dev` runs
`pnpm run dev` at the repo root, and `.figma/make/deploy` runs `pnpm run build`
then publishes `<repo>/dist`. The workspace has to keep honouring both.

So the root `package.json` keeps the same script names and forwards them to the
frontend package, and `frontend/vite.config.ts` sets
`build.outDir` to `../dist`. Nothing in `.figma/` needed to change except
`dev.json`, which now also watches `frontend/package.json` and
`pnpm-workspace.yaml` so a dependency change still triggers a reinstall.

`backend/` is intentionally absent from `pnpm-workspace.yaml` until it has a
`package.json`.

## Frontend layering

```
 pages/  ──────────  layout + interaction, one file per screen
   │
   ├── data/ ─────── static copy: services, fleet, destinations, partners
   ├── features/ ─── feature-scoped state, options and mocks (booking, admin)
   ├── components/ ─ layout chrome (Nav, Footer, SiteLayout) and shared UI
   ├── config/ ───── brand facts and env
   ├── lib/api/ ──── the future HTTP boundary
   └── types/ ────── domain types shared by all of the above
```

The rule that matters: **a page never hard-codes content a client might want
changed.** Copy goes in `data/`, brand facts go in `config/site.ts`, colours go
in `styles/tokens.css`.

## Routing

`src/app/routes.ts` is the single source of truth: it lists every page with its
URL, browser title, and whether the public header/footer are drawn. `App.tsx`
maps those ids to components, and TypeScript enforces that the map is complete.

`src/app/router.tsx` is a ~60-line hash router. It was chosen over
`react-router-dom` because the app is a flat set of pages with no nested or
parameterised routes, and this keeps the dependency list at exactly React. It
still gives real URLs (`#/booking`), working back/forward, and per-page titles.
Because every consumer goes through `useRouter()` / the `navigate` prop,
swapping in `react-router-dom` later is a change to one file.

## The API boundary

Nothing calls the network yet, but the seam is in place:

- `lib/api/client.ts` owns the base URL, JSON encoding, credentials and error
  types (`ApiError`, `ApiNotConfiguredError`).
- `lib/api/endpoints.ts` lists the paths the Express app will expose.
- `types/index.ts` defines the payload shapes both sides will agree on.

While `VITE_API_URL` is unset, every call throws rather than silently hitting
the Vite dev server and getting HTML back. Wiring a screen to the API means
swapping a `data/` import for an `api.get(...)` call — the types do not change.

## Styling

Inline `style` objects, inherited from the Figma Make export, reading from CSS
custom properties in `styles/tokens.css`. Tailwind v4 is installed and
available; new components may use either. The `--gold-*` token names are
historical — the live palette is white/silver, and the names were kept so the
brand can be swapped back without touching components.
