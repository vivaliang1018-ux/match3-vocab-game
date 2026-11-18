import fs from 'node:fs';
import path from 'node:path';
import { EMOJI_NOUN_CATEGORIES } from '../src/data/emojiNouns.ts';
import { getEmojiLearningTranslation } from '../src/data/emojiLocalizedNames.ts';
import type { Locale } from '../src/i18n/types.ts';

function argument(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.slice(2).find((value) => value.startsWith(prefix))?.slice(prefix.length);
}

const locale = argument('locale') as Locale | undefined;
const output = argument('output');
if (!locale || !output) {
  throw new Error('Usage: tsx scripts/export-course-audio-manifest.ts --locale=es --output=<file>');
}

const items = EMOJI_NOUN_CATEGORIES.flatMap((category) => category.items);
const words = items.map((item) => {
  if (locale === 'en') return item.word;
  const translated = getEmojiLearningTranslation(item, locale);
  if (!translated) throw new Error(`Missing ${locale} learning name for ${item.emoji} (${item.word})`);
  return translated;
});

const normalized = new Map<string, string>();
for (const word of words) {
  const clean = word.normalize('NFC').trim();
  const key = clean.toLocaleLowerCase(locale);
  const existing = normalized.get(key);
  if (existing) throw new Error(`Duplicate normalized learning name: ${existing} / ${clean}`);
  normalized.set(key, clean);
}

const destination = path.resolve(output);
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination, `${[...normalized.values()].join('\n')}\n`, 'utf8');
console.log(JSON.stringify({ locale, count: normalized.size, output: destination }, null, 2));
