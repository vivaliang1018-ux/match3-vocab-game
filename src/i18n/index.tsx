import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { de } from './locales/de';
import { en } from './locales/en';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { zhCN } from './locales/zh-CN';
import { LOCALES, type Locale, type Messages } from './types';

export type { Locale, Messages } from './types';

export const LOCALE_STORAGE_KEY = 'smellycat-match3-locale';

export const LOCALE_OPTIONS: { id: Locale; label: string; shortLabel: string }[] = [
  { id: 'en', label: 'English', shortLabel: 'EN' },
  { id: 'es', label: 'Español', shortLabel: 'ES' },
  { id: 'fr', label: 'Français', shortLabel: 'FR' },
  { id: 'de', label: 'Deutsch', shortLabel: 'DE' },
  { id: 'ja', label: '日本語', shortLabel: 'JP' },
  { id: 'ko', label: '한국어', shortLabel: 'KR' },
  { id: 'zh-CN', label: '中文', shortLabel: '中文' },
];

const MESSAGES: Record<Locale, Messages> = {
  'zh-CN': zhCN,
  en,
  es,
  fr,
  de,
  ja,
  ko,
};

/** Map device / browser language tags to a supported locale; unknown → English. */
export function detectSystemLocale(): Locale {
  const candidates: string[] = [];
  try {
    if (typeof navigator !== 'undefined') {
      if (Array.isArray(navigator.languages)) candidates.push(...navigator.languages);
      if (navigator.language) candidates.push(navigator.language);
    }
  } catch {
    // ignore
  }

  for (const raw of candidates) {
    const tag = raw.trim().toLowerCase().replace(/_/g, '-');
    if (!tag) continue;

    // Only Simplified Chinese maps to zh-CN; Traditional (zh-TW / zh-Hant / …) falls through → en
    if (tag === 'zh-cn' || tag === 'zh-hans' || tag.startsWith('zh-hans-') || tag === 'zh') {
      return 'zh-CN';
    }

    const primary = tag.split('-')[0] ?? '';
    if (primary === 'en') return 'en';
    if (primary === 'es') return 'es';
    if (primary === 'fr') return 'fr';
    if (primary === 'de') return 'de';
    if (primary === 'ja') return 'ja';
    if (primary === 'ko') return 'ko';
  }

  return 'en';
}

export function loadLocale(): Locale {
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw && (LOCALES as readonly string[]).includes(raw)) return raw as Locale;
  } catch {
    // ignore
  }
  return detectSystemLocale();
}

export function saveLocale(locale: Locale): void {
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
  /** Show Chinese translations in learning UI (quiz peek, word list cn, etc.) */
  showChinese: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => loadLocale());

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    saveLocale(next);
  }, []);

  const t = MESSAGES[locale];
  const showChinese = locale === 'zh-CN';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.meta.appTitle;
  }, [locale, t.meta.appTitle]);

  const value = useMemo(
    () => ({ locale, setLocale, t, showChinese }),
    [locale, setLocale, t, showChinese],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within LocaleProvider');
  return ctx;
}

export function formatCountdownLocalized(
  ms: number,
  countdown: Messages['review']['countdown'],
): string {
  if (ms <= 0) return countdown.due;
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return countdown.days(d);
  if (h > 0) return countdown.hours(h);
  if (m > 0) return countdown.minutes(m);
  return countdown.seconds(s);
}

/** Category label for mode picker / word list chrome */
export function categoryDisplayName(
  cat: { label: string; subtitle: string },
  locale: Locale,
): string {
  return locale === 'zh-CN' ? cat.label : cat.subtitle;
}
