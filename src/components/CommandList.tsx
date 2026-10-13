import type { Command } from '../data/content';
import { CodeBlock } from './CodeBlock';

interface CommandListProps {
    commands: Command[];
}

/** A vertical list of commands, each paired with a full description of what it does and when to use it. */
export function CommandList({ commands }: CommandListProps) {
    return (
        <div className="space-y-5">
            {commands.map((item) => (
                <div key={item.command} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <CodeBlock code={item.command} />
                    <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>
            ))}
        </div>
    );
}

