import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { syncStatusBarForTab } from '../lib/capacitorInit';
import { useAuth } from '../auth/AuthProvider';
import {
  hydrateMatch3Memories,
  isDue,
  memoryKeyForWord,
  memoryScopeForUserId,
  recordWordExposure,
  type WordMemory,
} from '../lib/ebbinghausMemory';
import { hydrateMatch3MemoriesWithCloud, persistWordMemories } from '../lib/memoryCloudSync';
import { THIINGS_100 } from '../data/thiings100';
import { EMOJI_NOUN_CATEGORIES } from '../data/emojiNouns';
import { GamePanel } from './mobile/GamePanel';
import { MobileTabBar } from './mobile/MobileTabBar';
import { LearnedPanel } from './mobile/LearnedPanel';
import { ProfilePanel } from './mobile/ProfilePanel';
import {
  applyScoreDelta,
  FUN_COUNTDOWN_SEC,
  SCORE_EXTRA_MATCH_BONUS,
  SCORE_FUN_CORRECT,
  SCORE_FUN_WRONG,
  SCORE_MATCH3_PER_CLEAR,
} from '../lib/scoring';
import type { ScorePop } from './mobile/ScoreHud';
import {
  playRecordedWordAndWait,
  registerWordSpeechBgmController,
  speak,
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
  DEFAULT_BGM_VOLUME,
  getBgmUrl,
  loadBgmEnabled,
  saveBgmEnabled,
} from '../lib/bgmPresets';
import { CelebrationBurst } from './mobile/CelebrationBurst';
import { RoundQuizSheet } from './mobile/RoundQuizSheet';
import { categoryDisplayName, useI18n } from '../i18n';
import { tabForOnboardingTarget, type AppTab, type OnboardingTarget } from './mobile/types';
import { WordsPanel } from './mobile/WordsPanel';
import {
  ensureFunTargetPlayable,
  findBestHintMove,
  pickSmartRefillItemId,
  seedNearFourMatchOpportunities,
} from '../lib/gridMatch';
import {
  loadRoundLearnedIds,
  markRoundLearnedItems,
} from '../lib/roundLearned';
import type { Cell, ChallengeMode, Tile, WordItem } from '../types/game';
import type { RefillBurst } from '../lib/boardRefill';

const GRID = 7;
const SCORE_POP_MS = 1050;
const MATCH_CLEAR_MS = 500;
const LINE_CLEAR_MS = 620;

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
   * `memory`：复习模式，按艾宾浩斯到期/下次复习时间优先（原逻辑）。
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
    const aMem = memory?.get(memoryKeyForWord(a.word));
    const bMem = memory?.get(memoryKeyForWord(b.word));
    const aDue = aMem ? isDue(aMem, now) : false;
    const bDue = bMem ? isDue(bMem, now) : false;
    if (aDue !== bDue) return (bDue ? 1 : 0) - (aDue ? 1 : 0);
    const aNext = aMem?.nextReviewAt ?? Number.MAX_SAFE_INTEGER;
    const bNext = bMem?.nextReviewAt ?? Number.MAX_SAFE_INTEGER;
    if (aNext !== bNext) return aNext - bNext;
    const hitDiff = (hitCount[a.id] ?? 0) - (hitCount[b.id] ?? 0);
    if (hitDiff !== 0) return hitDiff;
    return Math.random() - 0.5;
  });
  return items.slice(0, Math.min(count, items.length));
}

function makeGrid(itemIds: string[]): Tile[][] {
  if (itemIds.length === 0) {
    return Array.from({ length: GRID }, () =>
      Array.from({ length: GRID }, () => ({ id: makeTileId(), itemId: '' })),
    );
  }
  const grid: Tile[][] = Array.from({ length: GRID }, () =>
    Array.from({ length: GRID }, () => ({ id: makeTileId(), itemId: itemIds[randInt(itemIds.length)] })),
  );
  // avoid obvious starting matches (best-effort)
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      const left1 = c - 1 >= 0 ? grid[r][c - 1]?.itemId : null;
      const left2 = c - 2 >= 0 ? grid[r][c - 2]?.itemId : null;
      const up1 = r - 1 >= 0 ? grid[r - 1][c]?.itemId : null;
      const up2 = r - 2 >= 0 ? grid[r - 2][c]?.itemId : null;
      let itemId = grid[r][c].itemId;
      let guard = 0;
      while (
        guard < 12 &&
        ((left1 && left2 && itemId === left1 && itemId === left2) || (up1 && up2 && itemId === up1 && itemId === up2))
      ) {
        itemId = itemIds[randInt(itemIds.length)];
        guard++;
      }
      grid[r][c] = { ...grid[r][c], itemId };
    }
  }
  seedNearFourMatchOpportunities(grid, itemIds, 5);
  return grid;
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

function pickItemIdForCell(grid: Tile[][], r: number, c: number, itemIds: string[]): string {
  if (itemIds.length === 0) return '';
  let itemId = itemIds[randInt(itemIds.length)];
  let guard = 0;
  while (guard < 12) {
    const left1 = c - 1 >= 0 ? grid[r][c - 1]?.itemId : null;
    const left2 = c - 2 >= 0 ? grid[r][c - 2]?.itemId : null;
    const up1 = r - 1 >= 0 ? grid[r - 1][c]?.itemId : null;
    const up2 = r - 2 >= 0 ? grid[r - 2][c]?.itemId : null;
    const triple =
      (left1 && left2 && itemId === left1 && itemId === left2) ||
      (up1 && up2 && itemId === up1 && itemId === up2);
    if (!triple) break;
    itemId = itemIds[randInt(itemIds.length)];
    guard++;
  }
  return itemId;
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

function applyLineBonuses(grid: Tile[][], runs: LineRun[], itemIds: string[]): Tile[][] {
  if (runs.length === 0 || itemIds.length === 0) return grid;
  const next = grid.map((row) => row.map((t) => ({ ...t })));
  const refreshRows = new Set<number>();
  const refreshCols = new Set<number>();
  for (const run of runs) {
    if (run.orientation === 'row') refreshRows.add(run.index);
    else refreshCols.add(run.index);
  }
  for (const r of refreshRows) {
    for (let c = 0; c < GRID; c++) {
      next[r][c] = { id: makeTileId(), itemId: pickItemIdForCell(next, r, c, itemIds) };
    }
  }
  for (const c of refreshCols) {
    for (let r = 0; r < GRID; r++) {
      if (refreshRows.has(r)) continue;
      next[r][c] = { id: makeTileId(), itemId: pickItemIdForCell(next, r, c, itemIds) };
    }
  }
  return next;
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

function findHintMove(grid: Tile[][]): { a: Cell; b: Cell } | null {
  return findBestHintMove(grid);
}

function applyMatches(grid: Tile[][], matches: Match[], itemIds: string[]): { grid: Tile[][]; cleared: number } {
  const toClear = new Set<string>();
  for (const m of matches) for (const cell of m.cells) toClear.add(`${cell.r}:${cell.c}`);
  const next: (Tile | null)[][] = grid.map((row) => row.map((t) => t));
  for (const key of toClear) {
    const [rs, cs] = key.split(':');
    const r = Number(rs);
    const c = Number(cs);
    next[r][c] = null;
  }

  // drop + refill
  const out: Tile[][] = Array.from({ length: GRID }, () => Array.from({ length: GRID }, () => ({ id: '', itemId: '' })));
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
        : { id: makeTileId(), itemId: pickSmartRefillItemId(out, r, c, itemIds) };
    }
  }

  return { grid: out, cleared: toClear.size };
}

const ONBOARDING_SEEN_KEY = 'smellycat-match3-onboarding-seen';

const ONBOARDING_TARGETS: OnboardingTarget[] = [
  'grid',
  'modesButtons',
  'profile',
  'learned',
  'emojiIndex',
];

function prepareBoardGrid(itemIds: string[], funTargetId?: string): Tile[][] {
  let grid = makeGrid(itemIds);
  // Remake if seeding left any 3+ run (best-effort makeGrid can still fail with few types).
  for (let attempt = 0; attempt < 8 && findMatches(grid).length > 0; attempt++) {
    grid = makeGrid(itemIds);
  }
  if (funTargetId) ensureFunTargetPlayable(grid, funTargetId, itemIds);
  return grid;
}

function pickFunTargetId(
  items: WordItem[],
  hitCount: Record<string, number>,
  excludeId?: string,
): string {
  if (items.length === 0) return '';
  let pool = items.filter((it) => (hitCount[it.id] ?? 0) < 3);
  if (excludeId && pool.length > 1) {
    const narrowed = pool.filter((it) => it.id !== excludeId);
    if (narrowed.length > 0) pool = narrowed;
  }
  if (pool.length === 0) return '';
  return pool[randInt(pool.length)].id;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function readOnboardingSeen(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function writeOnboardingSeen() {
  try {
    localStorage.setItem(ONBOARDING_SEEN_KEY, '1');
  } catch {
    // ignore
  }
}

type SpotlightRect = { x: number; y: number; w: number; h: number };

function safeRect(el: HTMLElement | null): SpotlightRect | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (!Number.isFinite(r.left) || !Number.isFinite(r.top) || r.width <= 0 || r.height <= 0) return null;
  return { x: r.left, y: r.top, w: r.width, h: r.height };
}

export const ItemMatchGamePage: React.FC = () => {
  const { locale, t } = useI18n();
  const { user } = useAuth();
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
  const challengePools = useMemo(() => (thiingsPool ? [...categoryPools, thiingsPool] : categoryPools), [categoryPools, thiingsPool]);
  const [challengeMode, setChallengeMode] = useState<ChallengeMode>('random');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(challengePools[0]?.id ?? 'smileys-emotion');
  const activeCategory = useMemo(
    () => challengePools.find((c) => c.id === selectedCategoryId) ?? challengePools[0],
    [challengePools, selectedCategoryId],
  );

  const memoryScopeRef = useRef(memoryScopeForUserId(user?.uid ?? null));
  const [wordMemory, setWordMemory] = useState<Map<string, WordMemory>>(
    () => hydrateMatch3Memories(user?.uid ?? null).map,
  );
  const [roundLearnedIds, setRoundLearnedIds] = useState<string[]>(() => loadRoundLearnedIds());
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

  /** 曾在随机/分类模式中出现过（有记忆存档）的词，用于复习模式 */
  const reviewPoolKey = useMemo(() => {
    const ids: string[] = [];
    for (const it of allPool) {
      if (wordMemory.has(memoryKeyForWord(it.word))) ids.push(it.id);
    }
    return ids.sort().join('|');
  }, [allPool, wordMemory]);

  const reviewPool = useMemo(
    () => allPool.filter((it) => wordMemory.has(memoryKeyForWord(it.word))),
    [allPool, reviewPoolKey],
  );

  const pool = useMemo(() => {
    if (challengeMode === 'review') return reviewPool;
    if (challengeMode === 'category') return activeCategory?.items ?? [];
    return allPool;
  }, [challengeMode, reviewPool, activeCategory, allPool]);

  const boardSetupKey = useMemo(() => {
    if (challengeMode === 'review') return `review:${reviewPoolKey}`;
    if (challengeMode === 'category') return `category:${selectedCategoryId}`;
    if (challengeMode === 'fun') return 'fun';
    return 'random';
  }, [challengeMode, selectedCategoryId, reviewPoolKey]);

  const [itemHitCount, setItemHitCount] = useState<Record<string, number>>({});
  const [gameItems, setGameItems] = useState<WordItem[]>(() =>
    pickChallengeItems(pool, 6, {}, hydrateMatch3Memories(null).map, { strategy: 'random' }),
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
  const [funCountdown, setFunCountdown] = useState(FUN_COUNTDOWN_SEC);
  const funCountdownRef = useRef(FUN_COUNTDOWN_SEC);
  const funTargetItem = useMemo(() => {
    if (challengeMode !== 'fun' || !funTargetId) return null;
    return itemById.get(funTargetId) ?? null;
  }, [challengeMode, funTargetId, itemById]);

  const syncFunTarget = React.useCallback(
    (items: WordItem[], hitCount: Record<string, number>, excludeId?: string): string => {
      if (challengeMode !== 'fun') {
        setFunTargetId('');
        return '';
      }
      const id = pickFunTargetId(items, hitCount, excludeId);
      setFunTargetId(id);
      setFunTargetKey((k) => k + 1);
      return id;
    },
    [challengeMode],
  );

  const [grid, setGrid] = useState<Tile[][]>(() => makeGrid(itemIds));
  const [selected, setSelected] = useState<{ r: number; c: number } | null>(null);
  const [score, setScore] = useState(0);
  const [scorePops, setScorePops] = useState<ScorePop[]>([]);
  const scorePopIdRef = useRef(0);
  const [level, setLevel] = useState(1);
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
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizItems, setQuizItems] = useState<WordItem[]>([]);
  const quizItemsRef = useRef(quizItems);
  quizItemsRef.current = quizItems;
  const [roundCelebrate, setRoundCelebrate] = useState(false);
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

  /** 首次进入显示；关闭后写入 localStorage，仍可用「使用引导」再次打开 */
  const [onboardingOpen, setOnboardingOpen] = useState(() => !readOnboardingSeen());
  const [onboardingStep, setOnboardingStep] = useState(0);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const modesButtonsRef = useRef<HTMLButtonElement | null>(null);
  const profileAreaRef = useRef<HTMLDivElement | null>(null);
  const learnedAreaRef = useRef<HTMLDivElement | null>(null);
  const emojiIndexAreaRef = useRef<HTMLDivElement | null>(null);
  const [spotRect, setSpotRect] = useState<SpotlightRect | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>('game');
  const [boardIntroActive, setBoardIntroActive] = useState(true);
  const [refillBurst, setRefillBurst] = useState<RefillBurst | null>(null);
  const [refillActive, setRefillActive] = useState(false);
  const refillKeyRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const tabScrollTopsRef = useRef<Partial<Record<AppTab, number>>>({});
  const isCandyTab = activeTab !== 'game';

  useEffect(() => {
    void syncStatusBarForTab(activeTab);
  }, [activeTab]);

  const changeScore = React.useCallback((delta: number) => {
    if (delta === 0) return;
    scorePopIdRef.current += 1;
    const id = scorePopIdRef.current;
    setScorePops((prev) => [...prev, { id, delta }]);
    setScore((s) => (delta > 0 ? s + delta : applyScoreDelta(s, delta)));
    window.setTimeout(() => {
      setScorePops((prev) => prev.filter((p) => p.id !== id));
    }, SCORE_POP_MS);
  }, []);

  const resetScore = React.useCallback(() => {
    setScore(0);
    setScorePops([]);
  }, []);

  const handleTabChange = React.useCallback(
    (tab: AppTab) => {
      if (scrollContainerRef.current && activeTab !== 'game') {
        tabScrollTopsRef.current[activeTab] = scrollContainerRef.current.scrollTop;
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

  const dismissOnboarding = React.useCallback(() => {
    setOnboardingOpen(false);
    writeOnboardingSeen();
  }, []);

  const openOnboarding = React.useCallback(() => {
    setOnboardingStep(0);
    setOnboardingOpen(true);
  }, []);

  useEffect(() => {
    if (!onboardingOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismissOnboarding();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onboardingOpen, dismissOnboarding]);

  useLayoutEffect(() => {
    if (!onboardingOpen) return;
    const stepTarget = ONBOARDING_TARGETS[onboardingStep];
    if (!stepTarget) return;

    const neededTab = tabForOnboardingTarget(stepTarget);
    if (activeTab !== neededTab) {
      setActiveTab(neededTab);
      return;
    }

    const getEl = (): HTMLElement | null => {
      if (stepTarget === 'grid') return gridRef.current;
      if (stepTarget === 'modesButtons') return modesButtonsRef.current;
      if (stepTarget === 'profile') return profileAreaRef.current;
      if (stepTarget === 'learned') return learnedAreaRef.current;
      if (stepTarget === 'emojiIndex') return emojiIndexAreaRef.current;
      return null;
    };

    const getScroller = (): HTMLElement | null => {
      if (stepTarget === 'modesButtons' || stepTarget === 'grid') return null;
      return scrollContainerRef.current;
    };

    const el = getEl();
    const scroller = getScroller();

    const scrollToTarget = () => {
      if (!el || !scroller) return;
      const elRect = el.getBoundingClientRect();
      const scRect = scroller.getBoundingClientRect();
      const nextTop = scroller.scrollTop + (elRect.top - scRect.top) - 16;
      scroller.scrollTop = Math.max(0, nextTop);
    };

    scrollToTarget();
    requestAnimationFrame(scrollToTarget);

    const update = () => setSpotRect(safeRect(getEl()));
    update();
    requestAnimationFrame(update);

    const onResize = () => update();
    window.addEventListener('resize', onResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && el) {
      ro = new ResizeObserver(onResize);
      ro.observe(el);
    }

    return () => {
      window.removeEventListener('resize', onResize);
      if (ro) ro.disconnect();
    };
  }, [onboardingOpen, onboardingStep, activeTab]);

  const handleBgmEnabledChange = (enabled: boolean) => {
    setBgmEnabled(enabled);
  };

  const handleSfxEnabledChange = (enabled: boolean) => {
    setSfxEnabled(enabled);
    saveSfxEnabled(enabled);
  };

  const cancelPendingBoardWork = React.useCallback(() => {
    if (clearTimerRef.current) {
      window.clearTimeout(clearTimerRef.current);
      clearTimerRef.current = null;
    }
    setMatchClearCells(null);
    stopAllWordSpeech();
    popWordSeqRef.current += 1;
    setPopWord(null);
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

  const handleFunTimeout = React.useCallback(() => {
    if (challengeMode !== 'fun' || !funTargetId) return;

    const sfxVolume = resolveSfxVolume(bgmEnabled);
    unlockGameAudio();
    playWrongSfx(sfxVolume);
    changeScore(SCORE_FUN_WRONG);

    const newTargetId = pickFunTargetId(gameItems, itemHitCount, funTargetId);
    if (!newTargetId) return;

    setGrid((prev) => {
      const copy = prev.map((row) => row.map((t) => ({ ...t })));
      ensureFunTargetPlayable(copy, newTargetId, itemIds);
      return copy;
    });
    setFunTargetId(newTargetId);
    setFunTargetKey((k) => k + 1);
  }, [challengeMode, funTargetId, gameItems, itemHitCount, itemIds, bgmEnabled, changeScore]);

  const startNextRound = React.useCallback(
    (nextHitCount: Record<string, number>, excludeIds?: Set<string>, advanceLevel = false) => {
      const nextItems = pickChallengeItems(pool, 6, nextHitCount, wordMemoryRef.current, {
        strategy: challengeMode === 'review' ? 'memory' : 'random',
        ...(excludeIds && excludeIds.size > 0 ? { excludeIds } : {}),
      });
      if (nextItems.length < 6) return;
      if (advanceLevel) setLevel((l) => l + 1);
      bumpBoardEpoch();
      setRoundCelebrate(false);
      setGameItems(nextItems);
      roundSwitchPendingRef.current = false;
      setSelected(null);
      setPopWord(null);
      setHintMove(null);
      const targetId = syncFunTarget(nextItems, nextHitCount);
      setGrid(prepareBoardGrid(nextItems.map((i) => i.id), targetId || undefined));
    },
    [pool, challengeMode, bumpBoardEpoch, syncFunTarget],
  );

  const handleQuizComplete = React.useCallback(() => {
    stopAllWordSpeech();
    setQuizOpen(false);
    setRoundLearnedIds((prev) => markRoundLearnedItems(prev, quizItemsRef.current));
    const pending = pendingRoundRef.current;
    pendingRoundRef.current = null;
    if (pending) {
      startNextRound(pending.hitCount, pending.excludeIds, true);
    } else {
      roundSwitchPendingRef.current = false;
    }
  }, [startNextRound]);

  const handleRoundCelebrateDone = React.useCallback(() => {
    stopAllWordSpeech();
    popWordSeqRef.current += 1;
    setPopWord(null);
    setRoundCelebrate(false);
    setQuizOpen(true);
  }, []);

  const reset = () => {
    bumpBoardEpoch();
    if (pool.length < 6) {
      setSelected(null);
      resetScore();
      setLevel(1);
      setItemHitCount({});
      setGameItems([]);
      setGrid(makeGrid([]));
      setFunTargetId('');
      setHintMove(null);
      setWordLink(null);
      return;
    }
    const nextHitCount: Record<string, number> = {};
    const nextItems = pickChallengeItems(pool, 6, nextHitCount, wordMemoryRef.current, {
      strategy: challengeMode === 'review' ? 'memory' : 'random',
    });
    setSelected(null);
    resetScore();
    setLevel(1);
    setItemHitCount(nextHitCount);
    setGameItems(nextItems);
    const targetId = syncFunTarget(nextItems, nextHitCount);
    setGrid(prepareBoardGrid(nextItems.map((i) => i.id), targetId || undefined));
    setHintMove(null);
    setWordLink(null);
    setQuizOpen(false);
    pendingRoundRef.current = null;
    roundSwitchPendingRef.current = false;
    setRoundCelebrate(false);
  };

  useEffect(() => {
    bumpBoardEpoch();
    if (pool.length < 6) {
      setSelected(null);
      resetScore();
      setLevel(1);
      setItemHitCount({});
      setGameItems([]);
      setGrid(makeGrid([]));
      setFunTargetId('');
      setHintMove(null);
      setQuizOpen(false);
      pendingRoundRef.current = null;
      roundSwitchPendingRef.current = false;
      setRoundCelebrate(false);
      return;
    }
    const nextHitCount: Record<string, number> = {};
    const nextItems = pickChallengeItems(pool, 6, nextHitCount, wordMemoryRef.current, {
      strategy: challengeMode === 'review' ? 'memory' : 'random',
    });
    setSelected(null);
    resetScore();
    setLevel(1);
    setItemHitCount(nextHitCount);
    setGameItems(nextItems);
    const targetId = syncFunTarget(nextItems, nextHitCount);
    setGrid(prepareBoardGrid(nextItems.map((i) => i.id), targetId || undefined));
    setHintMove(null);
  }, [boardSetupKey, pool.length, challengeMode, resetScore, bumpBoardEpoch, syncFunTarget]);

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

  const funTimerPaused =
    challengeMode !== 'fun' ||
    !funTargetId ||
    pool.length < 6 ||
    quizOpen ||
    roundCelebrate ||
    matchClearCells !== null ||
    refillActive ||
    popWord !== null;

  useEffect(() => {
    funCountdownRef.current = FUN_COUNTDOWN_SEC;
    setFunCountdown(FUN_COUNTDOWN_SEC);
  }, [funTargetKey, challengeMode]);

  useEffect(() => {
    if (funTimerPaused) return;

    const id = window.setInterval(() => {
      if (funCountdownRef.current <= 0) return;
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
      if (challengeMode === 'fun') return;

      hintTimerRef.current = window.setTimeout(() => {
        const move = findHintMove(nextGrid ?? grid);
        setHintMove(move);
      }, 8000);
    },
    [grid, challengeMode],
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
  }, [grid, restartHintTimer]);

  const applyResolvedMatch = (
    resolved: { grid: Tile[][]; clearedItemIds: string[] },
    targetItemId: string,
  ) => {
    setGrid(resolved.grid);
    setMatchClearCells(null);
    restartHintTimer(resolved.grid);
    setItemHitCount((prev) => {
      const next = { ...prev };
      let targetScored = false;
      for (const id of resolved.clearedItemIds) {
        const prevCount = next[id] ?? 0;
        if (!targetScored && id === targetItemId && prevCount < 3) {
          if (challengeMode !== 'fun') {
            changeScore(SCORE_MATCH3_PER_CLEAR);
          }
          targetScored = true;
        }
        next[id] = prevCount + 1;
      }

      if (
        challengeMode === 'fun' &&
        funTargetId &&
        targetItemId === funTargetId &&
        (next[targetItemId] ?? 0) >= 1
      ) {
        const newTargetId = pickFunTargetId(gameItems, next, funTargetId);
        if (newTargetId) {
          setFunTargetId(newTargetId);
          setFunTargetKey((k) => k + 1);
          setGrid((prevGrid) => {
            const copy = prevGrid.map((row) => row.map((t) => ({ ...t })));
            ensureFunTargetPlayable(copy, newTargetId, itemIds);
            return copy;
          });
        }
      }

      const currentRoundDone =
        gameItems.length > 0 && gameItems.every((it) => (next[it.id] ?? 0) >= 3);
      if (currentRoundDone) {
        if (roundSwitchPendingRef.current) return next;
        roundSwitchPendingRef.current = true;
        const prevIds = new Set(gameItems.map((it) => it.id));
        const snapshot = [...gameItems];
        popDoneRef.current.finally(() => {
          pendingRoundRef.current = { hitCount: next, excludeIds: prevIds };
          setQuizItems(snapshot);
          setRoundCelebrate(true);
        });
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

  const resolveMatches = (g: Tile[][]) => {
    let next = g;
    let loop = 0;
    const clearedItemIds: string[] = [];
    while (loop < 6) {
      const lineClearRuns = findLineClearRuns(next);
      if (lineClearRuns.length > 0) {
        for (const run of lineClearRuns) clearedItemIds.push(run.itemId);
        next = applyLineBonuses(next, lineClearRuns, itemIds);
      }
      const matches = findMatches(next);
      if (matches.length === 0) {
        if (lineClearRuns.length === 0) break;
      } else {
        for (const m of matches) clearedItemIds.push(m.itemId);
        const applied = applyMatches(next, matches, itemIds);
        next = applied.grid;
      }
      if (lineClearRuns.length === 0 && matches.length === 0) break;
      loop++;
    }
    return { grid: next, clearedItemIds };
  };

  const attemptSwap = (movedA: Cell, movedB: Cell) => {
    if (pool.length < 6 || quizOpen || roundCelebrate || matchClearCells !== null || refillActive) return;
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

    const hitFunTarget =
      challengeMode === 'fun' && !!funTargetId && targetItemId === funTargetId;
    const funWrongMatch =
      challengeMode === 'fun' && !!funTargetId && targetItemId !== funTargetId;
    const sfxVolume = resolveSfxVolume(bgmEnabled);

    unlockGameAudio();
    if (funWrongMatch) {
      playWrongSfx(sfxVolume);
      changeScore(SCORE_FUN_WRONG);
    } else {
      playMatchClearSfx(sfxVolume, lineClearRuns.length > 0 ? 'line' : 'match');
      if (hitFunTarget) {
        changeScore(SCORE_FUN_CORRECT);
      }
      if (lineClearRuns.length > 0) {
        changeScore(SCORE_EXTRA_MATCH_BONUS);
      }
    }

    let linkOrigin: Cell | undefined;
    if (directItem) {
      const originCell =
        directMatch.cells.find((cell) => cell.r === movedA.r && cell.c === movedA.c) ??
        directMatch.cells.find((cell) => cell.r === movedB.r && cell.c === movedB.c) ??
        directMatch.cells[Math.floor(directMatch.cells.length / 2)];
      linkOrigin = originCell;
      showWord({
        word: directItem.word,
        cn: directItem.cn,
        emoji: directItem.emoji,
        imgSrc: directItem.imgSrc,
        originCell,
      });
    }

    setSelected(null);
    setGrid(swapped);
    setMatchClearCells(
      lineClearRuns.length > 0 ? clearCellsForLongRuns(lineClearRuns) : directMatch.cells,
    );
    setMatchClearKey((k) => k + 1);
    setMatchShakeKey((k) => k + 1);
    if (linkOrigin && directItem) {
      wordLinkSeqRef.current += 1;
      setWordLink({
        itemId: targetItemId,
        originCell: linkOrigin,
        burstKey: wordLinkSeqRef.current,
      });
    }

    if (clearTimerRef.current) window.clearTimeout(clearTimerRef.current);
    const clearMs = lineClearRuns.length > 0 ? LINE_CLEAR_MS : MATCH_CLEAR_MS;
    const epoch = boardEpochRef.current;
    clearTimerRef.current = window.setTimeout(() => {
      clearTimerRef.current = null;
      if (epoch !== boardEpochRef.current) return;
      const resolved = resolveMatches(swapped);
      const clearedKeys = new Set(
        (lineClearRuns.length > 0 ? clearCellsForLongRuns(lineClearRuns) : directMatch.cells).map(
          (cell) => `${cell.r}:${cell.c}`,
        ),
      );
      emitRefillBurst(
        swapped.map((row) => row.map((t) => ({ ...t }))),
        resolved.grid.map((row) => row.map((t) => ({ ...t }))),
        clearedKeys,
      );
      applyResolvedMatch(resolved, targetItemId);
    }, clearMs);
  };

  const handleQuizScoreChange = React.useCallback(
    (delta: number) => {
      changeScore(delta);
    },
    [changeScore],
  );

  const clickCell = (r: number, c: number) => {
    if (pool.length < 6) return;
    if (!selected) {
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
      setSelected({ r, c });
      return;
    }
    attemptSwap(selected, { r, c });
  };

  const swapCells = (from: Cell, to: Cell) => {
    if (pool.length < 6) return;
    setSelected(null);
    attemptSwap(from, to);
  };

  const usesThiings = allPool.some((it) => typeof it.imgSrc === 'string' && it.imgSrc.length > 0);
  const canPlay = pool.length >= 6;
  const totalEmojiPool = useMemo(
    () => allPool.filter((it) => Boolean(it.emoji)).length,
    [allPool],
  );

  const modeLabel =
    challengeMode === 'review'
      ? t.modes.reviewMode
      : challengeMode === 'category'
        ? activeCategory
          ? activeCategory.id === 'thiings'
            ? t.modes.thiingsLabel
            : categoryDisplayName(activeCategory, locale)
          : t.modes.categoryFallback
        : challengeMode === 'fun'
          ? t.modes.funChallenge
          : t.modes.randomChallenge;

  const onboardingStepCopy = t.onboarding.steps[onboardingStep];
  const onboardingTotal = t.onboarding.steps.length;

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
          onboardingOpen && 'overflow-hidden',
        )}
      >
        {activeTab === 'game' && (
          <GamePanel
            gridRef={gridRef}
            modesButtonsRef={modesButtonsRef}
            onRestart={reset}
            score={score}
            scorePops={scorePops}
            level={level}
            gameItems={gameItems}
            itemHitCount={itemHitCount}
            challengeMode={challengeMode}
            modeLabel={modeLabel}
            funTargetItem={funTargetItem}
            funTargetKey={funTargetKey}
            funCountdown={funCountdown}
            canPlay={canPlay}
            grid={grid}
            itemById={itemById}
            selected={selected}
            hintMove={hintMove}
            popWord={popWord}
            matchShakeKey={matchShakeKey}
            matchClearCells={matchClearCells}
            matchClearKey={matchClearKey}
            gridLocked={matchClearCells !== null || boardIntroActive || refillActive}
            boardIntroActive={boardIntroActive}
            onBoardIntroComplete={() => setBoardIntroActive(false)}
            refillBurst={refillBurst}
            onRefillActiveChange={setRefillActive}
            wordLink={wordLink}
            onWordLinkDone={() => setWordLink(null)}
            onCellClick={clickCell}
            onSwapCells={swapCells}
            onChallengeModeChange={setChallengeMode}
            challengePools={challengePools}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={setSelectedCategoryId}
            onShuffleWords={() => startNextRound(itemHitCount, new Set(gameItems.map((it) => it.id)))}
          />
        )}
        {activeTab === 'learned' && (
          <LearnedPanel
            learnedAreaRef={learnedAreaRef}
            roundLearnedIds={roundLearnedIds}
            totalEmojiPool={totalEmojiPool}
            itemById={itemById}
            allPool={allPool}
          />
        )}
        {activeTab === 'words' && <WordsPanel emojiIndexAreaRef={emojiIndexAreaRef} />}
        {activeTab === 'profile' && (
          <ProfilePanel
            profileAreaRef={profileAreaRef}
            ttsAvailable={ttsAvailable}
            usesThiings={usesThiings}
            wordMemory={wordMemory}
            allPool={allPool}
            totalEmojiPool={totalEmojiPool}
            bgmEnabled={bgmEnabled}
            onBgmEnabledChange={handleBgmEnabledChange}
            sfxEnabled={sfxEnabled}
            onSfxEnabledChange={handleSfxEnabledChange}
          />
        )}
      </main>

      <MobileTabBar active={activeTab} onChange={handleTabChange} />

      <CelebrationBurst
        show={roundCelebrate}
        title={t.celebration.roundComplete}
        subtitle={t.celebration.roundQuiz}
        emoji="🎉"
        onDone={handleRoundCelebrateDone}
      />

      <RoundQuizSheet
        open={quizOpen}
        items={quizItems}
        score={score}
        scorePops={scorePops}
        onComplete={handleQuizComplete}
        onScoreChange={handleQuizScoreChange}
      />

      <AnimatePresence>
        {onboardingOpen && !boardIntroActive && (
          <motion.div
            key="match3-onboarding-spotlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[120] pointer-events-auto"
            role="dialog"
            aria-modal="true"
            aria-label={t.onboarding.dialogAria}
            onClick={(e) => {
              if (e.target === e.currentTarget) dismissOnboarding();
            }}
          >
            <div className="absolute inset-0 bg-black/55" />
            {spotRect && (
              <motion.div
                key={`spot-${onboardingStep}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="absolute rounded-[28px] ring-4 ring-amber-300/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
                style={{
                  left: Math.max(8, spotRect.x - 10),
                  top: Math.max(8, spotRect.y - 10),
                  width: Math.max(40, spotRect.w + 20),
                  height: Math.max(40, spotRect.h + 20),
                }}
              />
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute left-1/2 top-[calc(100%-16px)] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-full rounded-[24px] border border-violet-100 bg-white p-5 shadow-2xl shadow-violet-900/25 sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-3 top-3 rounded-full p-2 text-violet-700 transition-colors hover:bg-violet-50 hover:text-violet-950"
                onClick={dismissOnboarding}
                aria-label={t.onboarding.closeAria}
              >
                <X size={18} aria-hidden />
              </button>

              <div className="flex items-center gap-2 pr-10">
                <Sparkles className="shrink-0 text-violet-600" size={18} aria-hidden />
                <span className="text-[11px] font-bold uppercase tracking-widest text-violet-600">
                  {t.onboarding.title(onboardingStep + 1, onboardingTotal)}
                </span>
              </div>
              <div className="mt-2 text-lg font-black text-violet-950">{onboardingStepCopy?.title}</div>
              <div className="mt-2 text-sm font-medium leading-relaxed text-violet-800/90">
                {onboardingStepCopy?.body}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setOnboardingStep((s) => Math.max(0, s - 1))}
                  disabled={onboardingStep === 0}
                  className={cn(
                    'min-h-[44px] rounded-full border px-5 py-2 text-sm font-bold transition-colors',
                    onboardingStep === 0
                      ? 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
                      : 'border-violet-200 bg-white text-violet-800 hover:bg-violet-50',
                  )}
                >
                  {t.common.prev}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={dismissOnboarding}
                    className="min-h-[44px] rounded-full border border-violet-200 bg-white px-5 py-2 text-sm font-bold text-violet-800 transition-colors hover:bg-violet-50"
                  >
                    {t.common.skip}
                  </button>
                  {onboardingStep < onboardingTotal - 1 ? (
                    <button
                      type="button"
                      onClick={() => setOnboardingStep((s) => Math.min(onboardingTotal - 1, s + 1))}
                      className="min-h-[44px] rounded-full border border-violet-600 bg-violet-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-violet-900/15 transition-colors hover:bg-violet-700"
                    >
                      {t.common.next}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={dismissOnboarding}
                      className="min-h-[44px] rounded-full border border-violet-600 bg-violet-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-violet-900/15 transition-colors hover:bg-violet-700"
                    >
                      {t.common.done}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

