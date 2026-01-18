import { useLanguage } from '@/hooks/use-language';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    return (
        <button
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            className="h-9 w-9 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors"
            title={language === 'tr' ? 'Switch to English' : "Türkçe'ye geç"}
        >
            <span className="text-xs font-semibold uppercase">
                {language === 'tr' ? 'EN' : 'TR'}
            </span>
        </button>
    );
}
