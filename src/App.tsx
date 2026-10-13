import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Section } from './components/Section';
import { CommandList } from './components/CommandList';
import { EnvVarTable } from './components/EnvVarTable';
import { StepList } from './components/StepList';
import { PasswordGate } from './components/PasswordGate';
import { prerequisites, envVars, runCommands, qualityCommands, deployCommands, gitSteps } from './data/content';

export default function App() {
    return (
        <PasswordGate>
            <AppContent />
        </PasswordGate>
    );
}

function AppContent() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Header />
            <div className="mx-auto flex max-w-6xl">
                <Sidebar />
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
                        intro="Produce a production build, sanity-check it locally, then ship it to Commerce Cloud Managed Runtime."
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
                </main>
            </div>
        </div>
    );
}

