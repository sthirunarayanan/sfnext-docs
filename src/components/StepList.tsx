import type { Step } from '../data/content';
import { CodeBlock } from './CodeBlock';

interface StepListProps {
    steps: Step[];
}

/** A numbered sequence of steps, each with a rationale and (optionally) the exact command to run. */
export function StepList({ steps }: StepListProps) {
    return (
        <ol className="space-y-5">
            {steps.map((step, index) => (
                <li key={step.title} className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                        {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-slate-800">{step.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>
                        {step.command && (
                            <div className="mt-3">
                                <CodeBlock code={step.command} />
                            </div>
                        )}
                    </div>
                </li>
            ))}
        </ol>
    );
}

