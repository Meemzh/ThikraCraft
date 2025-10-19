import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { user, updateUsername } = useAuth();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.name);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSave = async () => {
    await updateUsername(username);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" aria-modal="true" role="dialog">
      <div className={`${theme.panelBg} rounded-2xl shadow-xl max-w-md w-full border ${theme.borderColor} transition-all duration-300 ease-in-out`}>
        <div className={`p-6 border-b ${theme.borderColor}`}>
          <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>{t('profile.title')}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="username" className={`block mb-2 text-sm font-medium ${theme.textSecondary}`}>
              {t('profile.usernameLabel')}
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-3 ${theme.inputBg} ${theme.textPrimary} border ${theme.borderColor} rounded-lg focus:ring-pink-500 focus:border-pink-500 transition-colors`}
            />
          </div>
        </div>
        <div className={`p-4 ${theme.inputBg} bg-opacity-50 rounded-b-2xl flex justify-end space-x-4`}>
          <button onClick={onClose} className={`px-4 py-2 rounded-lg ${theme.buttonSecondary} ${theme.textPrimary} font-semibold transition-colors`}>{t('profile.cancel')}</button>
          <button onClick={handleSave} className={`px-4 py-2 rounded-lg ${theme.buttonPrimary} text-white font-semibold transition-colors`}>{t('profile.save')}</button>
        </div>
      </div>
    </div>
  );
};
