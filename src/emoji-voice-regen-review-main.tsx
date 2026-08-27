import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EmojiVoiceRegenReviewPage } from './components/EmojiVoiceRegenReviewPage';
import './emoji-voice-review.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EmojiVoiceRegenReviewPage />
  </StrictMode>,
);
