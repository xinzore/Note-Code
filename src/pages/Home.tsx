import { useState } from 'react';
import { useLocation } from 'wouter';
import { Code2, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { useCreateThread } from '@/hooks/use-threads';
import { CodeEditor } from '@/components/CodeEditor';
import { LanguageSelect } from '@/components/LanguageSelect';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
    const [, setLocation] = useLocation();
    const { t } = useLanguage();
    const [content, setContent] = useState('');
    const [language, setLanguage] = useState('javascript');
    const createThread = useCreateThread();

    const handleSubmit = () => {
        if (!content.trim()) return;
        createThread.mutate(
            { initialContent: content, language },
            {
                onSuccess: (data) => {
                    setLocation(`/${data.slug}`);
                },
            }
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b border-white/10 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                            <Code2 className="w-5 h-5 text-primary" />
                        </div>
                        <h1 className="text-lg font-bold">
                            {t('site.name')}
                            <span className="text-primary">{t('site.name.highlight')}</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-2xl space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold">{t('home.title')}</h2>
                        <p className="text-muted-foreground">{t('home.description')}</p>
                    </div>

                    {/* Code Editor Card */}
                    <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden">
                        <div className="flex items-center gap-1.5 px-4 py-3 bg-white/5 border-b border-white/10">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            <span className="ml-2 text-xs text-muted-foreground">untitled.js</span>
                        </div>
                        <CodeEditor
                            value={content}
                            onChange={setContent}
                            language={language}
                            className="min-h-[250px]"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <LanguageSelect value={language} onChange={setLanguage} />
                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() || createThread.isPending}
                            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            {createThread.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            {t('home.submit')}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
