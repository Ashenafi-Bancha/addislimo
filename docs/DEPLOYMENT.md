# Deployment

The site deploys to **AletCloud App Hosting** from the `main` branch on GitHub,
and is served at **addislimo.com** (registered with AletCloud).

AletCloud builds a container from the repository and routes traffic to it. The
only contract it imposes is: **listen on `$PORT`, bound to `0.0.0.0`.** This
repository meets it with `server.mjs`.

## What runs in production

| Step | Command | Result |
| --- | --- | --- |
| Install | `pnpm install --frozen-lockfile` | Installs the workspace from `pnpm-lock.yaml` |
| Build | `pnpm build` | Writes the static site to `dist/` |
| Start | `pnpm start` (`node server.mjs`) | Serves `dist/` on `$PORT` |

`server.mjs` uses only Node built-ins, so it runs even if the platform removes
dev dependencies after the build. It sets year-long caching on fingerprinted
`/assets/*` files, `no-cache` on `index.html` (so visitors always get the
latest build), gzips text, and answers `GET /healthz` with `ok`.

A `Dockerfile` produces the same result, for when a platform builds from it.

## First deploy

1. **Push to GitHub.** AletCloud builds whatever is on the branch you choose.
2. In the AletCloud console, open **App Hosting → Create app**.
3. **Connect GitHub** and choose `Ashenafi-Bancha/addislimo`, branch `main`.
4. If the console asks for settings, use:
   - Root directory: the repository root (leave empty)
   - Install command: `pnpm install --frozen-lockfile`
   - Build command: `pnpm build`
   - Start command: `pnpm start`
   - Port: read from `$PORT` automatically; if a field is required, `8080`
   - Health check path: `/healthz`

   If it detects the stack on its own, it will find these same scripts in
   `package.json`.
5. Watch the build log. When it finishes, the app is live over HTTPS on a free
   `aletcloud` subdomain. Open it and check the home page, the partner logos
   and `#/admin/login`.

Every later push to `main` redeploys automatically.

## Connecting addislimo.com

Because the domain was bought on AletCloud, the console can wire it to the app
in one click: open the app's **Domains** settings, add `addislimo.com`, then
add `www.addislimo.com` as well.

If it asks you to set records by hand instead:

1. Add the **TXT** record it shows, to prove you own the domain.
2. Point the domain at the app with the **A** (for `addislimo.com`) and
   **CNAME** (for `www`) records it shows.
3. Wait for the certificate. HTTPS is issued automatically once DNS resolves;
   this usually takes minutes, and occasionally up to a few hours.

Use the exact values the console gives you — they are specific to your app.

## Before making the site public

The site is deliberately hidden while the free plan hosts a preview. Change
these before customers are sent to it:

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
- [ ] **Move to a paid plan.** AletCloud does not publish the free Solo
      plan's CPU, memory or idle behaviour. Ask support (call 6993 or
      support@aletcloud.com) whether it sleeps when idle; if it does, the
      first visit after a quiet period will be slow.

## Running the production build locally

```bash
pnpm build
```

```bash
pnpm start
```

Then open http://localhost:8080.
