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
2. **Pages source**: Settings → Pages → Build and deployment → Source =
   "GitHub Actions" (not "Deploy from a branch").
3. **Custom domain**: Settings → Pages → Custom domain = `docs.ashleyfurniture.com`,
   then check "Enforce HTTPS" once the certificate provisions. `public/CNAME`
   already contains this domain so it's copied into every build automatically.
4. **DNS record** (added by whoever manages `ashleyfurniture.com` DNS — not
   this repo): a `CNAME` record —
   - Host: `docs`
   - Target: `<github-org-or-user>.github.io` (the GitHub Pages default
     domain for this repository's owner)
   - TTL: provider default

Once DNS propagates and the workflow has run at least once, the site is live
at `https://docs.ashleyfurniture.com`.
