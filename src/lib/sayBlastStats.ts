import {
  claimGuestProgress,
  clearScopedProgress,
  readScopedProgress,
  writeScopedProgress,
} from './progressScope';

const STORAGE_KEY = 'match3-say-blast-stats-v1';

export const SAY_BLAST_ATTEMPT_MILESTONES = [5, 10, 20, 50, 100] as const;

export type SayBlastStats = {
  attemptsStarted: number;
  roundsCompleted: number;
  totalBlasted: number;
  bestAccuracy: number | null;
  bestStreak: number;
};

export type SayBlastCompletion = {
  stats: SayBlastStats;
  newBestAccuracy: boolean;
  newBestStreak: boolean;
};

const DEFAULT_STATS: SayBlastStats = {
  attemptsStarted: 0,
  roundsCompleted: 0,
  totalBlasted: 0,
  bestAccuracy: null,
  bestStreak: 0,
};

function nonNegativeInteger(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : 0;
}

function normalizedAccuracy(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : null;
}

function saveSayBlastStats(
  stats: SayBlastStats,
  userUid?: string | null,
): SayBlastStats {
  writeScopedProgress(STORAGE_KEY, JSON.stringify(stats), userUid);
  return stats;
}

export function loadSayBlastStats(userUid?: string | null): SayBlastStats {
  claimGuestProgress(STORAGE_KEY, userUid);
  try {
    const raw = readScopedProgress(STORAGE_KEY, userUid);
    if (!raw) return { ...DEFAULT_STATS };
    const parsed = JSON.parse(raw) as Partial<SayBlastStats>;
    return {
      attemptsStarted: nonNegativeInteger(parsed.attemptsStarted),
      roundsCompleted: nonNegativeInteger(parsed.roundsCompleted),
      totalBlasted: nonNegativeInteger(parsed.totalBlasted),
      bestAccuracy: normalizedAccuracy(parsed.bestAccuracy),
      bestStreak: nonNegativeInteger(parsed.bestStreak),
    };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function clearSayBlastStats(userUid?: string | null): void {
  clearScopedProgress(STORAGE_KEY, userUid);
}

/** Count a challenge only once its first playable emoji is actually on screen. */
export function recordSayBlastAttemptStarted(
  userUid?: string | null,
): SayBlastStats {
  const current = loadSayBlastStats(userUid);
  return saveSayBlastStats(
    { ...current, attemptsStarted: current.attemptsStarted + 1 },
    userUid,
  );
}

/** Persist each real blast immediately so leaving a round does not lose it. */
export function recordSayBlastBlasted(
  userUid?: string | null,
): SayBlastStats {
  const current = loadSayBlastStats(userUid);
  return saveSayBlastStats(
    { ...current, totalBlasted: current.totalBlasted + 1 },
    userUid,
  );
}

export function recordSayBlastRoundCompleted(
  result: { accuracy: number | null; bestStreak: number },
  userUid?: string | null,
): SayBlastCompletion {
  const current = loadSayBlastStats(userUid);
  const hadCompletedRound = current.roundsCompleted > 0;
  const newBestAccuracy =
    hadCompletedRound &&
    result.accuracy !== null &&
    (current.bestAccuracy === null || result.accuracy > current.bestAccuracy);
  const newBestStreak =
    hadCompletedRound && result.bestStreak > current.bestStreak;
  const next: SayBlastStats = {
    ...current,
    roundsCompleted: current.roundsCompleted + 1,
    bestAccuracy:
      result.accuracy === null
        ? current.bestAccuracy
        : Math.max(current.bestAccuracy ?? 0, result.accuracy),
    bestStreak: Math.max(current.bestStreak, result.bestStreak),
  };
  return {
    stats: saveSayBlastStats(next, userUid),
    newBestAccuracy,
    newBestStreak,
  };
}

export function sayBlastAttemptMilestone(attemptNumber: number): number | null {
  return SAY_BLAST_ATTEMPT_MILESTONES.includes(
    attemptNumber as (typeof SAY_BLAST_ATTEMPT_MILESTONES)[number],
  )
    ? attemptNumber
    : null;
}
