import {
  claimGuestProgress,
  clearScopedProgress,
  readScopedProgress,
  writeScopedProgress,
} from './progressScope';

const STORAGE_KEY = 'match3-mode-unlocks-v1';

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

export function loadModeUnlocks(userUid?: string | null): ModeUnlockState {
  claimGuestProgress(STORAGE_KEY, userUid, (accountRaw, guestRaw) => {
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
    const raw = readScopedProgress(STORAGE_KEY, userUid);
    if (!raw) return { ...DEFAULT_UNLOCKS };
    return parseModeUnlocks(raw);
  } catch {
    return { ...DEFAULT_UNLOCKS };
  }
}

export function saveModeUnlocks(state: ModeUnlockState, userUid?: string | null): void {
  writeScopedProgress(STORAGE_KEY, JSON.stringify(state), userUid);
}

export function clearModeUnlocks(userUid?: string | null): void {
  clearScopedProgress(STORAGE_KEY, userUid);
}

export function isReviewUnlocked(clears: number): boolean {
  return clears >= 1;
}

export function isCategoryUnlocked(clears: number): boolean {
  return clears >= 5;
}
