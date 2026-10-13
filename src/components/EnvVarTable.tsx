import type { EnvVar } from '../data/content';

interface EnvVarTableProps {
    vars: EnvVar[];
}

/** A table of .env variables, each with its full purpose explained — no shorthand, no assumed context. */
export function EnvVarTable({ vars }: EnvVarTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-slate-700">Variable</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Required</th>
                        <th className="px-4 py-3 font-semibold text-slate-700">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {vars.map((item) => (
                        <tr key={item.name} className="align-top">
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-blue-700">
                                {item.name}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={
                                        item.required
                                            ? 'rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700'
                                            : 'rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600'
                                    }
                                >
                                    {item.required ? 'Required' : 'Optional'}
                                </span>
                            </td>
                            <td className="px-4 py-3 leading-relaxed text-slate-600">{item.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

