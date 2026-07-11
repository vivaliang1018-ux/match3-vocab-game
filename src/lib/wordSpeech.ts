import { assetUrl } from './assetUrl';

type SpeakOptions = {
  /** Call `speak` in the same task as the user gesture (required on iOS Safari). */
  sync?: boolean;
};

const RECORDED_VOICE_BASE = assetUrl('emoji-voice');
/** Recorded clips are mastered quiet; boost above 1.0 via Web Audio when available. */
const WORD_PLAYBACK_GAIN = 1.9;
const BGM_DUCK_MULTIPLIER = 0.14;
const BGM_DUCK_CAP = 0.022;

let voiceAudioEl: HTMLAudioElement | null = null;
let voiceAudioCtx: AudioContext | null = null;
let voiceGainNode: GainNode | null = null;
let voiceRoutedThroughWebAudio = false;
let speechGeneration = 0;

type BgmDuckController = {
  duck: () => void;
  restore: () => void;
};

let bgmDuckController: BgmDuckController | null = null;
let bgmDuckDepth = 0;

export function registerWordSpeechBgmController(controller: BgmDuckController | null): void {
  bgmDuckController = controller;
}

function beginBgmDuck(): void {
  if (bgmDuckDepth === 0) bgmDuckController?.duck();
  bgmDuckDepth += 1;
}

function endBgmDuck(): void {
  bgmDuckDepth = Math.max(0, bgmDuckDepth - 1);
  if (bgmDuckDepth === 0) bgmDuckController?.restore();
}

async function resumeVoiceAudioContext(): Promise<void> {
  if (!voiceAudioCtx) return;
  if (voiceAudioCtx.state === 'suspended') {
    try {
      await voiceAudioCtx.resume();
    } catch {
      // ignore
    }
  }
}

function getVoiceAudioElement(): HTMLAudioElement {
  if (!voiceAudioEl) {
    voiceAudioEl = new Audio();
    voiceAudioEl.preload = 'auto';
  }
  if (!voiceRoutedThroughWebAudio) {
    try {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx && voiceAudioEl) {
        voiceAudioCtx = new Ctx();
        const source = voiceAudioCtx.createMediaElementSource(voiceAudioEl);
        voiceGainNode = voiceAudioCtx.createGain();
        voiceGainNode.gain.value = WORD_PLAYBACK_GAIN;
        source.connect(voiceGainNode);
        voiceGainNode.connect(voiceAudioCtx.destination);
        voiceRoutedThroughWebAudio = true;
      }
    } catch {
      // Fall back to element.volume on platforms that reject MediaElementSource.
    }
  }
  return voiceAudioEl;
}

function setWordPlaybackLevel(level: number): void {
  const vol = Math.min(1, Math.max(0, level));
  if (voiceGainNode && voiceAudioCtx) {
    voiceGainNode.gain.value = WORD_PLAYBACK_GAIN * vol;
    return;
  }
  const a = voiceAudioEl;
  if (a) a.volume = vol;
}

export function stopVoicePlayback(): void {
  if (!voiceAudioEl) return;
  try {
    voiceAudioEl.pause();
    voiceAudioEl.removeAttribute('src');
    voiceAudioEl.load();
  } catch {
    // ignore
  }
  if (bgmDuckDepth > 0) {
    bgmDuckDepth = 0;
    bgmDuckController?.restore();
  }
}

/** Stop recorded audio and cancel pending / in-flight TTS. */
export function stopAllWordSpeech(): void {
  speechGeneration += 1;
  stopVoicePlayback();
  if (bgmDuckDepth > 0) {
    bgmDuckDepth = 0;
    bgmDuckController?.restore();
  }
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // ignore
  }
}

function buildRecordedWordUrls(word: string): string[] {
  const w = word.trim();
  if (!w) return [];
  const urls = new Set<string>();
  const push = (s: string) => {
    const t = s.trim();
    if (!t) return;
    urls.add(`${RECORDED_VOICE_BASE}/${encodeURIComponent(t)}.mp3`);
  };
  const addVariants = (s: string) => {
    const forms = [s, s.normalize('NFC'), s.normalize('NFD')];
    for (const form of forms) {
      push(form);
      push(form.replace(/\s+/g, ' '));
      push(form.replace(/\. /g, '.  '));
      push(form.replace(/\.  +/g, '. '));
      push(form.replace(/!\s+/g, '!  '));
      push(form.replace(/!\s{2,}/g, '! '));
      push(form.toLowerCase());
      if (form !== form.toLowerCase()) push(form);
    }
  };
  addVariants(w);
  const hasColon = /[:\uFF1A]/.test(w);
  if (hasColon) {
    addVariants(w.replace(/\uFF1A/g, ':'));
    addVariants(w.replace(/:/g, '\uFF1A'));
    const englishSpacing = w.replace(/[\uFF1A:]/g, ' ').replace(/\s+/g, ' ').trim();
    if (englishSpacing && englishSpacing !== w) addVariants(englishSpacing);
  }
  return [...urls];
}

async function playVoiceElement(a: HTMLAudioElement): Promise<void> {
  await Promise.race([
    a.play(),
    new Promise<void>((_, reject) => {
      window.setTimeout(() => reject(new Error('voice-play-timeout')), 2500);
    }),
  ]);
}

async function tryPlayAudioUrl(url: string): Promise<boolean> {
  beginBgmDuck();
  try {
    const a = getVoiceAudioElement();
    await resumeVoiceAudioContext();
    a.pause();
    a.src = url;
    setWordPlaybackLevel(1);
    await playVoiceElement(a);
    const releaseDuck = () => endBgmDuck();
    a.addEventListener('ended', releaseDuck, { once: true });
    a.addEventListener('error', releaseDuck, { once: true });
    return true;
  } catch {
    endBgmDuck();
    return false;
  }
}

async function tryPlayAudioUrlAndWait(url: string, isStillCurrent?: () => boolean): Promise<boolean> {
  beginBgmDuck();
  try {
    if (isStillCurrent && !isStillCurrent()) return false;
    const a = getVoiceAudioElement();
    await resumeVoiceAudioContext();
    a.pause();
    a.src = url;
    setWordPlaybackLevel(1);
    await playVoiceElement(a);
    if (isStillCurrent && !isStillCurrent()) {
      stopVoicePlayback();
      return false;
    }

    await new Promise<void>((resolve) => {
      const cleanup = () => {
        a.removeEventListener('ended', onEnded);
        a.removeEventListener('error', onErr);
      };
      const onEnded = () => {
        cleanup();
        resolve();
      };
      const onErr = () => {
        cleanup();
        resolve();
      };
      a.addEventListener('ended', onEnded, { once: true });
      a.addEventListener('error', onErr, { once: true });
      const dur = Number.isFinite(a.duration) && a.duration > 0 ? a.duration : 0;
      window.setTimeout(() => {
        cleanup();
        resolve();
      }, Math.min(8000, Math.max(1200, dur * 1000 + 300)));
    });

    if (isStillCurrent && !isStillCurrent()) return false;
    return true;
  } catch {
    return false;
  } finally {
    endBgmDuck();
  }
}

export async function playRecordedWord(word: string): Promise<boolean> {
  const gen = speechGeneration;
  stopVoicePlayback();
  const urls = buildRecordedWordUrls(word);
  for (const url of urls) {
    if (gen !== speechGeneration) return false;
    const ok = await tryPlayAudioUrl(url);
    if (gen !== speechGeneration) return false;
    if (ok) return true;
  }
  return false;
}

export async function playRecordedWordAndWait(word: string, isStillCurrent?: () => boolean): Promise<boolean> {
  stopVoicePlayback();
  const urls = buildRecordedWordUrls(word);
  for (const url of urls) {
    if (isStillCurrent && !isStillCurrent()) return false;
    const ok = await tryPlayAudioUrlAndWait(url, isStillCurrent);
    if (ok) return true;
  }
  return false;
}

function pickEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const en = voices.filter((v) => v.lang?.toLowerCase().startsWith('en'));
  if (en.length === 0) return voices[0];
  return (
    en.find((v) => /en-us/i.test(v.lang)) ||
    en.find((v) => /en-gb/i.test(v.lang)) ||
    en.find((v) => /^en/i.test(v.lang)) ||
    en[0]
  );
}

export function computeDuckedBgmVolume(bgmVolume: number): number {
  return Math.min(bgmVolume * BGM_DUCK_MULTIPLIER, BGM_DUCK_CAP);
}

export function speak(word: string, options?: SpeakOptions): boolean {
  try {
    if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') {
      return false;
    }
    const gen = speechGeneration;
    const synth = window.speechSynthesis;
    const text = word.trim() || ' ';
    let ran = false;
    const run = () => {
      if (ran || gen !== speechGeneration) return;
      ran = true;
      synth.getVoices();
      const voices = synth.getVoices();
      const voice = pickEnglishVoice(voices);
      synth.resume();
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = voice?.lang ?? 'en-US';
      u.rate = 0.95;
      u.volume = 1;
      u.pitch = 1;
      if (voice) u.voice = voice;
      beginBgmDuck();
      const releaseDuck = () => endBgmDuck();
      u.onend = releaseDuck;
      u.onerror = releaseDuck;
      if (options?.sync) {
        synth.speak(u);
      } else {
        requestAnimationFrame(() => {
          if (gen !== speechGeneration) {
            releaseDuck();
            return;
          }
          synth.speak(u);
        });
      }
    };

    if (synth.getVoices().length > 0) {
      run();
      return true;
    }

    const onVoices = () => {
      synth.removeEventListener('voiceschanged', onVoices);
      run();
    };
    synth.addEventListener('voiceschanged', onVoices);
    window.setTimeout(() => {
      if (gen !== speechGeneration) {
        synth.removeEventListener('voiceschanged', onVoices);
        return;
      }
      if (synth.getVoices().length > 0) {
        synth.removeEventListener('voiceschanged', onVoices);
        run();
      }
    }, 120);
    window.setTimeout(() => {
      if (gen !== speechGeneration) {
        synth.removeEventListener('voiceschanged', onVoices);
        return;
      }
      synth.removeEventListener('voiceschanged', onVoices);
      run();
    }, 900);
    return true;
  } catch {
    return false;
  }
}

/** iOS/Safari: first user interaction often required before any audio/TTS works. */
export function unlockSpeechSynthesis() {
  try {
    void resumeVoiceAudioContext();
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.resume();
    synth.cancel();
    const u = new SpeechSynthesisUtterance(' ');
    u.volume = 0.01;
    synth.speak(u);
    synth.cancel();
  } catch {
    // ignore
  }
}

/** Short buzz for quiz wrong answer. */
export function playQuizWrongSfx(): void {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.28);
    osc.onended = () => void ctx.close();
  } catch {
    // ignore
  }
}

/** User tap — prefer recording, fallback TTS in the same gesture. */
export function speakWordQuick(word: string): void {
  const gen = speechGeneration;
  void playRecordedWord(word).then((ok) => {
    if (gen !== speechGeneration) return;
    if (!ok) speak(word, { sync: true });
  });
}

/** Auto-play when a new quiz question appears. */
export async function speakWordAuto(word: string): Promise<boolean> {
  const gen = speechGeneration;
  const ok = await playRecordedWord(word);
  if (gen !== speechGeneration) return false;
  if (ok) return true;
  return speak(word);
}

function waitForSpeechSynthesisEnd(maxMs = 8000): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }
    const synth = window.speechSynthesis;
    const deadline = Date.now() + maxMs;
    const tick = () => {
      if (!synth.speaking && !synth.pending) {
        resolve();
        return;
      }
      if (Date.now() >= deadline) {
        resolve();
        return;
      }
      window.setTimeout(tick, 60);
    };
    window.setTimeout(tick, 80);
  });
}

/** Play a word through to the end — used when quiz must not interrupt pronunciation. */
export async function speakWordToCompletion(word: string): Promise<boolean> {
  const gen = speechGeneration;
  const ok = await playRecordedWordAndWait(word, () => gen === speechGeneration);
  if (gen !== speechGeneration) return false;
  if (ok) return true;
  if (!speak(word, { sync: true })) return false;
  await waitForSpeechSynthesisEnd();
  return gen === speechGeneration;
}
