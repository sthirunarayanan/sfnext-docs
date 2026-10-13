import type { Theme } from '../lib/use-theme';

interface ThemeToggleProps {
    theme: Theme;
    onToggle: () => void;
}

/** Sun/moon icon button that flips between light and dark mode. */
export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={onToggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black"
        >
            {isDark ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4" />
                    <path
                        strokeLinecap="round"
                        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                    />
                </svg>
            ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
                </svg>
            )}
        </button>
    );
}

