import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generateEmojiVoiceMp3,
  mp3FilenameForWord,
  type WrongVoiceItem,
} from './lib/geminiEmojiVoice.ts';
import { APPROVED_EMOJI_VOICE_STYLE } from './lib/emojiVoiceStyles.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WRONG_FILE = path.join(ROOT, 'outputs/emoji-voice-regen/wrong.json');
const REGEN_DIR = path.join(ROOT, 'public/emoji-voice-regen');
const MANIFEST_FILE = path.join(REGEN_DIR, 'manifest.json');

type ManifestEntry = {
  id: string;
  word: string;
  status: 'pending' | 'generated' | 'error';
  style?: string;
  updatedAt?: string;
  error?: string;
};

function loadWrong(): WrongVoiceItem[] {
  return JSON.parse(fs.readFileSync(WRONG_FILE, 'utf8')) as WrongVoiceItem[];
}

function loadManifest(): Record<string, ManifestEntry> {
  if (!fs.existsSync(MANIFEST_FILE)) return {};
  return JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8')) as Record<string, ManifestEntry>;
}

function saveManifest(manifest: Record<string, ManifestEntry>): void {
  fs.mkdirSync(REGEN_DIR, { recursive: true });
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const onlyId = args.find((a) => a.startsWith('--id='))?.slice(5);
  const limit = Number(args.find((a) => a.startsWith('--limit='))?.slice(8) ?? '0');
  const offset = Number(args.find((a) => a.startsWith('--offset='))?.slice(9) ?? '0');
  const styleArg =
    args.find((a) => a.startsWith('--style='))?.slice(8) ?? APPROVED_EMOJI_VOICE_STYLE;
  const force = args.includes('--force');

  let items = loadWrong();
  if (onlyId) items = items.filter((item) => item.id === onlyId);
  if (offset > 0) items = items.slice(offset);
  if (limit > 0) items = items.slice(0, limit);

  const manifest = loadManifest();
  let done = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`Style: ${styleArg}`);

  for (const item of items) {
    const mp3Path = path.join(REGEN_DIR, mp3FilenameForWord(item.word));
    const existing = manifest[item.id];
    const styleMatches = existing?.style === styleArg;
    if (!force && fs.existsSync(mp3Path) && existing?.status === 'generated' && styleMatches) {
      skipped += 1;
      continue;
    }

    process.stdout.write(`[${done + skipped + failed + 1}/${items.length}] ${item.emoji} ${item.word} … `);
    try {
      await generateEmojiVoiceMp3(item.word, mp3Path, {
        style: styleArg as import('./lib/geminiEmojiVoice.ts').EmojiVoiceStyleId,
        context: {
          emoji: item.emoji,
          cn: item.cn,
          category: item.category,
        },
      });
      manifest[item.id] = {
        id: item.id,
        word: item.word,
        status: 'generated',
        style: styleArg,
        updatedAt: new Date().toISOString(),
      };
      saveManifest(manifest);
      done += 1;
      console.log('ok');
      await sleep(1200);
    } catch (error) {
      manifest[item.id] = {
        id: item.id,
        word: item.word,
        status: 'error',
        updatedAt: new Date().toISOString(),
        error: error instanceof Error ? error.message : String(error),
      };
      saveManifest(manifest);
      failed += 1;
      console.log('failed');
      console.error(error);
    }
  }

  fs.copyFileSync(WRONG_FILE, path.join(REGEN_DIR, 'wrong.json'));
  console.log(`\nGenerated: ${done}, skipped: ${skipped}, failed: ${failed}`);
}

void main();
