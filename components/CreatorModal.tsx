import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorModal: React.FC<CreatorModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className={`${theme.panelBg} rounded-2xl shadow-xl max-w-2xl w-full border ${theme.borderColor} transition-all duration-300 ease-in-out`}>
        <div className={`p-6 border-b ${theme.borderColor}`}>
          <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>
            {t('creator.title')}
          </h2>
        </div>
        <div className={`p-6 max-h-[60vh] overflow-y-auto ${theme.textSecondary} space-y-4`}>
             <p>{t('creator.body')}</p>
             
             <div className="pt-2">
                <h3 className={`font-semibold text-lg ${theme.textAccent}`}>{t('creator.contactTitle')}</h3>
                <ul className="list-none space-y-2 mt-2">
                    <li>
                        <span className={`font-bold ${theme.textPrimary}`}>{t('creator.emailLabel')}</span> 
                        <a href="mailto:Meemzh98@gmail.com" className={`underline hover:${theme.textAccent}`}> Meemzh98@gmail.com</a>
                    </li>
                    <li>
                        <span className={`font-bold ${theme.textPrimary}`}>{t('creator.instagramLabel')}</span> 
                        <a href="https://www.instagram.com/almeemh_98" target="_blank" rel="noopener noreferrer" className={`underline hover:${theme.textAccent}`}> @almeemh_98</a>
                    </li>
                </ul>
             </div>
        </div>
        <div className={`p-4 ${theme.inputBg} bg-opacity-50 rounded-b-2xl flex justify-end`}>
          <button onClick={onClose} className={`px-4 py-2 rounded-lg ${theme.buttonPrimary} text-white font-semibold transition-colors`}>{t('creator.close')}</button>
        </div>
      </div>
    </div>
  );
};