/** Match-3: +10 per intentional clear, up to 3 clears per word. */
export const SCORE_MATCH3_PER_CLEAR = 10;

/** Bonus for player clears beyond 3-in-a-row (4+, line/cross clears). */
export const SCORE_EXTRA_MATCH_BONUS = 5;

/** Fun mode: correct target / wrong word. */
export const SCORE_FUN_CORRECT = 10;
export const SCORE_FUN_WRONG = -10;
export const FUN_COUNTDOWN_SEC = 8;

/** Quiz: correct / wrong per question or connection attempt. */
export const SCORE_QUIZ_CORRECT = 5;
export const SCORE_QUIZ_WRONG = -15;

export function applyScoreDelta(current: number, delta: number): number {
  return Math.max(0, current + delta);
}
