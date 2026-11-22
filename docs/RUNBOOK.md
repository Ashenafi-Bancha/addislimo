# Running Addis Limo locally

Everything needed to bring the whole system up on one machine, in order, with
what to check at each step. Written to be followed during a demo, so each
command says what "working" looks like.

## What has to be installed

| | Version here | Check |
| --- | --- | --- |
| Node | 22.17.1 | `node --version` |
| pnpm | 10.34.3 | `pnpm --version` |
| Docker Desktop | 29.8.1 | `docker info` |

Nothing else. PostgreSQL runs in a container, so there is no database to
install. (This machine also has PostgreSQL 18 as a Windows service on port
5432; the project deliberately does not use it — see "If Docker will not
start" below.)

## Cold start

Four commands from the repository root. Takes about a minute the first time
and seconds afterwards.

```bash
pnpm install
docker compose up -d --wait
pnpm migrate
pnpm seed
```

`docker compose up --wait` returns only once PostgreSQL answers, so the
migration cannot race it. Expect:

```
Container addislimo-postgres  Healthy
[migrate] applied 001_init.sql
[seed] catalogue: 10 services, 4 vehicle classes
[seed] operations: 1 partner, 1 driver, 1 vehicle, 1 completed trip
[seed] admin account created for admin@addislimo.com
```

`pnpm seed` is safe to run again: it will not overwrite operations data that
already exists, and it creates the admin account only if there is none.

## Then start the two servers

**Two terminals, not one.** During a demo the logs are worth seeing.

```bash
# terminal 1 — the API
pnpm dev:api        # http://localhost:4100/api
```

```bash
# terminal 2 — the website
pnpm dev            # http://localhost:8443
```

Check both before anyone is watching:

```bash
curl http://localhost:4100/api/health
```

```bash
curl -o /dev/null -w "%{http_code}\n" http://localhost:8443/
```

`{"ok":true,...}` and `200`.

## Where things are

| | |
| --- | --- |
| Website | http://localhost:8443 |
| Admin console | http://localhost:8443/admin |
| API | http://localhost:4100/api |
| Database | `localhost:5437`, user/db `addislimo` |

The admin email is `admin@addislimo.com`. **The password is in
`backend/.env`** as `SEED_ADMIN_PASSWORD` — it was generated, it is not
committed, and it exists only on this machine.

## Running the tests in front of someone

```bash
docker compose --profile test up -d --wait
pnpm test:api
```

61 tests, about two seconds. The integration half drops and rebuilds a schema,
which is why it uses a second database on port 5438 and never the one holding
the demo bookings.

## Shutting down

```bash
docker compose down        # keeps the data
docker compose down -v     # throws the data away; `pnpm seed` rebuilds it
```

Ctrl-C the two dev servers. The database container restarts with the machine
on its own, so a reboot does not mean starting over.

## If something is wrong

**Docker will not start.** The engine takes 10–30 seconds after Docker Desktop
opens. `docker info` fails until it is ready. If Docker is unavailable
entirely, the API can point at the Windows PostgreSQL service on 5432 instead:
create a database and role there, put the connection string in
`backend/.env` as `DATABASE_URL`, and run `pnpm migrate && pnpm seed` again.
Nothing else changes.

**Port already taken.** This machine runs several projects' databases on
5432–5436 and something on 4000, which is why this one uses 5437 and 4100. If
either is busy, change `PORT` in `backend/.env` and the published port in
`compose.yaml`, then restart.

**The API exits at startup.** It refuses to run without a reachable database
or with `SESSION_SECRET` unset — on purpose, so a broken configuration fails
on the first line instead of on the first request. The message says which.

**A change to the API does not take effect.** `pnpm dev:api` watches and
restarts; `pnpm start` does not. Use `dev:api` while working.

**The website works but nothing reaches the database.** Check
`frontend/.env.local` has `VITE_API_URL=http://localhost:4100/api`, and that
Vite was restarted after it was written — Vite reads env files at startup.
Without it the site runs standalone by design: the booking form hands the
request to WhatsApp or mail and the console shows sample data.

## Resetting to a clean demo state

Worth doing shortly before the meeting, so the data looks deliberate:

```bash
docker compose down -v && docker compose up -d --wait && pnpm migrate && pnpm seed
```

That leaves exactly one partner, one driver, one vehicle and one completed
trip — ETB 3,400 gross, ETB 408 commission at 12% — so Overview and Finance
show real figures rather than zeroes.
