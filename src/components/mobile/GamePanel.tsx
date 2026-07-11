import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOTION_SPRING_SNAPPY, MOTION_TWEEN_MED, MOTION_PRESS_TAP } from '../../lib/motionPresets';
import {
  MOTION_STAGGER_TIGHT_CONTAINER,
  MOTION_STAGGER_TIGHT_ITEM,
  MOTION_WORD_POP,
} from '../../lib/motionChoreography';
import { ChevronDown, Settings } from 'lucide-react';
import { cellCenterOffset, cellCenterPx } from '../../lib/gridLayout';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';
import { BoardBottomSparkles } from './BoardBottomSparkles';
import { MatchClearEnergy } from './MatchClearEnergy';
import { SkySparkleBackground } from '../SkySparkleBackground';
import { HudPlaque, HudStatNumber } from './HudPlaque';
import { WordLinkChain } from './WordLinkChain';
import { FunTargetBanner } from './FunTargetBanner';
import { ModePickerSheet } from './ModePickerSheet';
import { ScoreHud, type ScorePop } from './ScoreHud';
import type { Cell, ChallengeMode, Tile, WordItem } from '../../types/game';
import type { RefillBurst } from '../../lib/boardRefill';
import { useBoardGravityRefill } from './useBoardGravityRefill';

const GRID_SIZE = 7;
const SWIPE_THRESHOLD_PX = 16;
const TAP_THRESHOLD_PX = 10;
const SHELF_STEP_MS = 200;

function shelfIntroTotalMs(): number {
  return (GRID_SIZE - 1) * SHELF_STEP_MS + 120;
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
  return GRID_SIZE - 1 - r;
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
    if (!board || !layer) return;

    const metrics = measureShelfMetrics(board);
    if (!metrics) return;

    const totalMs = shelfIntroTotalMs();
    const children = layer.children;

    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const el = children[i] as HTMLElement | undefined;
      if (!el) continue;

      const spawn = shelfSpawnStep(slot.r);
      const delay = spawn * SHELF_STEP_MS;
      const duration = Math.max(slot.r * SHELF_STEP_MS, 1);
      const x = metrics.originX + slot.c * metrics.stepX;
      const y0 = metrics.originY;
      const y1 = metrics.originY + slot.r * metrics.stepY;

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

    const timerId = window.setTimeout(() => {
      onCompleteRef.current();
    }, totalMs);

    return () => {
      window.clearTimeout(timerId);
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
  }, [boardRef, slots]);

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
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
  x: number;
  y: number;
  pointerId: number;
};

type ChallengePool = {
  id: string;
  label: string;
  subtitle: string;
};

export type WordLinkPayload = {
  itemId: string;
  originCell: Cell;
  burstKey: number;
};

type GamePanelProps = {
  gridRef: React.RefObject<HTMLDivElement | null>;
  modesButtonsRef: React.RefObject<HTMLButtonElement | null>;
  onRestart: () => void;
  score: number;
  scorePops: ScorePop[];
  level: number;
  gameItems: WordItem[];
  itemHitCount: Record<string, number>;
  challengeMode: ChallengeMode;
  modeLabel: string;
  funTargetItem: WordItem | null;
  funTargetKey: number;
  funCountdown: number;
  canPlay: boolean;
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
  challengePools: ChallengePool[];
  selectedCategoryId: string;
  onCategoryChange: (id: string) => void;
  onShuffleWords: () => void;
  boardIntroActive?: boolean;
  onBoardIntroComplete?: () => void;
  refillBurst?: RefillBurst | null;
  onRefillActiveChange?: (active: boolean) => void;
};

type PopWordPayload = {
  word: string;
  cn?: string;
  emoji?: string;
  imgSrc?: string;
  originCell?: Cell;
};

function PopWordOverlay({
  popWord,
  boardRef,
  showChinese,
}: {
  popWord: PopWordPayload;
  boardRef: React.RefObject<HTMLDivElement | null>;
  showChinese: boolean;
}) {
  const exitFromRef = useRef({ x: 0, y: 0, scale: 0.16 });
  const [from, setFrom] = useState({ x: 0, y: 0, scale: 0.16 });
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const board = boardRef.current;
    const offset =
      board && popWord.originCell
        ? cellCenterOffset(board.clientWidth, board.clientHeight, popWord.originCell)
        : { x: 0, y: 0, scale: 0.18 };
    exitFromRef.current = offset;
    setFrom(offset);
    setReady(true);
  }, [popWord, boardRef]);

  if (!ready) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      custom={from}
      variants={MOTION_WORD_POP}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="rounded-[24px] border border-white/90 bg-white/78 px-6 py-4 text-center text-sky-950 shadow-xl shadow-black/10 backdrop-blur-md"
        initial={{ rotate: -3 }}
        animate={{ rotate: [ -3, 2, 0 ] }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        {popWord.imgSrc ? (
          <img
            src={popWord.imgSrc}
            alt=""
            className="mx-auto h-14 w-14 object-contain drop-shadow-sm"
            loading="eager"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        ) : popWord.emoji ? (
          <div className="text-4xl leading-none" aria-hidden>
            {popWord.emoji}
          </div>
        ) : null}
        <div
          className={cn(
            'text-2xl font-black tracking-tight',
            popWord.imgSrc || popWord.emoji ? 'mt-2' : 'mt-0',
          )}
        >
          {popWord.word}
        </div>
        {showChinese && !!popWord.cn && (
          <div className="mt-1 text-xs font-semibold text-sky-700/75">{popWord.cn}</div>
        )}
      </motion.div>
    </motion.div>
  );
}

export function GamePanel({
  gridRef,
  modesButtonsRef,
  onRestart,
  score,
  scorePops,
  level,
  gameItems,
  itemHitCount,
  challengeMode,
  modeLabel,
  funTargetItem,
  funTargetKey,
  funCountdown,
  canPlay,
  grid,
  itemById,
  selected,
  hintMove,
  popWord,
  matchShakeKey,
  matchClearCells,
  matchClearKey,
  gridLocked,
  wordLink,
  onWordLinkDone,
  onCellClick,
  onSwapCells,
  onChallengeModeChange,
  challengePools,
  selectedCategoryId,
  onCategoryChange,
  onShuffleWords,
  boardIntroActive = false,
  onBoardIntroComplete,
  refillBurst = null,
  onRefillActiveChange,
}: GamePanelProps) {
  const { t, showChinese } = useI18n();
  const [modePickerOpen, setModePickerOpen] = useState(false);
  const pointerStartRef = useRef<PointerStart | null>(null);
  const panelRootRef = useRef<HTMLDivElement | null>(null);
  const popBoardRef = useRef<HTMLDivElement | null>(null);
  const wordIconRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [linkGeom, setLinkGeom] = useState<{ from: { x: number; y: number }; to: { x: number; y: number } } | null>(
    null,
  );
  const [bgShaking, setBgShaking] = useState(false);
  const [revealedItemId, setRevealedItemId] = useState<string | null>(null);
  const [shelfCascadeDone, setShelfCascadeDone] = useState(!boardIntroActive);
  const boardInnerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const showShelfCascade = boardIntroActive && !prefersReducedMotion && !shelfCascadeDone;

  const refillActive = useBoardGravityRefill({
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

  useEffect(() => {
    if (!boardIntroActive) {
      setShelfCascadeDone(true);
      return;
    }
    if (prefersReducedMotion) {
      setShelfCascadeDone(true);
      onBoardIntroComplete?.();
      return;
    }

    setShelfCascadeDone(false);
  }, [boardIntroActive, onBoardIntroComplete, prefersReducedMotion]);

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
    if (matchShakeKey === 0) return;
    setBgShaking(true);
    const t = window.setTimeout(() => setBgShaking(false), 400);
    return () => window.clearTimeout(t);
  }, [matchShakeKey]);

  useEffect(() => {
    setRevealedItemId(null);
  }, [gameItems]);

  const revealedWord = useMemo(() => {
    if (!revealedItemId) return null;
    return gameItems.find((it) => it.id === revealedItemId)?.word ?? null;
  }, [gameItems, revealedItemId]);

  useEffect(() => {
    if (!revealedItemId) return;
    const el = wordIconRefs.current.get(revealedItemId);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [revealedItemId]);

  const isClearingCell = (r: number, c: number) =>
    matchClearCells?.some((cell) => cell.r === r && cell.c === c) ?? false;

  const isLineClearAnim = (matchClearCells?.length ?? 0) >= GRID_SIZE;

  const handleTilePointerDown = (r: number, c: number, e: React.PointerEvent<HTMLButtonElement>) => {
    if (!canPlay || gridLocked || e.button !== 0) return;
    e.preventDefault();
    pointerStartRef.current = {
      r,
      c,
      x: e.clientX,
      y: e.clientY,
      pointerId: e.pointerId,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleTilePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const start = pointerStartRef.current;
    if (!start || start.pointerId !== e.pointerId) return;
    pointerStartRef.current = null;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const dist = Math.max(absX, absY);

    if (dist >= SWIPE_THRESHOLD_PX) {
      let toR = start.r;
      let toC = start.c;
      if (absX > absY) {
        toC = start.c + (dx > 0 ? 1 : -1);
      } else {
        toR = start.r + (dy > 0 ? 1 : -1);
      }
      if (toR >= 0 && toR < GRID_SIZE && toC >= 0 && toC < GRID_SIZE) {
        onSwapCells({ r: start.r, c: start.c }, { r: toR, c: toC });
      }
      return;
    }

    if (dist <= TAP_THRESHOLD_PX) {
      onCellClick(start.r, start.c);
    }
  };

  const handleTilePointerCancel = (e: React.PointerEvent<HTMLButtonElement>) => {
    const start = pointerStartRef.current;
    if (!start || start.pointerId !== e.pointerId) return;
    pointerStartRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={panelRootRef}
      className="relative flex h-full min-h-0 flex-col overflow-hidden px-3 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))]"
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={
          bgShaking
            ? { x: [0, -5, 6, -4, 3, -2, 0], y: [0, 3, -4, 3, -2, 1, 0] }
            : { x: 0, y: 0 }
        }
        transition={MOTION_TWEEN_MED}
      >
        <SkySparkleBackground variant="game" />
      </motion.div>

      <div className="relative z-10 flex shrink-0 items-stretch gap-2 pt-2.5">
        <HudPlaque
          className="min-w-0 flex-1 self-start overflow-visible"
          label={t.hud.wordSet}
          value={
            <div className="min-w-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={MOTION_SPRING_SNAPPY}
              >
                <HudStatNumber>{level}</HudStatNumber>
              </motion.div>
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
                        )}
                      >
                        {it.imgSrc ? (
                          <img src={it.imgSrc} alt="" className="h-5 w-5 shrink-0 object-contain" />
                        ) : (
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center text-base leading-none">
                            {it.emoji ?? '·'}
                          </span>
                        )}
                        <span className="mt-0.5 text-[9px] font-bold leading-none text-gray-400">
                          {hits}/3
                        </span>
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

        <div className="flex w-[128px] shrink-0 flex-col self-stretch">
          <motion.button
            ref={modesButtonsRef}
            type="button"
            onClick={() => setModePickerOpen(true)}
            whileTap={MOTION_PRESS_TAP}
            className="inline-flex w-full items-center gap-1 rounded-full border border-white/80 bg-white/75 px-2.5 py-1.5 text-[10px] font-bold text-sky-900 shadow-sm backdrop-blur"
            aria-label={t.hud.modePickerAria}
            aria-haspopup="dialog"
            aria-expanded={modePickerOpen}
          >
            <Settings size={14} className="shrink-0 opacity-80" aria-hidden />
            <span className="min-w-0 flex-1 truncate text-left">{modeLabel}</span>
            <ChevronDown size={12} className="shrink-0 opacity-60" aria-hidden />
          </motion.button>
          <ScoreHud score={score} pops={scorePops} className="mt-auto w-full" />
        </div>
      </div>

      <div
        className="relative z-10 mt-9 flex min-h-0 flex-1 flex-col items-center justify-center pb-2 pt-1"
        ref={gridRef}
      >
        {!canPlay ? (
          <div className="flex max-w-sm flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-white/70 bg-white/55 px-5 py-10 text-center backdrop-blur-sm">
            <p className="text-sm font-bold text-sky-950">
              {challengeMode === 'review' ? t.modes.insufficientReview : t.modes.insufficientPool}
            </p>
            <p className="mt-2 text-xs font-medium text-sky-800/80">
              {challengeMode === 'review'
                ? t.modes.insufficientReviewHint
                : t.modes.insufficientPoolHint}
            </p>
          </div>
        ) : (
          <div className="relative w-full max-w-[min(100%,min(92vw,480px))] shrink-0" ref={popBoardRef}>
            {challengeMode === 'fun' && funTargetItem && (
              <div className="pointer-events-none absolute bottom-full left-0 right-0 z-20 mb-2">
                <FunTargetBanner
                  item={funTargetItem}
                  pulseKey={funTargetKey}
                  countdownSec={funCountdown}
                />
              </div>
            )}
            <div
              className={cn(
                'relative aspect-square w-full',
                refillActive && 'overflow-hidden',
              )}
              ref={boardInnerRef}
            >
              <div className="grid h-full w-full grid-cols-7 gap-0.5 touch-none" data-shelf-grid>
                {grid.flatMap((row, r) =>
                  row.map((tile, c) => {
                    const item = itemById.get(tile.itemId);
                    const isSel = selected?.r === r && selected?.c === c;
                    const isHint =
                      (hintMove?.a.r === r && hintMove?.a.c === c) ||
                      (hintMove?.b.r === r && hintMove?.b.c === c);
                    const isClearing = isClearingCell(r, c);
                    return (
                      <button
                        key={tile.id}
                        type="button"
                        onPointerDown={(e) => handleTilePointerDown(r, c, e)}
                        onPointerUp={handleTilePointerUp}
                        onPointerCancel={handleTilePointerCancel}
                        className={cn(
                          'bubble-tile relative aspect-square w-full min-h-[44px] grid place-items-center rounded-full border border-white/60 bg-white/38 text-[clamp(1.9rem,7.5vw,2.9rem)] shadow-[inset_0_1px_3px_rgba(255,255,255,0.75),0_2px_8px_rgba(56,189,248,0.16)] transition-shadow active:scale-[0.97]',
                          isSel && 'z-[1] border-sky-300/80 bg-white/30 ring-2 ring-sky-500/65 shadow-[inset_0_1px_4px_rgba(255,255,255,0.75),0_0_0_2px_rgba(14,165,233,0.2),0_4px_12px_rgba(14,165,233,0.22)]',
                          isHint && 'border-amber-200/90 bg-amber-50/25 ring-2 ring-amber-400/90',
                          isClearing && 'z-10',
                        )}
                        aria-label={item?.word ?? t.hud.tileAria}
                      >
                        <div
                          data-tile-id={tile.id}
                          className={cn(
                            'bubble-emoji-sprite grid place-items-center',
                            showShelfCascade && 'opacity-0',
                            isClearing &&
                              (isLineClearAnim
                                ? 'animate-[line-clear-pop_0.62s_ease-out_forwards]'
                                : 'animate-[match-clear-pop_0.5s_ease-out_forwards]'),
                          )}
                        >
                          {item?.imgSrc ? (
                            <img
                              src={item.imgSrc}
                              alt={item.word}
                              className="h-[clamp(2.4rem,7.6vw,2.95rem)] w-[clamp(2.4rem,7.6vw,2.95rem)] object-contain drop-shadow-sm"
                              loading="eager"
                              decoding="async"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <span className="drop-shadow-sm">{item?.emoji ?? '·'}</span>
                          )}
                        </div>
                      </button>
                    );
                  }),
                )}
              </div>

              {showShelfCascade && (
                <BoardShelfEmojiLayer
                  grid={grid}
                  itemById={itemById}
                  boardRef={boardInnerRef}
                  onComplete={() => shelfCompleteRef.current()}
                />
              )}
            </div>

            <BoardBottomSparkles />

            {matchClearCells && matchClearCells.length > 0 && (
              <MatchClearEnergy
                cells={matchClearCells}
                boardRef={popBoardRef}
                burstKey={matchClearKey}
              />
            )}

            <AnimatePresence>
              {popWord && (
                <PopWordOverlay
                  key={`${popWord.word}-${popWord.originCell?.r ?? 'x'}-${popWord.originCell?.c ?? 'x'}`}
                  popWord={popWord}
                  boardRef={popBoardRef}
                  showChinese={showChinese}
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
        challengePools={challengePools}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={onCategoryChange}
        onShuffleWords={onShuffleWords}
        onRestart={onRestart}
        canPlay={canPlay}
      />

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
