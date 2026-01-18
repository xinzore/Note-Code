import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return !document.body.classList.contains('light');
        }
        return true;
    });

    useEffect(() => {
        if (isDark) {
            document.body.classList.remove('light');
        } else {
            document.body.classList.add('light');
        }
    }, [isDark]);

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
