import { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Section } from './components/Section';
import { CommandList } from './components/CommandList';
import { EnvVarTable } from './components/EnvVarTable';
import { StepList } from './components/StepList';
import { PasswordGate } from './components/PasswordGate';
import { UnifiDemoPage } from './components/UnifiDemoPage';
import { UnifiCombinedModalPage } from './components/UnifiCombinedModalPage';
import { UnifiPasswordModal } from './components/UnifiPasswordModal';
import { EnvironmentValueTable } from './components/EnvironmentValueTable';
import { Mermaid } from './components/Mermaid';
import {
    prerequisites,
    envVars,
    runCommands,
    qualityCommands,
    deployCommands,
    gitSteps,
    featureFlags,
    customAttributes,
} from './data/content';
import { checkoutFlowIntro, checkoutFlowKey, checkoutFlowRule, checkoutFlowChart } from './data/checkoutFlow';
import {
    rootCauseSummary,
    rootCauseExplanation,
    rootCauseParity,
    rootCauseFixOptions,
    rootCauseChart,
} from './data/checkoutFlowRootCause';

type Route = 'docs' | 'unifi-demo' | 'unifi-combined-modal';

// Browser URL suffix appended/removed when navigating into/out of the Unifi Documentation page.
const UNIFI_DOCS_PATH = '/unifi-docs';

function withUnifiDocsPath(): string {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    return `${base}${UNIFI_DOCS_PATH}${window.location.search}${window.location.hash}`;
}

function withoutUnifiDocsPath(): string {
    const base = import.meta.env.BASE_URL || '/';
    return `${base}${window.location.search}${window.location.hash}`;
}

export default function App() {
    return (
        <PasswordGate>
            <AppContent />
        </PasswordGate>
    );
}

function AppContent() {
    const [route, setRoute] = useState<Route>(() =>
        window.location.pathname.endsWith(UNIFI_DOCS_PATH) ? 'unifi-combined-modal' : 'docs'
    );
    // Which gated route the open password modal should unlock into, if any.
    const [pendingUnifiRoute, setPendingUnifiRoute] = useState<Extract<Route, 'unifi-demo'> | null>(null);

    // Keep the browser URL in sync with the Unifi Documentation route, and support
    // back/forward navigation (e.g. browser Back button) between it and the docs page.
    useEffect(() => {
        if (route === 'unifi-combined-modal') {
            if (!window.location.pathname.endsWith(UNIFI_DOCS_PATH)) {
                window.history.pushState({ route }, '', withUnifiDocsPath());
            }
        } else if (window.location.pathname.endsWith(UNIFI_DOCS_PATH)) {
            window.history.pushState({ route }, '', withoutUnifiDocsPath());
        }
    }, [route]);

    useEffect(() => {
        function handlePopState() {
            setRoute(window.location.pathname.endsWith(UNIFI_DOCS_PATH) ? 'unifi-combined-modal' : 'docs');
        }
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    if (route === 'unifi-demo') {
        return <UnifiDemoPage onBack={() => setRoute('docs')} />;
    }

    if (route === 'unifi-combined-modal') {
        return <UnifiCombinedModalPage onBack={() => setRoute('docs')} />;
    }

    return (
        <>
        {pendingUnifiRoute === 'unifi-demo' && (
            <UnifiPasswordModal
                onClose={() => setPendingUnifiRoute(null)}
                onSuccess={() => {
                    setRoute('unifi-demo');
                    setPendingUnifiRoute(null);
                }}
            />
        )}
        <div className="min-h-screen bg-[#0b0a08] text-[#f5f1e8]">
            <div className="fixed inset-0 z-0 flex justify-center overflow-hidden">
                <div
                    aria-hidden="true"
                    className="h-[95%] w-[80%] max-w-6xl bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url('${import.meta.env.BASE_URL}assets/ad-background.png')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0b0a08]/40 via-[#0b0a08]/70 to-[#0b0a08]" />
            </div>
            <div className="relative z-10 mx-auto max-w-6xl">
                <Header />
                <div className="flex">
                    <Sidebar
                        onOpenUnifiDemo={() => setPendingUnifiRoute('unifi-demo')}
                        onOpenUnifiCombinedModal={() => setRoute('unifi-combined-modal')}
                    />
                    <main className="min-w-0 flex-1 px-6 py-8">
                    <Section
                        id="prerequisites"
                        title="1. Prerequisites"
                        intro="Everything you need installed and verified before the app will run — each command explains exactly why it's needed."
                    >
                        <CommandList commands={prerequisites} />
                    </Section>

                    <Section
                        id="env"
                        title="2. .env Setup"
                        intro="Copy the required-only defaults file, then review what each variable controls. .env.default intentionally lists only variables the app cannot start without — optional feature flags live in config.server.ts instead."
                    >
                        <CommandList commands={[{ command: 'cp .env.default .env', description: 'Creates your local .env from the committed template, pre-filled with the public demo SCAPI backend so the app boots out-of-the-box.' }]} />
                        <div className="mt-6">
                            <EnvVarTable vars={envVars} />
                        </div>
                    </Section>

                    <Section
                        id="run"
                        title="3. Run Locally"
                        intro="Start the app, step through server code, or work on UI components in isolation."
                    >
                        <CommandList commands={runCommands} />
                    </Section>

                    <Section
                        id="quality"
                        title="4. Quality Checks"
                        intro="Run these before opening any PR — they mirror exactly what CI enforces, so failures here mean failures there."
                    >
                        <CommandList commands={qualityCommands} />
                    </Section>

                    <Section
                        id="deploy"
                        title="5. Local Build & Deploy"
                        intro="Every deployment-related command available in package.json — app bundle deploy to Managed Runtime, environment variable sync, and the full cartridge/metadata sandbox deploy chain."
                    >
                        <CommandList commands={deployCommands} />
                    </Section>

                    <Section
                        id="git"
                        title="6. Git Workflow — Keeping Your Branch Up To Date"
                        intro="The full sequence to rebase a feature branch onto the latest develop and push it safely, without losing any of your own changes or silently undoing a teammate's already-merged fix."
                    >
                        <StepList steps={gitSteps} />
                    </Section>

                    <Section
                        id="flags"
                        title="7. Feature Flags & Custom Attributes"
                        intro="Current values across Development, Stage, and Production. Keep this in sync whenever a flag or attribute default changes in any environment."
                    >
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                            Feature Flags
                        </h3>
                        <div className="mt-4">
                            <EnvironmentValueTable
                                items={featureFlags}
                                renderLabel={(item) => item.name}
                                renderDescription={(item) => item.description}
                                emptyMessage="No feature flags documented yet."
                            />
                        </div>

                        <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                            Custom Attributes
                        </h3>
                        <div className="mt-4">
                            <EnvironmentValueTable
                                items={customAttributes}
                                renderLabel={(item) => (
                                    <>
                                        {item.name}
                                        <span className="ml-2 font-sans text-[10px] font-normal uppercase text-[#a89f90]">
                                            {item.objectType}
                                        </span>
                                    </>
                                )}
                                renderDescription={(item) => item.description}
                                emptyMessage="No custom attributes documented yet."
                            />
                        </div>
                    </Section>

                    <Section
                        id="checkout-flow"
                        title="8. Checkout Flow: Kount, Payment Gateway & RTN"
                        intro={checkoutFlowIntro}
                    >
                        <ul className="mb-4 flex flex-wrap gap-4 text-sm text-[#d6cfc3]">
                            {checkoutFlowKey.map((item) => (
                                <li key={item.label}>
                                    <span className="font-semibold">{item.label}</span> — {item.description}
                                </li>
                            ))}
                        </ul>
                        <p className="mb-4 rounded-lg border border-[#f0802a]/30 bg-[#14110d] p-4 text-sm leading-relaxed text-[#a89f90]">
                            {checkoutFlowRule}
                        </p>
                        <Mermaid chart={checkoutFlowChart} />

                        <h3 className="mt-10 text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                            Root Cause: Orders Recorded in Kount but Missing from SFCC Business Manager
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-[#a89f90]">{rootCauseSummary}</p>
                        <div className="mt-6">
                            <Mermaid chart={rootCauseChart} />
                        </div>
                        <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-[#a89f90]">
                            {rootCauseExplanation}
                        </p>
                        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#a89f90]">
                            {rootCauseParity}
                        </p>
                        <h4 className="mt-6 text-sm font-semibold uppercase tracking-wide text-[#f0802a]">
                            Fix Options
                        </h4>
                        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#a89f90]">
                            {rootCauseFixOptions.map((option) => (
                                <li key={option}>{option}</li>
                            ))}
                        </ol>
                    </Section>
                    </main>
                </div>
            </div>
        </div>
        </>
    );
}

