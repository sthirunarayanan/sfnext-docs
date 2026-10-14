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
                <li
                    key={step.title}
                    className="flex gap-4 rounded-xl border border-[#2a211a] bg-[#14110d] p-4"
                >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#f0802a] bg-[#f0802a] text-sm font-semibold text-[#0b0a08]">
                        {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-[#f5f1e8]">{step.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-[#a89f90]">
                            {step.description}
                        </p>
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

