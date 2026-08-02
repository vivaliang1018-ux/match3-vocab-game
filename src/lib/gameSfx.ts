import { DEFAULT_BGM_VOLUME } from './bgmPresets';
import {
  getMatchClearSfxUrl,
  getSayBlastExplosionSfxUrl,
  getWrongSfxUrl,
} from './matchClearSfxPresets';

let boomAudio: HTMLAudioElement | null = null;
let wrongAudio: HTMLAudioElement | null = null;
let sayBlastExplosionAudio: HTMLAudioElement | null = null;
let countdownAudioContext: AudioContext | null = null;
let sfxUnlocked = false;

function getBoomAudio(): HTMLAudioElement {
  if (!boomAudio) {
    boomAudio = new Audio(getMatchClearSfxUrl());
    boomAudio.preload = 'auto';
    boomAudio.load();
  }
  return boomAudio;
}

function getWrongAudio(): HTMLAudioElement {
  if (!wrongAudio) {
    wrongAudio = new Audio(getWrongSfxUrl());
    wrongAudio.preload = 'auto';
    wrongAudio.load();
  }
  return wrongAudio;
}

function getSayBlastExplosionAudio(): HTMLAudioElement {
  if (!sayBlastExplosionAudio) {
    sayBlastExplosionAudio = new Audio(getSayBlastExplosionSfxUrl());
    sayBlastExplosionAudio.preload = 'auto';
    sayBlastExplosionAudio.load();
  }
  return sayBlastExplosionAudio;
}

function getCountdownAudioContext(): AudioContext | null {
  if (countdownAudioContext) return countdownAudioContext;
  if (typeof window === 'undefined' || !window.AudioContext) return null;
  try {
    countdownAudioContext = new window.AudioContext();
    return countdownAudioContext;
  } catch {
    return null;
  }
}

function warmUnlock(a: HTMLAudioElement): Promise<void> {
  const prevMuted = a.muted;
  const prevVolume = a.volume;
  a.muted = true;
  a.volume = 0;
  return a
    .play()
    .then(() => {
      a.pause();
      a.currentTime = 0;
      a.muted = prevMuted;
      a.volume = prevVolume;
    })
    .catch(() => {
      a.muted = prevMuted;
      a.volume = prevVolume;
    });
}

/** Call on user gesture — required for iOS / Capacitor. */
export function unlockGameAudio(): void {
  const countdownContext = getCountdownAudioContext();
  if (countdownContext?.state === 'suspended') {
    void countdownContext.resume().catch(() => undefined);
  }
  if (sfxUnlocked) return;

  try {
    void Promise.all([
      warmUnlock(getBoomAudio()),
      warmUnlock(getSayBlastExplosionAudio()),
    ]).then(() => {
      sfxUnlocked = true;
    });
  } catch {
    // ignore
  }
}

/** Derive SFX level from BGM on/off. */
export function resolveSfxVolume(bgmEnabled: boolean): number {
  if (!bgmEnabled) return 0.85;
  return Math.max(0.7, Math.min(1, DEFAULT_BGM_VOLUME * 6));
}

export const SFX_ENABLED_KEY = 'smellycat-match3-sfx-enabled';

export function loadSfxEnabled(): boolean {
  try {
    const raw = localStorage.getItem(SFX_ENABLED_KEY);
    if (raw === null) return true;
    return raw === '1';
  } catch {
    return true;
  }
}

export function saveSfxEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(SFX_ENABLED_KEY, enabled ? '1' : '0');
  } catch {
    // ignore
  }
}

function playHtmlAudio(a: HTMLAudioElement, volume: number): void {
  try {
    a.muted = false;
    a.volume = Math.min(1, Math.max(0, volume));
    a.currentTime = 0;
    void a.play().catch(() => {
      try {
        const shot = new Audio(a.src);
        shot.volume = a.volume;
        void shot.play();
      } catch {
        // ignore
      }
    });
  } catch {
    // ignore
  }
}

/** Play chime when match-3 tiles clear. */
export function playMatchClearSfx(
  volume = 1,
  variant: 'match' | 'line' = 'match',
): void {
  if (!loadSfxEnabled()) return;
  if (volume <= 0) return;
  const vol = Math.min(1, Math.max(0, volume));
  const scaled = variant === 'line' ? Math.min(1, vol * 1.15) : vol;
  playHtmlAudio(getBoomAudio(), scaled);
}

/** Play buzz when fun-mode player matches the wrong word. */
export function playWrongSfx(volume = 1): void {
  if (!loadSfxEnabled()) return;
  if (volume <= 0) return;
  const vol = Math.min(1, Math.max(0, volume));
  playHtmlAudio(getWrongAudio(), vol);
}

/** Play one impact sound when a Say & Blast projectile destroys its target. */
export function playSayBlastExplosionSfx(volume = 0.95): void {
  if (!loadSfxEnabled()) return;
  if (volume <= 0) return;
  playHtmlAudio(
    getSayBlastExplosionAudio(),
    Math.min(1, Math.max(0, volume)),
  );
}

/** Play one short "de" tone for each Say & Blast count-in number. */
export function playSayBlastCountdownBeep(): void {
  if (!loadSfxEnabled()) return;
  const context = getCountdownAudioContext();
  if (!context) return;

  const playTone = () => {
    try {
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(760, now);
      oscillator.frequency.exponentialRampToValueAtTime(610, now + 0.11);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.14);
    } catch {
      // Count-in audio is optional.
    }
  };

  if (context.state === 'suspended') {
    void context.resume().then(playTone).catch(() => undefined);
    return;
  }
  playTone();
}

/** Play the brighter "ding" exactly when the Say & Blast round becomes live. */
export function playSayBlastCountdownStartChime(): void {
  if (!loadSfxEnabled()) return;
  const context = getCountdownAudioContext();
  if (!context) return;

  const playTone = () => {
    try {
      const now = context.currentTime;
      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.22, now + 0.012);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      master.connect(context.destination);

      for (const [frequency, volume] of [
        [980, 0.78],
        [1470, 0.42],
      ] as const) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, now);
        gain.gain.setValueAtTime(volume, now);
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start(now);
        oscillator.stop(now + 0.23);
      }
    } catch {
      // Count-in audio is optional.
    }
  };

  if (context.state === 'suspended') {
    void context.resume().then(playTone).catch(() => undefined);
    return;
  }
  playTone();
}
