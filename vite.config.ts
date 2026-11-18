import { rm } from 'node:fs/promises';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import { emojiVoiceRegenApiPlugin } from './scripts/vite-emoji-voice-regen-api.js';

// Vite copies public/ wholesale. Keep review tools in the workspace, but never
// include them in the web build or the iOS app copied from that build.
const internalReviewAssets = [
  'qa',
  'emoji-voice-regen',
  'japanese-audio-sample-preview.html',
  'korean-audio-review.html',
  'spanish-janice-review.html',
  'spanish-janice-review-data.json',
  'thiings/README.txt',
] as const;

function omitInternalReviewAssets(): Plugin {
  let outputDirectory = '';

  return {
    name: 'omit-internal-review-assets',
    apply: 'build',
    configResolved(config) {
      outputDirectory = path.resolve(config.root, config.build.outDir);
      if (outputDirectory === config.root) {
        throw new Error('Build output must not be the project root.');
      }
    },
    async closeBundle() {
      for (const asset of internalReviewAssets) {
        await rm(path.join(outputDirectory, asset), { recursive: true, force: true });
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), emojiVoiceRegenApiPlugin(), omitInternalReviewAssets()],
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
