import { Logo } from './Logo';

/** Fixed top header with the site logo, title, and a repo link. */
export function Header() {
    return (
        <header className="sticky top-0 z-10 h-16 border-b border-[#2a211a] bg-[#0b0a08]/60 backdrop-blur-sm">
            <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <Logo className="h-8 w-8 shrink-0" />
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-[#f5f1e8]">
                            Storefront Next
                        </p>
                        <p className="text-xs text-[#a89f90]">Developer Quickstart</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/Ashley-Digital/ashley-sfcc-storefront"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-[#f0802a] underline underline-offset-2 hover:text-[#f5f1e8]"
                    >
                        Repository ↗
                    </a>
                </div>
            </div>
        </header>
    );
}

