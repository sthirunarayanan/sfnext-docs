# sfnext-docs
Developer Documents for Storefront Next

React + Tailwind + Vite site with a developer quickstart for the storefront repo
(prerequisites, `.env` setup, local run/quality/deploy commands, and the git
rebase workflow).

## Local development

```bash
pnpm install
cp .env.example .env
node scripts/hash-password.mjs "choose-a-password"   # paste the output below
# .env
# VITE_DOCS_PASSWORD_HASH=<paste hash here>
pnpm dev
```

Open http://localhost:5174 and enter the password you chose to unlock the site.

## Access control

The site is gated behind a password screen (`src/components/PasswordGate.tsx`)
so it isn't publicly browsable without the shared password, on **both**
`localhost` and the deployed production build:

- The password's SHA-256 hash is baked into the build via the
  `VITE_DOCS_PASSWORD_HASH` env var (never commit the plaintext password).
- Generate the hash with `node scripts/hash-password.mjs "<password>"`.
- Entering the correct password unlocks the site for the browser session
  (`sessionStorage`) — it resets when the tab is closed.

**Important caveat:** this is a client-side gate suitable for deterring casual
access to an internal docs site, not a real security boundary — the hash ships
in the public JS bundle and can be brute-forced offline. For a genuine
production access boundary, additionally enable password/HTTP Basic Auth at
the hosting layer, e.g.:

- **Netlify**: enable "Visitor access" password protection on the site, or add
  an `_headers`/Edge Function for Basic Auth.
- **Vercel**: enable "Password Protection" in Project Settings (Pro plan), or
  add middleware that checks an `Authorization: Basic` header.

If neither is available, treat `VITE_DOCS_PASSWORD_HASH` as the only gate and
rotate the password periodically.

## Daily Report tab (agent briefing feed)

The "Daily Report" sidebar entry (`/daily-report`) lists the consolidated
daily briefings from the Chief agent behind its **own** password
(`VITE_REPORT_PASSWORD_HASH`, independent of the site-wide gate above).

- **Content**: one markdown file per day at
  `src/data/daily-reports/<YYYY-MM-DD>.md`, picked up at build time with
  `import.meta.glob` — adding a file is the whole publish step; there is no
  index or codegen to maintain.
- **Feeding a report**:
  - *Automatic (headless)*: `.github/workflows/daily-report.yml` accepts a
    `repository_dispatch` of type `daily-report` with
    `client_payload: { date: "YYYY-MM-DD", markdown: "..." }` — it writes the
    file, commits it, and deploys to Pages in the same run. Requires a GitHub
    token with repo scope on the caller's side.
  - *Manual*: commit the file and push to `main` — `deploy.yml` deploys it
    like any other change.
- **Repository secret**: add `VITE_REPORT_PASSWORD_HASH` (Settings → Secrets
  and variables → Actions) with the hash from
  `node scripts/hash-password.mjs "<daily-report-password>"`. Without it the
  production build shows a misconfiguration notice instead of the tab's
  content.
- The Chief agent publishes each morning's briefing automatically after its
  consolidation pass (see its Phase 3 publish step).
- **Pipeline**: `.github/workflows/daily-report-pipeline.yml` runs every
  working day (cron `15 7 * * 1-5` UTC — Mon–Fri only). It runs
  `scripts/feed-daily-report.ps1 -Verify` to confirm the day's report actually
  landed (a red X = the feed chain broke that morning), then rebuilds and
  redeploys the site. The same script's `-Publish` mode is what Chief runs
  locally; `-FromDispatch` powers the `repository_dispatch` path above.

## Production build

```bash
# Set VITE_DOCS_PASSWORD_HASH as a build-time environment variable in your
# hosting provider's project settings before running the build — Vite bakes
# env vars in at build time, so it must be set BEFORE `pnpm build` runs.
pnpm build
pnpm preview   # sanity-check the production build locally
```

## Deployment — GitHub Pages at docs.ashleyfurniture.com

`.github/workflows/deploy.yml` builds and publishes `dist/` to GitHub Pages on
every push to `main` (or manually via "Run workflow").

**One-time setup (requires repo admin / DNS access — not done by this agent):**

1. **Repository secret**: Settings → Secrets and variables → Actions → add
   `VITE_DOCS_PASSWORD_HASH` with the hash from
   `node scripts/hash-password.mjs "<password>"`. The workflow fails the
   build without it in a production (`PROD`) build — see `PasswordGate.tsx`.
2. **Repository secret (Daily Report tab)**: add `VITE_REPORT_PASSWORD_HASH`
   the same way — the separate password gating the "Daily Report" tab (see
   "Daily Report tab" below). Both `deploy.yml` and `daily-report.yml` pass it
   into the build.
3. **Pages source**: Settings → Pages → Build and deployment → Source =
   "GitHub Actions" (not "Deploy from a branch").
4. **Custom domain**: Settings → Pages → Custom domain = `docs.ashleyfurniture.com`,
   then check "Enforce HTTPS" once the certificate provisions. `public/CNAME`
   already contains this domain so it's copied into every build automatically.
5. **DNS record** (added by whoever manages `ashleyfurniture.com` DNS — not
   this repo): a `CNAME` record —
   - Host: `docs`
   - Target: `<github-org-or-user>.github.io` (the GitHub Pages default
     domain for this repository's owner)
   - TTL: provider default

Once DNS propagates and the workflow has run at least once, the site is live
at `https://docs.ashleyfurniture.com`.
