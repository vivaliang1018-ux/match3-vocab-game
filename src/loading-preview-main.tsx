import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LoadingSplashPreview } from './components/LoadingSplashPreview';
import './index.css';

const root = document.getElementById('root')!;
root.className = 'h-full';

createRoot(root).render(
  <StrictMode>
    <LoadingSplashPreview />
  </StrictMode>,
);
