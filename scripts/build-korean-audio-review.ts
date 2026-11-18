import fs from 'node:fs';
import path from 'node:path';
import { EMOJI_NOUN_CATEGORIES } from '../src/data/emojiNouns';
import { getEmojiLearningTranslation } from '../src/data/emojiLocalizedNames';

type OutlierReport = { candidates: Array<{ name: string; reasons: string[] }> };
type RepetitionReport = { candidates: Array<{ name: string }> };

const root = path.resolve(import.meta.dirname, '..');
const work = path.join(root, 'audio-work/ko');
const outliers = JSON.parse(fs.readFileSync(path.join(work, 'full-outliers.json'), 'utf8')) as OutlierReport;
const repetitions = JSON.parse(fs.readFileSync(path.join(work, 'full-repetitions.json'), 'utf8')) as RepetitionReport;
const outlierByFile = new Map(outliers.candidates.map((row) => [row.name.normalize('NFC'), row.reasons]));
const repetitionFiles = new Set(repetitions.candidates.map((row) => row.name.normalize('NFC')));

const rows = EMOJI_NOUN_CATEGORIES.flatMap((category) => category.items.map((item) => {
  const korean = getEmojiLearningTranslation(item, 'ko');
  if (!korean) throw new Error(`Missing Korean learning name: ${item.emoji}`);
  const filename = `${korean === '녹음/녹화 버튼' ? '녹음녹화 버튼' : korean}.mp3`;
  if (!fs.existsSync(path.join(root, 'public/emoji-voice-ko', filename))) {
    throw new Error(`Missing Korean audio: ${filename}`);
  }
  const flags = [...(outlierByFile.get(filename.normalize('NFC')) ?? [])];
  if (repetitionFiles.has(filename.normalize('NFC'))) flags.push('possible-repetition');
  return {
    emoji: item.emoji,
    korean,
    english: item.word,
    filename,
    flags,
  };
}));

if (rows.length !== 1117 || new Set(rows.map((row) => row.korean.normalize('NFC'))).size !== 1117) {
  throw new Error(`Unexpected Korean review count: ${rows.length}`);
}

const output = path.join(root, 'public/qa/ko-full-review-data.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  total: rows.length,
  priorityCount: rows.filter((row) => row.flags.length > 0).length,
  rows,
}, null, 2)}\n`);
console.log(`${rows.length} review rows; ${rows.filter((row) => row.flags.length > 0).length} priority candidates`);
