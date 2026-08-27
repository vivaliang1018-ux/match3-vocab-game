import {
  claimGuestProgress,
  clearScopedProgress,
  readScopedProgress,
  writeScopedProgress,
} from './progressScope';

const STORAGE_KEY = 'smellycat-match3-round-learned-v1';

export function loadRoundLearnedIds(userUid?: string | null): string[] {
  claimGuestProgress(STORAGE_KEY, userUid, (accountRaw, guestRaw) => {
    try {
      const account = JSON.parse(accountRaw);
      const guest = JSON.parse(guestRaw);
      const ids = [
        ...(Array.isArray(account) ? account : []),
        ...(Array.isArray(guest) ? guest : []),
      ].filter((id): id is string => typeof id === 'string');
      return JSON.stringify([...new Set(ids)]);
    } catch {
      return accountRaw;
    }
  });
  try {
    const raw = readScopedProgress(STORAGE_KEY, userUid);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function saveRoundLearnedIds(ids: string[], userUid?: string | null): void {
  writeScopedProgress(STORAGE_KEY, JSON.stringify(ids), userUid);
}

export function clearRoundLearnedIds(userUid?: string | null): void {
  clearScopedProgress(STORAGE_KEY, userUid);
}

/** Words that cleared match-3 for the round and finished the quiz. */
export function markRoundLearnedItems(
  existing: string[],
  items: { id: string }[],
  userUid?: string | null,
): string[] {
  if (items.length === 0) return existing;
  const set = new Set(existing);
  for (const it of items) {
    if (it.id) set.add(it.id);
  }
  const next = [...set];
  saveRoundLearnedIds(next, userUid);
  return next;
}

export function roundLearnedItemIds(
  roundLearnedIds: string[],
  pool: { id: string }[],
): string[] {
  const learned = new Set(roundLearnedIds);
  return pool.filter((it) => learned.has(it.id)).map((it) => it.id);
}

export function roundLearnedCount(roundLearnedIds: string[], pool: { id: string }[]): number {
  return roundLearnedItemIds(roundLearnedIds, pool).length;
}
