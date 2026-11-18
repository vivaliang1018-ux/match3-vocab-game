import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function argument(name, fallback = '') {
  const prefix = `--${name}=`;
  return process.argv.slice(2).find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

function percentile(values, fraction) {
  if (values.length === 0) return 0;
  const index = (values.length - 1) * fraction;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return values[lower];
  return values[lower] + (values[upper] - values[lower]) * (index - lower);
}

function probeDuration(file) {
  const result = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) throw new Error(result.stderr || `ffprobe failed: ${file}`);
  return Number(result.stdout.trim());
}

function probeSilence(file, duration) {
  const result = spawnSync(
    'ffmpeg',
    ['-hide_banner', '-nostats', '-i', file, '-af', 'silencedetect=noise=-38dB:d=0.12', '-f', 'null', '-'],
    { encoding: 'utf8' },
  );
  const log = `${result.stdout}\n${result.stderr}`;
  const starts = [...log.matchAll(/silence_start:\s*([0-9.]+)/g)].map((match) => Number(match[1]));
  const ends = [...log.matchAll(/silence_end:\s*([0-9.]+)/g)].map((match) => Number(match[1]));
  let leadingSilence = 0;
  let trailingSilence = 0;
  if (starts[0] <= 0.03 && Number.isFinite(ends[0])) leadingSilence = ends[0];
  if (starts.length > ends.length) trailingSilence = Math.max(0, duration - starts.at(-1));
  else if (starts.length && ends.length && Math.abs(ends.at(-1) - duration) <= 0.08) {
    trailingSilence = Math.max(0, duration - starts.at(-1));
  }
  return { leadingSilence, trailingSilence };
}

const source = path.resolve(argument('source'));
const output = argument('output');
if (!fs.existsSync(source)) throw new Error(`Source not found: ${source}`);

const files = fs.readdirSync(source)
  .filter((name) => name.toLowerCase().endsWith('.mp3'))
  .sort((a, b) => a.localeCompare(b, 'ja'));
const rows = files.map((name) => {
  const file = path.join(source, name);
  const duration = probeDuration(file);
  const text = name.slice(0, -4).normalize('NFC');
  return { name, text, duration, secondsPerCharacter: duration / Math.max(1, [...text].length) };
});

const durations = rows.map((row) => row.duration).sort((a, b) => a - b);
const ratios = rows.map((row) => row.secondsPerCharacter).sort((a, b) => a - b);
const durationQ1 = percentile(durations, 0.25);
const durationQ3 = percentile(durations, 0.75);
const durationUpper = durationQ3 + 1.5 * (durationQ3 - durationQ1);
const ratioQ1 = percentile(ratios, 0.25);
const ratioQ3 = percentile(ratios, 0.75);
const ratioUpper = ratioQ3 + 2 * (ratioQ3 - ratioQ1);

const durationCandidates = rows.filter((row) =>
  row.duration < 0.32 ||
  row.duration > Math.max(4.5, durationUpper) ||
  row.secondsPerCharacter > Math.max(1.1, ratioUpper),
);

const candidates = durationCandidates.map((row) => {
  const silence = probeSilence(path.join(source, row.name), row.duration);
  const reasons = [];
  if (row.duration < 0.32) reasons.push('very-short');
  if (row.duration > Math.max(4.5, durationUpper)) reasons.push('long-duration');
  if (row.secondsPerCharacter > Math.max(1.1, ratioUpper)) reasons.push('slow-for-text-length');
  if (silence.leadingSilence > 0.25) reasons.push('leading-silence');
  if (silence.trailingSilence > 0.25) reasons.push('trailing-silence');
  return { ...row, ...silence, reasons };
});

const report = {
  count: rows.length,
  stats: {
    minimum: durations[0] ?? 0,
    median: percentile(durations, 0.5),
    p95: percentile(durations, 0.95),
    maximum: durations.at(-1) ?? 0,
    durationUpper,
    ratioUpper,
  },
  candidateCount: candidates.length,
  candidates,
};

const json = `${JSON.stringify(report, null, 2)}\n`;
if (output) fs.writeFileSync(path.resolve(output), json);
process.stdout.write(json);
