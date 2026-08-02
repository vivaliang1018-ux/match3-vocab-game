/** Words per adventure / review set. */
export const ADVENTURE_WORDS_PER_SET = 6;

/** Shelf hits needed to finish a word in adventure / category. */
export const HITS_PER_WORD_DEFAULT = 3;

/** Shelf hits needed to finish a word in review mode. */
export const HITS_PER_WORD_REVIEW = 2;

export function hitsNeededForMode(
  mode: 'random' | 'mood' | 'review' | 'category',
): number {
  return mode === 'review' ? HITS_PER_WORD_REVIEW : HITS_PER_WORD_DEFAULT;
}

/** Base moves for every adventure (闯关) set. */
export const ADVENTURE_BASE_MOVES = 20;

/** Moves added on a player-initiated clear of 5+ or a cross / T / L shape. */
export const MATCH_CLEAR_BONUS_MOVES = 1;

/** When moves left are at or below this, bias drops toward unfinished words. */
export const LATE_BOARD_ASSIST_MOVES = 3;

/** After this many adventure clears, force a review set. */
export const ADVENTURE_SETS_PER_FORCED_REVIEW = 3;

/** Correct target hits needed per word during revive. */
export const REVIVE_HITS_PER_WORD = 2;

/** Wrong answers / timeouts before revive fails immediately. */
export const REVIVE_WRONG_LIMIT = 3;

/** Moves granted after a failed Rescue before the adventure finally ends. */
export const RESCUE_CONTINUE_MOVES = 8;

/** @deprecated Prefer REVIVE_HITS_PER_WORD × set size. Kept for HUD defaults. */
export const REVIVE_CORRECT_NEEDED = ADVENTURE_WORDS_PER_SET * REVIVE_HITS_PER_WORD;

/** Move budget for adventure (闯关). Same base for every set. */
export function movesForAdventureLevel(_level: number): number {
  return ADVENTURE_BASE_MOVES;
}

/** How many full 6-word sets fit in a pool (emoji nouns → 186). */
export function adventureTotalSets(poolSize: number): number {
  return Math.max(0, Math.floor(poolSize / ADVENTURE_WORDS_PER_SET));
}

/** After N adventure clears, inject a mandatory review exam. */
export function shouldForceReviewAfterClear(adventureClears: number): boolean {
  return (
    adventureClears > 0 && adventureClears % ADVENTURE_SETS_PER_FORCED_REVIEW === 0
  );
}

/** Total correct target hits needed to pass revive for a given set size. */
export function reviveCorrectNeeded(wordCount = ADVENTURE_WORDS_PER_SET): number {
  return wordCount * REVIVE_HITS_PER_WORD;
}
