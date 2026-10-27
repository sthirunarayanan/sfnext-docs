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
    { id: 'checkout-flow', label: 'Checkout: Kount, Payment, RTN' },
];

interface SidebarProps {
    /** Opens the password modal gating the separate Unifi Demo page. */
    onOpenUnifiDemo: () => void;
    /** Opens the password modal gating the separate Unifi Combined Modal implementation page. */
    onOpenUnifiCombinedModal: () => void;
}

/** Small padlock glyph indicating the Unifi Demo nav item is password-protected. */
function LockIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5 shrink-0"
            aria-hidden="true"
        >
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
    );
}

/** Sticky left sidebar navigation, scrolling the page to each section's anchor id. */
export function Sidebar({ onOpenUnifiDemo, onOpenUnifiCombinedModal }: SidebarProps) {
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
                <li>
                    <button
                        type="button"
                        onClick={onOpenUnifiDemo}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm text-[#d6cfc3] hover:bg-[#f0802a] hover:text-[#0b0a08]"
                    >
                        <LockIcon />
                        Unifi Demo
                    </button>
                </li>
                <li>
                    <button
                        type="button"
                        onClick={onOpenUnifiCombinedModal}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm text-[#d6cfc3] hover:bg-[#f0802a] hover:text-[#0b0a08]"
                    >
                        <LockIcon />
                        Unifi Documentation
                    </button>
                </li>
            </ul>
        </nav>
    );
}

