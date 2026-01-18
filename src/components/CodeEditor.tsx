import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
    value: string;
    onChange?: (value: string) => void;
    language?: string;
    readOnly?: boolean;
    className?: string;
}

export function CodeEditor({
    value,
    onChange,
    language = 'javascript',
    readOnly = false,
    className,
}: CodeEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const highlightRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        if (highlightRef.current) {
            Prism.highlightElement(highlightRef.current.querySelector('code')!);
        }
    }, [value, language]);

    const handleScroll = () => {
        if (textareaRef.current && highlightRef.current) {
            highlightRef.current.scrollTop = textareaRef.current.scrollTop;
            highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    if (readOnly) {
        return (
            <pre className={cn('p-4 rounded-lg bg-black/50 overflow-auto', className)}>
                <code className={`language-${language}`}>{value}</code>
            </pre>
        );
    }

    return (
        <div className={cn('relative font-mono text-sm', className)}>
            <pre
                ref={highlightRef}
                className="absolute inset-0 p-4 overflow-auto pointer-events-none bg-black/30 rounded-lg"
                aria-hidden="true"
            >
                <code className={`language-${language}`}>{value || ' '}</code>
            </pre>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onScroll={handleScroll}
                className="relative w-full h-full p-4 bg-transparent resize-none outline-none text-transparent caret-white rounded-lg min-h-[200px]"
                spellCheck={false}
                placeholder="Kodunuzu buraya yazın..."
            />
        </div>
    );
}
