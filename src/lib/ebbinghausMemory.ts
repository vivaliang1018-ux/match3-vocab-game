/**
 * Ebbinghaus-inspired spaced repetition.
 * - Board match popups only record exposure (no stage advance).
 * - Quiz success advances the schedule.
 * - Review / revive misses pull the word back to a shorter interval.
 */

export const EBBINGHAUS_LABELS = ['12 小时', '1 天', '2 天', '4 天', '7 天', '15 天', '30 天'] as const;

/** Milliseconds until next review after stage n (0-based). */
export function intervalMsForStage(stage: number): number {
  const table = [
    12 * 60 * 60 * 1000, // 12 h
    1 * 24 * 60 * 60 * 1000, // 1 d
    2 * 24 * 60 * 60 * 1000,
    4 * 24 * 60 * 60 * 1000,
    7 * 24 * 60 * 60 * 1000,
    15 * 24 * 60 * 60 * 1000,
    30 * 24 * 60 * 60 * 1000,
  ];
  const i = Math.min(Math.max(0, stage), table.length - 1);
  return table[i];
}

export type WordMemory = {
  key: string;
  word: string;
  cn?: string;
  /** Successful quiz recalls completed (0 = seen on board, not yet quizzed). */
  stage: number;
  lastReviewAt: number;
  nextReviewAt: number;
  exposures: number;
};

/** Per-user / guest memory buckets in localStorage. */
const STORAGE_KEY_PREFIX = 'match3-vocab-ebbinghaus-v1:';

export const GUEST_MEMORY_SCOPE = 'guest';

export function memoryScopeForUserId(uid: string | null | undefined): string {
  return uid && uid.length > 0 ? uid : GUEST_MEMORY_SCOPE;
}

function storageKeyForScope(scope: string): string {
  return `${STORAGE_KEY_PREFIX}${scope}`;
}

function parseMemoriesRaw(raw: string | null): Map<string, WordMemory> {
  if (!raw) return new Map();
  try {
    const arr = JSON.parse(raw) as WordMemory[];
    if (!Array.isArray(arr)) return new Map();
    return new Map(arr.map((m) => [m.key, m]));
  } catch {
    return new Map();
  }
}

/**
 * Merge two maps: for each word, keep the entry with stronger progress (stage, then exposures, then recency).
 */
export function mergeWordMemoryMaps(a: Map<string, WordMemory>, b: Map<string, WordMemory>): Map<string, WordMemory> {
  const out = new Map<string, WordMemory>();
  const keys = new Set<string>([...a.keys(), ...b.keys()]);
  for (const key of keys) {
    const x = a.get(key);
    const y = b.get(key);
    if (!x) out.set(key, y!);
    else if (!y) out.set(key, x);
    else {
      const pick =
        x.stage !== y.stage
          ? x.stage > y.stage
            ? x
            : y
          : x.exposures !== y.exposures
            ? x.exposures > y.exposures
              ? x
              : y
            : x.lastReviewAt >= y.lastReviewAt
              ? x
              : y;
      out.set(key, pick);
    }
  }
  return out;
}

export function loadWordMemoriesForScope(scope: string): Map<string, WordMemory> {
  return parseMemoriesRaw(localStorage.getItem(storageKeyForScope(scope)));
}

export function saveWordMemoriesForScope(map: Map<string, WordMemory>, scope: string) {
  try {
    localStorage.setItem(storageKeyForScope(scope), JSON.stringify([...map.values()]));
  } catch {
    // ignore quota
  }
}

export function clearWordMemoriesForScope(scope: string) {
  try {
    localStorage.removeItem(storageKeyForScope(scope));
  } catch {
    // ignore
  }
}

export function memoryKeyForWord(word: string): string {
  return word.trim().toLowerCase();
}

/**
 * Load memories for the signed-in user or guest. Signing in drains the guest
 * bucket into that account so the same guest data cannot leak into later users.
 */
export function hydrateMatch3Memories(userUid: string | null | undefined): {
  map: Map<string, WordMemory>;
  scope: string;
} {
  const scope = memoryScopeForUserId(userUid);
  if (scope === GUEST_MEMORY_SCOPE) {
    return { map: loadWordMemoriesForScope(GUEST_MEMORY_SCOPE), scope };
  }
  const userMap = loadWordMemoriesForScope(scope);
  const guestMap = loadWordMemoriesForScope(GUEST_MEMORY_SCOPE);
  const merged = mergeWordMemoryMaps(userMap, guestMap);
  saveWordMemoriesForScope(merged, scope);
  if (guestMap.size > 0) clearWordMemoriesForScope(GUEST_MEMORY_SCOPE);
  return { map: merged, scope };
}

/**
 * Board match popup: track exposure only — does not advance the forgetting curve.
 */
export function recordWordExposure(
  map: Map<string, WordMemory>,
  word: string,
  cn?: string,
): Map<string, WordMemory> {
  const key = memoryKeyForWord(word);
  const now = Date.now();
  const prev = map.get(key);
  if (!prev) {
    map.set(key, {
      key,
      word: word.trim(),
      cn,
      stage: 0,
      lastReviewAt: now,
      nextReviewAt: now + intervalMsForStage(0),
      exposures: 1,
    });
    return map;
  }

  map.set(key, {
    ...prev,
    word: word.trim(),
    cn: cn ?? prev.cn,
    lastReviewAt: now,
    exposures: prev.exposures + 1,
  });
  return map;
}

/**
 * Quiz passed: successful recall — advance stage and schedule the next review.
 */
export function recordWordRecallSuccess(
  map: Map<string, WordMemory>,
  word: string,
  cn?: string,
): Map<string, WordMemory> {
  const key = memoryKeyForWord(word);
  const now = Date.now();
  const prev = map.get(key);
  const nextStage = Math.min((prev?.stage ?? 0) + 1, EBBINGHAUS_LABELS.length - 1);
  map.set(key, {
    key,
    word: word.trim(),
    cn: cn ?? prev?.cn,
    stage: nextStage,
    lastReviewAt: now,
    nextReviewAt: now + intervalMsForStage(nextStage),
    exposures: (prev?.exposures ?? 0) + 1,
  });
  return map;
}

/**
 * Review / revive miss (wrong match or timeout): pull schedule back.
 * Stage drops by 1 (min 0); next review is due now at stage 0, else after the shorter interval.
 */
export function recordWordRecallFailure(
  map: Map<string, WordMemory>,
  word: string,
  cn?: string,
): Map<string, WordMemory> {
  const key = memoryKeyForWord(word);
  const now = Date.now();
  const prev = map.get(key);
  if (!prev) {
    map.set(key, {
      key,
      word: word.trim(),
      cn,
      stage: 0,
      lastReviewAt: now,
      nextReviewAt: now,
      exposures: 1,
    });
    return map;
  }

  const nextStage = Math.max(0, prev.stage - 1);
  map.set(key, {
    ...prev,
    word: word.trim(),
    cn: cn ?? prev.cn,
    stage: nextStage,
    lastReviewAt: now,
    // Already at the shortest stage → due immediately so it reappears in review picks.
    nextReviewAt: nextStage === 0 ? now : now + intervalMsForStage(nextStage),
    exposures: prev.exposures + 1,
  });
  return map;
}

/** stage >= 1 means the word was learned and reviewed at least once. */
export function isMasteredEmoji(m: WordMemory): boolean {
  return m.stage >= 1;
}

export function masteredEmojiItemIds(
  wordMemory: Map<string, WordMemory>,
  pool: { id: string; word: string }[],
): string[] {
  const ids: string[] = [];
  for (const item of pool) {
    const mem = wordMemory.get(memoryKeyForWord(item.word));
    if (mem && isMasteredEmoji(mem)) ids.push(item.id);
  }
  return ids;
}

export function masteredEmojiCount(
  wordMemory: Map<string, WordMemory>,
  pool: { id: string; word: string }[],
): number {
  return masteredEmojiItemIds(wordMemory, pool).length;
}

/**
 * Queue order for voluntary review: overdue / due first, then soonest schedule,
 * then oldest lastReviewAt — matches spaced-repetition “distant memories first”.
 */
export function compareWordsForSpacedReview(
  a: WordMemory | undefined,
  b: WordMemory | undefined,
  now = Date.now(),
): number {
  const aDue = a ? isDue(a, now) : true;
  const bDue = b ? isDue(b, now) : true;
  if (aDue !== bDue) return (bDue ? 1 : 0) - (aDue ? 1 : 0);

  if (aDue && bDue) {
    const aOverdue = now - (a?.nextReviewAt ?? 0);
    const bOverdue = now - (b?.nextReviewAt ?? 0);
    if (aOverdue !== bOverdue) return bOverdue - aOverdue;
  }

  const aNext = a?.nextReviewAt ?? 0;
  const bNext = b?.nextReviewAt ?? 0;
  if (aNext !== bNext) return aNext - bNext;

  const aLast = a?.lastReviewAt ?? 0;
  const bLast = b?.lastReviewAt ?? 0;
  if (aLast !== bLast) return aLast - bLast;

  const aStage = a?.stage ?? 0;
  const bStage = b?.stage ?? 0;
  if (aStage !== bStage) return aStage - bStage;

  return 0;
}

export function isDue(m: WordMemory, now = Date.now()): boolean {
  return now >= m.nextReviewAt;
}

export function formatCountdown(ms: number): string {
  if (ms <= 0) return '已到复习时间';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d} 天后`;
  if (h > 0) return `${h} 小时后`;
  if (m > 0) return `${m} 分钟后`;
  return `${s} 秒后`;
}
