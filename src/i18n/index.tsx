import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { en } from './locales/en';
import { LOCALES, type Locale, type Messages } from './types';
import { APP_UI_COPY, type AppUiCopy } from './appUiCopy';

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

const messageCache: Partial<Record<Locale, Messages>> = { en };

async function loadMessages(locale: Locale): Promise<Messages> {
  const cached = messageCache[locale];
  if (cached) return cached;
  const messages = await (async () => {
    switch (locale) {
      case 'zh-CN': return (await import('./locales/zh-CN')).zhCN;
      case 'es': return (await import('./locales/es')).es;
      case 'fr': return (await import('./locales/fr')).fr;
      case 'de': return (await import('./locales/de')).de;
      case 'ja': return (await import('./locales/ja')).ja;
      case 'ko': return (await import('./locales/ko')).ko;
      case 'en': return en;
    }
  })();
  messageCache[locale] = messages;
  return messages;
}

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
  /** Locale-driven UI copy that is shared by newer game surfaces. */
  ui: AppUiCopy;
  /** Show Chinese translations in learning UI (quiz peek, word list cn, etc.) */
  showChinese: boolean;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => loadLocale());
  const [messages, setMessages] = useState<Messages>(() => messageCache[loadLocale()] ?? en);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    saveLocale(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void loadMessages(locale).then((next) => {
      if (!cancelled) setMessages(next);
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);

  const t = messages;
  const ui = APP_UI_COPY[locale];
  const showChinese = locale === 'zh-CN';

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t.meta.appTitle;
  }, [locale, t.meta.appTitle]);

  const value = useMemo(
    () => ({ locale, setLocale, t, ui, showChinese }),
    [locale, setLocale, t, ui, showChinese],
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
  cat: { id?: string; label: string; subtitle: string },
  locale: Locale,
): string {
  if (locale === 'zh-CN') return cat.label;
  if (locale === 'en' || !cat.id) return cat.subtitle;
  return CATEGORY_NAMES[locale][cat.id] ?? cat.subtitle;
}

const CATEGORY_NAMES: Record<Exclude<Locale, 'en' | 'zh-CN'>, Record<string, string>> = {
  es: { 'smileys-emotion': 'Caritas y emociones', body: 'Cuerpo', people: 'Personas', animals: 'Animales', plants: 'Plantas y flores', 'food-drink': 'Comida y bebida', weather: 'Tiempo', travel: 'Viajes', 'travel-transport': 'Viajes: transporte', 'travel-signs': 'Viajes: señales de tráfico', 'travel-time': 'Viajes: tiempo', 'sports-games': 'Deportes y juegos', holidays: 'Celebraciones', 'arts-culture': 'Arte y cultura', music: 'Música', 'clothing-accessories': 'Ropa y accesorios', tools: 'Herramientas', objects: 'Objetos', symbols: 'Símbolos' },
  fr: { 'smileys-emotion': 'Smileys et émotions', body: 'Corps', people: 'Personnes', animals: 'Animaux', plants: 'Plantes et fleurs', 'food-drink': 'Nourriture et boissons', weather: 'Météo', travel: 'Voyages', 'travel-transport': 'Voyages : transports', 'travel-signs': 'Voyages : panneaux routiers', 'travel-time': 'Voyages : temps', 'sports-games': 'Sports et jeux', holidays: 'Fêtes', 'arts-culture': 'Arts et culture', music: 'Musique', 'clothing-accessories': 'Vêtements et accessoires', tools: 'Outils', objects: 'Objets', symbols: 'Symboles' },
  de: { 'smileys-emotion': 'Smileys & Emotionen', body: 'Körper', people: 'Menschen', animals: 'Tiere', plants: 'Pflanzen & Blumen', 'food-drink': 'Essen & Trinken', weather: 'Wetter', travel: 'Reisen', 'travel-transport': 'Reisen: Verkehrsmittel', 'travel-signs': 'Reisen: Verkehrsschilder', 'travel-time': 'Reisen: Zeit', 'sports-games': 'Sport & Spiele', holidays: 'Feiertage', 'arts-culture': 'Kunst & Kultur', music: 'Musik', 'clothing-accessories': 'Kleidung & Accessoires', tools: 'Werkzeuge', objects: 'Gegenstände', symbols: 'Symbole' },
  ja: { 'smileys-emotion': 'スマイリーと感情', body: '身体', people: '人物', animals: '動物', plants: '植物と花', 'food-drink': '食べ物と飲み物', weather: '天気', travel: '旅行', 'travel-transport': '旅行：乗り物', 'travel-signs': '旅行：道路標識', 'travel-time': '旅行：時間', 'sports-games': 'スポーツとゲーム', holidays: '祝日とイベント', 'arts-culture': '芸術と文化', music: '音楽', 'clothing-accessories': '衣類とアクセサリー', tools: '道具', objects: '物', symbols: '記号' },
  ko: { 'smileys-emotion': '스마일리와 감정', body: '신체', people: '사람', animals: '동물', plants: '식물과 꽃', 'food-drink': '음식과 음료', weather: '날씨', travel: '여행', 'travel-transport': '여행: 교통수단', 'travel-signs': '여행: 도로 표지판', 'travel-time': '여행: 시간', 'sports-games': '스포츠와 게임', holidays: '기념일', 'arts-culture': '예술과 문화', music: '음악', 'clothing-accessories': '의류와 액세서리', tools: '도구', objects: '사물', symbols: '기호' },
};
