import type { ReactNode } from 'react';

interface SectionProps {
    id: string;
    title: string;
    intro: string;
    children: ReactNode;
}

/** A top-level page section: anchor id (for nav), heading, intro paragraph, then arbitrary content. */
export function Section({ id, title, intro, children }: SectionProps) {
    return (
        <section id={id} className="scroll-mt-20 border-b border-slate-100 py-10 last:border-b-0">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{intro}</p>
            <div className="mt-6">{children}</div>
        </section>
    );
}

