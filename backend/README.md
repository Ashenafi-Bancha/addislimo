# Addis Limo — Backend

The API behind the booking form and the admin console. Node 22, Express 5,
PostgreSQL 15+, TypeScript.

Node runs the TypeScript directly with `--experimental-strip-types`, so there
is no build step and no `dist/`. Types are erased, never compiled, which is
why nothing here uses an enum or a constructor parameter property: both emit
runtime code and Node refuses them.

## Running it

```bash
# 1. a database (any PostgreSQL 15+ will do)
docker run -d --name addislimo-postgres \
  -e POSTGRES_USER=addislimo -e POSTGRES_PASSWORD=addislimo_local_dev \
  -e POSTGRES_DB=addislimo -p 5437:5432 postgres:18-alpine

# 2. configuration
cp .env.example .env
#    set SESSION_SECRET (32+ chars) and SEED_ADMIN_PASSWORD:
#    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 3. schema, catalogue and the first admin
pnpm migrate
pnpm seed

# 4. go
pnpm dev            # http://localhost:4100/api
```

`pnpm seed` loads the service and vehicle-class catalogue — the wizard cannot
price a trip without it — plus one partner, driver, vehicle and completed trip
so Overview and Finance have figures. It will not touch operations data that
already exists, and it creates the admin account only if there is none.

| Command | |
| --- | --- |
| `pnpm dev` | watch mode |
| `pnpm migrate` | apply outstanding migrations |
| `pnpm reset` | drop the schema and rebuild it (refuses in production) |
| `pnpm seed` | catalogue, sample operations, first admin |
| `pnpm test` | 61 tests; see below |
| `pnpm typecheck` | |

## Shape

```
src/
├── server.ts          listener, graceful shutdown
├── app.ts             middleware, routers, the /api mount points
├── config/env.ts      every setting, parsed and checked at boot
├── db/
│   ├── pool.ts        pg pool, query/queryOne/transaction
│   ├── migrate.ts     forward-only runner, checksummed
│   ├── migrations/    SQL, applied in filename order
│   └── seed.ts
├── lib/               errors, ids, password hashing, request plumbing
├── middleware/        session loading, role guards, rate limit, errors
└── modules/           one folder per resource
    ├── auth/          sign-in, sessions, lockout
    ├── bookings/      repository, service (the rules), routes, status machine
    ├── quotes/        fare.ts (pure arithmetic), pricing.ts (fares from the db)
    ├── partners/ drivers/ vehicles/
    ├── customers/     derived from bookings, not a table
    ├── content/       the CMS groups and image uploads
    └── admin/         metrics, payouts, settings, accounts
```

Each resource is routes → service → repository. The repository owns the SQL,
the service owns what is allowed, the route owns validation and status codes.
Bookings is the only module with a service file worth the name, because it is
the only one with rules that span tables.

## The rules it enforces

These are the reason the backend exists rather than the frontend writing
straight to a database.

**Status is a state machine.** `Pending → Confirmed → Assigned → Driver En
Route → In Progress → Completed`, with `Cancelled` reachable from anything
still open and both end states terminal. A trip cannot skip to Completed and
collect revenue nobody drove. Dispatch can step back while the trip has not
started. See `modules/bookings/status.ts`.

**Nobody is dispatched who cannot be.** A driver or vehicle must belong to the
partner fulfilling the trip — enforced by a composite foreign key, not a
check the service could forget. A vehicle must have enough seats. A driver on
duty. A trip cannot go on the road without a driver, or be assigned without a
partner.

**One driver, one live trip.** A partial unique index on
`(driver_id) WHERE status IN ('Driver En Route','In Progress')`, and the same
for vehicles. Two dispatchers assigning the same driver at the same second is
exactly the race a service-layer check loses; the second one gets "that driver
was just put on another trip".

**Money is settled when earned and never recalculated.** Commission is worked
out from the partner's rate at pricing time and stored on the booking. Change
the rate next month and last month's payouts do not move. A completed or
cancelled booking's price cannot be edited at all.

**History is never deleted by accident.** A partner with bookings cannot be
deleted — the API says to suspend them. A driver or vehicle on an open trip
cannot be deleted until it is reassigned; once gone, past bookings read
"Removed driver". A trip under way cannot be deleted. A customer on a trip
right now cannot be removed. Every rule has a `/delete-check` endpoint so the
console can show the consequences before asking.

**Every status change is recorded.** `booking_events` holds who did what and
when, for the whole life of a booking. Dispatch disputes are settled from it.

## Authentication

A real session, replacing the UI gate in
`frontend/src/features/admin/session.ts` whose one account was readable in the
JavaScript bundle.

- scrypt from the standard library, parameters stored in the hash so the cost
  can be raised later without invalidating existing passwords
- an opaque random token in an `httpOnly`, `sameSite`, `secure`-in-production
  cookie; only its SHA-256 is stored, so a database backup is not a set of
  working sessions
- the account is re-read from the database on every request, so disabling one
  takes effect immediately
- five failures per account locks it for fifteen minutes, counted in
  `login_attempts` so a restart does not reset the allowance; a second,
  looser limit per IP sits in front
- an unknown email costs the same time as a wrong password, so response time
  is not an account oracle
- roles: `admin`, `dispatcher`, `viewer`. A viewer reads everything and writes
  nothing.

## Pricing

Base fare per service × vehicle-class multiplier, plus 15% for a pickup
between 22:00 and 05:00 Addis time, plus 150 ETB per passenger above what the
class seats. Rounded to 10 ETB. No distance component: nothing in the system
knows where anywhere is, and a figure invented from a straight line between
two place names would be worse than a stated fare.

Fares live in the `services` and `vehicle_classes` tables, so repricing is the
client's to do and not a deploy. The arithmetic is in `modules/quotes/fare.ts`
with no database import, which is why it can be tested directly.

## Tests

```bash
pnpm test
```

61 tests. `tests/domain.test.ts` covers the rules that need nothing else —
the transition table, commission splitting, the night window, reference
generation, password hashing. `tests/api.test.ts` drives the real HTTP API
against a real PostgreSQL, because the rules that matter most are the ones a
mock would not have: a foreign key refusing a driver from the wrong partner, a
unique index refusing a second live trip, a transaction rolling back.

The integration tests **drop and rebuild the schema**, so they refuse to run
unless `DATABASE_URL` and `SESSION_SECRET` are set, and they should point at a
database you do not mind losing:

```bash
docker run -d --name addislimo-test-db -e POSTGRES_USER=test \
  -e POSTGRES_PASSWORD=test -e POSTGRES_DB=test -p 5438:5432 postgres:18-alpine
# then put that URL in backend/.env.test
```

Without those variables the integration suite skips and the unit tests still
run.

## How the frontend uses it

`VITE_API_URL` decides. Set it and the site talks to this server; leave it
empty and the site runs on its own, which is what the deployed build does
until this is live. Both paths are real, and the one difference a visitor can
see is stated on screen rather than hidden.

| | `VITE_API_URL` set | empty |
| --- | --- | --- |
| Booking form | `POST /bookings`, a row and a server-issued reference | kept in the browser, handed to WhatsApp or mail |
| Confirmation | "We have your request" | "Send us your request" |
| Admin sign-in | `POST /auth/login`, scrypt, httpOnly cookie | the prototype gate, one hard-coded account |
| Admin data | loaded from here, writes go back | seed data, resets on reload |

The three seams: `features/booking/submit.ts` chooses how a booking travels,
`features/admin/session.ts` chooses what sign-in means, and
`features/admin/store.ts` keeps the shape its fifteen views expect while
writing through to `features/admin/api.ts` underneath. Writes are optimistic
and roll back if this server refuses, showing the refusal as a toast — which
is how a dispatcher finds out the driver they picked was claimed a second ago
by someone else.

## Deploying

The API needs a PostgreSQL it can reach and these variables: `DATABASE_URL`,
`DATABASE_SSL=require` for a managed database, `SESSION_SECRET`,
`CORS_ORIGINS` listing the site's real origin, and `NODE_ENV=production`.

Put the API on a subdomain of the site — `api.addislimo.com` — so the session
cookie stays same-site. If it has to live on a different domain, set
`CROSS_SITE_COOKIE=1`, which switches the cookie to `SameSite=None; Secure`;
that works but it is strictly weaker, so prefer the subdomain.

Run `pnpm migrate` as part of the deploy. It is forward-only and refuses to
run a migration whose contents changed since it was applied.
