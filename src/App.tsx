import { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Section } from './components/Section';
import { CommandList } from './components/CommandList';
import { EnvVarTable } from './components/EnvVarTable';
import { StepList } from './components/StepList';
import { PasswordGate } from './components/PasswordGate';
import { UnifiDemoPage } from './components/UnifiDemoPage';
import { UnifiPasswordModal } from './components/UnifiPasswordModal';
import { EnvironmentValueTable } from './components/EnvironmentValueTable';
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

type Route = 'docs' | 'unifi-demo';

export default function App() {
    return (
        <PasswordGate>
            <AppContent />
        </PasswordGate>
    );
}

function AppContent() {
    const [route, setRoute] = useState<Route>('docs');
    const [unifiModalOpen, setUnifiModalOpen] = useState(false);

    if (route === 'unifi-demo') {
        return <UnifiDemoPage onBack={() => setRoute('docs')} />;
    }

    return (
        <>
        {unifiModalOpen && (
            <UnifiPasswordModal
                onClose={() => setUnifiModalOpen(false)}
                onSuccess={() => {
                    setUnifiModalOpen(false);
                    setRoute('unifi-demo');
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
                    <Sidebar onOpenUnifiDemo={() => setUnifiModalOpen(true)} />
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
                    </main>
                </div>
            </div>
        </div>
        </>
    );
}

