import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/sfx');

function encodeMonoWav(samples, sampleRate) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(n * 2, 40);
  let o = 44;
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7fff, o);
    o += 2;
  }
  return buf;
}

function synthDeepBoom(sr) {
  const dur = 0.28;
  const n = Math.floor(sr * dur);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = Math.pow(1 - t, 2.4);
    const noise = (Math.random() * 2 - 1) * 0.6;
    const bassFreq = 200 - t * 150;
    phase += (2 * Math.PI * bassFreq) / sr;
    const bass = Math.sin(phase) * 0.7;
    const punch = Math.sin(phase * 2.5) * 0.15 * (1 - t);
    out[i] = (noise + bass + punch) * env;
  }
  return out;
}

function synthPopCandy(sr) {
  const dur = 0.16;
  const n = Math.floor(sr * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = Math.pow(1 - t, 1.8);
    const pop = Math.sin((2 * Math.PI * (880 - t * 420)) * (i / sr)) * 0.55;
    const sparkle = Math.sin((2 * Math.PI * 1760) * (i / sr)) * 0.18 * (1 - t);
    const click = (Math.random() * 2 - 1) * 0.12 * (1 - t * 1.2);
    out[i] = (pop + sparkle + click) * env;
  }
  return out;
}

function synthChimeWin(sr) {
  const dur = 0.34;
  const n = Math.floor(sr * dur);
  const out = new Float32Array(n);
  const freqs = [523.25, 659.25, 783.99];
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    let s = 0;
    freqs.forEach((f, idx) => {
      const start = idx * 0.045;
      if (t < start) return;
      const local = t - start;
      const env = Math.exp(-local * 10);
      s += Math.sin(2 * Math.PI * f * local) * env * 0.38;
    });
    out[i] = Math.max(-1, Math.min(1, s));
  }
  return out;
}

function synthWhooshPop(sr) {
  const dur = 0.22;
  const n = Math.floor(sr * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const whoosh = (Math.random() * 2 - 1) * 0.35 * Math.pow(1 - t, 1.2) * (t < 0.45 ? 1 : 0);
    const popT = Math.max(0, (t - 0.38) / 0.62);
    const popEnv = Math.pow(1 - popT, 2);
    const pop = Math.sin(2 * Math.PI * (620 - popT * 280) * (i / sr)) * 0.65 * popEnv;
    out[i] = whoosh + pop;
  }
  return out;
}

function synthCoinBling(sr) {
  const dur = 0.2;
  const n = Math.floor(sr * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = Math.exp(-t * 14);
    const a = Math.sin(2 * Math.PI * 1318.5 * (i / sr)) * 0.42;
    const b = Math.sin(2 * Math.PI * 1975.5 * (i / sr)) * 0.22;
    const shimmer = Math.sin(2 * Math.PI * 2637 * (i / sr)) * 0.08 * (1 - t);
    out[i] = (a + b + shimmer) * env;
  }
  return out;
}

function synthSoftThud(sr) {
  const dur = 0.18;
  const n = Math.floor(sr * dur);
  const out = new Float32Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = Math.pow(1 - t, 3.2);
    const f = 120 - t * 60;
    phase += (2 * Math.PI * f) / sr;
    const body = Math.sin(phase) * 0.55;
    const soft = (Math.random() * 2 - 1) * 0.08 * (1 - t);
    out[i] = (body + soft) * env;
  }
  return out;
}

function synthWrongBuzz(sr) {
  const dur = 0.36;
  const n = Math.floor(sr * dur);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = Math.pow(1 - t, 1.4);
    const freq = 420 - t * 260;
    const tone = Math.sin((2 * Math.PI * freq * i) / sr) * 0.48;
    const buzz = Math.sign(Math.sin((2 * Math.PI * freq * 2.4 * i) / sr)) * 0.16;
    out[i] = (tone + buzz) * env;
  }
  return out;
}

const presets = [
  { id: 'deep-boom', file: 'match-deep-boom.wav', synth: synthDeepBoom },
  { id: 'pop-candy', file: 'match-pop-candy.wav', synth: synthPopCandy },
  { id: 'chime-win', file: 'match-chime-win.wav', synth: synthChimeWin },
  { id: 'whoosh-pop', file: 'match-whoosh-pop.wav', synth: synthWhooshPop },
  { id: 'coin-bling', file: 'match-coin-bling.wav', synth: synthCoinBling },
  { id: 'soft-thud', file: 'match-soft-thud.wav', synth: synthSoftThud },
  { id: 'wrong', file: 'match-wrong.wav', synth: synthWrongBuzz },
];

fs.mkdirSync(outDir, { recursive: true });
const sr = 22050;
for (const p of presets) {
  const samples = p.synth(sr);
  const outPath = path.join(outDir, p.file);
  fs.writeFileSync(outPath, encodeMonoWav(samples, sr));
  console.log('wrote', p.file, samples.length, 'samples');
}
