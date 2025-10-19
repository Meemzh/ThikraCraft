import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

export const Watermark = () => {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black bg-opacity-50 px-2 py-1 rounded-full text-white text-xs select-none pointer-events-none">
            <span>{t('header.title')}</span>
        </div>
    );
};
