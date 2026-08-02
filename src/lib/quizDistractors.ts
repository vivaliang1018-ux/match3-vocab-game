import { EMOJI_NOUN_CATEGORIES } from '../data/emojiNouns';
import type { WordItem } from '../types/game';

function shuffleItems<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Resolve emoji category from `emoji-{categoryId}-{itemId}`. */
export function categoryIdFromItemId(id: string): string | null {
  if (!id.startsWith('emoji-')) return null;
  for (const cat of EMOJI_NOUN_CATEGORIES) {
    const prefix = `emoji-${cat.id}-`;
    if (id.startsWith(prefix)) return cat.id;
  }
  return null;
}

function tokensOf(item: WordItem): Set<string> {
  const raw = `${item.id} ${item.word}`.toLowerCase();
  return new Set(raw.split(/[^a-z0-9\u4e00-\u9fff]+/).filter((t) => t.length > 2));
}

/** Higher = more confusable with the correct answer. */
export function distractorSimilarity(correct: WordItem, candidate: WordItem): number {
  let score = 0;
  const cCat = categoryIdFromItemId(correct.id);
  const aCat = categoryIdFromItemId(candidate.id);
  if (cCat && cCat === aCat) score += 120;

  if (correct.emoji && candidate.emoji) {
    const cp1 = [...correct.emoji][0]?.codePointAt(0) ?? 0;
    const cp2 = [...candidate.emoji][0]?.codePointAt(0) ?? 0;
    const dist = Math.abs(cp1 - cp2);
    // Nearby code points often look related (same emoji block).
    score += Math.max(0, 50 - Math.min(50, dist / 32));
  }

  const ct = tokensOf(correct);
  for (const t of tokensOf(candidate)) {
    if (ct.has(t)) score += 10;
  }

  // Prefer matching media type.
  if (Boolean(correct.emoji) === Boolean(candidate.emoji)) score += 15;
  if (Boolean(correct.imgSrc) === Boolean(candidate.imgSrc)) score += 10;

  return score;
}

/**
 * Build 4 pick options: 1 correct + 3 distractors from outside this round.
 * Prefers same-category / visually similar emojis to raise difficulty.
 */
export function pickQuizChoices(
  correct: WordItem,
  roundItems: WordItem[],
  distractorPool: WordItem[],
  count = 4,
): WordItem[] {
  const need = Math.max(1, count - 1);
  const roundIds = new Set(roundItems.map((it) => it.id));

  const preferSameKind = (pool: WordItem[]) => {
    if (correct.emoji) {
      const emojiOnly = pool.filter((it) => Boolean(it.emoji));
      if (emojiOnly.length >= need) return emojiOnly;
    }
    if (correct.imgSrc) {
      const imgOnly = pool.filter((it) => Boolean(it.imgSrc));
      if (imgOnly.length >= need) return imgOnly;
    }
    return pool;
  };

  // Primary: never from this round (except the correct answer itself).
  let pool = preferSameKind(
    distractorPool.filter((it) => it.id !== correct.id && !roundIds.has(it.id)),
  );

  // Fallback if global pool is tiny: allow any non-correct outside round failed → round mates.
  if (pool.length < need) {
    const wider = preferSameKind(distractorPool.filter((it) => it.id !== correct.id));
    if (wider.length > pool.length) pool = wider;
  }
  if (pool.length < need) {
    pool = preferSameKind(roundItems.filter((it) => it.id !== correct.id));
  }

  // Rank by similarity, then sample from the confusing head with light shuffle.
  const ranked = [...pool].sort((a, b) => {
    const diff = distractorSimilarity(correct, b) - distractorSimilarity(correct, a);
    if (diff !== 0) return diff;
    return Math.random() - 0.5;
  });
  const head = ranked.slice(0, Math.min(28, ranked.length));
  const picks: WordItem[] = [];
  const used = new Set<string>();
  for (const it of shuffleItems(head)) {
    if (used.has(it.id)) continue;
    picks.push(it);
    used.add(it.id);
    if (picks.length >= need) break;
  }
  if (picks.length < need) {
    for (const it of ranked) {
      if (used.has(it.id)) continue;
      picks.push(it);
      used.add(it.id);
      if (picks.length >= need) break;
    }
  }

  return shuffleItems([correct, ...picks]);
}
