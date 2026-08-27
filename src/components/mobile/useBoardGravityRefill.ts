import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  computeRefillMotions,
  GRID_COLS,
  GRID_ROWS,
  REFILL_ANTICIPATION_MS,
  REFILL_COL_STAGGER_MS,
  refillOffsetAtTime,
  refillTravelDurationMs,
  type RefillBurst,
} from '../../lib/boardRefill';

const REFILL_SPRITE_CLASS = 'bubble-emoji-sprite--refill';
const REFILL_LAYOUT_RETRIES = 8;
const REFILL_KEYFRAME_STEPS = 24;

function measureStepY(boardEl: HTMLElement): number {
  const gridEl = boardEl.querySelector<HTMLElement>('[data-shelf-grid]');
  if (!gridEl) return 0;
  const buttons = gridEl.querySelectorAll('button');
  const first = buttons[0]?.getBoundingClientRect();
  const below = buttons[GRID_COLS]?.getBoundingClientRect();
  if (first && below) {
    const measured = below.top - first.top;
    if (measured > 0.5) return measured;
  }
  const gridRect = gridEl.getBoundingClientRect();
  if (gridRect.height > 0) return gridRect.height / GRID_ROWS;
  return 0;
}

function buildRefillKeyframes(y0: number, durationMs: number): Keyframe[] {
  const frames: Keyframe[] = [];
  for (let i = 0; i <= REFILL_KEYFRAME_STEPS; i++) {
    const t = i / REFILL_KEYFRAME_STEPS;
    const y = refillOffsetAtTime(y0, t * durationMs, durationMs);
    frames.push({
      transform: `translate3d(0, ${y.toFixed(2)}px, 0)`,
      offset: t,
    });
  }
  return frames;
}

type UseBoardGravityRefillOptions = {
  boardRef: React.RefObject<HTMLElement | null>;
  burst: RefillBurst | null;
  enabled: boolean;
  onActiveChange?: (active: boolean) => void;
};

export function useBoardGravityRefill({
  boardRef,
  burst,
  enabled,
  onActiveChange,
}: UseBoardGravityRefillOptions): boolean {
  const lastBurstKeyRef = useRef(-1);
  const runningAnimsRef = useRef<Animation[]>([]);
  const [active, setActive] = useState(false);

  const setActiveBoth = useCallback((next: boolean) => {
    setActive(next);
    onActiveChange?.(next);
  }, [onActiveChange]);

  const activeSpritesRef = useRef<HTMLElement[]>([]);

  const resetSprites = () => {
    for (const el of activeSpritesRef.current) {
      el.style.transform = 'translate3d(0, 0, 0)';
      el.classList.remove(REFILL_SPRITE_CLASS);
    }
    activeSpritesRef.current = [];
  };

  const cancelRunning = () => {
    for (const anim of runningAnimsRef.current) {
      anim.cancel();
    }
    runningAnimsRef.current = [];
    resetSprites();
  };

  useEffect(() => {
    return () => {
      cancelRunning();
      onActiveChange?.(false);
    };
  }, [onActiveChange]);

  useLayoutEffect(() => {
    if (!enabled || !burst || burst.key === lastBurstKeyRef.current) return;

    const board = boardRef.current;
    if (!board) return;

    cancelRunning();

    let cancelled = false;
    let retryTimer: number | null = null;

    const startBurst = (attempt: number) => {
      if (cancelled) return;

      // Always re-measure — board size can change; stale cache broke spawn height.
      const stepY = measureStepY(board);
      const motions = computeRefillMotions(burst.before, burst.after, burst.clearedKeys, stepY);

      const sprites: { el: HTMLElement; y0: number; duration: number; delay: number }[] = [];
      for (const motion of motions) {
        const el = board.querySelector<HTMLElement>(`[data-tile-id="${motion.tileId}"]`);
        if (!el) continue;
        sprites.push({
          el,
          y0: motion.y0,
          duration: refillTravelDurationMs(motion.y0, stepY),
          delay: REFILL_ANTICIPATION_MS + motion.col * REFILL_COL_STAGGER_MS,
        });
      }

      if ((motions.length > 0 && sprites.length === 0 && attempt < REFILL_LAYOUT_RETRIES) || stepY < 0.5) {
        retryTimer = window.requestAnimationFrame(() => startBurst(attempt + 1));
        return;
      }

      if (motions.length === 0 || sprites.length === 0) {
        lastBurstKeyRef.current = burst.key;
        setActiveBoth(false);
        return;
      }

      // Mark consumed only when we actually start — avoids StrictMode skip.
      lastBurstKeyRef.current = burst.key;
      setActiveBoth(true);

      const runKey = burst.key;
      activeSpritesRef.current = sprites.map((sprite) => sprite.el);

      for (const sprite of sprites) {
        sprite.el.classList.add(REFILL_SPRITE_CLASS);
        sprite.el.style.transform = `translate3d(0, ${sprite.y0}px, 0)`;
        const keyframes = buildRefillKeyframes(sprite.y0, sprite.duration);
        const anim = sprite.el.animate(keyframes, {
          duration: Math.max(sprite.duration, 1),
          delay: sprite.delay,
          fill: 'forwards',
          easing: 'linear',
        });
        runningAnimsRef.current.push(anim);
      }

      void Promise.all(
        runningAnimsRef.current.map((anim) => anim.finished.catch(() => undefined)),
      ).then(() => {
        if (lastBurstKeyRef.current !== runKey) return;
        resetSprites();
        runningAnimsRef.current = [];
        setActiveBoth(false);
      });
    };

    startBurst(0);

    return () => {
      cancelled = true;
      if (retryTimer !== null) window.cancelAnimationFrame(retryTimer);
      // If we never started this burst, allow a remount/retry to pick it up.
      if (lastBurstKeyRef.current !== burst.key) {
        cancelRunning();
      }
    };
  }, [boardRef, burst, enabled, setActiveBoth]);

  return active;
}
