import { useEffect, useId, useRef, useState } from 'react';
import mermaid from 'mermaid';

let initialized = false;

function ensureInitialized() {
    if (initialized) return;
    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'strict',
        themeVariables: {
            background: '#0b0a08',
            primaryColor: '#14110d',
            primaryTextColor: '#f5f1e8',
            primaryBorderColor: '#f0802a',
            lineColor: '#a89f90',
            secondaryColor: '#1d1712',
            tertiaryColor: '#1d1712',
        },
    });
    initialized = true;
}

interface MermaidProps {
    /** Raw Mermaid diagram definition (e.g. "flowchart TD\n ..."). */
    chart: string;
}

/** Renders a Mermaid diagram definition to inline SVG, client-side only. */
export function Mermaid({ chart }: MermaidProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const rawId = useId().replace(/[:]/g, '');
    const diagramId = `mermaid-${rawId}`;

    useEffect(() => {
        let cancelled = false;
        ensureInitialized();

        mermaid
            .render(diagramId, chart)
            .then(({ svg }) => {
                if (!cancelled && containerRef.current) {
                    containerRef.current.innerHTML = svg;
                }
            })
            .catch((renderError: unknown) => {
                if (!cancelled) {
                    setError(renderError instanceof Error ? renderError.message : String(renderError));
                }
            });

        return () => {
            cancelled = true;
        };
    }, [chart, diagramId]);

    if (error) {
        return (
            <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-4 text-sm text-red-300">
                Failed to render diagram: {error}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-[#2a211a] bg-[#14110d] p-4">
            <div ref={containerRef} className="flex min-w-max justify-center" />
        </div>
    );
}

