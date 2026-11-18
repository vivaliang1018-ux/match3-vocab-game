import {
  claimGuestProgress,
  clearScopedProgress,
  readScopedProgress,
  writeScopedProgress,
} from './progressScope';
import { getActiveCourseId } from '../course';
import type { CourseId } from '../courseConfig';

const STORAGE_KEY = 'match3-mode-unlocks-v1';
const courseStorageKey = (courseId: CourseId = getActiveCourseId()) => `${STORAGE_KEY}:${courseId}`;
export const CATEGORY_UNLOCK_CLEARS = 3;

export type ModeUnlockState = {
  /** Adventure rounds fully cleared (board + quiz). */
  adventureClears: number;
  /** User has seen the review unlock prompt. */
  reviewUnlockSeen: boolean;
  /** User has seen the category unlock prompt. */
  categoryUnlockSeen: boolean;
  /**
   * Mandatory review after every 3 adventure clears.
   * Stays true if the player leaves mid-exam until they finish a review quiz.
   */
  pendingForcedReview: boolean;
};

const DEFAULT_UNLOCKS: ModeUnlockState = {
  adventureClears: 0,
  reviewUnlockSeen: false,
  categoryUnlockSeen: false,
  pendingForcedReview: false,
};

function parseModeUnlocks(raw: string): ModeUnlockState {
  try {
    const parsed = JSON.parse(raw) as Partial<ModeUnlockState>;
    return {
      adventureClears:
        typeof parsed.adventureClears === 'number' ? Math.max(0, parsed.adventureClears) : 0,
      reviewUnlockSeen: Boolean(parsed.reviewUnlockSeen),
      categoryUnlockSeen: Boolean(parsed.categoryUnlockSeen),
      pendingForcedReview: Boolean(parsed.pendingForcedReview),
    };
  } catch {
    return { ...DEFAULT_UNLOCKS };
  }
}

export function loadModeUnlocks(userUid?: string | null, courseId?: CourseId): ModeUnlockState {
  const key = courseStorageKey(courseId);
  claimGuestProgress(key, userUid, (accountRaw, guestRaw) => {
    const account = parseModeUnlocks(accountRaw);
    const guest = parseModeUnlocks(guestRaw);
    return JSON.stringify({
      adventureClears: Math.max(account.adventureClears, guest.adventureClears),
      reviewUnlockSeen: account.reviewUnlockSeen || guest.reviewUnlockSeen,
      categoryUnlockSeen: account.categoryUnlockSeen || guest.categoryUnlockSeen,
      pendingForcedReview: account.pendingForcedReview || guest.pendingForcedReview,
    });
  });
  try {
    const raw = readScopedProgress(key, userUid);
    if (!raw) return { ...DEFAULT_UNLOCKS };
    return parseModeUnlocks(raw);
  } catch {
    return { ...DEFAULT_UNLOCKS };
  }
}

export function saveModeUnlocks(state: ModeUnlockState, userUid?: string | null, courseId?: CourseId): void {
  writeScopedProgress(courseStorageKey(courseId), JSON.stringify(state), userUid);
}

export function clearModeUnlocks(userUid?: string | null, courseId?: CourseId): void {
  clearScopedProgress(courseStorageKey(courseId), userUid);
}

export function isReviewUnlocked(clears: number): boolean {
  return clears >= 1;
}

export function isCategoryUnlocked(clears: number): boolean {
  return clears >= CATEGORY_UNLOCK_CLEARS;
}
