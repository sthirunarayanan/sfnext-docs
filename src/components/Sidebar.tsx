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
    { id: 'flags', label: 'Feature Flags & Attributes' },
    { id: 'unifi-demo', label: 'Unifi Demo' },
];

/** Sticky left sidebar navigation, scrolling the page to each section's anchor id. */
export function Sidebar() {
    return (
        <nav className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto border-r border-[#2a211a] bg-[#0b0a08]/50 px-4 py-8 backdrop-blur-sm lg:block">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#a89f90]">
                On this page
            </p>
            <ul className="space-y-1">
                {NAV_ITEMS.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            className="block rounded-md px-3 py-1.5 text-sm text-[#d6cfc3] hover:bg-[#f0802a] hover:text-[#0b0a08]"
                        >
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

