import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import BootApp from './BootApp.tsx';
import { initCapacitor } from './lib/capacitorInit.ts';
import './index.css';

void initCapacitor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BootApp />
  </StrictMode>,
);
