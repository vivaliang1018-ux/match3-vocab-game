import { Capacitor, registerPlugin, type PermissionState } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import type { Locale } from '../i18n/types';
import { NOTIFICATION_COPY } from '../i18n/notificationCopy';
import { eligibleNotificationIndex, pickNotificationIndex, NOTIFICATION_HISTORY_SIZE, type NotificationRotationEntry } from './notificationRotation';

const STORAGE_KEY = 'lingomatch-learning-reminders-v2';
const LEGACY_STORAGE_KEY = 'lingomatch-learning-reminders-v1';
const DAILY_ID_BASE = 73001;
const STAMINA_ID = 73101;
// Cleanup only: old QA builds scheduled this ID. Production never schedules it.
const LEGACY_TEST_ID = 73999;
const DAYS_AHEAD = 30;
const DEFAULT_HOUR = 19;
const DEFAULT_MINUTE = 30;
const NotificationSettings = registerPlugin<{ openNotifications(): Promise<void> }>('LingoMatchSettings');

export type LearningReminderCategory = 'review' | 'streak' | 'stamina' | 'newContent';
export type LearningReminderResult = 'enabled' | 'disabled' | 'denied' | 'unavailable';

export type LearningReminderSettings = {
  enabled: boolean;
  /** A deliberate enable tap handed off to iOS Settings, not a system grant. */
  pendingSystemEnable?: boolean;
  reviewEnabled: boolean;
  streakEnabled: boolean;
  staminaEnabled: boolean;
  newContentEnabled: boolean;
  /** Explicit acceptance of the expanded scope; legacy learning consent does not imply it. */
  contentConsentVersion?: number;
  contentConsentAt?: number;
  hour: number;
  minute: number;
  lastPlayedDay?: string;
  recentIndexes?: number[];
  scheduledEntries?: NotificationRotationEntry[];
  promptCount: number;
  promptLastShownAt?: number;
  inlinePromptViews: number;
  inlinePromptDeferredAt?: number;
};

export type LearningReminderContext = {
  locale: Locale;
  hasPremiumAccess: boolean;
  playedToday: boolean;
  dueReviewCount?: number;
  staminaValue?: number;
  nextStaminaAt?: number | null;
  now?: Date;
};

export type LearningReminderDiagnostics = {
  available: boolean;
  permission: PermissionState | 'unavailable';
  pendingCount: number;
};

type EventCopy = {
  review: (count: number) => string;
  streak: string;
  stamina: string;
};

const EVENT_COPY: Record<Locale, EventCopy> = {
  'zh-CN': {
    review: count => `🧠 ${count} 个单词需要加固，玩两分钟让它们记得更牢。`,
    streak: '🔥 今天的连续学习还差一步，来完成一小局吧。',
    stamina: '⚡ 体力已经充满，下一组单词准备好了。',
  },
  en: {
    review: count => `🧠 ${count} ${count === 1 ? 'word needs' : 'words need'} reinforcement. A quick match can help.`,
    streak: '🔥 Your learning streak needs one small step today.',
    stamina: '⚡ Your energy is full. The next word set is ready.',
  },
  es: {
    review: count => `🧠 ${count} ${count === 1 ? 'palabra necesita' : 'palabras necesitan'} repaso.`,
    streak: '🔥 Te falta un pequeño paso para mantener tu racha de hoy.',
    stamina: '⚡ Tu energía está llena. La siguiente serie está lista.',
  },
  fr: {
    review: count => `🧠 ${count} mot${count === 1 ? '' : 's'} à renforcer en quelques minutes.`,
    streak: '🔥 Une petite partie suffit pour poursuivre ta série aujourd’hui.',
    stamina: '⚡ Ton énergie est pleine. La prochaine série est prête.',
  },
  de: {
    review: count => `🧠 ${count} ${count === 1 ? 'Wort braucht' : 'Wörter brauchen'} eine kurze Wiederholung.`,
    streak: '🔥 Nur noch eine kleine Runde für deine heutige Lernserie.',
    stamina: '⚡ Deine Energie ist voll. Das nächste Wortset ist bereit.',
  },
  ja: {
    review: count => `🧠 ${count}語を少し復習すると、もっと記憶に残ります。`,
    streak: '🔥 今日の連続学習まであと一歩。短いゲームを始めよう。',
    stamina: '⚡ 体力が満タンです。次の単語セットを始められます。',
  },
  ko: {
    review: count => `🧠 단어 ${count}개를 잠깐 복습하면 더 오래 기억할 수 있어요.`,
    streak: '🔥 오늘의 연속 학습까지 한 걸음 남았어요.',
    stamina: '⚡ 체력이 가득 찼어요. 다음 단어 세트가 준비됐어요.',
  },
};

export function defaultLearningReminderSettings(): LearningReminderSettings {
  return {
    enabled: false,
    reviewEnabled: true,
    streakEnabled: true,
    staminaEnabled: true,
    newContentEnabled: false,
    hour: DEFAULT_HOUR,
    minute: DEFAULT_MINUTE,
    promptCount: 0,
    inlinePromptViews: 0,
  };
}

function clamp(value: unknown, min: number, max: number, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(min, Math.floor(value)))
    : fallback;
}

function parseSettings(raw: string | null): LearningReminderSettings | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<LearningReminderSettings>;
    return {
      enabled: parsed.enabled === true,
      pendingSystemEnable: parsed.pendingSystemEnable === true,
      reviewEnabled: parsed.reviewEnabled !== false,
      streakEnabled: parsed.streakEnabled !== false,
      staminaEnabled: parsed.staminaEnabled !== false,
      newContentEnabled: parsed.newContentEnabled === true && parsed.contentConsentVersion === 1,
      contentConsentVersion: parsed.contentConsentVersion === 1 ? 1 : undefined,
      contentConsentAt: typeof parsed.contentConsentAt === 'number' ? parsed.contentConsentAt : undefined,
      hour: clamp(parsed.hour, 8, 21, DEFAULT_HOUR),
      minute: clamp(parsed.minute, 0, 59, DEFAULT_MINUTE),
      lastPlayedDay: typeof parsed.lastPlayedDay === 'string' ? parsed.lastPlayedDay : undefined,
      recentIndexes: Array.isArray(parsed.recentIndexes)
        ? parsed.recentIndexes.filter(index => Number.isInteger(index) && index >= 0 && index < NOTIFICATION_COPY.en.length).slice(-NOTIFICATION_HISTORY_SIZE) : [],
      scheduledEntries: Array.isArray(parsed.scheduledEntries)
        ? parsed.scheduledEntries.filter(entry => entry && typeof entry.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(entry.day) &&
          Number.isInteger(entry.index) && entry.index >= 0 && entry.index < NOTIFICATION_COPY.en.length)
          .map(entry => ({ ...entry, kind: entry.kind === 'stamina' ? 'stamina' as const : 'daily' as const }))
          .slice(-(DAYS_AHEAD + NOTIFICATION_HISTORY_SIZE + 1)) : [],
      promptCount: clamp(parsed.promptCount, 0, 3, 0),
      promptLastShownAt: typeof parsed.promptLastShownAt === 'number' ? parsed.promptLastShownAt : undefined,
      inlinePromptViews: clamp(parsed.inlinePromptViews, 0, 100, 0),
      inlinePromptDeferredAt: typeof parsed.inlinePromptDeferredAt === 'number' ? parsed.inlinePromptDeferredAt : undefined,
    };
  } catch {
    return null;
  }
}

function saveSettings(settings: LearningReminderSettings) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch { /* noop */ }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('lingomatch-reminders-changed'));
}

export function readLearningReminderSettings(): LearningReminderSettings {
  const current = parseSettings(localStorage.getItem(STORAGE_KEY));
  if (current) return current;
  const legacy = parseSettings(localStorage.getItem(LEGACY_STORAGE_KEY));
  if (legacy) {
    saveSettings(legacy);
    return legacy;
  }
  return defaultLearningReminderSettings();
}

function available() {
  return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('LocalNotifications');
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function atTime(day: Date, hour: number, minute: number) {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute, 0, 0);
}

function dailyIds() {
  return Array.from({ length: DAYS_AHEAD }, (_, offset) => ({ id: DAILY_ID_BASE + offset }));
}

async function cancelOwned() {
  if (!available()) return;
  await LocalNotifications.cancel({
    notifications: [...dailyIds(), { id: STAMINA_ID }, { id: LEGACY_TEST_ID }],
  });
}

function firstDailyAt(settings: LearningReminderSettings, playedToday: boolean, now: Date) {
  const first = atTime(now, settings.hour, settings.minute);
  if (playedToday || first.getTime() <= now.getTime() + 60_000) first.setDate(first.getDate() + 1);
  return first;
}

function staminaAt(resetAt: number, now: Date) {
  const result = atTime(new Date(resetAt), 9, 0);
  if (result.getTime() <= now.getTime() + 60_000) result.setDate(result.getDate() + 1);
  return result;
}

export async function getLearningReminderDiagnostics(): Promise<LearningReminderDiagnostics> {
  if (!available()) return { available: false, permission: 'unavailable', pendingCount: 0 };
  const permission = await LocalNotifications.checkPermissions();
  const pending = await LocalNotifications.getPending();
  const ids = new Set([...dailyIds().map(item => item.id), STAMINA_ID]);
  return {
    available: true,
    permission: permission.display,
    pendingCount: pending.notifications.filter(item => ids.has(item.id)).length,
  };
}

export async function refreshLearningReminder(context: LearningReminderContext): Promise<LearningReminderResult> {
  if (available()) {
    // Also clean QA leftovers when the user has since disabled real reminders.
    await LocalNotifications.cancel({ notifications: [{ id: LEGACY_TEST_ID }] });
  }
  let settings = readLearningReminderSettings();
  if (!settings.enabled && !settings.pendingSystemEnable) return 'disabled';
  if (!available()) return 'unavailable';
  const permission = await LocalNotifications.checkPermissions();
  if (permission.display !== 'granted') {
    saveSettings({ ...settings, enabled: false });
    await cancelOwned();
    return 'denied';
  }
  if (settings.pendingSystemEnable) {
    settings = { ...settings, enabled: true, pendingSystemEnable: false };
    saveSettings(settings);
  }

  const now = context.now ?? new Date();
  const playedToday = context.playedToday || settings.lastPlayedDay === dayKey(now);
  const dueCount = Math.max(0, Math.floor(context.dueReviewCount ?? 0));
  const first = firstDailyAt(settings, playedToday, now);
  const energyAt = settings.staminaEnabled && !context.hasPremiumAccess &&
    (context.staminaValue ?? 1) <= 0 && typeof context.nextStaminaAt === 'number'
    ? staminaAt(context.nextStaminaAt, now)
    : null;
  const energyDay = energyAt ? dayKey(energyAt) : null;
  const past = (settings.scheduledEntries ?? []).filter(entry => entry.day < dayKey(now)).slice(-NOTIFICATION_HISTORY_SIZE);
  const planned: NotificationRotationEntry[] = [];
  let recent = past.length ? past.map(entry => entry.index) : [...(settings.recentIndexes ?? [])];
  const quoteFor = (at: Date, kind: 'daily' | 'stamina') => {
    const day = dayKey(at);
    const options = { locale: context.locale, day, hour: at.getHours(), kind,
      lastPlayedDay: settings.lastPlayedDay, recentIndexes: recent };
    const cached = settings.scheduledEntries?.find(entry => entry.day === day && entry.kind === kind);
    const index = cached && eligibleNotificationIndex(cached.index, options) && !recent.includes(cached.index)
      ? cached.index : pickNotificationIndex(options);
    recent = [...recent, index].slice(-NOTIFICATION_HISTORY_SIZE);
    planned.push({ day, index, kind });
    return NOTIFICATION_COPY[context.locale][index];
  };

  const notifications: Array<{
    id: number;
    title: string;
    body: string;
    schedule: { at: Date; allowWhileIdle: boolean };
    sound: string;
    extra: { source: string };
  }> = [];

  if (settings.reviewEnabled || settings.streakEnabled) {
    for (let offset = 0; offset < DAYS_AHEAD; offset += 1) {
      const at = new Date(first);
      at.setDate(first.getDate() + offset);
      if (energyDay === dayKey(at)) continue;
      const review = offset === 0 && settings.reviewEnabled && dueCount > 0;
      if (!review && !settings.streakEnabled) continue;
      notifications.push({
        id: DAILY_ID_BASE + offset,
        title: 'LingoMatch',
        body: review ? EVENT_COPY[context.locale].review(dueCount) : quoteFor(at, 'daily'),
        schedule: { at, allowWhileIdle: true },
        sound: 'default',
        extra: { source: review ? 'review-reminder' : 'streak-reminder' },
      });
    }
  }

  if (energyAt) {
    notifications.push({
      id: STAMINA_ID,
      title: 'LingoMatch',
      body: quoteFor(energyAt, 'stamina'),
      schedule: { at: energyAt, allowWhileIdle: true },
      sound: 'default',
      extra: { source: 'stamina-reminder' },
    });
  }

  await cancelOwned();
  if (notifications.length > 0) await LocalNotifications.schedule({ notifications });
  saveSettings({ ...readLearningReminderSettings(),
    recentIndexes: past.map(entry => entry.index),
    scheduledEntries: [...past, ...planned].sort((a, b) => a.day.localeCompare(b.day)),
  });
  return 'enabled';
}

export async function enableLearningReminders(context: LearningReminderContext): Promise<LearningReminderResult> {
  if (!available()) return 'unavailable';
  const previousPermission = await LocalNotifications.checkPermissions();
  if (previousPermission.display === 'denied') {
    // Re-requesting cannot show the iOS prompt again. Only an explicit tap
    // opens Settings; foreground refresh never opens it or grants permission.
    saveSettings({ ...readLearningReminderSettings(), enabled: false, pendingSystemEnable: true,
      reviewEnabled: true, streakEnabled: true, staminaEnabled: true, newContentEnabled: true,
      contentConsentVersion: 1, contentConsentAt: Date.now() });
    try {
      await NotificationSettings.openNotifications();
    } catch {
      saveSettings({ ...readLearningReminderSettings(), pendingSystemEnable: false });
      return 'unavailable';
    }
    return 'denied';
  }
  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') {
    saveSettings({ ...readLearningReminderSettings(), enabled: false, pendingSystemEnable: false });
    return 'denied';
  }
  saveSettings({
    ...readLearningReminderSettings(),
    enabled: true,
    pendingSystemEnable: false,
    reviewEnabled: true,
    streakEnabled: true,
    staminaEnabled: true,
    newContentEnabled: true,
    contentConsentVersion: 1,
    contentConsentAt: Date.now(),
  });
  return refreshLearningReminder(context);
}

export async function disableLearningReminders(): Promise<LearningReminderResult> {
  saveSettings({ ...readLearningReminderSettings(), enabled: false, pendingSystemEnable: false });
  await cancelOwned();
  return 'disabled';
}

export async function setLearningReminderCategory(
  category: LearningReminderCategory,
  enabled: boolean,
  context: LearningReminderContext,
): Promise<LearningReminderResult> {
  const current = readLearningReminderSettings();
  saveSettings({
    ...current,
    [`${category}Enabled`]: enabled,
    ...(category === 'newContent' && enabled ? { contentConsentVersion: 1, contentConsentAt: Date.now() } : {}),
  } as LearningReminderSettings);
  return current.enabled ? refreshLearningReminder(context) : 'disabled';
}

export async function setLearningReminderTime(time: string, context: LearningReminderContext) {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  const current = readLearningReminderSettings();
  if (!match) return current.enabled ? 'enabled' as const : 'disabled' as const;
  saveSettings({
    ...current,
    hour: clamp(Number(match[1]), 8, 21, DEFAULT_HOUR),
    minute: clamp(Number(match[2]), 0, 59, DEFAULT_MINUTE),
  });
  return current.enabled ? refreshLearningReminder(context) : 'disabled' as const;
}

export async function markLearningActivity(
  context: Omit<LearningReminderContext, 'playedToday'>,
): Promise<LearningReminderResult> {
  const now = context.now ?? new Date();
  const current = readLearningReminderSettings();
  if (current.lastPlayedDay === dayKey(now)) return current.enabled ? 'enabled' : 'disabled';
  saveSettings({ ...current, lastPlayedDay: dayKey(now) });
  return refreshLearningReminder({ ...context, playedToday: true, now });
}

export function shouldOfferLearningReminder(now = Date.now()) {
  const settings = readLearningReminderSettings();
  if (settings.enabled) return false;
  if (settings.inlinePromptDeferredAt) {
    return now - settings.inlinePromptDeferredAt >= 7 * 24 * 60 * 60 * 1000;
  }
  return settings.inlinePromptViews < 2;
}

export function recordInlineReminderView() {
  const settings = readLearningReminderSettings();
  const views = settings.inlinePromptViews + 1;
  saveSettings({ ...settings, inlinePromptViews: views });
  return views;
}

export function deferLearningReminder(now = Date.now()) {
  saveSettings({ ...readLearningReminderSettings(), inlinePromptDeferredAt: now });
}

export function recordLearningReminderPromptShown(now = Date.now()) {
  const settings = readLearningReminderSettings();
  saveSettings({
    ...settings,
    promptCount: Math.min(3, settings.promptCount + 1),
    promptLastShownAt: now,
  });
}

export function formatLearningReminderTime(settings: LearningReminderSettings) {
  return `${String(settings.hour).padStart(2, '0')}:${String(settings.minute).padStart(2, '0')}`;
}
