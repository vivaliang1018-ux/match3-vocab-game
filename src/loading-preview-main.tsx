import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LoadingSplashPreview } from './components/LoadingSplashPreview';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LoadingSplashPreview />
  </StrictMode>,
);
