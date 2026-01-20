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
    const lineNumbersRef = useRef<HTMLDivElement>(null); // 1. Yeni Ref: Satır numaraları için

    useEffect(() => {
        if (preRef.current) {
            const codeElement = preRef.current.querySelector('code');
            if (codeElement) {
                Prism.highlightElement(codeElement);
            }
        }
    }, [value, language]);

    // 2. Satır Sayısını Hesapla
    // useMemo kullanarak sadece value değiştiğinde hesaplamasını sağlıyoruz (performans için)
    const lineCount = useMemo(() => value.split('\n').length, [value]);
    const lines = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1), [lineCount]);

    const handleScroll = () => {
        if (textareaRef.current && preRef.current && lineNumbersRef.current) {
            // Kod Highlight sync
            preRef.current.scrollTop = textareaRef.current.scrollTop;
            preRef.current.scrollLeft = textareaRef.current.scrollLeft;
            
            // 3. Satır Numarası Sync (Sadece dikey scroll)
            lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

    // Ortak stiller: Satır numaraları ve kodun birebir aynı hizada olması şart
    const commonFontStyles = "font-mono text-sm leading-6"; 

    if (readOnly) {
         // ReadOnly için de basit bir görünüm (isteğe bağlı buraya da satır no eklenebilir ama şimdilik sade bıraktım)
        return (
            <pre className={cn('p-4 rounded-lg bg-black/50 overflow-auto', commonFontStyles, className)}>
                <code className={`language-${language}`}>{value}</code>
            </pre>
        );
    }

    return (
        <div className={cn('relative h-[300px] flex rounded-lg bg-black/30 border border-white/10 overflow-hidden', className)}>
            {/* 4. SOL SÜTUN: Satır Numaraları */}
            <div
                ref={lineNumbersRef}
                className={cn(
                    "flex-shrink-0 w-12 text-right select-none opacity-30 bg-black/20 overflow-hidden pt-4 pb-4 pr-3", // Paddingler textarea ile aynı olmalı (pt-4)
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

            {/* SAĞ SÜTUN: Editör Alanı */}
            <div className="relative flex-1 h-full min-w-0"> {/* min-w-0 flex taşmasını önler */}
                
                {/* Highlight Katmanı */}
                <pre
                    ref={preRef}
                    className={cn(
                        "absolute inset-0 m-0 overflow-hidden pointer-events-none whitespace-pre p-4 pl-2", // pl-2 ile numaralarla kod arasına hafif boşluk
                        commonFontStyles
                    )}
                    aria-hidden="true"
                >
                    <code className={`language-${language} block min-h-full`}>
                        {renderValue || ' '}
                    </code>
                </pre>

                {/* Input Katmanı */}
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => onChange?.(e.target.value)}
                    onScroll={handleScroll}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "absolute inset-0 w-full h-full bg-transparent resize-none outline-none text-transparent caret-white whitespace-pre overflow-auto p-4 pl-2", // pl-2
                        commonFontStyles
                    )}
                    spellCheck={false}
                    autoCapitalize="off"
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="Kodunuzu buraya yazın..."
                />
            </div>

            {shortcutHint && (
                <span className="absolute bottom-3 right-3 text-xs text-muted-foreground opacity-50 pointer-events-none z-10 bg-black/50 px-2 py-1 rounded">
                    {shortcutHint}
                </span>
            )}
        </div>
    );
}
