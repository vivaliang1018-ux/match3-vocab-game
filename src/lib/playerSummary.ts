/** Player journey: streaks + tiered award tracks (Matchingo candy style). */

const STORAGE_KEY = 'match3-player-summary-v1';

export type BadgeId =
  | 'first_clear'
  | 'clears_3'
  | 'clears_10'
  | 'clears_30'
  | 'day_streak_3'
  | 'day_streak_7'
  | 'day_streak_30'
  | 'clear_streak_3'
  | 'clear_streak_5'
  | 'review_unlocked'
  | 'category_unlocked'
  | 'mastered_50'
  | 'mastered_100';

export type AwardTrackId =
  | 'set_hunter'
  | 'day_nail'
  | 'combo_king'
  | 'dex_collector'
  | 'review_brain'
  | 'category_fan';

export type EarnedBadge = {
  id: BadgeId;
  earnedAt: number;
};

export type PlayerSummary = {
  /** Local calendar day of last counted play (`YYYY-MM-DD`). */
  lastPlayDay: string | null;
  dayStreak: number;
  bestDayStreak: number;
  /** Consecutive adventure set clears without a fail. */
  clearStreak: number;
  bestClearStreak: number;
  badges: EarnedBadge[];
  /**
   * Highest award tier the player has claimed (celebrated) per track.
   * Tier 0 = never claimed; matches `AwardTrackProgress.tier`.
   */
  claimedAwardTiers: Partial<Record<AwardTrackId, number>>;
  /** When each track was last claimed (for the date pill). */
  claimedAwardAt: Partial<Record<AwardTrackId, number>>;
};

export type SummaryContext = {
  adventureClears: number;
  masteredCount: number;
  reviewUnlocked: boolean;
  categoryUnlocked: boolean;
};

const DEFAULT_SUMMARY: PlayerSummary = {
  lastPlayDay: null,
  dayStreak: 0,
  bestDayStreak: 0,
  clearStreak: 0,
  bestClearStreak: 0,
  badges: [],
  claimedAwardTiers: {},
  claimedAwardAt: {},
};

/** Badge catalog (unlock ledger; UI shows award tracks). */
export const BADGE_CATALOG: readonly BadgeId[] = [
  'first_clear',
  'clears_3',
  'clears_10',
  'clears_30',
  'day_streak_3',
  'day_streak_7',
  'day_streak_30',
  'clear_streak_3',
  'clear_streak_5',
  'review_unlocked',
  'category_unlocked',
  'mastered_50',
  'mastered_100',
] as const;

export type AwardAccent = 'sky' | 'pink' | 'amber' | 'mint' | 'violet' | 'coral';

export type AwardTrackDef = {
  id: AwardTrackId;
  /** Circular medal art under /branding/awards. */
  iconSrc: string;
  accent: AwardAccent;
  /** Milestone thresholds for tier progress. */
  thresholds: number[];
  /** Large number shown beside progress (current tier goal). */
  faceValue: (progress: AwardTrackProgress) => number;
  metric: (ctx: SummaryContext, summary: PlayerSummary) => number;
};

export type AwardTrackProgress = {
  id: AwardTrackId;
  value: number;
  /** 0 = not started; otherwise current tier index (1-based toward next). */
  tier: number;
  /** Highest threshold reached (0 if none). */
  achieved: number;
  /** Progress toward next threshold. */
  current: number;
  next: number;
  /** True when every threshold is cleared. */
  maxed: boolean;
  /** At least one threshold reached. */
  unlocked: boolean;
  /** Unlocked tier higher than last claimed celebration. */
  claimable: boolean;
  ratio: number;
};

export const AWARD_TRACKS: readonly AwardTrackDef[] = [
  {
    id: 'set_hunter',
    iconSrc: '/branding/awards/set_hunter.webp',
    accent: 'pink',
    thresholds: [1, 3, 10, 30],
    faceValue: (p) => p.next,
    metric: (ctx) => ctx.adventureClears,
  },
  {
    id: 'day_nail',
    iconSrc: '/branding/awards/day_nail.webp',
    accent: 'amber',
    thresholds: [3, 7, 30],
    faceValue: (p) => p.next,
    metric: (_ctx, summary) => Math.max(summary.bestDayStreak, liveDayStreak(summary)),
  },
  {
    id: 'combo_king',
    iconSrc: '/branding/awards/combo_king.webp',
    accent: 'coral',
    thresholds: [3, 5, 10],
    faceValue: (p) => p.next,
    metric: (_ctx, summary) => Math.max(summary.bestClearStreak, summary.clearStreak),
  },
  {
    id: 'dex_collector',
    iconSrc: '/branding/awards/dex_collector.webp',
    accent: 'sky',
    thresholds: [20, 50, 100],
    faceValue: (p) => p.next,
    metric: (ctx) => ctx.masteredCount,
  },
  {
    id: 'review_brain',
    iconSrc: '/branding/awards/review_brain.webp',
    accent: 'violet',
    thresholds: [1],
    faceValue: () => 1,
    metric: (ctx) => (ctx.reviewUnlocked ? 1 : 0),
  },
  {
    id: 'category_fan',
    iconSrc: '/branding/awards/category_fan.webp',
    accent: 'mint',
    thresholds: [1],
    faceValue: () => 1,
    metric: (ctx) => (ctx.categoryUnlocked ? 1 : 0),
  },
] as const;

export function awardTrackProgress(
  def: AwardTrackDef,
  ctx: SummaryContext,
  summary: PlayerSummary,
): AwardTrackProgress {
  const value = Math.max(0, def.metric(ctx, summary));
  const thresholds = def.thresholds;
  let cleared = 0;
  for (const t of thresholds) {
    if (value >= t) cleared += 1;
    else break;
  }
  const maxed = cleared >= thresholds.length;
  const next = maxed ? thresholds[thresholds.length - 1]! : thresholds[cleared]!;
  const prev = cleared === 0 ? 0 : thresholds[cleared - 1]!;
  const achieved = cleared === 0 ? 0 : thresholds[cleared - 1]!;
  const span = Math.max(1, next - prev);
  const current = maxed ? next : Math.min(next, Math.max(0, value));
  const toward = maxed ? span : Math.max(0, value - prev);
  const claimed = summary.claimedAwardTiers[def.id] ?? 0;
  return {
    id: def.id,
    value,
    tier: cleared,
    achieved,
    current: maxed ? next : current,
    next,
    maxed,
    unlocked: cleared > 0,
    claimable: cleared > claimed,
    ratio: maxed ? 1 : Math.min(1, toward / span),
  };
}

/** Mark the current unlocked tier as claimed/celebrated. */
export function claimAwardTrack(
  summary: PlayerSummary,
  trackId: AwardTrackId,
  tier: number,
  now = Date.now(),
): PlayerSummary {
  if (tier <= 0) return summary;
  const prev = summary.claimedAwardTiers[trackId] ?? 0;
  if (tier <= prev) return summary;
  const next: PlayerSummary = {
    ...summary,
    claimedAwardTiers: { ...summary.claimedAwardTiers, [trackId]: tier },
    claimedAwardAt: { ...summary.claimedAwardAt, [trackId]: now },
  };
  savePlayerSummary(next);
  return next;
}

export function calendarDayKey(ms = Date.now()): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseDayKey(key: string): number {
  const [y, m, d] = key.split('-').map(Number);
  return Date.UTC(y, (m || 1) - 1, d || 1);
}

/** Inclusive calendar-day distance (0 = same day, 1 = yesterday → today). */
export function dayKeyDiff(from: string, to: string): number {
  return Math.round((parseDayKey(to) - parseDayKey(from)) / 86_400_000);
}

export function loadPlayerSummary(): PlayerSummary {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SUMMARY, badges: [] };
    const parsed = JSON.parse(raw) as Partial<PlayerSummary>;
    const badges = Array.isArray(parsed.badges)
      ? parsed.badges.filter(
          (b): b is EarnedBadge =>
            Boolean(b) &&
            typeof b === 'object' &&
            typeof (b as EarnedBadge).id === 'string' &&
            typeof (b as EarnedBadge).earnedAt === 'number' &&
            BADGE_CATALOG.includes((b as EarnedBadge).id),
        )
      : [];
    return {
      lastPlayDay: typeof parsed.lastPlayDay === 'string' ? parsed.lastPlayDay : null,
      dayStreak: Math.max(0, Math.floor(Number(parsed.dayStreak) || 0)),
      bestDayStreak: Math.max(0, Math.floor(Number(parsed.bestDayStreak) || 0)),
      clearStreak: Math.max(0, Math.floor(Number(parsed.clearStreak) || 0)),
      bestClearStreak: Math.max(0, Math.floor(Number(parsed.bestClearStreak) || 0)),
      badges,
      claimedAwardTiers: sanitizeClaimedTiers(parsed.claimedAwardTiers),
      claimedAwardAt: sanitizeClaimedAt(parsed.claimedAwardAt),
    };
  } catch {
    return { ...DEFAULT_SUMMARY, badges: [], claimedAwardTiers: {}, claimedAwardAt: {} };
  }
}

function sanitizeClaimedTiers(
  raw: unknown,
): Partial<Record<AwardTrackId, number>> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Partial<Record<AwardTrackId, number>> = {};
  for (const def of AWARD_TRACKS) {
    const n = (raw as Record<string, unknown>)[def.id];
    if (typeof n === 'number' && n > 0) out[def.id] = Math.floor(n);
  }
  return out;
}

function sanitizeClaimedAt(raw: unknown): Partial<Record<AwardTrackId, number>> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Partial<Record<AwardTrackId, number>> = {};
  for (const def of AWARD_TRACKS) {
    const n = (raw as Record<string, unknown>)[def.id];
    if (typeof n === 'number' && n > 0) out[def.id] = n;
  }
  return out;
}

export function savePlayerSummary(summary: PlayerSummary): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(summary));
  } catch {
    // ignore quota
  }
}

function withBadge(summary: PlayerSummary, id: BadgeId, now: number): PlayerSummary {
  if (summary.badges.some((b) => b.id === id)) return summary;
  return {
    ...summary,
    badges: [...summary.badges, { id, earnedAt: now }],
  };
}

/** Unlock milestone badges from current progress (safe to call often). */
export function reconcileBadges(summary: PlayerSummary, ctx: SummaryContext, now = Date.now()): PlayerSummary {
  let next = summary;
  if (ctx.adventureClears >= 1) next = withBadge(next, 'first_clear', now);
  if (ctx.adventureClears >= 3) next = withBadge(next, 'clears_3', now);
  if (ctx.adventureClears >= 10) next = withBadge(next, 'clears_10', now);
  if (ctx.adventureClears >= 30) next = withBadge(next, 'clears_30', now);
  if (next.dayStreak >= 3 || next.bestDayStreak >= 3) next = withBadge(next, 'day_streak_3', now);
  if (next.dayStreak >= 7 || next.bestDayStreak >= 7) next = withBadge(next, 'day_streak_7', now);
  if (next.dayStreak >= 30 || next.bestDayStreak >= 30) next = withBadge(next, 'day_streak_30', now);
  if (next.clearStreak >= 3 || next.bestClearStreak >= 3) next = withBadge(next, 'clear_streak_3', now);
  if (next.clearStreak >= 5 || next.bestClearStreak >= 5) next = withBadge(next, 'clear_streak_5', now);
  if (ctx.reviewUnlocked) next = withBadge(next, 'review_unlocked', now);
  if (ctx.categoryUnlocked) next = withBadge(next, 'category_unlocked', now);
  if (ctx.masteredCount >= 50) next = withBadge(next, 'mastered_50', now);
  if (ctx.masteredCount >= 100) next = withBadge(next, 'mastered_100', now);
  return next;
}

function applyDayStreak(summary: PlayerSummary, now: number): PlayerSummary {
  const today = calendarDayKey(now);
  if (summary.lastPlayDay === today) return summary;

  let dayStreak = 1;
  if (summary.lastPlayDay) {
    const diff = dayKeyDiff(summary.lastPlayDay, today);
    if (diff === 1) dayStreak = summary.dayStreak + 1;
    else if (diff <= 0) dayStreak = Math.max(1, summary.dayStreak);
  }

  return {
    ...summary,
    lastPlayDay: today,
    dayStreak,
    bestDayStreak: Math.max(summary.bestDayStreak, dayStreak),
  };
}

/** Count one completed learning session for the local calendar day. */
export function recordLearningActivity(
  summary: PlayerSummary,
  ctx: SummaryContext,
  now = Date.now(),
): PlayerSummary {
  const withDay = applyDayStreak(summary, now);
  const reconciled = reconcileBadges(withDay, ctx, now);
  savePlayerSummary(reconciled);
  return reconciled;
}

/** Call after an adventure set is fully cleared (board + quiz). */
export function recordAdventureClear(
  summary: PlayerSummary,
  ctx: SummaryContext,
  now = Date.now(),
): PlayerSummary {
  const withDay = applyDayStreak(summary, now);
  const clearStreak = withDay.clearStreak + 1;
  const next: PlayerSummary = {
    ...withDay,
    clearStreak,
    bestClearStreak: Math.max(withDay.bestClearStreak, clearStreak),
  };
  const reconciled = reconcileBadges(next, ctx, now);
  savePlayerSummary(reconciled);
  return reconciled;
}

/** Call when an attempted adventure is actually lost (revive failed or abandoned). */
export function recordAdventureFail(summary: PlayerSummary, ctx: SummaryContext, now = Date.now()): PlayerSummary {
  if (summary.clearStreak === 0) {
    const reconciled = reconcileBadges(summary, ctx, now);
    if (reconciled !== summary) savePlayerSummary(reconciled);
    return reconciled;
  }
  const next: PlayerSummary = { ...summary, clearStreak: 0 };
  const reconciled = reconcileBadges(next, ctx, now);
  savePlayerSummary(reconciled);
  return reconciled;
}

/** Refresh displayed day streak if the calendar rolled over without play. */
export function liveDayStreak(summary: PlayerSummary, now = Date.now()): number {
  if (!summary.lastPlayDay || summary.dayStreak <= 0) return 0;
  const today = calendarDayKey(now);
  const diff = dayKeyDiff(summary.lastPlayDay, today);
  if (diff === 0 || diff === 1) return summary.dayStreak;
  return 0;
}

/** @deprecated Prefer award track scenes. */
export function badgeEmoji(id: BadgeId): string {
  switch (id) {
    case 'first_clear':
      return '🌱';
    case 'clears_3':
      return '🍀';
    case 'clears_10':
      return '🔥';
    case 'clears_30':
      return '👑';
    case 'day_streak_3':
      return '📅';
    case 'day_streak_7':
      return '🗓️';
    case 'day_streak_30':
      return '💎';
    case 'clear_streak_3':
      return '⚡';
    case 'clear_streak_5':
      return '🚀';
    case 'review_unlocked':
      return '🧠';
    case 'category_unlocked':
      return '🗂️';
    case 'mastered_50':
      return '⭐';
    case 'mastered_100':
      return '🏆';
    default:
      return '🎖️';
  }
}
