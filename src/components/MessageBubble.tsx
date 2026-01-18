import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
    content: string;
    language: string;
    timestamp: string;
    isFirst?: boolean;
}

export function MessageBubble({ content, language, timestamp, isFirst }: MessageBubbleProps) {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [content, language]);

    return (
        <div className={cn('animate-fade-in', isFirst ? '' : 'mt-4')}>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded">
                    {language}
                </span>
                <span className="text-xs text-muted-foreground">
                    {new Date(timestamp).toLocaleTimeString()}
                </span>
            </div>
            <div className="bg-black/40 rounded-lg border border-white/5 overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-xs text-muted-foreground">snippet.{language}</span>
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
