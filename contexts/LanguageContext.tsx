import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { translations } from '../translations';

export type Language = 'en' | 'ar';

const getNestedValue = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, options?: { [key: string]: string | number } | { returnObjects: true }) => any;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// FIX: Fix "missing children" prop error by changing component signature to use React.FC.
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  // FIX: Explicitly typing `dir` as `'ltr' | 'rtl'` prevents TypeScript
  // from widening its type to `string`, which caused the type mismatch
  // with `LanguageContextType`.
  const dir: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    const savedLang = localStorage.getItem('app-language') as Language;
    if (savedLang && ['en', 'ar'].includes(savedLang)) {
      setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const t = useCallback((key: string, options?: { [key: string]: string | number } | { returnObjects: true }): any => {
    let translation = getNestedValue(translations[language], key);
    
    if (typeof translation === 'undefined') {
        console.warn(`Translation key "${key}" not found for language "${language}"`);
        // Fallback to English
        translation = getNestedValue(translations.en, key) || key;
    }
    
    if (options && 'returnObjects' in options && options.returnObjects === true) {
        return translation;
    }

    if (typeof translation === 'string' && options) {
      Object.keys(options).forEach(optionKey => {
        translation = translation.replace(`{${optionKey}}`, String(options[optionKey]));
      });
    }

    return translation;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t, dir }), [language, t, dir]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};