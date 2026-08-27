import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EMOJI_VOICE_MASTER_FILTER } from './lib/emojiVoiceMastering.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const voiceDir = path.join(root, 'public/emoji-voice');

const ffmpegCheck = spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' });
if (ffmpegCheck.status !== 0) {
  throw new Error('ffmpeg is required to normalize vocabulary recordings');
}
const files = fs.readdirSync(voiceDir).filter((file) => file.endsWith('.mp3')).sort();
let completed = 0;

for (const file of files) {
  const sourcePath = path.join(voiceDir, file);
  const temporaryPath = path.join(voiceDir, `.${file}.${process.pid}.normalizing.mp3`);

  try {
    const result = spawnSync(
      'ffmpeg',
      [
        '-hide_banner',
        '-loglevel',
        'error',
        '-y',
        '-i',
        sourcePath,
        '-af',
        EMOJI_VOICE_MASTER_FILTER,
        '-ar',
        '24000',
        '-ac',
        '1',
        '-b:a',
        '128k',
        temporaryPath,
      ],
      { encoding: 'utf8' },
    );

    if (result.status !== 0) {
      throw new Error(result.stderr || `ffmpeg failed for ${file}`);
    }

    fs.renameSync(temporaryPath, sourcePath);
    completed += 1;
    if (completed % 100 === 0 || completed === files.length) {
      console.log(`Normalized ${completed}/${files.length}`);
    }
  } catch (error) {
    fs.rmSync(temporaryPath, { force: true });
    throw error;
  }
}
