import type { EnvVar } from '../data/content';

interface EnvVarTableProps {
    vars: EnvVar[];
}

/** A table of .env variables, each with its full purpose explained — no shorthand, no assumed context. */
export function EnvVarTable({ vars }: EnvVarTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-black dark:border-white">
            <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-black dark:bg-white">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-white dark:text-black">Variable</th>
                        <th className="px-4 py-3 font-semibold text-white dark:text-black">Required</th>
                        <th className="px-4 py-3 font-semibold text-white dark:text-black">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-300 dark:divide-neutral-700">
                    {vars.map((item) => (
                        <tr key={item.name} className="align-top">
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-black dark:text-white">
                                {item.name}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={
                                        item.required
                                            ? 'rounded-full border border-black bg-black px-2 py-0.5 text-xs font-medium text-white dark:border-white dark:bg-white dark:text-black'
                                            : 'rounded-full border border-black px-2 py-0.5 text-xs font-medium text-black dark:border-white dark:text-white'
                                    }
                                >
                                    {item.required ? 'Required' : 'Optional'}
                                </span>
                            </td>
                            <td className="px-4 py-3 leading-relaxed text-neutral-700 dark:text-neutral-400">
                                {item.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

