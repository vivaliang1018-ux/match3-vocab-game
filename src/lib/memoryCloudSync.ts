import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
  GUEST_MEMORY_SCOPE,
  hydrateMatch3Memories,
  loadWordMemoriesForScope,
  mergeWordMemoryMaps,
  saveWordMemoriesForScope,
  type WordMemory,
} from './ebbinghausMemory';
import { getFirebaseDb, isFirebaseConfigured } from './firebase';

/** Firestore: users/{uid}/match3/state */
const MATCH3_COLLECTION = 'match3';
const MATCH3_STATE_DOC = 'state';

type CloudMemoryDoc = {
  memories?: unknown;
  updatedAtMs?: number;
};

function isWordMemory(value: unknown): value is WordMemory {
  if (!value || typeof value !== 'object') return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.key === 'string' &&
    typeof m.word === 'string' &&
    typeof m.stage === 'number' &&
    typeof m.lastReviewAt === 'number' &&
    typeof m.nextReviewAt === 'number' &&
    typeof m.exposures === 'number'
  );
}

function parseCloudMemories(raw: unknown): Map<string, WordMemory> {
  if (!Array.isArray(raw)) return new Map();
  const out = new Map<string, WordMemory>();
  for (const item of raw) {
    if (!isWordMemory(item)) continue;
    out.set(item.key, {
      key: item.key,
      word: item.word,
      cn: typeof item.cn === 'string' ? item.cn : undefined,
      stage: item.stage,
      lastReviewAt: item.lastReviewAt,
      nextReviewAt: item.nextReviewAt,
      exposures: item.exposures,
    });
  }
  return out;
}

function memoriesDocRef(uid: string) {
  return doc(getFirebaseDb(), 'users', uid, MATCH3_COLLECTION, MATCH3_STATE_DOC);
}

export async function fetchCloudWordMemories(uid: string): Promise<Map<string, WordMemory>> {
  if (!isFirebaseConfigured()) return new Map();
  try {
    const snap = await getDoc(memoriesDocRef(uid));
    if (!snap.exists()) return new Map();
    const data = snap.data() as CloudMemoryDoc;
    return parseCloudMemories(data.memories);
  } catch (error) {
    console.warn('[match3] cloud memory fetch failed', error);
    return new Map();
  }
}

export async function pushCloudWordMemories(
  uid: string,
  map: Map<string, WordMemory>,
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  try {
    await setDoc(
      memoriesDocRef(uid),
      {
        memories: [...map.values()],
        updatedAtMs: Date.now(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  } catch (error) {
    console.warn('[match3] cloud memory push failed', error);
  }
}

/**
 * Local hydrate + optional Firestore merge for signed-in users.
 * Guest progress is merged into the user bucket once, then cloud is merged in.
 */
export async function hydrateMatch3MemoriesWithCloud(userUid: string | null | undefined): Promise<{
  map: Map<string, WordMemory>;
  scope: string;
}> {
  const local = hydrateMatch3Memories(userUid);
  if (!userUid || local.scope === GUEST_MEMORY_SCOPE) {
    return local;
  }

  const cloud = await fetchCloudWordMemories(userUid);
  if (cloud.size === 0) {
    if (local.map.size > 0) {
      void pushCloudWordMemories(userUid, local.map);
    }
    return local;
  }

  const merged = mergeWordMemoryMaps(local.map, cloud);
  saveWordMemoriesForScope(merged, local.scope);
  void pushCloudWordMemories(userUid, merged);
  return { map: merged, scope: local.scope };
}

const pendingCloudWrites = new Map<string, number>();

/** Debounced cloud write; always writes localStorage immediately via saveWordMemoriesForScope. */
export function persistWordMemories(
  map: Map<string, WordMemory>,
  scope: string,
  options?: { flushCloud?: boolean },
): void {
  saveWordMemoriesForScope(map, scope);
  if (scope === GUEST_MEMORY_SCOPE || !isFirebaseConfigured()) return;

  const existing = pendingCloudWrites.get(scope);
  if (existing) window.clearTimeout(existing);

  const delay = options?.flushCloud ? 0 : 700;
  const timer = window.setTimeout(() => {
    pendingCloudWrites.delete(scope);
    void pushCloudWordMemories(scope, map);
  }, delay);
  pendingCloudWrites.set(scope, timer);
}

export function loadLocalWordMemories(scope: string): Map<string, WordMemory> {
  return loadWordMemoriesForScope(scope);
}
