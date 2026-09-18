# `@addislimo/frontend`

React 19 + Vite 8 + Tailwind CSS v4. Run it from the repo root with `pnpm dev`
(or `pnpm --filter @addislimo/frontend dev`).

## Structure

```
src/
├── main.tsx              # entrypoint: mounts <RouterProvider><App/>
├── app/
│   ├── App.tsx           # page id -> component map
│   ├── routes.ts         # every page: id, URL, title, chrome  ← single source of truth
│   └── router.tsx        # tiny hash router + useRouter/useNavigate
├── assets/images/        # bundled partner logos
├── components/
│   ├── layout/           # Nav, Footer, SiteLayout
│   ├── sections/         # whole page sections (HomeHero, TrustStrip, QuickLinks)
│   └── ui/               # shared presentational pieces + button style objects
├── config/
│   ├── site.ts           # brand, contact details, socials, header nav
│   └── env.ts            # typed VITE_* access
├── data/                 # static site copy (services, fleet, destinations, partners)
├── features/
│   ├── booking/          # booking wizard options
│   └── admin/            # the operations console, see below
├── hooks/                # useScrolled, useMediaQuery
├── lib/
│   ├── api/              # fetch wrapper + endpoint map (nothing calls it yet)
│   └── utils/            # formatCurrency, formatDateTime, initialsOf
├── pages/                # one component per page
├── styles/
│   ├── index.css         # fonts, Tailwind import, global rules
│   ├── responsive.css    # all mobile adaptation, in one place
│   └── tokens.css        # the design tokens
└── types/                # domain types shared across features
```

## Conventions

**Imports use the `@/` alias.** `@/config/site`, not `../../config/site`. It is
configured in both `vite.config.ts` and `tsconfig.json`.

**Pages are dumb; content lives in `data/`.** A page owns layout and
interaction. Copy, imagery and listings live in `src/data` so the client's
wording can change without touching JSX. Feature-specific data (booking
options, admin rows) lives beside its feature in `*.data.ts`.

**Config, not constants.** Anything a client might phone up about — a number, a
tagline, which links are in the header — belongs in `src/config/site.ts`.

**Styling is inline `style` objects, not Tailwind classes.** That is inherited
from the Figma Make export and kept deliberately: the design is dense,
one-off and heavily gradient-driven, and converting it wholesale would risk
visual regressions for no gain. Every colour references a `var(--token)` from
`styles/tokens.css`, so a rebrand is still a one-file change. Tailwind is
available and fine to use in new components.

**Navigation goes through the router.** Pages receive a `navigate(page)` prop;
components anywhere can call `useNavigate()`. Nothing outside `app/router.tsx`
knows navigation is hash-based, so it can be swapped for `react-router-dom`
later without touching a page.

## Adding a page

1. Add an entry to `src/app/routes.ts` — id, `path`, `title`, and `chrome`
   (`'site'` draws Nav + Footer, `'bare'` does not).
2. Create the component in `src/pages/` taking `{ navigate }`.
3. Register it in the `pageComponents` map in `src/app/App.tsx`.
4. If it belongs in the header, add it to `mainNav` in `src/config/site.ts`.

TypeScript will fail the build if you miss step 3 — `pageComponents` is a
`Record<Page, …>`.

## Environment

Copy `.env.example` to `.env.local`. Only `VITE_`-prefixed variables reach the
browser; declare new ones in `src/vite-env.d.ts` and read them via
`src/config/env.ts`.

## Known placeholders

Things that are deliberately unfinished, waiting on the client:

- Phone and WhatsApp numbers in `config/site.ts` read "coming soon".
- The 69 Explore Addis destinations come from the client's service document;
  the client supplied names only, so the descriptions were written here and
  need a review pass with them. See [`../docs/CLIENT-BRIEF.md`](../docs/CLIENT-BRIEF.md).
- Social links point at bare domains.
- Some partner logos hot-link to Clearbit; they fall back to a monogram when
  the request fails.
- Fleet and destination photography is Unsplash placeholder imagery, assigned
  per category by `imagePool` in `data/destinations.ts`.
- Vehicle classes in the booking wizard use emoji instead of photos.
- The admin console runs on seed data in memory: edits last for the browser
  session and reset on reload. Its sign-in is a UI gate with one prototype
  account (`admin@addislimo.com` / `admin@2026`, shown on the sign-in page in
  development builds only). It is not an authentication system.
- `contact` is routed to the About page; there is no dedicated contact page yet.

## Admin console

Staff reach it at `#/admin/login`; nothing on the public site links there.
Every section has its own route (`#/admin/bookings`, `#/admin/finance`…), all
rendered by `pages/AdminDashboard.tsx`, which checks the session and picks the
section.

```
features/admin/
├── types.ts          # FleetPartner, Driver, FleetVehicle, Customer, settings
├── data.ts           # seed data, dated relative to "now" so it always looks live
├── store.ts          # shared in-memory store + toasts (useSyncExternalStore)
├── session.ts        # sign-in gate for the prototype
├── selectors.ts      # every figure the console shows is computed here
├── status.ts         # how each status looks: tone + glyph
├── format.ts, csv.ts # dates, currency, CSV export
├── nav.ts            # sections in the sidebar (only ones that work)
├── layout/           # AdminShell, Sidebar, Topbar
├── ui/               # Icon, StatusBadge, StatTile, Drawer, FilterTabs…
├── charts/           # RevenueChart
└── views/            # one file per section, plus BookingDrawer
```

Rules the console follows:

- **No typed-in numbers.** KPIs, deltas, payouts and customer totals come from
  `selectors.ts`, so every section agrees with every other and with edits.
- **Store actions are the future API calls.** `adminActions.updateBooking`
  becomes `PATCH /bookings/:id`; see `lib/api/endpoints.ts`.
- **Status colour is reserved** for needs-action (warning), done (good) and
  failed (critical), and never used alone: good and critical are nearly
  identical to red-green colourblind readers, so every badge also has its own
  glyph and a text label.
- **Numbers are set in Manrope**, with tabular figures in table columns.
  Playfair is kept for page titles.
- **Phones get different structure, not squeezed desktop.** The sidebar
  becomes a drawer and tables become card lists, switched with
  `useMediaQuery`. Check every change at 375px.

