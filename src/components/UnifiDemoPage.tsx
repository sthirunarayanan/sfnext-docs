import { UnifiPasswordGate } from './UnifiPasswordGate';
import { UnifiCredentialTable } from './UnifiCredentialTable';
import { UnifiDemo } from './UnifiDemo';
import { unifiCredentials } from '../data/content';

interface UnifiDemoPageProps {
    onBack: () => void;
}

/**
 * Standalone page (not part of the main docs scroll, not linked from "On this page") reached only
 * via the sidebar "Unifi Demo" button. Gated behind its own separate password — see
 * UnifiPasswordGate — independent of the site-wide PasswordGate that already wraps the whole app.
 */
export function UnifiDemoPage({ onBack }: UnifiDemoPageProps) {
    return (
        <div className="min-h-screen bg-[#0b0a08] text-[#f5f1e8]">
            <div className="mx-auto max-w-6xl px-6 py-8">
                <button
                    type="button"
                    onClick={onBack}
                    className="mb-6 rounded-md border border-[#2a211a] px-3 py-1.5 text-sm text-[#d6cfc3] hover:bg-[#f0802a] hover:text-[#0b0a08]"
                >
                    ← Back to Docs
                </button>

                <h1 className="flex items-center gap-2 text-xl font-bold uppercase tracking-wide text-[#f0802a]">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5 shrink-0"
                        aria-hidden="true"
                    >
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                    Unifi Demo
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#a89f90]">
                    Loads the real Synchrony UniFi Combined Modal SDK and opens it with a
                    shopper-supplied calldBuyProcess request. Credentials below are the non-secret
                    values from ashley-sfcc-storefront/.env — the OAuth client secret is Business
                    Manager-only and never appears here.
                </p>

                <div className="mt-6">
                    <UnifiPasswordGate>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                            Synchrony Unifi Config
                        </h3>
                        <div className="mt-4">
                            <UnifiCredentialTable items={unifiCredentials} />
                        </div>

                        <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                            Run Demo
                        </h3>
                        <div className="mt-4">
                            <UnifiDemo />
                        </div>
                    </UnifiPasswordGate>
                </div>
            </div>
        </div>
    );
}

