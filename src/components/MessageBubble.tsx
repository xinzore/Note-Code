import { useState } from 'react'; // useRef ve useEffect'e gerek kalmadı
import { Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';
import { CodeEditor } from './CodeEditor'; // CodeEditor'ü import etmeyi unutma

interface MessageBubbleProps {
    content: string;
    language: string;
    timestamp: string;
    timezone?: string;
    isFirst?: boolean;
}

export function MessageBubble({ content, language, timestamp, timezone = 'Europe/Istanbul', isFirst }: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);
    const { t } = useLanguage();

    // Copy işlevi aynı kalıyor
    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

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
            {/* Üst Bilgi (Dil ve Zaman) */}
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded">
                    {language}
                </span>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                    {formattedTime}
                </span>
            </div>

            {/* KART YAPISI */}
            <div className="relative bg-[hsl(var(--card))] rounded-lg border border-[hsl(var(--border))] overflow-hidden group">

                {/* HEADER: Trafik Işıkları ve Copy Butonu (Aynen koruduk) */}
                <div className="flex items-center justify-between px-3 py-2 bg-[hsl(var(--muted))] border-b border-[hsl(var(--border))]">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <span className="ml-2 text-xs text-[hsl(var(--muted-foreground))] font-mono">
                            snippet.{language === 'javascript' ? 'js' : language === 'typescript' ? 'ts' : language === 'python' ? 'py' : language}
                        </span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-[hsl(var(--background))] transition-colors text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
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

                {/* CONTENT: CodeEditor Entegrasyonu */}
                {/* border-none ve rounded-none verdik ki üstteki header ile birleşsin */}
                <CodeEditor
                    value={content}
                    language={language}
                    readOnly={true}
                    className="border-none rounded-none bg-transparent"
                />
            </div>
        </div>
    );
}