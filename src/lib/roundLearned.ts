const STORAGE_KEY = 'smellycat-match3-round-learned-v1';

export function loadRoundLearnedIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function saveRoundLearnedIds(ids: string[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore quota
  }
}

/** Words that cleared match-3 for the round and finished the quiz. */
export function markRoundLearnedItems(
  existing: string[],
  items: { id: string }[],
): string[] {
  if (items.length === 0) return existing;
  const set = new Set(existing);
  for (const it of items) {
    if (it.id) set.add(it.id);
  }
  const next = [...set];
  saveRoundLearnedIds(next);
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
