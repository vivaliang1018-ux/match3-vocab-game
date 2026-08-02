import type { Tile } from '../types/game';

export const GRID_COLS = 7;
export const GRID_ROWS = 7;

/**
 * Candy Crush–style refill motion.
 *
 * - Short pause after clear
 * - Smooth ease-in-out fall (no bounce)
 * - Duration scales with rows fallen
 * - Light column stagger
 */

/** No pause once clear hands off — 补棋 starts immediately. */
export const REFILL_ANTICIPATION_MS = 0;

/** Light column stagger. */
export const REFILL_COL_STAGGER_MS = 14;

/** Fall travel feels smooth; “faster refill” comes from earlier handoff, not rush speed. */
export const REFILL_BASE_MS = 200;
export const REFILL_PER_ROW_MS = 82;
export const REFILL_MAX_TRAVEL_MS = 500;

export type RefillBurst = {
  key: number;
  before: Tile[][];
  after: Tile[][];
  /** Cells cleared in the triggering match, as "r:c". */
  clearedKeys: ReadonlySet<string>;
};

export type RefillSpriteMotion = {
  tileId: string;
  /** Starting translateY (px); negative = above rest. */
  y0: number;
  col: number;
  rows: number;
};

/** Every cell on the board — use when the whole grid is replaced (quiz done, shuffle words). */
export function allBoardCellKeys(): Set<string> {
  const keys = new Set<string>();
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      keys.add(`${r}:${c}`);
    }
  }
  return keys;
}

export function refillTravelDurationMs(distancePx: number, stepY: number): number {
  const d = Math.abs(distancePx);
  if (d < 0.5) return 0;
  const rows = stepY > 0 ? d / stepY : 1;
  return Math.min(REFILL_MAX_TRAVEL_MS, Math.round(REFILL_BASE_MS + rows * REFILL_PER_ROW_MS));
}

/**
 * Normalized travel progress 0→1 at time t∈[0,1].
 * Smooth ease-in-out — no bounce, less “snap” than pure ease-in.
 */
export function refillTravelProgress(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  // Cubic ease-in-out
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Pixel offset from rest at elapsedMs (y0 negative = started above). */
export function refillOffsetAtTime(y0: number, elapsedMs: number, durationMs: number): number {
  if (Math.abs(y0) < 0.5 || durationMs <= 0) return 0;
  const t = Math.min(1, elapsedMs / durationMs);
  return y0 * (1 - refillTravelProgress(t));
}

/**
 * Per-tile fall motions for a board refill.
 * Existing tiles keep identity; new tiles spawn stacked above the board.
 */
export function computeRefillMotions(
  before: Tile[][],
  after: Tile[][],
  clearedKeys: ReadonlySet<string>,
  stepY: number,
): RefillSpriteMotion[] {
  const motions: RefillSpriteMotion[] = [];
  if (stepY <= 0) return motions;

  for (let c = 0; c < GRID_COLS; c++) {
    const oldRowById = new Map<string, number>();
    for (let r = 0; r < GRID_ROWS; r++) {
      const tile = before[r]?.[c];
      if (!tile?.id) continue;
      if (clearedKeys.has(`${r}:${c}`)) continue;
      oldRowById.set(tile.id, r);
    }

    const afterCol: { id: string; row: number }[] = [];
    for (let r = 0; r < GRID_ROWS; r++) {
      const tile = after[r]?.[c];
      if (tile?.id) afterCol.push({ id: tile.id, row: r });
    }

    const spawns = afterCol.filter(({ id }) => !oldRowById.has(id)).sort((a, b) => a.row - b.row);
    let spawnSlot = 0;
    const spawnStack = spawns.length;

    for (const { id, row } of afterCol) {
      const oldRow = oldRowById.get(id);
      if (oldRow !== undefined) {
        if (oldRow !== row) {
          const rows = oldRow - row;
          motions.push({ tileId: id, y0: rows * stepY, col: c, rows: Math.abs(rows) });
        }
        continue;
      }
      spawnSlot += 1;
      const rowsAbove = Math.max(1, spawnStack - spawnSlot + 1);
      motions.push({
        tileId: id,
        y0: -rowsAbove * stepY,
        col: c,
        rows: rowsAbove,
      });
    }
  }

  return motions;
}

/** @deprecated Prefer computeRefillMotions — kept for any external callers. */
export function computeRefillOffsets(
  before: Tile[][],
  after: Tile[][],
  clearedKeys: ReadonlySet<string>,
  stepY: number,
): Map<string, number> {
  const map = new Map<string, number>();
  for (const m of computeRefillMotions(before, after, clearedKeys, stepY)) {
    map.set(m.tileId, m.y0);
  }
  return map;
}
