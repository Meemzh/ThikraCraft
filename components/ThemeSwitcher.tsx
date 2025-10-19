import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeName } from '../theme';

const StandardIcon = () => <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#1d2b64] via-[#41295a] to-[#f857a6]" />;
const LightIcon = () => <div className="w-5 h-5 rounded-full bg-gray-200 border border-gray-400" />;
const DarkIcon = () => <div className="w-5 h-5 rounded-full bg-gray-800 border border-gray-600" />;

const icons: Record<ThemeName, React.ReactNode> = {
  standard: <StandardIcon />,
  light: <LightIcon />,
  dark: <DarkIcon />,
};

export const ThemeSwitcher: React.FC = () => {
  const { setThemeName, themeName } = useTheme();

  return (
    <div className="flex space-x-1 p-1 bg-black bg-opacity-20 rounded-full border border-white border-opacity-10 z-10">
      {(['standard', 'light', 'dark'] as ThemeName[]).map(name => (
        <button
          key={name}
          onClick={() => setThemeName(name)}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-300 ${
            themeName === name ? 'bg-white bg-opacity-30' : 'hover:bg-white hover:bg-opacity-10'
          }`}
          aria-label={`Switch to ${name} theme`}
        >
          {icons[name]}
        </button>
      ))}
    </div>
  );
};