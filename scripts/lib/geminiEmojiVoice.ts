import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, Modality } from '@google/genai';
import { EMOJI_VOICE_MASTER_FILTER } from './emojiVoiceMastering.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const FRIENDS_ENV = path.resolve(
  ROOT,
  '../friends-script-voice-generator (2)/.env.local',
);

export type WrongVoiceItem = {
  id: string;
  emoji: string;
  word: string;
  cn: string;
  category: string;
};

type VoiceName = 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';

import {
  resolveEmojiVoiceStyle,
  type EmojiVoiceStyleId,
} from './emojiVoiceStyles.ts';

export type EmojiVoicePromptContext = {
  emoji?: string;
  cn?: string;
  category?: string;
};

export type { EmojiVoiceStyleId };

function parseEnvFile(filePath: string): string[] {
  if (!fs.existsSync(filePath)) return [];
  const keys: string[] = [];
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const match = trimmed.match(/^#?\s*GEMINI_API_KEY=(.+)$/);
    if (match?.[1]) keys.push(match[1].trim());
  }
  return keys;
}

function loadApiKeys(): string[] {
  const fromEnv = [
    process.env.GEMINI_API_KEY?.trim(),
    ...(process.env.GEMINI_API_KEYS?.split(',') ?? []).map((k) => k.trim()),
  ].filter(Boolean) as string[];
  const fromFriends = parseEnvFile(FRIENDS_ENV);
  return [...new Set([...fromEnv, ...fromFriends])];
}

function decodeBase64(base64: string): Uint8Array {
  return Uint8Array.from(Buffer.from(base64, 'base64'));
}

function writeWav(pcmData: Int16Array, outPath: string, sampleRate = 24000): void {
  const buffer = Buffer.alloc(44 + pcmData.length * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + pcmData.length * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(pcmData.length * 2, 40);
  for (let i = 0; i < pcmData.length; i++) {
    buffer.writeInt16LE(pcmData[i], 44 + i * 2);
  }
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buffer);
}

function wavToMp3(wavPath: string, mp3Path: string): void {
  const tmpPath = `${mp3Path}.tmp.mp3`;
  const result = spawnSync(
    'ffmpeg',
    [
      '-y',
      '-i',
      wavPath,
      '-af',
      EMOJI_VOICE_MASTER_FILTER,
      '-ar',
      '24000',
      '-ac',
      '1',
      '-b:a',
      '128k',
      tmpPath,
    ],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr || 'ffmpeg failed');
  }
  fs.renameSync(tmpPath, mp3Path);
}

function shouldTryNextKey(error: unknown): boolean {
  const msg = String(
    error instanceof Error ? error.message : JSON.stringify(error),
  ).toLowerCase();
  return /429|quota|rate limit|resource_exhausted|permission|api.key|unauthorized|503|502|408/.test(
    msg,
  );
}

function buildPrompt(word: string, context?: EmojiVoicePromptContext, styleId?: EmojiVoiceStyleId): string {
  const style = resolveEmojiVoiceStyle(styleId);
  return style.buildPrompt(word, context);
}

export async function generateEmojiVoiceMp3(
  word: string,
  mp3Path: string,
  options?: {
    voice?: VoiceName;
    context?: EmojiVoicePromptContext;
    style?: EmojiVoiceStyleId;
  },
): Promise<void> {
  const style = resolveEmojiVoiceStyle(options?.style);
  const voice = options?.voice ?? style.voice;
  const keys = loadApiKeys();
  if (keys.length === 0) {
    throw new Error('No GEMINI_API_KEY configured');
  }

  const wavPath = mp3Path.replace(/\.mp3$/i, '.wav');
  const prompt = buildPrompt(word, options?.context, options?.style);
  let lastError: unknown;

  for (let ki = 0; ki < keys.length; ki++) {
    const ai = new GoogleGenAI({ apiKey: keys[ki] });
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) throw new Error('No audio data returned from Gemini');

      const audioBytes = decodeBase64(base64Audio);
      const pcmData = new Int16Array(
        audioBytes.buffer,
        audioBytes.byteOffset,
        audioBytes.byteLength / 2,
      );
      writeWav(pcmData, wavPath);
      wavToMp3(wavPath, mp3Path);
      fs.unlinkSync(wavPath);
      return;
    } catch (error) {
      lastError = error;
      if (shouldTryNextKey(error) && ki < keys.length - 1) continue;
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Gemini TTS failed');
}

export function mp3FilenameForWord(word: string): string {
  return `${word}.mp3`;
}

export function archiveExistingVoice(word: string, voiceDir: string): void {
  const target = path.join(voiceDir, mp3FilenameForWord(word));
  if (!fs.existsSync(target)) return;
  const archiveDir = path.join(voiceDir, '_archived');
  fs.mkdirSync(archiveDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  fs.renameSync(target, path.join(archiveDir, `${stamp}-${path.basename(target)}`));
}

export function approveRegeneratedVoice(word: string, regenDir: string, voiceDir: string): void {
  const src = path.join(regenDir, mp3FilenameForWord(word));
  const dst = path.join(voiceDir, mp3FilenameForWord(word));
  if (!fs.existsSync(src)) throw new Error(`Missing regenerated file for "${word}"`);
  archiveExistingVoice(word, voiceDir);
  fs.mkdirSync(voiceDir, { recursive: true });
  fs.copyFileSync(src, dst);
}
