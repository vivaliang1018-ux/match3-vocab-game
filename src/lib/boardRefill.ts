import type { Tile } from '../types/game';

export const GRID_COLS = 7;
export const GRID_ROWS = 7;

/**
 * Royal Match–style refill motion (crafted curves, not physics).
 *
 * Why physics felt wrong:
 * - Constant g → slow start, max speed at impact (hard slam, no cushion).
 * - Duration ∝ √distance → multi-row falls feel sluggish.
 * - Instant stop at y=0 → no landing settle.
 *
 * Royal Match instead:
 * - ~30ms anticipation after clear (board breathes).
 * - Punchy ease-out: most travel in the first ~45% of time.
 * - Sub-linear duration vs rows (1-row ≈240ms, 4-row ≈300ms).
 * - Soft landing: 4% overshoot + damped settle in the last ~22% of time.
 */

/** Hold emojis above slots before the drop wave — micro anticipation. */
export const REFILL_ANTICIPATION_MS = 34;

/** Travel timing — compressed so tall falls stay snappy. */
export const REFILL_BASE_MS = 156;
export const REFILL_PER_SQRT_ROW_MS = 72;
export const REFILL_MAX_TRAVEL_MS = 296;

export type RefillBurst = {
  key: number;
  before: Tile[][];
  after: Tile[][];
  /** Cells cleared in the triggering match, as "r:c". */
  clearedKeys: ReadonlySet<string>;
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
  return Math.min(
    REFILL_MAX_TRAVEL_MS,
    Math.round(REFILL_BASE_MS + Math.sqrt(rows) * REFILL_PER_SQRT_ROW_MS),
  );
}

/**
 * Normalized travel progress 0→1 at time t∈[0,1].
 * Two-phase: fast ease-out body (0–76%) + cushioned settle with slight overshoot (76–100%).
 */
export function refillTravelProgress(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;

  const bodyEnd = 0.76;
  const bodyTarget = 0.93;

  if (t < bodyEnd) {
    const u = t / bodyEnd;
    // Quint ease-out — early velocity punch, no sluggish ramp-up
    return bodyTarget * (1 - (1 - u) ** 4.2);
  }

  const u = (t - bodyEnd) / (1 - bodyEnd);
  const settle = 0.07 * (1 - (1 - u) ** 2.4);
  const overshoot = 0.038 * Math.sin(u * Math.PI) * (1 - u);
  return bodyTarget + settle + overshoot;
}

/** Pixel offset from rest at elapsedMs (y0 negative = started above). */
export function refillOffsetAtTime(y0: number, elapsedMs: number, durationMs: number): number {
  if (Math.abs(y0) < 0.5 || durationMs <= 0) return 0;
  const t = Math.min(1, elapsedMs / durationMs);
  return y0 * (1 - refillTravelProgress(t));
}

/**
 * Per-tile starting translateY (px, negative = above rest) for a column refill.
 * Existing tiles keep identity; new tiles spawn stacked at rows -1, -2, … above their slot.
 */
export function computeRefillOffsets(
  before: Tile[][],
  after: Tile[][],
  clearedKeys: ReadonlySet<string>,
  stepY: number,
): Map<string, number> {
  const offsets = new Map<string, number>();
  if (stepY <= 0) return offsets;

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
          offsets.set(id, (oldRow - row) * stepY);
        }
        continue;
      }
      spawnSlot += 1;
      const rowsAbove = Math.max(1, spawnStack - spawnSlot + 1);
      offsets.set(id, -rowsAbove * stepY);
    }
  }

  return offsets;
}
