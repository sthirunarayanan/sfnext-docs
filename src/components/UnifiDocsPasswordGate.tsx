import { useState, type FormEvent, type ReactNode } from 'react';
import { isUnifiDocsPasswordConfigured, isUnifiDocsUnlocked, tryUnlockUnifiDocs } from '../lib/unifiDocsAuth';

interface UnifiDocsPasswordGateProps {
    children: ReactNode;
}

/**
 * Fallback/safety-net gate rendered inside UnifiCombinedModalPage. Normally the password is
 * already entered via UnifiDocsPasswordModal before this page is ever shown (see Sidebar.tsx +
 * App.tsx), so this renders `children` immediately in that case. It exists so the page still
 * fails closed if reached any other way (e.g. a direct link to /unifi-docs) while the session
 * is locked. Uses its own separate password, independent of the Unifi Demo page's gate.
 */
export function UnifiDocsPasswordGate({ children }: UnifiDocsPasswordGateProps) {
    const [unlocked, setUnlocked] = useState(() => isUnifiDocsUnlocked());
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);

    // No password configured for this section — fail closed in production, open in local dev.
    if (!isUnifiDocsPasswordConfigured()) {
        if (import.meta.env.PROD) {
            return (
                <p className="text-sm text-[#a89f90]">
                    This section is misconfigured: VITE_UNIFI_DOCS_PASSWORD_HASH was not set at build time.
                </p>
            );
        }
        return <>{children}</>;
    }

    if (unlocked) return <>{children}</>;

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setChecking(true);
        setError(null);

        if (await tryUnlockUnifiDocs(password)) {
            setUnlocked(true);
        } else {
            setError('Incorrect password.');
        }
        setChecking(false);
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-sm rounded-xl border border-[#f0802a]/40 bg-[#14110d] p-6"
        >
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                Restricted Section
            </h3>
            <p className="mt-1 text-sm text-[#a89f90]">
                Enter the separate Unifi Documentation password to continue.
            </p>
            <input
                type="password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="mt-4 w-full rounded-md border border-[#3a2e22] bg-[#0b0a08] px-3 py-2 text-sm text-[#f5f1e8] outline-none focus:ring-2 focus:ring-[#f0802a]"
            />
            {error && <p className="mt-2 text-sm font-medium text-[#f0802a]">{error}</p>}
            <button
                type="submit"
                disabled={checking || password.length === 0}
                className="mt-4 w-full rounded-md border border-[#f0802a] bg-[#f0802a] px-3 py-2 text-sm font-semibold text-[#0b0a08] hover:bg-[#c96a1f] disabled:opacity-50"
            >
                {checking ? 'Checking…' : 'Unlock'}
            </button>
        </form>
    );
}

