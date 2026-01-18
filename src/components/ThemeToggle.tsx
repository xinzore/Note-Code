import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        document.body.classList.toggle('dark', isDark);
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
        >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
    );
}
