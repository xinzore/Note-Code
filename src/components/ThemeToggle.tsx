import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            // Check localStorage first
            const saved = localStorage.getItem('theme');
            if (saved) {
                return saved === 'dark';
            }
            // Fall back to system preference or default dark
            return !window.matchMedia('(prefers-color-scheme: light)').matches;
        }
        return true;
    });

    useEffect(() => {
        if (isDark) {
            document.body.classList.remove('light');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.add('light');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    // Apply theme on initial load
    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved === 'light') {
            document.body.classList.add('light');
        }
    }, []);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="h-9 w-9 flex items-center justify-center rounded-md border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
    );
}
