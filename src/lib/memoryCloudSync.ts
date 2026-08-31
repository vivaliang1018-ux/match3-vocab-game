import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import {
  GUEST_MEMORY_SCOPE,
  hydrateMatch3Memories,
  loadWordMemoriesForScope,
  mergeWordMemoryMaps,
  saveWordMemoriesForScope,
  type WordMemory,
} from './ebbinghausMemory';
import { isFirebaseConfigured } from './firebaseCore';
import { getFirebaseDb } from './firebaseDb';
import {
  loadModeUnlocks,
  saveModeUnlocks,
  type ModeUnlockState,
} from './modeUnlocks';
import {
  loadPlayerSummary,
  mergePlayerSummaries,
  parsePlayerSummary,
  savePlayerSummary,
  type PlayerSummary,
} from './playerSummary';
import { loadRoundLearnedIds, saveRoundLearnedIds } from './roundLearned';
import {
  loadCategoryCycleProgress,
  mergeCategoryCycleProgress,
  parseCategoryCycleProgress,
  saveCategoryCycleProgress,
  type CategoryCycleProgress,
} from './categoryCycleProgress';

/** Firestore: users/{uid}/match3/state */
const MATCH3_COLLECTION = 'match3';
const MATCH3_STATE_DOC = 'state';

type CloudMemoryDoc = {
  memories?: unknown;
  learnedIds?: unknown;
  modeUnlocks?: unknown;
  playerSummary?: unknown;
  categoryCycles?: unknown;
  updatedAtMs?: number;
};

export type CoreProgressSnapshot = {
  learnedIds: string[];
  modeUnlocks: ModeUnlockState;
  playerSummary: PlayerSummary;
  categoryCycles: CategoryCycleProgress;
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

function parseLearnedIds(raw: unknown): string[] {
  return Array.isArray(raw)
    ? [...new Set(raw.filter((id): id is string => typeof id === 'string' && id.length > 0))]
    : [];
}

function parseModeUnlocks(raw: unknown): ModeUnlockState {
  const parsed = raw && typeof raw === 'object' ? raw as Partial<ModeUnlockState> : {};
  return {
    adventureClears: Math.max(0, Math.floor(Number(parsed.adventureClears) || 0)),
    reviewUnlockSeen: Boolean(parsed.reviewUnlockSeen),
    categoryUnlockSeen: Boolean(parsed.categoryUnlockSeen),
    pendingForcedReview: Boolean(parsed.pendingForcedReview),
  };
}

function mergeCoreProgress(local: CoreProgressSnapshot, cloud: CoreProgressSnapshot): CoreProgressSnapshot {
  return {
    learnedIds: [...new Set([...local.learnedIds, ...cloud.learnedIds])],
    modeUnlocks: {
      adventureClears: Math.max(
        local.modeUnlocks.adventureClears,
        cloud.modeUnlocks.adventureClears,
      ),
      reviewUnlockSeen:
        local.modeUnlocks.reviewUnlockSeen || cloud.modeUnlocks.reviewUnlockSeen,
      categoryUnlockSeen:
        local.modeUnlocks.categoryUnlockSeen || cloud.modeUnlocks.categoryUnlockSeen,
      pendingForcedReview:
        local.modeUnlocks.pendingForcedReview || cloud.modeUnlocks.pendingForcedReview,
    },
    playerSummary: mergePlayerSummaries(local.playerSummary, cloud.playerSummary),
    categoryCycles: mergeCategoryCycleProgress(
      local.categoryCycles,
      cloud.categoryCycles,
    ),
  };
}

export async function hydrateCoreProgressWithCloud(uid: string): Promise<CoreProgressSnapshot> {
  const initialLocal: CoreProgressSnapshot = {
    learnedIds: loadRoundLearnedIds(uid),
    modeUnlocks: loadModeUnlocks(uid),
    playerSummary: loadPlayerSummary(uid),
    categoryCycles: loadCategoryCycleProgress(uid),
  };
  if (!isFirebaseConfigured()) return initialLocal;
  try {
    const snap = await getDoc(memoriesDocRef(uid));
    // The player can keep learning while Firestore is in flight. Re-read the
    // local bucket after the await so a slow hydration can never flush the
    // stale snapshot captured when this function started.
    const latestLocal: CoreProgressSnapshot = {
      learnedIds: loadRoundLearnedIds(uid),
      modeUnlocks: loadModeUnlocks(uid),
      playerSummary: loadPlayerSummary(uid),
      categoryCycles: loadCategoryCycleProgress(uid),
    };
    if (!snap.exists()) {
      persistCoreProgress(uid, latestLocal, { flushCloud: true });
      return latestLocal;
    }
    const data = snap.data() as CloudMemoryDoc;
    const cloud: CoreProgressSnapshot = {
      learnedIds: parseLearnedIds(data.learnedIds),
      modeUnlocks: parseModeUnlocks(data.modeUnlocks),
      playerSummary: parsePlayerSummary(data.playerSummary),
      categoryCycles: parseCategoryCycleProgress(data.categoryCycles),
    };
    const merged = mergeCoreProgress(latestLocal, cloud);
    saveRoundLearnedIds(merged.learnedIds, uid);
    saveModeUnlocks(merged.modeUnlocks, uid);
    savePlayerSummary(merged.playerSummary, uid);
    saveCategoryCycleProgress(merged.categoryCycles, uid);
    persistCoreProgress(uid, merged, { flushCloud: true });
    return merged;
  } catch (error) {
    console.warn('[match3] cloud core progress fetch failed', error);
    return {
      learnedIds: loadRoundLearnedIds(uid),
      modeUnlocks: loadModeUnlocks(uid),
      playerSummary: loadPlayerSummary(uid),
      categoryCycles: loadCategoryCycleProgress(uid),
    };
  }
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

/** Remove cloud learning doc for account deletion. */
export async function deleteCloudWordMemories(uid: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  try {
    await deleteDoc(memoriesDocRef(uid));
  } catch (error) {
    console.warn('[match3] cloud memory delete failed', error);
    throw error;
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
  const initialLocal = hydrateMatch3Memories(userUid);
  if (!userUid || initialLocal.scope === GUEST_MEMORY_SCOPE) {
    return initialLocal;
  }

  const cloud = await fetchCloudWordMemories(userUid);
  // As with core progress, merge against the latest local state rather than
  // the snapshot from before the network request.
  const latestLocal = hydrateMatch3Memories(userUid);
  if (cloud.size === 0) {
    if (latestLocal.map.size > 0) {
      void pushCloudWordMemories(userUid, latestLocal.map);
    }
    return latestLocal;
  }

  const merged = mergeWordMemoryMaps(latestLocal.map, cloud);
  saveWordMemoriesForScope(merged, latestLocal.scope);
  void pushCloudWordMemories(userUid, merged);
  return { map: merged, scope: latestLocal.scope };
}

const pendingCloudWrites = new Map<string, number>();
const pendingCoreCloudWrites = new Map<string, number>();

export function persistCoreProgress(
  uid: string,
  progress: CoreProgressSnapshot,
  options?: { flushCloud?: boolean },
): void {
  if (!uid || !isFirebaseConfigured()) return;
  const existing = pendingCoreCloudWrites.get(uid);
  if (existing) window.clearTimeout(existing);
  const delay = options?.flushCloud ? 0 : 700;
  const timer = window.setTimeout(() => {
    pendingCoreCloudWrites.delete(uid);
    void setDoc(
      memoriesDocRef(uid),
      {
        learnedIds: progress.learnedIds,
        modeUnlocks: progress.modeUnlocks,
        playerSummary: progress.playerSummary,
        categoryCycles: progress.categoryCycles,
        updatedAtMs: Date.now(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    ).catch((error) => {
      console.warn('[match3] cloud core progress push failed', error);
    });
  }, delay);
  pendingCoreCloudWrites.set(uid, timer);
}

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
