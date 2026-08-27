import fs from 'node:fs';
import path from 'node:path';
import type { Plugin } from 'vite';
import {
  approveRegeneratedVoice,
  generateEmojiVoiceMp3,
  mp3FilenameForWord,
  type WrongVoiceItem,
} from './lib/geminiEmojiVoice.ts';
import { APPROVED_EMOJI_VOICE_STYLE } from './lib/emojiVoiceStyles.ts';

const ROOT = process.cwd();
const REGEN_DIR = path.join(ROOT, 'public/emoji-voice-regen');
const VOICE_DIR = path.join(ROOT, 'public/emoji-voice');
const MANIFEST_FILE = path.join(REGEN_DIR, 'manifest.json');
const REVIEW_STATUS_FILE = path.join(ROOT, 'outputs/emoji-voice-regen/review-status.json');

function readJsonBody(req: import('node:http').IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res: import('node:http').ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function updateManifest(id: string, word: string, status: 'generated' | 'error', error?: string) {
  const manifest = fs.existsSync(MANIFEST_FILE)
    ? (JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8')) as Record<string, unknown>)
    : {};
  manifest[id] = {
    id,
    word,
    status,
    style: APPROVED_EMOJI_VOICE_STYLE,
    updatedAt: new Date().toISOString(),
    ...(error ? { error } : {}),
  };
  fs.mkdirSync(REGEN_DIR, { recursive: true });
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
}

export function emojiVoiceRegenApiPlugin(): Plugin {
  return {
    name: 'emoji-voice-regen-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/emoji-voice-regen/')) return next();

        try {
          if (req.method === 'POST' && req.url === '/api/emoji-voice-regen/generate') {
            const body = (await readJsonBody(req)) as WrongVoiceItem;
            if (!body?.word || !body?.id) {
              sendJson(res, 400, { error: 'Missing id/word' });
              return;
            }
            const mp3Path = path.join(REGEN_DIR, mp3FilenameForWord(body.word));
            await generateEmojiVoiceMp3(body.word, mp3Path, {
              style: APPROVED_EMOJI_VOICE_STYLE,
              context: {
                emoji: body.emoji,
                cn: body.cn,
                category: body.category,
              },
            });
            updateManifest(body.id, body.word, 'generated');
            sendJson(res, 200, {
              ok: true,
              url: `./emoji-voice-regen/${encodeURIComponent(body.word)}.mp3?t=${Date.now()}`,
            });
            return;
          }

          if (req.method === 'POST' && req.url === '/api/emoji-voice-regen/approve') {
            const body = (await readJsonBody(req)) as { word?: string };
            if (!body?.word) {
              sendJson(res, 400, { error: 'Missing word' });
              return;
            }
            approveRegeneratedVoice(body.word, REGEN_DIR, VOICE_DIR);
            sendJson(res, 200, { ok: true });
            return;
          }

          if (req.method === 'GET' && req.url === '/api/emoji-voice-regen/review-status') {
            const statuses = fs.existsSync(REVIEW_STATUS_FILE)
              ? JSON.parse(fs.readFileSync(REVIEW_STATUS_FILE, 'utf8'))
              : {};
            sendJson(res, 200, { statuses });
            return;
          }

          if (req.method === 'POST' && req.url === '/api/emoji-voice-regen/review-status') {
            const body = (await readJsonBody(req)) as { statuses?: Record<string, string> };
            if (!body?.statuses || typeof body.statuses !== 'object') {
              sendJson(res, 400, { error: 'Missing statuses' });
              return;
            }
            const serialized = JSON.stringify(body.statuses, null, 2);
            const existing = fs.existsSync(REVIEW_STATUS_FILE)
              ? fs.readFileSync(REVIEW_STATUS_FILE, 'utf8')
              : '';
            if (serialized !== existing) {
              fs.mkdirSync(path.dirname(REVIEW_STATUS_FILE), { recursive: true });
              fs.writeFileSync(REVIEW_STATUS_FILE, serialized);
            }
            sendJson(res, 200, { ok: true });
            return;
          }

          sendJson(res, 404, { error: 'Not found' });
        } catch (error) {
          sendJson(res, 500, {
            error: error instanceof Error ? error.message : String(error),
          });
        }
      });
    },
  };
}
