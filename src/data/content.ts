export interface EnvVar {
    name: string;
    required: boolean;
    description: string;
}

export interface Command {
    command: string;
    description: string;
}

export interface Step {
    title: string;
    description: string;
    command?: string;
}

export interface EnvironmentValues {
    development: string;
    stage: string;
    production: string;
}

export interface FeatureFlag extends EnvironmentValues {
    name: string;
    description: string;
}

export interface CustomAttribute extends EnvironmentValues {
    name: string;
    objectType: string;
    description: string;
}

export interface UnifiCredential {
    name: string;
    value: string;
    description: string;
}

export const prerequisites: Command[] = [
    {
        command: 'node --version',
        description:
            'Node.js is the JavaScript runtime the dev server, build, and all tooling run on. Check that your installed version satisfies the "engines" field in package.json before continuing — an older Node silently breaks native modules like @swc/core.',
    },
    {
        command: 'corepack enable',
        description:
            'Enables Corepack, which ships with Node and manages the exact pnpm version pinned for the project. This avoids "works on my machine" issues caused by mismatched package-manager versions resolving dependencies differently.',
    },
    {
        command: 'git clone https://github.com/Ashley-Digital/ashley-sfcc-storefront.git',
        description:
            'Clones the storefront repository to your machine. You need read access to the Ashley-Digital GitHub organization for this to succeed.',
    },
    {
        command: 'pnpm install',
        description:
            'Installs every dependency declared in package.json and its lockfile (pnpm-lock.yaml). Run this any time you pull changes that touch package.json — pnpm will no-op quickly if nothing changed.',
    },
];

export const envVars: EnvVar[] = [
    {
        name: 'MRT_PROJECT',
        required: true,
        description:
            'The Managed Runtime project slug. Read by the storefront-next-dev CLI (not by the app at runtime) and used only when you run "pnpm push" to deploy a bundle to Commerce Cloud Managed Runtime.',
    },
    {
        name: 'MRT_TARGET',
        required: true,
        description:
            'The Managed Runtime deployment target/environment (e.g. "development"). Combined with MRT_PROJECT to determine exactly where "pnpm push" uploads your build.',
    },
    {
        name: 'PUBLIC__app__commerce__api__clientId',
        required: true,
        description:
            'The SCAPI (Shopper Commerce API) OAuth client ID the storefront uses to authenticate shopper requests against your B2C Commerce instance. The "PUBLIC__" prefix means this value is safe to expose to the browser bundle.',
    },
    {
        name: 'PUBLIC__app__commerce__api__organizationId',
        required: true,
        description:
            'Identifies which B2C Commerce organization (realm) SCAPI calls are routed to. This is specific to your Commerce Cloud tenant and differs between sandboxes, staging, and production.',
    },
    {
        name: 'PUBLIC__app__commerce__api__siteId',
        required: true,
        description:
            'The B2C Commerce Site ID (e.g. "RefArchGlobal") that scopes catalog, pricing, and content to a specific storefront site within the organization.',
    },
    {
        name: 'PUBLIC__app__commerce__api__shortCode',
        required: true,
        description:
            'The SCAPI short code — a per-realm routing identifier Commerce Cloud assigns that prefixes every SCAPI request URL. Without the correct short code, API calls resolve to the wrong (or no) backend.',
    },
];

export const runCommands: Command[] = [
    {
        command: 'pnpm dev',
        description:
            'Starts the local development server at http://localhost:5173 with hot module replacement. This is the command you use for day-to-day feature work.',
    },
    {
        command: 'pnpm dev:debug',
        description:
            'Same as "pnpm dev" but attaches the Node.js inspector, so you can set breakpoints in server-side loader/action code from your editor or Chrome DevTools.',
    },
    {
        command: 'pnpm storybook',
        description:
            'Launches Storybook at http://localhost:6006 for isolated UI component development, independent of routing or server data.',
    },
];

export const qualityCommands: Command[] = [
    {
        command: 'pnpm typecheck',
        description:
            'Regenerates React Router route types and runs the TypeScript compiler in no-emit mode. Required after any .ts/.tsx edit — this is the only command that catches the strict-typing class of bugs CI enforces.',
    },
    {
        command: 'pnpm lint',
        description:
            'Runs ESLint across the main workspace and the e2e sub-package with --max-warnings 0, identical to what CI enforces. A single warning fails this command.',
    },
    {
        command: 'pnpm test',
        description:
            'Runs the Vitest unit test suite once (no watch mode). Pass a path, e.g. "pnpm test src/components/foo", to scope it to a single file or directory.',
    },
    {
        command: 'pnpm bundlesize',
        description:
            'Builds the app with bundle-size tracking enabled and verifies every chunk stays under its configured size limit. CI enforces these limits on every PR.',
    },
    {
        command: 'pnpm exec eslint <file relative path>',
        description: 
            'Run the lint command for specific file.'
    },
    {
        command: 'pnpm exec eslint <file relative path> --fix',
        description: 
            'Fix the lint error for specific file.'
    }
];

export const deployCommands: Command[] = [
    {
        command: 'pnpm build',
        description:
            'Aggregates locale extension files, extracts Page Designer cartridge metadata, and produces the production React Router build in the build/ directory.',
    },
    {
        command: 'pnpm preview',
        description:
            'Serves the production build locally (same artifact "pnpm push" would deploy), useful for a final sanity check before pushing to Managed Runtime.',
    },
    {
        command: 'pnpm push',
        description:
            'App deploy to Managed Runtime. Syncs environment variables ("pnpm mrt:env:sync") then uploads the built bundle via the storefront-next-dev CLI, targeting the project/target configured by MRT_PROJECT and MRT_TARGET.',
    },
    {
        command: 'pnpm mrt:env:sync',
        description:
            'Reads .env and .env.secrets and pushes those values as Managed Runtime environment variables, without doing a full app deploy. Runs automatically as part of "pnpm push".',
    },
    {
        command: 'pnpm mrt:env:diff',
        description:
            'Dry-run of mrt:env:sync — shows what would change on Managed Runtime without actually writing anything. Use this to review env drift before syncing for real.',
    },
    {
        command: 'pnpm config:push-env',
        description:
            'Pushes local .env overrides to Managed Runtime via the B2C CLI (b2c mrt env var push). Pair with "pnpm config:inspect" to see current effective config first.',
    },
    {
        command: 'pnpm cartridge:generate',
        description:
            'Extracts Page Designer component metadata into a deployable SFCC cartridge directory. Required before validating or deploying cartridges, and after any Page Designer component definition change.',
    },
    {
        command: 'pnpm cartridge:validate',
        description:
            'Validates the generated cartridge structure (sfnext validate-cartridge) before deploying it to a B2C sandbox — catches malformed cartridge metadata early.',
    },
    {
        command: 'pnpm cartridge:deploy',
        description:
            'Deploys the generated, validated cartridge to the configured B2C sandbox (sfnext deploy-cartridge). Cartridge-only deploy — does not touch the Managed Runtime app bundle.',
    },
    {
        command: 'pnpm deploy:cartridges',
        description:
            'Deploys every cartridge under cartridges/ (including legacy SG/Ashley cartridges) to the sandbox via the B2C CLI code-deploy command, then reloads them. Broader than cartridge:deploy — covers the whole cartridges/ tree, not just the generated one.',
    },
    {
        command: 'pnpm deploy-dev',
        description:
            'Convenience chain for a full cartridge-side sandbox deploy in one step: cartridge:generate → cartridge:validate → cartridge:deploy → deploy:cartridges. Does not deploy the app bundle to Managed Runtime — use "pnpm push" for that.',
    },
    {
        command: 'pnpm deploy:full',
        description:
            'Cross-platform (Windows/macOS/Linux) equivalent of the deploy-dev chain, implemented in scripts/deploy-full.js so it works under PowerShell/cmd.exe as well as bash/zsh (avoids Unix-only find/sed/basename/paste pipelines).',
    },
    {
        command: 'pnpm deploy:meta',
        description:
            'Imports cartridges/meta_import (custom attribute/object definitions) then cartridges/site_import (site preferences) into a B2C sandbox via "b2c job import". meta_import always runs first since site_import preferences often depend on its definitions.',
    },
    {
        command: 'pnpm deploy-all',
        description:
            'The full sandbox provisioning sequence: pnpm deploy:full (cartridges) followed by pnpm deploy:meta (metadata + site import). Use this for a from-scratch sandbox setup or after pulling changes that touch both cartridges and metadata.',
    },
];

// Sourced from site_import/preferences.xml in each platform's repo ("all-instances" plus any
// <development>/<staging>/<production> overrides). Secrets, API keys, and tokens are intentionally
// excluded. "—" means the preference isn't set for that environment in the repo (Storefront Next has
// no <production> block — Production is changed by hand in Business Manager only).
export const featureFlags: FeatureFlag[] = [
    // Storefront Next (ashley-sfcc-storefront)
    { name: 'experianAddressEnabled', description: '[Storefront Next] Enables Experian address validation.', development: 'true', stage: 'true', production: 'true' },
    { name: 'kount_IsEnabled', description: '[Storefront Next] Enables Kount fraud detection.', development: 'true', stage: 'true', production: 'true' },
    { name: 'ATEnable', description: '[Storefront Next] Enables AfterPay/ATEnable integration.', development: 'true', stage: 'true', production: 'true' },
    { name: 'extendGlobalSwitch', description: '[Storefront Next] Master switch for the Extend warranty integration.', development: 'true', stage: 'true', production: 'true' },
    { name: 'extendPDPSwitch', description: '[Storefront Next] Enables Extend warranty offer on PDP.', development: 'true', stage: 'true', production: 'true' },
    { name: 'RTNFeatureToggle', description: '[Storefront Next] Enables real-time notifications (order.afterPOST → orchestrator dispatch).', development: 'true', stage: 'true', production: 'true' },
    { name: 'allowMattressFeeForAcima', description: '[Storefront Next] Whether mattress recycling fee applies to Acima lease orders.', development: 'false', stage: 'false', production: 'false' },
    { name: 'featureTakeBackEnabled', description: '[Storefront Next] Enables the mattress take-back program.', development: 'true', stage: 'true', production: 'true' },
    { name: 'apgEnablePayPalPostOrderCall', description: '[Storefront Next] Enables APG PayPal post-order call.', development: 'true', stage: 'true', production: 'true' },
    { name: 'enablePayLater', description: '[Storefront Next] Enables PayPal Pay Later financing option.', development: 'true', stage: 'true', production: 'true' },
    { name: 'isTriplePlay', description: '[Storefront Next] Enables Triple Play promotion logic.', development: 'true', stage: 'true', production: 'true' },
    { name: 'asLowAsFinanceEnabled', description: '[Storefront Next] Enables "as low as" financing price messaging.', development: 'true', stage: 'true', production: 'true' },
    { name: 'featureEnableConcoraAccountLookup', description: '[Storefront Next] Enables Concora account lookup feature.', development: 'false', stage: 'false', production: 'false' },
    { name: 'featureEnablePayPalPayInFullSDK', description: '[Storefront Next] Enables PayPal REST v2 SDK checkout path (dev only override; INT-24).', development: 'true', stage: '—', production: '—' },
    { name: 'enableAcimaFinance', description: '[Storefront Next] Master kill-switch for Acima Lease-to-Own (dev/staging only; Production inherits BM).', development: 'true', stage: 'true', production: '— (BM-managed)' },
    { name: 'featureEnableAcimaWebhook', description: '[Storefront Next] Enables the Acima /contract-status webhook flow (dev only; INT-56).', development: 'true', stage: '—', production: '—' },
    { name: 'apgEnableSplitPayments', description: '[Storefront Next] Enables APG multi-authorization split per warehouse × delivery method.', development: 'true', stage: 'true', production: '— (BM-managed)' },
    { name: 'synchrony_v3_Enabled', description: '[Storefront Next] Enables Synchrony v3 financing integration (sandbox creds on dev/staging).', development: 'true', stage: 'true', production: '— (BM-managed)' },
    { name: 'enableSynchronyCVV', description: '[Storefront Next] Requires CVV for Synchrony card payments.', development: 'true', stage: 'true', production: '— (BM-managed)' },
    { name: 'eQuickScreenEnabled', description: '[Storefront Next] Enables Synchrony eQuickScreen/DataShare.', development: 'true', stage: 'true', production: '— (BM-managed)' },
    { name: 'synchronyUnifyEnabled', description: '[Storefront Next] Enables Synchrony Unify (disabled until BM has real sandbox creds; INT-48).', development: 'false', stage: 'false', production: '— (BM-managed)' },

    // Site Genesis (Ashcomm-SFCC-SG-C8)
    { name: 'StorefrontURLsEnabled', description: '[Site Genesis] Enables SEO storefront URLs.', development: 'true', stage: 'true', production: 'true' },
    { name: 'isDevelopment', description: '[Site Genesis] Marks the instance as a development instance (affects jsBase resolution).', development: 'false', stage: 'false', production: 'false' },
    { name: 'PP_AuthorizationInCaseOfOrder', description: '[Site Genesis] PayPal authorization-on-order behavior.', development: 'true', stage: 'true', production: 'true' },
    { name: 'PixleeEnabled', description: '[Site Genesis] Enables Pixlee user-generated-content widgets.', development: 'true', stage: 'true', production: 'true' },
    { name: 'poBoxAddrAllowedForBillingAddr', description: '[Site Genesis] Allows PO Box addresses as billing addresses.', development: 'true', stage: 'true', production: 'true' },
    { name: 'eQuickScreenEnabled', description: '[Site Genesis] Enables Synchrony eQuickScreen/DataShare.', development: 'true', stage: 'true', production: 'true' },
    { name: 'featureEnableOrderEventAPIStatus', description: '[Site Genesis] Enables the Order Event API status-update integration.', development: 'false', stage: 'false', production: 'false' },
    { name: 'apgEnablePayPalPostOrderCall', description: '[Site Genesis] Enables APG PayPal post-order call (dev override only observed).', development: 'true', stage: '—', production: '—' },
    { name: 'ATEnable', description: '[Site Genesis] Enables AfterPay/ATEnable integration (dev override only observed).', development: 'true', stage: '—', production: '—' },
    { name: 'defaultTaxRateEnabled', description: '[Site Genesis] Uses the default tax rate fallback (dev override only observed).', development: 'true', stage: '—', production: '—' },
    { name: 'enableStorePickUp', description: '[Site Genesis] Enables in-store pickup option (dev override only observed).', development: 'false', stage: '—', production: '—' },
    { name: 'ashOHDSEnabled', description: '[Site Genesis] Enables Order Home Delivery Scheduling (dev override only observed).', development: 'true', stage: '—', production: '—' },
    { name: 'multipleWarehouseSelection', description: '[Site Genesis] Enables multiple-warehouse selection logic (dev override only observed).', development: 'true', stage: '—', production: '—' },
    { name: 'turntoCssOverwritesV5', description: '[Site Genesis] Enables TurnTo v5 CSS overrides (dev override only observed).', development: 'true', stage: '—', production: '—' },
    { name: 'turntoUseVariantsV5', description: '[Site Genesis] Enables TurnTo v5 variant support (dev override only observed).', development: 'true', stage: '—', production: '—' },
    { name: 'turntoJSFeedV5', description: '[Site Genesis] Enables TurnTo v5 JS feed (dev override only observed).', development: 'true', stage: '—', production: '—' },
    { name: 'turntoShowCount', description: '[Site Genesis] Shows TurnTo review count badge.', development: '—', stage: 'true', production: 'true' },
    { name: 'kount_IsEnabled', description: '[Site Genesis] Enables Kount fraud detection (dev override only observed).', development: 'true', stage: '—', production: '—' },
    { name: 'kount_ENS', description: '[Site Genesis] Enables Kount Event Notification Service (dev override only observed).', development: 'true', stage: '—', production: '—' },
    { name: 'useMinifiedFiles', description: '[Site Genesis] Serves minified JS/CSS bundles (dev override only observed).', development: 'false', stage: '—', production: '—' },
    { name: 'apgEnableSplitPayments', description: '[Site Genesis] Enables APG multi-authorization split (dev override only observed).', development: 'true', stage: '—', production: '—' },
];

// Sourced from the same preferences.xml files — non-secret configuration values (numeric thresholds,
// fee amounts, counts). API keys, tokens, and credentials are intentionally excluded.
export const customAttributes: CustomAttribute[] = [
    { name: 'ATPCachingTTL', objectType: 'Site Preference', description: '[Storefront Next] ATP cache TTL in seconds (0 = disabled). Staging/Production preserved in BM, not set here.', development: '3600', stage: '— (BM-managed)', production: '— (BM-managed)' },
    { name: 'acimaFinanceMinimumPriceThresholdForPDP', objectType: 'Site Preference', description: '[Storefront Next] Minimum cart price ($) to show the Acima PDP "start" gate (dev only).', development: '300', stage: '—', production: '—' },
    { name: 'curbsideDeliveryFee', objectType: 'Site Preference', description: '[Site Genesis] Curbside delivery fee ($), all-instances.', development: '0', stage: '0', production: '0' },
    { name: 'whiteGloveServiceFee', objectType: 'Site Preference', description: '[Site Genesis] White Glove delivery service fee ($).', development: '—', stage: '99.99', production: '99.99' },
    { name: 'payLater_min_price', objectType: 'Site Preference', description: '[Site Genesis] Minimum order price ($) eligible for Pay Later financing.', development: '—', stage: '30.00', production: '30.00' },
    { name: 'payLater_max_price', objectType: 'Site Preference', description: '[Site Genesis] Maximum order price ($) eligible for Pay Later financing.', development: '—', stage: '1500.00', production: '1500.00' },
    { name: 'minDiscontinuedAvailability', objectType: 'Site Preference', description: '[Site Genesis] Minimum inventory count to keep a discontinued SKU orderable (dev override only observed).', development: '10', stage: '—', production: '—' },
    { name: 'ashOHDSMaxDays', objectType: 'Site Preference', description: '[Site Genesis] Max days out for Order Home Delivery Scheduling (dev override only observed).', development: '30', stage: '—', production: '—' },
    { name: 'ashOHDSMinDays', objectType: 'Site Preference', description: '[Site Genesis] Min days out for Order Home Delivery Scheduling (dev override only observed).', development: '4', stage: '—', production: '—' },
];

// Non-secret Synchrony UniFi config from ashley-sfcc-storefront/.env (dev/UAT values). The real
// OAuth client_id/client_secret live only in Business Manager site preferences
// (synchronyUnifyClientId / synchronyUnifyClientSecret) and are never present in .env or shipped
// to the browser — there is nothing secret to redact here. Safe to show plainly since this whole
// site sits behind PasswordGate.
export const unifiCredentials: UnifiCredential[] = [
    { name: 'SYNCHRONY_UNIFI_ENABLED', value: 'true', description: 'Master toggle for the Synchrony Unify/UniFi integration.' },
    { name: 'SYNCHRONY_UNIFI_MERCHANT_ID', value: '5348121090000702', description: 'SYF merchant ID the Combined Modal transacts against.' },
    { name: 'SYNCHRONY_UNIFI_API_BASE_URL', value: 'https://api-stg.syf.com', description: 'Base URL for server-to-server Synchrony UniFi API calls (OAuth, DPOS token, transact).' },
    { name: 'SYNCHRONY_UNIFI_SDK_NON_PROD_URL', value: 'https://spdpone.syfpos.com/mpp/UniFi.js', description: 'UniFi.js SDK source for non-production (UAT) — used by this demo.' },
    { name: 'SYNCHRONY_UNIFI_SDK_PROD_URL', value: 'https://pdpone.syfpayments.com/mpp/UniFi.js', description: 'UniFi.js SDK source for production.' },
    { name: 'SYNCHRONY_UNIFI_TIMEOUT_SECONDS', value: '30', description: 'Timeout for Synchrony UniFi service calls.' },
    { name: 'SYNCHRONY_UNIFI_PARTNER_ID', value: 'PI20001210', description: 'syfPartnerId sent on the calldBuyProcess payload.' },
    { name: 'SYNCHRONY_UNIFI_MOCK_PROMOTION_ID', value: '0112', description: 'Non-production promo code override for offerNumber1, used when no real promo is configured.' },
];

export const gitSteps: Step[] = [
    {
        title: 'Fetch the latest develop',
        description:
            'Updates your local copy of origin/develop without touching your feature branch, so you can see exactly how far behind you are before doing anything destructive.',
        command: 'git fetch origin develop',
    },
    {
        title: 'Check what you are missing',
        description:
            'Lists commits on develop your branch does not have yet. If this is empty, you are already up to date and can skip the rebase.',
        command: 'git log HEAD..origin/develop --oneline',
    },
    {
        title: 'Protect uncommitted work',
        description:
            'Never rebase with a dirty working tree. Commit your work-in-progress or stash it (including untracked files with -u) so nothing is at risk during the rebase.',
        command: 'git stash push -u -m "pre-rebase checkpoint"',
    },
    {
        title: 'Create a safety-net backup branch',
        description:
            'A local branch pointer to your current commit history, so you can always recover the exact pre-rebase state even after the rebase rewrites your commit hashes.',
        command: 'git branch backup/<your-branch>-pre-rebase',
    },
    {
        title: 'Rebase onto develop',
        description:
            'Replays your commits one at a time on top of the latest develop tip. If no one touched the same lines, this finishes automatically with zero manual conflict resolution.',
        command: 'git rebase origin/develop',
    },
    {
        title: 'Resolve conflicts carefully, if any',
        description:
            'Read both sides of every conflict marker before choosing. If develop already contains a fix, keep it and layer your change on top — do not blindly pick "ours" and silently revert a merged fix.',
        command: 'git add <resolved-file> && git rebase --continue',
    },
    {
        title: 'Restore your stashed work',
        description:
            'Pops the work-in-progress you stashed in step 3 back onto the now-rebased branch.',
        command: 'git stash pop',
    },
    {
        title: 'Verify before pushing',
        description:
            'Confirms your commits are intact post-rebase and that nothing regressed. All three gate PRs in CI.',
        command: 'pnpm typecheck && pnpm lint && pnpm test',
    },
    {
        title: 'Push the rewritten history safely',
        description:
            'Rebasing changes commit hashes, so a plain push is rejected. --force-with-lease aborts if a teammate pushed to the branch since your last fetch, preventing you from overwriting their work — never use plain --force.',
        command: 'git push --force-with-lease origin <your-branch>',
    },
    {
        title: 'Add a changeset',
        description:
            'Every PR needs a changeset describing the change for the release notes. Run this, pick the affected package(s), and commit the generated .changeset/<id>.md file.',
        command: 'pnpm changeset',
    },
];

