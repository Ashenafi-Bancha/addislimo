# Addis Limo

Premium chauffeur and transportation platform for Addis Ababa — marketing site,
five-step booking flow, and an operations console for dispatch and commissions.

This is a pnpm workspace holding two applications:

| Package               | Path        | Status                                     |
| --------------------- | ----------- | ------------------------------------------ |
| `@addislimo/frontend` | `frontend/` | **Live.** React 19 + Vite 8 + Tailwind v4. |
| _(backend)_           | `backend/`  | **Not started.** Node + Express + Postgres. |

The frontend runs inside Figma Make: `.figma/make/dev` starts it, and
`.figma/make/deploy` publishes the `dist/` this repo's build produces. Those
scripts call the root `package.json` scripts, which delegate to `frontend/`.

## Getting started

```bash
pnpm install
```

```bash
pnpm dev
```

The dev server binds `0.0.0.0:$PORT` (default `8443`).

| Command          | What it does                                     |
| ---------------- | ------------------------------------------------ |
| `pnpm dev`       | Vite dev server with hot reload                  |
| `pnpm build`     | Production bundle into `dist/` at the repo root  |
| `pnpm preview`   | Serve the built bundle                           |
| `pnpm typecheck` | `tsc --noEmit` across the frontend               |
| `pnpm format`    | oxfmt across the workspace                       |

## Layout

```
addislimo/
├── frontend/            # the React app — see frontend/README.md
├── backend/             # placeholder; see backend/README.md
├── docs/                # architecture and conventions
├── .figma/make/         # Figma Make harness — dev, build, deploy hooks
├── dist/                # build output (git-ignored, published by Figma)
├── package.json         # workspace scripts
├── pnpm-workspace.yaml
└── tsconfig.base.json   # compiler options both apps extend
```

## Where things live

Looking for something to change? Start here.

| I want to change…                     | Edit                                       |
| ------------------------------------- | ------------------------------------------ |
| Phone number, email, socials, tagline | `frontend/src/config/site.ts`              |
| Which links are in the header         | `frontend/src/config/site.ts` (`mainNav`)  |
| Colours, fonts, spacing tokens        | `frontend/src/styles/tokens.css`           |
| Service / fleet / destination copy    | `frontend/src/data/`                       |
| Booking wizard options                | `frontend/src/features/booking/`           |
| Admin console mock data               | `frontend/src/features/admin/`             |
| Add or rename a page                  | `frontend/src/app/routes.ts` then `App.tsx` |
| API routes the client will call       | `frontend/src/lib/api/endpoints.ts`        |

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — how the two apps fit together.
- [`frontend/README.md`](frontend/README.md) — frontend structure and conventions.
- [`backend/README.md`](backend/README.md) — the API plan and database sketch.
- [`docs/CLIENT-BRIEF.md`](docs/CLIENT-BRIEF.md) — every line of the client's
  service PDF mapped to the file that owns it.
