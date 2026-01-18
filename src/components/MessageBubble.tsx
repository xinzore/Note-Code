import { useEffect, useRef, useState } from 'react';
import Prism from 'prismjs';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';

interface MessageBubbleProps {
    content: string;
    language: string;
    timestamp: string;
    timezone?: string;
    isFirst?: boolean;
}

export function MessageBubble({ content, language, timestamp, timezone = 'Europe/Istanbul', isFirst }: MessageBubbleProps) {
    const codeRef = useRef<HTMLElement>(null);
    const [copied, setCopied] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [content, language]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Use the creator's timezone for displaying time
    const utcTimestamp = timestamp.endsWith('Z') ? timestamp : timestamp + 'Z';
    const formattedTime = new Date(utcTimestamp).toLocaleString('tr-TR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timezone,
    });

    return (
        <div className={cn('animate-fade-in', isFirst ? '' : 'mt-4')}>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded">
                    {language}
                </span>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {formattedTime}
                </span>
            </div>
            <div className="relative bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] overflow-hidden group">
                <div className="flex items-center justify-between px-3 py-2 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <span className="ml-2 text-xs text-[hsl(var(--muted-foreground))]">snippet.{language}</span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-[hsl(var(--background))] transition-colors"
                        title={t('message.copy')}
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-green-500" />
                                <span className="text-green-500">{t('message.copied')}</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{t('message.copy')}</span>
                            </>
                        )}
                    </button>
                </div>
                <pre className="p-4 overflow-x-auto">
                    <code ref={codeRef} className={`language-${language}`}>
                        {content}
                    </code>
                </pre>
            </div>
        </div>
    );
}
