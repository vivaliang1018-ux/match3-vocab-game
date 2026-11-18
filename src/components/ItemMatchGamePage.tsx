import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { hasAdventurePayment, isPaidPlayableAdventureBoard } from '../lib/adventureResume';
import { cn } from '../lib/utils';
import { syncStatusBarForTab } from '../lib/capacitorInit';
import { useAuth } from '../auth/AuthProvider';
import {
  hydrateMatch3Memories,
  compareWordsForSpacedReview,
  isDue,
  masteredEmojiCount,
  memoryKeyForWord,
  memoryScopeForUserId,
  mergeWordMemoryMaps,
  recordWordExposure,
  recordWordRecallFailure,
  recordWordRecallSuccess,
  type WordMemory,
} from '../lib/ebbinghausMemory';
import {
  hydrateCoreProgressWithCloud,
  hydrateMatch3MemoriesWithCloud,
  persistCoreProgress,
  persistWordMemories,
} from '../lib/memoryCloudSync';
import { THIINGS_100 } from '../data/thiings100';
import { EMOJI_NOUN_CATEGORIES } from '../data/emojiNouns';
import { getActiveCourseId, languageForCode, useCourse } from '../course';
import { trackCoreEvent } from '../lib/coreAnalytics';
import { loadPendingQuiz, savePendingQuiz, clearPendingQuiz, type PendingQuiz } from '../lib/pendingQuiz';
import { createCoreEventLedger, quizAnalyticsScore } from '../lib/coreAnalyticsEvents';
import { learningLanguageForCourse, learningWordForCourse, sourceWordForCourse } from '../lib/courseWord';
import {
  EMOJI_LEARNING_BROWSE_SECTIONS,
  EMOJI_LEARNING_CATEGORIES,
  EMOJI_LEARNING_ITEMS_BY_CATEGORY,
  getEmojiLearningBrowseSection,
} from '../lib/emojiLearningCategories';
import { CATEGORY_UI_COPY, learningCategoryTitle, learningSectionTitle } from '../lib/learningCategoryPresentation';
import {
  categoryCycleEntry,
  completeCategoryCycleBoard,
  loadCategoryCycleProgress,
  pickCategoryCycleItems,
  saveCategoryCycleProgress,
  type CategoryCycleProgress,
} from '../lib/categoryCycleProgress';
import { GamePanel } from './mobile/GamePanel';
import { MobileTabBar } from './mobile/MobileTabBar';
import { LearnedPanel } from './mobile/LearnedPanel';
import { ProfilePanel } from './mobile/ProfilePanel';
import { TIMED_TARGET_COUNTDOWN_SEC } from '../lib/scoring';
import {
  queueWordSpeechToCompletion,
  resetWordSpeechAfterBackground,
  speakLatestWordPrompt,
  stopAllWordSpeech,
  unlockSpeechSynthesis,
} from '../lib/wordSpeech';
import {
  playMatchClearSfx,
  playWrongSfx,
  loadSfxEnabled,
  resolveSfxVolume,
  saveSfxEnabled,
  unlockGameAudio,
} from '../lib/gameSfx';
import {
  loadHapticsEnabled,
  saveHapticsEnabled,
  triggerGameHaptic,
} from '../lib/gameHaptics';
import {
  MOOD_BOARD_CATEGORY_ID,
  moodBoardItems,
  moodPaletteForDay,
  moodPaletteSwatch,
  canPlayMoodToday,
  loadMoodDailyState,
  saveMoodDailyState,
  tryConsumeMoodPlay,
  type MoodPaletteId,
} from '../lib/moodBoard';
import { useMembership } from '../membership/MembershipProvider';
import {
  enableLearningReminders,
  markLearningActivity,
  readLearningReminderSettings,
  refreshLearningReminder,
} from '../lib/learningNotificationsV2';
import {
  grantDailySayBlastReward,
  isCloudQuotaAvailable,
  resetDailyQuotaFromRewardedAd,
  spendDailyQuota,
  staminaFromDailyQuota,
  synchronizeDailyQuota,
  type DailyQuota,
} from '../lib/dailyQuotaCloud';
import {
  hasPaidModeBoard,
  loadModeBoardSnapshot,
  removeModeBoardSnapshot,
  saveModeBoardSnapshot,
  validModeBoardSnapshot,
  type ResumableMode,
} from '../lib/modeBoardResume';
import { CelebrationBurst } from './mobile/CelebrationBurst';
import { RoundQuizSheet } from './mobile/RoundQuizSheet';
import { RoundResultSheet, type RoundResult } from './mobile/RoundResultSheet';
import { AccountPromptSheet, type AccountPromptKind } from './mobile/AccountPromptSheet';
import { SignInSheet } from './mobile/SignInSheet';
import { SayBlastGame } from './mobile/SayBlastGame';
import { AdventureFailSheet } from './mobile/AdventureFailSheet';
import { DeadMachineSheet } from './mobile/DeadMachineSheet';
import { LegalConsentModal } from './mobile/LegalConsentModal';
import { categoryDisplayName, useI18n } from '../i18n';
import type { AppTab } from './mobile/types';
import { WordsPanel } from './mobile/WordsPanel';
import type { HomeEntry } from './HomePage';
import {
  completeSoftAuthPrompt,
  dismissStreakGateForToday,
  hasCompletedSoftAuthPrompt,
  hasDismissedStreakGateToday,
  shouldGateLongTermStreak,
} from '../lib/authNudge';
import {
  analyzeOpeningBoard,
  boostScarceUnfinishedWords,
  createBalancedOpeningGrid,
  ensureTimedTargetPlayable,
  findBestHintMove,
  findHintMoveForItem,
  hasSwapMatchForItem,
  pickSmartRefillItemId,
} from '../lib/gridMatch';
import {
  loadRoundLearnedIds,
  markRoundLearnedItems,
  roundLearnedItemIds,
} from '../lib/roundLearned';
import {
  ADVENTURE_WORDS_PER_SET,
  HITS_PER_WORD_DEFAULT,
  HITS_PER_WORD_REVIEW,
  LATE_BOARD_ASSIST_MOVES,
  MATCH_CLEAR_BONUS_MOVES,
  REVIVE_HITS_PER_WORD,
  REVIVE_WRONG_LIMIT,
  adventureTotalSets,
  hitsNeededForMode,
  movesForAdventureLevel,
  reviveCorrectNeeded,
  shouldForceReviewAfterClear,
} from '../lib/adventureRules';
import {
  AD_STAMINA_RESETS_DAILY_MAX,
  grantSayBlastStamina,
  loadStaminaState,
  resetStaminaFromRewardedAd,
  saveStaminaState,
  spendStamina,
  tickStamina,
  msUntilNextStamina,
  type StaminaState,
  STAMINA_MAX,
} from '../lib/stamina';
import { rewardedAdsSupported, rewardedAdsTestMode, showStaminaRewardedAd } from '../lib/rewardedAds';
import { REWARDED_AD_COPY } from '../i18n/rewardedAdCopy';
import { NOTIFICATION_SETTINGS_COPY } from '../i18n/notificationSettingsCopy';
import {
  isCategoryUnlocked,
  isReviewUnlocked,
  loadModeUnlocks,
  saveModeUnlocks,
  type ModeUnlockState,
} from '../lib/modeUnlocks';
import {
  loadPlayerSummary,
  AWARD_TRACKS,
  awardTrackProgress,
  claimAwardTrack,
  liveDayStreak,
  recordAdventureClear,
  recordAdventureFail,
  recordLearningActivity,
  recordReviewComplete,
  savePlayerSummary,
  type AwardTrackId,
  type PlayerSummary,
  type SummaryContext,
} from '../lib/playerSummary';
import {
  loadAdventureSetHistory,
  pickForcedReviewItems,
  pushAdventureClearedSet,
  type AdventureSetHistory,
} from '../lib/adventureSetHistory';
import { pickVisuallyDistinctItems } from '../lib/emojiVisualConflicts';
import type { Cell, ChallengeMode, QuizKind, Tile, WordItem } from '../types/game';
import type { RefillBurst } from '../lib/boardRefill';
import { allBoardCellKeys } from '../lib/boardRefill';
import { boardSetupIdentity } from '../lib/boardSetupIdentity';
import {
  loadFirstTimeGuideState,
  recordFeatureGuidePrompt,
  saveFirstTimeGuideState,
  type FeatureGuideTarget,
  type FirstTimeGuideState,
} from '../lib/firstTimeGuide';

type AdventureBoardSnapshot = {
  version: 1;
  userId: string;
  roundId: string;
  savedAt: number;
  grid: Tile[][];
  gameItems: WordItem[];
  itemHitCount: Record<string, number>;
  movesLeft: number;
  level: number;
  adventurePlayable: boolean;
  staminaOwed: boolean;
  staminaPaid?: boolean;
  roundFree: boolean;
  rescueUsed: boolean;
  attemptLost: boolean;
};

type StaminaGateResume = {
  hitCount: Record<string, number>;
  excludeIds?: Set<string>;
  advanceLevel: boolean;
  modeOverride?: ChallengeMode;
};

const GRID = 7;
type FixedMatchTutorialStage = 'three' | 'four' | 'cross';

const FIXED_MATCH_TUTORIAL_MOVES: Record<
  FixedMatchTutorialStage,
  { source: Cell; target: Cell }
> = {
  three: { source: { r: 0, c: 1 }, target: { r: 1, c: 1 } },
  // Drag the outside Pea Pod into the Yarn cell to complete the four-match.
  four: { source: { r: 1, c: 2 }, target: { r: 1, c: 1 } },
  // Teach the player to drag the outside Pea Pod into the centre of the T.
  // Keeping this direction explicit also prevents the displaced Razor from
  // reading as the tutorial subject.
  cross: { source: { r: 2, c: 4 }, target: { r: 2, c: 3 } },
};
const REVIEW_TUTORIAL_MOVE = FIXED_MATCH_TUTORIAL_MOVES.three;

// Six-symbol deterministic opener. After the taught 3-match, the fixed refill
// exposes a straight 4-match; that refill then exposes a T-shaped match.
const FIXED_MATCH_TUTORIAL_BOARD = [
  [4, 4, 5, 4, 1, 0, 4],
  [4, 3, 4, 3, 2, 0, 5],
  [3, 5, 5, 2, 5, 4, 2],
  [4, 5, 0, 5, 2, 3, 1],
  [2, 1, 3, 5, 5, 3, 5],
  [1, 0, 1, 4, 0, 4, 0],
  [1, 5, 3, 1, 3, 1, 4],
] as const;

const FIXED_MATCH_TUTORIAL_REFILLS: Partial<
  Record<FixedMatchTutorialStage, readonly number[]>
> = {
  three: [4, 5, 2],
  four: [5, 4, 5, 1, 5, 4, 1],
};
const ADVENTURE_SNAPSHOT_VERSION = 1;
const ADVENTURE_SNAPSHOT_KEY_PREFIX = 'matchingo-adventure-board-v1:';

function normalizedSnapshotUserId(userId: string | null | undefined): string {
  return userId || 'guest';
}

function adventureSnapshotStorageKey(userId: string | null | undefined): string {
  return `${ADVENTURE_SNAPSHOT_KEY_PREFIX}${getActiveCourseId()}:${normalizedSnapshotUserId(userId)}`;
}

function loadAdventureBoardSnapshot(
  userId: string | null | undefined,
): AdventureBoardSnapshot | null {
  try {
    const raw = localStorage.getItem(adventureSnapshotStorageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AdventureBoardSnapshot>;
    if (
      parsed.version !== ADVENTURE_SNAPSHOT_VERSION ||
      parsed.userId !== normalizedSnapshotUserId(userId) ||
      typeof parsed.roundId !== 'string' ||
      !Array.isArray(parsed.grid) ||
      !Array.isArray(parsed.gameItems)
    ) {
      return null;
    }
    // Do not trust the legacy default false: background initialization could
    // save a never-played preview as paid. Preserve its layout, but require payment.
    if (parsed.staminaOwed === false && !hasAdventurePayment(parsed)) parsed.staminaOwed = true;
    return parsed as AdventureBoardSnapshot;
  } catch {
    return null;
  }
}

function saveAdventureBoardSnapshot(snapshot: AdventureBoardSnapshot): void {
  try {
    localStorage.setItem(
      adventureSnapshotStorageKey(snapshot.userId),
      JSON.stringify(snapshot),
    );
  } catch {
    // An in-memory snapshot still preserves mode switching for this session.
  }
}

function removeAdventureBoardSnapshot(userId: string | null | undefined): void {
  try {
    localStorage.removeItem(adventureSnapshotStorageKey(userId));
  } catch {
    // Optional crash recovery only.
  }
}

function validAdventureBoardSnapshot(
  snapshot: AdventureBoardSnapshot,
  userId: string | null | undefined,
  allItems: readonly WordItem[],
  learnedIds: ReadonlySet<string>,
): boolean {
  if (
    snapshot.version !== ADVENTURE_SNAPSHOT_VERSION ||
    snapshot.userId !== normalizedSnapshotUserId(userId) ||
    snapshot.gameItems.length < ADVENTURE_WORDS_PER_SET ||
    snapshot.grid.length !== GRID ||
    snapshot.grid.some((row) => row.length !== GRID)
  ) {
    return false;
  }
  const knownIds = new Set(allItems.map((item) => item.id));
  const boardItemIds = new Set(snapshot.gameItems.map((item) => item.id));
  if (
    snapshot.gameItems.some(
      (item) => !knownIds.has(item.id) || learnedIds.has(item.id),
    )
  ) {
    return false;
  }
  return snapshot.grid.every((row) =>
    row.every((tile) => boardItemIds.has(tile.itemId)),
  );
}
/**
 * Clear FX → gravity handoff.
 * Start the fall as soon as the flip/sweep is past the readable midpoint
 * so the board doesn’t idle under the word popup.
 */
/**
 * Start 补棋 as soon as the flip/sweep is past the readable midpoint
 * (emoji already gone) — don't wait for the whole clear anim to idle.
 */
const MATCH_CLEAR_MS = 320;
const LINE_CLEAR_MS = 240;
const MAX_CASCADE_WAVES = 8;

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

function makeTileId() {
  return Math.random().toString(36).slice(2, 9);
}

function makeFixedMatchTutorialGrid(itemIds: readonly string[]): Tile[][] | null {
  if (itemIds.length < 6) return null;
  return FIXED_MATCH_TUTORIAL_BOARD.map((row) =>
    row.map((itemIndex) => ({
      id: makeTileId(),
      itemId: itemIds[itemIndex],
    })),
  );
}

function fixedMatchTutorialRefillIds(
  stage: FixedMatchTutorialStage,
  itemIds: readonly string[],
): string[] | null {
  const sequence = FIXED_MATCH_TUTORIAL_REFILLS[stage];
  if (!sequence || itemIds.length < 6) return null;
  return sequence.map((itemIndex) => itemIds[itemIndex]);
}

function pickGameItems(pool: WordItem[], count: number) {
  const items = [...pool];
  // simple shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return pickVisuallyDistinctItems(items, Math.min(count, items.length));
}

type PickChallengeOptions = {
  excludeIds?: Set<string>;
  /**
   * `memory`：复习模式 — 逾期/到期优先，再按下次复习时间、最久未复习（间隔复习）。
   * `random`：随机/分类模式，在词池内洗牌后取前 N，避免总是同一批「记忆排序靠前」的词。
   */
  strategy?: 'memory' | 'random';
};

function pickChallengeItems(
  pool: WordItem[],
  count: number,
  hitCount: Record<string, number>,
  memory?: Map<string, WordMemory>,
  options?: PickChallengeOptions,
) {
  const exclude = options?.excludeIds;
  const strategy = options?.strategy ?? 'memory';
  let items = exclude ? pool.filter((it) => !exclude.has(it.id)) : [...pool];
  if (items.length < count) {
    items = [...pool];
  }
  for (let i = items.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  if (strategy === 'random') {
    return pickVisuallyDistinctItems(items, Math.min(count, items.length));
  }
  const now = Date.now();
  items.sort((a, b) => {
    const cmp = compareWordsForSpacedReview(
      memory?.get(memoryKeyForWord(a.word)),
      memory?.get(memoryKeyForWord(b.word)),
      now,
    );
    if (cmp !== 0) return cmp;
    const hitDiff = (hitCount[a.id] ?? 0) - (hitCount[b.id] ?? 0);
    if (hitDiff !== 0) return hitDiff;
    return Math.random() - 0.5;
  });
  return pickVisuallyDistinctItems(items, Math.min(count, items.length));
}

function pickVisuallyDistinctForcedReviewItems(
  history: AdventureSetHistory,
  poolById: Map<string, WordItem>,
  count: number,
  fallbackPool: WordItem[],
): WordItem[] {
  const candidateCount = Math.min(
    poolById.size,
    Math.max(count, count * 3),
  );
  const candidates = pickForcedReviewItems(
    history,
    poolById,
    candidateCount,
    fallbackPool,
  );
  return pickVisuallyDistinctItems(candidates, count);
}

/** Adventure is a strict unseen-only pool. Learned words never fill a set. */
function pickAdventureItems(
  pool: WordItem[],
  count: number,
  learnedIds: ReadonlySet<string>,
  excludeIds?: ReadonlySet<string>,
): WordItem[] {
  const unseen = pool.filter((item) => !learnedIds.has(item.id));

  // The first set teaches the product promise with recognizable things whose
  // English names are useful but less likely to be known already.
  // Later sets keep the existing shuffle and unseen-word rules.
  if (learnedIds.size === 0 && (!excludeIds || excludeIds.size === 0)) {
    const firstWords = ['Safety Pin', 'Detergent', 'Razor', 'Yarn', 'Beaver', 'Pea Pod'];
    const firstSet = firstWords
      .map((word) => unseen.find((item) => item.word === word))
      .filter((item): item is WordItem => Boolean(item));
    if (firstSet.length >= count) return firstSet.slice(0, count);
  }

  const preferNotExcluded = (items: WordItem[]) => {
    if (!excludeIds || excludeIds.size === 0) return pickGameItems(items, items.length);
    return [
      ...pickGameItems(
        items.filter((item) => !excludeIds.has(item.id)),
        items.length,
      ),
      ...pickGameItems(
        items.filter((item) => excludeIds.has(item.id)),
        items.length,
      ),
    ];
  };

  return preferNotExcluded(unseen).slice(0, Math.min(count, unseen.length));
}

function makeGrid(itemIds: string[], preferredOpportunityId?: string): Tile[][] {
  return createBalancedOpeningGrid(
    itemIds,
    makeTileId,
    preferredOpportunityId
      ? { preferredOpportunityIds: [preferredOpportunityId] }
      : undefined,
  );
}

function newlyClaimableAwardIds(
  beforeContext: SummaryContext,
  beforeSummary: PlayerSummary,
  afterContext: SummaryContext,
  afterSummary: PlayerSummary,
): AwardTrackId[] {
  return AWARD_TRACKS.filter((track) => {
    const before = awardTrackProgress(track, beforeContext, beforeSummary);
    const after = awardTrackProgress(track, afterContext, afterSummary);
    return after.claimable && !before.claimable;
  }).map((track) => track.id);
}

type Match = {
  cells: { r: number; c: number }[];
  itemId: string;
};

function findMatches(grid: Tile[][]): Match[] {
  const matches: Match[] = [];
  // rows
  for (let r = 0; r < GRID; r++) {
    let c = 0;
    while (c < GRID) {
      const start = c;
      const itemId = grid[r][c].itemId;
      while (c < GRID && grid[r][c].itemId === itemId) c++;
      const len = c - start;
      if (len >= 3) {
        matches.push({
          itemId,
          cells: Array.from({ length: len }, (_, i) => ({ r, c: start + i })),
        });
      }
    }
  }
  // cols
  for (let c = 0; c < GRID; c++) {
    let r = 0;
    while (r < GRID) {
      const start = r;
      const itemId = grid[r][c].itemId;
      while (r < GRID && grid[r][c].itemId === itemId) r++;
      const len = r - start;
      if (len >= 3) {
        matches.push({
          itemId,
          cells: Array.from({ length: len }, (_, i) => ({ r: start + i, c })),
        });
      }
    }
  }
  // merge overlaps into a set
  const byKey = new Map<string, { r: number; c: number; itemId: string }>();
  for (const m of matches) {
    for (const cell of m.cells) {
      byKey.set(`${cell.r}:${cell.c}`, { ...cell, itemId: m.itemId });
    }
  }
  const grouped = new Map<string, { r: number; c: number }[]>();
  for (const v of byKey.values()) {
    const k = v.itemId;
    const arr = grouped.get(k) ?? [];
    arr.push({ r: v.r, c: v.c });
    grouped.set(k, arr);
  }
  return [...grouped.entries()].map(([itemId, cells]) => ({ itemId, cells }));
}

type LineRun = {
  orientation: 'row' | 'col';
  index: number;
  itemId: string;
  cells: Cell[];
};

function scanLineRuns(
  grid: Tile[][],
  orientation: 'row' | 'col',
  minLen: number,
  fullLine: boolean,
): LineRun[] {
  const runs: LineRun[] = [];
  if (orientation === 'row') {
    for (let r = 0; r < GRID; r++) {
      let c = 0;
      while (c < GRID) {
        const start = c;
        const itemId = grid[r][c].itemId;
        while (c < GRID && grid[r][c].itemId === itemId) c++;
        const len = c - start;
        if (len >= minLen) {
          runs.push({
            orientation: 'row',
            index: r,
            itemId,
            cells: fullLine
              ? Array.from({ length: GRID }, (_, i) => ({ r, c: i }))
              : Array.from({ length: len }, (_, i) => ({ r, c: start + i })),
          });
        }
      }
    }
    return runs;
  }
  for (let c = 0; c < GRID; c++) {
    let r = 0;
    while (r < GRID) {
      const start = r;
      const itemId = grid[r][c].itemId;
      while (r < GRID && grid[r][c].itemId === itemId) r++;
      const len = r - start;
      if (len >= minLen) {
        runs.push({
          orientation: 'col',
          index: c,
          itemId,
          cells: fullLine
            ? Array.from({ length: GRID }, (_, i) => ({ r: i, c }))
            : Array.from({ length: len }, (_, i) => ({ r: start + i, c })),
        });
      }
    }
  }
  return runs;
}

/** Straight runs of 4+ identical tiles (row or column). */
function findLongLineRuns(grid: Tile[][]): LineRun[] {
  return [
    ...scanLineRuns(grid, 'row', 4, false),
    ...scanLineRuns(grid, 'col', 4, false),
  ];
}

/**
 * When horizontal and vertical 3-matches intersect (cross / T / L), clear every
 * affected full row and column.
 */
function findCrossLineRuns(grid: Tile[][]): LineRun[] {
  const horizontal = scanLineRuns(grid, 'row', 3, false);
  const vertical = scanLineRuns(grid, 'col', 3, false);
  if (horizontal.length === 0 || vertical.length === 0) return [];

  const crossRows = new Set<number>();
  const crossCols = new Set<number>();
  const rowItem = new Map<number, string>();
  const colItem = new Map<number, string>();

  for (const h of horizontal) {
    for (const v of vertical) {
      const intersects = h.cells.some((hc) =>
        v.cells.some((vc) => hc.r === vc.r && hc.c === vc.c),
      );
      if (!intersects) continue;
      crossRows.add(h.index);
      crossCols.add(v.index);
      rowItem.set(h.index, h.itemId);
      colItem.set(v.index, v.itemId);
    }
  }
  if (crossRows.size === 0 || crossCols.size === 0) return [];

  const runs: LineRun[] = [];
  for (const index of crossRows) {
    runs.push({
      orientation: 'row',
      index,
      itemId: rowItem.get(index) ?? '',
      cells: Array.from({ length: GRID }, (_, c) => ({ r: index, c })),
    });
  }
  for (const index of crossCols) {
    runs.push({
      orientation: 'col',
      index,
      itemId: colItem.get(index) ?? '',
      cells: Array.from({ length: GRID }, (_, r) => ({ r, c: index })),
    });
  }
  return runs;
}

function findLineClearRuns(grid: Tile[][]): LineRun[] {
  const byKey = new Map<string, LineRun>();
  for (const run of [...findCrossLineRuns(grid), ...findLongLineRuns(grid)]) {
    byKey.set(`${run.orientation}:${run.index}`, run);
  }
  return [...byKey.values()];
}

function clearCellsForLongRuns(runs: LineRun[]): Cell[] {
  const out = new Map<string, Cell>();
  for (const run of runs) {
    if (run.orientation === 'row') {
      for (let c = 0; c < GRID; c++) out.set(`${run.index}:${c}`, { r: run.index, c });
    } else {
      for (let r = 0; r < GRID; r++) out.set(`${r}:${run.index}`, { r, c: run.index });
    }
  }
  return [...out.values()];
}

function runsTouchingCells(runs: LineRun[], cells: Cell[]): LineRun[] {
  const keys = new Set(cells.map((c) => `${c.r}:${c.c}`));
  return runs.filter((run) => run.cells.some((c) => keys.has(`${c.r}:${c.c}`)));
}

function swap(grid: Tile[][], a: { r: number; c: number }, b: { r: number; c: number }): Tile[][] {
  const next = grid.map((row) => row.slice());
  const t = next[a.r][a.c];
  next[a.r][a.c] = next[b.r][b.c];
  next[b.r][b.c] = t;
  return next;
}

function sameCell(left: Cell, right: Cell): boolean {
  return left.r === right.r && left.c === right.c;
}

function sameCellPair(
  from: Cell,
  to: Cell,
  pair: { source: Cell; target: Cell },
): boolean {
  return (
    (sameCell(from, pair.source) && sameCell(to, pair.target)) ||
    (sameCell(from, pair.target) && sameCell(to, pair.source))
  );
}

function findHintMove(grid: Tile[][]): { a: Cell; b: Cell } | null {
  return findBestHintMove(grid);
}

/** Find an adjacent swap that directly creates a straight 4+ or a cross/T/L clear. */
function findFourPlusHintMove(grid: Tile[][]): { source: Cell; target: Cell } | null {
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const source = { r, c };
      for (const [dr, dc] of [[0, 1], [1, 0]] as const) {
        const target = { r: r + dr, c: c + dc };
        if (target.r >= GRID || target.c >= GRID) continue;
        if (grid[source.r][source.c].itemId === grid[target.r][target.c].itemId) continue;
        const swapped = swap(grid, source, target);
        const touched = [source, target];
        const makesLongLine = runsTouchingCells(findLongLineRuns(swapped), touched).length > 0;
        const makesCross = runsTouchingCells(findCrossLineRuns(swapped), touched).length > 0;
        if (makesLongLine || makesCross) return { source, target };
      }
    }
  }
  return null;
}

/**
 * Null cleared cells, pack survivors down each column, spawn new tiles at the top.
 * Same gravity model for normal 3-matches and full row/col line clears.
 */
function collapseAndRefill(
  grid: Tile[][],
  clearedKeys: Iterable<string>,
  itemIds: string[],
  preferItemIds?: readonly string[],
  fixedRefill?: { itemIds: readonly string[]; cursor: number },
): { grid: Tile[][]; cleared: number } {
  const toClear = new Set(clearedKeys);
  if (toClear.size === 0) return { grid, cleared: 0 };

  const next: (Tile | null)[][] = grid.map((row) => row.map((t) => t));
  for (const key of toClear) {
    const [rs, cs] = key.split(':');
    const r = Number(rs);
    const c = Number(cs);
    if (Number.isFinite(r) && Number.isFinite(c)) next[r][c] = null;
  }

  const out: Tile[][] = Array.from({ length: GRID }, () =>
    Array.from({ length: GRID }, () => ({ id: '', itemId: '' })),
  );
  for (let c = 0; c < GRID; c++) {
    const col: Tile[] = [];
    for (let r = GRID - 1; r >= 0; r--) {
      const t = next[r][c];
      if (t) col.push(t);
    }
    for (let r = GRID - 1; r >= 0; r--) {
      const idxFromBottom = GRID - 1 - r;
      const existing = col[idxFromBottom];
      out[r][c] = existing
        ? existing
        : {
            id: makeTileId(),
            itemId:
              fixedRefill && fixedRefill.cursor < fixedRefill.itemIds.length
                ? fixedRefill.itemIds[fixedRefill.cursor++]
                : pickSmartRefillItemId(out, r, c, itemIds, preferItemIds),
          };
    }
  }

  return { grid: out, cleared: toClear.size };
}

/**
 * Gentle refill weighting only. Repeating ids changes probability without
 * planting a match or rewriting any tile already visible on the board.
 */
function refillIdsForProgress(
  itemIds: readonly string[],
  hitCount: Readonly<Record<string, number>>,
  movesLeft: number,
): string[] {
  const late = movesLeft <= LATE_BOARD_ASSIST_MOVES;
  return itemIds.flatMap((id) => {
    const hits = Math.max(0, Math.min(HITS_PER_WORD_DEFAULT, hitCount[id] ?? 0));
    const weight = late
      ? hits === 0 ? 10 : hits === 1 ? 12 : hits === 2 ? 13 : 8
      : hits === 0 ? 10 : hits === 1 ? 11 : hits === 2 ? 12 : 9;
    return Array.from({ length: weight }, () => id);
  });
}

const CONSENT_ACCEPTED_KEY = 'smellycat-match3-legal-consent';

function prepareBoardGrid(itemIds: string[], funTargetId?: string): Tile[][] {
  let grid = makeGrid(itemIds, funTargetId);
  for (let attempt = 0; attempt < 8; attempt++) {
    const analysis = analyzeOpeningBoard(grid, itemIds);
    const balanced =
      itemIds.length !== 6 ||
      (analysis.minCount >= 6 && analysis.maxCount <= 10 && analysis.maxCount - analysis.minCount <= 4);
    const targetPlayable = !funTargetId || hasSwapMatchForItem(grid, funTargetId);
    if (
      !analysis.hasAutoMatch &&
      analysis.legalMoveCount > 0 &&
      analysis.longMoveCount > 0 &&
      balanced &&
      targetPlayable
    ) {
      return grid;
    }
    grid = makeGrid(itemIds, funTargetId);
  }

  // The balanced generator already plants the timed target when supplied.
  // Keep the previous repair only as an unreachable safety net.
  if (funTargetId) {
    ensureTimedTargetPlayable(grid, funTargetId, itemIds);
    if (findMatches(grid).length > 0) {
      grid = makeGrid(itemIds, funTargetId);
      ensureTimedTargetPlayable(grid, funTargetId, itemIds);
    }
  } else if (!findBestHintMove(grid) && itemIds[0]) {
    ensureTimedTargetPlayable(grid, itemIds[0], itemIds);
  }
  return grid;
}

/** Repair in place when possible; otherwise rebuild. Always verify the shown target. */
function prepareTimedTargetGrid(
  current: Tile[][],
  targetItemId: string,
  itemIds: string[],
): Tile[][] {
  // Retry the local repair before ever replacing the whole board. Keeping the
  // existing tile ids/positions prevents a target change from looking like a
  // fresh board drop.
  for (let attempt = 0; attempt < 8; attempt++) {
    const repaired = current.map((row) => row.map((tile) => ({ ...tile })));
    ensureTimedTargetPlayable(repaired, targetItemId, itemIds);
    if (
      findMatches(repaired).length === 0 &&
      hasSwapMatchForItem(repaired, targetItemId) &&
      findHintMove(repaired)
    ) {
      return repaired;
    }
  }
  return prepareBoardGrid(itemIds, targetItemId);
}

function pickTimedTargetId(
  items: WordItem[],
  hitCount: Record<string, number>,
  excludeId?: string,
  /** Revive ignores board hit caps — it has its own correct/wrong counters. */
  ignoreHitCap = false,
  /** During revive: prefer words with fewer than hitsPerWord correct target hits. */
  reviveHits?: Record<string, number>,
  hitsPerWord = 2,
  /** Shelf progress needed before a word is "done" (review = 2, else 3). */
  shelfHitsNeeded = HITS_PER_WORD_DEFAULT,
): string {
  if (items.length === 0) return '';
  let pool: WordItem[];
  if (reviveHits) {
    pool = items.filter((it) => (reviveHits[it.id] ?? 0) < hitsPerWord);
    // All revive targets done — caller should end revive; don't keep hunting.
    if (pool.length === 0) return '';
  } else if (ignoreHitCap) {
    pool = [...items];
  } else {
    pool = items.filter((it) => (hitCount[it.id] ?? 0) < shelfHitsNeeded);
    // Shelf complete — no more timed targets (avoids infinite review loop).
    if (pool.length === 0) return '';
  }
  if (excludeId && pool.length > 1) {
    const narrowed = pool.filter((it) => it.id !== excludeId);
    if (narrowed.length > 0) pool = narrowed;
  }
  if (pool.length === 0) return '';
  return pool[randInt(pool.length)].id;
}

/**
 * Change timed targets without changing the settled board. Only words that
 * already have a verified one-swap answer are eligible. Callers may use the
 * older target picker + board repair solely as a last-resort fallback.
 */
function pickPlayableTimedTargetId(
  items: WordItem[],
  hitCount: Record<string, number>,
  grid: Tile[][],
  excludeId?: string,
  ignoreHitCap = false,
  reviveHits?: Record<string, number>,
  hitsPerWord = 2,
  shelfHitsNeeded = HITS_PER_WORD_DEFAULT,
): string {
  const playableItems = items.filter((item) => hasSwapMatchForItem(grid, item.id));
  return pickTimedTargetId(
    playableItems,
    hitCount,
    excludeId,
    ignoreHitCap,
    reviveHits,
    hitsPerWord,
    shelfHitsNeeded,
  );
}

function shelfRoundComplete(
  items: WordItem[],
  hitCount: Record<string, number>,
  hitsNeeded: number,
): boolean {
  return (
    items.length > 0 && items.every((it) => (hitCount[it.id] ?? 0) >= hitsNeeded)
  );
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function readConsentAccepted(): boolean {
  try {
    return localStorage.getItem(CONSENT_ACCEPTED_KEY) === '1';
  } catch {
    return false;
  }
}

function writeConsentAccepted() {
  try {
    localStorage.setItem(CONSENT_ACCEPTED_KEY, '1');
  } catch {
    // ignore
  }
}

type ItemMatchGamePageProps = {
  onHome: () => void;
  initialEntry?: HomeEntry;
  bgmEnabled: boolean;
  onBgmEnabledChange: (enabled: boolean) => void;
  onBgmPauseChange: (paused: boolean) => void;
};

export const ItemMatchGamePage: React.FC<ItemMatchGamePageProps> = ({
  onHome,
  initialEntry = 'adventure',
  bgmEnabled,
  onBgmEnabledChange,
  onBgmPauseChange,
}) => {
  const { locale, t, ui } = useI18n();
  const rewardedAdCopy = REWARDED_AD_COPY[locale];
  const { courseId, course } = useCourse();
  const { hasPremiumAccess, offerings, openPaywall } = useMembership();
  const premiumAccessRef = useRef(hasPremiumAccess);
  premiumAccessRef.current = hasPremiumAccess;
  const { user, ready: authReady, configured: authConfigured } = useAuth();
  const progressUserId = user?.uid ?? null;
  const progressUserIdRef = useRef<string | null>(progressUserId);
  progressUserIdRef.current = progressUserId;
  const [firstTimeGuide, setFirstTimeGuide] = useState<FirstTimeGuideState>(() =>
    loadFirstTimeGuideState(progressUserId),
  );
  const firstTimeGuideRef = useRef(firstTimeGuide);
  firstTimeGuideRef.current = firstTimeGuide;

  const updateFirstTimeGuide = React.useCallback(
    (update: (current: FirstTimeGuideState) => FirstTimeGuideState) => {
      setFirstTimeGuide((current) => {
        const next = update(current);
        if (next === current) return current;
        firstTimeGuideRef.current = next;
        saveFirstTimeGuideState(next, progressUserIdRef.current);
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    const next = loadFirstTimeGuideState(progressUserId);
    firstTimeGuideRef.current = next;
    setFirstTimeGuide(next);
  }, [progressUserId]);

  useEffect(() => {
    if (initialEntry !== 'mood') return;
    // Choosing Mood Board on the homepage satisfies the same guide step as
    // choosing it inside the mode picker; do not require the older route.
    updateFirstTimeGuide((current) =>
      current.stage === 'moodBoard'
        ? { ...current, stage: 'completed' }
        : current,
    );
  }, [initialEntry, progressUserId, updateFirstTimeGuide]);

  useEffect(() => {
    if (initialEntry !== 'say-blast') return;
    // The stamina-shortage route opens Say & Blast directly from Home. Keep
    // that route in the same guide lifecycle as choosing it in the mode menu.
    updateFirstTimeGuide((current) => ({
      ...current,
      hasVisitedSayAndBlast: true,
      stage:
        current.stage === 'sayAndBlast'
          ? 'awaitingSayAndBlastCompletion'
          : current.stage,
    }));
  }, [initialEntry, progressUserId, updateFirstTimeGuide]);

  const allPool = useMemo<WordItem[]>(() => {
    const emojiItems: WordItem[] = EMOJI_NOUN_CATEGORIES.flatMap((cat) =>
      cat.items.map((it) => ({
        id: `emoji-${cat.id}-${it.id}`,
        word: learningWordForCourse(it, courseId),
        sourceWord: sourceWordForCourse(it, courseId),
        cn: it.cn,
        emoji: it.emoji,
      })),
    );
    const thiingsItems: WordItem[] = learningLanguageForCourse(courseId) === 'en'
      ? THIINGS_100.map((t) => ({
          id: `thiings-${t.id}`,
          word: t.word,
          imgSrc: t.imgSrc,
        }))
      : [];
    return [...emojiItems, ...thiingsItems];
  }, [courseId]);

  const [categoryCycleProgress, setCategoryCycleProgress] =
    useState<CategoryCycleProgress>(() => loadCategoryCycleProgress(progressUserId, courseId));
  const categoryCycleProgressRef = useRef(categoryCycleProgress);
  categoryCycleProgressRef.current = categoryCycleProgress;

  useEffect(() => {
    const next = loadCategoryCycleProgress(progressUserId, courseId);
    categoryCycleProgressRef.current = next;
    setCategoryCycleProgress(next);
  }, [progressUserId, courseId]);

  const categoryPools = useMemo(
    () =>
      EMOJI_LEARNING_CATEGORIES.map((category) => {
        const learningItems =
          EMOJI_LEARNING_ITEMS_BY_CATEGORY.get(category.id) ?? [];
        const items = learningItems.map<WordItem>((entry) => ({
          id: `emoji-${entry.sourceCategoryId}-${entry.item.id}`,
          word: learningWordForCourse(entry.item, courseId),
          sourceWord: sourceWordForCourse(entry.item, courseId),
          cn: entry.item.cn,
          emoji: entry.item.emoji,
        }));
        const cycle = categoryCycleEntry(
          categoryCycleProgress,
          category.id,
          items.map((item) => item.id),
        );
        return {
          id: category.id,
          label: learningCategoryTitle(category, locale),
          subtitle: learningCategoryTitle(category, locale),
          description: locale === 'zh-CN' ? category.purposeCn : CATEGORY_UI_COPY[locale].description,
          emoji: category.emoji,
          browseSectionId: getEmojiLearningBrowseSection(category.id).id,
          cycle: cycle.cycle,
          clearedInCycle: cycle.clearedItemIds.length,
          items,
        };
      }),
    [categoryCycleProgress, locale, courseId],
  );
  const [moodPaletteId, setMoodPaletteId] = useState<MoodPaletteId>(() =>
    moodPaletteForDay(),
  );
  const moodPaletteIdRef = useRef(moodPaletteId);
  moodPaletteIdRef.current = moodPaletteId;
  const moodBoardPool = useMemo(
    () => ({
      id: MOOD_BOARD_CATEGORY_ID,
      label: `${moodPaletteSwatch(moodPaletteId)} ${t.modes.moodBoard} · ${t.modes.moodPaletteName(moodPaletteId)}`,
      subtitle: `${moodPaletteSwatch(moodPaletteId)} ${t.modes.moodBoard} · ${t.modes.moodPaletteName(moodPaletteId)}`,
      items: moodBoardItems(allPool, moodPaletteId),
    }),
    [allPool, moodPaletteId, t],
  );
  const thiingsPool = useMemo(
    () => {
      if (!THIINGS_100.length || learningLanguageForCourse(courseId) !== 'en') return null;
      const items = THIINGS_100.map<WordItem>((t) => ({
        id: `thiings-${t.id}`,
        word: t.word,
        imgSrc: t.imgSrc,
      }));
      const cycle = categoryCycleEntry(
        categoryCycleProgress,
        'thiings',
        items.map((item) => item.id),
      );
      return {
            id: 'thiings',
            label: 'Thiings',
            subtitle: CATEGORY_UI_COPY[locale].imagePack,
            description: CATEGORY_UI_COPY[locale].imagePack,
            emoji: '🖼️',
            browseSectionId: 'extras',
            cycle: cycle.cycle,
            clearedInCycle: cycle.clearedItemIds.length,
            items,
          };
    },
    [categoryCycleProgress, courseId, locale],
  );
  const challengePools = useMemo(
    () => (thiingsPool ? [...categoryPools, thiingsPool] : categoryPools),
    [categoryPools, thiingsPool],
  );
  const categoryBrowseSections = useMemo(
    () => [
      ...EMOJI_LEARNING_BROWSE_SECTIONS.map((section) => ({
        id: section.id,
        label: learningSectionTitle(section, locale),
      })),
      ...(thiingsPool
        ? [{ id: 'extras', label: CATEGORY_UI_COPY[locale].extras }]
        : []),
    ],
    [locale, thiingsPool],
  );
  const moodPlayOwedRef = useRef(initialEntry === 'mood');
  const categoryPlayOwedRef = useRef(false);
  const [challengeMode, setChallengeMode] = useState<ChallengeMode>(() => {
    if (initialEntry === 'review') return 'review';
    if (initialEntry === 'mood') {
      return hasPaidModeBoard('mood', progressUserId) ||
        (canPlayMoodToday({ hasPremiumAccess, userId: progressUserId }) &&
          (hasPremiumAccess || loadStaminaState(Date.now(), progressUserId).value > 0)) ? 'mood' : 'random';
    }
    return 'random';
  });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() =>
    categoryPools.some((pool) => pool.id === 'tools-and-home-items')
      ? 'tools-and-home-items'
      : categoryPools[0]?.id ?? 'emotional-expression',
  );
  const activeCategory = useMemo(
    () => challengePools.find((c) => c.id === selectedCategoryId) ?? challengePools[0],
    [challengePools, selectedCategoryId],
  );

  const memoryScopeRef = useRef(memoryScopeForUserId(user?.uid ?? null));
  const [wordMemory, setWordMemory] = useState<Map<string, WordMemory>>(
    () => hydrateMatch3Memories(user?.uid ?? null, courseId).map,
  );
  const [roundLearnedIds, setRoundLearnedIds] = useState<string[]>(() =>
    loadRoundLearnedIds(progressUserId, courseId),
  );
  const roundLearnedIdsRef = useRef(roundLearnedIds);
  roundLearnedIdsRef.current = roundLearnedIds;
  const wordMemoryRef = useRef<Map<string, WordMemory>>(wordMemory);
  wordMemoryRef.current = wordMemory;

  useEffect(() => {
    let cancelled = false;
    const uid = user?.uid ?? null;
    const local = hydrateMatch3Memories(uid, courseId);
    memoryScopeRef.current = local.scope;
    setWordMemory(local.map);

    void hydrateMatch3MemoriesWithCloud(uid, courseId).then(({ map, scope }) => {
      if (!cancelled) {
        memoryScopeRef.current = scope;
        // Preserve any interaction that landed after hydration's final local
        // re-read but before this continuation committed the result.
        setWordMemory((current) => mergeWordMemoryMaps(current, map));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user?.uid, courseId]);

  /** Only quiz-completed words shown in Learned are eligible for review. */
  const learnedItemIds = useMemo(
    () => roundLearnedItemIds(roundLearnedIds, allPool),
    [allPool, roundLearnedIds],
  );
  const learnedItemIdSet = useMemo(() => new Set(learnedItemIds), [learnedItemIds]);
  const adventurePool = useMemo(
    () => allPool.filter((item) => !learnedItemIdSet.has(item.id)),
    [allPool, learnedItemIdSet],
  );
  const reviewPool = useMemo(
    () => allPool.filter((it) => learnedItemIdSet.has(it.id)),
    [allPool, learnedItemIdSet],
  );
  const sayBlastPool = useMemo(
    () => reviewPool.filter((item) => Boolean(item.emoji)),
    [reviewPool],
  );
  const pool = useMemo(() => {
    if (challengeMode === 'review') return reviewPool;
    if (challengeMode === 'mood') return moodBoardPool.items;
    if (challengeMode === 'category') return activeCategory?.items ?? [];
    return adventurePool;
  }, [challengeMode, reviewPool, moodBoardPool, activeCategory, adventurePool]);

  const boardSetupKey = useMemo(() => boardSetupIdentity({
    courseId,
    userId: progressUserId,
    mode: challengeMode,
    categoryId: selectedCategoryId,
    moodPaletteId,
  }), [
    courseId,
    challengeMode,
    selectedCategoryId,
    moodPaletteId,
    progressUserId,
  ]);
  const poolRef = useRef(pool);
  poolRef.current = pool;
  const allPoolRef = useRef(allPool);
  allPoolRef.current = allPool;

  const [itemHitCount, setItemHitCount] = useState<Record<string, number>>({});
  const [gameItems, setGameItems] = useState<WordItem[]>(() =>
    pickAdventureItems(pool, ADVENTURE_WORDS_PER_SET, learnedItemIdSet),
  );
  const itemById = useMemo(() => {
    const map = new Map<string, WordItem>();
    for (const it of allPool) map.set(it.id, it);
    for (const it of gameItems) map.set(it.id, it);
    return map;
  }, [allPool, gameItems]);
  const itemIds = useMemo(() => gameItems.map((i) => i.id), [gameItems]);
  const [funTargetId, setFunTargetId] = useState('');
  const [funTargetKey, setFunTargetKey] = useState(0);
  const [funCountdown, setFunCountdown] = useState(TIMED_TARGET_COUNTDOWN_SEC);
  const funTimeoutLockRef = useRef(false);
  const funCountdownRef = useRef(TIMED_TARGET_COUNTDOWN_SEC);
  const [reviveActive, setReviveActive] = useState(false);
  const reviveActiveRef = useRef(false);
  reviveActiveRef.current = reviveActive;
  const reviveAttemptRef = useRef(0);
  const [reviveWrongs, setReviveWrongs] = useState(0);
  const [reviveCorrects, setReviveCorrects] = useState(0);
  const reviveWrongsRef = useRef(0);
  const reviveCorrectsRef = useRef(0);
  const reviveWordHitsRef = useRef<Record<string, number>>({});
  /** After every 3 adventure clears, inject a mandatory review exam. */
  const [forcedReviewActive, setForcedReviewActive] = useState(false);
  const forcedReviewActiveRef = useRef(false);
  forcedReviewActiveRef.current = forcedReviewActive;
  /** Skip N boardSetupKey effect runs (seeded boards / mode handoffs). */
  const suppressBoardSetupSkipsRef = useRef(0);
  const [deadMachineOpen, setDeadMachineOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>(
    initialEntry === 'learned' ? 'learned' : initialEntry === 'collection' ? 'words' : initialEntry === 'profile' ? 'profile' : 'game',
  );
  const [reminderPromptBusy, setReminderPromptBusy] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(() => readLearningReminderSettings().enabled);
  const [rewardedAdBusy, setRewardedAdBusy] = useState(false);
  const [rewardedAdStatus, setRewardedAdStatus] = useState<string | null>(null);
  const staminaGateResumeRef = useRef<StaminaGateResume | null>(null);
  const [reviewPaused, setReviewPaused] = useState(false);
  const [gameLifecyclePaused, setGameLifecyclePaused] = useState(false);
  const [modePickerOpen, setModePickerOpen] = useState(false);
  const [categoryHubRequestKey, setCategoryHubRequestKey] = useState(0);
  const [staminaState, setStaminaState] = useState<StaminaState>(() => loadStaminaState(Date.now(), progressUserId));
  const [quotaSyncError, setQuotaSyncError] = useState(false);
  const staminaStateRef = useRef(staminaState);
  staminaStateRef.current = staminaState;
  const rewardedAdResetsRemaining = Math.max(
    0,
    AD_STAMINA_RESETS_DAILY_MAX - staminaState.adResetsToday,
  );
  useEffect(() => {
    const scoped = loadStaminaState(Date.now(), progressUserId);
    staminaStateRef.current = scoped;
    setStaminaState(scoped);
    setQuotaSyncError(false);
  }, [progressUserId]);
  /** Keep HUD at the board-entry stamina until the set ends (first move may spend). */
  const [staminaHudHold, setStaminaHudHold] = useState<number | null>(null);
  const [modeUnlocks, setModeUnlocks] = useState<ModeUnlockState>(() =>
    loadModeUnlocks(progressUserId),
  );
  const lateBoardAssistMoves =
    modeUnlocks.adventureClears === 0 ? 5 : LATE_BOARD_ASSIST_MOVES;
  const adventureSetHistoryRef = useRef<AdventureSetHistory>(
    loadAdventureSetHistory(progressUserId),
  );
  const [playerSummary, setPlayerSummary] = useState<PlayerSummary>(() =>
    loadPlayerSummary(progressUserId),
  );
  const playerSummaryRef = useRef(playerSummary);
  playerSummaryRef.current = playerSummary;
  const [movesLeft, setMovesLeft] = useState(() => movesForAdventureLevel(1));
  const movesLeftRef = useRef(movesLeft);
  movesLeftRef.current = movesLeft;
  /** Next adventure board start is free (for example, abandoning the final quiz). */
  const adventureRoundFreeRef = useRef(false);
  /** Charge 1 stamina on the first matching move of this adventure board. */
  const adventureStaminaOwedRef = useRef(true);
  const adventureStaminaPaidRef = useRef(false);
  const [adventurePlayable, setAdventurePlayable] = useState(true);
  const adventureFailedAwaitingRetryRef = useRef(false);
  const [failSheetOpen, setFailSheetOpen] = useState(false);
  const [quizKind, setQuizKind] = useState<QuizKind>('connect');
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null);
  const roundResultRef = useRef(roundResult);
  roundResultRef.current = roundResult;
  const [collectionFocusItemIds, setCollectionFocusItemIds] = useState<string[]>([]);
  const [reviveFlash, setReviveFlash] = useState<
    'success' | 'firstFailure' | 'rescueOffer' | null
  >(null);
  const [firstReviveRemainingWords, setFirstReviveRemainingWords] = useState(0);
  const [reviveWrongTip, setReviveWrongTip] = useState<string | null>(null);
  const reviveTeachingAttemptRef = useRef(false);
  const reviveWrongTipShownRef = useRef(false);
  const reviveWrongTipTimerRef = useRef<number | null>(null);
  const coreCloudScopeKey = progressUserId ? `${progressUserId}:${courseId}` : null;
  const [coreCloudReadyScope, setCoreCloudReadyScope] = useState<string | null>(null);

  useEffect(() => {
    const nextLearnedIds = loadRoundLearnedIds(progressUserId, courseId);
    roundLearnedIdsRef.current = nextLearnedIds;
    setRoundLearnedIds(nextLearnedIds);
    setModeUnlocks(loadModeUnlocks(progressUserId));
    const nextSummary = loadPlayerSummary(progressUserId);
    playerSummaryRef.current = nextSummary;
    setPlayerSummary(nextSummary);
    adventureSetHistoryRef.current = loadAdventureSetHistory(progressUserId);
    setForcedReviewActive(false);
    forcedReviewActiveRef.current = false;
    setReviewPaused(false);
  }, [progressUserId, courseId]);

  useEffect(() => {
    setCoreCloudReadyScope(null);
    if (!progressUserId) return;
    let cancelled = false;
    void hydrateCoreProgressWithCloud(progressUserId, courseId).then((merged) => {
      if (cancelled) return;
      roundLearnedIdsRef.current = merged.learnedIds;
      setRoundLearnedIds(merged.learnedIds);
      setModeUnlocks(merged.modeUnlocks);
      playerSummaryRef.current = merged.playerSummary;
      setPlayerSummary(merged.playerSummary);
      categoryCycleProgressRef.current = merged.categoryCycles;
      setCategoryCycleProgress(merged.categoryCycles);
      setCoreCloudReadyScope(`${progressUserId}:${courseId}`);
    });
    return () => {
      cancelled = true;
    };
  }, [progressUserId, courseId]);

  useEffect(() => {
    if (!progressUserId || coreCloudReadyScope !== coreCloudScopeKey) return;
    persistCoreProgress(progressUserId, {
      learnedIds: roundLearnedIds,
      modeUnlocks,
      playerSummary,
      categoryCycles: categoryCycleProgress,
    }, { courseId });
  }, [
    categoryCycleProgress,
    courseId,
    coreCloudReadyScope,
    coreCloudScopeKey,
    modeUnlocks,
    playerSummary,
    progressUserId,
    roundLearnedIds,
  ]);

  const funTargetItem = useMemo(() => {
    const timedHunt = reviveActive || challengeMode === 'review';
    if (!timedHunt) return null;
    if (funTargetId) {
      const found = itemById.get(funTargetId);
      if (found) return found;
    }
    return gameItems[0] ?? null;
  }, [reviveActive, challengeMode, funTargetId, itemById, gameItems]);

  const challengeModeRef = useRef(challengeMode);
  challengeModeRef.current = challengeMode;
  const boardOwnerModeRef = useRef<ChallengeMode>(challengeMode);
  const boardOwnerCategoryIdRef = useRef(selectedCategoryId);
  const getReminderGameState = React.useCallback(() => {
    const now = Date.now();
    const current = tickStamina(staminaStateRef.current, now);
    const remaining = msUntilNextStamina(current, now);
    return {
      dueReviewCount: reviewPool.reduce((count, item) => {
        const memory = wordMemoryRef.current.get(memoryKeyForWord(item.word));
        return count + (!memory || isDue(memory, now) ? 1 : 0);
      }, 0),
      staminaValue: current.value,
      nextStaminaAt: remaining === null ? null : now + remaining,
    };
  }, [reviewPool]);
  const reviewRoundBoardMistakeIdsRef = useRef<Set<string>>(new Set());

  const persistStamina = React.useCallback((next: StaminaState) => {
    setStaminaState(next);
    staminaStateRef.current = next;
    saveStaminaState(next, progressUserIdRef.current);
  }, []);

  const adoptCloudQuota = React.useCallback((quota: DailyQuota) => {
    persistStamina(staminaFromDailyQuota(quota, staminaStateRef.current));
    saveMoodDailyState({ dayKey: quota.dayKey, plays: quota.moodPlaysToday }, progressUserIdRef.current);
    setQuotaSyncError(false);
  }, [persistStamina]);

  useEffect(() => {
    const uid = progressUserId;
    if (!isCloudQuotaAvailable(uid)) return;
    let disposed = false;
    const refresh = async () => {
      try {
        const quota = await synchronizeDailyQuota(
          uid,
          tickStamina(staminaStateRef.current),
          loadMoodDailyState({ userId: uid }).plays,
        );
        if (!disposed) adoptCloudQuota(quota);
      } catch (error) {
        console.warn('[match3] daily quota sync failed', error);
        if (!disposed) setQuotaSyncError(true);
      }
    };
    void refresh();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [adoptCloudQuota, progressUserId]);

  const holdStaminaHudForBoard = React.useCallback(() => {
    setStaminaHudHold(staminaStateRef.current.value);
  }, []);

  const clearStaminaHudHold = React.useCallback(() => {
    setStaminaHudHold(null);
  }, []);

  const applySpendStamina = React.useCallback(
    (amount = 1): boolean => {
      const spent = spendStamina(staminaStateRef.current, amount);
      if (!spent) return false;
      persistStamina(spent);
      return true;
    },
    [persistStamina],
  );

  const applyTimedTargetMiss = React.useCallback((targetId: string | undefined) => {
    if (!targetId) return;
    const item = itemById.get(targetId);
    if (!item?.word) return;
    if (challengeModeRef.current === 'review' && !reviveActiveRef.current) {
      reviewRoundBoardMistakeIdsRef.current.add(targetId);
    }
    setWordMemory((prev) => {
      const next = new Map(prev);
      recordWordRecallFailure(next, item.word, item.cn);
      persistWordMemories(next, memoryScopeRef.current, { courseId });
      return next;
    });
  }, [courseId, itemById]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const next = tickStamina(staminaStateRef.current);
      if (
        next.value !== staminaStateRef.current.value ||
        next.lastRegenAt !== staminaStateRef.current.lastRegenAt ||
        next.dayKey !== staminaStateRef.current.dayKey
      ) {
        persistStamina(next);
      }
      if (next.value > 0 && adventureFailedAwaitingRetryRef.current) {
        setAdventurePlayable(true);
        setDeadMachineOpen(false);
        setFailSheetOpen(true);
      }
    }, deadMachineOpen ? 1_000 : 15_000);
    return () => window.clearInterval(id);
  }, [deadMachineOpen, persistStamina]);

  useEffect(() => {
    if (
      challengeMode === 'review' &&
      initialEntry !== 'review' &&
      !isReviewUnlocked(modeUnlocks.adventureClears)
    ) {
      setChallengeMode('random');
    } else if (
      challengeMode === 'category' &&
      !isCategoryUnlocked(modeUnlocks.adventureClears)
    ) {
      setChallengeMode('random');
    }
  }, [challengeMode, initialEntry, modeUnlocks.adventureClears]);

  const [grid, setGrid] = useState<Tile[][]>(() => prepareBoardGrid(itemIds));
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [level, setLevel] = useState(1);
  const [fixedMatchTutorialStage, setFixedMatchTutorialStage] =
    useState<FixedMatchTutorialStage | null>(null);
  const fixedMatchTutorialStageRef = useRef(fixedMatchTutorialStage);
  fixedMatchTutorialStageRef.current = fixedMatchTutorialStage;
  const [reviewTutorialActive, setReviewTutorialActive] = useState(false);
  const reviewTutorialActiveRef = useRef(reviewTutorialActive);
  reviewTutorialActiveRef.current = reviewTutorialActive;
  const [firstSwapTutorialMove, setFirstSwapTutorialMove] = useState<{
    source: Cell;
    target: Cell;
  } | null>(null);
  const firstSwapTutorialMoveRef = useRef(firstSwapTutorialMove);
  firstSwapTutorialMoveRef.current = firstSwapTutorialMove;
  const [firstSwapTutorialResolving, setFirstSwapTutorialResolving] =
    useState(false);
  const firstSwapTutorialResolvingRef = useRef(false);
  const [popWord, setPopWord] = useState<{
    word: string;
    sourceWord?: string;
    cn?: string;
    emoji?: string;
    imgSrc?: string;
    originCell?: Cell;
    isFirstDiscovery?: boolean;
  } | null>(null);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => loadSfxEnabled());
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() =>
    loadHapticsEnabled(),
  );
  const [sayBlastOpen, setSayBlastOpen] = useState(initialEntry === 'say-blast');
  const [sayBlastEntry, setSayBlastEntry] = useState<'game' | 'homepage' | 'stamina-gate'>(
    initialEntry === 'say-blast' ? 'homepage' : 'game',
  );
  const [accountPromptKind, setAccountPromptKind] = useState<AccountPromptKind | null>(null);
  const [promptSignInOpen, setPromptSignInOpen] = useState(false);
  const [promptSignInMode, setPromptSignInMode] = useState<'signIn' | 'signUp'>('signIn');
  const [accountSaveConfirmation, setAccountSaveConfirmation] = useState(false);
  const accountOverlayOpen =
    accountPromptKind !== null || promptSignInOpen;
  const promptAuthStartedRef = useRef(false);
  const ttsUnlockRef = useRef(false);

  useEffect(() => {
    const restoreVocabularyAudio = () => {
      resetWordSpeechAfterBackground();
      setGameLifecyclePaused(false);
      // iOS may require a fresh foreground user gesture even if audio was
      // unlocked before the app switch.
      ttsUnlockRef.current = false;
      setTtsAvailable(true);
    };
    const prepareVocabularyAudio = () => {
      if (document.visibilityState !== 'visible') return;
      restoreVocabularyAudio();
    };
    const suspendVocabularyAudio = () => {
      stopAllWordSpeech();
      setGameLifecyclePaused(true);
      ttsUnlockRef.current = false;
      // Leaving the browser tab or native app is an explicit pause. Keep the
      // review stopped after foregrounding so the player decides when to resume.
      if (challengeModeRef.current === 'review') setReviewPaused(true);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') suspendVocabularyAudio();
      else prepareVocabularyAudio();
    };
    // WKWebView does not consistently deliver visibility/focus events for an
    // app switch. Capacitor's native lifecycle signal is the authoritative path.
    const nativeListener = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) restoreVocabularyAudio();
      else suspendVocabularyAudio();
    });
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('focus', prepareVocabularyAudio);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('focus', prepareVocabularyAudio);
      void nativeListener.then((handle) => handle.remove());
    };
  }, []);

  const popWordSeqRef = useRef(0);
  const popDoneRef = useRef<Promise<void>>(Promise.resolve());
  const roundSwitchPendingRef = useRef(false);
  const pendingRoundRef = useRef<{ hitCount: Record<string, number>; excludeIds: Set<string> } | null>(
    null,
  );
  const rescueUsedRef = useRef(false);
  const adventureBoardSnapshotRef = useRef<AdventureBoardSnapshot | null>(null);
  const snapshotRestoreInFlightRef = useRef(false);
  const [restoredZeroMovePending, setRestoredZeroMovePending] = useState(false);
  const [quizCheckpoint, setQuizCheckpoint] = useState<PendingQuiz | null>(() => loadPendingQuiz(courseId, progressUserId));
  const quizCheckpointRef = useRef(quizCheckpoint);
  const restoredQuizIdRef = useRef<string | null>(null);
  const quizCompletionInFlightRef = useRef(false);
  const clearAdventureSnapshot = React.useCallback(() => {
    adventureBoardSnapshotRef.current = null;
    removeAdventureBoardSnapshot(progressUserIdRef.current);
  }, []);

  const persistCurrentModeBoard = React.useCallback((mode: ResumableMode, playOwed: boolean) => {
    if (gameItems.length < ADVENTURE_WORDS_PER_SET) return;
    saveModeBoardSnapshot({
      version: 1,
      userId: normalizedSnapshotUserId(progressUserIdRef.current),
      mode,
      categoryId: mode === 'category' ? selectedCategoryId : null,
      paletteId: mode === 'mood' ? moodPaletteId : null,
      grid: gridRef.current.map((row) => row.map((tile) => ({ ...tile }))),
      gameItems: [...gameItems],
      itemHitCount: { ...itemHitCount },
      playOwed,
      savedAt: Date.now(),
    });
  }, [gameItems, itemHitCount, moodPaletteId, selectedCategoryId]);

  useEffect(() => {
    if (quizCheckpointRef.current) return;
    snapshotRestoreInFlightRef.current = true;
    const learned = new Set(roundLearnedIdsRef.current);
    const saved = loadAdventureBoardSnapshot(progressUserId);
    if (
      !saved ||
      !validAdventureBoardSnapshot(saved, progressUserId, allPool, learned)
    ) {
      adventureBoardSnapshotRef.current = null;
      setRestoredZeroMovePending(false);
      if (saved) removeAdventureBoardSnapshot(progressUserId);
      snapshotRestoreInFlightRef.current = false;
      return;
    }

    adventureBoardSnapshotRef.current = saved;
    // Homepage shortcuts are explicit destinations. Retain a valid Adventure
    // snapshot for later, but do not let it override Mood/Review on mount.
    if (initialEntry !== 'adventure') {
      snapshotRestoreInFlightRef.current = false;
      return;
    }
    if (!premiumAccessRef.current && tickStamina(staminaStateRef.current).value <= 0 && saved.staminaOwed) {
      // An unpaid preview must go through the same gate as a new board.
      setAdventurePlayable(false);
      setDeadMachineOpen(true);
      setGameItems([]);
      setGrid(makeGrid([]));
      snapshotRestoreInFlightRef.current = false;
      return;
    }
    suppressBoardSetupSkipsRef.current = Math.max(
      suppressBoardSetupSkipsRef.current,
      1,
    );
    setChallengeMode('random');
    setAdventurePlayable(saved.adventurePlayable);
    adventureStaminaOwedRef.current = saved.staminaOwed;
    adventureStaminaPaidRef.current = hasAdventurePayment(saved);
    adventureRoundFreeRef.current = saved.roundFree;
    const restoredFailure = saved.attemptLost || (saved.movesLeft <= 0 && saved.rescueUsed);
    rescueUsedRef.current = saved.rescueUsed;
    adventureAttemptLostRef.current = restoredFailure;
    adventureFailedAwaitingRetryRef.current = restoredFailure;
    movesLeftRef.current = saved.movesLeft;
    setMovesLeft(saved.movesLeft);
    setLevel(saved.level);
    setGameItems([...saved.gameItems]);
    setItemHitCount({ ...saved.itemHitCount });
    setGrid(saved.grid.map((row) => row.map((tile) => ({ ...tile }))));
    setSelected(null);
    setHintMove(null);
    setWordLink(null);
    setPopWord(null);
    setBoardIntroActive(false);
    setFailSheetOpen(restoredFailure);
    setRestoredZeroMovePending(saved.movesLeft <= 0 && !restoredFailure);
    const release = window.setTimeout(() => {
      snapshotRestoreInFlightRef.current = false;
    }, 0);
    return () => window.clearTimeout(release);
  }, [allPool, initialEntry, progressUserId]);
  const rescueSnapshotRef = useRef<{
    grid: Tile[][];
    hitCount: Record<string, number>;
  } | null>(null);
  /** A failed Rescue ends the attempt and breaks the Adventure Win Streak. */
  const adventureAttemptLostRef = useRef(false);
  const rescueQuizPendingRef = useRef(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizItems, setQuizItems] = useState<WordItem[]>([]);
  const quizItemsRef = useRef(quizItems);
  quizItemsRef.current = quizItems;
  const finishReviewWithoutQuizRef = useRef<() => void>(() => undefined);
  const [roundCelebrate, setRoundCelebrate] = useState(false);

  useEffect(() => {
    if (!authReady) return;
    const saved = loadPendingQuiz(courseId, progressUserId);
    if (!saved) {
      if (quizCheckpointRef.current && quizCheckpointRef.current.userId !== (progressUserId || 'guest')) {
        quizCheckpointRef.current = null;
        setQuizCheckpoint(null);
        setQuizOpen(false);
      }
      return;
    }
    if (restoredQuizIdRef.current === saved.id) return;
    if (saved.items.some(item => !allPool.some(available => available.id === item.id))) {
      clearPendingQuiz(courseId, progressUserId);
      quizCheckpointRef.current = null;
      setQuizCheckpoint(null);
      return;
    }
    restoredQuizIdRef.current = saved.id;
    quizCheckpointRef.current = saved;
    setQuizCheckpoint(saved);
    quizCompletionInFlightRef.current = false;
    setChallengeMode(saved.mode);
    boardOwnerModeRef.current = saved.mode;
    boardOwnerCategoryIdRef.current = saved.categoryId ?? '';
    if (saved.categoryId) setSelectedCategoryId(saved.categoryId);
    setMoodPaletteId(saved.paletteId);
    setLevel(saved.level);
    setGameItems(saved.items);
    setItemHitCount(saved.hitCount);
    adventureAttemptLostRef.current = saved.attemptLost;
    adventureStaminaOwedRef.current = false;
    forcedReviewActiveRef.current = saved.forcedReview;
    setForcedReviewActive(saved.forcedReview);
    pendingRoundRef.current = { hitCount: saved.hitCount, excludeIds: new Set(saved.items.map(item => item.id)) };
    roundSwitchPendingRef.current = true;
    quizItemsRef.current = saved.items;
    setQuizItems(saved.items);
    setQuizKind(saved.kind);
    setFailSheetOpen(false);
    setDeadMachineOpen(false);
    setSayBlastOpen(false);
    setActiveTab('game');
    setBoardIntroActive(false);
    setQuizOpen(true);
  }, [authReady, courseId, progressUserId, allPool]);

  useEffect(() => {
    if (activeTab !== 'game' || quizCheckpointRef.current || snapshotRestoreInFlightRef.current || challengeMode !== 'random' || boardOwnerModeRef.current !== 'random') return;
    if (
      quizOpen ||
      roundCelebrate ||
      roundSwitchPendingRef.current ||
      (!adventurePlayable && !failSheetOpen) ||
      gameItems.length < ADVENTURE_WORDS_PER_SET
    ) {
      if (quizOpen || roundCelebrate || roundSwitchPendingRef.current) {
        clearAdventureSnapshot();
      }
      return;
    }
    const learned = new Set(roundLearnedIdsRef.current);
    if (gameItems.some((item) => learned.has(item.id))) {
      clearAdventureSnapshot();
      return;
    }
    const previous = adventureBoardSnapshotRef.current;
    const previousItemKey = previous?.gameItems.map((item) => item.id).sort().join('|');
    const currentItemKey = gameItems.map((item) => item.id).sort().join('|');
    const snapshot: AdventureBoardSnapshot = {
      version: ADVENTURE_SNAPSHOT_VERSION,
      userId: normalizedSnapshotUserId(progressUserId),
      roundId:
        previous && previousItemKey === currentItemKey
          ? previous.roundId
          : `adventure-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      savedAt: Date.now(),
      grid: grid.map((row) => row.map((tile) => ({ ...tile }))),
      gameItems: [...gameItems],
      itemHitCount: { ...itemHitCount },
      movesLeft: movesLeftRef.current,
      level,
      adventurePlayable,
      staminaOwed: adventureStaminaOwedRef.current,
      staminaPaid: adventureStaminaPaidRef.current,
      roundFree: adventureRoundFreeRef.current,
      rescueUsed: rescueUsedRef.current,
      attemptLost: adventureAttemptLostRef.current,
    };
    adventureBoardSnapshotRef.current = snapshot;
    saveAdventureBoardSnapshot(snapshot);
  }, [
    activeTab,
    adventurePlayable,
    challengeMode,
    clearAdventureSnapshot,
    gameItems,
    failSheetOpen,
    grid,
    itemHitCount,
    level,
    movesLeft,
    progressUserId,
    quizOpen,
    roundCelebrate,
  ]);

  const analyticsLedgerRef = useRef(createCoreEventLedger());
  const analyticsAttemptRef = useRef(0);
  const analyticsRoundKey = `${analyticsAttemptRef.current}:${courseId}:${challengeMode}:${level}:${gameItems.map((item) => item.id).sort().join('|')}`;
  const recordRoundAnalytics = React.useCallback((event: 'game_started' | 'set_completed' | 'quiz_completed', mistakenIds: string[] = []) => {
    const occurrence = `${analyticsAttemptRef.current}:${analyticsRoundKey}`;
    if (!analyticsLedgerRef.current(event, occurrence)) return;
    const common = { course: courseId, set_number: level };
    if (event === 'game_started') {
      trackCoreEvent(event, { ...common, mode: challengeMode === 'random' ? 'adventure' : challengeMode });
    } else if (event === 'set_completed') {
      trackCoreEvent(event, { ...common, words_count: gameItems.length });
    } else {
      trackCoreEvent(event, { ...common, ...quizAnalyticsScore(quizItemsRef.current.map((item) => item.id), mistakenIds) });
    }
  }, [analyticsRoundKey, courseId, level, challengeMode, gameItems]);

  const openRoundCelebrate = React.useCallback((items: WordItem[] = gameItems) => {
    recordRoundAnalytics('set_completed');
    // Option A: the board hands straight to its memory check. Celebration and
    // settlement are now one screen after the quiz.
    const kind = Math.random() < 0.35 ? 'connect' : 'pick';
    const checkpoint: PendingQuiz = {
      version: 1, id: `quiz-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      courseId, userId: progressUserIdRef.current || 'guest', items: [...items], kind,
      mode: challengeMode, level, categoryId: challengeMode === 'category' ? selectedCategoryId : null,
      paletteId: moodPaletteId, attemptLost: adventureAttemptLostRef.current,
      forcedReview: forcedReviewActiveRef.current,
      hitCount: { ...(pendingRoundRef.current?.hitCount ?? itemHitCount) },
    };
    savePendingQuiz(checkpoint);
    if (challengeMode === 'random') clearAdventureSnapshot();
    quizCheckpointRef.current = checkpoint;
    restoredQuizIdRef.current = checkpoint.id;
    setQuizCheckpoint(checkpoint);
    quizCompletionInFlightRef.current = false;
    quizItemsRef.current = items;
    setQuizItems(items);
    setQuizKind(kind);
    setQuizOpen(true);
  }, [recordRoundAnalytics, gameItems, courseId, challengeMode, level, selectedCategoryId, moodPaletteId, itemHitCount, clearAdventureSnapshot]);
  const [matchShakeKey, setMatchShakeKey] = useState(0);
  const [matchClearCells, setMatchClearCells] = useState<Cell[] | null>(null);
  const [matchClearKey, setMatchClearKey] = useState(0);
  const [wordLink, setWordLink] = useState<{
    itemId: string;
    originCell: Cell;
    burstKey: number;
  } | null>(null);
  const wordLinkSeqRef = useRef(0);
  const clearTimerRef = useRef<number | null>(null);
  const boardEpochRef = useRef(0);
  const quotaChargePendingRef = useRef(false);
  const hintTimerRef = useRef<number | null>(null);
  const [hintMove, setHintMove] = useState<{ a: Cell; b: Cell } | null>(null);
  /** 首次进入显示服务条款同意；接受后写入 localStorage */
  const [consentOpen, setConsentOpen] = useState(() => !readConsentAccepted());
  const [boardIntroActive, setBoardIntroActive] = useState(true);
  const handleBoardIntroComplete = React.useCallback(() => {
    setBoardIntroActive(false);
  }, []);
  const [refillBurst, setRefillBurst] = useState<RefillBurst | null>(null);
  const [refillActive, setRefillActive] = useState(false);
  const refillActiveRef = useRef(false);
  const refillDoneResolverRef = useRef<(() => void) | null>(null);
  const cascadeRunningRef = useRef(false);
  const [cascadeBusy, setCascadeBusy] = useState(false);
  useEffect(() => {
    if (challengeMode !== 'mood' && challengeMode !== 'category') return;
    if (snapshotRestoreInFlightRef.current || roundResultRef.current !== null ||
      boardOwnerModeRef.current !== challengeMode ||
      (challengeMode === 'category' && boardOwnerCategoryIdRef.current !== selectedCategoryId) ||
      boardIntroActive || quizOpen || roundCelebrate ||
      roundSwitchPendingRef.current || cascadeBusy || matchClearCells !== null) return;
    persistCurrentModeBoard(
      challengeMode,
      challengeMode === 'mood' ? moodPlayOwedRef.current : categoryPlayOwedRef.current,
    );
  }, [boardIntroActive, cascadeBusy, challengeMode, grid, itemHitCount, matchClearCells,
    persistCurrentModeBoard, quizOpen, roundCelebrate]);
  const refillKeyRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const tabScrollTopsRef = useRef<Partial<Record<AppTab, number>>>({});
  const isCandyTab = activeTab !== 'game';
  const firstSwapTutorialEligible =
    reviewTutorialActive ||
    fixedMatchTutorialStage !== null ||
    (!consentOpen &&
      !firstTimeGuide.hasCompletedFirstSwapTutorial &&
      modeUnlocks.adventureClears === 0 &&
      challengeMode === 'random' &&
      level === 1 &&
      adventurePlayable &&
      gameItems.length >= ADVENTURE_WORDS_PER_SET);
  const firstSwapTutorialPendingRef = useRef(firstSwapTutorialEligible);
  firstSwapTutorialPendingRef.current = firstSwapTutorialEligible;
  const [freeMoveRuleHintMove, setFreeMoveRuleHintMove] = useState<{
    source: Cell;
    target: Cell;
  } | null>(null);
  const freeMoveTutorialOutcomeRef = useRef<'normal' | 'fourPlus' | null>(null);

  const startFreeMoveRuleTutorial = React.useCallback(() => {
    if (firstTimeGuideRef.current.hasStartedFreeMoveRuleTutorial) return;
    updateFirstTimeGuide((current) => ({
      ...current,
      hasStartedFreeMoveRuleTutorial: true,
    }));
  }, [updateFirstTimeGuide]);

  const completeFreeMoveRuleTutorial = React.useCallback(() => {
    setFreeMoveRuleHintMove(null);
    updateFirstTimeGuide((current) => ({
      ...current,
      hasStartedFreeMoveRuleTutorial: true,
      hasCompletedFreeMoveRuleTutorial: true,
    }));
  }, [updateFirstTimeGuide]);

  const completeFirstSwapTutorial = React.useCallback(() => {
    updateFirstTimeGuide((current) =>
      current.hasCompletedFirstSwapTutorial
        ? current
        : { ...current, hasCompletedFirstSwapTutorial: true },
    );
    firstSwapTutorialResolvingRef.current = false;
    setFirstSwapTutorialResolving(false);
    setFirstSwapTutorialMove(null);
  }, [updateFirstTimeGuide]);

  const completeReviewTutorial = React.useCallback(() => {
    setReviewTutorialActive(false);
    setFirstSwapTutorialMove(null);
    firstSwapTutorialResolvingRef.current = false;
    setFirstSwapTutorialResolving(false);
    updateFirstTimeGuide((current) =>
      current.hasCompletedReviewTutorial
        ? current
        : { ...current, hasCompletedReviewTutorial: true },
    );
  }, [updateFirstTimeGuide]);

  const completeFixedMatchTutorial = React.useCallback(() => {
    setFixedMatchTutorialStage(null);
    setFirstSwapTutorialMove(null);
    firstSwapTutorialResolvingRef.current = false;
    setFirstSwapTutorialResolving(false);
    updateFirstTimeGuide((current) => ({
      ...current,
      hasCompletedFirstSwapTutorial: true,
      hasStartedFreeMoveRuleTutorial: true,
      hasCompletedFreeMoveRuleTutorial: true,
    }));
  }, [updateFirstTimeGuide]);

  const recordGuidePlayback = React.useCallback(
    (target: FeatureGuideTarget) => {
      updateFirstTimeGuide((current) =>
        recordFeatureGuidePrompt(current, target),
      );
    },
    [updateFirstTimeGuide],
  );

  useEffect(() => {
    if (!firstSwapTutorialEligible) {
      setFirstSwapTutorialMove(null);
      return;
    }
    if (firstSwapTutorialResolvingRef.current) return;
    const fixedMove = reviewTutorialActive && !reviveActive
      ? REVIEW_TUTORIAL_MOVE
      : fixedMatchTutorialStage
      ? FIXED_MATCH_TUTORIAL_MOVES[fixedMatchTutorialStage]
      : null;
    const timedTutorialMove =
      reviewTutorialActive && reviveActive && funTargetId
        ? findHintMoveForItem(grid, funTargetId)
        : null;
    const fallbackMove = fixedMove || timedTutorialMove ? null : findHintMove(grid);
    setFirstSwapTutorialMove(fixedMove ?? (fallbackMove
      ? { source: fallbackMove.a, target: fallbackMove.b }
      : timedTutorialMove
        ? { source: timedTutorialMove.a, target: timedTutorialMove.b }
        : null));
    setHintMove(null);
    if (hintTimerRef.current) {
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
  }, [
    firstSwapTutorialEligible,
    fixedMatchTutorialStage,
    funTargetId,
    grid,
    reviewTutorialActive,
    reviveActive,
  ]);

  useEffect(() => {
    if (
      fixedMatchTutorialStage !== null ||
      challengeMode !== 'random' ||
      !firstTimeGuide.hasStartedFreeMoveRuleTutorial ||
      firstTimeGuide.hasCompletedFreeMoveRuleTutorial
    ) {
      setFreeMoveRuleHintMove(null);
      return;
    }
    if (boardIntroActive || cascadeBusy || refillActive || quizOpen || roundCelebrate) return;
    setFreeMoveRuleHintMove(findFourPlusHintMove(grid));
  }, [
    boardIntroActive,
    cascadeBusy,
    challengeMode,
    fixedMatchTutorialStage,
    firstTimeGuide.hasCompletedFreeMoveRuleTutorial,
    firstTimeGuide.hasStartedFreeMoveRuleTutorial,
    grid,
    quizOpen,
    refillActive,
    roundCelebrate,
  ]);

  useEffect(() => {
    void syncStatusBarForTab(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'game' && challengeMode === 'review') {
      setReviewPaused(true);
    }
  }, [activeTab, challengeMode]);

  const handleTabChange = React.useCallback(
    (tab: AppTab) => {
      if (scrollContainerRef.current && activeTab !== 'game') {
        tabScrollTopsRef.current[activeTab] = scrollContainerRef.current.scrollTop;
      }
      if (tab === 'learned') {
        // The Learned page owns this guide step. It advances only after the
        // player completes or skips the page tour, not merely on tab entry.
      }
      setActiveTab(tab);
    },
    [activeTab],
  );

  useLayoutEffect(() => {
    if (activeTab === 'game') return;
    const saved = tabScrollTopsRef.current[activeTab];
    if (scrollContainerRef.current && saved != null) {
      scrollContainerRef.current.scrollTop = saved;
    }
  }, [activeTab]);

  const acceptConsent = React.useCallback(() => {
    setConsentOpen(false);
    writeConsentAccepted();
  }, []);

  const handleBgmEnabledChange = (enabled: boolean) => {
    onBgmEnabledChange(enabled);
  };

  const handleSfxEnabledChange = (enabled: boolean) => {
    setSfxEnabled(enabled);
    saveSfxEnabled(enabled);
  };

  const handleHapticsEnabledChange = (enabled: boolean) => {
    setHapticsEnabled(enabled);
    saveHapticsEnabled(enabled);
  };

  const cancelPendingBoardWork = React.useCallback(() => {
    if (clearTimerRef.current) {
      window.clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
    cascadeRunningRef.current = false;
    setCascadeBusy(false);
    if (refillDoneResolverRef.current) {
      const resolve = refillDoneResolverRef.current;
      refillDoneResolverRef.current = null;
      resolve();
    }
    setMatchClearCells(null);
    stopAllWordSpeech();
    popWordSeqRef.current += 1;
    setPopWord(null);
  }, []);

  const handleRefillActiveChange = React.useCallback((active: boolean) => {
    const wasActive = refillActiveRef.current;
    refillActiveRef.current = active;
    setRefillActive(active);
    // Resolve only on active → idle (gravity finished).
    if (wasActive && !active && refillDoneResolverRef.current) {
      const resolve = refillDoneResolverRef.current;
      refillDoneResolverRef.current = null;
      resolve();
    }
  }, []);

  const waitForRefillDone = React.useCallback(() => {
    return new Promise<void>((resolve) => {
      let settled = false;
      let sawActive = refillActiveRef.current;
      let pollTimer: number | null = null;
      const startedAt = Date.now();

      const finish = () => {
        if (settled) return;
        settled = true;
        if (pollTimer !== null) window.clearTimeout(pollTimer);
        if (refillDoneResolverRef.current === finish) {
          refillDoneResolverRef.current = null;
        }
        resolve();
      };

      refillDoneResolverRef.current = finish;

      const poll = () => {
        if (settled) return;
        if (refillActiveRef.current) sawActive = true;
        if (sawActive && !refillActiveRef.current) {
          finish();
          return;
        }
        const elapsed = Date.now() - startedAt;
        // No falling sprites for this burst — don't stall the cascade.
        if (!sawActive && elapsed > 220) {
          finish();
          return;
        }
        if (elapsed > 1000) {
          finish();
          return;
        }
        pollTimer = window.setTimeout(poll, 24);
      };

      // Let React commit + gravity useLayoutEffect arm first.
      requestAnimationFrame(() => {
        requestAnimationFrame(poll);
  });
    });
  }, []);

  const bumpBoardEpoch = React.useCallback(() => {
    boardEpochRef.current += 1;
    cancelPendingBoardWork();
  }, [cancelPendingBoardWork]);

  const emitRefillBurst = React.useCallback(
    (before: Tile[][], after: Tile[][], clearedKeys: ReadonlySet<string>) => {
      setRefillBurst({
        key: ++refillKeyRef.current,
        before: before.map((row) => row.map((t) => ({ ...t }))),
        after: after.map((row) => row.map((t) => ({ ...t }))),
        clearedKeys,
      });
    },
    [],
  );

  /** When no adjacent swap can match, reshuffle tiles (same word set). */
  const reshuffleDeadlockedBoard = React.useCallback(
    (current: Tile[][]): Tile[][] => {
      if (itemIds.length < 2) return current;
      if (findHintMove(current)) return current;
      // A full-board drop is reserved for a real deadlock. A timed target that
      // is no longer playable is handled separately by choosing the next
      // verified target; it must never masquerade as a dead board.
      const next = prepareBoardGrid(itemIds);
      emitRefillBurst(current, next, allBoardCellKeys());
      setSelected(null);
      setHintMove(null);
      return next;
    },
    [itemIds, emitRefillBurst],
  );

  const clearReviveState = React.useCallback(() => {
    setReviveActive(false);
    reviveActiveRef.current = false;
    reviveAttemptRef.current = 0;
    setReviveWrongs(0);
    setReviveCorrects(0);
    reviveWrongsRef.current = 0;
    reviveCorrectsRef.current = 0;
    reviveWordHitsRef.current = {};
    reviveTeachingAttemptRef.current = false;
    reviveWrongTipShownRef.current = false;
    setReviveWrongTip(null);
    if (reviveWrongTipTimerRef.current) {
      window.clearTimeout(reviveWrongTipTimerRef.current);
      reviveWrongTipTimerRef.current = null;
    }
    if (challengeModeRef.current !== 'review') {
      setFunTargetId('');
    }
  }, []);

  const showFirstReviveWrongTip = React.useCallback((remainingChances: number) => {
    if (!reviveTeachingAttemptRef.current || reviveWrongTipShownRef.current) return;
    reviveWrongTipShownRef.current = true;
    setReviveWrongTip(
      ui.rescue.wrong(remainingChances),
    );
    if (reviveWrongTipTimerRef.current) {
      window.clearTimeout(reviveWrongTipTimerRef.current);
    }
    reviveWrongTipTimerRef.current = window.setTimeout(() => {
      setReviveWrongTip(null);
      reviveWrongTipTimerRef.current = null;
    }, 1800);
  }, [ui]);

  const resetRescueLifecycle = React.useCallback(() => {
    rescueUsedRef.current = false;
    rescueSnapshotRef.current = null;
    adventureAttemptLostRef.current = false;
    rescueQuizPendingRef.current = false;
    adventureFailedAwaitingRetryRef.current = false;
  }, []);

  /** Empty adventure board + dead-machine sheet; clears unpaid board charge. */
  const lockAdventureDead = React.useCallback(() => {
    updateFirstTimeGuide((current) => ({
      ...current,
      hasSeenStaminaShortage: true,
      stage:
        current.stage === 'moodBoard' || current.stage === 'completed'
          ? current.stage
          : current.hasVisitedSayAndBlast
            ? 'moodBoard'
            : 'sayAndBlast',
    }));
    adventureStaminaOwedRef.current = false;
    adventureRoundFreeRef.current = false;
    clearStaminaHudHold();
    setAdventurePlayable(false);
    setDeadMachineOpen(true);
    setGameItems([]);
    setGrid(makeGrid([]));
    setItemHitCount({});
    setSelected(null);
    setHintMove(null);
    setQuizOpen(false);
    pendingRoundRef.current = null;
    roundSwitchPendingRef.current = false;
    setRoundCelebrate(false);
    setFunTargetId('');
    clearReviveState();
    resetRescueLifecycle();
  }, [clearReviveState, clearStaminaHudHold, resetRescueLifecycle, updateFirstTimeGuide]);

  /** Commit a new board only after its first valid match. */
  const chargeAdventureStaminaIfNeeded = React.useCallback(async (): Promise<boolean> => {
    const mode = challengeModeRef.current;
    const uid = progressUserIdRef.current;
    const needsCharge = (mode === 'category' && categoryPlayOwedRef.current) ||
      (mode === 'mood' && moodPlayOwedRef.current) ||
      (mode === 'random' && !reviveActiveRef.current && adventureStaminaOwedRef.current);
    if (!needsCharge) return true;
    if (isCloudQuotaAvailable(uid) && (mode === 'mood' || !hasPremiumAccess)) {
      try {
        const quota = await spendDailyQuota(
          uid,
          mode as 'random' | 'category' | 'mood',
          hasPremiumAccess,
          tickStamina(staminaStateRef.current),
          loadMoodDailyState({ userId: uid }).plays,
        );
        if (!quota) {
          const latest = await synchronizeDailyQuota(
            uid,
            tickStamina(staminaStateRef.current),
            loadMoodDailyState({ userId: uid }).plays,
          );
          adoptCloudQuota(latest);
          if (mode !== 'mood' && !hasPremiumAccess &&
            staminaFromDailyQuota(latest, staminaStateRef.current).value <= 0) lockAdventureDead();
          return false;
        }
        adoptCloudQuota(quota);
        if (mode === 'category') {
          categoryPlayOwedRef.current = false;
          persistCurrentModeBoard('category', false);
        } else if (mode === 'mood') {
          moodPlayOwedRef.current = false;
          persistCurrentModeBoard('mood', false);
        } else {
          adventureStaminaOwedRef.current = false;
          adventureStaminaPaidRef.current = true;
        }
        return true;
      } catch (error) {
        console.warn('[match3] daily board charge failed', error);
        setQuotaSyncError(true);
        return false;
      }
    }
    if (challengeModeRef.current === 'category' && categoryPlayOwedRef.current) {
      if (!hasPremiumAccess && !applySpendStamina(1)) {
        lockAdventureDead();
        return false;
      }
      categoryPlayOwedRef.current = false;
      persistCurrentModeBoard('category', false);
      return true;
    }
    if (challengeModeRef.current === 'mood' && moodPlayOwedRef.current) {
      const options = { hasPremiumAccess, userId: progressUserIdRef.current };
      if (!canPlayMoodToday(options)) return false;
      if (!hasPremiumAccess && !applySpendStamina(1)) {
        lockAdventureDead();
        return false;
      }
      if (!tryConsumeMoodPlay(options)) return false;
      moodPlayOwedRef.current = false;
      persistCurrentModeBoard('mood', false);
      return true;
    }
    if (challengeModeRef.current !== 'random' || reviveActiveRef.current) return true;
    if (!adventureStaminaOwedRef.current) return true;
    if (!hasPremiumAccess && !applySpendStamina(1)) {
      lockAdventureDead();
      return false;
    }
    adventureStaminaOwedRef.current = false;
    adventureStaminaPaidRef.current = true;
    return true;
  }, [adoptCloudQuota, applySpendStamina, hasPremiumAccess, lockAdventureDead, persistCurrentModeBoard]);

  /** Arm timed target hunt (revive challenge or review mode). */
  const armTimedTarget = React.useCallback(
    (
      items: WordItem[],
      hitCount: Record<string, number>,
      excludeId?: string,
      /** Revive ignores 3-hit caps; review prefers unfinished words. */
      ignoreHitCap = false,
    ) => {
      const ids = items.map((it) => it.id);
      const shelfHits = hitsNeededForMode(challengeModeRef.current);
      const currentGrid = gridRef.current;
      const playableId = pickPlayableTimedTargetId(
        items,
        hitCount,
        currentGrid,
        excludeId,
        ignoreHitCap,
        ignoreHitCap ? reviveWordHitsRef.current : undefined,
        REVIVE_HITS_PER_WORD,
        shelfHits,
      );
      const id = playableId ||
        pickTimedTargetId(
          items,
          hitCount,
          excludeId,
          ignoreHitCap,
          ignoreHitCap ? reviveWordHitsRef.current : undefined,
          REVIVE_HITS_PER_WORD,
          shelfHits,
        ) ||
        items.find((it) => it.id !== excludeId)?.id ||
        items[0]?.id ||
        '';
      funTimeoutLockRef.current = false;
      funCountdownRef.current = TIMED_TARGET_COUNTDOWN_SEC;
      setFunCountdown(TIMED_TARGET_COUNTDOWN_SEC);
      setFunTargetId(id);
      setFunTargetKey((k) => k + 1);
      if (id && !playableId) {
        setGrid((prev) => {
          return prepareTimedTargetGrid(prev, id, ids);
        });
      }
      return id;
    },
    [],
  );

  const retryAdventureBoard = React.useCallback(
    (items: WordItem[], free: boolean) => {
      if (challengeMode === 'random') {
        adventureStaminaPaidRef.current = false;
        if (free) {
          adventureStaminaOwedRef.current = false;
          clearStaminaHudHold();
        } else if (!premiumAccessRef.current && tickStamina(staminaStateRef.current).value <= 0) {
          lockAdventureDead();
          return false;
        } else {
          adventureStaminaOwedRef.current = true;
          holdStaminaHudForBoard();
        }
        setAdventurePlayable(true);
        setDeadMachineOpen(false);
      }
      adventureRoundFreeRef.current = false;
      analyticsAttemptRef.current += 1;
      bumpBoardEpoch();
      clearReviveState();
      resetRescueLifecycle();
      const nextHitCount: Record<string, number> = {};
      setItemHitCount(nextHitCount);
      setGameItems(items);
      setSelected(null);
      setPopWord(null);
      setHintMove(null);
      setWordLink(null);
      setFailSheetOpen(false);
      setRoundCelebrate(false);
      roundSwitchPendingRef.current = false;
      pendingRoundRef.current = null;
      setQuizOpen(false);
      if (challengeMode === 'random') {
        const budget = movesForAdventureLevel(level);
        movesLeftRef.current = budget;
        setMovesLeft(budget);
      }
      setGrid(prepareBoardGrid(items.map((i) => i.id)));
      setBoardIntroActive(true);
      return true;
    },
    [
      challengeMode,
      bumpBoardEpoch,
      clearReviveState,
      clearStaminaHudHold,
      holdStaminaHudForBoard,
      resetRescueLifecycle,
      lockAdventureDead,
      level,
    ],
  );

  const recordCurrentAdventureLoss = React.useCallback(() => {
    adventureAttemptLostRef.current = true;
    const unlocks = loadModeUnlocks(progressUserIdRef.current);
    setPlayerSummary(
      recordAdventureFail(
        playerSummaryRef.current,
        {
          adventureClears: unlocks.adventureClears,
          masteredCount: masteredEmojiCount(wordMemoryRef.current, allPool),
          reviewUnlocked: isReviewUnlocked(unlocks.adventureClears),
          categoryUnlocked: isCategoryUnlocked(unlocks.adventureClears),
        },
        Date.now(),
        progressUserIdRef.current,
      ),
    );
  }, [allPool]);

  const endAdventureFailed = React.useCallback(() => {
    clearReviveState();
    adventureFailedAwaitingRetryRef.current = true;
    const hasStamina = premiumAccessRef.current || staminaStateRef.current.value > 0;
    setAdventurePlayable(hasStamina);
    setFailSheetOpen(true);
    setDeadMachineOpen(false);
    recordCurrentAdventureLoss();
  }, [clearReviveState, recordCurrentAdventureLoss]);

  const failReviveAttempt = React.useCallback(() => {
    bumpBoardEpoch();
    rescueSnapshotRef.current = null;
    roundSwitchPendingRef.current = false;
    setSelected(null);
    setHintMove(null);
    setWordLink(null);
    setMatchClearCells(null);
    endAdventureFailed();
  }, [bumpBoardEpoch, endAdventureFailed]);

  const enterRevive = React.useCallback((
    adventureGrid: Tile[][],
    adventureHitCount: Record<string, number>,
  ) => {
    if (
      challengeMode !== 'random' ||
      reviveActiveRef.current ||
      rescueUsedRef.current
    ) {
      return;
    }
    rescueUsedRef.current = true;
    const firstTutorial = !firstTimeGuideRef.current.hasSeenReviveTutorial;
    reviveTeachingAttemptRef.current = firstTutorial;
    reviveWrongTipShownRef.current = false;
    setFirstReviveRemainingWords(
      gameItems.filter(
        (item) => (adventureHitCount[item.id] ?? 0) < HITS_PER_WORD_DEFAULT,
      ).length,
    );
    rescueSnapshotRef.current = {
      grid: adventureGrid.map((row) => row.map((tile) => ({ ...tile }))),
      hitCount: { ...adventureHitCount },
    };
    setReviveFlash(firstTutorial ? 'firstFailure' : null);
    setReviveActive(true);
    reviveActiveRef.current = true;
    reviveAttemptRef.current = 1;
    setReviveWrongs(0);
    setReviveCorrects(0);
    reviveWrongsRef.current = 0;
    reviveCorrectsRef.current = 0;
    reviveWordHitsRef.current = {};
    setReviewTutorialActive(
      !firstTimeGuideRef.current.hasCompletedReviewTutorial,
    );
    setHintMove(null);
    if (hintTimerRef.current) {
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    armTimedTarget(gameItems, adventureHitCount, undefined, true);
  }, [challengeMode, armTimedTarget, gameItems]);

  // Older snapshots could persist a settled zero-move board without the
  // matching revive/failure state. Repair that snapshot after its grid and
  // progress have committed, rather than leaving an apparently live but
  // permanently input-locked board. Entering revive does not spend stamina.
  useEffect(() => {
    if (!restoredZeroMovePending || gameItems.length < ADVENTURE_WORDS_PER_SET) return;
    setRestoredZeroMovePending(false);
    enterRevive(gridRef.current, itemHitCount);
  }, [enterRevive, gameItems.length, itemHitCount, restoredZeroMovePending]);

  // Heal missing revive / review target.
  useEffect(() => {
    const timedHunt = reviveActive || challengeMode === 'review';
    if (!timedHunt) return;
    // Refill/cascade frames are intentionally incomplete. Healing against one
    // of those transient grids can replace the just-settled board and replay a
    // full-board drop when only the prompt changed.
    if (cascadeBusy || refillActive || matchClearCells !== null || boardIntroActive) return;
    if (funTargetId && itemById.has(funTargetId)) {
      if (!hasSwapMatchForItem(grid, funTargetId)) {
        const replacementId = pickPlayableTimedTargetId(
          gameItems,
          itemHitCount,
          grid,
          funTargetId,
          reviveActive,
          reviveActive ? reviveWordHitsRef.current : undefined,
          REVIVE_HITS_PER_WORD,
          hitsNeededForMode(challengeMode),
        );
        if (replacementId) {
          funCountdownRef.current = TIMED_TARGET_COUNTDOWN_SEC;
          setFunCountdown(TIMED_TARGET_COUNTDOWN_SEC);
          setFunTargetId(replacementId);
          setFunTargetKey((key) => key + 1);
        } else {
          // Every unfinished candidate is currently blocked. Repair one target
          // as a verified last resort so the banner can never have no answer.
          setGrid((current) => prepareTimedTargetGrid(current, funTargetId, itemIds));
        }
      }
      return;
    }
    if (gameItems.length === 0) return;
    if (roundSwitchPendingRef.current || quizOpen || roundCelebrate) return;
    if (!reviveActive) {
      const hitsNeeded = hitsNeededForMode(challengeMode);
      if (shelfRoundComplete(gameItems, itemHitCount, hitsNeeded)) return;
    }
    armTimedTarget(gameItems, itemHitCount, undefined, reviveActive);
  }, [
    reviveActive,
    challengeMode,
    funTargetId,
    itemById,
    gameItems,
    itemHitCount,
    armTimedTarget,
    quizOpen,
    roundCelebrate,
    grid,
    itemIds,
    cascadeBusy,
    refillActive,
    matchClearCells,
    boardIntroActive,
  ]);

  const handleFunTimeout = React.useCallback(() => {
    const reviewHunt =
      challengeModeRef.current === 'review' && !reviveActiveRef.current;
    if (!reviveActiveRef.current && !reviewHunt) return;
    if (funTimeoutLockRef.current) return;

    const hitsNeeded = hitsNeededForMode(challengeModeRef.current);

    // Shelf already finished — stop hunting; don't loop forever.
    if (reviewHunt && shelfRoundComplete(gameItems, itemHitCount, hitsNeeded)) {
      funTimeoutLockRef.current = false;
      setFunTargetId('');
      if (!roundSwitchPendingRef.current) {
        roundSwitchPendingRef.current = true;
        const prevIds = new Set(gameItems.map((it) => it.id));
        pendingRoundRef.current = { hitCount: { ...itemHitCount }, excludeIds: prevIds };
        const snapshot = [...gameItems];
        quizItemsRef.current = snapshot;
        setQuizItems(snapshot);
        finishReviewWithoutQuizRef.current();
      }
      return;
    }

    funTimeoutLockRef.current = true;

    const sfxVolume = resolveSfxVolume(bgmEnabled);
    unlockGameAudio();
    playWrongSfx(sfxVolume);

    // Timeout on the current target → pull that word back on the forgetting curve.
    applyTimedTargetMiss(funTargetId);

    if (reviveActiveRef.current) {
      const nextWrong = reviveWrongsRef.current + 1;
      reviveWrongsRef.current = nextWrong;
      setReviveWrongs(nextWrong);
      if (nextWrong >= REVIVE_WRONG_LIMIT) {
        funTimeoutLockRef.current = false;
        failReviveAttempt();
        return;
      }
    }

    // Always advance the timer + retarget, even if the word stays the same.
    // Previously an empty pick left the countdown stuck at 0 forever.
    const playableTargetId = pickPlayableTimedTargetId(
      gameItems,
      itemHitCount,
      grid,
      funTargetId,
      reviveActiveRef.current,
      reviveActiveRef.current ? reviveWordHitsRef.current : undefined,
      REVIVE_HITS_PER_WORD,
      hitsNeeded,
    );
    // The board is fixed for the entire countdown. Retarget only to a word
    // that already has a verified answer on this exact settled grid. The
    // current target remains eligible when it is the sole playable choice.
    const newTargetId = playableTargetId ||
      (hasSwapMatchForItem(grid, funTargetId) ? funTargetId : '');
    funCountdownRef.current = TIMED_TARGET_COUNTDOWN_SEC;
    setFunCountdown(TIMED_TARGET_COUNTDOWN_SEC);
    if (newTargetId) {
      setFunTargetId(newTargetId);
      setFunTargetKey((k) => k + 1);
    } else {
      // Defensive only: the timer is paused when a target is not playable, and
      // the stable-board healer will prepare the next prompt before restarting.
      setFunTargetId('');
    }
    funTimeoutLockRef.current = false;
  }, [
    funTargetId,
    gameItems,
    itemHitCount,
    grid,
    bgmEnabled,
    failReviveAttempt,
    applyTimedTargetMiss,
  ]);

  const succeedRevive = React.useCallback(() => {
    if (roundSwitchPendingRef.current) return;
    roundSwitchPendingRef.current = true;
    pendingRoundRef.current = {
      hitCount: { ...(rescueSnapshotRef.current?.hitCount ?? itemHitCount) },
      excludeIds: new Set(gameItems.map((item) => item.id)),
    };
    rescueSnapshotRef.current = null;
    rescueQuizPendingRef.current = true;
    setQuizItems([...gameItems]);
    clearReviveState();
    setReviveFlash('success');
  }, [gameItems, itemHitCount, clearReviveState]);

  const startNextRound = React.useCallback(
    (
      nextHitCount: Record<string, number>,
      excludeIds?: Set<string>,
      advanceLevel = false,
      modeOverride?: ChallengeMode,
    ) => {
      const targetMode = modeOverride ?? challengeModeRef.current;
      if (targetMode === 'mood') {
        if (!canPlayMoodToday({ hasPremiumAccess, userId: progressUserIdRef.current }) ||
          (!hasPremiumAccess && tickStamina(staminaStateRef.current).value <= 0)) return;
        moodPlayOwedRef.current = true;
      }
      if (targetMode === 'category') {
        if (!premiumAccessRef.current && tickStamina(staminaStateRef.current).value <= 0) {
          lockAdventureDead();
          return;
        }
        categoryPlayOwedRef.current = true;
      }
      const moodPaletteForRound =
        targetMode === 'mood' ? moodPaletteForDay() : moodPaletteId;
      if (targetMode === 'mood' && moodPaletteForRound !== moodPaletteId) {
        // A round already in progress keeps its original palette. Once the
        // player asks for the next board, move to the new local day's palette.
        // This function seeds that board itself, so skip the palette effect's
        // duplicate rebuild.
        suppressBoardSetupSkipsRef.current = Math.max(
          suppressBoardSetupSkipsRef.current,
          1,
        );
        setMoodPaletteId(moodPaletteForRound);
      }
      const targetPool =
        targetMode === 'random'
          ? allPool
          : targetMode === 'review'
            ? reviewPool
            : targetMode === 'mood'
              ? moodBoardItems(allPool, moodPaletteForRound)
              : activeCategory?.items ?? [];

      if (targetMode === 'random') {
        adventureStaminaPaidRef.current = false;
        const free = adventureRoundFreeRef.current;
        adventureRoundFreeRef.current = false;
        if (free) {
          adventureStaminaOwedRef.current = false;
          clearStaminaHudHold();
        } else if (!premiumAccessRef.current && tickStamina(staminaStateRef.current).value <= 0) {
          staminaGateResumeRef.current = {
            hitCount: { ...nextHitCount },
            excludeIds: excludeIds ? new Set(excludeIds) : undefined,
            advanceLevel,
            modeOverride: targetMode,
          };
          lockAdventureDead();
          return;
        } else {
          // Preview free until the first matching move.
          adventureStaminaOwedRef.current = true;
          holdStaminaHudForBoard();
        }
        setAdventurePlayable(true);
        setDeadMachineOpen(false);
        staminaGateResumeRef.current = null;
      }

      const nextItems =
        targetMode === 'random'
          ? pickAdventureItems(
              targetPool,
              ADVENTURE_WORDS_PER_SET,
              new Set(roundLearnedIdsRef.current),
              excludeIds,
            )
          : targetMode === 'category'
            ? pickCategoryCycleItems(
                targetPool,
                ADVENTURE_WORDS_PER_SET,
                categoryCycleEntry(
                  categoryCycleProgressRef.current,
                  selectedCategoryId,
                  targetPool.map((item) => item.id),
                ),
                excludeIds,
              )
          : pickChallengeItems(targetPool, ADVENTURE_WORDS_PER_SET, nextHitCount, wordMemoryRef.current, {
              strategy: targetMode === 'review' ? 'memory' : 'random',
              ...(excludeIds && excludeIds.size > 0 ? { excludeIds } : {}),
            });
      if (nextItems.length < ADVENTURE_WORDS_PER_SET) {
        if (targetMode === 'random') {
          adventureStaminaOwedRef.current = false;
          clearStaminaHudHold();
          clearAdventureSnapshot();
          setGameItems([]);
          setGrid(makeGrid([]));
          setItemHitCount({});
        }
        roundSwitchPendingRef.current = false;
        return;
      }
      analyticsAttemptRef.current += 1;
      const nextLevel = advanceLevel ? level + 1 : level;
      if (advanceLevel) setLevel(nextLevel);
      bumpBoardEpoch();
      boardOwnerModeRef.current = targetMode;
      boardOwnerCategoryIdRef.current = selectedCategoryId;
      setRoundCelebrate(false);
      setGameItems(nextItems);
      setItemHitCount({});
      roundSwitchPendingRef.current = false;
      setSelected(null);
      setPopWord(null);
      setHintMove(null);
      clearReviveState();
      resetRescueLifecycle();
      if (targetMode === 'random') {
        clearAdventureSnapshot();
        const budget = movesForAdventureLevel(nextLevel);
        movesLeftRef.current = budget;
        setMovesLeft(budget);
      }
      const targetId =
        targetMode === 'review'
          ? pickTimedTargetId(
              nextItems,
              {},
              undefined,
              false,
              undefined,
              2,
              HITS_PER_WORD_REVIEW,
            )
          : undefined;
      if (targetMode === 'review') {
        funTimeoutLockRef.current = false;
        funCountdownRef.current = TIMED_TARGET_COUNTDOWN_SEC;
        setFunCountdown(TIMED_TARGET_COUNTDOWN_SEC);
        setFunTargetId(targetId || '');
        setFunTargetKey((k) => k + 1);
      }
      setGrid(prepareBoardGrid(nextItems.map((i) => i.id), targetId));
      setBoardIntroActive(true);
    },
    [
      activeCategory,
      allPool,
      bumpBoardEpoch,
      clearAdventureSnapshot,
      clearStaminaHudHold,
      holdStaminaHudForBoard,
      hasPremiumAccess,
      lockAdventureDead,
      level,
      moodPaletteId,
      reviewPool,
      clearReviveState,
      resetRescueLifecycle,
      selectedCategoryId,
    ],
  );

  const finishQuizAndAdvance = React.useCallback((modeOverride?: ChallengeMode) => {
    const pending = pendingRoundRef.current;
    pendingRoundRef.current = null;
    if (pending) {
      startNextRound(pending.hitCount, pending.excludeIds, true, modeOverride);
    } else {
      roundSwitchPendingRef.current = false;
    }
  }, [startNextRound]);

  /** Enter review with an explicit board seed so dead-machine / suppress-setup races can't leave an empty board. */
  const enterReviewMode = React.useCallback(
    (
      asForcedExam: boolean,
      opts?: { keepPendingRound?: boolean; paused?: boolean; excludeIds?: Set<string> },
    ) => {
      setDeadMachineOpen(false);
      setFailSheetOpen(false);
      // Leaving adventure without running board-setup.
      adventureStaminaOwedRef.current = false;

      if (reviewPool.length < ADVENTURE_WORDS_PER_SET) {
        // Still leave the dead sheet; GamePanel will show the empty-review CTA.
        setChallengeMode('review');
        setForcedReviewActive(false);
        forcedReviewActiveRef.current = false;
        setAdventurePlayable(true);
        setGameItems([]);
        setGrid(makeGrid([]));
        setItemHitCount({});
        setFunTargetId('');
        setReviewTutorialActive(false);
        return;
      }

      if (asForcedExam || modeUnlocks.pendingForcedReview) {
        if (!modeUnlocks.pendingForcedReview) {
          const nextUnlocks: ModeUnlockState = {
            ...modeUnlocks,
            pendingForcedReview: true,
          };
          saveModeUnlocks(nextUnlocks, progressUserIdRef.current);
          setModeUnlocks(nextUnlocks);
        }
        setForcedReviewActive(true);
        forcedReviewActiveRef.current = true;
      } else {
        setForcedReviewActive(false);
        forcedReviewActiveRef.current = false;
      }

      setAdventurePlayable(true);
      clearReviveState();
      resetRescueLifecycle();
      setReviewPaused(opts?.paused ?? false);
      reviewRoundBoardMistakeIdsRef.current = new Set();

      const useForcedPool = asForcedExam || modeUnlocks.pendingForcedReview;
      const poolById = new Map(allPool.map((it) => [it.id, it] as const));
      const nextHitCount: Record<string, number> = {};
      const nextItems = useForcedPool
        ? pickVisuallyDistinctForcedReviewItems(
            adventureSetHistoryRef.current,
            poolById,
            ADVENTURE_WORDS_PER_SET,
            reviewPool,
          )
        : pickChallengeItems(
            reviewPool,
            ADVENTURE_WORDS_PER_SET,
            nextHitCount,
            wordMemoryRef.current,
            {
              strategy: 'memory',
              ...(opts?.excludeIds && opts.excludeIds.size > 0
                ? { excludeIds: opts.excludeIds }
                : {}),
            },
          );
      if (nextItems.length < ADVENTURE_WORDS_PER_SET) {
        setChallengeMode('review');
        setForcedReviewActive(false);
        forcedReviewActiveRef.current = false;
        setGameItems([]);
        setGrid(makeGrid([]));
        setItemHitCount({});
        setFunTargetId('');
        setReviewTutorialActive(false);
        return;
      }
      analyticsAttemptRef.current += 1;
      const reviewTutorialGrid =
        !firstTimeGuideRef.current.hasCompletedReviewTutorial
          ? makeFixedMatchTutorialGrid(nextItems.map((item) => item.id))
          : null;
      const targetId = reviewTutorialGrid
        ? nextItems[4]?.id
        : pickTimedTargetId(
            nextItems,
            nextHitCount,
            undefined,
            false,
            undefined,
            2,
            HITS_PER_WORD_REVIEW,
          );
      bumpBoardEpoch();
      setSelected(null);
      setItemHitCount(nextHitCount);
      setGameItems(nextItems);
      setHintMove(null);
      setWordLink(null);
      setQuizOpen(false);
      // Always unlock the new review board. keepPendingRound only preserves
      // adventure resume data — leaving roundSwitchPending true locks swaps + timer.
      roundSwitchPendingRef.current = false;
      if (!opts?.keepPendingRound) {
        pendingRoundRef.current = null;
      }
      setRoundCelebrate(false);
      funTimeoutLockRef.current = false;
      funCountdownRef.current = TIMED_TARGET_COUNTDOWN_SEC;
      setFunCountdown(TIMED_TARGET_COUNTDOWN_SEC);
      setFunTargetId(targetId || '');
      setFunTargetKey((k) => k + 1);
      setReviewTutorialActive(Boolean(reviewTutorialGrid && targetId));
      setFixedMatchTutorialStage(null);
      setGrid(
        reviewTutorialGrid ??
          prepareBoardGrid(nextItems.map((i) => i.id), targetId || undefined),
      );
      setBoardIntroActive(true);

      // Mode + reviewPoolKey (memory write) can each retrigger board setup —
      // skip both so the forced mix isn't replaced by “just-finished set” memory order.
      suppressBoardSetupSkipsRef.current = Math.max(
        suppressBoardSetupSkipsRef.current,
        useForcedPool ? 2 : 1,
      );
      setChallengeMode('review');
    },
    [
      reviewPool,
      allPool,
      modeUnlocks,
      clearReviveState,
      resetRescueLifecycle,
      bumpBoardEpoch,
    ],
  );

  const beginForcedReview = React.useCallback(() => {
    if (reviewPool.length < ADVENTURE_WORDS_PER_SET) {
      finishQuizAndAdvance();
      return;
    }
    // Keep pendingRoundRef so adventure can resume after the review exam + quiz.
    enterReviewMode(true, { keepPendingRound: true });
  }, [reviewPool.length, finishQuizAndAdvance, enterReviewMode]);

  const clearPendingForcedReview = React.useCallback(() => {
    if (!modeUnlocks.pendingForcedReview && !forcedReviewActiveRef.current) return;
    const nextUnlocks: ModeUnlockState = {
      ...modeUnlocks,
      pendingForcedReview: false,
    };
    saveModeUnlocks(nextUnlocks, progressUserIdRef.current);
    setModeUnlocks(nextUnlocks);
    setForcedReviewActive(false);
    forcedReviewActiveRef.current = false;
  }, [modeUnlocks]);

  const resumeForcedReview = React.useCallback(() => {
    enterReviewMode(true);
  }, [enterReviewMode]);

  const handleChallengeModeChange = React.useCallback(
    (mode: ChallengeMode) => {
      if (quotaChargePendingRef.current) return;
      if (mode === 'mood') {
        if (challengeModeRef.current !== 'mood') {
          const paidBoard = hasPaidModeBoard('mood', progressUserIdRef.current);
          if (!paidBoard && (!canPlayMoodToday({ hasPremiumAccess, userId: progressUserIdRef.current }) ||
            (!hasPremiumAccess && tickStamina(staminaStateRef.current).value <= 0))) return;
          moodPlayOwedRef.current = !paidBoard;
        }
        const todayPalette = moodPaletteForDay();
        if (todayPalette !== moodPaletteId) setMoodPaletteId(todayPalette);
        updateFirstTimeGuide((current) =>
          current.stage === 'moodBoard'
            ? { ...current, stage: 'completed' }
            : current,
        );
      }
      if (mode === 'category' && challengeModeRef.current !== 'category') {
        const resumableCategory = challengePools.find((category) =>
          hasPaidModeBoard('category', progressUserIdRef.current, category.id));
        if (!premiumAccessRef.current && tickStamina(staminaStateRef.current).value <= 0 &&
          !resumableCategory) {
          lockAdventureDead();
          return;
        }
        if (resumableCategory && !hasPaidModeBoard('category', progressUserIdRef.current, selectedCategoryId)) {
          setSelectedCategoryId(resumableCategory.id);
        }
        categoryPlayOwedRef.current = !resumableCategory;
      }
      const preserveAdventureBoard = () => {
        if (
          challengeModeRef.current !== 'random' ||
          reviveActiveRef.current ||
          !adventurePlayable ||
          gameItems.length < ADVENTURE_WORDS_PER_SET
        ) {
          return;
        }
        const previous = adventureBoardSnapshotRef.current;
        const snapshot: AdventureBoardSnapshot = {
          version: ADVENTURE_SNAPSHOT_VERSION,
          userId: normalizedSnapshotUserId(progressUserIdRef.current),
          roundId:
            previous?.roundId ??
            `adventure-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          savedAt: Date.now(),
          grid: grid.map((row) => row.map((tile) => ({ ...tile }))),
          gameItems: [...gameItems],
          itemHitCount: { ...itemHitCount },
          movesLeft: movesLeftRef.current,
          level,
          adventurePlayable,
          staminaOwed: adventureStaminaOwedRef.current,
          staminaPaid: adventureStaminaPaidRef.current,
          roundFree: adventureRoundFreeRef.current,
          rescueUsed: rescueUsedRef.current,
          attemptLost: adventureAttemptLostRef.current,
        };
        adventureBoardSnapshotRef.current = snapshot;
        saveAdventureBoardSnapshot(snapshot);
      };

      if (mode === 'review') {
        preserveAdventureBoard();
        enterReviewMode(Boolean(modeUnlocks.pendingForcedReview));
        return;
      }
      if (forcedReviewActiveRef.current) {
        // Left mid-exam — keep pendingForcedReview hung until a review quiz is finished.
        setForcedReviewActive(false);
        forcedReviewActiveRef.current = false;
      }
      if (mode !== 'random') {
        preserveAdventureBoard();
        adventureStaminaOwedRef.current = false;
        clearStaminaHudHold();
        // Mood/category boards rely on the board-setup effect to replace the
        // current word set. A leftover skip from a seeded review/adventure
        // handoff must never preserve the previous mode's words.
        suppressBoardSetupSkipsRef.current = 0;
        setChallengeMode(mode);
        return;
      }

      // Every route into Adventure must pass the same stamina gate. In
      // particular, restoring a saved board must not bypass the 0-stamina
      // state already shown on Home or the dead-machine sheet.
      const refreshedStamina = tickStamina(staminaStateRef.current);
      if (refreshedStamina !== staminaStateRef.current) {
        persistStamina(refreshedStamina);
      }
      const savedAdventure = adventureBoardSnapshotRef.current;
      const canResumePaidBoard = savedAdventure && isPaidPlayableAdventureBoard(savedAdventure) &&
        validAdventureBoardSnapshot(savedAdventure, progressUserIdRef.current, allPool,
          new Set(roundLearnedIdsRef.current));
      if (!premiumAccessRef.current && refreshedStamina.value <= 0 && !canResumePaidBoard) {
        staminaGateResumeRef.current = {
          hitCount: {},
          advanceLevel: false,
          modeOverride: 'random',
        };
        setChallengeMode('random');
        lockAdventureDead();
        return;
      }

      if (
        savedAdventure &&
        validAdventureBoardSnapshot(
          savedAdventure,
          progressUserIdRef.current,
          allPool,
          new Set(roundLearnedIdsRef.current),
        )
      ) {
        boardOwnerModeRef.current = 'random';
        bumpBoardEpoch();
        suppressBoardSetupSkipsRef.current = Math.max(
          suppressBoardSetupSkipsRef.current,
          1,
        );
        setChallengeMode('random');
        setDeadMachineOpen(false);
        const restoredFailure = savedAdventure.attemptLost ||
          (savedAdventure.movesLeft <= 0 && savedAdventure.rescueUsed);
        setFailSheetOpen(restoredFailure);
        setRestoredZeroMovePending(savedAdventure.movesLeft <= 0 && !restoredFailure);
        adventureFailedAwaitingRetryRef.current = restoredFailure;
        setReviewPaused(false);
        setAdventurePlayable(savedAdventure.adventurePlayable);
        adventureStaminaOwedRef.current = savedAdventure.staminaOwed;
        adventureStaminaPaidRef.current = hasAdventurePayment(savedAdventure);
        adventureRoundFreeRef.current = savedAdventure.roundFree;
        rescueUsedRef.current = savedAdventure.rescueUsed;
        adventureAttemptLostRef.current = restoredFailure;
        movesLeftRef.current = savedAdventure.movesLeft;
        setMovesLeft(savedAdventure.movesLeft);
        setLevel(savedAdventure.level);
        setGameItems([...savedAdventure.gameItems]);
        setItemHitCount({ ...savedAdventure.itemHitCount });
        setGrid(
          savedAdventure.grid.map((row) =>
            row.map((tile) => ({ ...tile })),
          ),
        );
        setSelected(null);
        setHintMove(null);
        setWordLink(null);
        setPopWord(null);
        setFunTargetId('');
        setBoardIntroActive(false);
        roundSwitchPendingRef.current = false;
        return;
      }
      if (savedAdventure) clearAdventureSnapshot();
      // Adventure: no stamina → dead machine, never open a free board.
      if (!premiumAccessRef.current && tickStamina(staminaStateRef.current).value <= 0) {
        staminaGateResumeRef.current = {
          hitCount: {},
          advanceLevel: false,
          modeOverride: 'random',
        };
        setChallengeMode('random');
        lockAdventureDead();
        return;
      }

      // No Adventure snapshot exists (common after finishing a review or
      // entering Review from a settlement). Do not rely on the board-setup
      // effect here: Review intentionally leaves setup-skip tokens behind and
      // one of those could preserve the Review words/grid after the mode label
      // has already changed to Adventure. Seed Adventure now, then consume the
      // single duplicate setup caused by setChallengeMode below.
      suppressBoardSetupSkipsRef.current = 1;
      setChallengeMode('random');
      setReviewPaused(false);
      setFunTargetId('');
      startNextRound({}, undefined, false, 'random');
    },
    [
      adventurePlayable,
      bumpBoardEpoch,
      clearStaminaHudHold,
      enterReviewMode,
      gameItems,
      grid,
      itemHitCount,
      level,
      allPool,
      challengePools,
      clearAdventureSnapshot,
      lockAdventureDead,
      startNextRound,
      modeUnlocks.pendingForcedReview,
      moodPaletteId,
      hasPremiumAccess,
      persistStamina,
      updateFirstTimeGuide,
    ],
  );

  const handleQuizComplete = React.useCallback((mistakenItemIds: string[] = []) => {
    if (challengeMode === 'mood' || challengeMode === 'category') {
      removeModeBoardSnapshot(challengeMode, progressUserIdRef.current,
        challengeMode === 'category' ? selectedCategoryId : null);
    }
    stopAllWordSpeech();
    triggerGameHaptic('majorSuccess');
    setQuizOpen(false);
    const quizItemsSnapshot = quizItemsRef.current;
    const previousSummary = playerSummaryRef.current;
    const nextLearned = markRoundLearnedItems(
      roundLearnedIds,
      quizItemsSnapshot,
      progressUserIdRef.current,
      courseId,
    );
    roundLearnedIdsRef.current = nextLearned;
    setRoundLearnedIds(nextLearned);

    const reviewSession = forcedReviewActiveRef.current || challengeMode === 'review';
    const quizMistakes = new Set(mistakenItemIds);
    const boardMistakes = new Set(reviewRoundBoardMistakeIdsRef.current);

    // Clean recall advances the curve. A word missed on the review board or in
    // the quiz stays on its shorter schedule even if the player later corrects it.
    setWordMemory((prev) => {
      const next = new Map(prev);
      for (const it of quizItemsSnapshot) {
        if (reviewSession && quizMistakes.has(it.id)) {
          if (!boardMistakes.has(it.id)) {
            recordWordRecallFailure(next, it.word, it.cn);
          }
        } else if (!(reviewSession && boardMistakes.has(it.id))) {
          recordWordRecallSuccess(next, it.word, it.cn);
        }
      }
      persistWordMemories(next, memoryScopeRef.current, { courseId });
      wordMemoryRef.current = next;
      return next;
    });
    reviewRoundBoardMistakeIdsRef.current = new Set();

    if (forcedReviewActiveRef.current || challengeMode === 'review') {
      const completedMandatoryReview =
        (forcedReviewActiveRef.current || modeUnlocks.pendingForcedReview) &&
        modeUnlocks.adventureClears >= 3;
      const summaryContext: SummaryContext = {
          adventureClears: modeUnlocks.adventureClears,
          masteredCount: masteredEmojiCount(wordMemoryRef.current, allPool),
          reviewUnlocked: isReviewUnlocked(modeUnlocks.adventureClears),
          categoryUnlocked: isCategoryUnlocked(modeUnlocks.adventureClears),
        };
      const nextSummary = recordReviewComplete(
        previousSummary,
        summaryContext,
        Date.now(),
        progressUserIdRef.current,
        progressUserIdRef.current || !authConfigured ? undefined : 6,
      );
      playerSummaryRef.current = nextSummary;
      setPlayerSummary(nextSummary);
      if (forcedReviewActiveRef.current) {
        clearPendingForcedReview();
      } else if (modeUnlocks.pendingForcedReview) {
        clearPendingForcedReview();
      }
      // Stay in review — let the player choose continue vs adventure.
      suppressBoardSetupSkipsRef.current = Math.max(suppressBoardSetupSkipsRef.current, 1);
      setChallengeMode('review');
      setForcedReviewActive(false);
      forcedReviewActiveRef.current = false;
      if (completedMandatoryReview) {
        updateFirstTimeGuide((current) =>
          current.hasCompletedLearnedTour
            ? current
            : { ...current, stage: 'learned' },
        );
      }
      setRoundResult({
        kind: 'review',
        items: quizItemsSnapshot,
        learnedTotal: nextLearned.length,
        adventureClears: modeUnlocks.adventureClears,
        dayStreak: liveDayStreak(nextSummary),
        collectionAdded: 0,
        streakIncreased: liveDayStreak(nextSummary) > liveDayStreak(previousSummary),
        unlocks: [],
        awardIds: newlyClaimableAwardIds(summaryContext, previousSummary, summaryContext, nextSummary),
        nextGoal: ui.resultGoals.reviewChoice,
        followUp: 'review-choices',
      });
      return;
    }

    if (challengeMode === 'random') {
      adventureSetHistoryRef.current = pushAdventureClearedSet(
        adventureSetHistoryRef.current,
        quizItemsSnapshot.map((it) => it.id),
        progressUserIdRef.current,
      );

      const prevUnlocks = modeUnlocks;
      const adventureClears = prevUnlocks.adventureClears + 1;
      let nextUnlocks: ModeUnlockState = { ...prevUnlocks, adventureClears };
      saveModeUnlocks(nextUnlocks, progressUserIdRef.current);
      setModeUnlocks(nextUnlocks);
      const previousContext: SummaryContext = {
        adventureClears: prevUnlocks.adventureClears,
        masteredCount: masteredEmojiCount(wordMemoryRef.current, allPool),
        reviewUnlocked: isReviewUnlocked(prevUnlocks.adventureClears),
        categoryUnlocked: isCategoryUnlocked(prevUnlocks.adventureClears),
      };
      const summaryContext: SummaryContext = {
        adventureClears,
        masteredCount: masteredEmojiCount(wordMemoryRef.current, allPool),
        reviewUnlocked: isReviewUnlocked(adventureClears),
        categoryUnlocked: isCategoryUnlocked(adventureClears),
      };
      const nextSummary = adventureAttemptLostRef.current
          ? recordLearningActivity(
              previousSummary,
              summaryContext,
              Date.now(),
              progressUserIdRef.current,
              progressUserIdRef.current || !authConfigured ? undefined : 6,
            )
          : recordAdventureClear(
              previousSummary,
              summaryContext,
              Date.now(),
              progressUserIdRef.current,
              progressUserIdRef.current || !authConfigured ? undefined : 6,
            );
      playerSummaryRef.current = nextSummary;
      setPlayerSummary(nextSummary);
      const resultUnlocks: RoundResult['unlocks'] = [];

      if (!prevUnlocks.reviewUnlockSeen && isReviewUnlocked(adventureClears)) {
        nextUnlocks = { ...nextUnlocks, reviewUnlockSeen: true };
        resultUnlocks.push('review');
      }
      if (!prevUnlocks.categoryUnlockSeen && isCategoryUnlocked(adventureClears)) {
        nextUnlocks = { ...nextUnlocks, categoryUnlockSeen: true };
        resultUnlocks.push('category');
      }
      saveModeUnlocks(nextUnlocks, progressUserIdRef.current);
      setModeUnlocks(nextUnlocks);
      const awardIds = newlyClaimableAwardIds(
        previousContext,
        previousSummary,
        summaryContext,
        nextSummary,
      );
      const forcedReviewNext =
        shouldForceReviewAfterClear(adventureClears) &&
        isReviewUnlocked(adventureClears) &&
        reviewPool.length >= ADVENTURE_WORDS_PER_SET;
      const nextGoal = adventureClears < 3
        ? ''
        : forcedReviewNext
          ? ui.resultGoals.strengthen
          : ui.resultGoals.discoverSix;
      setRoundResult({
        kind: 'learned',
        items: quizItemsSnapshot,
        learnedTotal: nextLearned.length,
        adventureClears,
        dayStreak: liveDayStreak(nextSummary),
        collectionAdded: Math.max(0, nextLearned.length - roundLearnedIds.length),
        streakIncreased: liveDayStreak(nextSummary) > liveDayStreak(previousSummary),
        unlocks: resultUnlocks,
        awardIds,
        perfectQuiz: mistakenItemIds.length === 0,
        nextGoal,
        primaryActionLabel: forcedReviewNext
          ? ui.resultGoals.forcedReview
          : undefined,
        followUp: forcedReviewNext ? 'forced-review' : 'advance',
      });
      return;
    }

    if (challengeMode === 'category' || challengeMode === 'mood') {
      const categoryCompletion =
        challengeMode === 'category' && activeCategory
          ? completeCategoryCycleBoard(
              categoryCycleProgressRef.current,
              selectedCategoryId,
              activeCategory.items.map((item) => item.id),
              quizItemsSnapshot.map((item) => item.id),
            )
          : null;
      if (categoryCompletion) {
        categoryCycleProgressRef.current = categoryCompletion.progress;
        setCategoryCycleProgress(categoryCompletion.progress);
        saveCategoryCycleProgress(
          categoryCompletion.progress,
          progressUserIdRef.current,
          courseId,
        );
      }
      const summaryContext: SummaryContext = {
          adventureClears: modeUnlocks.adventureClears,
          masteredCount: masteredEmojiCount(wordMemoryRef.current, allPool),
          reviewUnlocked: isReviewUnlocked(modeUnlocks.adventureClears),
          categoryUnlocked: isCategoryUnlocked(modeUnlocks.adventureClears),
        };
      const nextSummary = recordLearningActivity(
        previousSummary,
        summaryContext,
        Date.now(),
        progressUserIdRef.current,
        progressUserIdRef.current || !authConfigured ? undefined : 6,
      );
      playerSummaryRef.current = nextSummary;
      setPlayerSummary(nextSummary);
      const moodExhausted =
        challengeMode === 'mood' && !canPlayMoodToday({ hasPremiumAccess, userId: progressUserIdRef.current });
      setRoundResult({
        kind: 'learned',
        items: quizItemsSnapshot,
        learnedTotal: nextLearned.length,
        adventureClears: modeUnlocks.adventureClears,
        dayStreak: liveDayStreak(nextSummary),
        collectionAdded: Math.max(0, nextLearned.length - roundLearnedIds.length),
        streakIncreased: liveDayStreak(nextSummary) > liveDayStreak(previousSummary),
        unlocks: [],
        awardIds: newlyClaimableAwardIds(summaryContext, previousSummary, summaryContext, nextSummary),
        perfectQuiz: mistakenItemIds.length === 0,
        categoryProgress: categoryCompletion
          ? {
              title: activeCategory?.label ?? t.modes.category,
              previousCycle: categoryCompletion.completion.previousCycle,
              cycle: categoryCompletion.completion.cycle,
              completedCycle: categoryCompletion.completion.completedCycle,
              clearedInCycle: categoryCompletion.completion.clearedInCycle,
              total: categoryCompletion.completion.total,
            }
          : undefined,
        nextGoal: moodExhausted
          ? ui.mode.moodDailyLimitReached
          : ui.resultGoals.anotherTheme,
        primaryActionLabel: undefined,
        followUp: moodExhausted ? 'mood-limit' : 'advance',
      });
      return;
    }

    finishQuizAndAdvance();
  }, [
    roundLearnedIds,
    challengeMode,
    modeUnlocks,
    finishQuizAndAdvance,
    clearPendingForcedReview,
    reviewPool.length,
    allPool,
    updateFirstTimeGuide,
    ui,
    authConfigured,
    activeCategory,
    selectedCategoryId,
    hasPremiumAccess,
    courseId,
    t.modes.category,
  ]);

  // Review boards resolve directly into their result. Adventure/category/mood
  // still call the same completion routine from their required quiz.
  finishReviewWithoutQuizRef.current = () => {
    recordRoundAnalytics('set_completed');
    handleQuizComplete([]);
  };

  const roundResultExitContinuationRef = React.useRef<(() => void) | null>(null);

  const completeRoundResult = React.useCallback((destination: 'words' | 'profile' | null = null) => {
    const result = roundResult;
    if (!result) return;
    if (destination === 'words') setCollectionFocusItemIds(result.items.map((item) => item.id));
    roundResultExitContinuationRef.current = () => {
      if (result.followUp === 'forced-review') beginForcedReview();
      else if (result.followUp === 'home') onHome();
      else if (
        result.followUp !== 'review-choices' &&
        result.followUp !== 'mood-limit'
      ) finishQuizAndAdvance();
      if (destination) setActiveTab(destination);
    };
    setRoundResult(null);
  }, [
    beginForcedReview,
    finishQuizAndAdvance,
    onHome,
    roundResult,
  ]);

  const handleRoundResultExitComplete = React.useCallback(() => {
    const continueAfterExit = roundResultExitContinuationRef.current;
    roundResultExitContinuationRef.current = null;
    continueAfterExit?.();
  }, []);

  const handleMoodResultUnlockPlus = React.useCallback(() => {
    roundResultExitContinuationRef.current = () => openPaywall('profile');
    setRoundResult(null);
  }, [openPaywall]);

  const handleRoundResultReturnHome = React.useCallback(() => {
    roundResultExitContinuationRef.current = onHome;
    setRoundResult(null);
  }, [onHome]);

  const returnToCategoryHub = React.useCallback(() => {
    if (!roundResult?.categoryProgress) return;
    roundResultExitContinuationRef.current = () => {
      setCategoryHubRequestKey((key) => key + 1);
    };
    setRoundResult(null);
  }, [roundResult]);

  const handleClaimRoundAward = React.useCallback((awardId: AwardTrackId) => {
    const summary = playerSummaryRef.current;
    const context: SummaryContext = {
      adventureClears: modeUnlocks.adventureClears,
      masteredCount: masteredEmojiCount(wordMemoryRef.current, allPool),
      reviewUnlocked: isReviewUnlocked(modeUnlocks.adventureClears),
      categoryUnlocked: isCategoryUnlocked(modeUnlocks.adventureClears),
    };
    const definition = AWARD_TRACKS.find((track) => track.id === awardId);
    if (!definition) return;
    const progress = awardTrackProgress(definition, context, summary);
    if (!progress.claimable) return;
    const next = claimAwardTrack(
      summary,
      awardId,
      progress.tier,
      Date.now(),
      progressUserIdRef.current,
    );
    playerSummaryRef.current = next;
    setPlayerSummary(next);
  }, [allPool, modeUnlocks.adventureClears]);

  const handleReviewContinueReview = React.useCallback(() => {
    const returningFromMood = roundResult?.followUp === 'mood-limit';
    setRoundResult(null);
    // Mood is already complete, so it must not remain as a pending board.
    // A normal review result can preserve its adventure resume point.
    enterReviewMode(false, {
      keepPendingRound: !returningFromMood,
      excludeIds: new Set(gameItems.map((it) => it.id)),
    });
  }, [enterReviewMode, gameItems, roundResult?.followUp]);

  const handleReviewContinueAdventure = React.useCallback(() => {
    setRoundResult(null);
    const savedAdventure = adventureBoardSnapshotRef.current;
    if (
      savedAdventure &&
      validAdventureBoardSnapshot(
        savedAdventure,
        progressUserIdRef.current,
        allPool,
        new Set(roundLearnedIdsRef.current),
      )
    ) {
      pendingRoundRef.current = null;
      handleChallengeModeChange('random');
      return;
    }
    if (savedAdventure) clearAdventureSnapshot();
    if (!premiumAccessRef.current && tickStamina(staminaStateRef.current).value <= 0) {
      staminaGateResumeRef.current = {
        hitCount: {},
        advanceLevel: false,
        modeOverride: 'random',
      };
      setChallengeMode('random');
      lockAdventureDead();
      return;
    }
    pendingRoundRef.current = null;
    suppressBoardSetupSkipsRef.current = Math.max(suppressBoardSetupSkipsRef.current, 1);
    setChallengeMode('random');
    // No adventure pending — start a fresh free-to-attempt board (still spends stamina).
    startNextRound({}, undefined, false, 'random');
  }, [
    allPool,
    clearAdventureSnapshot,
    handleChallengeModeChange,
    startNextRound,
    lockAdventureDead,
  ]);

  const handleReviewContinueRest = React.useCallback(() => {
    setRoundResult(null);
    setFunTargetId('');
    roundSwitchPendingRef.current = false;
    // Stay on review board, paused — come back later via 继续挑战.
    setReviewPaused(true);
  }, []);


  const reset = () => {
    // Free same-set board reshuffle — does not spend stamina or change the word set.
    if (gameItems.length < ADVENTURE_WORDS_PER_SET || reviveActiveRef.current) return;
    bumpBoardEpoch();
    clearReviveState();
    setFailSheetOpen(false);
    setDeadMachineOpen(false);
    setSelected(null);
    setHintMove(null);
    setWordLink(null);
    setQuizOpen(false);
    pendingRoundRef.current = null;
    roundSwitchPendingRef.current = false;
    setRoundCelebrate(false);
    const reviewTutorialGrid = reviewTutorialActiveRef.current
      ? makeFixedMatchTutorialGrid(gameItems.map((item) => item.id))
      : null;
    const targetId =
      reviewTutorialGrid
        ? gameItems[4]?.id
        : challengeMode === 'review'
        ? pickTimedTargetId(
            gameItems,
            itemHitCount,
            undefined,
            false,
            undefined,
            2,
            HITS_PER_WORD_REVIEW,
          )
          : reviveActive
            ? funTargetId || undefined
            : undefined;
    if (challengeMode === 'review' && targetId) {
      funTimeoutLockRef.current = false;
      funCountdownRef.current = TIMED_TARGET_COUNTDOWN_SEC;
      setFunCountdown(TIMED_TARGET_COUNTDOWN_SEC);
      setFunTargetId(targetId);
      setFunTargetKey((k) => k + 1);
    }
    setGrid(
      reviewTutorialGrid ??
        prepareBoardGrid(gameItems.map((i) => i.id), targetId),
    );
    setBoardIntroActive(true);
  };

  useEffect(() => {
    // Read the latest pool without subscribing board creation to pool identity.
    // Cloud hydration replaces these arrays after mount; treating that as a
    // board destination change used to reshuffle an active board and re-arm
    // its stamina charge.
    const setupPool = poolRef.current;
    const setupAllPool = allPoolRef.current;
    if (suppressBoardSetupSkipsRef.current > 0) {
      suppressBoardSetupSkipsRef.current -= 1;
      return;
    }
    // Finishing a quiz updates the learned-word pool while the result sheet is open.
    // Keep the completed board in place; the result-sheet action owns the one and only
    // transition to the next board.
    if (quizCheckpointRef.current || roundResultRef.current !== null) {
      return;
    }
    if (consentOpen) {
      return;
    }
    if (challengeMode === 'mood' || challengeMode === 'category') {
      const snapshot = loadModeBoardSnapshot(
        challengeMode,
        progressUserIdRef.current,
        challengeMode === 'category' ? selectedCategoryId : null,
      );
      if (snapshot && !snapshot.playOwed &&
        validModeBoardSnapshot(snapshot, challengeMode === 'mood' ? setupAllPool : setupPool)) {
        bumpBoardEpoch();
        boardOwnerModeRef.current = challengeMode;
        boardOwnerCategoryIdRef.current = selectedCategoryId;
        clearReviveState();
        resetRescueLifecycle();
        if (challengeMode === 'mood') {
          moodPlayOwedRef.current = false;
          if (snapshot.paletteId && snapshot.paletteId !== moodPaletteIdRef.current) {
            suppressBoardSetupSkipsRef.current = 1;
            setMoodPaletteId(snapshot.paletteId);
          }
        } else {
          categoryPlayOwedRef.current = false;
        }
        setFailSheetOpen(false);
        setDeadMachineOpen(false);
        setGameItems([...snapshot.gameItems]);
        setItemHitCount({ ...snapshot.itemHitCount });
        setGrid(snapshot.grid.map((row) => row.map((tile) => ({ ...tile }))));
        setSelected(null);
        setHintMove(null);
        setQuizOpen(false);
        setBoardIntroActive(false);
        setAdventurePlayable(true);
        return;
      }
      if (snapshot && !validModeBoardSnapshot(snapshot, challengeMode === 'mood' ? setupAllPool : setupPool)) {
        removeModeBoardSnapshot(challengeMode, progressUserIdRef.current,
          challengeMode === 'category' ? selectedCategoryId : null);
      }
    }
    bumpBoardEpoch();
    boardOwnerModeRef.current = challengeMode;
    boardOwnerCategoryIdRef.current = selectedCategoryId;
    clearReviveState();
    resetRescueLifecycle();
    setFailSheetOpen(false);
    setDeadMachineOpen(false);
    adventureRoundFreeRef.current = false;
    if (setupPool.length < 6) {
      setSelected(null);
      setLevel(1);
      setItemHitCount({});
      setGameItems([]);
      setGrid(makeGrid([]));
      setHintMove(null);
      setQuizOpen(false);
      pendingRoundRef.current = null;
      roundSwitchPendingRef.current = false;
      setRoundCelebrate(false);
      setAdventurePlayable(challengeMode !== 'random');
      setFunTargetId('');
      setReviewTutorialActive(false);
      return;
    }
    if (challengeMode === 'random') {
      adventureStaminaPaidRef.current = false;
      if (!premiumAccessRef.current && tickStamina(staminaStateRef.current).value <= 0) {
        lockAdventureDead();
        return;
      } else {
        adventureStaminaOwedRef.current = true;
        holdStaminaHudForBoard();
      }
    } else {
      adventureStaminaOwedRef.current = false;
      clearStaminaHudHold();
      if (challengeMode === 'category') categoryPlayOwedRef.current = true;
      if (challengeMode === 'mood') moodPlayOwedRef.current = true;
    }
    const nextHitCount: Record<string, number> = {};
    const useForcedPool =
      challengeMode === 'review' &&
      (forcedReviewActiveRef.current ||
        loadModeUnlocks(progressUserIdRef.current).pendingForcedReview);
    const poolById = new Map(setupAllPool.map((it) => [it.id, it] as const));
    const nextItems = useForcedPool
      ? pickVisuallyDistinctForcedReviewItems(
          adventureSetHistoryRef.current,
          poolById,
          ADVENTURE_WORDS_PER_SET,
          setupPool,
        )
      : challengeMode === 'random'
        ? pickAdventureItems(
            setupPool,
            ADVENTURE_WORDS_PER_SET,
            new Set(roundLearnedIdsRef.current),
          )
        : challengeMode === 'category'
          ? pickCategoryCycleItems(
              setupPool,
              ADVENTURE_WORDS_PER_SET,
              categoryCycleEntry(
                categoryCycleProgressRef.current,
                selectedCategoryId,
                setupPool.map((item) => item.id),
              ),
            )
        : pickChallengeItems(setupPool, ADVENTURE_WORDS_PER_SET, nextHitCount, wordMemoryRef.current, {
            strategy: challengeMode === 'review' ? 'memory' : 'random',
          });
    setSelected(null);
    const clears =
      challengeMode === 'random'
        ? loadModeUnlocks(progressUserIdRef.current).adventureClears
        : 0;
    const cap = Math.max(1, adventureTotalSets(setupAllPool.length));
    setLevel(challengeMode === 'random' ? Math.min(clears + 1, cap) : 1);
    setItemHitCount(nextHitCount);
    setGameItems(nextItems);
    setAdventurePlayable(true);
    if (challengeMode === 'random') {
      const budget = movesForAdventureLevel(1);
      movesLeftRef.current = budget;
      setMovesLeft(budget);
    }
    const nextItemIds = nextItems.map((item) => item.id);
    const reviewTutorialGrid =
      challengeMode === 'review' &&
      !firstTimeGuideRef.current.hasCompletedReviewTutorial
        ? makeFixedMatchTutorialGrid(nextItemIds)
        : null;
    const targetId =
      reviewTutorialGrid
        ? nextItems[4]?.id
        : challengeMode === 'review'
        ? pickTimedTargetId(
            nextItems,
            nextHitCount,
            undefined,
            false,
            undefined,
            2,
            HITS_PER_WORD_REVIEW,
          )
          : undefined;
    if (challengeMode === 'review') {
      funTimeoutLockRef.current = false;
      funCountdownRef.current = TIMED_TARGET_COUNTDOWN_SEC;
      setFunCountdown(TIMED_TARGET_COUNTDOWN_SEC);
      setFunTargetId(targetId || '');
      setFunTargetKey((k) => k + 1);
    } else if (challengeMode !== 'random') {
      setFunTargetId('');
    }
    const shouldStartFixedMatchTutorial =
      challengeMode === 'random' &&
      clears === 0 &&
      !firstTimeGuideRef.current.hasCompletedFirstSwapTutorial &&
      !firstTimeGuideRef.current.hasCompletedFreeMoveRuleTutorial;
    const fixedTutorialGrid = shouldStartFixedMatchTutorial
      ? makeFixedMatchTutorialGrid(nextItemIds)
      : null;
    setFixedMatchTutorialStage(fixedTutorialGrid ? 'three' : null);
    setReviewTutorialActive(Boolean(reviewTutorialGrid && targetId));
    setGrid(
      reviewTutorialGrid ??
        fixedTutorialGrid ??
        prepareBoardGrid(nextItemIds, targetId),
    );
    setHintMove(null);
    setBoardIntroActive(true);
  }, [
    boardSetupKey,
    challengeMode,
    consentOpen,
    bumpBoardEpoch,
    clearReviveState,
    clearStaminaHudHold,
    holdStaminaHudForBoard,
    resetRescueLifecycle,
    lockAdventureDead,
    selectedCategoryId,
  ]);

  useEffect(() => {
    setTtsAvailable('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined');
    if ('speechSynthesis' in window) {
      // Warm up voices for Safari/Chrome first-use edge cases.
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    const syncMoodPaletteWhenIdle = () => {
      if (document.visibilityState !== 'visible') return;
      // Never recolor an active Mood Board at midnight or on foregrounding.
      // Entry into Mood Board and its next-round action both sync the date.
      if (challengeModeRef.current === 'mood') return;
      const todayPalette = moodPaletteForDay();
      setMoodPaletteId((current) =>
        current === todayPalette ? current : todayPalette,
      );
    };
    document.addEventListener('visibilitychange', syncMoodPaletteWhenIdle);
    window.addEventListener('focus', syncMoodPaletteWhenIdle);
    return () => {
      document.removeEventListener('visibilitychange', syncMoodPaletteWhenIdle);
      window.removeEventListener('focus', syncMoodPaletteWhenIdle);
    };
  }, []);

  useEffect(() => {
    if (challengeMode !== 'review' && !reviveActive) {
      setReviewPaused(false);
      setReviewTutorialActive(false);
    }
  }, [challengeMode, reviveActive]);

  // Timed-hunt countdown pauses whenever gameplay is covered or temporarily locked.
  const timedHuntActive =
    reviveActive || challengeMode === 'review';
  const timedTargetPlayable = useMemo(
    () =>
      !timedHuntActive ||
      !funTargetId ||
      hasSwapMatchForItem(grid, funTargetId),
    [funTargetId, grid, timedHuntActive],
  );
  const funTimerPaused =
    !timedHuntActive ||
    activeTab !== 'game' ||
    gameLifecyclePaused ||
    !funTargetId ||
    !timedTargetPlayable ||
    pool.length < 6 ||
    quizOpen ||
    roundCelebrate ||
    roundResult !== null ||
    matchClearCells !== null ||
    refillActive ||
    cascadeBusy ||
    boardIntroActive ||
    failSheetOpen ||
    reviveFlash !== null ||
    accountOverlayOpen ||
    sayBlastOpen ||
    reviewTutorialActive ||
    modePickerOpen ||
    (challengeMode === 'review' && reviewPaused);

  useEffect(() => {
    funCountdownRef.current = TIMED_TARGET_COUNTDOWN_SEC;
    setFunCountdown(TIMED_TARGET_COUNTDOWN_SEC);
  }, [funTargetKey, timedHuntActive]);

  const lastTimedTargetSpeechRef = useRef('');

  // Timed hunt: speak the prompt when a new target appears (not again on successful match).
  useEffect(() => {
    if (!timedHuntActive || !funTargetId) {
      lastTimedTargetSpeechRef.current = '';
      return;
    }
    // The first provisional target can be replaced while the board is being
    // built or repaired. Never enqueue speech until the visible board and its
    // verified answer are final.
    if (boardIntroActive || cascadeBusy || refillActive || matchClearCells !== null) return;
    if (!timedTargetPlayable) return;
    if (challengeMode === 'review' && reviewPaused) return;
    if (accountOverlayOpen) return;
    if (sayBlastOpen) return;
    if (modePickerOpen) return;
    if (reviveFlash !== null) return;
    const item = itemById.get(funTargetId);
    if (!item?.word) return;
    const speechKey = `${boardEpochRef.current}:${challengeMode}:${funTargetKey}:${funTargetId}`;
    if (lastTimedTargetSpeechRef.current === speechKey) return;
    lastTimedTargetSpeechRef.current = speechKey;
    void speakLatestWordPrompt(item.word);
    // Closing the revive intro is also an intentional trigger: pronounce only
    // after the player confirms they are ready.
  }, [
    accountOverlayOpen,
    boardIntroActive,
    cascadeBusy,
    challengeMode,
    funTargetId,
    funTargetKey,
    itemById,
    matchClearCells,
    modePickerOpen,
    refillActive,
    reviewPaused,
    reviveFlash,
    sayBlastOpen,
    timedHuntActive,
    timedTargetPlayable,
  ]);

  useEffect(() => {
    if (funTimerPaused) return;

    const id = window.setInterval(() => {
      if (funCountdownRef.current <= 0) {
        // Safety net: never stay parked on 0 if timeout handler missed a beat.
        handleFunTimeout();
        return;
      }
      const next = funCountdownRef.current - 1;
      funCountdownRef.current = next;
      setFunCountdown(next);
      if (next <= 0) {
        handleFunTimeout();
      }
    }, 1000);

    return () => window.clearInterval(id);
  }, [funTimerPaused, funTargetKey, handleFunTimeout]);

  const restartHintTimer = React.useCallback(
    (nextGrid?: Tile[][]) => {
      if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
      setHintMove(null);
      if (firstSwapTutorialPendingRef.current) return;
      if (reviveActiveRef.current || challengeModeRef.current === 'review') return;

      hintTimerRef.current = window.setTimeout(() => {
        setHintMove(findHintMove(nextGrid ?? grid));
      }, 8000);
    },
    [grid],
  );

  useEffect(() => {
    return () => {
      if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current);
    };
  }, []);

  useEffect(() => {
    restartHintTimer(grid);
    return () => {
      if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current);
    };
  }, [grid, restartHintTimer, firstTimeGuide.hasCompletedFirstSwapTutorial]);

  const applyResolvedMatch = (
    resolved: { grid: Tile[][]; clearedItemIds: string[] },
    targetItemId: string,
  ) => {
    const reviewHunt =
      challengeMode === 'review' && !reviveActiveRef.current;
    const hitsNeeded = hitsNeededForMode(challengeMode);
    const countThisHit =
      !!targetItemId &&
      !reviveActiveRef.current &&
      (!reviewHunt || targetItemId === funTargetId);

    const projectedHits = { ...itemHitCount };
    if (countThisHit && targetItemId) {
      const prevCount = projectedHits[targetItemId] ?? 0;
      if (prevCount < hitsNeeded) projectedHits[targetItemId] = prevCount + 1;
    }
    const roundWillComplete =
      !reviveActiveRef.current &&
      gameItems.length > 0 &&
      gameItems.every((it) => (projectedHits[it.id] ?? 0) >= hitsNeeded);

    let nextGrid = resolved.grid;
    if (!roundWillComplete) {
      const unfinishedIds = gameItems
        .filter((it) => (projectedHits[it.id] ?? 0) < hitsNeeded)
        .map((it) => it.id);
      const shouldAssistAdventure =
        challengeMode === 'random' &&
        !reviveActiveRef.current &&
        movesLeftRef.current <= lateBoardAssistMoves;
      if (shouldAssistAdventure) {
        const copy = nextGrid.map((row) => row.map((t) => ({ ...t })));
        if (boostScarceUnfinishedWords(copy, unfinishedIds, itemIds, 4)) {
          nextGrid = copy;
        }
      }
      nextGrid = reshuffleDeadlockedBoard(nextGrid);
    }

    // Select the next review prompt from the fully settled board before it is
    // rendered. If no unfinished word is currently playable, prepare one here
    // while the cascade is still locked. The countdown therefore never starts
    // on a board that will need to refresh underneath the player.
    let preparedReviewTargetId = '';
    if (reviewHunt && funTargetId && !roundWillComplete) {
      const playableTargetId = pickPlayableTimedTargetId(
        gameItems,
        projectedHits,
        nextGrid,
        funTargetId,
        false,
        undefined,
        2,
        hitsNeeded,
      );
      const fallbackTargetId = playableTargetId || pickTimedTargetId(
        gameItems,
        projectedHits,
        funTargetId,
        false,
        undefined,
        2,
        hitsNeeded,
      );
      if (fallbackTargetId) {
        preparedReviewTargetId = fallbackTargetId;
        if (!playableTargetId) {
          nextGrid = prepareTimedTargetGrid(nextGrid, fallbackTargetId, itemIds);
        }
      }
    }

    // Commit the prompt together with the settled grid, rather than scheduling
    // it from inside the hit-count updater. This prevents an intermediate
    // render where the new board is checked against the already-cleared target.
    if (reviewHunt && funTargetId) {
      if (roundWillComplete) {
        setFunTargetId('');
      } else if (preparedReviewTargetId) {
        setFunTargetId(preparedReviewTargetId);
        setFunTargetKey((key) => key + 1);
      } else {
        setFunTargetId('');
      }
    }

    setGrid(nextGrid);
    setMatchClearCells(null);
    restartHintTimer(nextGrid);
    setItemHitCount((prev) => {
      const next = { ...prev };

      // Shelf progress: only the player-initiated clear that triggered the word
      // popup + speech counts (+1). Cascade / passive clears do not.
      // Review timed hunt: only the current target word counts.
      if (countThisHit && targetItemId) {
        const prevCount = next[targetItemId] ?? 0;
        if (prevCount < hitsNeeded) {
          next[targetItemId] = prevCount + 1;
        }
      }

      if (reviveActiveRef.current && funTargetId && targetItemId === funTargetId) {
        const wordHits = {
          ...reviveWordHitsRef.current,
          [funTargetId]: (reviveWordHitsRef.current[funTargetId] ?? 0) + 1,
        };
        reviveWordHitsRef.current = wordHits;
        const corrects = Object.values(wordHits).reduce((sum, n) => sum + n, 0);
        reviveCorrectsRef.current = corrects;
        setReviveCorrects(corrects);
        const needed = reviveCorrectNeeded(gameItems.length || ADVENTURE_WORDS_PER_SET);
        if (corrects >= needed) {
          succeedRevive();
          return next;
        }
        const playableTargetId = pickPlayableTimedTargetId(
          gameItems,
          next,
          nextGrid,
          funTargetId,
          true,
          wordHits,
          REVIVE_HITS_PER_WORD,
        );
        const newTargetId = playableTargetId || pickTimedTargetId(
          gameItems,
          next,
          funTargetId,
          true,
          wordHits,
          REVIVE_HITS_PER_WORD,
        );
        if (newTargetId) {
          setFunTargetId(newTargetId);
          setFunTargetKey((k) => k + 1);
          if (!playableTargetId) {
            setGrid((prevGrid) => prepareTimedTargetGrid(prevGrid, newTargetId, itemIds));
          }
        } else {
          setFunTargetId('');
        }
        return next;
      }

      if (reviveActiveRef.current) {
        return next;
      }

      if (reviewHunt && funTargetId) {
        const currentRoundDone = shelfRoundComplete(gameItems, next, hitsNeeded);
        if (currentRoundDone) {
          // Stop timed hunt immediately so timeout / heal can't re-arm a loop.
          if (roundSwitchPendingRef.current) return next;
          roundSwitchPendingRef.current = true;
          const prevIds = new Set(gameItems.map((it) => it.id));
          const snapshot = [...gameItems];
          popDoneRef.current.finally(() => {
            pendingRoundRef.current = { hitCount: next, excludeIds: prevIds };
            quizItemsRef.current = snapshot;
            setQuizItems(snapshot);
            finishReviewWithoutQuizRef.current();
          });
          return next;
        }

        // The next prompt was committed with nextGrid above. No second setGrid
        // call is allowed after the countdown prompt becomes visible.
        return next;
      }

      const currentRoundDone = shelfRoundComplete(gameItems, next, hitsNeeded);
      if (currentRoundDone) {
        if (challengeMode === 'review') setFunTargetId('');
        if (roundSwitchPendingRef.current) return next;
        roundSwitchPendingRef.current = true;
        const prevIds = new Set(gameItems.map((it) => it.id));
        const snapshot = [...gameItems];
        popDoneRef.current.finally(() => {
          pendingRoundRef.current = { hitCount: next, excludeIds: prevIds };
          setQuizItems(snapshot);
          openRoundCelebrate(snapshot);
        });
        return next;
      }

      if (
        challengeMode === 'random' &&
        movesLeftRef.current <= 0 &&
        !reviveActiveRef.current
      ) {
        if (rescueUsedRef.current) {
          endAdventureFailed();
        } else {
          enterRevive(nextGrid, next);
        }
      }
      return next;
    });
  };

  const showWord = (payload: {
    word: string;
    sourceWord?: string;
    cn?: string;
    emoji?: string;
    imgSrc?: string;
    originCell?: Cell;
  }) => {
    const seq = popWordSeqRef.current;
    const isFirstDiscovery = !wordMemoryRef.current.has(
      memoryKeyForWord(payload.word),
    );
    setWordMemory((prev) => {
      const next = new Map<string, WordMemory>(prev);
      recordWordExposure(next, payload.word, payload.cn);
      persistWordMemories(next, memoryScopeRef.current, { courseId });
      return next;
    });
    // Keep each card paired with its own pronunciation. A later match waits to
    // appear until the previous card has finished speaking and cleared, while
    // the board animation remains completely independent.
    const previousPopup = popDoneRef.current.catch(() => undefined);
    popDoneRef.current = previousPopup.then(async () => {
      if (seq !== popWordSeqRef.current) return;
      setPopWord({ ...payload, isFirstDiscovery });

      const WORD_POP_AFTER_SPEECH_MS = 200;
      const WORD_POP_SPEECH_TIMEOUT_MS = 5000;
      let audioOk = false;
      let timedOut = false;
      try {
        const speechResult = await Promise.race([
          queueWordSpeechToCompletion(payload.word).then((ok) => ({ ok, timedOut: false })),
          delay(WORD_POP_SPEECH_TIMEOUT_MS).then(() => ({ ok: false, timedOut: true })),
        ]);
        audioOk = speechResult.ok;
        timedOut = speechResult.timedOut;
        if (timedOut) stopAllWordSpeech();
      } catch {
        audioOk = false;
      }

      if (!timedOut) {
        await delay(WORD_POP_AFTER_SPEECH_MS);
      }
      if (seq !== popWordSeqRef.current) return;
      setPopWord(null);
      setTtsAvailable(audioOk);
    });
  };

  /** Next clear wave on a stable board (line clears first, then 3+ matches). */
  const collectClearWave = (g: Tile[][]): {
    cells: Cell[];
    itemIds: string[];
    isLine: boolean;
  } | null => {
    const lineClearRuns = findLineClearRuns(g);
    if (lineClearRuns.length > 0) {
      return {
        cells: clearCellsForLongRuns(lineClearRuns),
        itemIds: lineClearRuns.map((run) => run.itemId),
        isLine: true,
      };
    }
    const matches = findMatches(g);
    if (matches.length === 0) return null;
    const cells = new Map<string, Cell>();
    const itemIds: string[] = [];
    for (const m of matches) {
      itemIds.push(m.itemId);
      for (const cell of m.cells) cells.set(`${cell.r}:${cell.c}`, cell);
    }
    return { cells: [...cells.values()], itemIds, isLine: false };
  };

  const attemptSwap = async (movedA: Cell, movedB: Cell) => {
    if (
      quotaChargePendingRef.current ||
      pool.length < 6 ||
      quizOpen ||
      roundCelebrate ||
      roundSwitchPendingRef.current ||
      popWord !== null ||
      matchClearCells !== null ||
      refillActive ||
      cascadeBusy ||
      cascadeRunningRef.current ||
      failSheetOpen ||
      (challengeMode === 'random' && (!adventurePlayable || (adventureAttemptLostRef.current && !reviveActiveRef.current))) ||
      (challengeMode === 'review' && reviewPaused)
    ) {
      return;
    }
    const tutorialPair = firstSwapTutorialMoveRef.current;
    const fixedTutorialStageAtSwap = fixedMatchTutorialStageRef.current;
    const isFirstSwapTutorialSwap =
      firstSwapTutorialPendingRef.current &&
      tutorialPair !== null &&
      sameCellPair(movedA, movedB, tutorialPair);
    const isFixedMatchTutorialSwap =
      fixedTutorialStageAtSwap !== null && isFirstSwapTutorialSwap;
    const isReviewTutorialSwap =
      reviewTutorialActiveRef.current && isFirstSwapTutorialSwap;
    if (
      firstSwapTutorialPendingRef.current &&
      (firstSwapTutorialResolvingRef.current || !isFirstSwapTutorialSwap)
    ) {
      return;
    }
    if (
      challengeMode === 'random' &&
      !reviveActiveRef.current &&
      movesLeftRef.current <= 0
    ) {
      return;
    }
    restartHintTimer(grid);
    setHintMove(null);

    const swapped = swap(grid, movedA, movedB);
    const matches = findMatches(swapped);
    if (matches.length === 0) {
      setSelected(null);
      return;
    }

    const cellEq = (cell: { r: number; c: number }, p: { r: number; c: number }) =>
      cell.r === p.r && cell.c === p.c;
    const firstClickedItemId = grid[movedA.r][movedA.c]?.itemId;
    const directMatch =
      (firstClickedItemId
        ? matches.find((m) => m.itemId === firstClickedItemId)
        : undefined) ??
      matches.find(
        (m) =>
          m.cells.some((cell) => cellEq(cell, movedA)) &&
          m.cells.some((cell) => cellEq(cell, movedB)),
      ) ??
      matches.find((m) =>
        m.cells.some((cell) => cellEq(cell, movedA) || cellEq(cell, movedB)),
      ) ??
      matches[0];
    const targetItemId = directMatch.itemId;
    const directItem = itemById.get(targetItemId);
    const lineClearRuns = runsTouchingCells(findLineClearRuns(swapped), directMatch.cells);

    const boardEpoch = boardEpochRef.current;
    const modeAtSwap = challengeModeRef.current;
    quotaChargePendingRef.current = true;
    let charged = false;
    try {
      charged = await chargeAdventureStaminaIfNeeded();
    } finally {
      quotaChargePendingRef.current = false;
    }
    if (!charged || boardEpoch !== boardEpochRef.current || modeAtSwap !== challengeModeRef.current) {
      setSelected(null);
      return;
    }

    void markLearningActivity({ locale, hasPremiumAccess, ...getReminderGameState() }).catch((error) => {
      console.warn('[match3] unable to mark learning reminder activity', error);
    });
    recordRoundAnalytics('game_started');

    if (isFirstSwapTutorialSwap) {
      firstSwapTutorialResolvingRef.current = true;
      setFirstSwapTutorialResolving(true);
      setFirstSwapTutorialMove(null);
    }

    freeMoveTutorialOutcomeRef.current = null;
    let strongSpecialClear = false;
    if (challengeMode === 'random' && !reviveActiveRef.current) {
      // 3-match: −1. Straight 4: no spend. Straight 5+ / cross / T / L: +1.
      // Only inspect runs created at the two swapped cells, so disconnected
      // same-emoji matches cannot accidentally earn the stronger reward.
      const swappedCells = [movedA, movedB];
      const playerLongRuns = runsTouchingCells(findLongLineRuns(swapped), swappedCells);
      const playerCrossRuns = runsTouchingCells(findCrossLineRuns(swapped), swappedCells);
      const hasFivePlus = playerLongRuns.some((run) => run.cells.length >= 5);
      const hasFour = playerLongRuns.some((run) => run.cells.length === 4);
      const earnsBonus = hasFivePlus || playerCrossRuns.length > 0;
      strongSpecialClear = earnsBonus;
      // The taught swap always demonstrates the base one-move cost, even when
      // the balanced opener happened to offer a stronger 4+ clear.
      const moveDelta = isFixedMatchTutorialSwap && fixedTutorialStageAtSwap === 'three'
        ? -1
        : earnsBonus
          ? MATCH_CLEAR_BONUS_MOVES
          : hasFour
            ? 0
            : -1;
      const nextMoves = movesLeftRef.current + moveDelta;
      movesLeftRef.current = nextMoves;
      setMovesLeft(nextMoves);
      freeMoveTutorialOutcomeRef.current = isFixedMatchTutorialSwap
        ? null
        : !isFirstSwapTutorialSwap && (hasFour || earnsBonus)
          ? 'fourPlus'
          : 'normal';
    }

    const funWrongMatch =
      (reviveActiveRef.current || challengeMode === 'review') &&
      !!funTargetId &&
      targetItemId !== funTargetId;
    const sfxVolume = resolveSfxVolume(bgmEnabled);

    unlockGameAudio();
    // One strong response only for player-created 4+ / row / cross / T / L clears.
    if (strongSpecialClear) {
      triggerGameHaptic('specialClear');
    }
    if (funWrongMatch) {
      playWrongSfx(sfxVolume);
      applyTimedTargetMiss(funTargetId);
      if (reviveActiveRef.current) {
        const nextWrong = reviveWrongsRef.current + 1;
        reviveWrongsRef.current = nextWrong;
        setReviveWrongs(nextWrong);
        if (nextWrong >= REVIVE_WRONG_LIMIT) {
          // Still play out the clear FX; fail after cascade via flag.
          // Fail immediately so player can't keep matching.
          failReviveAttempt();
          setSelected(null);
          return;
        }
        showFirstReviveWrongTip(REVIVE_WRONG_LIMIT - nextWrong);
      }
    } else {
      playMatchClearSfx(sfxVolume, lineClearRuns.length > 0 ? 'line' : 'match');
    }

    const linkOrigin =
      directItem
        ? (directMatch.cells.find((cell) => cell.r === movedA.r && cell.c === movedA.c) ??
          directMatch.cells.find((cell) => cell.r === movedB.r && cell.c === movedB.c) ??
          directMatch.cells[Math.floor(directMatch.cells.length / 2)])
        : undefined;

    const firstCells =
      lineClearRuns.length > 0 ? clearCellsForLongRuns(lineClearRuns) : directMatch.cells;
    const firstItemIds =
      lineClearRuns.length > 0
        ? lineClearRuns.map((run) => run.itemId)
        : [directMatch.itemId];
    const firstIsLine = lineClearRuns.length > 0;

    if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current);
    const epoch = boardEpochRef.current;

    // ── Track A: board clear → gravity → cascade (never waits on the word popup).
    setSelected(null);
    setGrid(swapped);
    setMatchClearCells(firstCells);
    setMatchClearKey((k) => k + 1);
    setMatchShakeKey((k) => k + 1);

    const clearedItemIds: string[] = [];
    const fixedRefillIds = isFixedMatchTutorialSwap && fixedTutorialStageAtSwap
      ? fixedMatchTutorialRefillIds(fixedTutorialStageAtSwap, itemIds)
      : null;
    const fixedRefill = fixedRefillIds
      ? { itemIds: fixedRefillIds, cursor: 0 }
      : undefined;
    cascadeRunningRef.current = true;
    setCascadeBusy(true);

    void (async () => {
      let current = swapped.map((row) => row.map((t) => ({ ...t })));
      let wave = { cells: firstCells, itemIds: firstItemIds, isLine: firstIsLine };

      try {
        for (let loop = 0; loop < MAX_CASCADE_WAVES; loop++) {
          if (epoch !== boardEpochRef.current || !cascadeRunningRef.current) return;

          if (loop > 0) {
            const nextWave = collectClearWave(current);
            if (!nextWave) break;
            wave = nextWave;
            // Cascade FX only — scoring already applied on the player swap.
            // Reserve physical emphasis for a genuinely long chain; short
            // cascades keep their visual/audio feedback without haptic spam.
            if (loop === 3) triggerGameHaptic('cascadeWave');
            playMatchClearSfx(sfxVolume, wave.isLine ? 'line' : 'match');
            setMatchClearCells(wave.cells);
            setMatchClearKey((k) => k + 1);
          }

          clearedItemIds.push(...wave.itemIds);

          const clearMs = wave.isLine ? LINE_CLEAR_MS : MATCH_CLEAR_MS;
          await delay(clearMs);
          if (epoch !== boardEpochRef.current || !cascadeRunningRef.current) return;

          const clearedKeys = new Set(wave.cells.map((cell) => `${cell.r}:${cell.c}`));
          const refillHitsNeeded = hitsNeededForMode(challengeMode);
          const projectedRefillHits = {
            ...itemHitCount,
            [targetItemId]: Math.min(
              refillHitsNeeded,
              (itemHitCount[targetItemId] ?? 0) + 1,
            ),
          };
          const unfinishedRefillIds = gameItems
            .filter((it) => (projectedRefillHits[it.id] ?? 0) < refillHitsNeeded)
            .map((it) => it.id);
          const preferUnfinished =
            (
              challengeMode === 'random' &&
              !reviveActiveRef.current &&
              movesLeftRef.current <= lateBoardAssistMoves
            ) || (
              challengeMode === 'category' &&
              !reviveActiveRef.current &&
              unfinishedRefillIds.length === 1
            )
              ? unfinishedRefillIds
              : undefined;
          const refillItemIds =
            challengeMode === 'random' && !reviveActiveRef.current
              ? refillIdsForProgress(
                  itemIds,
                  {
                    ...itemHitCount,
                    [targetItemId]: Math.min(
                      HITS_PER_WORD_DEFAULT,
                      (itemHitCount[targetItemId] ?? 0) + 1,
                    ),
                  },
                  movesLeftRef.current,
                )
              : itemIds;
          const after = collapseAndRefill(
            current,
            clearedKeys,
            refillItemIds,
            preferUnfinished && preferUnfinished.length > 0
              ? preferUnfinished
              : undefined,
            fixedRefill,
          ).grid;
          const beforeSnap = current.map((row) => row.map((t) => ({ ...t })));
          const afterSnap = after.map((row) => row.map((t) => ({ ...t })));

          setMatchClearCells(null);
          emitRefillBurst(beforeSnap, afterSnap, clearedKeys);
          setGrid(afterSnap);
          current = afterSnap;

          await waitForRefillDone();
          if (epoch !== boardEpochRef.current || !cascadeRunningRef.current) return;
        }

        applyResolvedMatch({ grid: current, clearedItemIds }, targetItemId);
        if (isReviewTutorialSwap) {
          completeReviewTutorial();
        } else if (isFixedMatchTutorialSwap && fixedTutorialStageAtSwap && tutorialPair) {
          if (fixedTutorialStageAtSwap === 'three') {
            setFixedMatchTutorialStage('four');
          } else if (fixedTutorialStageAtSwap === 'four') {
            setFixedMatchTutorialStage('cross');
          } else {
            completeFixedMatchTutorial();
          }
          firstSwapTutorialResolvingRef.current = false;
          setFirstSwapTutorialResolving(false);
        } else {
          const freeMoveOutcome = freeMoveTutorialOutcomeRef.current;
          freeMoveTutorialOutcomeRef.current = null;
          if (!firstTimeGuideRef.current.hasCompletedFreeMoveRuleTutorial) {
            if (freeMoveOutcome === 'fourPlus') {
              completeFreeMoveRuleTutorial();
            } else if (freeMoveOutcome === 'normal') {
              startFreeMoveRuleTutorial();
              setFreeMoveRuleHintMove(findFourPlusHintMove(current));
            }
          }
          if (isFirstSwapTutorialSwap) completeFirstSwapTutorial();
        }
      } finally {
        cascadeRunningRef.current = false;
        setCascadeBusy(false);
        if (
          isFirstSwapTutorialSwap &&
          !firstTimeGuideRef.current.hasCompletedFirstSwapTutorial
        ) {
          firstSwapTutorialResolvingRef.current = false;
          setFirstSwapTutorialResolving(false);
        }
      }
    })();

    // ── Track B: word popup + speech (front layer; independent of board timing).
    // Timed hunt: prompt already spoken when the target appeared — skip match popup speech.
    const timedHuntPrompt =
      (reviveActiveRef.current || challengeMode === 'review') && !!funTargetId;
    if (directItem && linkOrigin && !funWrongMatch && !timedHuntPrompt) {
      showWord({
        word: directItem.word,
        sourceWord: directItem.sourceWord,
        cn: directItem.cn,
        emoji: directItem.emoji,
        imgSrc: directItem.imgSrc,
        originCell: linkOrigin,
      });
      window.setTimeout(() => {
        if (epoch !== boardEpochRef.current) return;
        wordLinkSeqRef.current += 1;
        setWordLink({
          itemId: targetItemId,
          originCell: linkOrigin,
          burstKey: wordLinkSeqRef.current,
        });
      }, 280);
    }
  };

  const clickCell = (r: number, c: number) => {
    if (pool.length < 6) return;
    if (firstSwapTutorialPendingRef.current) {
      const tutorialPair = firstSwapTutorialMoveRef.current;
      const clicked = { r, c };
      if (
        firstSwapTutorialResolvingRef.current ||
        !tutorialPair ||
        (!sameCell(clicked, tutorialPair.source) &&
          !sameCell(clicked, tutorialPair.target))
      ) {
        return;
      }
    }
    if (!selected) {
      triggerGameHaptic('tileSelection');
      setSelected({ r, c });
      return;
    }
    if (selected.r === r && selected.c === c) {
      setSelected(null);
      return;
    }
    const dr = Math.abs(selected.r - r);
    const dc = Math.abs(selected.c - c);
    const isAdjacent = (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
    if (!isAdjacent) {
      triggerGameHaptic('tileSelection');
      setSelected({ r, c });
      return;
    }
    void attemptSwap(selected, { r, c });
  };

  const swapCells = (from: Cell, to: Cell) => {
    if (pool.length < 6) return;
    if (firstSwapTutorialPendingRef.current) {
      const tutorialPair = firstSwapTutorialMoveRef.current;
      if (
        firstSwapTutorialResolvingRef.current ||
        !tutorialPair ||
        !sameCellPair(from, to, tutorialPair)
      ) {
        return;
      }
    }
    setSelected(null);
    void attemptSwap(from, to);
  };

  const usesThiings = allPool.some((it) => typeof it.imgSrc === 'string' && it.imgSrc.length > 0);
  const reviewUnlocked = isReviewUnlocked(modeUnlocks.adventureClears);
  const categoryUnlocked = isCategoryUnlocked(modeUnlocks.adventureClears);
  const playBlockedReason =
    challengeMode === 'random' && !adventurePlayable
      ? ('stamina' as const)
      : pool.length < 6
        ? ('pool' as const)
        : null;
  const canPlay = playBlockedReason === null && gameItems.length >= 6;
  useEffect(() => {
    if (challengeMode !== 'review' || activeTab !== 'game' || consentOpen || !canPlay) return;
    if (!analyticsLedgerRef.current('review_started', analyticsRoundKey)) return;
    trackCoreEvent('review_started', {
      course: courseId,
      review_type: forcedReviewActive || modeUnlocks.pendingForcedReview ? 'forced' : 'scheduled',
    });
  }, [analyticsRoundKey, challengeMode, activeTab, consentOpen, canPlay, courseId, forcedReviewActive, modeUnlocks.pendingForcedReview]);

  const dueReviewCount = useMemo(() => {
    const now = Date.now();
    return reviewPool.reduce((count, item) => {
      const memory = wordMemory.get(memoryKeyForWord(item.word));
      return count + (!memory || isDue(memory, now) ? 1 : 0);
    }, 0);
  }, [reviewPool, wordMemory]);

  useEffect(() => {
    const refresh = () => {
      const wasPendingEnable = readLearningReminderSettings().pendingSystemEnable;
      const remaining = msUntilNextStamina(staminaStateRef.current);
      void refreshLearningReminder({
        locale,
        hasPremiumAccess,
        playedToday: staminaStateRef.current.spentToday > 0,
        dueReviewCount,
        staminaValue: staminaStateRef.current.value,
        nextStaminaAt: remaining === null ? null : Date.now() + remaining,
      }).then(() => {
        const enabled = readLearningReminderSettings().enabled;
        setRemindersEnabled(enabled);
        if (wasPendingEnable && enabled) setRewardedAdStatus(NOTIFICATION_SETTINGS_COPY[locale].enabled);
      }).catch((error) => {
        console.warn('[match3] unable to refresh learning reminder', error);
      });
    };
    refresh();
    const nativeListener = CapacitorApp.addListener('appStateChange', ({ isActive }) => {
      if (isActive) refresh();
    });
    return () => {
      void nativeListener.then((handle) => handle.remove());
    };
  }, [dueReviewCount, hasPremiumAccess, locale, staminaState.spentToday, staminaState.value]);

  const handleEnableReminders = async () => {
    setReminderPromptBusy(true);
    try {
      const remaining = msUntilNextStamina(staminaStateRef.current);
      const result = await enableLearningReminders({
        locale,
        hasPremiumAccess,
        playedToday: staminaStateRef.current.spentToday > 0,
        dueReviewCount,
        staminaValue: staminaStateRef.current.value,
        nextStaminaAt: remaining === null ? null : Date.now() + remaining,
      });
      setRemindersEnabled(readLearningReminderSettings().enabled);
      return result;
    } finally {
      setReminderPromptBusy(false);
    }
  };
  const modeLabel = reviveActive
    ? t.adventure.reviveTitle
    : forcedReviewActive || (challengeMode === 'review' && modeUnlocks.pendingForcedReview)
      ? t.modes.forcedReviewTitle
      : challengeMode === 'review'
      ? t.modes.reviewMode
      : challengeMode === 'mood'
        ? `${moodPaletteSwatch(moodPaletteId)} ${t.modes.moodBoard} · ${t.modes.moodPaletteName(moodPaletteId)}`
      : challengeMode === 'category'
        ? activeCategory
          ? activeCategory.id === 'thiings'
            ? t.modes.thiingsLabel
            : categoryDisplayName(activeCategory, locale)
          : t.modes.categoryFallback
        : t.modes.randomChallenge;

  const handlePlayerSummaryChange = React.useCallback((next: PlayerSummary) => {
    savePlayerSummary(next, progressUserIdRef.current);
    setPlayerSummary(next);
  }, []);

  const handleReviveExit = React.useCallback(() => {
    if (!reviveActiveRef.current) return;
    failReviveAttempt();
  }, [failReviveAttempt]);

  const handleFailRetry = React.useCallback(() => {
    setFailSheetOpen(false);
    setDeadMachineOpen(false);
    adventureRoundFreeRef.current = false;
    retryAdventureBoard(
      gameItems.length >= 6
        ? [...gameItems]
        : pickAdventureItems(
            pool,
            ADVENTURE_WORDS_PER_SET,
            new Set(roundLearnedIdsRef.current),
          ),
      false,
    );
  }, [gameItems, pool, retryAdventureBoard]);

  const handleGoReview = React.useCallback(() => {
    setDeadMachineOpen(false);
    setActiveTab('game');
    enterReviewMode(Boolean(modeUnlocks.pendingForcedReview));
  }, [enterReviewMode, modeUnlocks.pendingForcedReview]);

  const handleGoMoodFromDeadMachine = React.useCallback(() => {
    setDeadMachineOpen(false);
    setActiveTab('game');
    handleChallengeModeChange('mood');
  }, [handleChallengeModeChange]);

  const accountPromptBlocked =
    consentOpen ||
    boardIntroActive ||
    quizOpen ||
    roundCelebrate ||
    roundResult !== null ||
    failSheetOpen ||
    deadMachineOpen ||
    sayBlastOpen ||
    promptSignInOpen ||
    forcedReviewActive ||
    modeUnlocks.pendingForcedReview;

  useEffect(() => {
    if (user) {
      setAccountPromptKind(null);
      return;
    }
    if (
      !authReady ||
      !authConfigured ||
      accountPromptBlocked ||
      hasDismissedStreakGateToday() ||
      !shouldGateLongTermStreak(playerSummary)
    ) {
      return;
    }
    setAccountPromptKind('streak');
  }, [accountPromptBlocked, authConfigured, authReady, playerSummary, user]);

  useEffect(() => {
    if (
      !authReady ||
      !authConfigured ||
      user ||
      accountPromptBlocked ||
      accountPromptKind !== null ||
      shouldGateLongTermStreak(playerSummary) ||
      modeUnlocks.adventureClears < 3 ||
      roundLearnedIds.length < 18 ||
      hasCompletedSoftAuthPrompt()
    ) {
      return;
    }
    setAccountPromptKind('soft');
  }, [
    accountPromptBlocked,
    accountPromptKind,
    authConfigured,
    authReady,
    modeUnlocks.adventureClears,
    playerSummary,
    roundLearnedIds.length,
    user,
  ]);

  useEffect(() => {
    if (!user?.uid || coreCloudReadyScope !== coreCloudScopeKey || !promptAuthStartedRef.current) return;
    promptAuthStartedRef.current = false;
    setAccountSaveConfirmation(true);
    const timer = window.setTimeout(() => setAccountSaveConfirmation(false), 1800);
    return () => window.clearTimeout(timer);
  }, [coreCloudReadyScope, coreCloudScopeKey, user?.uid]);

  const dismissAccountPrompt = React.useCallback(() => {
    if (accountPromptKind === 'streak') dismissStreakGateForToday();
    else completeSoftAuthPrompt();
    setAccountPromptKind(null);
  }, [accountPromptKind]);

  const openPromptAuth = React.useCallback(
    (mode: 'signIn' | 'signUp') => {
      if (accountPromptKind === 'soft') completeSoftAuthPrompt();
      promptAuthStartedRef.current = true;
      setAccountPromptKind(null);
      setPromptSignInMode(mode);
      setPromptSignInOpen(true);
    },
    [accountPromptKind],
  );

  const handleGoAdventure = React.useCallback(() => {
    handleChallengeModeChange('random');
  }, [handleChallengeModeChange]);

  const resumeAdventureAfterStaminaGate = React.useCallback(() => {
    const refreshed = tickStamina(staminaStateRef.current);
    if (!premiumAccessRef.current && refreshed.value <= 0) {
      lockAdventureDead();
      return;
    }
    if (refreshed !== staminaStateRef.current) persistStamina(refreshed);
    const resume = staminaGateResumeRef.current;
    staminaGateResumeRef.current = null;
    setSayBlastOpen(false);
    setSayBlastEntry('game');
    setDeadMachineOpen(false);
    setActiveTab('game');
    if (adventureFailedAwaitingRetryRef.current) {
      setAdventurePlayable(true);
      setFailSheetOpen(true);
      return;
    }
    if (resume) {
      startNextRound(
        resume.hitCount,
        resume.excludeIds,
        resume.advanceLevel,
        resume.modeOverride ?? 'random',
      );
      return;
    }
    handleChallengeModeChange('random');
  }, [handleChallengeModeChange, lockAdventureDead, persistStamina, startNextRound]);

  const openSayBlast = React.useCallback((entry: 'game' | 'stamina-gate' = 'game') => {
    setSayBlastEntry(entry);
    updateFirstTimeGuide((current) => ({
      ...current,
      hasVisitedSayAndBlast: true,
      stage:
        current.stage === 'sayAndBlast'
          ? 'awaitingSayAndBlastCompletion'
          : current.stage,
    }));
    stopAllWordSpeech();
    onBgmPauseChange(true);
    setSayBlastOpen(true);
  }, [onBgmPauseChange, updateFirstTimeGuide]);

  const handleValidSayBlastExperience = React.useCallback(() => {
    void markLearningActivity({ locale, hasPremiumAccess, ...getReminderGameState() }).catch((error) => {
      console.warn('[match3] unable to mark Say & Blast reminder activity', error);
    });
    updateFirstTimeGuide((current) =>
      current.stage === 'awaitingSayAndBlastCompletion'
        ? { ...current, stage: 'moodBoard' }
        : current,
    );
  }, [hasPremiumAccess, locale, updateFirstTimeGuide, getReminderGameState]);

  const exitSayBlast = React.useCallback(() => {
    const shouldReturnHome = sayBlastEntry !== 'game';
    setSayBlastOpen(false);
    setSayBlastEntry('game');
    if (shouldReturnHome) {
      onBgmPauseChange(false);
      onHome();
      return;
    }
    window.setTimeout(() => {
      onBgmPauseChange(false);
    }, 280);
  }, [onBgmPauseChange, onHome, sayBlastEntry]);

  useEffect(() => () => onBgmPauseChange(false), [onBgmPauseChange]);

  const rewardSayBlastStamina = React.useCallback(async (): Promise<'granted' | 'banked' | 'daily-limit' | 'sync-error'> => {
    const uid = progressUserIdRef.current;
    if (isCloudQuotaAvailable(uid)) {
      try {
        const quota = await grantDailySayBlastReward(
          uid,
          tickStamina(staminaStateRef.current),
          loadMoodDailyState({ userId: uid }).plays,
        );
        if (!quota) return 'daily-limit';
        adoptCloudQuota(quota);
        return 'granted';
      } catch (error) {
        console.warn('[match3] Say & Blast reward sync failed', error);
        setQuotaSyncError(true);
        return 'sync-error';
      }
    }
    const reward = grantSayBlastStamina(staminaStateRef.current);
    persistStamina(reward.state);
    return reward.outcome;
  }, [adoptCloudQuota, persistStamina]);

  const handleRewardedAdReset = React.useCallback(async () => {
    if (rewardedAdBusy) return;
    const current = tickStamina(staminaStateRef.current);
    if (current.adResetsToday >= AD_STAMINA_RESETS_DAILY_MAX) {
      setRewardedAdStatus(rewardedAdCopy.dailyLimit);
      return;
    }
    setRewardedAdBusy(true);
    setRewardedAdStatus(rewardedAdCopy.loading);
    try {
      await showStaminaRewardedAd();
      const uid = progressUserIdRef.current;
      if (isCloudQuotaAvailable(uid)) {
        const quota = await resetDailyQuotaFromRewardedAd(
          uid,
          current,
          loadMoodDailyState({ userId: uid }).plays,
        );
        if (!quota) {
          setRewardedAdStatus(rewardedAdCopy.dailyLimit);
          return;
        }
        adoptCloudQuota(quota);
      } else {
        const reward = resetStaminaFromRewardedAd(current);
        if (reward.outcome !== 'granted') {
          setRewardedAdStatus(
            reward.outcome === 'daily-limit'
              ? rewardedAdCopy.dailyLimit
              : rewardedAdCopy.rewarded,
          );
          return;
        }
        persistStamina(reward.state);
      }
      setRewardedAdStatus(rewardedAdCopy.rewarded);
    } catch (error) {
      console.warn('[match3] rewarded ad failed', error);
      setRewardedAdStatus(
        rewardedAdsTestMode()
          ? `Test ad error: ${error instanceof Error ? error.message : String(error)}`
          : rewardedAdCopy.unavailable,
      );
    } finally {
      setRewardedAdBusy(false);
    }
  }, [adoptCloudQuota, persistStamina, rewardedAdBusy, rewardedAdCopy]);

  const learnedGuideEligible =
    firstTimeGuide.stage === 'learned' &&
    activeTab === 'game' &&
    !consentOpen &&
    !boardIntroActive &&
    !quizOpen &&
    !roundCelebrate &&
    roundResult === null &&
    !sayBlastOpen &&
    !failSheetOpen &&
    !deadMachineOpen &&
    reviveFlash === null &&
    !firstSwapTutorialEligible &&
    !firstSwapTutorialResolving;
  const modeFeatureGuideEligible =
    activeTab === 'game' &&
    !consentOpen &&
    !sayBlastOpen &&
    !quizOpen &&
    !roundCelebrate &&
    roundResult === null &&
    !forcedReviewActive &&
    !modeUnlocks.pendingForcedReview &&
    firstTimeGuide.stage !== 'learned';
  const modeFeatureGuideTarget =
    modeFeatureGuideEligible && categoryUnlocked &&
    (firstTimeGuide.promptCounts.categoryModePicker < 2 ||
      firstTimeGuide.promptCounts.category < 2)
      ? 'category'
      : modeFeatureGuideEligible &&
          ((!firstTimeGuide.hasVisitedSayAndBlast && firstTimeGuide.stage === 'sayAndBlast') ||
            (firstTimeGuide.stage === 'moodBoard' && modeUnlocks.adventureClears >= 3))
        ? firstTimeGuide.stage
        : null;

  return (
    <div
      className={cn(
        'flex h-full min-h-0 flex-col text-gray-900',
        isCandyTab
          ? 'bg-[#fff6eb]'
          : 'bg-gradient-to-b from-violet-50 via-[#faf8ff] to-white',
      )}
      onPointerDownCapture={() => {
        unlockGameAudio();
        if (ttsUnlockRef.current) return;
        ttsUnlockRef.current = true;
        unlockSpeechSynthesis();
      }}
    >
      {quotaSyncError && isCloudQuotaAvailable(progressUserId) && (
        <div role="alert" className="absolute inset-x-4 top-[max(12px,env(safe-area-inset-top))] z-[120] rounded-xl bg-rose-50 px-4 py-3 text-center text-sm font-bold text-rose-800 shadow-lg">
          {CATEGORY_UI_COPY[locale].quotaSyncError}
        </div>
      )}
      <main
        ref={scrollContainerRef}
        className={cn(
          'min-h-0 flex-1',
          activeTab === 'game'
            ? 'overflow-hidden p-0'
            : 'overflow-x-hidden overflow-y-auto overscroll-y-contain px-0 pb-4 pt-0 [-webkit-overflow-scrolling:touch]',
          consentOpen && 'overflow-hidden',
        )}
      >
        {activeTab === 'game' && (
          <GamePanel
            onHome={() => { if (!quotaChargePendingRef.current) onHome(); }}
            onRestart={reset}
            clearedSets={modeUnlocks.adventureClears}
            gameItems={gameItems}
            itemHitCount={itemHitCount}
            challengeMode={challengeMode}
            modeLabel={modeLabel}
            reviveActive={reviveActive}
            timedHuntActive={reviveActive || challengeMode === 'review'}
            funTargetItem={funTargetItem}
            funTargetKey={funTargetKey}
            funCountdown={funCountdown}
            funCountdownMaxSec={TIMED_TARGET_COUNTDOWN_SEC}
            reviveWrongs={reviveWrongs}
            reviveWrongLimit={REVIVE_WRONG_LIMIT}
            reviveCorrects={reviveCorrects}
            reviveCorrectNeeded={reviveCorrectNeeded(
              gameItems.length || ADVENTURE_WORDS_PER_SET,
            )}
            onReviveExit={handleReviveExit}
            movesLeft={
              challengeMode === 'random' && !reviveActive ? movesLeft : null
            }
            stamina={staminaHudHold ?? staminaState.value}
            unlimitedStamina={hasPremiumAccess}
            staminaBanked={staminaState.bankedRewards}
            canPlay={canPlay}
            playBlockedReason={playBlockedReason === 'stamina' ? 'stamina' : null}
            onGoAdventure={handleGoAdventure}
            pendingForcedReview={modeUnlocks.pendingForcedReview}
            onResumeForcedReview={resumeForcedReview}
            reviewPaused={reviewPaused}
            onToggleReviewPause={() => setReviewPaused((p) => !p)}
            onModePickerOpenChange={setModePickerOpen}
            hitsNeeded={hitsNeededForMode(challengeMode)}
            grid={grid}
            itemById={itemById}
            selected={selected}
            hintMove={hintMove}
            popWord={popWord}
            matchShakeKey={matchShakeKey}
            matchClearCells={matchClearCells}
            matchClearKey={matchClearKey}
            gridLocked={
              matchClearCells !== null ||
              boardIntroActive ||
              refillActive ||
              cascadeBusy ||
              reviveFlash !== null ||
              accountOverlayOpen ||
              popWord !== null ||
              roundResult !== null ||
              !timedTargetPlayable ||
              reviewPaused ||
              (firstSwapTutorialEligible &&
                (firstSwapTutorialResolving || !firstSwapTutorialMove))
            }
            boardIntroActive={boardIntroActive}
            onBoardIntroComplete={handleBoardIntroComplete}
            refillBurst={refillBurst}
            onRefillActiveChange={handleRefillActiveChange}
            wordLink={wordLink}
            onWordLinkDone={() => setWordLink(null)}
            onCellClick={clickCell}
            onSwapCells={swapCells}
            onChallengeModeChange={handleChallengeModeChange}
            onOpenSayBlast={() => openSayBlast('game')}
            challengePools={challengePools}
            categoryBrowseSections={categoryBrowseSections}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={setSelectedCategoryId}
            categoryHubRequestKey={categoryHubRequestKey}
            onShuffleWords={() =>
              startNextRound(itemHitCount, new Set(gameItems.map((it) => it.id)))
            }
            categoryUnlocked={categoryUnlocked}
            moodUnlocked={modeUnlocks.adventureClears >= 3}
            moodCanStartNew={canPlayMoodToday({ hasPremiumAccess, userId: progressUserId }) && (hasPremiumAccess || staminaState.value > 0)}
            sayBlastReady={sayBlastPool.length >= ADVENTURE_WORDS_PER_SET}
            firstSwapTutorialMove={
              firstSwapTutorialEligible && !firstSwapTutorialResolving
                ? firstSwapTutorialMove
                : null
            }
            freeMoveRuleHintMove={
              challengeMode === 'random' ? freeMoveRuleHintMove : null
            }
            fixedMatchTutorialStage={fixedMatchTutorialStage}
            reviewTutorialActive={reviewTutorialActive}
            featureGuideTarget={modeFeatureGuideTarget}
            featureGuideModePickerPlayCount={
              modeFeatureGuideTarget === 'sayAndBlast'
                ? firstTimeGuide.promptCounts.sayAndBlastModePicker
                : modeFeatureGuideTarget === 'moodBoard'
                  ? firstTimeGuide.promptCounts.moodBoardModePicker
                  : modeFeatureGuideTarget === 'category'
                    ? firstTimeGuide.promptCounts.categoryModePicker
                  : 0
            }
            featureGuidePlayCount={
              modeFeatureGuideTarget
                ? firstTimeGuide.promptCounts[modeFeatureGuideTarget]
                : 0
            }
            onFeatureGuidePlaybackStart={recordGuidePlayback}
          />
        )}
        {activeTab === 'learned' && (
          <LearnedPanel
            roundLearnedIds={roundLearnedIds}
            itemById={itemById}
            allPool={allPool}
            wordMemory={wordMemory}
            canGoReview={
              reviewUnlocked &&
              reviewPool.length >= ADVENTURE_WORDS_PER_SET &&
              dueReviewCount > 0
            }
            onGoReview={handleGoReview}
            showFirstVisitGuide={
              firstTimeGuide.stage === 'learned' &&
              !firstTimeGuide.hasCompletedLearnedTour
            }
            onFirstVisitGuideComplete={() => {
              updateFirstTimeGuide((current) => ({
                ...current,
                hasCompletedLearnedTour: true,
                stage: current.hasVisitedSayAndBlast ? 'moodBoard' : 'sayAndBlast',
              }));
            }}
          />
        )}
        {activeTab === 'words' && (
          <WordsPanel
            learnedIds={roundLearnedIds}
            progressUserId={progressUserId}
            focusItemIds={collectionFocusItemIds}
          />
        )}
        {activeTab === 'profile' && (
          <ProfilePanel
            ttsAvailable={ttsAvailable}
            usesThiings={usesThiings}
            wordMemory={wordMemory}
            allPool={allPool}
            adventureClears={modeUnlocks.adventureClears}
            playerSummary={playerSummary}
            onPlayerSummaryChange={handlePlayerSummaryChange}
            bgmEnabled={bgmEnabled}
            onBgmEnabledChange={handleBgmEnabledChange}
            sfxEnabled={sfxEnabled}
            onSfxEnabledChange={handleSfxEnabledChange}
            hapticsEnabled={hapticsEnabled}
            onHapticsEnabledChange={handleHapticsEnabledChange}
            playedToday={staminaState.spentToday > 0}
            reminderGameState={getReminderGameState()}
          />
        )}
      </main>

      <MobileTabBar
        active={activeTab}
        onChange={handleTabChange}
        learnedGuide={
          learnedGuideEligible
            ? {
                playCount: firstTimeGuide.promptCounts.learned,
                onPlaybackStart: () => recordGuidePlayback('learned'),
              }
            : null
        }
      />

      {sayBlastOpen && (
        <SayBlastGame
          learnedItems={sayBlastPool}
          speechLocale={languageForCode(course.targetLanguage).speechLocale}
          analyticsSetNumber={level}
          progressUserId={progressUserId}
          onExit={exitSayBlast}
          returnToAdventure={sayBlastEntry === 'stamina-gate'}
          onContinueAdventure={resumeAdventureAfterStaminaGate}
          onRewardStamina={rewardSayBlastStamina}
          onValidExperience={handleValidSayBlastExperience}
        />
      )}

      <CelebrationBurst
        show={reviveFlash === 'firstFailure'}
        title={ui.rescue.failed}
        emoji="😅"
        className="candy-celebration-overlay-no-dim"
        durationMs={2000}
        onDone={() => {
          setReviveFlash('rescueOffer');
        }}
      />

      <CelebrationBurst
        show={reviveFlash === 'rescueOffer'}
        title={ui.rescue.offerTitle}
        subtitle={ui.rescue.offerBody(firstReviveRemainingWords)}
        emoji="💗"
        className="candy-celebration-overlay-no-dim"
        actionLabel={ui.rescue.save}
        onDone={() => {
          updateFirstTimeGuide((current) => ({ ...current, hasSeenReviveTutorial: true }));
          setReviveFlash(null);
        }}
      />

      {reviveWrongTip && (
        <div className="revive-wrong-tip" role="status" aria-live="polite">
          {reviveWrongTip}
        </div>
      )}

      <CelebrationBurst
        show={reviveFlash === 'success'}
        title={t.adventure.reviveSuccessTitle}
        subtitle={t.adventure.reviveSuccessSubtitle}
        emoji="💖"
        className="candy-celebration-overlay-no-dim"
        actionLabel={t.common.next}
        onDone={() => {
          setReviveFlash(null);
          if (!rescueQuizPendingRef.current) return;
          rescueQuizPendingRef.current = false;
          recordRoundAnalytics('set_completed');
          openRoundCelebrate(quizItemsRef.current);
        }}
      />

      <RoundQuizSheet
        open={quizOpen}
        items={quizItems}
        distractorPool={allPool}
        quizKind={quizKind}
        checkpoint={quizCheckpoint}
        onComplete={(mistakenItemIds) => {
          if (quizCompletionInFlightRef.current) return;
          quizCompletionInFlightRef.current = true;
          recordRoundAnalytics('quiz_completed', mistakenItemIds);
          handleQuizComplete(mistakenItemIds);
          clearPendingQuiz(courseId, progressUserIdRef.current);
          quizCheckpointRef.current = null;
          setQuizCheckpoint(null);
        }}
      />

      <RoundResultSheet
        result={roundResult}
        onEnableReminders={handleEnableReminders}
        onExitComplete={handleRoundResultExitComplete}
        onContinue={() => completeRoundResult(null)}
        onReturnToCategory={returnToCategoryHub}
        onViewCollection={() => completeRoundResult('words')}
        canContinueReview={
          reviewPool.length >= ADVENTURE_WORDS_PER_SET && dueReviewCount > 0
        }
        canGoAdventure={hasPremiumAccess || staminaState.value > 0}
        hasPremiumAccess={hasPremiumAccess}
        lifetimeDisplayPrice={
          offerings.lifetime.displayPrice === '—' ? null : offerings.lifetime.displayPrice
        }
        onContinueReview={handleReviewContinueReview}
        onGoAdventure={handleReviewContinueAdventure}
        onUnlockPlus={handleMoodResultUnlockPlus}
        onReturnHome={handleRoundResultReturnHome}
        onRest={handleReviewContinueRest}
        onClaimAward={handleClaimRoundAward}
      />

      <AccountPromptSheet
        open={
          accountPromptKind !== null &&
          !promptSignInOpen
        }
        kind={accountPromptKind ?? 'soft'}
        discoveredCount={roundLearnedIds.length}
        onCreateAccount={() => openPromptAuth('signUp')}
        onSignIn={() => openPromptAuth('signIn')}
        onDismiss={dismissAccountPrompt}
      />

      <SignInSheet
        open={promptSignInOpen}
        initialMode={promptSignInMode}
        onClose={() => setPromptSignInOpen(false)}
      />

      {accountSaveConfirmation && (
        <div className="home-page-save-confirmation" role="status">
          ✅ {ui.progressSaved}
        </div>
      )}

      <AdventureFailSheet
        open={failSheetOpen}
        canRetry={hasPremiumAccess || staminaState.value > 0}
        unlimitedRetry={hasPremiumAccess}
        remainingWords={firstReviveRemainingWords}
        onRetry={handleFailRetry}
        onRecharge={() => {
          setFailSheetOpen(false);
          setDeadMachineOpen(true);
        }}
        onGoHome={onHome}
      />

      <DeadMachineSheet
        open={deadMachineOpen && activeTab === 'game'}
        hasStamina={hasPremiumAccess || staminaState.value > 0}
        nextStaminaAt={
          (() => {
            const remaining = msUntilNextStamina(staminaState);
            return remaining === null ? null : Date.now() + remaining;
          })()
        }
        canGoSayBlast={
          sayBlastPool.length >= ADVENTURE_WORDS_PER_SET &&
          staminaState.value < STAMINA_MAX
        }
        canGoReview={reviewUnlocked && reviewPool.length >= ADVENTURE_WORDS_PER_SET}
        canGoMood={modeUnlocks.adventureClears >= 3 && canPlayMoodToday({ hasPremiumAccess, userId: progressUserId }) && (hasPremiumAccess || staminaState.value > 0)}
        rewardedAdsAvailable={rewardedAdsSupported()}
        adResetsRemaining={rewardedAdResetsRemaining}
        adBusy={rewardedAdBusy}
        adStatus={rewardedAdStatus}
        lifetimeDisplayPrice={offerings.lifetime.displayPrice === '—' ? null : offerings.lifetime.displayPrice}
        onWatchAd={() => void handleRewardedAdReset()}
        onUnlockPlus={() => openPaywall('profile')}
        onGoSayBlast={() => {
          setDeadMachineOpen(false);
          openSayBlast('stamina-gate');
        }}
        onGoReview={handleGoReview}
        onGoMood={handleGoMoodFromDeadMachine}
        onContinue={resumeAdventureAfterStaminaGate}
        onGoHome={onHome}
        remindersEnabled={remindersEnabled}
        reminderBusy={reminderPromptBusy}
        onEnableReminders={() => {
          if (reminderPromptBusy) return;
          void handleEnableReminders().then(result => {
            const copy = NOTIFICATION_SETTINGS_COPY[locale];
            setRewardedAdStatus(result === 'enabled' ? copy.enabled : result === 'denied' ? copy.permissionDenied : copy.unavailable);
          }).catch(() => setRewardedAdStatus(NOTIFICATION_SETTINGS_COPY[locale].unavailable));
        }}
      />

      <LegalConsentModal open={consentOpen} onAccept={acceptConsent} />

    </div>
  );
};
