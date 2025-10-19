import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useCredits } from '../contexts/CreditsContext';

interface AnimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnimate: (duration: number, cost: number) => void;
}

const animationOptions = [
  { duration: 2, cost: 120, nameKey: 'animateModal.moment' },
  { duration: 3, cost: 180, nameKey: 'animateModal.clip' },
  { duration: 5, cost: 300, nameKey: 'animateModal.scene' },
];

export const AnimateModal: React.FC<AnimateModalProps> = ({ isOpen, onClose, onAnimate }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { balance } = useCredits();

  if (!isOpen) return null;

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
          <h2 className={`text-xl font-bold ${theme.textPrimary}`}>{t('animateModal.title')}</h2>
          <p className={`${theme.textSecondary} mt-1 text-sm`}>{t('animateModal.subtitle')}</p>
        </div>

        <div className="p-6 space-y-4">
            <div className={`text-center mb-4 p-2 rounded-lg ${theme.inputBg} border ${theme.borderColor}`}>
                <span className={`font-bold ${theme.textAccent}`}>{t('credits.balance', { count: balance })}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {animationOptions.map(option => {
                    const canAfford = balance >= option.cost;
                    return (
                        <button
                            key={option.duration}
                            onClick={() => onAnimate(option.duration, option.cost)}
                            disabled={!canAfford}
                            className={`p-4 rounded-lg border text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${canAfford ? `${theme.buttonSecondary} hover:border-pink-400` : `border-gray-700`}`}
                        >
                            <p className={`font-bold text-lg ${theme.textPrimary}`}>{t(option.nameKey)}</p>
                            <p className={`text-sm ${theme.textSecondary}`}>{t('animateModal.cost', { cost: option.cost })}</p>
                            {!canAfford && <p className={`text-xs mt-1 text-red-400`}>{t('animateModal.notEnoughCredits')}</p>}
                        </button>
                    )
                })}
            </div>
        </div>

      </div>
    </div>
  );
};