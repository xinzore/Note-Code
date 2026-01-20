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
            'relative flex rounded-lg bg-black/30 border border-white/10 overflow-hidden', 
            // ReadOnly değilse belirli bir yükseklik, readOnly ise içerik kadar uzasın (veya senin tercihin)
            !readOnly ? 'h-[300px]' : 'h-auto',
            className
        )}>
            {/* Satır Numaraları */}
            <div
                ref={lineNumbersRef}
                className={cn(
                    "flex-shrink-0 w-12 text-right select-none opacity-30 bg-black/20 overflow-hidden pt-4 pb-4 pr-3",
                    commonFontStyles
                )}
                aria-hidden="true"
            >
                {lines.map((line) => (
                    <div key={line} className="text-white">
                        {line}
                    </div>
                ))}
            </div>

            {/* Editör Alanı */}
            <div className="relative flex-1 min-w-0 group">
                <pre
                    ref={preRef}
                    className={cn(
                        "absolute inset-0 m-0 overflow-hidden pointer-events-none whitespace-pre p-4 pl-2",
                        // ReadOnly modda position absolute yerine relative kullanabiliriz ki yükseklik otomatik artsın
                        // Ama şimdilik yapıyı bozmuyorum, textarea boyutu belirleyecek.
                        commonFontStyles
                    )}
                    aria-hidden="true"
                >
                    <code className={`language-${language} block min-h-full`}>
                        {renderValue || ' '}
                    </code>
                </pre>

                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => !readOnly && onChange?.(e.target.value)}
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    readOnly={readOnly}
                    className={cn(
                        "w-full h-full bg-transparent resize-none outline-none text-transparent whitespace-pre overflow-auto p-4 pl-2",
                        // ReadOnly ise caret (imleç) rengini gizle, değilse beyaz yap
                        readOnly ? "cursor-text caret-transparent" : "caret-white",
                        // ReadOnly modda scrollbar gizlenebilir veya style verilebilir
                        commonFontStyles
                    )}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder={readOnly ? "" : "Kodunuzu buraya yazın..."}
                />
            </div>

            {shortcutHint && !readOnly && (
                <span className="absolute bottom-3 right-3 text-xs text-muted-foreground opacity-50 pointer-events-none z-10 bg-black/50 px-2 py-1 rounded">
                    {shortcutHint}
                </span>
            )}
        </div>
    );
}
