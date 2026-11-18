import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NOTIFICATION_COPY, NOTIFICATION_COPY_RANGES, type NotificationCopyGroup } from '../i18n/notificationCopy';
import type { Locale } from '../i18n/types';

const STORAGE_KEY = 'lingomatch-learning-reminders-v1';
const NOTIFICATION_ID_BASE = 73001;
// Keep a month of reminders alive even if the player does not reopen the app.
// This stays well below iOS's pending-notification ceiling.
const SCHEDULE_AHEAD_DAYS = 30;
const DEFAULT_HOUR = 19;
const DEFAULT_MINUTE = 30;
const HISTORY_SIZE = 7;
const FULL_STAMINA_COPY_INDEXES = new Set([22, 28, 40]);

export type LearningReminderSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
  recentIndexes: number[];
  scheduledEntries: Array<{ day: string; index: number }>;
  lastPlayedDay?: string;
  /** Legacy single-entry fields retained only for migration. */
  scheduledDay?: string;
  scheduledIndex?: number;
};

export type LearningReminderResult = 'enabled' | 'disabled' | 'denied' | 'unavailable';

type RefreshOptions = {
  locale: Locale;
  hasPremiumAccess: boolean;
  playedToday: boolean;
  now?: Date;
};

export function defaultLearningReminderSettings(): LearningReminderSettings {
  return {
    enabled: false,
    hour: DEFAULT_HOUR,
    minute: DEFAULT_MINUTE,
    recentIndexes: [],
    scheduledEntries: [],
  };
}

function clampInt(value: unknown, min: number, max: number, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

export function readLearningReminderSettings(): LearningReminderSettings {
  const fallback = defaultLearningReminderSettings();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<LearningReminderSettings>;
    return {
      enabled: parsed.enabled === true,
      hour: clampInt(parsed.hour, 0, 23, fallback.hour),
      minute: clampInt(parsed.minute, 0, 59, fallback.minute),
      recentIndexes: Array.isArray(parsed.recentIndexes)
        ? parsed.recentIndexes.filter((value): value is number => Number.isInteger(value)).slice(-HISTORY_SIZE)
        : [],
      scheduledEntries: Array.isArray(parsed.scheduledEntries)
        ? parsed.scheduledEntries.filter(
            (entry): entry is { day: string; index: number } =>
              typeof entry?.day === 'string' && Number.isInteger(entry?.index),
          ).slice(0, SCHEDULE_AHEAD_DAYS)
        : [],
      lastPlayedDay: typeof parsed.lastPlayedDay === 'string' ? parsed.lastPlayedDay : undefined,
      scheduledDay: typeof parsed.scheduledDay === 'string' ? parsed.scheduledDay : undefined,
      scheduledIndex: Number.isInteger(parsed.scheduledIndex) ? parsed.scheduledIndex : undefined,
    };
  } catch {
    return fallback;
  }
}

function saveLearningReminderSettings(settings: LearningReminderSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Reminders still work for this session if storage is unavailable.
  }
}

function isNativeNotificationAvailable(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('LocalNotifications');
}

function localDayKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function nextReminderDate(settings: LearningReminderSettings, playedToday: boolean, now: Date): Date {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), settings.hour, settings.minute, 0, 0);
  if (playedToday || next.getTime() <= now.getTime() + 60_000) next.setDate(next.getDate() + 1);
  return next;
}

export function notificationGroupForHour(hour: number): NotificationCopyGroup {
  if (hour >= 17 && hour < 21) return 'commute';
  if (hour >= 21 || hour < 2) return 'bedtime';
  return hour % 2 === 0 ? 'bossy' : 'playful';
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function pickLearningReminderIndex(options: {
  locale: Locale;
  dayKey: string;
  hour: number;
  recentIndexes: readonly number[];
  hasPremiumAccess: boolean;
}): number {
  const group = notificationGroupForHour(options.hour);
  const [start, end] = NOTIFICATION_COPY_RANGES[group];
  const recent = new Set(options.recentIndexes.slice(-HISTORY_SIZE));
  let candidates = Array.from({ length: end - start }, (_, offset) => start + offset)
    .filter((index) => !recent.has(index))
    .filter((index) => !options.hasPremiumAccess || !FULL_STAMINA_COPY_INDEXES.has(index));
  if (candidates.length === 0) {
    // A time-specific group can be smaller than the seven-day cooldown. Broaden
    // to the full pool before allowing a repeat.
    candidates = NOTIFICATION_COPY[options.locale]
      .map((_, index) => index)
      .filter((index) => !recent.has(index))
      .filter((index) => !options.hasPremiumAccess || !FULL_STAMINA_COPY_INDEXES.has(index));
  }
  const hash = stableHash(`${options.locale}:${options.dayKey}:${group}`);
  return candidates[hash % candidates.length] ?? start;
}

async function cancelScheduledReminder(): Promise<void> {
  if (!isNativeNotificationAvailable()) return;
  await LocalNotifications.cancel({
    notifications: Array.from(
      { length: SCHEDULE_AHEAD_DAYS },
      (_, offset) => ({ id: NOTIFICATION_ID_BASE + offset }),
    ),
  });
}

export async function refreshLearningReminder(options: RefreshOptions): Promise<LearningReminderResult> {
  const settings = readLearningReminderSettings();
  if (!settings.enabled) return 'disabled';
  if (!isNativeNotificationAvailable()) return 'unavailable';

  const permission = await LocalNotifications.checkPermissions();
  if (permission.display !== 'granted') return 'denied';

  const now = options.now ?? new Date();
  const playedToday = options.playedToday || settings.lastPlayedDay === localDayKey(now);
  const firstAt = nextReminderDate(settings, playedToday, now);
  const existingEntries = new Map(settings.scheduledEntries.map((entry) => [entry.day, entry.index]));
  if (settings.scheduledDay && Number.isInteger(settings.scheduledIndex)) {
    existingEntries.set(settings.scheduledDay, settings.scheduledIndex as number);
  }
  let recentIndexes = [...settings.recentIndexes];
  const scheduledEntries: Array<{ day: string; index: number }> = [];
  const notifications = Array.from({ length: SCHEDULE_AHEAD_DAYS }, (_, offset) => {
    const at = new Date(firstAt);
    at.setDate(firstAt.getDate() + offset);
    const day = localDayKey(at);
    const existingIndex = existingEntries.get(day);
    const index = Number.isInteger(existingIndex)
      ? existingIndex as number
      : pickLearningReminderIndex({
          locale: options.locale,
          dayKey: day,
          hour: settings.hour,
          recentIndexes,
          hasPremiumAccess: options.hasPremiumAccess,
        });
    recentIndexes = [...recentIndexes.filter((value) => value !== index), index].slice(-HISTORY_SIZE);
    scheduledEntries.push({ day, index });
    return {
      id: NOTIFICATION_ID_BASE + offset,
      title: 'LingoMatch',
      body: NOTIFICATION_COPY[options.locale][index] ?? NOTIFICATION_COPY.en[index],
      schedule: { at, allowWhileIdle: true },
      sound: 'default',
      extra: { source: 'daily-learning-reminder', day },
    };
  });

  await cancelScheduledReminder();
  await LocalNotifications.schedule({ notifications });
  saveLearningReminderSettings({
    ...settings,
    recentIndexes,
    scheduledEntries,
    scheduledDay: undefined,
    scheduledIndex: undefined,
  });
  return 'enabled';
}

export async function enableLearningReminders(options: RefreshOptions): Promise<LearningReminderResult> {
  if (!isNativeNotificationAvailable()) return 'unavailable';
  const permission = await LocalNotifications.requestPermissions();
  if (permission.display !== 'granted') {
    saveLearningReminderSettings({ ...readLearningReminderSettings(), enabled: false });
    return 'denied';
  }
  saveLearningReminderSettings({ ...readLearningReminderSettings(), enabled: true });
  return refreshLearningReminder(options);
}

export async function markLearningActivity(
  options: Omit<RefreshOptions, 'playedToday'>,
): Promise<LearningReminderResult> {
  const now = options.now ?? new Date();
  const current = readLearningReminderSettings();
  const today = localDayKey(now);
  if (current.lastPlayedDay === today) return current.enabled ? 'enabled' : 'disabled';
  saveLearningReminderSettings({
    ...current,
    lastPlayedDay: today,
  });
  return refreshLearningReminder({ ...options, now, playedToday: true });
}

export async function disableLearningReminders(): Promise<LearningReminderResult> {
  saveLearningReminderSettings({
    ...readLearningReminderSettings(),
    enabled: false,
    scheduledEntries: [],
    scheduledDay: undefined,
    scheduledIndex: undefined,
  });
  await cancelScheduledReminder();
  return 'disabled';
}

export async function setLearningReminderTime(
  time: string,
  options: RefreshOptions,
): Promise<LearningReminderResult> {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) return readLearningReminderSettings().enabled ? 'enabled' : 'disabled';
  const hour = clampInt(Number(match[1]), 0, 23, DEFAULT_HOUR);
  const minute = clampInt(Number(match[2]), 0, 59, DEFAULT_MINUTE);
  const current = readLearningReminderSettings();
  saveLearningReminderSettings({
    ...current,
    hour,
    minute,
    scheduledEntries: [],
    scheduledDay: undefined,
    scheduledIndex: undefined,
  });
  if (!current.enabled) return 'disabled';
  return refreshLearningReminder(options);
}

export function formatLearningReminderTime(settings: LearningReminderSettings): string {
  return `${String(settings.hour).padStart(2, '0')}:${String(settings.minute).padStart(2, '0')}`;
}
