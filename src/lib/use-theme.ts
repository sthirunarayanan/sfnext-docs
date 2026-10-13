import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'sfnext-docs-theme';

function getInitialTheme(): Theme {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Tracks the current light/dark theme, keeps the `dark` class on <html> in sync (Tailwind's
 * class-based dark variant, configured via `@custom-variant dark` in index.css), and persists
 * the choice to localStorage. The initial class is also set synchronously in index.html so
 * there's no flash of the wrong theme before React hydrates.
 */
export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
    }, []);

    return { theme, toggleTheme };
}

