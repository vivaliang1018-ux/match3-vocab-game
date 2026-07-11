import { DEFAULT_BGM_VOLUME } from './bgmPresets';
import { getMatchClearSfxUrl, getWrongSfxUrl } from './matchClearSfxPresets';

let boomAudio: HTMLAudioElement | null = null;
let wrongAudio: HTMLAudioElement | null = null;
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

/** Call on user gesture — required for iOS / Capacitor. */
export function unlockGameAudio(): void {
  if (sfxUnlocked) return;

  try {
    const a = getBoomAudio();
    const prevMuted = a.muted;
    const prevVolume = a.volume;
    a.muted = true;
    a.volume = 0;
    void a
      .play()
      .then(() => {
        a.pause();
        a.currentTime = 0;
        a.muted = prevMuted;
        a.volume = prevVolume;
        sfxUnlocked = true;
      })
      .catch(() => {
        a.muted = prevMuted;
        a.volume = prevVolume;
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

/** Play chime when match-3 tiles clear. */
export function playMatchClearSfx(
  volume = 1,
  variant: 'match' | 'line' = 'match',
): void {
  if (!loadSfxEnabled()) return;
  if (volume <= 0) return;
  const vol = Math.min(1, Math.max(0, volume));
  const scaled = variant === 'line' ? Math.min(1, vol * 1.15) : vol;

  try {
    const a = getBoomAudio();
    a.muted = false;
    a.volume = scaled;
    a.currentTime = 0;
    void a.play();
  } catch {
    // ignore
  }
}

/** Play buzz when fun-mode player matches the wrong word. */
export function playWrongSfx(volume = 1): void {
  if (!loadSfxEnabled()) return;
  if (volume <= 0) return;
  const vol = Math.min(1, Math.max(0, volume));

  try {
    const a = getWrongAudio();
    a.muted = false;
    a.volume = vol;
    a.currentTime = 0;
    void a.play();
  } catch {
    // ignore
  }
}
