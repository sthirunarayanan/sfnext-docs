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

## Deployment — Firebase Hosting + Cloud Functions (project `sfnext-docs`)

The static site is served by Firebase Hosting (`dist/`), and the
`/api/scapi-token`, `/api/unifi-token`, `/api/unifi-dpos-token`,
`/api/unifi-lookup-transaction`, and `/api/unifi-transact` routes are rewritten
(see `firebase.json`) to Cloud Functions in `functions/` — these mirror the
dev-only Vite proxy in `vite.config.ts`, so the "Server-to-Server Token Calls"
demo in `UnifiDemo.tsx` works the same way on the deployed site as it does
under `pnpm dev`, with no CORS issues (same-origin) and no secrets shipped to
the browser.

**One-time setup:**

1. Log in to the Firebase CLI: `pnpm firebase:login` (opens a browser).
2. Confirm you have access to the `sfnext-docs` Firebase project:
   `pnpm exec firebase projects:list`.
3. For a custom domain (e.g. `docs.ashleyfurniture.com`), add it under
   Firebase Console → Hosting → "Add custom domain", then add the DNS records
   it gives you (whoever manages `ashleyfurniture.com` DNS — not this repo).

**Deploying:**

```bash
# Set VITE_DOCS_PASSWORD_HASH in your shell (Vite bakes env vars in at build
# time — see "Production build" above) before running:
pnpm firebase:deploy
```

This builds the site and deploys both Hosting and Functions in one step.
