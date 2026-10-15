import { useState, type FormEvent } from 'react';
import { isUnifiPasswordConfigured, tryUnlockUnifi } from '../lib/unifiAuth';

interface UnifiPasswordModalProps {
    onClose: () => void;
    /** Called once the correct password has been entered — caller should navigate to the demo. */
    onSuccess: () => void;
}

/**
 * Modal opened by the sidebar "Unifi Demo" button. Only on a correct password submission does it
 * call `onSuccess`, which App.tsx uses to redirect into UnifiDemoPage. Dismissible via the
 * backdrop, Escape-less close button, or Cancel — none of which unlock anything.
 */
export function UnifiPasswordModal({ onClose, onSuccess }: UnifiPasswordModalProps) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [checking, setChecking] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();

        // No password configured — fail open in local dev only, matching UnifiPasswordGate.
        if (!isUnifiPasswordConfigured()) {
            if (!import.meta.env.PROD) {
                onSuccess();
                return;
            }
            setError('This section is misconfigured: VITE_UNIFI_DEMO_PASSWORD_HASH was not set at build time.');
            return;
        }

        setChecking(true);
        setError(null);

        if (await tryUnlockUnifi(password)) {
            onSuccess();
        } else {
            setError('Incorrect password.');
        }
        setChecking(false);
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
            onClick={onClose}
        >
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm rounded-xl border border-[#f0802a]/40 bg-[#14110d] p-6"
            >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                    Unifi Demo — Restricted
                </h3>
                <p className="mt-1 text-sm text-[#a89f90]">
                    Enter the separate Unifi Demo password to continue.
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
                <div className="mt-4 flex gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-md border border-[#2a211a] px-3 py-2 text-sm text-[#d6cfc3] hover:bg-[#2a211a]"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={checking || password.length === 0}
                        className="w-full rounded-md border border-[#f0802a] bg-[#f0802a] px-3 py-2 text-sm font-semibold text-[#0b0a08] hover:bg-[#c96a1f] disabled:opacity-50"
                    >
                        {checking ? 'Checking…' : 'Unlock'}
                    </button>
                </div>
            </form>
        </div>
    );
}

