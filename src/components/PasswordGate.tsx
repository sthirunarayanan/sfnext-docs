import { useState, type FormEvent, type ReactNode } from 'react';
import { sha256Hex } from '../lib/sha256';

const SESSION_KEY = 'sfnext-docs-unlocked';
const configuredHash = import.meta.env.VITE_DOCS_PASSWORD_HASH as string | undefined;

interface PasswordGateProps {
    children: ReactNode;
}

/**
 * Blocks rendering of `children` until the shopper enters a password whose SHA-256 hash matches
 * VITE_DOCS_PASSWORD_HASH (baked in at build time — see scripts/hash-password.mjs and README.md).
 *
 * This is a deterrent for an internal docs site, not a security boundary: the hash ships in the
 * client bundle, so anyone can brute-force it offline. For a real production boundary, also enable
 * password/basic-auth protection at the hosting layer (see README.md "Production access control").
 */
export function PasswordGate({ children }: PasswordGateProps) {
    const [unlocked, setUnlocked] = useState(() => sessionStorage.getItem(SESSION_KEY) === 'true');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);

    // No password configured — fail open in local dev only (e.g. hash-password.mjs not run yet),
    // but never in a production build.
    if (!configuredHash) {
        if (import.meta.env.PROD) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-center">
                    <p className="max-w-sm text-sm text-slate-600">
                        This site is misconfigured: VITE_DOCS_PASSWORD_HASH was not set at build time.
                        See README.md "Production access control".
                    </p>
                </div>
            );
        }
        return <>{children}</>;
    }

    if (unlocked) return <>{children}</>;

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setChecking(true);
        setError(null);

        const hash = await sha256Hex(password);

        if (hash === configuredHash) {
            sessionStorage.setItem(SESSION_KEY, 'true');
            setUnlocked(true);
        } else {
            setError('Incorrect password.');
        }
        setChecking(false);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
            <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-lg font-bold text-slate-900">Storefront Next Docs</h1>
                <p className="mt-1 text-sm text-slate-500">Enter the access password to continue.</p>
                <input
                    type="password"
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                <button
                    type="submit"
                    disabled={checking || password.length === 0}
                    className="mt-4 w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {checking ? 'Checking…' : 'Unlock'}
                </button>
            </form>
        </div>
    );
}

