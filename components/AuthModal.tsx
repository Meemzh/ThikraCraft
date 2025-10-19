import React, { useState, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { login, signUp, sendPasswordResetEmail } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup' | 'reset' | 'signupSuccess'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getAuthErrorMessage = useCallback((code: string): string => {
    switch (code) {
      case 'auth/wrong-password':
        return t('auth.errors.wrongPassword');
      case 'auth/user-not-found':
        return t('auth.errors.userNotFound');
      case 'auth/email-already-in-use':
        return t('auth.errors.emailInUse');
      case 'auth/weak-password':
        return t('auth.errors.weakPassword');
      case 'auth/password-does-not-meet-requirements':
        return t('auth.errors.passwordRequirements');
      default:
        return t('auth.errors.generic');
    }
  }, [t]);

  if (!isOpen) return null;
  
  const handleClose = () => {
    setError(null);
    setSuccessMessage(null);
    setEmail('');
    setPassword('');
    setMode('login');
    onClose();
  };
  
  const clearMessages = () => {
      setError(null);
      setSuccessMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();

    if (mode === 'signup') {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasSymbol = /[^A-Za-z0-9]/.test(password);
      if (password.length < 6 || !hasUpperCase || !hasSymbol) {
        setError(t('auth.errors.passwordRequirements'));
        return;
      }
    }

    setIsProcessing(true);
    
    try {
      if (mode === 'login') {
        await login(email, password);
        handleClose();
      } else {
        await signUp(email, password);
        setMode('signupSuccess');
      }
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use' && mode === 'signup') {
        setError(getAuthErrorMessage(e.code));
        setMode('login');
      } else {
        setError(getAuthErrorMessage(e.code));
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleResetSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    clearMessages();
    setIsProcessing(true);
    try {
      await sendPasswordResetEmail(email);
      setSuccessMessage(t('auth.resetSuccess'));
    } catch (e: any) {
      setError(getAuthErrorMessage(e.code));
    } finally {
      setIsProcessing(false);
    }
  };
  
  const toggleMode = () => {
    clearMessages();
    setMode(mode === 'login' ? 'signup' : 'login');
  };

  const renderLoginSignup = () => (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div>
        <label htmlFor="email" className={`block mb-2 text-sm font-medium ${theme.textSecondary}`}>{t('auth.emailLabel')}</label>
        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={`w-full p-3 ${theme.inputBg} ${theme.textPrimary} border ${theme.borderColor} rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-colors`} />
      </div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="password" className={`text-sm font-medium ${theme.textSecondary}`}>{t('auth.passwordLabel')}</label>
          {mode === 'login' && <button type="button" onClick={() => { clearMessages(); setMode('reset'); }} className={`text-xs underline ${theme.textSecondary} hover:${theme.textPrimary}`}>{t('auth.forgotPassword')}</button>}
        </div>
        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={`w-full p-3 ${theme.inputBg} ${theme.textPrimary} border ${theme.borderColor} rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-colors`} />
        {mode === 'signup' && <p className={`mt-2 text-xs ${theme.textSecondary}`}>{t('auth.passwordHint')}</p>}
      </div>
      
      {error && <p className="text-sm text-red-400 text-center">{error}</p>}

      <button type="submit" disabled={isProcessing} className={`w-full py-3 rounded-lg ${theme.buttonPrimary} text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50`}>
        {isProcessing ? '...' : (mode === 'login' ? t('auth.loginButton') : t('auth.signupButton'))}
      </button>
      
      <button type="button" onClick={toggleMode} className={`w-full text-center text-sm underline ${theme.textSecondary} hover:${theme.textPrimary}`}>
        {mode === 'login' ? t('auth.switchToSignup') : t('auth.switchToLogin')}
      </button>
    </form>
  );
  
  const renderReset = () => (
    <form onSubmit={handleResetSubmit} className="p-6 space-y-4">
        <p className={`${theme.textSecondary} text-center`}>{t('auth.resetPasswordBody')}</p>
        <div>
            <label htmlFor="email-reset" className={`block mb-2 text-sm font-medium ${theme.textSecondary}`}>{t('auth.emailLabel')}</label>
            <input type="email" id="email-reset" value={email} onChange={(e) => setEmail(e.target.value)} required className={`w-full p-3 ${theme.inputBg} ${theme.textPrimary} border ${theme.borderColor} rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-colors`} />
        </div>
        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
        {successMessage && <p className="text-sm text-green-400 text-center">{successMessage}</p>}
        
        <button type="submit" disabled={isProcessing} className={`w-full py-3 rounded-lg ${theme.buttonPrimary} text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50`}>
             {isProcessing ? '...' : t('auth.sendResetLink')}
        </button>
        <button type="button" onClick={() => { clearMessages(); setMode('login'); }} className={`w-full text-center text-sm underline ${theme.textSecondary} hover:${theme.textPrimary}`}>
            {t('auth.backToLogin')}
        </button>
    </form>
  );

  const renderSuccess = () => (
    <div className="p-6 text-center space-y-4">
        <h3 className={`text-xl font-bold ${theme.textPrimary}`}>{t('auth.verify.signupSuccessTitle')}</h3>
        <p className={`${theme.textSecondary}`}>{t('auth.verify.signupSuccessBody', { email })}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className={`${theme.panelBg} rounded-2xl shadow-xl max-w-md w-full border ${theme.borderColor}`}>
        <div className="p-6 text-center">
          <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>
            {mode === 'reset' ? t('auth.resetPasswordTitle') : 
             mode === 'signupSuccess' ? '' : t('auth.title')}
          </h2>
        </div>
        
        {
          mode === 'signupSuccess' ? renderSuccess() :
          mode === 'reset' ? renderReset() : 
          renderLoginSignup()
        }
        
        <div className={`p-4 ${theme.inputBg} bg-opacity-50 rounded-b-2xl flex justify-end`}>
          <button onClick={handleClose} className={`px-4 py-2 rounded-lg ${theme.buttonSecondary} ${theme.textPrimary} font-semibold transition-colors`}>{t('auth.close')}</button>
        </div>
      </div>
    </div>
  );
};