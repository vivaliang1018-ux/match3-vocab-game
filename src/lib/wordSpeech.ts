import { assetUrl } from './assetUrl';
import { encodeVoicePathSegment } from './emojiVoiceFileUrl';

type SpeakOptions = {
  /** Call `speak` in the same task as the user gesture (required on iOS Safari). */
  sync?: boolean;
};

type RecordedPlaybackOptions = {
  /** Limit filename fallbacks for interactions that need an immediate response. */
  maxUrlAttempts?: number;
  /** Maximum wait for a recorded clip to begin playing. */
  playStartTimeoutMs?: number;
};

type CompletionSpeechOptions = {
  /**
   * Prefer the exact recorded filename and fall back to system speech quickly.
   * Used for tapped quiz answers, where delayed feedback feels broken.
   */
  quickStart?: boolean;
};

const RECORDED_VOICE_BASE = assetUrl('emoji-voice');
/** Recordings are mastered to -16 LUFS; unity gain avoids clipping their peaks. */
const WORD_PLAYBACK_GAIN = 1;

let voiceAudioEl: HTMLAudioElement | null = null;
let speechGeneration = 0;
let wordSpeechQueue: Promise<boolean> = Promise.resolve(true);

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

function getVoiceAudioElement(): HTMLAudioElement {
  if (!voiceAudioEl) {
    voiceAudioEl = new Audio();
    voiceAudioEl.preload = 'auto';
  }
  return voiceAudioEl;
}

function setWordPlaybackLevel(level: number): void {
  const vol = Math.min(1, Math.max(0, level));
  const a = voiceAudioEl;
  if (a) a.volume = WORD_PLAYBACK_GAIN * vol;
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
  wordSpeechQueue = Promise.resolve(false);
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
    urls.add(`${RECORDED_VOICE_BASE}/${encodeVoicePathSegment(t)}.mp3`);
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

async function playVoiceElement(a: HTMLAudioElement, timeoutMs = 2500): Promise<void> {
  let timeoutId: number | null = null;
  try {
    await Promise.race([
      a.play(),
      new Promise<void>((_, reject) => {
        timeoutId = window.setTimeout(
          () => reject(new Error('voice-play-timeout')),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    if (timeoutId !== null) window.clearTimeout(timeoutId);
  }
}

async function tryPlayAudioUrl(url: string): Promise<boolean> {
  beginBgmDuck();
  try {
    const a = getVoiceAudioElement();
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

async function tryPlayAudioUrlAndWait(
  url: string,
  isStillCurrent?: () => boolean,
  playStartTimeoutMs?: number,
): Promise<boolean> {
  beginBgmDuck();
  try {
    if (isStillCurrent && !isStillCurrent()) return false;
    const a = getVoiceAudioElement();
    a.pause();
    a.src = url;
    setWordPlaybackLevel(1);
    await playVoiceElement(a, playStartTimeoutMs);
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
      // `duration` is often still unknown immediately after play() on iOS.
      // Never use the old 1.2s fallback there: it could release the queue and
      // let the next word replace a recording that was still speaking.
      }, dur > 0 ? Math.min(8000, dur * 1000 + 500) : 8000);
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

export async function playRecordedWordAndWait(
  word: string,
  isStillCurrent?: () => boolean,
  options?: RecordedPlaybackOptions,
): Promise<boolean> {
  stopVoicePlayback();
  const urls = buildRecordedWordUrls(word);
  const maxAttempts = Math.max(
    1,
    Math.floor(options?.maxUrlAttempts ?? urls.length),
  );
  for (const url of urls.slice(0, maxAttempts)) {
    if (isStillCurrent && !isStillCurrent()) return false;
    const ok = await tryPlayAudioUrlAndWait(
      url,
      isStillCurrent,
      options?.playStartTimeoutMs,
    );
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
  // Keep music level stable while vocabulary audio plays. The speech lifecycle
  // still uses duck/restore callbacks so this behavior remains easy to reverse.
  return Math.min(1, Math.max(0, bgmVolume));
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
    if (!('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    synth.resume();
    // Loading voices is enough for warm-up. Playing even a near-silent
    // utterance makes iOS briefly change its audio session and audibly alters
    // already-playing BGM.
    synth.getVoices();
  } catch {
    // ignore
  }
}

/**
 * Drop background-suspended work and rebuild the vocabulary-audio queue.
 * Other game sounds use short-lived contexts, while word playback keeps one
 * media element/context and otherwise remains stuck after an iOS app switch.
 */
export function resetWordSpeechAfterBackground(): void {
  stopAllWordSpeech();
  // Recreate the media element after every foreground transition. A persistent
  // WebAudio MediaElementSource can remain interrupted forever in WKWebView,
  // while a fresh native HTMLAudioElement starts normally on the next match.
  voiceAudioEl = null;
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
      window.speechSynthesis.getVoices();
    }
  } catch {
    // The next user gesture will run unlockSpeechSynthesis again.
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
  void queueWordSpeechToCompletion(word, { quickStart: true });
}

/** Auto-play when a new quiz question appears. */
export async function speakWordAuto(word: string): Promise<boolean> {
  return queueWordSpeechToCompletion(word);
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
export async function speakWordToCompletion(
  word: string,
  options?: CompletionSpeechOptions,
): Promise<boolean> {
  const gen = speechGeneration;
  const ok = await playRecordedWordAndWait(
    word,
    () => gen === speechGeneration,
    options?.quickStart
      ? {
          // The first URL is the dataset's exact filename. If it cannot start
          // promptly in WKWebView, system speech is faster than probing every
          // spelling/Unicode fallback one by one.
          maxUrlAttempts: 1,
          playStartTimeoutMs: 500,
        }
      : undefined,
  );
  if (gen !== speechGeneration) return false;
  if (ok) return true;
  if (!speak(word, { sync: true })) return false;
  await waitForSpeechSynthesisEnd();
  return gen === speechGeneration;
}

/**
 * App-wide vocabulary audio contract: a newly requested word waits for the
 * current word to finish instead of cutting it off. Only an explicit
 * `stopAllWordSpeech` (leaving/resetting a flow) cancels queued playback.
 */
export function queueWordSpeechToCompletion(
  word: string,
  options?: CompletionSpeechOptions,
): Promise<boolean> {
  const gen = speechGeneration;
  const task = wordSpeechQueue
    .catch(() => false)
    .then(() => {
      if (gen !== speechGeneration) return false;
      return speakWordToCompletion(word, options);
    });
  wordSpeechQueue = task;
  return task;
}

/**
 * Time-sensitive prompt speech: the newest target replaces any older prompt
 * or queued vocabulary audio. Unlike match-card speech, stale prompts must
 * never finish after the visible question has changed.
 */
export function speakLatestWordPrompt(word: string): Promise<boolean> {
  stopAllWordSpeech();
  return speakWordToCompletion(word, { quickStart: true });
}
