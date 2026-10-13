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
            <pre className="overflow-x-auto rounded-lg border border-black bg-black px-4 py-3 text-sm text-white dark:border-white">
                <code>{code}</code>
            </pre>
            <button
                type="button"
                onClick={handleCopy}
                className="absolute right-2 top-2 rounded-md border border-white/40 bg-white/10 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white hover:text-black"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
}

