import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../lib/use-theme';

interface HeaderProps {
    theme: Theme;
    onToggleTheme: () => void;
}

/** Fixed top header with the site logo, title, theme toggle, and a repo link. */
export function Header({ theme, onToggleTheme }: HeaderProps) {
    return (
        <header className="sticky top-0 z-10 h-16 border-b-2 border-black bg-white/95 backdrop-blur dark:border-white dark:bg-black/95">
            <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <Logo className="h-8 w-8 shrink-0" />
                    <div>
                        <p className="text-sm font-bold uppercase tracking-wide text-black dark:text-white">
                            Storefront Next
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">Developer Quickstart</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="https://github.com/Ashley-Digital/ashley-sfcc-storefront"
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-black underline underline-offset-2 hover:text-neutral-600 dark:text-white dark:hover:text-neutral-400"
                    >
                        Repository ↗
                    </a>
                    <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                </div>
            </div>
        </header>
    );
}

