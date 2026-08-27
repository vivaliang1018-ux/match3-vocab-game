import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CLDR_ROOT = path.resolve(
  process.argv[2] ?? path.join(ROOT, 'outputs', 'emoji-translation-review', 'source'),
);
const DATA_FILE = path.join(ROOT, 'src', 'data', 'emojiNouns.ts');
const OUTPUT_FILE = path.join(ROOT, 'src', 'data', 'emojiLocalizedNames.ts');
const LOCALES = ['es', 'fr', 'de', 'ja', 'ko'];

function normalizeEmoji(value) {
  return value.replace(/\uFE0F/g, '');
}

function readRuntimeItems() {
  const source = fs.readFileSync(DATA_FILE, 'utf8');
  const start = source.indexOf('= [') + 2;
  const end = source.lastIndexOf(' as const;');
  const categories = JSON.parse(source.slice(start, end));
  return categories.flatMap((category) => category.items);
}

function readCldrNames(locale) {
  const annotationsPath = path.join(
    CLDR_ROOT,
    'annotations',
    'package',
    'annotations',
    locale,
    'annotations.json',
  );
  const derivedPath = path.join(
    CLDR_ROOT,
    'derived',
    'package',
    'annotationsDerived',
    locale,
    'annotations.json',
  );
  const annotations = JSON.parse(fs.readFileSync(annotationsPath, 'utf8')).annotations.annotations;
  const derived = JSON.parse(fs.readFileSync(derivedPath, 'utf8')).annotationsDerived.annotations;
  const names = new Map();

  for (const [emoji, value] of Object.entries(annotations)) {
    if (value.tts?.[0]) names.set(normalizeEmoji(emoji), value.tts[0]);
  }
  for (const [emoji, value] of Object.entries(derived)) {
    const key = normalizeEmoji(emoji);
    if (value.tts?.[0] && !names.has(key)) names.set(key, value.tts[0]);
  }
  return names;
}

const items = readRuntimeItems();
const localeNames = Object.fromEntries(LOCALES.map((locale) => [locale, readCldrNames(locale)]));
const localizedNames = {};
const missing = [];

for (const item of items) {
  const key = normalizeEmoji(item.emoji);
  const translations = {};
  for (const locale of LOCALES) {
    const name = localeNames[locale].get(key);
    if (!name) missing.push(`${item.emoji} ${item.word}: ${locale}`);
    else translations[locale] = name;
  }
  localizedNames[item.emoji] = translations;
}

if (missing.length > 0) {
  throw new Error(`Missing ${missing.length} CLDR translations:\n${missing.join('\n')}`);
}
if (Object.keys(localizedNames).length !== items.length) {
  throw new Error(
    `Expected ${items.length} unique Emoji translation entries, got ${Object.keys(localizedNames).length}`,
  );
}

const code = `import type { Locale } from '../i18n/types';

export type EmojiTranslationLocale = 'es' | 'fr' | 'de' | 'ja' | 'ko';

export type EmojiLocalizedNames = Record<EmojiTranslationLocale, string>;

/** Unicode CLDR 48.2.0 short names for the 1,117 Emoji in the learning dataset. */
export const EMOJI_LOCALIZED_NAMES: Record<string, EmojiLocalizedNames> = ${JSON.stringify(localizedNames, null, 2)};

export function getEmojiLearningTranslation(
  item: { emoji?: string; cn?: string },
  locale: Locale,
): string | null {
  if (locale === 'en') return null;
  if (locale === 'zh-CN') return item.cn?.trim() || null;
  if (!item.emoji) return null;
  return EMOJI_LOCALIZED_NAMES[item.emoji]?.[locale] ?? null;
}
`;

fs.writeFileSync(OUTPUT_FILE, code, 'utf8');
console.log(`Generated ${items.length} Emoji translations -> ${path.relative(ROOT, OUTPUT_FILE)}`);
