//src/i18n/config.ts

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import translationFA from '../../public/locales/fa/translation.json';
import translationEN from '../../public/locales/en/translation.json';

// Get browser language or default to Persian
const getBrowserLanguage = () => {
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('fa') || browserLang.startsWith('per')) {
        return 'fa';
    } else if (browserLang.startsWith('en')) {
        return 'en';
    }
    // Default to Persian for users in Iran or with Farsi browser
    return 'fa';
};

// Get stored language or browser language
const getInitialLanguage = () => {
    const stored = localStorage.getItem('appLanguage');
    return stored || getBrowserLanguage();
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            fa: {
                translation: translationFA
            },
            en: {
                translation: translationEN
            }
        },
        lng: getInitialLanguage(),
        fallbackLng: 'fa',
        interpolation: {
            escapeValue: false // React already escapes
        },
        // Optional: Add detection plugin config
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

// Save language changes to localStorage
i18n.on('languageChanged', (lng) => {
    localStorage.setItem('appLanguage', lng);
    // Update HTML dir and lang attributes
    document.documentElement.dir = lng === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
});

// Set initial direction
document.documentElement.dir = i18n.language === 'fa' ? 'rtl' : 'ltr';
document.documentElement.lang = i18n.language;

export default i18n;
