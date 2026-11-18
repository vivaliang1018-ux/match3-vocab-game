import { NOTIFICATION_COPY, NOTIFICATION_COPY_RANGES } from '../i18n/notificationCopy';
import type { Locale } from '../i18n/types';

export type NotificationRotationEntry = { day: string; index: number; kind: 'daily' | 'stamina' };
export const NOTIFICATION_HISTORY_SIZE = 7;
const FULL_ENERGY = new Set([22, 28, 40]);
const BEDTIME = new Set([5, 6, 7, 8, 9, 38]);
const COMMUTE = new Set([0, 1, 4, 39]);

type Options = {
  locale: Locale;
  day: string;
  hour: number;
  lastPlayedDay?: string;
  recentIndexes: readonly number[];
  kind: 'daily' | 'stamina';
};

function groupForHour(hour: number) {
  if (hour >= 17 && hour < 21) return 'commute';
  if (hour >= 21 || hour < 2) return 'bedtime';
  return hour % 2 === 0 ? 'bossy' : 'playful';
}

function yesterday(day: string) {
  const [year, month, date] = day.split('-').map(Number);
  const previous = new Date(year, month - 1, date - 1);
  return `${previous.getFullYear()}-${String(previous.getMonth() + 1).padStart(2, '0')}-${String(previous.getDate()).padStart(2, '0')}`;
}

export function eligibleNotificationIndex(index: number, options: Options): boolean {
  if (!Number.isInteger(index) || !NOTIFICATION_COPY[options.locale][index]) return false;
  if (options.kind === 'stamina') return FULL_ENERGY.has(index);
  // Future daily invitations cannot predict full energy or recent activity.
  if (FULL_ENERGY.has(index)) return false;
  if (index === 21 && options.lastPlayedDay !== yesterday(options.day)) return false;
  if (BEDTIME.has(index) && groupForHour(options.hour) !== 'bedtime') return false;
  if (COMMUTE.has(index) && groupForHour(options.hour) !== 'commute') return false;
  return true;
}

export function pickNotificationIndex(options: Options): number {
  const recent = new Set(options.recentIndexes.slice(-NOTIFICATION_HISTORY_SIZE));
  const all = NOTIFICATION_COPY[options.locale].map((_, index) => index)
    .filter(index => eligibleNotificationIndex(index, options));
  const [start, end] = NOTIFICATION_COPY_RANGES[groupForHour(options.hour)];
  const preferred = all.filter(index => index >= start && index < end && !recent.has(index));
  const fresh = all.filter(index => !recent.has(index));
  // Full-energy copy has only three variants. Repeat only after exhausting them.
  const candidates = preferred.length ? preferred : fresh.length ? fresh : all;
  let hash = 2166136261;
  for (const char of `${options.locale}:${options.day}:${options.hour}:${options.kind}`) {
    hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  }
  return candidates[(hash >>> 0) % candidates.length];
}
