import { ADVENTURE_SETS_PER_FORCED_REVIEW, ADVENTURE_WORDS_PER_SET } from './adventureRules';
import {
  claimGuestProgress,
  clearScopedProgress,
  readScopedProgress,
  writeScopedProgress,
} from './progressScope';

const STORAGE_KEY = 'match3-adventure-set-history-v1';

/** Rolling list of recently cleared adventure sets (each set = 6 word item ids). */
export type AdventureSetHistory = string[][];

export function loadAdventureSetHistory(userUid?: string | null): AdventureSetHistory {
  claimGuestProgress(STORAGE_KEY, userUid);
  try {
    const raw = readScopedProgress(STORAGE_KEY, userUid);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((set): set is unknown[] => Array.isArray(set))
      .map((set) => set.filter((id): id is string => typeof id === 'string' && id.length > 0))
      .filter((set) => set.length > 0)
      .slice(-ADVENTURE_SETS_PER_FORCED_REVIEW);
  } catch {
    return [];
  }
}

export function saveAdventureSetHistory(
  history: AdventureSetHistory,
  userUid?: string | null,
): void {
  writeScopedProgress(
    STORAGE_KEY,
    JSON.stringify(history.slice(-ADVENTURE_SETS_PER_FORCED_REVIEW)),
    userUid,
  );
}

export function clearAdventureSetHistory(userUid?: string | null): void {
  clearScopedProgress(STORAGE_KEY, userUid);
}

/** Append a cleared adventure set; keep only the last N sets used for forced review. */
export function pushAdventureClearedSet(
  history: AdventureSetHistory,
  itemIds: string[],
  userUid?: string | null,
): AdventureSetHistory {
  const cleaned = [...new Set(itemIds.filter(Boolean))];
  if (cleaned.length === 0) return history;
  const next = [...history, cleaned].slice(-ADVENTURE_SETS_PER_FORCED_REVIEW);
  saveAdventureSetHistory(next, userUid);
  return next;
}

/** Unique item ids across the rolling cleared-set window. */
export function adventureHistoryItemIds(history: AdventureSetHistory): string[] {
  const ids = new Set<string>();
  for (const set of history) {
    for (const id of set) ids.add(id);
  }
  return [...ids];
}

/**
 * Forced review pool: even mix from the last N adventure clears
 * (typically 2 words from each of 3 sets → 6), then shuffle.
 * Pads from `fallbackPool` when history is thin (e.g. mid-upgrade).
 */
export function pickForcedReviewItems<T extends { id: string }>(
  history: AdventureSetHistory,
  poolById: Map<string, T>,
  count = ADVENTURE_WORDS_PER_SET,
  fallbackPool: T[] = [],
): T[] {
  const seen = new Set<string>();
  const queues: T[][] = [];

  for (const set of history) {
    const items: T[] = [];
    for (const id of set) {
      if (seen.has(id)) continue;
      const item = poolById.get(id);
      if (!item) continue;
      seen.add(id);
      items.push(item);
    }
    if (items.length === 0) continue;
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    queues.push(items);
  }

  const picks: T[] = [];
  // Round-robin so the board isn't dominated by the most recent clear.
  while (picks.length < count && queues.some((q) => q.length > 0)) {
    for (const q of queues) {
      if (picks.length >= count) break;
      const item = q.shift();
      if (item) picks.push(item);
    }
  }

  if (picks.length < count) {
    for (const item of fallbackPool) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      picks.push(item);
      if (picks.length >= count) break;
    }
  }

  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }
  return picks.slice(0, Math.min(count, picks.length));
}
