import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

function argument(name, fallback = '') {
  const prefix = `--${name}=`;
  return process.argv.slice(2).find((value) => value.startsWith(prefix))?.slice(prefix.length) ?? fallback;
}

function durationFromLog(log) {
  const match = log.match(/Duration:\s*(\d+):(\d+):([0-9.]+)/);
  if (!match) return 0;
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]);
}

function inspect(file) {
  const result = spawnSync(
    'ffmpeg',
    ['-hide_banner', '-nostats', '-i', file, '-af', 'silencedetect=noise=-38dB:d=0.18', '-f', 'null', '-'],
    { encoding: 'utf8' },
  );
  const log = `${result.stdout}\n${result.stderr}`;
  const duration = durationFromLog(log);
  const events = [...log.matchAll(/silence_(start|end):\s*([0-9.]+)/g)].map((match) => ({
    type: match[1],
    time: Number(match[2]),
  }));
  const silences = [];
  let start = null;
  for (const event of events) {
    if (event.type === 'start') start = event.time;
    if (event.type === 'end' && start !== null) {
      silences.push({ start, end: event.time, duration: event.time - start });
      start = null;
    }
  }
  if (start !== null && duration > start) silences.push({ start, end: duration, duration: duration - start });

  const repeatedBlocks = [];
  for (let index = 0; index < silences.length; index += 1) {
    const gap = silences[index];
    if (gap.start <= 0.08 || gap.end >= duration - 0.08 || gap.duration < 0.22) continue;
    const leftStart = index > 0 ? silences[index - 1].end : 0;
    const rightEnd = index + 1 < silences.length ? silences[index + 1].start : duration;
    const leftDuration = Math.max(0, gap.start - leftStart);
    const rightDuration = Math.max(0, rightEnd - gap.end);
    const similarity = Math.min(leftDuration, rightDuration) / Math.max(leftDuration, rightDuration, 0.001);
    if (leftDuration >= 0.12 && rightDuration >= 0.12 && similarity >= 0.68) {
      repeatedBlocks.push({
        gapStart: gap.start,
        gapEnd: gap.end,
        gapDuration: gap.duration,
        leftDuration,
        rightDuration,
        durationSimilarity: similarity,
      });
    }
  }
  return { duration, silences, repeatedBlocks };
}

const source = path.resolve(argument('source'));
const output = argument('output');
const files = fs.readdirSync(source)
  .filter((name) => name.toLowerCase().endsWith('.mp3'))
  .sort((a, b) => a.localeCompare(b, 'ja'));

const candidates = [];
for (const name of files) {
  const result = inspect(path.join(source, name));
  if (result.repeatedBlocks.length) {
    candidates.push({ name, text: name.slice(0, -4).normalize('NFC'), ...result });
  }
}

const report = { count: files.length, candidateCount: candidates.length, candidates };
const json = `${JSON.stringify(report, null, 2)}\n`;
if (output) fs.writeFileSync(path.resolve(output), json);
process.stdout.write(json);
