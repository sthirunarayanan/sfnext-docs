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
            <pre className="overflow-x-auto rounded-lg border border-[#f0802a]/30 bg-[#14110d] px-4 py-3 text-sm text-[#f5f1e8]">
                <code>{code}</code>
            </pre>
            <button
                type="button"
                onClick={handleCopy}
                className="absolute right-2 top-2 rounded-md border border-[#f0802a]/40 bg-[#f0802a]/10 px-2 py-1 text-xs font-medium text-[#f0802a] opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[#f0802a] hover:text-[#0b0a08]"
            >
                {copied ? 'Copied!' : 'Copy'}
            </button>
        </div>
    );
}

