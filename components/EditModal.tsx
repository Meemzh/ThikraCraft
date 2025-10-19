import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string, faceLock: boolean) => void;
  title: string;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

export const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSubmit, title }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [feedback, setFeedback] = useState('');
  const [faceLock, setFaceLock] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(feedback, faceLock);
    setFeedback('');
    setFaceLock(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className={`${theme.panelBg} rounded-2xl shadow-xl max-w-lg w-full border ${theme.borderColor} transition-all duration-300 ease-in-out`}>
        <div className={`p-6 border-b ${theme.borderColor}`}>
          <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>{title}</h2>
          <p className={`text-sm mt-1 ${theme.textSecondary}`}>{t('editor.prompt')}</p>
        </div>
        <div className="p-6 space-y-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={4}
            className={`w-full p-3 ${theme.inputBg} ${theme.textPrimary} border ${theme.borderColor} rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-colors`}
            placeholder={t('editor.placeholder')}
          />
          <div className={`flex items-center justify-between p-3 rounded-lg ${theme.inputBg}`}>
             <div className="relative flex items-center">
                 <label htmlFor="faceLockToggle" className={`font-medium ${theme.textPrimary}`}>{t('editor.faceLock.label')}</label>
                 <div 
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="ml-2 cursor-pointer"
                 >
                    <InfoIcon />
                 </div>
                 {showTooltip && (
                    <div className={`absolute bottom-full mb-2 w-48 p-2 text-xs ${theme.panelBg} ${theme.textPrimary} rounded-md shadow-lg z-10 border ${theme.borderColor}`}>
                        {t('editor.faceLock.tooltip')}
                    </div>
                )}
             </div>
              <label htmlFor="faceLockToggle" className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" id="faceLockToggle" className="sr-only peer" checked={faceLock} onChange={() => setFaceLock(!faceLock)} />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-focus:ring-2 peer-focus:ring-pink-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
            </label>
          </div>
        </div>
        <div className={`p-4 ${theme.inputBg} bg-opacity-50 rounded-b-2xl flex justify-end space-x-4`}>
          <button onClick={onClose} className={`px-4 py-2 rounded-lg ${theme.buttonSecondary} ${theme.textPrimary} font-semibold transition-colors`}>{t('editor.cancel')}</button>
          <button onClick={handleSubmit} className={`px-4 py-2 rounded-lg ${theme.buttonPrimary} text-white font-semibold transition-colors`}>{t('editor.submit')}</button>
        </div>
      </div>
    </div>
  );
};