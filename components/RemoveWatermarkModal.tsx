import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface RemoveWatermarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RemoveWatermarkModal: React.FC<RemoveWatermarkModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  if (!isOpen) return null;

  const handleConfirm = () => {
    // In a real app, this would trigger a payment flow.
    // For this simulation, we just confirm the action.
    onConfirm();
    onClose();
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end" 
        onClick={onClose}
        aria-modal="true" 
        role="dialog"
    >
        <div 
            className={`w-full ${theme.panelBg} rounded-t-2xl shadow-lg animate-slide-up border-t ${theme.borderColor}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className={`p-4 border-b ${theme.borderColor} text-center`}>
              <h2 className={`text-xl font-bold ${theme.textPrimary}`}>{t('watermark.title')}</h2>
            </div>
            <div className="p-6 text-center space-y-4">
              <p className={`${theme.textSecondary}`}>{t('watermark.body')}</p>
              <p className={`text-xs ${theme.textSecondary}`}>{t('watermark.disclosure')}</p>
            </div>
            <div className={`p-4 ${theme.inputBg} bg-opacity-50 rounded-b-t-2xl flex justify-end gap-4`}>
              <button onClick={onClose} className={`px-4 py-2 rounded-lg ${theme.buttonSecondary}`}>{t('watermark.cancel')}</button>
              <button onClick={handleConfirm} className={`px-6 py-2 rounded-lg ${theme.buttonPrimary} text-white font-semibold`}>{t('watermark.confirm')}</button>
            </div>
        </div>
    </div>
  );
};