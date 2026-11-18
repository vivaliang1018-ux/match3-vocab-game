export type CoreEventParams = {
  course_selected: { source_language: string; target_language: string };
  language_switched: { from_language: string; to_language: string };
  game_started: { course: string; mode: string; set_number: number };
  set_completed: { course: string; set_number: number; words_count: number };
  quiz_completed: { course: string; set_number: number; score: number; accuracy: number };
  review_started: { course: string; review_type: string };
};
export type CoreEventName = keyof CoreEventParams;

/** Per mounted game: repeated callbacks/renders cannot report a milestone twice. */
export function createCoreEventLedger() {
  const seen = new Set<string>();
  return (event: CoreEventName, occurrence: string): boolean => {
    const key = `${event}:${occurrence}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  };
}

/** First-try word recall, not eventual correctness after unlimited retries. */
export function quizAnalyticsScore(itemIds: readonly string[], mistakenIds: readonly string[]) {
  const items = new Set(itemIds);
  const mistakes = new Set(mistakenIds.filter((id) => items.has(id)));
  const score = items.size - mistakes.size;
  return { score, accuracy: items.size ? Math.round(score / items.size * 10000) / 100 : 0 };
}
