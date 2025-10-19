import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useTranslation } from '../contexts/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';
import { useCredits } from '../contexts/CreditsContext';
import { HeaderSpotlight } from './HeaderSpotlight';

const BrandIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-300" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.522 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
  </svg>
);

interface HeaderProps {
  onLoginClick: () => void;
  onMemoriesClick: () => void;
  onSpotlightClick: (sceneId: string) => void;
  onProfileClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onMemoriesClick, onSpotlightClick, onProfileClick }) => {
  const { theme } = useTheme();
  const { t, dir } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const { balance } = useCredits();

  const CreditsDisplay = () => (
    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${theme.inputBg} ${theme.textAccent} border ${theme.borderColor}`}>
      {t('credits.balance', { count: balance ?? 0 })}
    </div>
  );

  return (
    <>
      <header className="py-4 px-2 text-center relative">
        <div className="flex justify-between items-center h-12">
          {/* Left Side */}
          <div className="flex-1 flex justify-start">
            <LanguageSwitcher />
          </div>

          {/* Center Logo/Title (conditionally shown, or just space) */}
          <div className="flex-1 flex justify-center">
              {/* This space can be used for a logo on larger screens if needed */}
          </div>

          {/* Right Side */}
          <div className="flex-1 flex justify-end items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <CreditsDisplay />
                <button onClick={onMemoriesClick} className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${theme.buttonSecondary}`}>{t('memories.button')}</button>
                <button onClick={onProfileClick} className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${theme.buttonSecondary}`}>{user.name}</button>
                <button onClick={logout} className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${theme.buttonSecondary}`}>{t('auth.logout')}</button>
              </>
            ) : (
              <button onClick={onLoginClick} className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${theme.buttonSecondary}`}>
                {t('auth.login')}
              </button>
            )}
            <ThemeSwitcher />
          </div>
        </div>
        
        <div className={`inline-flex items-center mt-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
          <div className={dir === 'rtl' ? 'ms-3' : 'me-3'}>
              <BrandIcon />
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text ${theme.headerGradient}`}>
            {t('header.title')}
          </h1>
        </div>
        <p className={`${theme.textSecondary} mt-2 text-lg`}>{t('header.subtitle')}</p>
        
        {isAuthenticated && user && (
          <div className="mt-4 flex justify-center items-center gap-4">
              <span className={`${theme.textPrimary}`}>{t('auth.welcome', { name: user.name })}</span>
          </div>
        )}
      </header>
      {isAuthenticated && <HeaderSpotlight onClick={onSpotlightClick} />}
    </>
  );
};
