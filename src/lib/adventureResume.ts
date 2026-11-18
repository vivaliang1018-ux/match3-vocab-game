import type { CourseId } from '../course';

export type AdventurePaymentEvidence = {
  staminaPaid?: boolean;
  itemHitCount?: Record<string, number>;
};

export function hasAdventurePayment(board: AdventurePaymentEvidence): boolean {
  // Legacy previews accidentally saved staminaOwed=false before any match.
  // A real legacy payment has at least one word hit; new saves record it explicitly.
  if (typeof board.staminaPaid === 'boolean') return board.staminaPaid;
  return Object.values(board.itemHitCount ?? {})
    .some(count => typeof count === 'number' && Number.isFinite(count) && count > 0);
}

/** Only an unfinished, paid, playable attempt can bypass a new-board charge. */
export function isPaidPlayableAdventureBoard(board: {
  staminaOwed?: boolean; adventurePlayable?: boolean; attemptLost?: boolean; movesLeft?: number;
} & AdventurePaymentEvidence): boolean {
  return board.staminaOwed === false && board.adventurePlayable === true &&
    board.attemptLost !== true && typeof board.movesLeft === 'number' && board.movesLeft > 0 &&
    hasAdventurePayment(board);
}

/** Home only needs a conservative hint; Game validates the full board before restore. */
export function hasPaidAdventureBoard(courseId: CourseId, userId: string | null): boolean {
  try {
    const key = `matchingo-adventure-board-v1:${courseId}:${userId || 'guest'}`;
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const board = JSON.parse(raw) as {
      version?: number;
      userId?: string;
      staminaOwed?: boolean;
      staminaPaid?: boolean;
      itemHitCount?: Record<string, number>;
      adventurePlayable?: boolean;
      attemptLost?: boolean;
      movesLeft?: number;
      gameItems?: unknown[];
      grid?: unknown[];
    };
    return board.version === 1 && board.userId === (userId || 'guest') &&
      isPaidPlayableAdventureBoard(board) && Array.isArray(board.gameItems) &&
      board.gameItems.length >= 6 && Array.isArray(board.grid) && board.grid.length === 7 &&
      board.grid.every(row => Array.isArray(row) && row.length === 7);
  } catch {
    return false;
  }
}
