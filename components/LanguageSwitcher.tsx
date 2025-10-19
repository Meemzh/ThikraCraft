import React from 'react';
import { useTranslation, Language } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const buttonStyle = (lang: Language) => `
    px-3 py-1 text-sm font-bold rounded-full transition-colors
    ${language === lang ? 'bg-white text-gray-900' : 'text-white hover:bg-white hover:bg-opacity-20'}
  `;

  return (
    <div className="flex space-x-1 p-1 bg-black bg-opacity-20 rounded-full border border-white border-opacity-10 z-20">
      <button onClick={() => setLanguage('en')} className={buttonStyle('en')}>EN</button>
      <button onClick={() => setLanguage('ar')} className={buttonStyle('ar')}>AR</button>
    </div>
  );
};