# Addis Limo — Backend (not started)

This folder is a **placeholder**. No code, no `package.json`, no dependencies —
nothing here runs. It exists so the repository is shaped like the full-stack
project it is becoming, and so the decisions already made are written down.

Stack agreed with the client:

| Layer     | Choice                       |
| --------- | ---------------------------- |
| Runtime   | Node.js 22                   |
| Framework | Express.js                   |
| Database  | PostgreSQL                   |
| Language  | TypeScript                   |

## What the frontend already expects

The frontend is wired to talk to this API the moment it exists. Two files are
the contract:

- `frontend/src/lib/api/endpoints.ts` — the route paths the client will call.
- `frontend/src/types/index.ts` — the JSON shapes it expects back
  (`Booking`, `ServiceOption`, `VehicleOption`, `Partner`, …).

Until `VITE_API_URL` is set, `frontend/src/lib/api/client.ts` throws
`ApiNotConfiguredError` on every call, so nothing fails silently. The pages
currently render the mock data in `frontend/src/data` and
the `*.data.ts` files under `frontend/src/features` instead.

## Planned layout

```
backend/
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── server.ts              # http listener
│   ├── app.ts                 # express app: middleware, routers, error handler
│   ├── config/                # env parsing, constants
│   ├── db/
│   │   ├── pool.ts            # pg connection pool
│   │   ├── migrations/        # forward-only SQL migrations
│   │   └── seeds/
│   ├── modules/               # one folder per resource
│   │   ├── bookings/          # routes → controller → service → repository
│   │   ├── services/
│   │   ├── vehicles/
│   │   ├── partners/
│   │   ├── quotes/
│   │   └── auth/
│   ├── middleware/            # auth guard, validation, rate limit, errors
│   ├── lib/                   # logger, mailer, helpers
│   └── types/
└── tests/
```

## Planned tables

Derived from what the UI already renders — see the admin console and the
booking wizard.

- `customers` — name, email, phone, created_at
- `bookings` — reference (`AL-XK9281`), customer, service_id, pickup,
  destination, scheduled_at, created_at, passengers, partner_id, driver_id
  (nullable), vehicle_id (nullable), status, amount, commission, notes.
  Commission is stored at pricing time so a later rate change rewrites nothing
- `partners` — fleet operators; name, type, contact name, phone, email,
  commission_rate, status (`Active` / `Pending` / `Suspended`), rating, joined_at
- `vehicles` — partner_id, make, model, year, plate, class, seats, status
  (`Available` / `Maintenance`; "On Trip" is derived from live bookings)
- `drivers` — partner_id, name, phone, licence_no, status (`Available` /
  `Off Duty`; "On Trip" is derived), rating
- `settings` — default commission rate for new partners, notification toggles

The admin console already exercises this model against seed data in
`frontend/src/features/admin/data.ts`, and `selectors.ts` there shows every
aggregate the API will need to serve (revenue by day, payouts per partner,
customers grouped by email).
- `services` — the sellable service types shown in step 1 of the wizard
- `admin_users` — email, password_hash, role

## When work starts

1. Scaffold `backend/package.json` as `@addislimo/backend`.
2. Add `backend` to `packages:` in `pnpm-workspace.yaml`.
3. Point `frontend/.env.local` at it: `VITE_API_URL=http://localhost:4000/api`.
4. Replace the mock imports in the pages with calls through
   `frontend/src/lib/api`.

The `.figma/make/*` scripts only ever build and serve the frontend, so adding
the backend will not disturb the Figma Make preview.
