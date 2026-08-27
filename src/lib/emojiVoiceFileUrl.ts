import { assetUrl } from './assetUrl';

const LEGACY_VOICE_FILENAME_STEMS: Readonly<Record<string, string>> = {
  // The shipped asset is lowercase. Resolve it explicitly because iOS app
  // bundles are case-sensitive and quick playback only tries the first URL.
  Beaver: 'beaver',
};

/** Vite dev server matches literal `:` in filenames; `%3A` returns HTML instead of MP3. */
export function encodeVoicePathSegment(word: string): string {
  const trimmed = word.trim();
  const filenameStem = LEGACY_VOICE_FILENAME_STEMS[trimmed] ?? trimmed;
  return encodeURIComponent(filenameStem).replace(/%3A/gi, ':');
}

export function buildEmojiVoiceUrls(basePath: string, word: string): string[] {
  const w = word.trim();
  if (!w) return [];
  const base = assetUrl(basePath);
  const urls = new Set<string>();
  const push = (s: string) => {
    const t = s.trim();
    if (!t) return;
    urls.add(`${base}/${encodeVoicePathSegment(t)}.mp3`);
  };
  const addVariants = (s: string) => {
    for (const form of [s, s.normalize('NFC'), s.normalize('NFD')]) {
      push(form);
      push(form.replace(/\s+/g, ' '));
      push(form.replace(/\. /g, '.  '));
      push(form.replace(/\.  +/g, '. '));
      push(form.replace(/!\s+/g, '!  '));
      push(form.replace(/!\s{2,}/g, '! '));
      push(form.toLowerCase());
    }
  };
  addVariants(w);
  if (/[:\uFF1A]/.test(w)) {
    addVariants(w.replace(/\uFF1A/g, ':'));
    addVariants(w.replace(/:/g, '\uFF1A'));
    const spaced = w.replace(/[\uFF1A:]/g, ' ').replace(/\s+/g, ' ').trim();
    if (spaced && spaced !== w) addVariants(spaced);
  }
  return [...urls];
}

export function primaryEmojiVoiceUrl(basePath: string, word: string, cacheBust?: number): string {
  const url = buildEmojiVoiceUrls(basePath, word)[0] ?? '';
  return cacheBust ? `${url}?t=${cacheBust}` : url;
}
