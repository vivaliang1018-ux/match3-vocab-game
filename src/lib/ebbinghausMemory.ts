/**
 * Ebbinghaus-inspired spaced repetition for match-3 word popups.
 * Intervals after each successful recall (when popup shows at/after due time).
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
  /** Successful recalls completed (0 = seen once, not yet due). */
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

export function memoryKeyForWord(word: string): string {
  return word.trim().toLowerCase();
}

/**
 * Load memories for the signed-in user or guest; if signed in, merge in guest local progress once into the user bucket.
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
  return { map: merged, scope };
}

/**
 * Call when the game shows a word popup (user matched tiles).
 * If current time >= nextReviewAt (or first time), advance schedule.
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
    const next = {
      key,
      word: word.trim(),
      cn,
      stage: 0,
      lastReviewAt: now,
      nextReviewAt: now + intervalMsForStage(0),
      exposures: 1,
    };
    map.set(key, next);
    return map;
  }

  const due = now >= prev.nextReviewAt;
  const nextStage = due ? Math.min(prev.stage + 1, EBBINGHAUS_LABELS.length - 1) : prev.stage;
  const nextReviewAt = due ? now + intervalMsForStage(nextStage) : prev.nextReviewAt;

  map.set(key, {
    ...prev,
    word: word.trim(),
    cn: cn ?? prev.cn,
    lastReviewAt: now,
    nextReviewAt,
    stage: nextStage,
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
