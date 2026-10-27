import { UnifiDocsPasswordGate } from './UnifiDocsPasswordGate';
import { Mermaid } from './Mermaid';
import {
    unifiCombinedModalIntro,
    unifiCombinedModalChart,
    unifiTestPersonalInfo,
    unifiTestAddress,
    unifiTestCard,
    unifiWertIntro,
    unifiWertChart,
    type UnifiTestField,
} from '../data/unifiCombinedModalImpl';

interface UnifiCombinedModalPageProps {
    onBack: () => void;
}

function FieldTable({ items }: { items: UnifiTestField[] }) {
    return (
        <table className="w-full border-collapse text-sm">
            <tbody>
                {items.map((item) => (
                    <tr key={item.field} className="border-b border-[#2a211a] last:border-0">
                        <td className="py-2 pr-4 font-medium text-[#d6cfc3]">{item.field}</td>
                        <td className="py-2 font-mono text-[#f0802a]">{item.value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

/**
 * Standalone page (not part of the main docs scroll) reached only via the sidebar
 * "Unifi Documentation" button, at URL path /unifi-docs. Gated behind its own separate
 * password — see UnifiDocsPasswordGate — independent of both the Unifi Demo page's
 * password and the site-wide PasswordGate.
 */
export function UnifiCombinedModalPage({ onBack }: UnifiCombinedModalPageProps) {
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
                    Unifi Combined Modal — Implementation
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#a89f90]">
                    {unifiCombinedModalIntro}
                </p>

                <div className="mt-6">
                    <UnifiDocsPasswordGate>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                            Implementation Flow
                        </h3>
                        <div className="mt-4">
                            <Mermaid chart={unifiCombinedModalChart} />
                        </div>

                        <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                            Test Data — Personal Info
                        </h3>
                        <p className="mt-2 text-xs text-[#a89f90]">
                            Sandbox/UAT values for exercising the Combined Modal form. Not real shopper data.
                        </p>
                        <div className="mt-4 rounded-xl border border-[#2a211a] bg-[#14110d] p-4">
                            <FieldTable items={unifiTestPersonalInfo} />
                        </div>

                        <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                            Test Data — Address
                        </h3>
                        <div className="mt-4 rounded-xl border border-[#2a211a] bg-[#14110d] p-4">
                            <FieldTable items={unifiTestAddress} />
                        </div>

                        <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                            Test Data — Card
                        </h3>
                        <p className="mt-2 text-xs text-[#a89f90]">
                            Synchrony UAT test card number and CVV — only valid in non-production environments.
                        </p>
                        <div className="mt-4 rounded-xl border border-[#2a211a] bg-[#14110d] p-4">
                            <FieldTable items={unifiTestCard} />
                        </div>

                        <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                            Integrating WERT Events with Optimizely Flags
                        </h3>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#a89f90]">
                            {unifiWertIntro}
                        </p>
                        <div className="mt-4">
                            <Mermaid chart={unifiWertChart} />
                        </div>
                    </UnifiDocsPasswordGate>
                </div>
            </div>
        </div>
    );
}

