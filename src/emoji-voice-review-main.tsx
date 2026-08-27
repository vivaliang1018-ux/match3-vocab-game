import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { EmojiVoiceReviewPage } from './components/EmojiVoiceReviewPage';
import './emoji-voice-review.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EmojiVoiceReviewPage />
  </StrictMode>,
);
