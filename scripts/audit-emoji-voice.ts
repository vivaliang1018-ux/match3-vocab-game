import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const voiceDir = path.join(root, 'public/emoji-voice');
const nounsPath = path.join(root, 'src/data/emojiNouns.ts');

const text = fs.readFileSync(nounsPath, 'utf8');
const words = [...text.matchAll(/"word":\s*"([^"]*)"/g)].map((m) => m[1]);
const files = new Map(
  fs
    .readdirSync(voiceDir)
    .filter((f) => f.endsWith('.mp3'))
    .map((f) => [f.slice(0, -4), f]),
);

function variantsFor(word: string): Set<string> {
  const w = word.trim();
  const out = new Set<string>();
  const add = (s: string) => {
    const t = s.trim();
    if (t) out.add(t);
  };
  const addVariants = (s: string) => {
    for (const form of [s, s.normalize('NFC'), s.normalize('NFD')]) {
      add(form);
      add(form.replace(/\s+/g, ' '));
      add(form.replace(/\. /g, '.  '));
      add(form.replace(/\.  +/g, '. '));
      add(form.replace(/!\s+/g, '!  '));
      add(form.replace(/!\s{2,}/g, '! '));
      add(form.toLowerCase());
    }
  };
  addVariants(w);
  if (/[:\uFF1A]/.test(w)) {
    addVariants(w.replace(/\uFF1A/g, ':'));
    addVariants(w.replace(/:/g, '\uFF1A'));
    const englishSpacing = w.replace(/[\uFF1A:]/g, ' ').replace(/\s+/g, ' ').trim();
    if (englishSpacing && englishSpacing !== w) addVariants(englishSpacing);
  }
  return out;
}

function resolveFile(word: string): string | null {
  const fileKeysNfc = new Map([...files.keys()].map((k) => [k.normalize('NFC'), k]));
  const fileKeysNfd = new Map([...files.keys()].map((k) => [k.normalize('NFD'), k]));
  for (const v of variantsFor(word)) {
    if (files.has(v)) return files.get(v)!;
    const nfc = v.normalize('NFC');
    if (fileKeysNfc.has(nfc)) return files.get(fileKeysNfc.get(nfc)!)!;
    const nfd = v.normalize('NFD');
    if (fileKeysNfd.has(nfd)) return files.get(fileKeysNfd.get(nfd)!)!;
  }
  return null;
}

const missing = [...new Set(words)].filter((w) => !resolveFile(w)).sort();
const matched = words.length - missing.length;
const usedFiles = new Set(words.map((w) => resolveFile(w)).filter(Boolean));
const orphans = [...files.values()].filter((f) => !usedFiles.has(f)).sort();

console.log(`Words in emojiNouns: ${words.length}`);
console.log(`MP3 files: ${files.size}`);
console.log(`Matched: ${matched}`);
console.log(`Missing voice: ${missing.length}`);
if (missing.length) {
  console.log('\nMissing:');
  for (const w of missing) console.log(`  - ${w}`);
}
console.log(`\nOrphan MP3 (no word uses them): ${orphans.length}`);
if (orphans.length) {
  for (const f of orphans) console.log(`  - ${f}`);
}
