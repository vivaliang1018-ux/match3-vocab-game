import type { ChallengeMode } from '../types/game';

type BoardSetupIdentityInput = {
  courseId: string;
  userId: string | null;
  mode: ChallengeMode;
  categoryId: string;
  moodPaletteId: string;
};

/**
 * Identifies an explicit board destination, not the live contents of its word
 * pool. Cloud hydration and learned-word updates must never replace a board
 * that the player has already started (or arm a second stamina charge).
 */
export function boardSetupIdentity({
  courseId,
  userId,
  mode,
  categoryId,
  moodPaletteId,
}: BoardSetupIdentityInput): string {
  const owner = userId ?? 'guest';
  if (mode === 'mood') return `${courseId}:${owner}:mood:${moodPaletteId}`;
  if (mode === 'category') return `${courseId}:${owner}:category:${categoryId}`;
  return `${courseId}:${owner}:${mode}`;
}
