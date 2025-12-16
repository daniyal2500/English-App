//src/components/molecules/LanguageSwitcher.tsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const newLang = i18n.language === 'fa' ? 'en' : 'fa';
        i18n.changeLanguage(newLang);
    };

    return (
        <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-white/10 transition-colors"
            aria-label="Switch Language"
        >
            <Globe size={16} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-300">
                {i18n.language === 'fa' ? 'EN' : 'فا'}
            </span>
        </button>
    );
};
