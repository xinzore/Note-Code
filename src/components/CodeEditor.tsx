import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
// Dil importları aynen kalsın...
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

    // HATA 3 Çözümü: Sadece highlight işlemi için
    useEffect(() => {
        if (preRef.current) {
            // Prism'in DOM'u güncellemesine izin veriyoruz
            const codeElement = preRef.current.querySelector('code');
            if (codeElement) {
                Prism.highlightElement(codeElement);
            }
        }
    }, [value, language]);

    const handleScroll = () => {
        if (textareaRef.current && preRef.current) {
            preRef.current.scrollTop = textareaRef.current.scrollTop;
            preRef.current.scrollLeft = textareaRef.current.scrollLeft;
        }
    };

    // HATA 1 Çözümü: Sondaki yeni satır sorununu fixlemek için
    // Eğer kod \n ile bitiyorsa, görsel olarak render olması için sonuna boşluk ekliyoruz.
    const renderValue = value.endsWith('\n') ? value + ' ' : value;

    // Ortak stil sınıfı (Hizalama için hayati önem taşır)
    const commonStyles = "font-mono text-sm leading-6 p-4";

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        
        const start = e.currentTarget.selectionStart;
        const end = e.currentTarget.selectionEnd;
        const target = e.currentTarget;
        
        // Tab karakteri (veya 2/4 boşluk) ekle
        const spaces = '  '; // İstersen '\t' yap
        const newValue = value.substring(0, start) + spaces + value.substring(end);
        
        // Değeri güncelle
        onChange?.(newValue);
        
        // İmleci doğru yere taşı (React render sonrası çalışması için setTimeout gerekebilir 
        // ama modern tarayıcılarda senkron da yiyebiliyor, garanti olsun diye setTimeout)
        setTimeout(() => {
            target.selectionStart = target.selectionEnd = start + spaces.length;
            }, 0);
        }
    };

    if (readOnly) {
        return (
            <pre className={cn('rounded-lg bg-black/50 overflow-auto', commonStyles, className)}>
                <code className={`language-${language}`}>{value}</code>
            </pre>
        );
    }

    return (
        <div className={cn('relative h-[200px]', className)}> {/* Yükseklik verdim */}
            {/* Highlight Katmanı (Alt) */}
            <pre
                ref={preRef}
                className={cn(
                    "absolute inset-0 m-0 overflow-hidden pointer-events-none bg-black/30 rounded-lg whitespace-pre", // whitespace-pre önemli
                    commonStyles
                )}
                aria-hidden="true"
            >
                <code className={`language-${language} block min-h-full`}>
                    {renderValue || ' '}
                </code>
            </pre>

            {/* Editor Katmanı (Üst) */}
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                onScroll={handleScroll}
                className={cn(
                    "absolute inset-0 w-full h-full bg-transparent resize-none outline-none text-transparent caret-white rounded-lg whitespace-pre overflow-auto",
                     commonStyles
                )}
                spellCheck={false}
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                placeholder="Kodunuzu buraya yazın..."
                onKeyDown={handleKeyDown}
            />
            
            {shortcutHint && (
                <span className="absolute bottom-3 right-3 text-xs text-muted-foreground opacity-50 pointer-events-none z-10">
                    {shortcutHint}
                </span>
            )}
        </div>
    );
}
