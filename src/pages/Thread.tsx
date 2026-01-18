import { useState } from 'react';
import { useParams, Link } from 'wouter';
import { Code2, Send, Link as LinkIcon, Lock, LockOpen, Loader2, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useThread, useCreateMessage, useLockThread } from '@/hooks/use-threads';
import { CodeEditor } from '@/components/CodeEditor';
import { MessageBubble } from '@/components/MessageBubble';
import { LanguageSelect } from '@/components/LanguageSelect';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Thread() {
    const { slug } = useParams<{ slug: string }>();
    const { t } = useLanguage();
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('javascript');

    const { data: thread, isLoading, isError } = useThread(slug!);
    const createMessage = useCreateMessage(slug!);
    const lockThread = useLockThread(slug!);

    const isLocked = thread?.locked ?? false;

    const handleSend = () => {
        if (!content.trim() || isLocked) return;
        createMessage.mutate(
            { content, language },
            { onSuccess: () => setContent('') }
        );
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
    };

    const handleLock = () => {
        lockThread.mutate();
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !thread) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white/5 rounded-xl p-8 text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">{t('thread.notFound')}</h2>
                    <p className="text-muted-foreground mb-4">{t('thread.notFoundDesc')}</p>
                    <Link href="/">
                        <a className="inline-block bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                            {t('thread.createNew')}
                        </a>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b border-white/10 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <a className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <Code2 className="w-5 h-5 text-primary" />
                                </div>
                                <h1 className="text-lg font-bold">
                                    {t('site.name')}
                                    <span className="text-primary">{t('site.name.highlight')}</span>
                                </h1>
                            </a>
                        </Link>
                        {isLocked && (
                            <span className="flex items-center gap-1 text-xs bg-amber-500/20 text-amber-500 px-2 py-1 rounded">
                                <Lock className="w-3 h-3" />
                                {t('thread.locked')}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageToggle />
                        <ThemeToggle />
                        {!isLocked && (
                            <button
                                onClick={handleLock}
                                disabled={lockThread.isPending}
                                className="flex items-center gap-1 text-sm text-amber-500 hover:bg-amber-500/10 px-3 py-2 rounded-lg transition-colors"
                            >
                                {lockThread.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <LockOpen className="w-4 h-4" />
                                )}
                                <span className="hidden sm:inline">{t('thread.lock')}</span>
                            </button>
                        )}
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-1 text-sm text-primary hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors"
                        >
                            <LinkIcon className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('thread.copyLink')}</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Locked Banner */}
            {isLocked && (
                <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2">
                    <div className="max-w-4xl mx-auto flex items-center gap-2 text-amber-500 text-sm">
                        <Lock className="w-4 h-4" />
                        {t('thread.lockedBanner')}
                    </div>
                </div>
            )}

            {/* Messages */}
            <main className="flex-1 overflow-auto p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-xs text-muted-foreground mb-4">
                        {t('thread.sessionStarted')} • /{slug}
                    </div>
                    {thread.messages.map((msg, idx) => (
                        <MessageBubble
                            key={msg.id}
                            content={msg.content}
                            language={msg.language}
                            timestamp={msg.created_at}
                            isFirst={idx === 0}
                        />
                    ))}
                </div>
            </main>

            {/* Input Area */}
            {!isLocked && (
                <div className="border-t border-white/10 p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden">
                            <CodeEditor
                                value={content}
                                onChange={setContent}
                                language={language}
                                className="min-h-[120px]"
                            />
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                            <LanguageSelect value={language} onChange={setLanguage} />
                            <button
                                onClick={handleSend}
                                disabled={!content.trim() || createMessage.isPending}
                                className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                            >
                                {createMessage.isPending ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                {t('thread.send')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
