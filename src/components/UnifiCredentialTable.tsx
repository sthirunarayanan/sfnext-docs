import type { UnifiCredential } from '../data/content';

interface UnifiCredentialTableProps {
    items: UnifiCredential[];
    onChange?: (name: string, value: string) => void;
}

/**
 * Table of the non-secret Synchrony UniFi config values from ashley-sfcc-storefront/.env.
 * When `onChange` is supplied, the Value column becomes editable so the Merchant ID and other
 * values can be swapped before running the demo below — the edits only live in this page's
 * session state, they never write back to the .env file.
 */
export function UnifiCredentialTable({ items, onChange }: UnifiCredentialTableProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-[#2a211a]">
            <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-[#f0802a]">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-[#0b0a08]">Variable</th>
                        <th className="px-4 py-3 font-semibold text-[#0b0a08]">Value</th>
                        <th className="px-4 py-3 font-semibold text-[#0b0a08]">Description</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#2a211a] bg-[#14110d]">
                    {items.map((item) => (
                        <tr key={item.name} className="align-top">
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-[#f5f1e8]">
                                {item.name}
                            </td>
                            <td className="px-4 py-3 font-mono text-xs text-[#f0802a]">
                                {onChange ? (
                                    <input
                                        type="text"
                                        value={item.value}
                                        onChange={(e) => onChange(item.name, e.target.value)}
                                        spellCheck={false}
                                        className="w-full min-w-[12rem] rounded-md border border-[#2a211a] bg-[#0b0a08] px-2 py-1 font-mono text-xs text-[#f0802a] focus:border-[#f0802a] focus:outline-none"
                                    />
                                ) : (
                                    item.value
                                )}
                            </td>
                            <td className="px-4 py-3 leading-relaxed text-[#a89f90]">{item.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

