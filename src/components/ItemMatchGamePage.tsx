import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../lib/utils';
import { syncStatusBarForTab } from '../lib/capacitorInit';
import { useAuth } from '../auth/AuthProvider';
import {
  hydrateMatch3Memories,
  compareWordsForSpacedReview,
  masteredEmojiCount,
  memoryKeyForWord,
  memoryScopeForUserId,
  recordWordExposure,
  recordWordRecallFailure,
  recordWordRecallSuccess,
  type WordMemory,
} from '../lib/ebbinghausMemory';
import { hydrateMatch3MemoriesWithCloud, persistWordMemories } from '../lib/memoryCloudSync';
import { THIINGS_100 } from '../data/thiings100';
import { EMOJI_NOUN_CATEGORIES } from '../data/emojiNouns';
import { GamePanel } from './mobile/GamePanel';
import { MobileTabBar } from './mobile/MobileTabBar';
import { LearnedPanel } from './mobile/LearnedPanel';
import { ProfilePanel } from './mobile/ProfilePanel';
import { TIMED_TARGET_COUNTDOWN_SEC } from '../lib/scoring';
import {
  playRecordedWordAndWait,
  registerWordSpeechBgmController,
  speak,
  speakWordAuto,
  stopAllWordSpeech,
  unlockSpeechSynthesis,
  computeDuckedBgmVolume,
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
  nextMoodPalette,
  type MoodPaletteId,
} from '../lib/moodBoard';
import {
  DEFAULT_BGM_VOLUME,
  getBgmUrl,
  loadBgmEnabled,
  saveBgmEnabled,
} from '../lib/bgmPresets';
import { CelebrationBurst } from './mobile/CelebrationBurst';
import { RoundQuizSheet } from './mobile/RoundQuizSheet';
import { SayBlastGame } from './mobile/SayBlastGame';
import { ReviewContinueSheet } from './mobile/ReviewContinueSheet';
import { AdventureFailSheet } from './mobile/AdventureFailSheet';
import { DeadMachineSheet } from './mobile/DeadMachineSheet';
import { LegalConsentModal } from './mobile/LegalConsentModal';
import { categoryDisplayName, useI18n } from '../i18n';
import type { AppTab } from './mobile/types';
import { WordsPanel } from './mobile/WordsPanel';
import {
  analyzeOpeningBoard,
  boostScarceUnfinishedWords,
  createBalancedOpeningGrid,
  ensureTimedTargetPlayable,
  findBestHintMove,
  hasSwapMatchForItem,
  pickSmartRefillItemId,
} from '../lib/gridMatch';
import {
  loadRoundLearnedIds,
  markRoundLearnedItems,
  roundLearnedItemIds,
} from '../lib/roundLearned';
import type { CelebrationCard } from '../i18n/types';
import { pickRandom } from '../lib/pickRandom';
import {
  ADVENTURE_WORDS_PER_SET,
  HITS_PER_WORD_DEFAULT,
  HITS_PER_WORD_REVIEW,
  LATE_BOARD_ASSIST_MOVES,
  MATCH_CLEAR_BONUS_MOVES,
  RESCUE_CONTINUE_MOVES,
  REVIVE_HITS_PER_WORD,
  REVIVE_WRONG_LIMIT,
  adventureTotalSets,
  hitsNeededForMode,
  movesForAdventureLevel,
  reviveCorrectNeeded,
  shouldForceReviewAfterClear,
} from '../lib/adventureRules';
import {
  grantOrBankStamina,
  loadStaminaState,
  saveStaminaState,
  spendStamina,
  tickStamina,
  type StaminaState,
} from '../lib/stamina';
import {
  isCategoryUnlocked,
  isReviewUnlocked,
  loadModeUnlocks,
  saveModeUnlocks,
  type ModeUnlockState,
} from '../lib/modeUnlocks';
import {
  loadPlayerSummary,
  recordAdventureClear,
  recordAdventureFail,
  recordLearningActivity,
  savePlayerSummary,
  type PlayerSummary,
} from '../lib/playerSummary';
import {
  loadAdventureSetHistory,
  pickForcedReviewItems,
  pushAdventureClearedSet,
  type AdventureSetHistory,
} from '../lib/adventureSetHistory';
import type { Cell, ChallengeMode, QuizKind, Tile, WordItem } from '../types/game';
import type { RefillBurst } from '../lib/boardRefill';
import { allBoardCellKeys } from '../lib/boardRefill';
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
  roundFree: boolean;
  rescueUsed: boolean;
  attemptLost: boolean;
};

const GRID = 7;
const ADVENTURE_SNAPSHOT_VERSION = 1;
const ADVENTURE_SNAPSHOT_KEY_PREFIX = 'matchingo-adventure-board-v1:';

function normalizedSnapshotUserId(userId: string | null | undefined): string {
  return userId || 'guest';
}

function adventureSnapshotStorageKey(userId: string | null | undefined): string {
  return `${ADVENTURE_SNAPSHOT_KEY_PREFIX}${normalizedSnapshotUserId(userId)}`;
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

function pickGameItems(pool: WordItem[], count: number) {
  const items = [...pool];
  // simple shuffle
  for (let i = items.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items.slice(0, Math.min(count, items.length));
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
    return items.slice(0, Math.min(count, items.length));
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
  return items.slice(0, Math.min(count, items.length));
}

/** Adventure is a strict unseen-only pool. Learned words never fill a set. */
function pickAdventureItems(
  pool: WordItem[],
  count: number,
  learnedIds: ReadonlySet<string>,
  excludeIds?: ReadonlySet<string>,
): WordItem[] {
  const unseen = pool.filter((item) => !learnedIds.has(item.id));

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

/**
 * Null cleared cells, pack survivors down each column, spawn new tiles at the top.
 * Same gravity model for normal 3-matches and full row/col line clears.
 */
function collapseAndRefill(
  grid: Tile[][],
  clearedKeys: Iterable<string>,
  itemIds: string[],
  preferItemIds?: readonly string[],
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
            itemId: pickSmartRefillItemId(out, r, c, itemIds, preferItemIds),
          };
    }
  }

  return { grid: out, cleared: toClear.size };
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

export const ItemMatchGamePage: React.FC = () => {
  const { locale, t } = useI18n();
  const { user } = useAuth();
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
  const allPool = useMemo<WordItem[]>(() => {
    const emojiItems: WordItem[] = EMOJI_NOUN_CATEGORIES.flatMap((cat) =>
      cat.items.map((it) => ({
        id: `emoji-${cat.id}-${it.id}`,
        word: it.word,
        cn: it.cn,
        emoji: it.emoji,
      })),
    );
    const thiingsItems: WordItem[] = THIINGS_100.map((t) => ({
      id: `thiings-${t.id}`,
      word: t.word,
      imgSrc: t.imgSrc,
    }));
    return [...emojiItems, ...thiingsItems];
  }, []);

  const categoryPools = useMemo(
    () =>
      EMOJI_NOUN_CATEGORIES.map((cat) => ({
        id: cat.id,
        label: cat.label,
        subtitle: cat.subtitle,
        items: cat.items.map<WordItem>((it) => ({
          id: `emoji-${cat.id}-${it.id}`,
          word: it.word,
          cn: it.cn,
          emoji: it.emoji,
        })),
      })),
    [],
  );
  const [moodPaletteId, setMoodPaletteId] = useState<MoodPaletteId>(() =>
    moodPaletteForDay(),
  );
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
    () =>
      THIINGS_100.length
        ? {
            id: 'thiings',
            label: 'Thiings',
            subtitle: 'Image Pack',
            items: THIINGS_100.map<WordItem>((t) => ({
              id: `thiings-${t.id}`,
              word: t.word,
              imgSrc: t.imgSrc,
            })),
          }
        : null,
    [],
  );
  const challengePools = useMemo(
    () => (thiingsPool ? [...categoryPools, thiingsPool] : categoryPools),
    [categoryPools, thiingsPool],
  );
  const [challengeMode, setChallengeMode] = useState<ChallengeMode>('random');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categoryPools[0]?.id ?? 'smileys-emotion',
  );
  const activeCategory = useMemo(
    () => challengePools.find((c) => c.id === selectedCategoryId) ?? challengePools[0],
    [challengePools, selectedCategoryId],
  );

  const memoryScopeRef = useRef(memoryScopeForUserId(user?.uid ?? null));
  const [wordMemory, setWordMemory] = useState<Map<string, WordMemory>>(
    () => hydrateMatch3Memories(user?.uid ?? null).map,
  );
  const [roundLearnedIds, setRoundLearnedIds] = useState<string[]>(() =>
    loadRoundLearnedIds(progressUserId),
  );
  const roundLearnedIdsRef = useRef(roundLearnedIds);
  roundLearnedIdsRef.current = roundLearnedIds;
  const wordMemoryRef = useRef<Map<string, WordMemory>>(wordMemory);
  wordMemoryRef.current = wordMemory;

  useEffect(() => {
    let cancelled = false;
    const uid = user?.uid ?? null;
    const local = hydrateMatch3Memories(uid);
    memoryScopeRef.current = local.scope;
    setWordMemory(local.map);

    void hydrateMatch3MemoriesWithCloud(uid).then(({ map, scope }) => {
      if (!cancelled) {
        memoryScopeRef.current = scope;
        setWordMemory(map);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

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
  const reviewPoolKey = useMemo(
    () => learnedItemIds.slice().sort().join('|'),
    [learnedItemIds],
  );

  const pool = useMemo(() => {
    if (challengeMode === 'review') return reviewPool;
    if (challengeMode === 'mood') return moodBoardPool.items;
    if (challengeMode === 'category') return activeCategory?.items ?? [];
    return adventurePool;
  }, [challengeMode, reviewPool, moodBoardPool, activeCategory, adventurePool]);

  const boardSetupKey = useMemo(() => {
    if (challengeMode === 'review') return `${progressUserId}:review:${reviewPoolKey}`;
    if (challengeMode === 'mood')
      return `${progressUserId}:mood:${moodPaletteId}`;
    if (challengeMode === 'category')
      return `${progressUserId}:category:${selectedCategoryId}`;
    return `${progressUserId}:random`;
  }, [
    challengeMode,
    selectedCategoryId,
    moodPaletteId,
    reviewPoolKey,
    progressUserId,
  ]);

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
  const [reviveAttempt, setReviveAttempt] = useState(0);
  const reviveAttemptRef = useRef(0);
  const [reviveWrongs, setReviveWrongs] = useState(0);
  const [reviveCorrects, setReviveCorrects] = useState(0);
  const reviveWrongsRef = useRef(0);
  const reviveCorrectsRef = useRef(0);
  const [reviveWordHits, setReviveWordHits] = useState<Record<string, number>>({});
  const reviveWordHitsRef = useRef<Record<string, number>>({});
  /** After every 3 adventure clears, inject a mandatory review exam. */
  const [forcedReviewActive, setForcedReviewActive] = useState(false);
  const forcedReviewActiveRef = useRef(false);
  forcedReviewActiveRef.current = forcedReviewActive;
  /** Skip N boardSetupKey effect runs (seeded boards / mode handoffs). */
  const suppressBoardSetupSkipsRef = useRef(0);
  const [deadMachineOpen, setDeadMachineOpen] = useState(false);
  const [reviewContinueOpen, setReviewContinueOpen] = useState(false);
  const [reviewPaused, setReviewPaused] = useState(false);
  const [staminaState, setStaminaState] = useState<StaminaState>(() => loadStaminaState());
  const staminaStateRef = useRef(staminaState);
  staminaStateRef.current = staminaState;
  const [modeUnlocks, setModeUnlocks] = useState<ModeUnlockState>(() =>
    loadModeUnlocks(progressUserId),
  );
  const adventureSetHistoryRef = useRef<AdventureSetHistory>(
    loadAdventureSetHistory(progressUserId),
  );
  const [playerSummary, setPlayerSummary] = useState<PlayerSummary>(() => loadPlayerSummary());
  const playerSummaryRef = useRef(playerSummary);
  playerSummaryRef.current = playerSummary;
  const [movesLeft, setMovesLeft] = useState(() => movesForAdventureLevel(1));
  const movesLeftRef = useRef(movesLeft);
  movesLeftRef.current = movesLeft;
  /** Next adventure board start is free (for example, abandoning the final quiz). */
  const adventureRoundFreeRef = useRef(false);
  /** Charge 1 stamina on the first matching move of this adventure board. */
  const adventureStaminaOwedRef = useRef(false);
  const [adventurePlayable, setAdventurePlayable] = useState(true);
  const adventureFailedAwaitingRetryRef = useRef(false);
  const [failSheetOpen, setFailSheetOpen] = useState(false);
  const [quizKind, setQuizKind] = useState<QuizKind>('connect');
  const [unlockCelebrate, setUnlockCelebrate] = useState<'review' | 'category' | null>(null);
  const [reviveFlash, setReviveFlash] = useState<'success' | 'retry' | 'outOfMoves' | null>(null);

  useEffect(() => {
    const nextLearnedIds = loadRoundLearnedIds(progressUserId);
    roundLearnedIdsRef.current = nextLearnedIds;
    setRoundLearnedIds(nextLearnedIds);
    setModeUnlocks(loadModeUnlocks(progressUserId));
    adventureSetHistoryRef.current = loadAdventureSetHistory(progressUserId);
    setForcedReviewActive(false);
    forcedReviewActiveRef.current = false;
    setReviewPaused(false);
  }, [progressUserId]);

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

  const persistStamina = React.useCallback((next: StaminaState) => {
    setStaminaState(next);
    staminaStateRef.current = next;
    saveStaminaState(next);
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
    setWordMemory((prev) => {
      const next = new Map(prev);
      recordWordRecallFailure(next, item.word, item.cn);
      persistWordMemories(next, memoryScopeRef.current);
      return next;
    });
  }, [itemById]);

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
    }, 15_000);
    return () => window.clearInterval(id);
  }, [persistStamina]);

  useEffect(() => {
    if (challengeMode === 'review' && !isReviewUnlocked(modeUnlocks.adventureClears)) {
      setChallengeMode('random');
    } else if (
      challengeMode === 'category' &&
      !isCategoryUnlocked(modeUnlocks.adventureClears)
    ) {
      setChallengeMode('random');
    }
  }, [challengeMode, modeUnlocks.adventureClears]);

  const [grid, setGrid] = useState<Tile[][]>(() => prepareBoardGrid(itemIds));
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [level, setLevel] = useState(1);
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
    cn?: string;
    emoji?: string;
    imgSrc?: string;
    originCell?: Cell;
  } | null>(null);
  const [ttsAvailable, setTtsAvailable] = useState(true);
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(() => loadBgmEnabled());
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => loadSfxEnabled());
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() =>
    loadHapticsEnabled(),
  );
  const [sayBlastOpen, setSayBlastOpen] = useState(false);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgmNeedsGestureRef = useRef(false);
  const bgmEnabledRef = useRef(bgmEnabled);

  useEffect(() => {
    bgmEnabledRef.current = bgmEnabled;
  }, [bgmEnabled]);

  useEffect(() => {
    registerWordSpeechBgmController({
      duck: () => {
        const a = bgmAudioRef.current;
        if (!a || !bgmEnabledRef.current) return;
        a.volume = computeDuckedBgmVolume(DEFAULT_BGM_VOLUME);
      },
      restore: () => {
        const a = bgmAudioRef.current;
        if (!a) return;
        a.volume = bgmEnabledRef.current ? DEFAULT_BGM_VOLUME : 0;
      },
    });
    return () => registerWordSpeechBgmController(null);
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
  const clearAdventureSnapshot = React.useCallback(() => {
    adventureBoardSnapshotRef.current = null;
    removeAdventureBoardSnapshot(progressUserIdRef.current);
  }, []);

  useEffect(() => {
    snapshotRestoreInFlightRef.current = true;
    const learned = new Set(roundLearnedIdsRef.current);
    const saved = loadAdventureBoardSnapshot(progressUserId);
    if (
      !saved ||
      !validAdventureBoardSnapshot(saved, progressUserId, allPool, learned)
    ) {
      adventureBoardSnapshotRef.current = null;
      if (saved) removeAdventureBoardSnapshot(progressUserId);
      snapshotRestoreInFlightRef.current = false;
      return;
    }

    adventureBoardSnapshotRef.current = saved;
    suppressBoardSetupSkipsRef.current = Math.max(
      suppressBoardSetupSkipsRef.current,
      1,
    );
    setChallengeMode('random');
    setAdventurePlayable(saved.adventurePlayable);
    adventureStaminaOwedRef.current = saved.staminaOwed;
    adventureRoundFreeRef.current = saved.roundFree;
    rescueUsedRef.current = saved.rescueUsed;
    adventureAttemptLostRef.current = saved.attemptLost;
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
    const release = window.setTimeout(() => {
      snapshotRestoreInFlightRef.current = false;
    }, 0);
    return () => window.clearTimeout(release);
  }, [allPool, progressUserId]);
  const rescueSnapshotRef = useRef<{
    grid: Tile[][];
    hitCount: Record<string, number>;
  } | null>(null);
  /** A failed Rescue breaks the Adventure Win Streak even if the +8 continuation clears. */
  const adventureAttemptLostRef = useRef(false);
  const rescueQuizPendingRef = useRef(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizItems, setQuizItems] = useState<WordItem[]>([]);
  const quizItemsRef = useRef(quizItems);
  quizItemsRef.current = quizItems;
  const [roundCelebrate, setRoundCelebrate] = useState(false);
  const [roundCelebrateCard, setRoundCelebrateCard] = useState<CelebrationCard | null>(null);

  useEffect(() => {
    if (snapshotRestoreInFlightRef.current || challengeMode !== 'random') return;
    if (
      quizOpen ||
      roundCelebrate ||
      roundSwitchPendingRef.current ||
      !adventurePlayable ||
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
      roundFree: adventureRoundFreeRef.current,
      rescueUsed: rescueUsedRef.current,
      attemptLost: adventureAttemptLostRef.current,
    };
    adventureBoardSnapshotRef.current = snapshot;
    saveAdventureBoardSnapshot(snapshot);
  }, [
    adventurePlayable,
    challengeMode,
    clearAdventureSnapshot,
    gameItems,
    grid,
    itemHitCount,
    level,
    movesLeft,
    progressUserId,
    quizOpen,
    roundCelebrate,
  ]);

  const openRoundCelebrate = React.useCallback(() => {
    setRoundCelebrateCard(pickRandom(t.celebration.roundCelebrateCards));
    setRoundCelebrate(true);
  }, [t]);
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
  const hintTimerRef = useRef<number | null>(null);
  const [hintMove, setHintMove] = useState<{ a: Cell; b: Cell } | null>(null);
  const ttsUnlockRef = useRef(false);

  /** 首次进入显示服务条款同意；接受后写入 localStorage */
  const [consentOpen, setConsentOpen] = useState(() => !readConsentAccepted());
  const [activeTab, setActiveTab] = useState<AppTab>('game');
  const [boardIntroActive, setBoardIntroActive] = useState(true);
  const [refillBurst, setRefillBurst] = useState<RefillBurst | null>(null);
  const [refillActive, setRefillActive] = useState(false);
  const refillActiveRef = useRef(false);
  const refillDoneResolverRef = useRef<(() => void) | null>(null);
  const cascadeRunningRef = useRef(false);
  const [cascadeBusy, setCascadeBusy] = useState(false);
  const refillKeyRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const tabScrollTopsRef = useRef<Partial<Record<AppTab, number>>>({});
  const isCandyTab = activeTab !== 'game';
  const firstSwapTutorialEligible =
    !consentOpen &&
    !firstTimeGuide.hasCompletedFirstSwapTutorial &&
    modeUnlocks.adventureClears === 0 &&
    challengeMode === 'random' &&
    level === 1 &&
    adventurePlayable &&
    gameItems.length >= ADVENTURE_WORDS_PER_SET;
  const firstSwapTutorialPendingRef = useRef(firstSwapTutorialEligible);
  firstSwapTutorialPendingRef.current = firstSwapTutorialEligible;

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
    const move = findHintMove(grid);
    setFirstSwapTutorialMove(
      move ? { source: move.a, target: move.b } : null,
    );
    setHintMove(null);
    if (hintTimerRef.current) {
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
  }, [firstSwapTutorialEligible, grid]);

  useEffect(() => {
    void syncStatusBarForTab(activeTab);
  }, [activeTab]);

  const handleTabChange = React.useCallback(
    (tab: AppTab) => {
      if (scrollContainerRef.current && activeTab !== 'game') {
        tabScrollTopsRef.current[activeTab] = scrollContainerRef.current.scrollTop;
      }
      if (tab === 'learned') {
        updateFirstTimeGuide((current) =>
          current.stage === 'learned'
            ? { ...current, stage: 'sayAndBlast' }
            : current,
        );
      }
      setActiveTab(tab);
    },
    [activeTab, updateFirstTimeGuide],
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
    setBgmEnabled(enabled);
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
      const timedHunt =
        reviveActiveRef.current || challengeModeRef.current === 'review';
      const targetId = timedHunt ? funTargetId || undefined : undefined;

      // Timed hunt: always keep a one-swap path for the current target.
      if (targetId && !hasSwapMatchForItem(current, targetId)) {
        const copy = current.map((row) => row.map((t) => ({ ...t })));
        ensureTimedTargetPlayable(copy, targetId, itemIds);
        if (hasSwapMatchForItem(copy, targetId) && findMatches(copy).length === 0) {
          return copy;
        }
        const next = prepareBoardGrid(itemIds, targetId);
        emitRefillBurst(current, next, allBoardCellKeys());
        setSelected(null);
        setHintMove(null);
        return next;
      }

      if (findHintMove(current)) return current;
      const next = prepareBoardGrid(itemIds, targetId);
      emitRefillBurst(current, next, allBoardCellKeys());
      setSelected(null);
      setHintMove(null);
      return next;
    },
    [itemIds, funTargetId, emitRefillBurst],
  );

  const clearReviveState = React.useCallback(() => {
    setReviveActive(false);
    reviveActiveRef.current = false;
    setReviveAttempt(0);
    reviveAttemptRef.current = 0;
    setReviveWrongs(0);
    setReviveCorrects(0);
    reviveWrongsRef.current = 0;
    reviveCorrectsRef.current = 0;
    reviveWordHitsRef.current = {};
    setReviveWordHits({});
    if (challengeModeRef.current !== 'review') {
      setFunTargetId('');
    }
  }, []);

  const resetRescueLifecycle = React.useCallback(() => {
    rescueUsedRef.current = false;
    rescueSnapshotRef.current = null;
    adventureAttemptLostRef.current = false;
    rescueQuizPendingRef.current = false;
    adventureFailedAwaitingRetryRef.current = false;
  }, []);

  /** Empty adventure board + dead-machine sheet; clears unpaid board charge. */
  const lockAdventureDead = React.useCallback(() => {
    adventureStaminaOwedRef.current = false;
    adventureRoundFreeRef.current = false;
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
  }, [clearReviveState, resetRescueLifecycle]);

  /** Spend stamina on first move of an adventure board; false → dead-machined. */
  const chargeAdventureStaminaIfNeeded = React.useCallback((): boolean => {
    if (challengeModeRef.current !== 'random' || reviveActiveRef.current) return true;
    if (!adventureStaminaOwedRef.current) return true;
    if (!applySpendStamina(1)) {
      lockAdventureDead();
      return false;
    }
    adventureStaminaOwedRef.current = false;
    return true;
  }, [applySpendStamina, lockAdventureDead]);

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
      const id =
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
      if (id) {
        setGrid((prev) => {
          const copy = prev.map((row) => row.map((t) => ({ ...t })));
          ensureTimedTargetPlayable(copy, id, ids);
          return reshuffleDeadlockedBoard(copy);
        });
      }
      return id;
    },
    [reshuffleDeadlockedBoard],
  );

  const retryAdventureBoard = React.useCallback(
    (items: WordItem[], free: boolean) => {
      if (challengeMode === 'random') {
        if (free) {
          adventureStaminaOwedRef.current = false;
        } else if (tickStamina(staminaStateRef.current).value <= 0) {
          lockAdventureDead();
          return false;
        } else {
          adventureStaminaOwedRef.current = true;
        }
        setAdventurePlayable(true);
        setDeadMachineOpen(false);
      }
      adventureRoundFreeRef.current = false;
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
      resetRescueLifecycle,
      lockAdventureDead,
      level,
    ],
  );

  const recordCurrentAdventureLoss = React.useCallback(() => {
    adventureAttemptLostRef.current = true;
    const unlocks = loadModeUnlocks(progressUserIdRef.current);
    setPlayerSummary(
      recordAdventureFail(playerSummaryRef.current, {
        adventureClears: unlocks.adventureClears,
        masteredCount: masteredEmojiCount(wordMemoryRef.current, allPool),
        reviewUnlocked: isReviewUnlocked(unlocks.adventureClears),
        categoryUnlocked: isCategoryUnlocked(unlocks.adventureClears),
      }),
    );
  }, [allPool]);

  const endAdventureFailed = React.useCallback(() => {
    clearReviveState();
    adventureFailedAwaitingRetryRef.current = true;
    const hasStamina = staminaStateRef.current.value > 0;
    setAdventurePlayable(hasStamina);
    if (hasStamina) {
      setFailSheetOpen(true);
      setDeadMachineOpen(false);
    } else {
      setFailSheetOpen(false);
      setDeadMachineOpen(true);
    }
    recordCurrentAdventureLoss();
  }, [clearReviveState, recordCurrentAdventureLoss]);

  const failReviveAttempt = React.useCallback(() => {
    const snapshot = rescueSnapshotRef.current;
    bumpBoardEpoch();
    clearReviveState();
    recordCurrentAdventureLoss();
    rescueSnapshotRef.current = null;
    roundSwitchPendingRef.current = false;
    setFailSheetOpen(false);
    setDeadMachineOpen(false);
    setAdventurePlayable(true);
    setSelected(null);
    setHintMove(null);
    setWordLink(null);
    setMatchClearCells(null);
    if (snapshot) {
      const restoredGrid = snapshot.grid.map((row) => row.map((tile) => ({ ...tile })));
      setGrid(restoredGrid);
      setItemHitCount({ ...snapshot.hitCount });
    }
    movesLeftRef.current = RESCUE_CONTINUE_MOVES;
    setMovesLeft(RESCUE_CONTINUE_MOVES);
    setReviveFlash('retry');
  }, [
    bumpBoardEpoch,
    clearReviveState,
    recordCurrentAdventureLoss,
  ]);

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
    rescueSnapshotRef.current = {
      grid: adventureGrid.map((row) => row.map((tile) => ({ ...tile }))),
      hitCount: { ...adventureHitCount },
    };
    setReviveFlash('outOfMoves');
    setReviveActive(true);
    reviveActiveRef.current = true;
    reviveAttemptRef.current = 1;
    setReviveAttempt(1);
    setReviveWrongs(0);
    setReviveCorrects(0);
    reviveWrongsRef.current = 0;
    reviveCorrectsRef.current = 0;
    reviveWordHitsRef.current = {};
    setReviveWordHits({});
    setHintMove(null);
    if (hintTimerRef.current) {
      window.clearTimeout(hintTimerRef.current);
      hintTimerRef.current = null;
    }
    armTimedTarget(gameItems, adventureHitCount, undefined, true);
  }, [challengeMode, armTimedTarget, gameItems]);

  // Heal missing revive / review target.
  useEffect(() => {
    const timedHunt = reviveActive || challengeMode === 'review';
    if (!timedHunt) return;
    if (funTargetId && itemById.has(funTargetId)) return;
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
        setQuizItems([...gameItems]);
        openRoundCelebrate();
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
    const newTargetId = pickTimedTargetId(
      gameItems,
      itemHitCount,
      funTargetId,
      reviveActiveRef.current,
      reviveActiveRef.current ? reviveWordHitsRef.current : undefined,
      REVIVE_HITS_PER_WORD,
      hitsNeeded,
    );
    funCountdownRef.current = TIMED_TARGET_COUNTDOWN_SEC;
    setFunCountdown(TIMED_TARGET_COUNTDOWN_SEC);
    if (newTargetId) {
      setGrid((prev) => {
        const copy = prev.map((row) => row.map((t) => ({ ...t })));
        ensureTimedTargetPlayable(copy, newTargetId, itemIds);
        return copy;
      });
      setFunTargetId(newTargetId);
      setFunTargetKey((k) => k + 1);
    } else {
      // No unfinished words left — end the timed hunt.
      setFunTargetId('');
    }
    funTimeoutLockRef.current = false;
  }, [
    funTargetId,
    gameItems,
    itemHitCount,
    itemIds,
    bgmEnabled,
    failReviveAttempt,
    applyTimedTargetMiss,
    openRoundCelebrate,
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
      const targetPool =
        targetMode === 'random'
          ? allPool
          : targetMode === 'review'
            ? reviewPool
            : targetMode === 'mood'
              ? moodBoardPool.items
              : activeCategory?.items ?? [];

      if (targetMode === 'random') {
        const free = adventureRoundFreeRef.current;
        adventureRoundFreeRef.current = false;
        if (free) {
          adventureStaminaOwedRef.current = false;
        } else if (tickStamina(staminaStateRef.current).value <= 0) {
          lockAdventureDead();
          return;
        } else {
          // Preview free until the first matching move.
          adventureStaminaOwedRef.current = true;
        }
        setAdventurePlayable(true);
        setDeadMachineOpen(false);
      }

      const nextItems =
        targetMode === 'random'
          ? pickAdventureItems(
              targetPool,
              ADVENTURE_WORDS_PER_SET,
              new Set(roundLearnedIdsRef.current),
              excludeIds,
            )
          : pickChallengeItems(targetPool, ADVENTURE_WORDS_PER_SET, nextHitCount, wordMemoryRef.current, {
              strategy: targetMode === 'review' ? 'memory' : 'random',
              ...(excludeIds && excludeIds.size > 0 ? { excludeIds } : {}),
            });
      if (nextItems.length < ADVENTURE_WORDS_PER_SET) {
        if (targetMode === 'random') {
          adventureStaminaOwedRef.current = false;
          clearAdventureSnapshot();
          setGameItems([]);
          setGrid(makeGrid([]));
          setItemHitCount({});
        }
        roundSwitchPendingRef.current = false;
        return;
      }
      const nextLevel = advanceLevel ? level + 1 : level;
      if (advanceLevel) setLevel(nextLevel);
      bumpBoardEpoch();
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
      lockAdventureDead,
      level,
      moodBoardPool.items,
      reviewPool,
      clearReviveState,
      resetRescueLifecycle,
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

      const useForcedPool = asForcedExam || modeUnlocks.pendingForcedReview;
      const poolById = new Map(allPool.map((it) => [it.id, it] as const));
      const nextHitCount: Record<string, number> = {};
      const nextItems = useForcedPool
        ? pickForcedReviewItems(
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
        return;
      }
      const targetId = pickTimedTargetId(
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
      setGrid(prepareBoardGrid(nextItems.map((i) => i.id), targetId || undefined));
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
      if (mode === 'mood') {
        updateFirstTimeGuide((current) =>
          current.stage === 'moodBoard'
            ? { ...current, stage: 'completed' }
            : current,
        );
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
        setChallengeMode(mode);
        return;
      }
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
        bumpBoardEpoch();
        suppressBoardSetupSkipsRef.current = Math.max(
          suppressBoardSetupSkipsRef.current,
          1,
        );
        setChallengeMode('random');
        setDeadMachineOpen(false);
        setFailSheetOpen(false);
        setReviewPaused(false);
        setAdventurePlayable(savedAdventure.adventurePlayable);
        adventureStaminaOwedRef.current = savedAdventure.staminaOwed;
        adventureRoundFreeRef.current = savedAdventure.roundFree;
        rescueUsedRef.current = savedAdventure.rescueUsed;
        adventureAttemptLostRef.current = savedAdventure.attemptLost;
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
      if (tickStamina(staminaStateRef.current).value <= 0) {
        setChallengeMode('random');
        lockAdventureDead();
        return;
      }
      setChallengeMode('random');
    },
    [
      adventurePlayable,
      bumpBoardEpoch,
      enterReviewMode,
      gameItems,
      grid,
      itemHitCount,
      level,
      allPool,
      clearAdventureSnapshot,
      lockAdventureDead,
      modeUnlocks.pendingForcedReview,
      updateFirstTimeGuide,
    ],
  );

  const handleQuizComplete = React.useCallback(() => {
    stopAllWordSpeech();
    triggerGameHaptic('majorSuccess');
    setQuizOpen(false);
    const quizItemsSnapshot = quizItemsRef.current;
    const nextLearned = markRoundLearnedItems(
      roundLearnedIds,
      quizItemsSnapshot,
      progressUserIdRef.current,
    );
    roundLearnedIdsRef.current = nextLearned;
    setRoundLearnedIds(nextLearned);

    // Quiz success advances the forgetting curve (board matches only count as exposure).
    setWordMemory((prev) => {
      const next = new Map(prev);
      for (const it of quizItemsSnapshot) {
        recordWordRecallSuccess(next, it.word, it.cn);
      }
      persistWordMemories(next, memoryScopeRef.current);
      wordMemoryRef.current = next;
      return next;
    });

    if (forcedReviewActiveRef.current || challengeMode === 'review') {
      setPlayerSummary(
        recordLearningActivity(playerSummaryRef.current, {
          adventureClears: modeUnlocks.adventureClears,
          masteredCount: masteredEmojiCount(wordMemoryRef.current, allPool),
          reviewUnlocked: isReviewUnlocked(modeUnlocks.adventureClears),
          categoryUnlocked: isCategoryUnlocked(modeUnlocks.adventureClears),
        }),
      );
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
      setReviewContinueOpen(true);
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
      if (prevUnlocks.adventureClears === 0 && adventureClears === 1) {
        updateFirstTimeGuide((current) =>
          current.stage === 'none'
            ? { ...current, stage: 'learned' }
            : current,
        );
      }

      const summaryContext = {
        adventureClears,
        masteredCount: masteredEmojiCount(wordMemoryRef.current, allPool),
        reviewUnlocked: isReviewUnlocked(adventureClears),
        categoryUnlocked: isCategoryUnlocked(adventureClears),
      };
      setPlayerSummary(
        adventureAttemptLostRef.current
          ? recordLearningActivity(playerSummaryRef.current, summaryContext)
          : recordAdventureClear(playerSummaryRef.current, summaryContext),
      );

      if (!prevUnlocks.reviewUnlockSeen && isReviewUnlocked(adventureClears)) {
        nextUnlocks = { ...nextUnlocks, reviewUnlockSeen: true };
        saveModeUnlocks(nextUnlocks, progressUserIdRef.current);
        setModeUnlocks(nextUnlocks);
        setUnlockCelebrate('review');
        return;
      }
      if (!prevUnlocks.categoryUnlockSeen && isCategoryUnlocked(adventureClears)) {
        nextUnlocks = { ...nextUnlocks, categoryUnlockSeen: true };
        saveModeUnlocks(nextUnlocks, progressUserIdRef.current);
        setModeUnlocks(nextUnlocks);
        setUnlockCelebrate('category');
        return;
      }

      if (
        shouldForceReviewAfterClear(adventureClears) &&
        isReviewUnlocked(adventureClears) &&
        reviewPool.length >= ADVENTURE_WORDS_PER_SET
      ) {
        beginForcedReview();
        return;
      }
    }

    if (challengeMode === 'category' || challengeMode === 'mood') {
      setPlayerSummary(
        recordLearningActivity(playerSummaryRef.current, {
          adventureClears: modeUnlocks.adventureClears,
          masteredCount: masteredEmojiCount(wordMemoryRef.current, allPool),
          reviewUnlocked: isReviewUnlocked(modeUnlocks.adventureClears),
          categoryUnlocked: isCategoryUnlocked(modeUnlocks.adventureClears),
        }),
      );
    }

    finishQuizAndAdvance();
  }, [
    roundLearnedIds,
    challengeMode,
    modeUnlocks,
    finishQuizAndAdvance,
    beginForcedReview,
    clearPendingForcedReview,
    reviewPool.length,
    allPool,
    updateFirstTimeGuide,
  ]);

  const handleReviewContinueReview = React.useCallback(() => {
    setReviewContinueOpen(false);
    // Skip the set just finished — pull older / more overdue words next.
    enterReviewMode(false, {
      keepPendingRound: true,
      excludeIds: new Set(gameItems.map((it) => it.id)),
    });
  }, [enterReviewMode, gameItems]);

  const handleReviewContinueAdventure = React.useCallback(() => {
    setReviewContinueOpen(false);
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
    if (tickStamina(staminaStateRef.current).value <= 0) {
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
    setReviewContinueOpen(false);
    setFunTargetId('');
    roundSwitchPendingRef.current = false;
    // Stay on review board, paused — come back later via 继续挑战.
    setReviewPaused(true);
  }, []);

  const handleQuizAbandon = React.useCallback(() => {
    stopAllWordSpeech();
    setQuizOpen(false);
    pendingRoundRef.current = null;
    roundSwitchPendingRef.current = false;
    setRoundCelebrate(false);
    // Restart the same set for free — does not count as learned / clear.
    if (gameItems.length >= ADVENTURE_WORDS_PER_SET) {
      adventureRoundFreeRef.current = true;
      retryAdventureBoard([...gameItems], true);
    }
  }, [gameItems, retryAdventureBoard]);

  const handleRoundCelebrateDone = React.useCallback(() => {
    stopAllWordSpeech();
    popWordSeqRef.current += 1;
    setPopWord(null);
    setRoundCelebrate(false);
    // Bias toward pick (~65%) so the second quiz type shows more often.
    setQuizKind(Math.random() < 0.35 ? 'connect' : 'pick');
    setQuizOpen(true);
  }, []);

  const handleUnlockCelebrateDone = React.useCallback(() => {
    const kind = unlockCelebrate;
    setUnlockCelebrate(null);
    if (
      kind === 'review' &&
      !modeUnlocks.categoryUnlockSeen &&
      isCategoryUnlocked(modeUnlocks.adventureClears)
    ) {
      const marked = { ...modeUnlocks, categoryUnlockSeen: true };
      saveModeUnlocks(marked, progressUserIdRef.current);
      setModeUnlocks(marked);
      setUnlockCelebrate('category');
      return;
    }
    if (
      shouldForceReviewAfterClear(modeUnlocks.adventureClears) &&
      isReviewUnlocked(modeUnlocks.adventureClears) &&
      reviewPool.length >= ADVENTURE_WORDS_PER_SET
    ) {
      beginForcedReview();
      return;
    }
    finishQuizAndAdvance();
  }, [unlockCelebrate, modeUnlocks, finishQuizAndAdvance, beginForcedReview, reviewPool.length]);

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
    const targetId =
      challengeMode === 'review'
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
    setGrid(prepareBoardGrid(gameItems.map((i) => i.id), targetId));
    setBoardIntroActive(true);
  };

  useEffect(() => {
    if (suppressBoardSetupSkipsRef.current > 0) {
      suppressBoardSetupSkipsRef.current -= 1;
      return;
    }
    if (consentOpen) {
      return;
    }
    bumpBoardEpoch();
    clearReviveState();
    resetRescueLifecycle();
    setFailSheetOpen(false);
    setDeadMachineOpen(false);
    adventureRoundFreeRef.current = false;
    if (pool.length < 6) {
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
      return;
    }
    if (challengeMode === 'random') {
      if (tickStamina(staminaStateRef.current).value <= 0) {
        lockAdventureDead();
        return;
      }
      adventureStaminaOwedRef.current = true;
    } else {
      adventureStaminaOwedRef.current = false;
    }
    const nextHitCount: Record<string, number> = {};
    const useForcedPool =
      challengeMode === 'review' &&
      (forcedReviewActiveRef.current ||
        loadModeUnlocks(progressUserIdRef.current).pendingForcedReview);
    const poolById = new Map(allPool.map((it) => [it.id, it] as const));
    const nextItems = useForcedPool
      ? pickForcedReviewItems(
          adventureSetHistoryRef.current,
          poolById,
          ADVENTURE_WORDS_PER_SET,
          pool,
        )
      : challengeMode === 'random'
        ? pickAdventureItems(
            pool,
            ADVENTURE_WORDS_PER_SET,
            new Set(roundLearnedIdsRef.current),
          )
        : pickChallengeItems(pool, ADVENTURE_WORDS_PER_SET, nextHitCount, wordMemoryRef.current, {
            strategy: challengeMode === 'review' ? 'memory' : 'random',
          });
    setSelected(null);
    const clears =
      challengeMode === 'random'
        ? loadModeUnlocks(progressUserIdRef.current).adventureClears
        : 0;
    const cap = Math.max(1, adventureTotalSets(allPool.length));
    setLevel(challengeMode === 'random' ? Math.min(clears + 1, cap) : 1);
    setItemHitCount(nextHitCount);
    setGameItems(nextItems);
    setAdventurePlayable(true);
    if (challengeMode === 'random') {
      const budget = movesForAdventureLevel(1);
      movesLeftRef.current = budget;
      setMovesLeft(budget);
    }
    const targetId =
      challengeMode === 'review'
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
    setGrid(prepareBoardGrid(nextItems.map((i) => i.id), targetId));
    setHintMove(null);
    setBoardIntroActive(true);
  }, [
    boardSetupKey,
    pool.length,
    challengeMode,
    allPool,
    bumpBoardEpoch,
    clearReviveState,
    resetRescueLifecycle,
    lockAdventureDead,
  ]);

  useEffect(() => {
    setTtsAvailable('speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined');
    if ('speechSynthesis' in window) {
      // Warm up voices for Safari/Chrome first-use edge cases.
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    const a = new Audio(getBgmUrl());
    a.loop = true;
    a.preload = 'auto';
    a.volume = bgmEnabled ? DEFAULT_BGM_VOLUME : 0;
    bgmAudioRef.current = a;

    const start = async () => {
      if (!bgmEnabled) return;
      try {
        a.currentTime = 0;
        await a.play();
        bgmNeedsGestureRef.current = false;
      } catch {
        bgmNeedsGestureRef.current = true;
      }
    };

    void start();
    return () => {
      try {
        a.pause();
        a.src = '';
      } catch {
        // ignore
      }
      if (bgmAudioRef.current === a) bgmAudioRef.current = null;
      bgmNeedsGestureRef.current = false;
    };
  }, []);

  useEffect(() => {
    saveBgmEnabled(bgmEnabled);
    const a = bgmAudioRef.current;
    if (!a) return;

    if (!bgmEnabled) {
      a.volume = 0;
      try {
        a.pause();
      } catch {
        // ignore
      }
      return;
    }

    a.volume = DEFAULT_BGM_VOLUME;
    a.play()
      .then(() => {
        bgmNeedsGestureRef.current = false;
      })
      .catch(() => {
        bgmNeedsGestureRef.current = true;
      });
  }, [bgmEnabled]);

  useEffect(() => {
    const pauseIfLeaving = () => {
      const a = bgmAudioRef.current;
      if (!a) return;
      try {
        a.pause();
      } catch {
        // ignore
      }
    };
    const maybeResume = () => {
      if (document.visibilityState !== 'visible') return;
      if (!bgmEnabled) return;
      const a = bgmAudioRef.current;
      if (!a) return;
      a.play().catch(() => {
        bgmNeedsGestureRef.current = true;
      });
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        pauseIfLeaving();
      } else {
        maybeResume();
      }
    };
    const onPageHide = () => pauseIfLeaving();
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', onPageHide);
    };
  }, [bgmEnabled]);

  useEffect(() => {
    if (challengeMode !== 'review') setReviewPaused(false);
  }, [challengeMode]);

  // Timed-hunt countdown pauses for board FX only — word popup is an independent front track.
  const timedHuntActive =
    reviveActive || challengeMode === 'review';
  const funTimerPaused =
    !timedHuntActive ||
    !funTargetId ||
    pool.length < 6 ||
    quizOpen ||
    roundCelebrate ||
    matchClearCells !== null ||
    refillActive ||
    cascadeBusy ||
    boardIntroActive ||
    failSheetOpen ||
    reviveFlash !== null ||
    (challengeMode === 'review' && reviewPaused);

  useEffect(() => {
    funCountdownRef.current = TIMED_TARGET_COUNTDOWN_SEC;
    setFunCountdown(TIMED_TARGET_COUNTDOWN_SEC);
  }, [funTargetKey, timedHuntActive]);

  // Timed hunt: speak the prompt when a new target appears (not again on successful match).
  useEffect(() => {
    if (!timedHuntActive || !funTargetId) return;
    if (challengeMode === 'review' && reviewPaused) return;
    const item = itemById.get(funTargetId);
    if (!item?.word) return;
    stopAllWordSpeech();
    void speakWordAuto(item.word);
    // Only re-announce when the target round changes — not on pause/resume.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- funTargetKey is the intentional trigger
  }, [funTargetKey]);

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
      // Late moves: keep unfinished words plentiful enough to still match.
      if (
        challengeMode === 'random' &&
        !reviveActiveRef.current &&
        movesLeftRef.current <= LATE_BOARD_ASSIST_MOVES
      ) {
        const unfinishedIds = gameItems
          .filter((it) => (projectedHits[it.id] ?? 0) < hitsNeeded)
          .map((it) => it.id);
        if (unfinishedIds.length > 0) {
          const copy = nextGrid.map((row) => row.map((t) => ({ ...t })));
          if (boostScarceUnfinishedWords(copy, unfinishedIds, itemIds, 4)) {
            nextGrid = copy;
          }
        }
      }
      nextGrid = reshuffleDeadlockedBoard(nextGrid);
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
        setReviveWordHits(wordHits);
        const corrects = Object.values(wordHits).reduce((sum, n) => sum + n, 0);
        reviveCorrectsRef.current = corrects;
        setReviveCorrects(corrects);
        const needed = reviveCorrectNeeded(gameItems.length || ADVENTURE_WORDS_PER_SET);
        if (corrects >= needed) {
          succeedRevive();
          return next;
        }
        const newTargetId = pickTimedTargetId(
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
          setGrid((prevGrid) => {
            const copy = prevGrid.map((row) => row.map((t) => ({ ...t })));
            ensureTimedTargetPlayable(copy, newTargetId, itemIds);
            return reshuffleDeadlockedBoard(copy);
          });
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
          setFunTargetId('');
          if (roundSwitchPendingRef.current) return next;
          roundSwitchPendingRef.current = true;
          const prevIds = new Set(gameItems.map((it) => it.id));
          const snapshot = [...gameItems];
          popDoneRef.current.finally(() => {
            pendingRoundRef.current = { hitCount: next, excludeIds: prevIds };
            setQuizItems(snapshot);
            openRoundCelebrate();
          });
          return next;
        }

        // Correct or wrong: always roll a new timed target among unfinished words.
        const newTargetId = pickTimedTargetId(
          gameItems,
          next,
          funTargetId,
          false,
          undefined,
          2,
          hitsNeeded,
        );
        if (newTargetId) {
          setFunTargetId(newTargetId);
          setFunTargetKey((k) => k + 1);
          setGrid((prevGrid) => {
            const copy = prevGrid.map((row) => row.map((t) => ({ ...t })));
            ensureTimedTargetPlayable(copy, newTargetId, itemIds);
            return reshuffleDeadlockedBoard(copy);
          });
        } else {
          setFunTargetId('');
        }
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
          openRoundCelebrate();
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
    cn?: string;
    emoji?: string;
    imgSrc?: string;
    originCell?: Cell;
  }) => {
    popWordSeqRef.current += 1;
    const seq = popWordSeqRef.current;
    setWordMemory((prev) => {
      const next = new Map<string, WordMemory>(prev);
      recordWordExposure(next, payload.word, payload.cn);
      persistWordMemories(next, memoryScopeRef.current);
      return next;
    });
    setPopWord(payload);
    // 单词读完再关弹窗，且弹窗至少出现 1 秒（朗读很短时也会补足到 1 秒）。
    popDoneRef.current = (async () => {
      const startedAt = Date.now();
      const WORD_POP_MIN_MS = 1000;
      const WORD_POP_MAX_MS = 5500;
      let audioOk = false;
      try {
        audioOk = await Promise.race([
          (async () => {
            const recorded = await playRecordedWordAndWait(
              payload.word,
              () => seq === popWordSeqRef.current,
            );
            if (seq !== popWordSeqRef.current) return recorded;
            if (recorded) return true;
            return speak(payload.word);
          })(),
          delay(WORD_POP_MAX_MS).then(() => false),
        ]);
      } catch {
        audioOk = false;
      }
      const elapsed = Date.now() - startedAt;
      if (elapsed < WORD_POP_MIN_MS) await delay(WORD_POP_MIN_MS - elapsed);
      if (seq !== popWordSeqRef.current) return;
      setPopWord(null);
      setTtsAvailable(audioOk);
    })();
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

  const attemptSwap = (movedA: Cell, movedB: Cell) => {
    if (
      pool.length < 6 ||
      quizOpen ||
      roundCelebrate ||
      roundSwitchPendingRef.current ||
      matchClearCells !== null ||
      refillActive ||
      cascadeBusy ||
      cascadeRunningRef.current ||
      failSheetOpen ||
      (challengeMode === 'random' && !adventurePlayable) ||
      (challengeMode === 'review' && reviewPaused)
    ) {
      return;
    }
    const tutorialPair = firstSwapTutorialMoveRef.current;
    const isFirstSwapTutorialSwap =
      firstSwapTutorialPendingRef.current &&
      tutorialPair !== null &&
      sameCellPair(movedA, movedB, tutorialPair);
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

    if (!chargeAdventureStaminaIfNeeded()) {
      setSelected(null);
      return;
    }

    if (isFirstSwapTutorialSwap) {
      firstSwapTutorialResolvingRef.current = true;
      setFirstSwapTutorialResolving(true);
      setFirstSwapTutorialMove(null);
    }

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
      // The taught swap always demonstrates the base one-move cost, even when
      // the balanced opener happened to offer a stronger 4+ clear.
      const moveDelta = isFirstSwapTutorialSwap
        ? -1
        : earnsBonus
          ? MATCH_CLEAR_BONUS_MOVES
          : hasFour
            ? 0
            : -1;
      const nextMoves = movesLeftRef.current + moveDelta;
      movesLeftRef.current = nextMoves;
      setMovesLeft(nextMoves);
    }

    const funWrongMatch =
      (reviveActiveRef.current || challengeMode === 'review') &&
      !!funTargetId &&
      targetItemId !== funTargetId;
    const sfxVolume = resolveSfxVolume(bgmEnabled);

    unlockGameAudio();
    // One strong response only for player-created 4+ / row / cross / T / L clears.
    if (lineClearRuns.length > 0) {
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
            triggerGameHaptic('cascadeWave');
            playMatchClearSfx(sfxVolume, wave.isLine ? 'line' : 'match');
            setMatchClearCells(wave.cells);
            setMatchClearKey((k) => k + 1);
          }

          clearedItemIds.push(...wave.itemIds);

          const clearMs = wave.isLine ? LINE_CLEAR_MS : MATCH_CLEAR_MS;
          await delay(clearMs);
          if (epoch !== boardEpochRef.current || !cascadeRunningRef.current) return;

          const clearedKeys = new Set(wave.cells.map((cell) => `${cell.r}:${cell.c}`));
          const preferUnfinished =
            challengeMode === 'random' &&
            !reviveActiveRef.current &&
            movesLeftRef.current <= LATE_BOARD_ASSIST_MOVES
              ? gameItems
                  .filter((it) => (itemHitCount[it.id] ?? 0) < HITS_PER_WORD_DEFAULT)
                  .map((it) => it.id)
              : undefined;
          const after = collapseAndRefill(
            current,
            clearedKeys,
            itemIds,
            preferUnfinished && preferUnfinished.length > 0
              ? preferUnfinished
              : undefined,
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
        if (isFirstSwapTutorialSwap) completeFirstSwapTutorial();
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
    attemptSwap(selected, { r, c });
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
    attemptSwap(from, to);
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
  const totalEmojiPool = useMemo(
    () => allPool.filter((it) => Boolean(it.emoji)).length,
    [allPool],
  );

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
    savePlayerSummary(next);
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

  /** No stamina — rest: just dismiss the sheet (stay on empty adventure board). */
  const handleDeadMachineRest = React.useCallback(() => {
    setDeadMachineOpen(false);
  }, []);

  const handleGoAdventure = React.useCallback(() => {
    handleChallengeModeChange('random');
  }, [handleChallengeModeChange]);

  const cycleMoodBoard = React.useCallback(() => {
    setMoodPaletteId((current) => nextMoodPalette(current));
  }, []);

  const openSayBlast = React.useCallback(() => {
    updateFirstTimeGuide((current) =>
      current.stage === 'sayAndBlast'
        ? { ...current, stage: 'awaitingSayAndBlastCompletion' }
        : current,
    );
    stopAllWordSpeech();
    bgmAudioRef.current?.pause();
    setSayBlastOpen(true);
  }, [updateFirstTimeGuide]);

  const handleValidSayBlastExperience = React.useCallback(() => {
    updateFirstTimeGuide((current) =>
      current.stage === 'awaitingSayAndBlastCompletion'
        ? { ...current, stage: 'moodBoard' }
        : current,
    );
  }, [updateFirstTimeGuide]);

  const exitSayBlast = React.useCallback(() => {
    setSayBlastOpen(false);
    window.setTimeout(() => {
      const audio = bgmAudioRef.current;
      if (!audio || !bgmEnabledRef.current) return;
      void audio.play().then(
        () => {
          bgmNeedsGestureRef.current = false;
        },
        () => {
          bgmNeedsGestureRef.current = true;
        },
      );
    }, 280);
  }, []);

  const rewardSayBlastStamina = React.useCallback((): 'granted' | 'banked' => {
    const reward = grantOrBankStamina(staminaStateRef.current, 1);
    persistStamina(reward.state);
    return reward.outcome;
  }, [persistStamina]);

  const learnedGuideEligible =
    firstTimeGuide.stage === 'learned' &&
    activeTab === 'game' &&
    !consentOpen &&
    !boardIntroActive &&
    !quizOpen &&
    !roundCelebrate &&
    unlockCelebrate === null &&
    !sayBlastOpen &&
    !failSheetOpen &&
    !deadMachineOpen &&
    !reviewContinueOpen &&
    reviveFlash === null &&
    !firstSwapTutorialEligible &&
    !firstSwapTutorialResolving;
  const modeFeatureGuideTarget =
    activeTab === 'game' &&
    !consentOpen &&
    !sayBlastOpen &&
    !quizOpen &&
    !roundCelebrate &&
    unlockCelebrate === null &&
    (firstTimeGuide.stage === 'sayAndBlast' ||
      firstTimeGuide.stage === 'moodBoard')
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
        if (bgmEnabled && bgmNeedsGestureRef.current && bgmAudioRef.current) {
          bgmAudioRef.current.play().then(
            () => {
              bgmNeedsGestureRef.current = false;
            },
            () => {
              bgmNeedsGestureRef.current = true;
            },
          );
        }
      }}
    >
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
            stamina={staminaState.value}
            staminaBanked={staminaState.bankedRewards}
            canPlay={canPlay}
            playBlockedReason={playBlockedReason === 'stamina' ? 'stamina' : null}
            onGoReview={handleGoReview}
            onGoAdventure={handleGoAdventure}
            reviewAvailable={
              reviewUnlocked && reviewPool.length >= ADVENTURE_WORDS_PER_SET
            }
            pendingForcedReview={modeUnlocks.pendingForcedReview}
            onResumeForcedReview={resumeForcedReview}
            reviewPaused={reviewPaused}
            onToggleReviewPause={() => setReviewPaused((p) => !p)}
            moodBoardActive={challengeMode === 'mood'}
            onCycleMoodBoard={cycleMoodBoard}
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
              reviewPaused ||
              (firstSwapTutorialEligible &&
                (firstSwapTutorialResolving || !firstSwapTutorialMove))
            }
            boardIntroActive={boardIntroActive}
            onBoardIntroComplete={() => setBoardIntroActive(false)}
            refillBurst={refillBurst}
            onRefillActiveChange={handleRefillActiveChange}
            wordLink={wordLink}
            onWordLinkDone={() => setWordLink(null)}
            onCellClick={clickCell}
            onSwapCells={swapCells}
            onChallengeModeChange={handleChallengeModeChange}
            onOpenSayBlast={openSayBlast}
            challengePools={challengePools}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={setSelectedCategoryId}
            onShuffleWords={() =>
              startNextRound(itemHitCount, new Set(gameItems.map((it) => it.id)))
            }
            reviewUnlocked={reviewUnlocked}
            categoryUnlocked={categoryUnlocked}
            firstSwapTutorialMove={
              firstSwapTutorialEligible && !firstSwapTutorialResolving
                ? firstSwapTutorialMove
                : null
            }
            featureGuideTarget={modeFeatureGuideTarget}
            featureGuideModePickerPlayCount={
              modeFeatureGuideTarget === 'sayAndBlast'
                ? firstTimeGuide.promptCounts.sayAndBlastModePicker
                : modeFeatureGuideTarget === 'moodBoard'
                  ? firstTimeGuide.promptCounts.moodBoardModePicker
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
            totalEmojiPool={totalEmojiPool}
            itemById={itemById}
            allPool={allPool}
            canGoReview={reviewUnlocked && reviewPool.length >= ADVENTURE_WORDS_PER_SET}
            onGoReview={handleGoReview}
          />
        )}
        {activeTab === 'words' && <WordsPanel />}
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
          onExit={exitSayBlast}
          onRewardStamina={rewardSayBlastStamina}
          onValidExperience={handleValidSayBlastExperience}
        />
      )}

      <CelebrationBurst
        show={roundCelebrate}
        title={roundCelebrateCard?.title}
        subtitle={roundCelebrateCard?.subtitle}
        emoji="🎉"
        durationMs={1800}
        onDone={handleRoundCelebrateDone}
      />

      <CelebrationBurst
        show={unlockCelebrate === 'review'}
        title={t.celebration.unlockReviewTitle}
        subtitle={t.celebration.unlockReviewSubtitle}
        emoji="⭐"
        durationMs={2200}
        onDone={handleUnlockCelebrateDone}
      />

      <CelebrationBurst
        show={unlockCelebrate === 'category'}
        title={t.celebration.unlockCategoryTitle}
        subtitle={t.celebration.unlockCategorySubtitle}
        emoji="🧩"
        durationMs={2200}
        onDone={handleUnlockCelebrateDone}
      />

      <CelebrationBurst
        show={reviveFlash === 'outOfMoves'}
        title={t.adventure.outOfMovesTitle}
        subtitle={t.adventure.outOfMovesSubtitle}
        emoji="⏱️"
        durationMs={1400}
        className="candy-celebration-overlay-no-dim"
        onDone={() => setReviveFlash(null)}
      />

      <CelebrationBurst
        show={reviveFlash === 'retry'}
        title={t.adventure.reviveRetryTitle}
        subtitle={t.adventure.reviveRetrySubtitle}
        emoji="✨"
        durationMs={1400}
        className="candy-celebration-overlay-no-dim"
        onDone={() => {
          setReviveFlash(null);
        }}
      />

      <CelebrationBurst
        show={reviveFlash === 'success'}
        title={t.adventure.reviveSuccessTitle}
        subtitle={t.adventure.reviveSuccessSubtitle}
        emoji="💖"
        durationMs={900}
        className="candy-celebration-overlay-no-dim"
        onDone={() => {
          setReviveFlash(null);
          if (!rescueQuizPendingRef.current) return;
          rescueQuizPendingRef.current = false;
          setQuizKind(Math.random() < 0.35 ? 'connect' : 'pick');
          setQuizOpen(true);
        }}
      />

      <RoundQuizSheet
        open={quizOpen}
        items={quizItems}
        distractorPool={allPool}
        celebrateKind={
          challengeMode === 'review' || forcedReviewActive ? 'review' : 'learned'
        }
        quizKind={quizKind}
        congratsGained={quizItems.length}
        onComplete={handleQuizComplete}
        onAbandon={handleQuizAbandon}
      />

      <ReviewContinueSheet
        open={reviewContinueOpen}
        canContinueReview={reviewPool.length >= ADVENTURE_WORDS_PER_SET}
        canGoAdventure={staminaState.value > 0}
        onContinueReview={handleReviewContinueReview}
        onGoAdventure={handleReviewContinueAdventure}
        onRest={handleReviewContinueRest}
      />

      <AdventureFailSheet
        open={failSheetOpen}
        canRetry={staminaState.value > 0}
        onRetry={handleFailRetry}
        onClose={() => setFailSheetOpen(false)}
      />

      <DeadMachineSheet
        open={deadMachineOpen}
        canGoReview={reviewUnlocked && reviewPool.length >= ADVENTURE_WORDS_PER_SET}
        onGoReview={handleGoReview}
        onClose={handleDeadMachineRest}
      />

      <LegalConsentModal open={consentOpen} onAccept={acceptConsent} />

    </div>
  );
};
