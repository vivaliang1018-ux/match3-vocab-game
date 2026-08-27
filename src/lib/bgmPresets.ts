import { assetUrl } from './assetUrl';

export const BGM_ENABLED_KEY = 'smellycat-match3-bgm-enabled';
// The BGM asset itself is mastered to about -32 LUFS because iOS ignores
// HTMLMediaElement.volume. Keep playback at unity for consistent Web/iOS output.
export const HOME_BGM_VOLUME = 1;
export const DEFAULT_BGM_VOLUME = 1;

const BGM_FILE = 'bgm/matchingo.mp3';

export function getBgmUrl(): string {
  return assetUrl(BGM_FILE);
}

export function loadBgmEnabled(): boolean {
  try {
    const raw = localStorage.getItem(BGM_ENABLED_KEY);
    if (raw === null) return true;
    return raw === '1';
  } catch {
    return true;
  }
}

export function saveBgmEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(BGM_ENABLED_KEY, enabled ? '1' : '0');
  } catch {
    // ignore
  }
}
