import type { UnifiCredential } from '../data/content';

interface UnifiCredentialTableProps {
    items: UnifiCredential[];
}

/** Read-only table of the non-secret Synchrony UniFi config values from ashley-sfcc-storefront/.env. */
export function UnifiCredentialTable({ items }: UnifiCredentialTableProps) {
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
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#f0802a]">
                                {item.value}
                            </td>
                            <td className="px-4 py-3 leading-relaxed text-[#a89f90]">{item.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

