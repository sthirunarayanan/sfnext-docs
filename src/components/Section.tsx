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
        <section id={id} className="scroll-mt-20 border-b border-neutral-300 py-10 last:border-b-0 dark:border-neutral-700">
            <h2 className="text-xl font-bold uppercase tracking-wide text-black dark:text-white">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-700 dark:text-neutral-400">{intro}</p>
            <div className="mt-6">{children}</div>
        </section>
    );
}

