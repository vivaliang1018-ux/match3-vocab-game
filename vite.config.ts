import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { emojiVoiceRegenApiPlugin } from './scripts/vite-emoji-voice-regen-api.js';

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), emojiVoiceRegenApiPlugin()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    watch: {
      // TTS batch + review sync write here; ignore to stop full-page reload loops.
      ignored: [
        '**/public/emoji-voice-regen/**',
        '**/outputs/emoji-voice-regen/**',
      ],
    },
  },
});
