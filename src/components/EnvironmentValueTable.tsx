import type { EnvironmentValues } from '../data/content';

interface EnvironmentValueTableProps<T extends EnvironmentValues> {
    items: T[];
    /** Renders the leading identity column(s) for a row (e.g. name, or name + object type). */
    renderLabel: (item: T) => React.ReactNode;
    /** Renders the description column for a row. */
    renderDescription: (item: T) => React.ReactNode;
    emptyMessage: string;
}

/**
 * A table showing a flag/attribute's current value across Development, Stage, and Production.
 * Shared by the Feature Flags and Custom Attributes sections.
 */
export function EnvironmentValueTable<T extends EnvironmentValues>({
    items,
    renderLabel,
    renderDescription,
    emptyMessage,
}: EnvironmentValueTableProps<T>) {
    if (items.length === 0) {
        return (
            <p className="rounded-xl border border-dashed border-[#3a2e22] px-4 py-6 text-sm text-[#a89f90]">
                {emptyMessage}
            </p>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-[#2a211a]">
            <table className="w-full border-collapse text-left text-sm">
                <thead className="bg-[#f0802a]">
                    <tr>
                        <th className="px-4 py-3 font-semibold text-[#0b0a08]">Name</th>
                        <th className="px-4 py-3 font-semibold text-[#0b0a08]">Description</th>
                        <th className="px-4 py-3 font-semibold text-[#0b0a08]">Development</th>
                        <th className="px-4 py-3 font-semibold text-[#0b0a08]">Stage</th>
                        <th className="px-4 py-3 font-semibold text-[#0b0a08]">Production</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#2a211a] bg-[#14110d]">
                    {items.map((item, index) => (
                        <tr key={index} className="align-top">
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-[#f5f1e8]">
                                {renderLabel(item)}
                            </td>
                            <td className="px-4 py-3 leading-relaxed text-[#a89f90]">
                                {renderDescription(item)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#d6cfc3]">
                                {item.development}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#d6cfc3]">
                                {item.stage}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-[#d6cfc3]">
                                {item.production}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

