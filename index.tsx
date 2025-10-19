import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CreditsProvider } from './contexts/CreditsContext';
import { MemoriesProvider } from './contexts/MemoriesContext';
import { CommunityProvider } from './contexts/CommunityContext';
import './firebase'; // Import to initialize Firebase

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <CreditsProvider>
            <MemoriesProvider>
              <CommunityProvider>
                <App />
              </CommunityProvider>
            </MemoriesProvider>
          </CreditsProvider>
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  </React.StrictMode>
);
