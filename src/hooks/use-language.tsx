import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'tr' | 'en';

const translations = {
    tr: {
        'site.name': 'Kod',
        'site.name.highlight': 'Sync',
        'home.title': 'Yapıştır, Kaydet, Senkronize Et.',
        'home.description': 'Kod parçalarını hızlıca paylaşın. Yapıştır, kaydet ve benzersiz bir bağlantı oluştur.',
        'home.placeholder': 'Kodunuzu buraya yapıştırın...',
        'home.submit': 'Gönder',
        'thread.copyLink': 'Bağlantıyı Kopyala',
        'thread.sessionStarted': 'Oturum başlatıldı',
        'thread.syncing': 'Senkronize ediliyor...',
        'thread.notFound': 'Thread Bulunamadı',
        'thread.notFoundDesc': 'Aradığınız kod parçası mevcut değil veya silinmiş.',
        'thread.createNew': 'Yeni Snippet Oluştur',
        'thread.lock': 'Kilitle',
        'thread.locked': 'Kilitli',
        'thread.lockedBanner': 'Bu thread kilitli - yeni içerik eklenemez.',
        'thread.send': 'Gönder',
        'message.copy': 'Kopyala',
        'message.copied': 'Kopyalandı',
        'shortcut.send': 'ile gönder',
    },
    en: {
        'site.name': 'Code',
        'site.name.highlight': 'Sync',
        'home.title': 'Paste, Save, Sync.',
        'home.description': 'Quickly share code snippets. Paste, save and create a unique link.',
        'home.placeholder': 'Paste your code here...',
        'home.submit': 'Send',
        'thread.copyLink': 'Copy Link',
        'thread.sessionStarted': 'Session started',
        'thread.syncing': 'Syncing...',
        'thread.notFound': 'Thread Not Found',
        'thread.notFoundDesc': 'The code snippet you are looking for does not exist or has been deleted.',
        'thread.createNew': 'Create New Snippet',
        'thread.lock': 'Lock',
        'thread.locked': 'Locked',
        'thread.lockedBanner': 'This thread is locked - no new content can be added.',
        'thread.send': 'Send',
        'message.copy': 'Copy',
        'message.copied': 'Copied',
        'shortcut.send': 'to send',
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('tr');

    const t = (key: string): string => {
        return translations[language][key as keyof typeof translations['tr']] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
