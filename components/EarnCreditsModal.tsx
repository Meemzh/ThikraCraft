import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useCredits } from '../contexts/CreditsContext';
import { adService } from '../services/adService';

interface EarnCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdSuccess: (credits: number) => void;
}

const ADS_PER_DAY = 3;
const CREDITS_PER_AD = 2;

export const EarnCreditsModal: React.FC<EarnCreditsModalProps> = ({ isOpen, onClose, onAdSuccess }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { addCredits } = useCredits();
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toDateString();
      const lastAdWatchDate = localStorage.getItem('lastAdWatchDate');
      if (lastAdWatchDate !== today) {
        localStorage.setItem('adsWatchedToday', '0');
        setAdsWatchedToday(0);
      } else {
        setAdsWatchedToday(parseInt(localStorage.getItem('adsWatchedToday') || '0', 10));
      }
      setError(null);
    }
  }, [isOpen]);

  const handleWatchAd = async () => {
    if (adsWatchedToday >= ADS_PER_DAY) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const success = await adService.showRewardedAd();
      if (success) {
        const newCount = adsWatchedToday + 1;
        setAdsWatchedToday(newCount);
        localStorage.setItem('adsWatchedToday', newCount.toString());
        localStorage.setItem('lastAdWatchDate', new Date().toDateString());
        await addCredits(CREDITS_PER_AD);
        onAdSuccess(CREDITS_PER_AD);
      } else {
        setError(t('credits.ads.error'));
      }
    } catch (e) {
        setError(t('credits.ads.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const adsRemaining = ADS_PER_DAY - adsWatchedToday;

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
          <h2 className={`text-xl font-bold ${theme.textPrimary}`}>{t('credits.earnModal.title')}</h2>
          <p className={`${theme.textSecondary} mt-1 text-sm`}>{t('credits.earnModal.subtitle')}</p>
        </div>

        <div className="p-6">
            <div className={`p-4 rounded-lg border text-center flex flex-col md:flex-row items-center justify-between ${theme.borderColor} ${theme.inputBg}`}>
                <div>
                    <h3 className={`font-bold text-lg ${theme.textAccent}`}>{t('credits.ads.title')}</h3>
                    <p className={`text-sm ${theme.textSecondary}`}>{t('credits.ads.body', { count: CREDITS_PER_AD })}</p>
                    {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
                </div>
                <button onClick={handleWatchAd} disabled={adsRemaining <= 0 || isLoading} className={`mt-4 md:mt-0 w-full md:w-auto py-2 px-6 rounded-lg ${theme.buttonSecondary} text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]`}>
                  {isLoading ? t('credits.ads.loading') : `${t('credits.ads.button')} (${adsRemaining}/${ADS_PER_DAY})`}
                </button>
            </div>
        </div>

        <div className={`p-4 ${theme.inputBg} bg-opacity-50 rounded-b-t-2xl flex justify-end`}>
          <button onClick={onClose} className={`px-4 py-2 rounded-lg ${theme.buttonSecondary} ${theme.textPrimary} font-semibold transition-colors`}>{t('credits.earnModal.close')}</button>
        </div>
      </div>
    </div>
  );
};