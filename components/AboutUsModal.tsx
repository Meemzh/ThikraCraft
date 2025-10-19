import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className={`${theme.panelBg} rounded-2xl shadow-xl max-w-2xl w-full border ${theme.borderColor} transition-all duration-300 ease-in-out`}>
        <div className={`p-6 border-b ${theme.borderColor}`}>
          <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>
            {t('about.title')}
          </h2>
        </div>
        <div className={`p-6 max-h-[60vh] overflow-y-auto ${theme.textSecondary} space-y-4`}>
             <p>{t('about.body1')}</p>
             <ul className="list-none space-y-2 ps-4">
                 <li>
                     <span className={`font-bold ${theme.textAccent}`}>{t('about.thikraTerm')}:</span> {t('about.thikraDef')}
                 </li>
                 <li>
                     <span className={`font-bold ${theme.textAccent}`}>{t('about.craftTerm')}:</span> {t('about.craftDef')}
                 </li>
             </ul>
             <p>{t('about.body2')}</p>
             <p className="italic">{t('about.body3')}</p>
        </div>
        <div className={`p-4 ${theme.inputBg} bg-opacity-50 rounded-b-2xl flex justify-end`}>
          <button onClick={onClose} className={`px-4 py-2 rounded-lg ${theme.buttonPrimary} text-white font-semibold transition-colors`}>{t('about.close')}</button>
        </div>
      </div>
    </div>
  );
};
