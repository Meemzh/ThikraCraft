import React, { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-out ${theme.panelBg} ${theme.textPrimary}`}>
      {message}
    </div>
  );
};
