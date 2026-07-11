import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './auth/AuthProvider.tsx';
import { LocaleProvider } from './i18n/index.tsx';
import { initCapacitor } from './lib/capacitorInit.ts';
import './index.css';

void initCapacitor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LocaleProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </LocaleProvider>
  </StrictMode>,
);
