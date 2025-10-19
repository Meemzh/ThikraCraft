import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface LoaderProps {
  messages: string[];
  countdown?: number; // Optional countdown in seconds
}

const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const Loader: React.FC<LoaderProps> = ({ messages, countdown }) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 3000);

    return () => clearInterval(intervalId);
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className={`w-16 h-16 border-4 border-dashed rounded-full animate-spin ${theme.loaderColor}`}></div>
      {countdown !== undefined && (
          <p className={`${theme.textPrimary} text-2xl mt-4 font-bold tracking-wider`}>{formatTime(countdown)}</p>
      )}
      <p className={`${theme.textPrimary} text-lg mt-2 font-semibold transition-opacity duration-500`}>{message}</p>
    </div>
  );
};