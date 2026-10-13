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
        command: 'pnpm cartridge:generate',
        description:
            'Extracts Page Designer component metadata into a deployable SFCC cartridge. Needed whenever Page Designer component definitions changed, before a cartridge deploy.',
    },
    {
        command: 'pnpm push',
        description:
            'Syncs environment variables to Managed Runtime (via "pnpm mrt:env:sync") and uploads the built bundle using the storefront-next-dev CLI, targeting the project/target configured by MRT_PROJECT and MRT_TARGET.',
    },
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

