import { EMOJI_NOUN_CATEGORIES, type EmojiNounItem } from '../data/emojiNouns';
import {
  claimGuestProgress,
  readScopedProgress,
  writeScopedProgress,
} from './progressScope';

export const COLLECTION_SEEN_KEY = 'matchingo-emoji-collection-seen-v1';
export const COLLECTION_BADGES_KEY = 'matchingo-emoji-collection-badges-v1';

const ALL_COLLECTION_ITEMS = EMOJI_NOUN_CATEGORIES.flatMap((category) =>
  category.items.map((item) => ({ categoryId: category.id, item })),
);

export function collectionGameItemId(categoryId: string, itemId: string): string {
  return `emoji-${categoryId}-${itemId}`;
}
export function itemCollectionKey(categoryId: string, item: EmojiNounItem): string {
  return `${categoryId}|${item.id}|${item.emoji}`;
}

export function loadCollectionSet(baseKey: string, userId?: string | null): Set<string> {
  claimGuestProgress(baseKey, userId);
  try {
    const parsed = JSON.parse(readScopedProgress(baseKey, userId) ?? '[]');
    return new Set(Array.isArray(parsed) ? parsed.filter((value) => typeof value === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveCollectionSet(
  baseKey: string,
  values: Set<string>,
  userId?: string | null,
): void {
  writeScopedProgress(baseKey, JSON.stringify([...values]), userId);
}

export function getNewCollectionCount(
  learnedIds: string[],
  userId?: string | null,
): number {
  const learned = new Set(learnedIds);
  const seen = loadCollectionSet(COLLECTION_SEEN_KEY, userId);
  return ALL_COLLECTION_ITEMS.reduce(
    (count, { categoryId, item }) => count + (
      learned.has(collectionGameItemId(categoryId, item.id)) &&
      !seen.has(itemCollectionKey(categoryId, item)) ? 1 : 0
    ),
    0,
  );
}
