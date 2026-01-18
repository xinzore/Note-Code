import { cn } from '@/lib/utils';

const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'bash', label: 'Bash' },
];

interface LanguageSelectProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function LanguageSelect({ value, onChange, className }: LanguageSelectProps) {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
                'bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50 transition-colors',
                className
            )}
        >
            {languages.map((lang) => (
                <option key={lang.value} value={lang.value} className="bg-gray-900">
                    {lang.label}
                </option>
            ))}
        </select>
    );
}
