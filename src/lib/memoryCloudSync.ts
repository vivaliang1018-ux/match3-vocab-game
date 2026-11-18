import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { getActiveCourseId } from '../course';
import { COURSES, type CourseId } from '../courseConfig';
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
import {
  courseCloudStateDocId,
  LEGACY_MATCH3_STATE_DOC,
} from './courseCloudProgress';

/** Firestore: users/{uid}/match3/state */
const MATCH3_COLLECTION = 'match3';

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

function memoriesDocRef(uid: string, courseId: CourseId) {
  return doc(getFirebaseDb(), 'users', uid, MATCH3_COLLECTION, courseCloudStateDocId(courseId));
}

function legacyMemoriesDocRef(uid: string) {
  return doc(getFirebaseDb(), 'users', uid, MATCH3_COLLECTION, LEGACY_MATCH3_STATE_DOC);
}

async function getCourseCloudSnapshot(uid: string, courseId: CourseId) {
  // The legacy document may already contain several courses merged together.
  // Preserve it for recovery, but never guess which course owns those IDs.
  return getDoc(memoriesDocRef(uid, courseId));
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

export async function hydrateCoreProgressWithCloud(
  uid: string,
  courseId: CourseId = getActiveCourseId(),
): Promise<CoreProgressSnapshot> {
  const initialLocal: CoreProgressSnapshot = {
    learnedIds: loadRoundLearnedIds(uid, courseId),
    modeUnlocks: loadModeUnlocks(uid, courseId),
    playerSummary: loadPlayerSummary(uid, courseId),
    categoryCycles: loadCategoryCycleProgress(uid, courseId),
  };
  if (!isFirebaseConfigured()) return initialLocal;
  try {
    const snap = await getCourseCloudSnapshot(uid, courseId);
    // The player can keep learning while Firestore is in flight. Re-read the
    // local bucket after the await so a slow hydration can never flush the
    // stale snapshot captured when this function started.
    const latestLocal: CoreProgressSnapshot = {
      learnedIds: loadRoundLearnedIds(uid, courseId),
      modeUnlocks: loadModeUnlocks(uid, courseId),
      playerSummary: loadPlayerSummary(uid, courseId),
      categoryCycles: loadCategoryCycleProgress(uid, courseId),
    };
    if (!snap.exists()) {
      persistCoreProgress(uid, latestLocal, { flushCloud: true, courseId });
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
    saveRoundLearnedIds(merged.learnedIds, uid, courseId);
    saveModeUnlocks(merged.modeUnlocks, uid, courseId);
    savePlayerSummary(merged.playerSummary, uid, courseId);
    saveCategoryCycleProgress(merged.categoryCycles, uid, courseId);
    persistCoreProgress(uid, merged, { flushCloud: true, courseId });
    return merged;
  } catch (error) {
    console.warn('[match3] cloud core progress fetch failed', error);
    return {
      learnedIds: loadRoundLearnedIds(uid, courseId),
      modeUnlocks: loadModeUnlocks(uid, courseId),
      playerSummary: loadPlayerSummary(uid, courseId),
      categoryCycles: loadCategoryCycleProgress(uid, courseId),
    };
  }
}

export async function fetchCloudWordMemories(
  uid: string,
  courseId: CourseId = getActiveCourseId(),
): Promise<Map<string, WordMemory>> {
  if (!isFirebaseConfigured()) return new Map();
  try {
    const snap = await getCourseCloudSnapshot(uid, courseId);
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
  courseId: CourseId = getActiveCourseId(),
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  try {
    await setDoc(
      memoriesDocRef(uid, courseId),
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
    await Promise.all([
      deleteDoc(legacyMemoriesDocRef(uid)),
      ...COURSES.map((course) => deleteDoc(memoriesDocRef(uid, course.id))),
    ]);
  } catch (error) {
    console.warn('[match3] cloud memory delete failed', error);
    throw error;
  }
}

/**
 * Local hydrate + optional Firestore merge for signed-in users.
 * Guest progress is merged into the user bucket once, then cloud is merged in.
 */
export async function hydrateMatch3MemoriesWithCloud(
  userUid: string | null | undefined,
  courseId: CourseId = getActiveCourseId(),
): Promise<{
  map: Map<string, WordMemory>;
  scope: string;
}> {
  const initialLocal = hydrateMatch3Memories(userUid, courseId);
  if (!userUid || initialLocal.scope === GUEST_MEMORY_SCOPE) {
    return initialLocal;
  }

  const cloud = await fetchCloudWordMemories(userUid, courseId);
  // As with core progress, merge against the latest local state rather than
  // the snapshot from before the network request.
  const latestLocal = hydrateMatch3Memories(userUid, courseId);
  if (cloud.size === 0) {
    if (latestLocal.map.size > 0) {
      void pushCloudWordMemories(userUid, latestLocal.map, courseId);
    }
    return latestLocal;
  }

  const merged = mergeWordMemoryMaps(latestLocal.map, cloud);
  saveWordMemoriesForScope(merged, latestLocal.scope, courseId);
  void pushCloudWordMemories(userUid, merged, courseId);
  return { map: merged, scope: latestLocal.scope };
}

const pendingCloudWrites = new Map<string, number>();
const pendingCoreCloudWrites = new Map<string, number>();

export function persistCoreProgress(
  uid: string,
  progress: CoreProgressSnapshot,
  options?: { flushCloud?: boolean; courseId?: CourseId },
): void {
  if (!uid || !isFirebaseConfigured()) return;
  const courseId = options?.courseId ?? getActiveCourseId();
  const pendingKey = `${uid}:${courseId}`;
  const existing = pendingCoreCloudWrites.get(pendingKey);
  if (existing) window.clearTimeout(existing);
  const delay = options?.flushCloud ? 0 : 700;
  const timer = window.setTimeout(() => {
    pendingCoreCloudWrites.delete(pendingKey);
    void setDoc(
      memoriesDocRef(uid, courseId),
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
  pendingCoreCloudWrites.set(pendingKey, timer);
}

/** Debounced cloud write; always writes localStorage immediately via saveWordMemoriesForScope. */
export function persistWordMemories(
  map: Map<string, WordMemory>,
  scope: string,
  options?: { flushCloud?: boolean; courseId?: CourseId },
): void {
  const courseId = options?.courseId ?? getActiveCourseId();
  saveWordMemoriesForScope(map, scope, courseId);
  if (scope === GUEST_MEMORY_SCOPE || !isFirebaseConfigured()) return;

  const pendingKey = `${scope}:${courseId}`;
  const existing = pendingCloudWrites.get(pendingKey);
  if (existing) window.clearTimeout(existing);

  const delay = options?.flushCloud ? 0 : 700;
  const timer = window.setTimeout(() => {
    pendingCloudWrites.delete(pendingKey);
    void pushCloudWordMemories(scope, map, courseId);
  }, delay);
  pendingCloudWrites.set(pendingKey, timer);
}

export function loadLocalWordMemories(scope: string, courseId?: CourseId): Map<string, WordMemory> {
  return loadWordMemoriesForScope(scope, courseId);
}
