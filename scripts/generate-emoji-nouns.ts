import fs from 'node:fs';
import path from 'node:path';

type Item = {
  id: string;
  emoji: string;
  word: string;
  cn: string;
};

type Category = {
  id: string;
  label: string;
  subtitle: string;
  items: Item[];
};

const DEFAULT_EXTRAS: Record<string, Array<Omit<Item, 'id'>>> = {
  objects: [
    { emoji: '🧾', cn: '收据', word: 'Receipt' },
    { emoji: '🏷️', cn: '优惠券', word: 'Coupon' },
    { emoji: '🧻', cn: '厨房纸；纸巾', word: 'Paper Towel' },
    { emoji: '🫙', cn: '密封袋', word: 'Zip Bag' },
    { emoji: '🧴', cn: '洗涤剂', word: 'Detergent' },
    { emoji: '🧽', cn: '海绵', word: 'Sponges' },
    { emoji: '🪣', cn: '桶', word: 'Bucket' },
    { emoji: '🪥', cn: '牙刷', word: 'Toothbrush' },
    { emoji: '🪒', cn: '剃刀', word: 'Razor' },
    { emoji: '🧷', cn: '别针', word: 'Safety Pin' },
  ],
};

const ROOT = process.cwd();
const SOURCE_FILE = path.join(ROOT, 'src', 'data', 'emoji-nouns.source.txt');
const OUTPUT_FILE = path.join(ROOT, 'src', 'data', 'emojiNouns.ts');

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeLabel(raw: string) {
  return raw.replace(/^#+\s*/, '').replace(/^\d+\.\s*/, '').trim();
}

function parseHeading(line: string): { label: string; subtitle: string; id: string } | null {
  const normalized = normalizeLabel(line);
  const matched = normalized.match(/^(.+?)\s*\((.+)\)\s*$/);
  if (!matched) return null;
  const label = matched[1].trim();
  const subtitle = matched[2].trim();
  return {
    label,
    subtitle,
    id: slugify(subtitle) || slugify(label) || 'category',
  };
}

function parseItem(line: string): Item | null {
  const parts = line
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);

  if (parts.length < 3) return null;
  const [emoji, cn, word] = parts;
  if (!emoji || !cn || !word) return null;

  return {
    id: slugify(word) || slugify(cn) || `item-${Math.random().toString(36).slice(2, 7)}`,
    emoji,
    word,
    cn,
  };
}

function ensureUniqueIds(items: Item[]) {
  const seen = new Map<string, number>();
  return items.map((item) => {
    const count = seen.get(item.id) ?? 0;
    seen.set(item.id, count + 1);
    if (count === 0) return item;
    return { ...item, id: `${item.id}-${count + 1}` };
  });
}

function parseSource(content: string): Category[] {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const categories: Category[] = [];
  let current: Category | null = null;

  for (const line of lines) {
    if (line.startsWith('#')) {
      const heading = parseHeading(line);
      if (!heading) continue;
      current = { id: heading.id, label: heading.label, subtitle: heading.subtitle, items: [] };
      categories.push(current);
      continue;
    }

    if (/^emoji\s*\|/i.test(line) || /^---+$/.test(line)) {
      continue;
    }

    const parsed = parseItem(line);
    if (!parsed) continue;

    if (!current) {
      current = { id: 'misc', label: '未分类', subtitle: 'Misc', items: [] };
      categories.push(current);
    }
    current.items.push(parsed);
  }

  const normalized = categories
    .map((cat) => {
      const uniqueByTriple = new Map<string, Item>();
      for (const item of cat.items) {
        uniqueByTriple.set(`${item.emoji}|${item.cn}|${item.word}`, item);
      }
      return {
        ...cat,
        items: ensureUniqueIds([...uniqueByTriple.values()]),
      };
    })
    .filter((cat) => cat.items.length > 0);

  const byId = new Map(normalized.map((cat) => [cat.id, cat]));
  for (const [categoryId, extras] of Object.entries(DEFAULT_EXTRAS)) {
    const cat = byId.get(categoryId);
    if (!cat) continue;
    const existingKey = new Set(cat.items.map((it) => `${it.emoji}|${it.word}`.toLowerCase()));
    for (const extra of extras) {
      const key = `${extra.emoji}|${extra.word}`.toLowerCase();
      if (existingKey.has(key)) continue;
      cat.items.push({
        id: slugify(extra.word),
        emoji: extra.emoji,
        cn: extra.cn,
        word: extra.word,
      });
      existingKey.add(key);
    }
    cat.items = ensureUniqueIds(cat.items);
  }

  return normalized;
}

function toTypeScript(categories: Category[]) {
  return `export type EmojiNounItem = {
  id: string;
  emoji: string;
  word: string;
  cn: string;
};

export type EmojiNounCategory = {
  id: string;
  label: string;
  subtitle: string;
  items: EmojiNounItem[];
};

export const EMOJI_NOUN_CATEGORIES: EmojiNounCategory[] = ${JSON.stringify(categories, null, 2)} as const;
`;
}

function main() {
  if (!fs.existsSync(SOURCE_FILE)) {
    throw new Error(`Source file not found: ${path.relative(ROOT, SOURCE_FILE)}`);
  }

  const source = fs.readFileSync(SOURCE_FILE, 'utf8');
  const categories = parseSource(source);
  const code = toTypeScript(categories);

  fs.writeFileSync(OUTPUT_FILE, code, 'utf8');
  // eslint-disable-next-line no-console
  console.log(`Generated ${categories.length} categories -> ${path.relative(ROOT, OUTPUT_FILE)}`);
}

main();

