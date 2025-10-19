import React, { createContext, useState, useContext, useEffect, useMemo } from 'react';
import { themeConfig, ThemeName } from '../theme';

const defaultTheme = themeConfig.standard;

const ThemeContext = createContext({
  theme: defaultTheme,
  setThemeName: (name: ThemeName) => {},
  themeName: 'standard' as ThemeName,
});

// FIX: Change component signature to use React.FC to resolve "missing children" prop error.
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>('standard');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as ThemeName;
    if (savedTheme && themeConfig[savedTheme]) {
      setThemeName(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('app-theme', themeName);
  }, [themeName]);
  
  const theme = useMemo(() => themeConfig[themeName], [themeName]);

  return (
    <ThemeContext.Provider value={{ theme, setThemeName, themeName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);