# Deployment

The site deploys to **Vercel** from the `main` branch on GitHub, and is served
at **addislimo.com** (the domain is registered with AletCloud, so its DNS lives
there and points at Vercel).

The frontend builds to a folder of static files, so it needs no server process
at all on Vercel. `server.mjs` and the `Dockerfile` stay in the repository for
the container hosts described under [Alternative: AletCloud](#alternative-aletcloud);
Vercel ignores both.

## Plans, and which one this site needs

| Plan | Cost | Allowed to run addislimo.com? |
| --- | --- | --- |
| Hobby | Free | **No.** Non-commercial personal projects only |
| Pro | $20 / month | Yes |

Vercel's [fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines)
restrict Hobby to non-commercial use, and read "commercial" broadly: a site that
advertises a paid service counts, whether or not it takes payment. A chauffeur
company's booking site is commercial.

So Hobby is the right place for the **private preview** that exists today, while
the site carries `noindex` and no customers have the link. Move to Pro before
pointing addislimo.com at it and telling anyone about it.

## What Vercel runs

`vercel.json` at the repository root holds every build setting, so the dashboard
needs no configuration and cannot drift away from what is in git.

| Step | Command | Result |
| --- | --- | --- |
| Install | `pnpm install --frozen-lockfile` | Installs the workspace from `pnpm-lock.yaml` |
| Build | `pnpm build` | Writes the static site to `dist/` |
| Serve | (none) | Vercel's CDN serves `dist/` directly |

`vercel.json` also sets the caching and security headers `server.mjs` applies on
a container host: a year of immutable caching for fingerprinted `/assets/*`,
`no-cache` on `index.html` so visitors always get the latest build, and a
catch-all rewrite to `index.html` so a pasted deep link reaches the app. Vercel
checks the filesystem before applying rewrites, so real files still win.

## First deploy

1. **Push to GitHub.** Vercel builds whatever is on the branch you choose.
2. Sign in at [vercel.com](https://vercel.com) and choose **Add New → Project**.
3. **Import** `Ashenafi-Bancha/addislimo`. Vercel asks for access to the
   repository through GitHub the first time.
4. Leave the framework preset, build command and output directory alone:
   `vercel.json` supplies them. Root directory stays the repository root.
5. **Deploy**, and watch the log. When it finishes the site is live over HTTPS
   on a `*.vercel.app` address. Open it and check the home page, the partner
   logos, the booking flow and `#/admin/login`.

Every later push to `main` redeploys automatically, and every pull request gets
its own preview URL.

## Connecting addislimo.com

The domain is registered with AletCloud, so the records are added there while
the site is served by Vercel.

1. In the Vercel project, open **Settings → Domains** and add both
   `addislimo.com` and `www.addislimo.com`.
2. Vercel then shows the exact records to create. Expect an **A** record for the
   apex (`76.76.21.21` at the time of writing) and a **CNAME** for `www`. The
   CNAME target is specific to your project, something like
   `d1d4fc829fe7bc7c.vercel-dns-017.com`, so copy it from the dashboard rather
   than from this document.
3. In the AletCloud console, open the DNS zone for `addislimo.com` and add
   exactly those records. Remove any existing A, AAAA or CNAME record for the
   same names first; a leftover record is the usual reason a domain reports an
   invalid configuration.
4. Wait for the certificate. Vercel issues HTTPS automatically once DNS
   resolves, usually within minutes.

Keep the MX and TXT records for email untouched. Only the website's A and CNAME
records change.

## Before making the site public

The site is deliberately hidden while it is a preview. Change these before
customers are sent to it:

- [ ] **Move to the Pro plan**, per the table above.
- [ ] **Allow search engines.** Set `"index": true` under `robots` in
      `.figma/make/site.json`. Today every page sends `noindex, nofollow` and
      `/robots.txt` disallows everything, so Google will not list the site.
- [ ] **Replace the admin sign-in.** The console is a UI prototype: its one
      account is hard-coded and readable in the JavaScript bundle, and it runs
      on demo data. Anyone can sign in. Do not put real bookings, customer
      details or partner payouts behind it until the backend provides real
      authentication (`POST /auth/login` in `frontend/src/lib/api/endpoints.ts`).
- [ ] **Fill in the placeholders** listed in `frontend/README.md`: the phone
      and WhatsApp numbers, social links, and licensed photography and logos.
- [ ] **Confirm the "70+" figure** in `frontend/src/data/trust.ts`; the
      catalogue lists 69 destinations.
- [ ] **Turn on auto-renew** for addislimo.com in AletCloud. It is currently
      off, and the registration runs to 4 September 2027.

## Alternative: AletCloud

AletCloud App Hosting builds a container from this repository and routes traffic
to it. The only contract it imposes is: **listen on `$PORT`, bound to
`0.0.0.0`**, which `server.mjs` meets. The `Dockerfile` produces the same result
for platforms that build from one.

| Step | Command |
| --- | --- |
| Install | `pnpm install --frozen-lockfile` |
| Build | `pnpm build` |
| Start | `pnpm start` (`node server.mjs`) |

Health check path: `/healthz`.

AletCloud gives one free Solo app (250m CPU, 256Mi memory) per account, and that
slot is already taken by another app on this account, so a second app there
starts at **360 ETB / month**.

## Running the production build locally

```bash
pnpm build
```

```bash
pnpm start
```

Then open http://localhost:8080. This runs `server.mjs`, not the Vercel path,
but it serves the same `dist/`.
