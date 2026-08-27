import type { WordItem } from '../types/game';

/**
 * Emoji that are too easy to confuse at game-board size. Keep at most one
 * member of each group in a six-word round whenever the available pool allows.
 */
const VISUAL_CONFLICT_GROUPS: readonly (readonly string[])[] = [
  ['😈', '👿'],
  ['😀', '😃', '😄', '😁'],
  ['😗', '😙', '😚'],
  ['😐', '😑', '😶', '🫥'],
  ['😕', '🙁', '☹️'],
  ['😢', '😭'],
  ['😨', '😰'],
  ['😮', '😯'],
  ['😵', '😵‍💫'],
  ['🙈', '🙉', '🙊', '🐵'],
  ['🐣', '🐤', '🐥'],
  ['🐳', '🐋'],
  ['🐪', '🐫'],
  ['☘️', '🍀'],
  ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'],
  ['🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕢', '🕣', '🕤', '🕥', '🕦', '🕧'],
] as const;

const conflictGroupByEmoji = new Map<string, number>();
VISUAL_CONFLICT_GROUPS.forEach((group, groupIndex) => {
  group.forEach((emoji) => conflictGroupByEmoji.set(emoji, groupIndex));
});

/**
 * Preserve the caller's priority/shuffle order while skipping look-alikes.
 * If a very small legacy/review pool cannot supply `count` distinct choices,
 * deferred items fill the remaining slots so the game can still start.
 */
export function pickVisuallyDistinctItems(
  orderedItems: readonly WordItem[],
  count: number,
): WordItem[] {
  const selected: WordItem[] = [];
  const deferred: WordItem[] = [];
  const usedGroups = new Set<number>();

  for (const item of orderedItems) {
    const group = item.emoji ? conflictGroupByEmoji.get(item.emoji) : undefined;
    if (group !== undefined && usedGroups.has(group)) {
      deferred.push(item);
      continue;
    }
    selected.push(item);
    if (group !== undefined) usedGroups.add(group);
    if (selected.length >= count) return selected;
  }

  for (const item of deferred) {
    selected.push(item);
    if (selected.length >= count) break;
  }
  return selected;
}
