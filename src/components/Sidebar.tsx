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
        <nav className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto border-r border-slate-200 px-4 py-8 lg:block">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">On this page</p>
            <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            className="block rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700"
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

