import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface VerificationBannerProps {
  onSuccess: () => void;
  onError: () => void;
}

export const VerificationBanner: React.FC<VerificationBannerProps> = ({ onSuccess, onError }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { resendVerificationEmail } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleResend = async () => {
    setIsSending(true);
    try {
      await resendVerificationEmail();
      onSuccess();
      setCooldown(60);
      intervalRef.current = window.setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error resending verification email:", error);
      onError();
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={`w-full p-3 text-center ${theme.inputBg} border-b ${theme.borderColor} flex items-center justify-center gap-4 flex-wrap`}>
      <p className={`text-sm ${theme.textSecondary}`}>{t('auth.verify.bannerText')}</p>
      <button 
        onClick={handleResend}
        disabled={isSending || cooldown > 0}
        className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${theme.buttonSecondary} disabled:opacity-50 min-w-[120px]`}
      >
        {cooldown > 0 
            ? t('auth.verify.resendCooldown', { count: cooldown })
            : isSending 
            ? t('auth.verify.sending') 
            : t('auth.verify.resendButton')}
      </button>
    </div>
  );
};