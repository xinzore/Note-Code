import { useEffect, useRef, useMemo } from 'react';
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
    shortcutHint?: string;
}

export function CodeEditor({
    value,
    onChange,
    language = 'javascript',
    readOnly = false,
    className,
    shortcutHint,
}: CodeEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const preRef = useRef<HTMLPreElement>(null);
    const lineNumbersRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (preRef.current) {
            const codeElement = preRef.current.querySelector('code');
            if (codeElement) {
                Prism.highlightElement(codeElement);
            }
        }
    }, [value, language]);

    const lineCount = useMemo(() => value.split('\n').length, [value]);
    const lines = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1), [lineCount]);

    const handleScroll = () => {
        if (textareaRef.current && preRef.current && lineNumbersRef.current) {
            preRef.current.scrollTop = textareaRef.current.scrollTop;
            preRef.current.scrollLeft = textareaRef.current.scrollLeft;
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (readOnly) return; // ReadOnly ise tuşları dinleme

        if (e.key === 'Tab') {
            e.preventDefault();
            const start = e.currentTarget.selectionStart;
            const end = e.currentTarget.selectionEnd;
            const target = e.currentTarget;
            const spaces = '  ';
            const newValue = value.substring(0, start) + spaces + value.substring(end);
            onChange?.(newValue);
            setTimeout(() => {
                target.selectionStart = target.selectionEnd = start + spaces.length;
            }, 0);
        }
    };

    const renderValue = value.endsWith('\n') ? value + ' ' : value;
    const commonFontStyles = "font-mono text-sm leading-6";

    return (
        // Flex container styles updated
        <div className={cn(
            'relative flex rounded-lg bg-[hsl(var(--editor-bg))] border border-[hsl(var(--border))] overflow-hidden',
            // ReadOnly değilse belirli bir yükseklik, readOnly ise içerik kadar uzasın
            !readOnly ? 'h-[300px]' : 'h-auto',
            // ReadOnly modda scrollbar gizle
            readOnly && 'hide-scrollbar',
            className
        )}>
            {/* Satır Numaraları */}
            <div
                ref={lineNumbersRef}
                className={cn(
                    "flex-shrink-0 w-12 text-right select-none opacity-50 bg-[hsl(var(--muted))] overflow-hidden pt-4 pb-4 pr-3",
                    commonFontStyles
                )}
                aria-hidden="true"
            >
                {lines.map((line) => (
                    <div key={line} className="text-[hsl(var(--foreground))]">
                        {line}
                    </div>
                ))}
            </div>

            {/* Editör Alanı */}
            <div className="relative flex-1 min-w-0 group">
                {/* Syntax highlighted pre - her zaman göster */}
                <pre
                    ref={preRef}
                    className={cn(
                        "m-0 whitespace-pre p-4 pl-2",
                        readOnly
                            ? "overflow-auto hide-scrollbar"
                            : "absolute inset-0 overflow-hidden pointer-events-none",
                        commonFontStyles
                    )}
                >
                    <code className={`language-${language} block min-h-full`}>
                        {renderValue || ' '}
                    </code>
                </pre>

                {/* Edit modda transparent textarea (seçim için) */}
                {!readOnly && (
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        onScroll={handleScroll}
                        onKeyDown={handleKeyDown}
                        className={cn(
                            "w-full h-full bg-transparent resize-none outline-none whitespace-pre overflow-auto p-4 pl-2",
                            "text-transparent caret-[hsl(var(--foreground))] code-editor-selection",
                            commonFontStyles
                        )}
                        spellCheck={false}
                        autoCapitalize="off"
                        autoComplete="off"
                        autoCorrect="off"
                        placeholder="Kodunuzu buraya yazın..."
                    />
                )}
            </div>

            {shortcutHint && !readOnly && (
                <span className="absolute bottom-3 right-3 text-xs text-muted-foreground opacity-50 pointer-events-none z-10 bg-black/50 px-2 py-1 rounded">
                    {shortcutHint}
                </span>
            )}
        </div>
    );
}