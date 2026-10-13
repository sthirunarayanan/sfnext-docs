/** Fixed top header with the site title and a short one-line summary of what the site is for. */
export function Header() {
    return (
        <header className="sticky top-0 z-10 h-16 border-b border-slate-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
                <div>
                    <p className="text-sm font-bold text-slate-900">Storefront Next</p>
                    <p className="text-xs text-slate-500">Developer Quickstart</p>
                </div>
                <a
                    href="https://github.com/Ashley-Digital/ashley-sfcc-storefront"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-blue-600 hover:underline"
                >
                    Repository ↗
                </a>
            </div>
        </header>
    );
}

