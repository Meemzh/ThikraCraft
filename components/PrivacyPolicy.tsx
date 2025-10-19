import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  showAcceptButton: boolean;
}

const EmphasizedText: React.FC<{ text: string, keyword: string, className: string }> = ({ text, keyword, className }) => {
    const parts = text.split(keyword);
    if (parts.length !== 2) {
        return <span>{text}</span>;
    }
    return (
        <span>
            {parts[0]}
            <span className={className}>{keyword}</span>
            {parts[1]}
        </span>
    );
};

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isOpen, onClose, onAccept, showAcceptButton }) => {
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  const [isDeclineConfirmation, setIsDeclineConfirmation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDeclineConfirmation(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  const handleDecline = () => setIsDeclineConfirmation(true);
  const handleGoBack = () => setIsDeclineConfirmation(false);

  const keyword = language === 'ar' ? 'أبدًا' : 'NEVER';
  const keywordNeverStored = language === 'ar' ? 'لا تُخزّن أبدًا' : 'NEVER stored'; // No direct single word for this

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className={`${theme.panelBg} rounded-2xl shadow-xl max-w-2xl w-full border ${theme.borderColor} transition-all duration-300 ease-in-out`}>
        <div className={`p-6 border-b ${theme.borderColor}`}>
          <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>
            {isDeclineConfirmation ? t('privacy.reconsiderTitle') : t('privacy.title')}
          </h2>
        </div>

        {isDeclineConfirmation ? (
            <div className={`p-6 ${theme.textSecondary} space-y-4`}>
                <p className="text-lg text-center">{t('privacy.reconsiderBody1')}</p>
                <p className="text-center">
                   <EmphasizedText 
                        text={t('privacy.reconsiderBody2')} 
                        keyword={keyword} 
                        className={`font-bold ${theme.textAccent}`} 
                    />
                </p>
            </div>
        ) : (
            <div className={`p-6 max-h-[60vh] overflow-y-auto ${theme.textSecondary} space-y-4`}>
              <h3 className={`font-semibold text-lg ${theme.textAccent}`}>{t('privacy.priorityTitle')}</h3>
              <p>{t('privacy.priorityBody')}</p>
              <h3 className={`font-semibold text-lg ${theme.textAccent}`}>{t('privacy.usageTitle')}</h3>
              <ul className="list-disc list-inside space-y-2">
                <li>
                    <EmphasizedText 
                        text={t('privacy.usagePoint1')} 
                        keyword={keyword} 
                        className={`font-bold ${theme.textAccent}`} 
                    />
                </li>
                <li>{t('privacy.usagePoint2')}</li>
                <li>{t('privacy.usagePoint3')}</li>
                <li>{t('privacy.usagePoint4')}</li>
              </ul>
               <h3 className={`font-semibold text-lg ${theme.textAccent}`}>{t('privacy.termsTitle')}</h3>
                 <p>{t('privacy.termsBody')}</p>
            </div>
        )}
        
        <div className={`p-4 ${theme.inputBg} bg-opacity-50 rounded-b-2xl flex justify-end space-x-4`}>
          {showAcceptButton ? (
            isDeclineConfirmation ? (
                <>
                    <button onClick={handleGoBack} className={`px-4 py-2 rounded-lg ${theme.buttonSecondary} ${theme.textPrimary} font-semibold transition-colors`}>{t('privacy.goBack')}</button>
                    <button onClick={onClose} className={`px-4 py-2 rounded-lg ${theme.buttonTertiary} text-white font-semibold transition-colors`}>{t('privacy.decideLater')}</button>
                </>
            ) : (
                <>
                    <button onClick={handleDecline} className={`px-4 py-2 rounded-lg ${theme.buttonSecondary} ${theme.textPrimary} font-semibold transition-colors`}>{t('privacy.decline')}</button>
                    <button onClick={onAccept} className={`px-4 py-2 rounded-lg ${theme.buttonPrimary} text-white font-semibold transition-colors`}>{t('privacy.accept')}</button>
                </>
            )
          ) : (
            <button onClick={onClose} className={`px-4 py-2 rounded-lg ${theme.buttonPrimary} text-white font-semibold transition-colors`}>{t('privacy.close')}</button>
          )}
        </div>
      </div>
    </div>
  );
};