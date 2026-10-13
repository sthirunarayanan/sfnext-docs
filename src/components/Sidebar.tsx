interface NavItem {
    id: string;
    label: string;
}

const NAV_ITEMS: NavItem[] = [
    { id: 'prerequisites', label: 'Prerequisites' },
    { id: 'env', label: '.env Setup' },
    { id: 'run', label: 'Run Locally' },
    { id: 'quality', label: 'Quality Checks' },
    { id: 'deploy', label: 'Local Build & Deploy' },
    { id: 'git', label: 'Git Workflow' },
];

/** Sticky left sidebar navigation, scrolling the page to each section's anchor id. */
export function Sidebar() {
    return (
        <nav className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto border-r-2 border-black px-4 py-8 dark:border-white lg:block">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                On this page
            </p>
            <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            className="block rounded-md px-3 py-1.5 text-sm text-neutral-700 hover:bg-black hover:text-white dark:text-neutral-300 dark:hover:bg-white dark:hover:text-black"
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

