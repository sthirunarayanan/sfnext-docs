import type { EnvVar } from '../data/content';

interface EnvVarTableProps {
    vars: EnvVar[];
}

/** A table of .env variables, each with its full purpose explained — no shorthand, no assumed context. */
export function EnvVarTable({ vars }: EnvVarTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-[#2a211a]">
            <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-[#f0802a]">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-[#0b0a08]">Variable</th>
                        <th className="px-4 py-3 font-semibold text-[#0b0a08]">Required</th>
                        <th className="px-4 py-3 font-semibold text-[#0b0a08]">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#2a211a] bg-[#14110d]">
                    {vars.map((item) => (
                        <tr key={item.name} className="align-top">
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-[#f5f1e8]">
                                {item.name}
                            </td>
                            <td className="px-4 py-3">
                                <span
                                    className={
                                        item.required
                                            ? 'rounded-full border border-[#f0802a] bg-[#f0802a] px-2 py-0.5 text-xs font-medium text-[#0b0a08]'
                                            : 'rounded-full border border-[#a89f90] px-2 py-0.5 text-xs font-medium text-[#a89f90]'
                                    }
                                >
                                    {item.required ? 'Required' : 'Optional'}
                                </span>
                            </td>
                            <td className="px-4 py-3 leading-relaxed text-[#a89f90]">
                                {item.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

