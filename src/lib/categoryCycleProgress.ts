import {
  claimGuestProgress,
  clearScopedProgress,
  readScopedProgress,
  writeScopedProgress,
} from './progressScope';

const STORAGE_KEY = 'match3-category-cycles-v1';

export type CategoryCycleEntry = {
  cycle: number;
  clearedItemIds: string[];
};

export type CategoryCycleProgress = {
  version: 1;
  categories: Record<string, CategoryCycleEntry>;
};

export type CategoryCycleCompletion = {
  categoryId: string;
  previousCycle: number;
  cycle: number;
  completedCycle: boolean;
  clearedInCycle: number;
  total: number;
};

const EMPTY_PROGRESS: CategoryCycleProgress = { version: 1, categories: {} };

function parseEntry(value: unknown): CategoryCycleEntry | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Partial<CategoryCycleEntry>;
  const cycle =
    typeof candidate.cycle === 'number' && Number.isFinite(candidate.cycle)
      ? Math.max(1, Math.floor(candidate.cycle))
      : 1;
  const clearedItemIds = Array.isArray(candidate.clearedItemIds)
    ? [...new Set(candidate.clearedItemIds.filter((id): id is string => typeof id === 'string'))]
    : [];
  return { cycle, clearedItemIds };
}

export function parseCategoryCycleProgress(raw: unknown): CategoryCycleProgress {
  if (!raw) return { ...EMPTY_PROGRESS, categories: {} };
  try {
    const candidate = (
      typeof raw === 'string' ? JSON.parse(raw) : raw
    ) as Partial<CategoryCycleProgress>;
    const categories: Record<string, CategoryCycleEntry> = {};
    if (candidate.categories && typeof candidate.categories === 'object') {
      for (const [categoryId, value] of Object.entries(candidate.categories)) {
        const entry = parseEntry(value);
        if (entry) categories[categoryId] = entry;
      }
    }
    return { version: 1, categories };
  } catch {
    return { ...EMPTY_PROGRESS, categories: {} };
  }
}

export function mergeCategoryCycleProgress(
  account: CategoryCycleProgress,
  guest: CategoryCycleProgress,
): CategoryCycleProgress {
  const categories = { ...account.categories };
  for (const [categoryId, guestEntry] of Object.entries(guest.categories)) {
    const accountEntry = categories[categoryId];
    if (!accountEntry || guestEntry.cycle > accountEntry.cycle) {
      categories[categoryId] = guestEntry;
    } else if (guestEntry.cycle === accountEntry.cycle) {
      categories[categoryId] = {
        cycle: accountEntry.cycle,
        clearedItemIds: [
          ...new Set([...accountEntry.clearedItemIds, ...guestEntry.clearedItemIds]),
        ],
      };
    }
  }
  return { version: 1, categories };
}

function mergeProgress(accountRaw: string, guestRaw: string): string {
  return JSON.stringify(
    mergeCategoryCycleProgress(
      parseCategoryCycleProgress(accountRaw),
      parseCategoryCycleProgress(guestRaw),
    ),
  );
}

export function loadCategoryCycleProgress(
  userUid?: string | null,
): CategoryCycleProgress {
  claimGuestProgress(STORAGE_KEY, userUid, mergeProgress);
  return parseCategoryCycleProgress(readScopedProgress(STORAGE_KEY, userUid));
}

export function saveCategoryCycleProgress(
  progress: CategoryCycleProgress,
  userUid?: string | null,
): void {
  writeScopedProgress(STORAGE_KEY, JSON.stringify(progress), userUid);
}

export function clearCategoryCycleProgress(userUid?: string | null): void {
  clearScopedProgress(STORAGE_KEY, userUid);
}

export function categoryCycleEntry(
  progress: CategoryCycleProgress,
  categoryId: string,
  validItemIds: readonly string[],
): CategoryCycleEntry {
  const valid = new Set(validItemIds);
  const stored = progress.categories[categoryId] ?? { cycle: 1, clearedItemIds: [] };
  return {
    cycle: Math.max(1, stored.cycle),
    clearedItemIds: stored.clearedItemIds.filter((id) => valid.has(id)),
  };
}

function shuffled<T>(values: readonly T[]): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

/**
 * Draw a category board without returning already-cleared words while enough
 * unfinished words remain. If the cycle tail has fewer than `count`, take all
 * tail words and fill from a freshly shuffled next cycle.
 *
 * Merely drawing does not mutate progress. Only quiz completion commits it.
 */
export function pickCategoryCycleItems<T extends { id: string }>(
  pool: readonly T[],
  count: number,
  entry: CategoryCycleEntry,
  excludeIds?: ReadonlySet<string>,
): T[] {
  if (pool.length < count || count <= 0) return [];
  const cleared = new Set(entry.clearedItemIds);
  const remaining = pool.filter((item) => !cleared.has(item.id));
  const preferredRemaining = excludeIds
    ? remaining.filter((item) => !excludeIds.has(item.id))
    : remaining;

  if (remaining.length >= count) {
    const preferred = shuffled(preferredRemaining);
    if (preferred.length >= count) return preferred.slice(0, count);
    const fallback = shuffled(
      remaining.filter((item) => !preferred.some((candidate) => candidate.id === item.id)),
    );
    return [...preferred, ...fallback].slice(0, count);
  }

  const tail = shuffled(remaining);
  const tailIds = new Set(tail.map((item) => item.id));
  const nextCycleCandidates = pool.filter(
    (item) =>
      !tailIds.has(item.id) &&
      (!excludeIds || !excludeIds.has(item.id)),
  );
  const nextCycleFallback = pool.filter(
    (item) => !tailIds.has(item.id) && !nextCycleCandidates.some((it) => it.id === item.id),
  );
  return [
    ...tail,
    ...shuffled(nextCycleCandidates),
    ...shuffled(nextCycleFallback),
  ].slice(0, count);
}

/** Commit one successfully completed category board as an atomic unit. */
export function completeCategoryCycleBoard(
  progress: CategoryCycleProgress,
  categoryId: string,
  validItemIds: readonly string[],
  completedBoardItemIds: readonly string[],
): { progress: CategoryCycleProgress; completion: CategoryCycleCompletion } {
  const entry = categoryCycleEntry(progress, categoryId, validItemIds);
  const valid = new Set(validItemIds);
  const boardIds = [...new Set(completedBoardItemIds.filter((id) => valid.has(id)))];
  const alreadyCleared = new Set(entry.clearedItemIds);
  const remaining = validItemIds.filter((id) => !alreadyCleared.has(id));
  const boardSet = new Set(boardIds);
  const completesCurrentCycle =
    remaining.length > 0 && remaining.every((id) => boardSet.has(id));

  let nextEntry: CategoryCycleEntry;
  if (completesCurrentCycle) {
    const remainingSet = new Set(remaining);
    nextEntry = {
      cycle: entry.cycle + 1,
      // A transition board can contain the final current-cycle words plus the
      // first words of the next cycle. Count only those next-cycle fillers.
      clearedItemIds: boardIds.filter((id) => !remainingSet.has(id)),
    };
  } else {
    nextEntry = {
      cycle: entry.cycle,
      clearedItemIds: [
        ...new Set([...entry.clearedItemIds, ...boardIds.filter((id) => !alreadyCleared.has(id))]),
      ],
    };
  }

  const nextProgress: CategoryCycleProgress = {
    version: 1,
    categories: {
      ...progress.categories,
      [categoryId]: nextEntry,
    },
  };
  return {
    progress: nextProgress,
    completion: {
      categoryId,
      previousCycle: entry.cycle,
      cycle: nextEntry.cycle,
      completedCycle: completesCurrentCycle,
      clearedInCycle: nextEntry.clearedItemIds.length,
      total: validItemIds.length,
    },
  };
}
