import { useState } from 'react';

interface CodeBlockProps {
    code: string;
}

/** A single-line (or multi-line) shell command with a copy-to-clipboard button. */
export function CodeBlock({ code }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Clipboard API unavailable (e.g. insecure context) — fail silently, code is still visible.
        }
    }

    return (
        <div className="group relative">
            <pre className="overflow-x-auto rounded-lg bg-slate-900 px-4 py-3 text-sm text-slate-100">
                <code>{code}</code>
            </pre>
            <button
                type="button"
                onClick={handleCopy}
                className="absolute right-2 top-2 rounded-md bg-slate-700/70 px-2 py-1 text-xs font-medium text-slate-100 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-slate-600"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
}

