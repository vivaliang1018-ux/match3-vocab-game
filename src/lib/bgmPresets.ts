import { assetUrl } from './assetUrl';

export const BGM_ENABLED_KEY = 'smellycat-match3-bgm-enabled';
export const DEFAULT_BGM_VOLUME = 0.12;

const BGM_FILE = 'bgm/mutou-tangyun.mp3';

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
