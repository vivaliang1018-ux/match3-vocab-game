import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOTION_SPRING_SNAPPY, MOTION_PRESS_TAP, IOS_EASE } from '../../lib/motionPresets';
import {
  MOTION_STAGGER_TIGHT_CONTAINER,
  MOTION_STAGGER_TIGHT_ITEM,
} from '../../lib/motionChoreography';
import { ChevronDown, House, Pause, Play, Settings } from 'lucide-react';
import { cellCenterPx } from '../../lib/gridLayout';
import { useI18n, type Locale } from '../../i18n';
import { getEmojiLearningTranslation } from '../../data/emojiLocalizedNames';
import { cn } from '../../lib/utils';
import { TIMED_TARGET_COUNTDOWN_SEC } from '../../lib/scoring';
import { BoardBottomSparkles } from './BoardBottomSparkles';
import { LineShockwave } from './LineShockwave';
import { SkySparkleBackground } from '../SkySparkleBackground';
import { HudPlaque, HudStatNumber } from './HudPlaque';
import { WordLinkChain } from './WordLinkChain';
import { TimedTargetBanner } from './FunTargetBanner';
import { ModePickerSheet } from './ModePickerSheet';
import {
  CategoryHubSheet,
  type CategoryBrowseSection,
  type CategoryChallengePool,
} from './CategoryHubSheet';
import { StepsHud } from './ScoreHud';
import type { Cell, ChallengeMode, Tile, WordItem } from '../../types/game';
import type { RefillBurst } from '../../lib/boardRefill';
import { useBoardGravityRefill } from './useBoardGravityRefill';
import { STAMINA_MAX } from '../../lib/stamina';
import type { FeatureGuideTarget } from '../../lib/firstTimeGuide';
import { GuidedTapHint } from './GuidedTapHint';
import { useLimitedGuidePrompt } from './useLimitedGuidePrompt';
import { useModalDialog } from './useModalDialog';

const GRID_SIZE = 7;
const SWIPE_THRESHOLD_PX = 16;
const TAP_THRESHOLD_PX = 10;
const SHELF_STEP_MS = 72;
const SHELF_COL_STAGGER_MS = 14;
const SHELF_BASE_FALL_MS = 200;
const SHELF_PER_ROW_MS = 82;

function shelfIntroTotalMs(): number {
  const maxFall = SHELF_BASE_FALL_MS + GRID_SIZE * SHELF_PER_ROW_MS;
  const maxDelay = (GRID_SIZE - 1) * SHELF_STEP_MS + (GRID_SIZE - 1) * SHELF_COL_STAGGER_MS;
  return maxDelay + maxFall + 80;
}

type ShelfMetrics = {
  originX: number;
  originY: number;
  stepX: number;
  stepY: number;
  cellW: number;
  cellH: number;
};

type ShelfEmojiSlot = {
  r: number;
  c: number;
  tileId: string;
  item: WordItem | undefined;
};

function measureShelfMetrics(boardEl: HTMLElement): ShelfMetrics | null {
  const gridEl = boardEl.querySelector<HTMLElement>('[data-shelf-grid]');
  if (!gridEl) return null;

  const boardRect = boardEl.getBoundingClientRect();
  const buttons = gridEl.querySelectorAll('button');
  const first = buttons[0]?.getBoundingClientRect();
  const below = buttons[GRID_SIZE]?.getBoundingClientRect();
  const right = buttons[1]?.getBoundingClientRect();
  if (!first) return null;

  const originX = first.left - boardRect.left;
  const originY = first.top - boardRect.top;
  const cellW = first.width;
  const cellH = first.height;
  const stepY = below ? below.top - first.top : cellH;
  const stepX = right ? right.left - first.left : cellW;

  return { originX, originY, stepX, stepY, cellW, cellH };
}

function shelfSpawnStep(r: number): number {
  // Top row first — matches Candy Crush–style refill from above.
  return r;
}

function BoardShelfEmojiLayer({
  grid,
  itemById,
  boardRef,
  onComplete,
}: {
  grid: Tile[][];
  itemById: Map<string, WordItem>;
  boardRef: React.RefObject<HTMLDivElement | null>;
  onComplete: () => void;
}) {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const slots = useMemo<ShelfEmojiSlot[]>(
    () =>
      grid.flatMap((row, r) =>
        row.map((tile, c) => ({
          r,
          c,
          tileId: tile.id,
          item: itemById.get(tile.itemId),
        })),
      ),
    [grid, itemById],
  );

  useLayoutEffect(() => {
    const board = boardRef.current;
    const layer = layerRef.current;
    if (!board || !layer) {
      const t = window.setTimeout(() => onCompleteRef.current(), 0);
      return () => window.clearTimeout(t);
    }

    let cancelled = false;
    let introTimer: number | null = null;
    let retryTimer: number | null = null;
    let attempts = 0;

    const clearIntroStyles = () => {
      layer.style.opacity = '0';
      const children = layer.children;
      for (let i = 0; i < children.length; i++) {
        const el = children[i] as HTMLElement;
        el.classList.remove('shelf-emoji-intro');
        el.style.removeProperty('--shelf-x');
        el.style.removeProperty('--shelf-y0');
        el.style.removeProperty('--shelf-y1');
        el.style.removeProperty('--shelf-dur');
        el.style.removeProperty('--shelf-delay');
      }
    };

    const runIntro = () => {
      if (cancelled) return;
      const metrics = measureShelfMetrics(board);
      if (!metrics) {
        attempts += 1;
        if (attempts >= 12) {
          // Board never laid out (e.g. entered review under a modal) — skip intro.
          onCompleteRef.current();
          return;
        }
        retryTimer = window.setTimeout(() => {
          retryTimer = null;
          requestAnimationFrame(runIntro);
        }, 32);
        return;
      }

      const totalMs = shelfIntroTotalMs();
      const children = layer.children;

      for (let i = 0; i < slots.length; i++) {
        const slot = slots[i];
        const el = children[i] as HTMLElement | undefined;
        if (!el) continue;

        const spawn = shelfSpawnStep(slot.r);
        const delay = spawn * SHELF_STEP_MS + slot.c * SHELF_COL_STAGGER_MS;
        // Fall from stacked above the board into the seat (row 0 travels farthest).
        const rowsAbove = GRID_SIZE - slot.r;
        const y1 = metrics.originY + slot.r * metrics.stepY;
        const y0 = y1 - rowsAbove * metrics.stepY;
        const duration = Math.max(
          SHELF_BASE_FALL_MS + rowsAbove * SHELF_PER_ROW_MS,
          1,
        );
        const x = metrics.originX + slot.c * metrics.stepX;

        el.style.width = `${metrics.cellW}px`;
        el.style.height = `${metrics.cellH}px`;
        el.style.setProperty('--shelf-x', `${x}px`);
        el.style.setProperty('--shelf-y0', `${y0}px`);
        el.style.setProperty('--shelf-y1', `${y1}px`);
        el.style.setProperty('--shelf-dur', `${duration}ms`);
        el.style.setProperty('--shelf-delay', `${delay}ms`);
        el.style.zIndex = String(GRID_SIZE - slot.r);
        el.classList.add('shelf-emoji-intro');
      }

      // Show only after every tile is positioned for the drop (same frame, no flash).
      layer.style.opacity = '1';

      introTimer = window.setTimeout(() => {
        introTimer = null;
        if (!cancelled) onCompleteRef.current();
      }, totalMs);
    };

    requestAnimationFrame(runIntro);

    return () => {
      cancelled = true;
      if (introTimer !== null) window.clearTimeout(introTimer);
      if (retryTimer !== null) window.clearTimeout(retryTimer);
      clearIntroStyles();
    };
  }, [boardRef, slots]);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden opacity-0"
      aria-hidden
    >
      {slots.map((slot) => (
        <div
          key={slot.tileId}
          className="absolute left-0 top-0 grid place-items-center text-[clamp(1.9rem,7.5vw,2.9rem)]"
        >
          {slot.item?.imgSrc ? (
            <img
              src={slot.item.imgSrc}
              alt=""
              className="h-[clamp(2.4rem,7.6vw,2.95rem)] w-[clamp(2.4rem,7.6vw,2.95rem)] object-contain drop-shadow-sm"
              loading="eager"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="drop-shadow-sm">{slot.item?.emoji ?? '·'}</span>
          )}
        </div>
      ))}
    </div>
  );
}

type PointerStart = {
  r: number;
  c: number;
  tileId: string;
  x: number;
  y: number;
  pointerId: number;
  cellSize: number;
  axis: 'x' | 'y' | null;
};

type DragPreview = {
  tileId: string;
  x: number;
  y: number;
  companionTileId?: string;
  companionX?: number;
  companionY?: number;
  returning?: boolean;
};

function swapPreviewGrid(grid: Tile[][], from: Cell, to: Cell): Tile[][] {
  const next = grid.map((row) => [...row]);
  const fromTile = next[from.r]?.[from.c];
  const toTile = next[to.r]?.[to.c];
  if (!fromTile || !toTile) return next;
  next[from.r][from.c] = toTile;
  next[to.r][to.c] = fromTile;
  return next;
}

function previewGridHasMatch(grid: Tile[][]): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const id = grid[r]?.[c]?.itemId;
      if (!id) continue;
      if (
        (c + 2 < GRID_SIZE &&
          grid[r][c + 1]?.itemId === id &&
          grid[r][c + 2]?.itemId === id) ||
        (r + 2 < GRID_SIZE &&
          grid[r + 1]?.[c]?.itemId === id &&
          grid[r + 2]?.[c]?.itemId === id)
      ) {
        return true;
      }
    }
  }
  return false;
}

function previewTutorialMatchCellKeys(
  grid: Tile[][],
  move: { source: Cell; target: Cell },
): Set<string> {
  const movedItemId = grid[move.source.r]?.[move.source.c]?.itemId;
  const swapped = swapPreviewGrid(grid, move.source, move.target);
  const keys = new Set<string>();
  if (!movedItemId) return keys;
  const touchesDropTarget = (cells: Cell[]) =>
    cells.some(
      (cell) =>
        cell.r === move.target.r && cell.c === move.target.c,
    );

  for (let r = 0; r < GRID_SIZE; r++) {
    let c = 0;
    while (c < GRID_SIZE) {
      const start = c;
      const itemId = swapped[r]?.[c]?.itemId;
      while (c < GRID_SIZE && swapped[r]?.[c]?.itemId === itemId) c++;
      if (itemId === movedItemId && c - start >= 3) {
        const cells = Array.from({ length: c - start }, (_, i) => ({
          r,
          c: start + i,
        }));
        if (touchesDropTarget(cells)) {
          cells.forEach((cell) => keys.add(`${cell.r}:${cell.c}`));
        }
      }
    }
  }

  for (let c = 0; c < GRID_SIZE; c++) {
    let r = 0;
    while (r < GRID_SIZE) {
      const start = r;
      const itemId = swapped[r]?.[c]?.itemId;
      while (r < GRID_SIZE && swapped[r]?.[c]?.itemId === itemId) r++;
      if (itemId === movedItemId && r - start >= 3) {
        const cells = Array.from({ length: r - start }, (_, i) => ({
          r: start + i,
          c,
        }));
        if (touchesDropTarget(cells)) {
          cells.forEach((cell) => keys.add(`${cell.r}:${cell.c}`));
        }
      }
    }
  }

  return keys;
}

export type WordLinkPayload = {
  itemId: string;
  originCell: Cell;
  burstKey: number;
};

type GamePanelProps = {
  onHome: () => void;
  onRestart: () => void;
  /** Adventure sets cleared — used as current set = cleared + 1. */
  clearedSets: number;
  gameItems: WordItem[];
  itemHitCount: Record<string, number>;
  challengeMode: ChallengeMode;
  modeLabel: string;
  reviveActive: boolean;
  /** Show timed-target banner (revive challenge or review mode). */
  timedHuntActive?: boolean;
  funTargetItem: WordItem | null;
  funTargetKey: number;
  funCountdown: number;
  /** Full timed-hunt length for the banner ring. */
  funCountdownMaxSec?: number;
  reviveWrongs: number;
  reviveWrongLimit: number;
  reviveCorrects: number;
  reviveCorrectNeeded: number;
  onReviveExit?: () => void;
  movesLeft: number | null;
  movesBonusFlashKey?: number;
  stamina: number;
  staminaBanked?: number;
  canPlay: boolean;
  playBlockedReason?: 'stamina' | 'pool' | null;
  onGoAdventure?: () => void;
  /** Mandatory review still owed after leaving mid-exam. */
  pendingForcedReview?: boolean;
  onResumeForcedReview?: () => void;
  /** Review-only: cover board tiles + pause timed hunt. */
  reviewPaused?: boolean;
  onToggleReviewPause?: () => void;
  /** Notify parent so timed review/revive hunts pause while the sheet is open. */
  onModePickerOpenChange?: (open: boolean) => void;
  /** Shelf hits needed per word (review 2 / else 3). */
  hitsNeeded?: number;
  grid: Tile[][];
  itemById: Map<string, WordItem>;
  selected: Cell | null;
  hintMove: { a: Cell; b: Cell } | null;
  popWord: PopWordPayload | null;
  matchShakeKey: number;
  matchClearCells: Cell[] | null;
  matchClearKey: number;
  gridLocked: boolean;
  wordLink: WordLinkPayload | null;
  onWordLinkDone: () => void;
  onCellClick: (r: number, c: number) => void;
  onSwapCells: (from: Cell, to: Cell) => void;
  onChallengeModeChange: (mode: ChallengeMode) => void;
  onOpenSayBlast: () => void;
  challengePools: CategoryChallengePool[];
  categoryBrowseSections: CategoryBrowseSection[];
  selectedCategoryId: string;
  onCategoryChange: (id: string) => void;
  categoryHubRequestKey?: number;
  onShuffleWords: () => void;
  categoryUnlocked: boolean;
  moodUnlocked: boolean;
  moodCanStartNew?: boolean;
  sayBlastReady: boolean;
  boardIntroActive?: boolean;
  onBoardIntroComplete?: () => void;
  refillBurst?: RefillBurst | null;
  onRefillActiveChange?: (active: boolean) => void;
  firstSwapTutorialMove?: { source: Cell; target: Cell } | null;
  freeMoveRuleHintMove?: { source: Cell; target: Cell } | null;
  fixedMatchTutorialStage?: 'three' | 'four' | 'cross' | null;
  reviewTutorialActive?: boolean;
  featureGuideTarget?: Extract<FeatureGuideTarget, 'sayAndBlast' | 'moodBoard' | 'category'> | null;
  featureGuideModePickerPlayCount?: number;
  featureGuidePlayCount?: number;
  onFeatureGuidePlaybackStart?: (target: FeatureGuideTarget) => void;
};

type PopWordPayload = {
  word: string;
  cn?: string;
  emoji?: string;
  imgSrc?: string;
  originCell?: Cell;
  isFirstDiscovery?: boolean;
};

function PopWordOverlay({
  popWord,
  locale,
}: {
  popWord: PopWordPayload;
  locale: Locale;
}) {
  const { ui } = useI18n();
  const nativeTranslation = getEmojiLearningTranslation(popWord, locale);
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[60] flex items-center justify-center px-3"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      aria-live="polite"
    >
      <div className="flex min-w-[12.5rem] max-w-[82%] flex-col items-center rounded-[28px] border border-white/90 bg-white/94 px-6 py-5 text-center text-sky-950 shadow-xl shadow-black/12 backdrop-blur">
        {popWord.isFirstDiscovery && (
          <div className="mb-2 rounded-full bg-fuchsia-50 px-2 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-fuchsia-600">
            {ui.game.newDiscovery}
          </div>
        )}
        {popWord.imgSrc ? (
          <img
            src={popWord.imgSrc}
            alt=""
            className="h-16 w-16 object-contain"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ) : popWord.emoji ? (
          <div className="text-5xl leading-none" aria-hidden>
            {popWord.emoji}
          </div>
        ) : null}
        <div className="mt-3 max-w-full break-words text-2xl font-black tracking-tight">
          {popWord.word}
        </div>
        {nativeTranslation && (
          <div className="mt-2 text-base font-bold text-sky-700/75">{nativeTranslation}</div>
        )}
      </div>
    </motion.div>
  );
}

export function GamePanel({
  onHome,
  onRestart,
  clearedSets,
  gameItems,
  itemHitCount,
  challengeMode,
  modeLabel,
  reviveActive,
  timedHuntActive = false,
  funTargetItem,
  funTargetKey,
  funCountdown,
  funCountdownMaxSec = TIMED_TARGET_COUNTDOWN_SEC,
  reviveWrongs,
  reviveWrongLimit,
  reviveCorrects,
  reviveCorrectNeeded: reviveNeeded,
  onReviveExit,
  movesLeft,
  movesBonusFlashKey = 0,
  stamina,
  staminaBanked = 0,
  canPlay,
  playBlockedReason = null,
  onGoAdventure,
  pendingForcedReview = false,
  onResumeForcedReview,
  reviewPaused = false,
  onToggleReviewPause,
  onModePickerOpenChange,
  hitsNeeded = 3,
  grid,
  itemById,
  selected,
  hintMove,
  popWord,
  matchShakeKey: _matchShakeKey,
  matchClearCells,
  matchClearKey,
  gridLocked,
  wordLink,
  onWordLinkDone,
  onCellClick,
  onSwapCells,
  onChallengeModeChange,
  onOpenSayBlast,
  challengePools,
  categoryBrowseSections,
  selectedCategoryId,
  onCategoryChange,
  categoryHubRequestKey = 0,
  onShuffleWords,
  categoryUnlocked,
  moodUnlocked,
  moodCanStartNew = true,
  sayBlastReady,
  boardIntroActive = false,
  onBoardIntroComplete,
  refillBurst = null,
  onRefillActiveChange,
  firstSwapTutorialMove = null,
  freeMoveRuleHintMove = null,
  fixedMatchTutorialStage = null,
  reviewTutorialActive = false,
  featureGuideTarget = null,
  featureGuideModePickerPlayCount = 0,
  featureGuidePlayCount = 0,
  onFeatureGuidePlaybackStart,
}: GamePanelProps) {
  const { locale, t, ui } = useI18n();
  const [modePickerOpen, setModePickerOpen] = useState(false);
  const [categoryHubOpen, setCategoryHubOpen] = useState(false);
  const [homeConfirmOpen, setHomeConfirmOpen] = useState(false);
  const homeConfirmDialogRef = useModalDialog({
    open: homeConfirmOpen,
    onClose: () => setHomeConfirmOpen(false),
  });

  useEffect(() => {
    if (playBlockedReason === 'stamina') {
      setModePickerOpen(false);
      setCategoryHubOpen(false);
    }
  }, [playBlockedReason]);

  useEffect(() => {
    onModePickerOpenChange?.(modePickerOpen || categoryHubOpen);
    return () => onModePickerOpenChange?.(false);
  }, [categoryHubOpen, modePickerOpen, onModePickerOpenChange]);

  useEffect(() => {
    if (categoryHubRequestKey > 0) {
      setModePickerOpen(false);
      setCategoryHubOpen(true);
    }
  }, [categoryHubRequestKey]);
  const activeCategoryPool =
    challengePools.find((pool) => pool.id === selectedCategoryId) ?? challengePools[0] ?? null;
  const pointerStartRef = useRef<PointerStart | null>(null);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
  const [swapAnimationTileIds, setSwapAnimationTileIds] = useState<Set<string>>(
    () => new Set(),
  );
  const swapAnimationTimerRef = useRef<number | null>(null);
  const tutorialSourceButtonRef = useRef<HTMLButtonElement | null>(null);
  const tutorialTargetButtonRef = useRef<HTMLButtonElement | null>(null);
  const modePickerButtonRef = useRef<HTMLButtonElement | null>(null);
  const panelRootRef = useRef<HTMLDivElement | null>(null);
  const popBoardRef = useRef<HTMLDivElement | null>(null);
  const wordIconRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [linkGeom, setLinkGeom] = useState<{ from: { x: number; y: number }; to: { x: number; y: number } } | null>(
    null,
  );
  const [revealedItemId, setRevealedItemId] = useState<string | null>(null);
  const [shelfCascadeDone, setShelfCascadeDone] = useState(!boardIntroActive);
  const boardInnerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /** Keep tile emojis hidden for the whole intro — don't wait a paint for shelfCascadeDone. */
  const hideTileEmojisForIntro = boardIntroActive && !prefersReducedMotion;
  const showShelfCascade = hideTileEmojisForIntro && !shelfCascadeDone;
  const modePickerGuideTarget: Extract<
    FeatureGuideTarget,
    'sayAndBlastModePicker' | 'moodBoardModePicker' | 'categoryModePicker'
  > | null =
    featureGuideTarget === 'sayAndBlast'
      ? 'sayAndBlastModePicker'
      : featureGuideTarget === 'moodBoard'
        ? 'moodBoardModePicker'
        : featureGuideTarget === 'category'
          ? 'categoryModePicker'
        : null;
  const modePickerGuidePlaying = useLimitedGuidePrompt({
    eligible: modePickerGuideTarget !== null && !modePickerOpen,
    persistedPlayCount: featureGuideModePickerPlayCount,
    onPlaybackStart: () => {
      if (modePickerGuideTarget) {
        onFeatureGuidePlaybackStart?.(modePickerGuideTarget);
      }
    },
  });

  const cellEquals = (left: Cell, right: Cell) =>
    left.r === right.r && left.c === right.c;
  const isTutorialCell = (cell: Cell) =>
    firstSwapTutorialMove !== null &&
    (cellEquals(cell, firstSwapTutorialMove.source) ||
      cellEquals(cell, firstSwapTutorialMove.target));
  const isTutorialPair = (from: Cell, to: Cell) =>
    firstSwapTutorialMove !== null &&
    ((cellEquals(from, firstSwapTutorialMove.source) &&
      cellEquals(to, firstSwapTutorialMove.target)) ||
      (cellEquals(from, firstSwapTutorialMove.target) &&
        cellEquals(to, firstSwapTutorialMove.source)));

  useBoardGravityRefill({
    boardRef: boardInnerRef,
    burst: refillBurst,
    enabled: !prefersReducedMotion && !boardIntroActive,
    onActiveChange: onRefillActiveChange,
  });

  const shelfCompleteRef = useRef<() => void>(() => {});

  useEffect(() => {
    shelfCompleteRef.current = () => {
      setShelfCascadeDone(true);
      onBoardIntroComplete?.();
    };
  }, [onBoardIntroComplete]);

  // Sync before paint so we never flash settled emojis, then play the drop intro.
  useLayoutEffect(() => {
    if (!boardIntroActive) {
      setShelfCascadeDone(true);
      return;
    }
    if (prefersReducedMotion) {
      setShelfCascadeDone(true);
      shelfCompleteRef.current();
      return;
    }
    setShelfCascadeDone(false);
  }, [boardIntroActive, prefersReducedMotion]);

  // Hard fallback: never leave tiles blank if shelf intro stalls (dead-machine → review).
  useEffect(() => {
    if (!boardIntroActive || prefersReducedMotion) return;
    const failsafe = window.setTimeout(() => {
      setShelfCascadeDone(true);
      shelfCompleteRef.current();
    }, 2200);
    return () => window.clearTimeout(failsafe);
  }, [boardIntroActive, prefersReducedMotion]);

  useLayoutEffect(() => {
    if (!wordLink || !panelRootRef.current || !popBoardRef.current) {
      setLinkGeom(null);
      return;
    }
    const panel = panelRootRef.current.getBoundingClientRect();
    const board = popBoardRef.current.getBoundingClientRect();
    const cp = cellCenterPx(board.width, board.height, wordLink.originCell);
    const targetEl = wordIconRefs.current.get(wordLink.itemId);
    if (!targetEl) {
      setLinkGeom(null);
      return;
    }
    const tr = targetEl.getBoundingClientRect();
    setLinkGeom({
      from: { x: board.left - panel.left + cp.x, y: board.top - panel.top + cp.y },
      to: { x: tr.left - panel.left + tr.width / 2, y: tr.top - panel.top + tr.height / 2 },
    });
  }, [wordLink]);

  useEffect(() => {
    setRevealedItemId(null);
  }, [gameItems]);

  useEffect(() => {
    if (!gridLocked && !reviewPaused) return;
    pointerStartRef.current = null;
    setDragPreview(null);
  }, [gridLocked, reviewPaused]);

  useEffect(
    () => () => {
      if (swapAnimationTimerRef.current !== null) {
        window.clearTimeout(swapAnimationTimerRef.current);
      }
    },
    [],
  );

  const revealedWord = useMemo(() => {
    if (!revealedItemId) return null;
    return gameItems.find((it) => it.id === revealedItemId)?.word ?? null;
  }, [gameItems, revealedItemId]);

  useEffect(() => {
    if (!revealedItemId) return;
    const el = wordIconRefs.current.get(revealedItemId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [revealedItemId]);

  const clearingKeySet = useMemo(() => {
    if (!matchClearCells?.length) return null;
    return new Set(matchClearCells.map((cell) => `${cell.r}:${cell.c}`));
  }, [matchClearCells]);

  const isLineClearAnim = (matchClearCells?.length ?? 0) >= GRID_SIZE;

  /** row / col / cross — used for stagger from epicenter. */
  const lineClearDir = useMemo<'row' | 'col' | 'cross' | null>(() => {
    if (!matchClearCells || matchClearCells.length < GRID_SIZE) return null;
    const rowCounts = new Map<number, number>();
    const colCounts = new Map<number, number>();
    for (const cell of matchClearCells) {
      rowCounts.set(cell.r, (rowCounts.get(cell.r) ?? 0) + 1);
      colCounts.set(cell.c, (colCounts.get(cell.c) ?? 0) + 1);
    }
    const fullRows = [...rowCounts.values()].some((n) => n >= GRID_SIZE);
    const fullCols = [...colCounts.values()].some((n) => n >= GRID_SIZE);
    if (fullRows && fullCols) return 'cross';
    if (fullRows) return 'row';
    if (fullCols) return 'col';
    return null;
  }, [matchClearCells]);

  const clearOrigin = useMemo(() => {
    if (!isLineClearAnim || !matchClearCells) return null;
    return (
      popWord?.originCell ??
      wordLink?.originCell ??
      matchClearCells[Math.floor(matchClearCells.length / 2)] ??
      null
    );
  }, [isLineClearAnim, matchClearCells, popWord?.originCell, wordLink?.originCell]);

  const lineClearDelaySec = useMemo(() => {
    if (!isLineClearAnim || !matchClearCells) return null;
    const map = new Map<string, string>();
    for (const cell of matchClearCells) {
      let dist = 0;
      if (clearOrigin) {
        dist =
          lineClearDir === 'col'
            ? Math.abs(cell.r - clearOrigin.r)
            : lineClearDir === 'row'
              ? Math.abs(cell.c - clearOrigin.c)
              : Math.max(
                  Math.abs(cell.r - clearOrigin.r),
                  Math.abs(cell.c - clearOrigin.c),
                );
      } else {
        dist = lineClearDir === 'col' ? cell.r : cell.c;
      }
      map.set(`${cell.r}:${cell.c}`, `${Math.min(dist, 4) * 0.045}s`);
    }
    return map;
  }, [isLineClearAnim, matchClearCells, clearOrigin, lineClearDir]);

  /** Full row/col: shockwave overlay. Linger briefly after cells clear. */
  const [lingerShockwave, setLingerShockwave] = useState<{
    cells: Cell[];
    key: number;
    origin: Cell | null;
  } | null>(null);

  useEffect(() => {
    if (matchClearCells && matchClearCells.length >= GRID_SIZE) {
      setLingerShockwave({
        cells: matchClearCells,
        key: matchClearKey,
        origin: clearOrigin,
      });
      return;
    }
    if (matchClearCells && matchClearCells.length > 0) {
      setLingerShockwave(null);
      return;
    }
    // Finish just past the clear handoff without covering most of the refill.
    const waveTimer = window.setTimeout(() => setLingerShockwave(null), 80);
    return () => window.clearTimeout(waveTimer);
  }, [matchClearCells, matchClearKey, clearOrigin]);

  const lineShockwave =
    matchClearCells && matchClearCells.length >= GRID_SIZE
      ? {
          cells: matchClearCells,
          key: matchClearKey,
          origin: clearOrigin,
        }
      : lingerShockwave;

  const handleTilePointerDown = (
    r: number,
    c: number,
    tileId: string,
    e: React.PointerEvent<HTMLButtonElement>,
  ) => {
    if (!canPlay || gridLocked || e.button !== 0) return;
    if (firstSwapTutorialMove && !isTutorialCell({ r, c })) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    pointerStartRef.current = {
      r,
      c,
      tileId,
      x: e.clientX,
      y: e.clientY,
      pointerId: e.pointerId,
      cellSize: Math.max(1, Math.min(rect.width, rect.height)),
      axis: null,
    };
    setDragPreview({ tileId, x: 0, y: 0 });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const commitPointerSwap = (
    start: PointerStart,
    dx: number,
    dy: number,
    target: HTMLButtonElement,
  ): boolean => {
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const axis = start.axis ?? (absX > absY ? 'x' : 'y');
    let toR = start.r;
    let toC = start.c;
    if (axis === 'x') toC += dx > 0 ? 1 : -1;
    else toR += dy > 0 ? 1 : -1;
    if (toR < 0 || toR >= GRID_SIZE || toC < 0 || toC >= GRID_SIZE) return false;

    if (
      firstSwapTutorialMove &&
      !isTutorialPair({ r: start.r, c: start.c }, { r: toR, c: toC })
    ) {
      pointerStartRef.current = null;
      if (target.hasPointerCapture(start.pointerId)) {
        target.releasePointerCapture(start.pointerId);
      }
      setDragPreview(null);
      return true;
    }

    const companionTileId = grid[toR]?.[toC]?.id;
    const validSwap = previewGridHasMatch(
      swapPreviewGrid(grid, { r: start.r, c: start.c }, { r: toR, c: toC }),
    );
    pointerStartRef.current = null;
    if (target.hasPointerCapture(start.pointerId)) {
      target.releasePointerCapture(start.pointerId);
    }
    if (!validSwap) {
      const fullX = axis === 'x' ? (dx > 0 ? start.cellSize : -start.cellSize) : 0;
      const fullY = axis === 'y' ? (dy > 0 ? start.cellSize : -start.cellSize) : 0;
      setDragPreview({
        tileId: start.tileId,
        x: fullX,
        y: fullY,
        companionTileId,
        companionX: -fullX,
        companionY: -fullY,
      });
      window.requestAnimationFrame(() => {
        setDragPreview({
          tileId: start.tileId,
          x: 0,
          y: 0,
          companionTileId,
          companionX: 0,
          companionY: 0,
          returning: true,
        });
      });
      window.setTimeout(() => setDragPreview(null), 320);
      return true;
    }

    const animatedIds = new Set(
      [start.tileId, companionTileId].filter((id): id is string => Boolean(id)),
    );
    setSwapAnimationTileIds(animatedIds);
    if (swapAnimationTimerRef.current !== null) {
      window.clearTimeout(swapAnimationTimerRef.current);
    }
    swapAnimationTimerRef.current = window.setTimeout(() => {
      swapAnimationTimerRef.current = null;
      setSwapAnimationTileIds(new Set());
    }, 460);
    setDragPreview(null);
    onSwapCells({ r: start.r, c: start.c }, { r: toR, c: toC });
    return true;
  };

  const handleTilePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const start = pointerStartRef.current;
    if (!start || start.pointerId !== e.pointerId) return;
    e.preventDefault();
    const rawX = e.clientX - start.x;
    const rawY = e.clientY - start.y;
    const absX = Math.abs(rawX);
    const absY = Math.abs(rawY);
    if (!start.axis && Math.max(absX, absY) >= 4) {
      start.axis = absX > absY ? 'x' : 'y';
    }
    const axis = start.axis;
    const maxTravel = start.cellSize * 0.92;
    const x = axis === 'x' ? Math.max(-maxTravel, Math.min(maxTravel, rawX)) : 0;
    const y = axis === 'y' ? Math.max(-maxTravel, Math.min(maxTravel, rawY)) : 0;
    const direction = axis === 'x' ? (x >= 0 ? 1 : -1) : y >= 0 ? 1 : -1;
    const toR = start.r + (axis === 'y' ? direction : 0);
    const toC = start.c + (axis === 'x' ? direction : 0);
    const companionTileId =
      toR >= 0 && toR < GRID_SIZE && toC >= 0 && toC < GRID_SIZE
        ? grid[toR]?.[toC]?.id
        : undefined;
    if (
      firstSwapTutorialMove &&
      !isTutorialPair({ r: start.r, c: start.c }, { r: toR, c: toC })
    ) {
      setDragPreview(null);
      return;
    }
    setDragPreview({
      tileId: start.tileId,
      x,
      y,
      companionTileId,
      companionX: companionTileId ? -x : 0,
      companionY: companionTileId ? -y : 0,
    });

    const travel = axis === 'x' ? Math.abs(x) : axis === 'y' ? Math.abs(y) : 0;
    const threshold = Math.max(SWIPE_THRESHOLD_PX, start.cellSize * 0.38);
    if (travel >= threshold) commitPointerSwap(start, x, y, e.currentTarget);
  };

  const handleTilePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const start = pointerStartRef.current;
    if (!start || start.pointerId !== e.pointerId) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const dist = Math.max(absX, absY);
    const threshold = Math.max(SWIPE_THRESHOLD_PX, start.cellSize * 0.38);

    if (dist >= threshold && commitPointerSwap(start, dx, dy, e.currentTarget)) {
      return;
    }

    pointerStartRef.current = null;
    setDragPreview(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (dist <= TAP_THRESHOLD_PX) {
      onCellClick(start.r, start.c);
    }
  };

  const handleTilePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    const start = pointerStartRef.current;
    if (!start || start.pointerId !== e.pointerId) return;
    pointerStartRef.current = null;
    setDragPreview(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const activeBoardTutorialMove = firstSwapTutorialMove ?? freeMoveRuleHintMove;
  const tutorialGestureActive =
    firstSwapTutorialMove !== null && dragPreview !== null;
  const tutorialMatchCellKeys = useMemo(
    () =>
      activeBoardTutorialMove
        ? previewTutorialMatchCellKeys(grid, activeBoardTutorialMove)
        : new Set<string>(),
    [activeBoardTutorialMove, grid],
  );
  const tutorialPrompt = fixedMatchTutorialStage === 'four'
    ? ui.game.freeMoveHint
    : fixedMatchTutorialStage === 'cross'
      ? ui.game.crossMoveHint
      : reviewTutorialActive
        ? ui.game.reviewTutorial
        : firstSwapTutorialMove
          ? ui.game.swapTutorial
          : freeMoveRuleHintMove
            ? ui.game.freeMoveHint
            : null;
  const tutorialProgress = fixedMatchTutorialStage === 'three'
    ? '1/3'
    : fixedMatchTutorialStage === 'four'
      ? '2/3'
      : fixedMatchTutorialStage === 'cross'
        ? '3/3'
        : null;
  const calloutStyle = () => {
    const focusRows = activeBoardTutorialMove
      ? [
          activeBoardTutorialMove.source.r,
          activeBoardTutorialMove.target.r,
          ...[...tutorialMatchCellKeys].map((key) => Number(key.split(':')[0])),
        ]
      : [0];
    const minRow = Math.min(...focusRows);
    const maxRow = Math.max(...focusRows);
    const placeAtBottom = minRow <= GRID_SIZE - 1 - maxRow;
    return {
      width: 'min(15rem, calc(100% - 1rem))',
      left: '50%',
      ...(placeAtBottom ? { bottom: '0.35rem' } : { top: '0.35rem' }),
      // Individual `translate` is independent from Framer Motion's animated
      // `transform`, so iOS cannot drop the horizontal centering mid-animation.
      translate: '-50% 0',
    };
  };

  return (
    <div
      ref={panelRootRef}
      className={cn(
        'relative flex h-full min-h-0 flex-col overflow-hidden px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))]',
        gridLocked && 'board-visuals-busy',
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <SkySparkleBackground variant="game" />
      </div>

      <motion.button
        type="button"
        onClick={() => {
          // An empty stamina-blocked board has nothing to abandon.
          if (playBlockedReason === 'stamina') onHome();
          else setHomeConfirmOpen(true);
        }}
        whileTap={MOTION_PRESS_TAP}
        className="absolute bottom-3 right-3 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/85 bg-white/82 text-sky-900 shadow-[0_6px_16px_rgba(14,116,178,0.22)] backdrop-blur"
        aria-label={t.gameSettings.home}
        aria-haspopup="dialog"
        aria-expanded={homeConfirmOpen}
      >
        <House size={20} strokeWidth={2.6} aria-hidden />
      </motion.button>

      <div className="relative z-10 flex shrink-0 items-stretch gap-1.5 pt-2.5">
        <HudPlaque
          className="min-w-0 flex-1 self-start overflow-visible"
          label={challengeMode === 'review' || challengeMode === 'category' ? modeLabel : t.hud.wordSet}
          value={
            <div className="relative min-w-0">
              <div className="flex flex-wrap items-end gap-x-2.5 gap-y-1">
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={MOTION_SPRING_SNAPPY}
                >
                  {challengeMode === 'category' && activeCategoryPool ? (
                    <span className="inline-flex rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.08em] text-sky-700 ring-1 ring-sky-200/80">
                      Round {activeCategoryPool.cycle}
                    </span>
                  ) : (
                    <HudStatNumber>
                      {challengeMode === 'review' ? (
                        <span aria-hidden>🧠</span>
                      ) : (
                        t.hud.wordSetCount(clearedSets + 1)
                      )}
                    </HudStatNumber>
                  )}
                </motion.div>
                {challengeMode === 'category' && activeCategoryPool ? (
                  <span className="mb-0.5 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-black tabular-nums text-sky-700 ring-1 ring-sky-200/80">
                    {activeCategoryPool.clearedInCycle}/{activeCategoryPool.items.length}
                  </span>
                ) : null}
                {challengeMode === 'random' ? (
                <span
                  className="mb-0.5 inline-flex items-center gap-1 self-center rounded-full bg-rose-50/90 px-1.5 py-0.5 ring-1 ring-rose-200/70"
                  aria-label={`${t.hud.stamina} ${t.hud.staminaCount(stamina, STAMINA_MAX)}`}
                  title={`${t.hud.stamina} ${t.hud.staminaCount(stamina, STAMINA_MAX)}`}
                >
                  <span className="inline-flex items-center gap-px text-[13px] leading-none">
                    <AnimatePresence initial={false} mode="popLayout">
                      {Array.from({ length: STAMINA_MAX }, (_, i) => {
                        const filled = i < stamina;
                        return (
                          <motion.span
                            key={`stamina-heart-${i}-${filled ? 'on' : 'off'}`}
                            layout
                            className="inline-block origin-center will-change-transform"
                            initial={{ opacity: 0, scale: 0.35 }}
                            animate={{
                              opacity: filled ? 1 : 0.55,
                              scale: 1,
                            }}
                            exit={{ opacity: 0, scale: 0.35 }}
                            transition={{ duration: 0.28, ease: IOS_EASE }}
                            aria-hidden
                          >
                            {filled ? '❤️' : '♡'}
                          </motion.span>
                        );
                      })}
                    </AnimatePresence>
                  </span>
                  <span className="text-[10px] font-black tabular-nums text-rose-700/90">
                    {t.hud.staminaCount(stamina, STAMINA_MAX)}
                  </span>
                  {staminaBanked > 0 && (
                    <span
                      className="rounded-full bg-amber-200 px-1 py-0.5 text-[9px] font-black text-amber-900"
                      aria-label={`Reserved stamina ${staminaBanked}`}
                      title={`Reserved stamina ${staminaBanked}`}
                    >
                      🎁+{staminaBanked}
                    </span>
                  )}
                </span>
                ) : null}
              </div>
              <div className="mt-1.5 min-w-0 overflow-hidden py-0.5">
                <motion.div
                  key={`${challengeMode}-${gameItems.map((it) => it.id).join('|')}`}
                  className="flex flex-nowrap items-center gap-1 overflow-x-auto overflow-y-visible no-scrollbar px-0.5 pb-0.5 pr-1"
                  variants={MOTION_STAGGER_TIGHT_CONTAINER}
                  initial="hidden"
                  animate="visible"
                >
                  {gameItems.map((it) => {
                    const hits = itemHitCount[it.id] ?? 0;
                    const completed = hits >= hitsNeeded;
                    const revealed = revealedItemId === it.id;
                    return (
                      <motion.button
                        key={it.id}
                        type="button"
                        variants={MOTION_STAGGER_TIGHT_ITEM}
                        ref={(el) => {
                          if (el) wordIconRefs.current.set(it.id, el);
                          else wordIconRefs.current.delete(it.id);
                        }}
                        onClick={() =>
                          setRevealedItemId((prev) => (prev === it.id ? null : it.id))
                        }
                        aria-label={it.word}
                        aria-pressed={revealed}
                        animate={{ scale: revealed ? 1.06 : 1 }}
                        whileTap={{ scale: revealed ? 1.02 : 0.96 }}
                        transition={MOTION_SPRING_SNAPPY}
                        style={{ transformOrigin: 'center center' }}
                        className={cn(
                          'flex h-[2.5rem] w-[2rem] shrink-0 flex-col items-center justify-center rounded-lg border border-white/80 bg-white/70 px-0.5 py-0.5 shadow-sm',
                          revealed && 'z-[1] border-sky-300 bg-white ring-1 ring-sky-400/70',
                          completed && 'border-emerald-200 bg-emerald-50/90',
                        )}
                      >
                        {it.imgSrc ? (
                          <img src={it.imgSrc} alt="" className="h-5 w-5 shrink-0 object-contain" />
                        ) : (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-base leading-none">
                            {it.emoji ?? '·'}
                          </span>
                        )}
                        {completed ? (
                          <motion.span
                            className="mt-0.5 text-[11px] font-black leading-none text-emerald-600"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            aria-label={ui.game.complete}
                          >
                            ✓
                          </motion.span>
                        ) : (
                          <span className="mt-0.5 text-[9px] font-bold leading-none text-gray-400">
                            {hits}/{hitsNeeded}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
              {revealedWord && (
                <motion.div
                  className="mt-1 text-balance text-[10px] font-bold leading-snug text-sky-800 break-words"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                >
                  {revealedWord}
                </motion.div>
              )}
            </div>
          }
        />

        <div className="relative flex w-[108px] shrink-0 flex-col self-stretch gap-1.5">
          <motion.button
            ref={modePickerButtonRef}
            type="button"
            onClick={() => {
              setModePickerOpen(true);
            }}
            whileTap={MOTION_PRESS_TAP}
            className={cn(
              'inline-flex w-full items-center gap-1 rounded-full border border-white/80 bg-white/75 px-1.5 py-1.5 text-[10px] font-bold text-sky-900 shadow-sm backdrop-blur',
              modePickerGuidePlaying && 'first-time-guide-target-pulse',
            )}
            aria-label={t.hud.modePickerAria}
            aria-haspopup="dialog"
            aria-expanded={modePickerOpen}
          >
            <Settings size={14} className="shrink-0 opacity-80" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-left">{modeLabel}</span>
            <ChevronDown size={12} className="shrink-0 opacity-60" aria-hidden />
          </motion.button>
          <GuidedTapHint
            visible={modePickerGuidePlaying}
            targetRef={modePickerButtonRef}
            fingerOffset={{ x: 22, y: 32 }}
          />
          {challengeMode === 'review' && onToggleReviewPause ? (
            <motion.button
              type="button"
              onClick={onToggleReviewPause}
              whileTap={MOTION_PRESS_TAP}
              className={cn(
                'inline-flex w-full items-center justify-center gap-1 rounded-full border px-1.5 py-1.5 text-[10px] font-black shadow-sm backdrop-blur',
                reviewPaused
                  ? 'border-emerald-300/90 bg-emerald-50 text-emerald-900'
                  : 'border-white/80 bg-white/75 text-sky-900',
              )}
              aria-pressed={reviewPaused}
              aria-label={reviewPaused ? t.modes.reviewResume : t.modes.reviewPause}
            >
              {reviewPaused ? (
                <Play size={12} className="shrink-0" aria-hidden />
              ) : (
                <Pause size={12} className="shrink-0" aria-hidden />
              )}
              {reviewPaused ? t.modes.reviewResume : t.modes.reviewPause}
            </motion.button>
          ) : null}
          {movesLeft !== null ? (
            <StepsHud steps={movesLeft} bonusFlashKey={movesBonusFlashKey} className="mt-auto w-full" />
          ) : (
            <div className="mt-auto" />
          )}
        </div>
      </div>

      {pendingForcedReview && challengeMode !== 'review' && onResumeForcedReview ? (
        <div className="relative z-10 mt-2 flex items-center justify-between gap-2 rounded-2xl border border-amber-300/80 bg-amber-50/95 px-3 py-2 shadow-sm">
          <span className="text-xs font-black text-amber-900">{t.modes.pendingReviewBanner}</span>
          <button
            type="button"
            onClick={onResumeForcedReview}
            className="shrink-0 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-black text-white shadow-sm"
          >
            {t.modes.pendingReviewCta}
          </button>
        </div>
      ) : null}

      {/* Center the board; overlays are absolute so they won't reflow this slot. */}
      <div
        className={cn(
          'relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center pb-2 pt-1',
          pendingForcedReview && challengeMode !== 'review' ? 'mt-3' : 'mt-9',
        )}
      >
        {!canPlay ? (
          playBlockedReason === 'stamina' ? null : (
          <div className="flex max-w-sm flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-white/70 bg-white/55 px-5 py-10 text-center backdrop-blur-sm">
            {challengeMode === 'review' ? (
              <>
                <p className="text-sm font-bold text-sky-950">{t.modes.insufficientReview}</p>
                <p className="mt-2 text-xs font-medium text-sky-800/80">
                  {t.modes.insufficientReviewHint}
                </p>
                {onGoAdventure ? (
                  <button
                    type="button"
                    onClick={onGoAdventure}
                    className="candy-sheet-action-btn candy-sheet-action-btn-pink mt-4 w-full"
                  >
                    {t.modes.goAdventureCta}
                  </button>
                ) : null}
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-sky-950">{t.modes.insufficientPool}</p>
                <p className="mt-2 text-xs font-medium text-sky-800/80">
                  {t.modes.insufficientPoolHint}
                </p>
              </>
            )}
          </div>
          )
        ) : (
          <div
            className="relative flex w-full max-w-[min(100%,min(92vw,480px))] shrink-0 flex-col"
            ref={popBoardRef}
          >
            {timedHuntActive && (
              <div
                className={cn(
                  'absolute inset-x-0 bottom-full z-20 mb-2 space-y-1.5',
                  reviewPaused && 'pointer-events-none select-none',
                )}
                aria-hidden={reviewPaused}
              >
                {reviewPaused ? (
                  <div className="flex h-[4.5rem] w-full items-center justify-center rounded-2xl border border-amber-200/90 bg-amber-50/95 text-[2rem] leading-none">
                    <span aria-hidden>🙈</span>
                  </div>
                ) : funTargetItem ? (
                  <div className="pointer-events-none">
                    <TimedTargetBanner
                      item={funTargetItem}
                      pulseKey={funTargetKey}
                      countdownSec={funCountdown}
                      countdownMaxSec={funCountdownMaxSec}
                    />
                  </div>
                ) : (
                  <div className="flex h-[4.5rem] w-full items-center justify-center rounded-2xl border border-amber-200/90 bg-amber-50/95 text-sm font-bold text-amber-800">
                    {reviveActive ? t.adventure.reviveTitle : t.modes.reviewMode}
                  </div>
                )}
                {reviveActive && !reviewPaused && (
                  <div className="flex items-center justify-between gap-2 px-1">
                    <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-black text-emerald-700 shadow-sm">
                      {t.adventure.reviveProgress(reviveCorrects, reviveNeeded)}
                    </span>
                    <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-black text-rose-700 shadow-sm">
                      {t.adventure.reviveStrike(reviveWrongs, reviveWrongLimit)}
                    </span>
                    {onReviveExit && (
                      <button
                        type="button"
                        onClick={onReviveExit}
                        className="rounded-full border border-white/90 bg-white/90 px-2.5 py-1 text-[10px] font-bold text-sky-900 shadow-sm"
                        aria-label={t.adventure.reviveExitAria}
                      >
                        {t.adventure.reviveExit}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
            <div
              className={cn(
                'relative z-0 aspect-square w-full',
                hideTileEmojisForIntro ? 'overflow-hidden' : 'overflow-visible',
              )}
              ref={boardInnerRef}
            >
              <AnimatePresence>
                {activeBoardTutorialMove &&
                  tutorialPrompt &&
                  !tutorialGestureActive &&
                  (!timedHuntActive || reviewTutorialActive) && (
                  <motion.div
                    key={`tutorial-${fixedMatchTutorialStage ?? 'natural'}`}
                    className="pointer-events-none absolute z-[52] max-w-[calc(100%-1rem)] whitespace-pre-line rounded-[1.6rem] border-[3px] border-amber-200 bg-amber-50/96 px-4 py-3 text-center text-sm font-black leading-[1.45] text-amber-900 shadow-[0_8px_26px_rgba(120,53,15,0.24)] backdrop-blur"
                    style={calloutStyle()}
                    initial={{ opacity: 0, scale: 0.88, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    role="status"
                    aria-live="polite"
                  >
                    {tutorialProgress && (
                      <span className="mb-1.5 inline-block rounded-full bg-amber-200/75 px-2.5 py-0.5 text-[10px] tracking-[0.08em] text-amber-900">
                        {tutorialProgress}
                      </span>
                    )}
                    <div>{tutorialPrompt}</div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div
                className={cn(
                  'grid h-full w-full grid-cols-7 gap-0.5 touch-none',
                  reviewPaused && 'pointer-events-none select-none',
                )}
                data-shelf-grid
                aria-hidden={reviewPaused}
              >
                {grid.flatMap((row, r) =>
                  row.map((tile, c) => {
                    const item = itemById.get(tile.itemId);
                    const cellKey = `${r}:${c}`;
                    const isSel = selected?.r === r && selected?.c === c;
                    const isHint =
                      !freeMoveRuleHintMove && (
                        (hintMove?.a.r === r && hintMove?.a.c === c) ||
                        (hintMove?.b.r === r && hintMove?.b.c === c)
                      );
                    const isTutorialSource =
                      firstSwapTutorialMove !== null &&
                      cellEquals({ r, c }, firstSwapTutorialMove.source);
                    const isTutorialTarget =
                      firstSwapTutorialMove !== null &&
                      cellEquals({ r, c }, firstSwapTutorialMove.target);
                    const isFreeMoveHint =
                      freeMoveRuleHintMove !== null &&
                      (cellEquals({ r, c }, freeMoveRuleHintMove.source) ||
                        cellEquals({ r, c }, freeMoveRuleHintMove.target));
                    const isTutorialMatchCell =
                      tutorialMatchCellKeys.has(cellKey) &&
                      !isTutorialSource &&
                      !isTutorialTarget;
                    const isFixedTutorialFocus =
                      activeBoardTutorialMove !== null &&
                      (cellEquals({ r, c }, activeBoardTutorialMove.source) ||
                        cellEquals({ r, c }, activeBoardTutorialMove.target) ||
                        tutorialMatchCellKeys.has(cellKey));
                    const isClearing = clearingKeySet?.has(cellKey) ?? false;
                    const clearDelay = isClearing && isLineClearAnim
                      ? lineClearDelaySec?.get(cellKey)
                      : undefined;
                    return (
                      <button
                        key={cellKey}
                        ref={(node) => {
                          if (isTutorialSource) tutorialSourceButtonRef.current = node;
                          if (isTutorialTarget) tutorialTargetButtonRef.current = node;
                        }}
                        type="button"
                        onPointerDown={(e) => handleTilePointerDown(r, c, tile.id, e)}
                        onPointerMove={handleTilePointerMove}
                        onPointerUp={handleTilePointerUp}
                        onPointerCancel={handleTilePointerCancel}
                        className={cn(
                          'bubble-tile relative aspect-square w-full min-h-[44px] grid place-items-center rounded-full border border-white/60 bg-white/38 text-[clamp(1.9rem,7.5vw,2.9rem)] shadow-[inset_0_1px_3px_rgba(255,255,255,0.75),0_2px_8px_rgba(56,189,248,0.16)]',
                          isSel && !reviewPaused && 'z-[1] border-sky-300/80 bg-white/30 ring-2 ring-sky-500/65 shadow-[inset_0_1px_4px_rgba(255,255,255,0.75),0_0_0_2px_rgba(14,165,233,0.2),0_4px_12px_rgba(14,165,233,0.22)]',
                          isHint && !reviewPaused && 'border-amber-200/90 bg-amber-50/25 ring-2 ring-amber-400/90',
                          isTutorialSource &&
                            'z-[2] border-sky-200 bg-sky-50/45 ring-[3px] ring-sky-400/90 shadow-[0_0_18px_rgba(56,189,248,0.58)]',
                          isTutorialTarget &&
                            'z-[2] border-amber-200 bg-amber-50/45 ring-[3px] ring-amber-400/90 shadow-[0_0_18px_rgba(251,191,36,0.58)]',
                          isTutorialMatchCell &&
                            'z-[2] border-amber-100 bg-amber-50/35 ring-2 ring-amber-300/85 shadow-[0_0_14px_rgba(251,191,36,0.45)]',
                          isFreeMoveHint &&
                            'z-[3] border-fuchsia-200 bg-fuchsia-50/55 ring-[3px] ring-fuchsia-500/95 shadow-[0_0_22px_rgba(217,70,239,0.7)] animate-pulse',
                          (fixedMatchTutorialStage !== null || reviewTutorialActive) &&
                            activeBoardTutorialMove !== null &&
                            !tutorialGestureActive &&
                            !isFixedTutorialFocus &&
                            'opacity-35 saturate-50',
                          isClearing && 'z-10',
                          isClearing &&
                            (isLineClearAnim ? 'bubble-tile--clearing' : 'bubble-tile--flip-clear'),
                        )}
                        style={clearDelay ? { animationDelay: clearDelay } : undefined}
                        aria-label={reviewPaused ? t.modes.reviewPausedTitle : (item?.word ?? t.hud.tileAria)}
                      >
                        <motion.div
                          layoutId={
                            swapAnimationTileIds.has(tile.id)
                              ? `board-emoji-${tile.id}`
                              : undefined
                          }
                          className={cn(
                            'relative grid h-full w-full place-items-center',
                            dragPreview?.tileId === tile.id && 'z-20',
                          )}
                          animate={{
                            x:
                              dragPreview?.tileId === tile.id
                                ? dragPreview.x
                                : dragPreview?.companionTileId === tile.id
                                  ? dragPreview.companionX ?? 0
                                  : 0,
                            y:
                              dragPreview?.tileId === tile.id
                                ? dragPreview.y
                                : dragPreview?.companionTileId === tile.id
                                  ? dragPreview.companionY ?? 0
                                  : 0,
                            scale: dragPreview?.tileId === tile.id ? 1.08 : 1,
                          }}
                          transition={
                            dragPreview?.returning &&
                            (dragPreview.tileId === tile.id ||
                              dragPreview.companionTileId === tile.id)
                              ? MOTION_SPRING_SNAPPY
                              : dragPreview?.tileId === tile.id ||
                                  dragPreview?.companionTileId === tile.id
                                ? { duration: 0.03 }
                              : MOTION_SPRING_SNAPPY
                          }
                        >
                          <div
                            data-tile-id={tile.id}
                            className={cn(
                              'bubble-emoji-sprite grid place-items-center',
                              hideTileEmojisForIntro && 'opacity-0',
                              isClearing &&
                                (isLineClearAnim
                                  ? 'bubble-emoji-sprite--clearing-line'
                                  : 'bubble-emoji-sprite--flip-clear'),
                            )}
                            style={
                              clearDelay
                                ? { animationDelay: clearDelay }
                                : undefined
                            }
                          >
                            {reviewPaused ? (
                              <span className="drop-shadow-sm" aria-hidden>
                                🙈
                              </span>
                            ) : item?.imgSrc ? (
                              <img
                                src={item.imgSrc}
                                alt={item.word}
                                className="h-[clamp(2.4rem,7.6vw,2.95rem)] w-[clamp(2.4rem,7.6vw,2.95rem)] select-none object-contain drop-shadow-sm"
                                loading="eager"
                                decoding="async"
                                draggable={false}
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="select-none drop-shadow-sm">
                                {item?.emoji ?? '·'}
                              </span>
                            )}
                          </div>
                        </motion.div>
                      </button>
                    );
                  }),
                )}
              </div>

              {reviewPaused ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-3 z-30 flex justify-center px-4">
                  {onToggleReviewPause ? (
                    <motion.button
                      type="button"
                      whileTap={MOTION_PRESS_TAP}
                      onClick={onToggleReviewPause}
                      className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-emerald-400/50 bg-emerald-500 px-5 py-2.5 text-sm font-black text-white shadow-lg"
                    >
                      <Play size={14} aria-hidden />
                      {t.modes.reviewResume}
                    </motion.button>
                  ) : null}
                </div>
              ) : null}

              {showShelfCascade && !reviewPaused && (
                <BoardShelfEmojiLayer
                  grid={grid}
                  itemById={itemById}
                  boardRef={boardInnerRef}
                  onComplete={() => shelfCompleteRef.current()}
                />
              )}

              <GuidedTapHint
                visible={Boolean(firstSwapTutorialMove) && !gridLocked && canPlay}
                sourceRef={tutorialSourceButtonRef}
                targetRef={tutorialTargetButtonRef}
                mode="drag"
              />

              {lineShockwave && !reviewPaused && (
                <LineShockwave
                  cells={lineShockwave.cells}
                  boardRef={boardInnerRef}
                  burstKey={lineShockwave.key}
                  origin={lineShockwave.origin}
                />
              )}
            </div>

            <BoardBottomSparkles />

            <AnimatePresence>
              {popWord && (
                <PopWordOverlay
                  key={`${popWord.word}-${popWord.originCell?.r ?? 'x'}-${popWord.originCell?.c ?? 'x'}`}
                  popWord={popWord}
                  locale={locale}
                />
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <ModePickerSheet
        open={modePickerOpen}
        onClose={() => setModePickerOpen(false)}
        challengeMode={challengeMode}
        onChallengeModeChange={onChallengeModeChange}
        onOpenSayBlast={onOpenSayBlast}
        onOpenCategoryHub={() => setCategoryHubOpen(true)}
        onShuffleWords={onShuffleWords}
        onRestart={onRestart}
        canPlay={canPlay}
        categoryUnlocked={categoryUnlocked}
        moodUnlocked={moodUnlocked}
        moodCanStartNew={moodCanStartNew}
        sayBlastReady={sayBlastReady}
        guideTarget={featureGuideTarget}
        guidePlayCount={featureGuidePlayCount}
        onGuidePlaybackStart={onFeatureGuidePlaybackStart}
      />

      <CategoryHubSheet
        open={categoryHubOpen}
        onClose={() => setCategoryHubOpen(false)}
        onBackToModes={() => {
          setCategoryHubOpen(false);
          setModePickerOpen(true);
        }}
        pools={challengePools}
        sections={categoryBrowseSections}
        selectedCategoryId={selectedCategoryId}
        onSelectCategory={(id) => {
          onCategoryChange(id);
          onChallengeModeChange('category');
          setCategoryHubOpen(false);
        }}
      />

      <AnimatePresence>
        {homeConfirmOpen && (
          <motion.div
            ref={homeConfirmDialogRef}
            key="home-confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: IOS_EASE }}
            className="fixed inset-0 z-[160] flex items-center justify-center bg-black/45 px-6"
            role="alertdialog"
            aria-modal="true"
            aria-label={t.gameSettings.homeConfirmTitle}
            tabIndex={-1}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={MOTION_SPRING_SNAPPY}
              className="candy-modal-surface"
            >
              <div className="candy-modal-title">
                {t.gameSettings.homeConfirmTitle}
              </div>
              <div className="candy-modal-body">
                {t.gameSettings.homeConfirmBody}
              </div>
              <div className="candy-modal-actions">
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={() => setHomeConfirmOpen(false)}
                  className="candy-sheet-action-btn candy-sheet-action-btn-pink w-full"
                >
                  {t.gameSettings.homeConfirmStay}
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={onHome}
                  className="candy-sheet-action-btn candy-sheet-action-btn-danger w-full"
                >
                  {t.gameSettings.homeConfirmLeave}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {linkGeom && wordLink && (
        <WordLinkChain
          from={linkGeom.from}
          to={linkGeom.to}
          emoji={itemById.get(wordLink.itemId)?.emoji}
          imgSrc={itemById.get(wordLink.itemId)?.imgSrc}
          burstKey={wordLink.burstKey}
          onDone={onWordLinkDone}
        />
      )}
    </div>
  );
}
