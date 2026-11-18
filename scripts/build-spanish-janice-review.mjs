import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const voiceDir = path.join(root, 'public', 'emoji-voice-es');
const batchListPath = path.join(root, 'spanish-missing-words.txt.before-audio-match-1117.bak');
const outputPath = path.join(root, 'public', 'spanish-janice-review-data.json');
const candidateLimit = 40;

const words = fs
  .readFileSync(batchListPath, 'utf8')
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const filesByName = new Map(
  fs
    .readdirSync(voiceDir)
    .filter((name) => name.endsWith('.mp3'))
    .map((name) => [name.replace(/\.mp3$/i, '').normalize('NFC'), name]),
);

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

function inspectAudio(word, audioFile) {
  const filePath = path.join(voiceDir, audioFile);
  const duration = Number(
    execFileSync(
      'ffprobe',
      ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', filePath],
      { encoding: 'utf8' },
    ).trim(),
  );

  const silenceResult = spawnSync(
    'ffmpeg',
    [
      '-hide_banner',
      '-i',
      filePath,
      '-af',
      'silencedetect=noise=-38dB:d=0.12',
      '-f',
      'null',
      '-',
    ],
    { encoding: 'utf8', stdio: ['ignore', 'ignore', 'pipe'] },
  );
  const stderr = silenceResult.stderr?.toString() ?? '';

  const intervals = [];
  let pendingStart = null;
  for (const line of stderr.split(/\r?\n/)) {
    const startMatch = line.match(/silence_start:\s*([0-9.]+)/);
    if (startMatch) pendingStart = Number(startMatch[1]);
    const endMatch = line.match(/silence_end:\s*([0-9.]+)/);
    if (endMatch && pendingStart !== null) {
      const end = Number(endMatch[1]);
      intervals.push({ start: pendingStart, end, duration: end - pendingStart });
      pendingStart = null;
    }
  }

  const leading = intervals.find((item) => item.start <= 0.03)?.duration ?? 0;
  const trailing =
    [...intervals].reverse().find((item) => Math.abs(item.end - duration) <= 0.06)?.duration ?? 0;
  const internal = intervals.filter(
    (item) => item.start > 0.03 && Math.abs(item.end - duration) > 0.06,
  );

  return {
    word,
    audioFile,
    duration,
    wordCount: word.split(/\s+/).length,
    leadingSilence: leading,
    trailingSilence: trailing,
    internalPauseCount: internal.length,
    maxInternalPause: internal.length ? Math.max(...internal.map((item) => item.duration)) : 0,
  };
}

const inspected = [];
const missingFiles = [];
for (const word of words) {
  const audioFile = filesByName.get(word.normalize('NFC'));
  if (!audioFile) {
    missingFiles.push(word);
    continue;
  }
  inspected.push(inspectAudio(word, audioFile));
}

const durationsByWordCount = new Map();
for (const item of inspected) {
  const values = durationsByWordCount.get(item.wordCount) ?? [];
  values.push(item.duration);
  durationsByWordCount.set(item.wordCount, values);
}

for (const item of inspected) {
  item.peerMedian = median(durationsByWordCount.get(item.wordCount) ?? []);
  item.excessDuration = item.duration - item.peerMedian;
  const durationRatio = item.peerMedian ? item.duration / item.peerMedian : 1;
  item.score =
    Math.max(0, item.excessDuration) * 2.2 +
    Math.max(0, durationRatio - 1) * 0.8 +
    item.maxInternalPause * 1.1 +
    item.internalPauseCount * 0.08 +
    (item.leadingSilence > 0.8 ? 0.35 : 0) +
    (item.trailingSilence > 0.8 ? 0.35 : 0);
}

const ranked = inspected.sort((a, b) => b.score - a.score);
const formatItem = (item, index) => ({
    rank: index + 1,
    ...item,
    duration: Number(item.duration.toFixed(3)),
    peerMedian: Number(item.peerMedian.toFixed(3)),
    excessDuration: Number(item.excessDuration.toFixed(3)),
    leadingSilence: Number(item.leadingSilence.toFixed(3)),
    trailingSilence: Number(item.trailingSilence.toFixed(3)),
    maxInternalPause: Number(item.maxInternalPause.toFixed(3)),
    score: Number(item.score.toFixed(3)),
  });
const candidates = ranked.slice(0, candidateLimit).map(formatItem);
const remaining = ranked
  .slice(candidateLimit)
  .map((item, index) => formatItem(item, index + candidateLimit));

fs.writeFileSync(
  outputPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      sourceBatchSize: words.length,
      inspectedFiles: inspected.length,
      missingFiles,
      candidateLimit,
      candidates,
      remaining,
    },
    null,
    2,
  )}\n`,
);

console.log(`Inspected ${inspected.length}/${words.length} files.`);
console.log(`Wrote ${candidates.length} candidates to ${path.relative(root, outputPath)}.`);
console.log(`Included ${remaining.length} remaining files for full manual review.`);
if (missingFiles.length) console.log(`Missing files: ${missingFiles.join(' · ')}`);
