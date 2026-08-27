import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WRONG_FILE = path.join(ROOT, 'outputs/emoji-voice-regen/wrong.json');
const STATUS_FILE = path.join(ROOT, 'outputs/emoji-voice-regen/review-status.json');
const OUT_SCRIPT = path.join(ROOT, 'outputs/emoji-voice-regen/friends-rachel-script.json');
const OUT_QUEUE = path.join(ROOT, 'outputs/emoji-voice-regen/rachel-queue.json');

const wrong = JSON.parse(fs.readFileSync(WRONG_FILE, 'utf8'));
const statuses = fs.existsSync(STATUS_FILE)
  ? JSON.parse(fs.readFileSync(STATUS_FILE, 'utf8'))
  : {};

const keepOldIds = new Set(
  Object.entries(statuses)
    .filter(([, status]) => status === 'keep-old')
    .map(([id]) => id),
);

const queue = [];
const scriptLines = [];

for (let i = 0; i < wrong.length; i++) {
  const item = wrong[i];
  scriptLines.push({ character: 'Rachel', text: item.word });
  if (keepOldIds.has(item.id)) continue;
  queue.push({ ...item, line: i + 1 });
}

fs.writeFileSync(OUT_SCRIPT, JSON.stringify(scriptLines, null, 2));
fs.writeFileSync(
  OUT_QUEUE,
  JSON.stringify(
    {
      character: 'Rachel',
      generatedAt: new Date().toISOString(),
      keepOldCount: keepOldIds.size,
      keepOldIds: [...keepOldIds],
      totalWrong: wrong.length,
      toGenerate: queue.length,
      items: queue,
    },
    null,
    2,
  ),
);

console.log(`wrong.json: ${wrong.length}`);
console.log(`keep-old (skipped): ${keepOldIds.size}`);
console.log(`queue to generate: ${queue.length}`);
console.log(`Wrote ${OUT_SCRIPT}`);
console.log(`Wrote ${OUT_QUEUE}`);
