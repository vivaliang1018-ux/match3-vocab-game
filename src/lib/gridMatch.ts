import type { Cell, Tile } from '../types/game';

export const GRID_SIZE = 7;

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

function pickOtherId(itemIds: string[], exclude: string): string {
  const pool = itemIds.filter((id) => id !== exclude);
  return pool.length > 0 ? pool[randInt(pool.length)] : itemIds[randInt(itemIds.length)];
}

/** True if placing itemId at (r,c) would complete a 3+ line. */
export function wouldAutoMatch(grid: Tile[][], r: number, c: number, itemId: string): boolean {
  if (!itemId) return false;

  let h = 1;
  for (let dc = -1; c + dc >= 0 && grid[r][c + dc]?.itemId === itemId; dc--) h++;
  for (let dc = 1; c + dc < GRID_SIZE && grid[r][c + dc]?.itemId === itemId; dc++) h++;
  if (h >= 3) return true;

  let v = 1;
  for (let dr = -1; r + dr >= 0 && grid[r + dr][c]?.itemId === itemId; dr--) v++;
  for (let dr = 1; r + dr < GRID_SIZE && grid[r + dr][c]?.itemId === itemId; dr++) v++;
  return v >= 3;
}

/** Refill bias: stack pairs / extend runs to create more 4+ opportunities. */
export function pickSmartRefillItemId(
  grid: Tile[][],
  r: number,
  c: number,
  itemIds: string[],
): string {
  if (itemIds.length === 0) return '';

  const below = r + 1 < GRID_SIZE ? grid[r + 1][c]?.itemId : '';
  const below2 = r + 2 < GRID_SIZE ? grid[r + 2][c]?.itemId : '';
  const above = r - 1 >= 0 ? grid[r - 1][c]?.itemId : '';
  const above2 = r - 2 >= 0 ? grid[r - 2][c]?.itemId : '';

  const tryId = (id: string) => id && !wouldAutoMatch(grid, r, c, id);

  if (below && below === below2 && Math.random() < 0.5 && tryId(below)) {
    return below;
  }
  if (above && above === above2 && Math.random() < 0.42 && tryId(above)) {
    return above;
  }
  if (below && Math.random() < 0.38 && tryId(below)) {
    return below;
  }
  if (above && Math.random() < 0.3 && tryId(above)) {
    return above;
  }

  let itemId = itemIds[randInt(itemIds.length)];
  let guard = 0;
  while (guard < 14) {
    if (!wouldAutoMatch(grid, r, c, itemId)) break;
    itemId = itemIds[randInt(itemIds.length)];
    guard++;
  }
  return itemId;
}

type Match = { cells: Cell[]; itemId: string };

function findRawMatches(grid: Tile[][]): Match[] {
  const matches: Match[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    let c = 0;
    while (c < GRID_SIZE) {
      const start = c;
      const itemId = grid[r][c].itemId;
      while (c < GRID_SIZE && grid[r][c].itemId === itemId) c++;
      if (c - start >= 3) {
        matches.push({
          itemId,
          cells: Array.from({ length: c - start }, (_, i) => ({ r, c: start + i })),
        });
      }
    }
  }
  for (let c = 0; c < GRID_SIZE; c++) {
    let r = 0;
    while (r < GRID_SIZE) {
      const start = r;
      const itemId = grid[r][c].itemId;
      while (r < GRID_SIZE && grid[r][c].itemId === itemId) r++;
      if (r - start >= 3) {
        matches.push({
          itemId,
          cells: Array.from({ length: r - start }, (_, i) => ({ r: start + i, c })),
        });
      }
    }
  }
  return matches;
}

function findLongRuns(grid: Tile[][]): Match[] {
  return findRawMatches(grid).filter((m) => m.cells.length > 3);
}

function swapGrid(grid: Tile[][], a: Cell, b: Cell): Tile[][] {
  const next = grid.map((row) => row.map((t) => ({ ...t })));
  const t = next[a.r][a.c];
  next[a.r][a.c] = next[b.r][b.c];
  next[b.r][b.c] = t;
  return next;
}

/** Prefer hints that yield a 4+ line, then any match. */
export function findBestHintMove(grid: Tile[][]): { a: Cell; b: Cell } | null {
  let fallback: { a: Cell; b: Cell } | null = null;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const neighbors: Cell[] = [];
      if (c + 1 < GRID_SIZE) neighbors.push({ r, c: c + 1 });
      if (r + 1 < GRID_SIZE) neighbors.push({ r: r + 1, c });

      for (const to of neighbors) {
        const test = swapGrid(grid, { r, c }, to);
        if (findRawMatches(test).length === 0) continue;
        if (findLongRuns(test).length > 0) {
          return { a: { r, c }, b: to };
        }
        if (!fallback) fallback = { a: { r, c }, b: to };
      }
    }
  }
  return fallback;
}

function restoreCells(grid: Tile[][], backup: { r: number; c: number; itemId: string }[]) {
  for (const b of backup) {
    grid[b.r][b.c].itemId = b.itemId;
  }
}

function snapshotCells(grid: Tile[][], cells: Cell[]) {
  return cells.map(({ r, c }) => ({ r, c, itemId: grid[r][c].itemId }));
}

function tryPlantNearFour(grid: Tile[][], itemIds: string[], horizontal: boolean): boolean {
  const itemId = itemIds[randInt(itemIds.length)];
  const otherId = pickOtherId(itemIds, itemId);

  if (horizontal) {
    const r = randInt(GRID_SIZE);
    const c = randInt(GRID_SIZE - 3);
    const cells = [
      { r, c },
      { r, c: c + 1 },
      { r, c: c + 2 },
      { r, c: c + 3 },
    ];
    const backup = snapshotCells(grid, cells);
    grid[r][c].itemId = itemId;
    grid[r][c + 1].itemId = itemId;
    grid[r][c + 2].itemId = otherId;
    grid[r][c + 3].itemId = itemId;
    if (findRawMatches(grid).length > 0) {
      restoreCells(grid, backup);
      return false;
    }
    return true;
  }

  const c = randInt(GRID_SIZE);
  const r = randInt(GRID_SIZE - 3);
  const cells = [
    { r, c },
    { r: r + 1, c },
    { r: r + 2, c },
    { r: r + 3, c },
  ];
  const backup = snapshotCells(grid, cells);
  grid[r][c].itemId = itemId;
  grid[r + 1][c].itemId = itemId;
  grid[r + 2][c].itemId = otherId;
  grid[r + 3][c].itemId = itemId;
  if (findRawMatches(grid).length > 0) {
    restoreCells(grid, backup);
    return false;
  }
  return true;
}

function tryPlantLShapeNearFour(grid: Tile[][], itemIds: string[]): boolean {
  const itemId = itemIds[randInt(itemIds.length)];
  const otherId = pickOtherId(itemIds, itemId);
  const r = randInt(GRID_SIZE - 1);
  const c = randInt(GRID_SIZE - 3);

  const cells = [
    { r, c },
    { r, c: c + 1 },
    { r, c: c + 2 },
    { r, c: c + 3 },
    { r: r + 1, c: c + 2 },
  ];
  const backup = snapshotCells(grid, cells);
  grid[r][c].itemId = itemId;
  grid[r][c + 1].itemId = itemId;
  grid[r][c + 2].itemId = itemId;
  grid[r][c + 3].itemId = otherId;
  grid[r + 1][c + 2].itemId = itemId;
  if (findRawMatches(grid).length > 0) {
    restoreCells(grid, backup);
    return false;
  }
  return true;
}

/** Plant several "one swap from 4+" patterns on a match-free board. */
export function seedNearFourMatchOpportunities(
  grid: Tile[][],
  itemIds: string[],
  target = 5,
): void {
  if (itemIds.length < 2) return;

  let planted = 0;
  let attempts = 0;
  while (planted < target && attempts < 60) {
    attempts++;
    const roll = randInt(10);
    const ok =
      roll < 4
        ? tryPlantNearFour(grid, itemIds, true)
        : roll < 8
          ? tryPlantNearFour(grid, itemIds, false)
          : tryPlantLShapeNearFour(grid, itemIds);
    if (ok) planted++;
  }
}

/** True if some adjacent swap creates a match involving itemId. */
export function hasSwapMatchForItem(grid: Tile[][], itemId: string): boolean {
  if (!itemId) return false;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const neighbors: Cell[] = [];
      if (c + 1 < GRID_SIZE) neighbors.push({ r, c: c + 1 });
      if (r + 1 < GRID_SIZE) neighbors.push({ r: r + 1, c });

      for (const to of neighbors) {
        const test = swapGrid(grid, { r, c }, to);
        if (findRawMatches(test).some((m) => m.itemId === itemId)) return true;
      }
    }
  }
  return false;
}

function plantNearMatchForItem(
  grid: Tile[][],
  targetItemId: string,
  allItemIds: string[],
  horizontal: boolean,
): boolean {
  const otherId = pickOtherId(allItemIds, targetItemId);

  if (horizontal) {
    const r = randInt(GRID_SIZE);
    const c = randInt(GRID_SIZE - 3);
    const cells = [
      { r, c },
      { r, c: c + 1 },
      { r, c: c + 2 },
      { r, c: c + 3 },
    ];
    const backup = snapshotCells(grid, cells);
    grid[r][c].itemId = targetItemId;
    grid[r][c + 1].itemId = targetItemId;
    grid[r][c + 2].itemId = otherId;
    grid[r][c + 3].itemId = targetItemId;
    if (findRawMatches(grid).length > 0) {
      restoreCells(grid, backup);
      return false;
    }
    return hasSwapMatchForItem(grid, targetItemId);
  }

  const c = randInt(GRID_SIZE);
  const r = randInt(GRID_SIZE - 3);
  const cells = [
    { r, c },
    { r: r + 1, c },
    { r: r + 2, c },
    { r: r + 3, c },
  ];
  const backup = snapshotCells(grid, cells);
  grid[r][c].itemId = targetItemId;
  grid[r + 1][c].itemId = targetItemId;
  grid[r + 2][c].itemId = otherId;
  grid[r + 3][c].itemId = targetItemId;
  if (findRawMatches(grid).length > 0) {
    restoreCells(grid, backup);
    return false;
  }
  return hasSwapMatchForItem(grid, targetItemId);
}

/** Guarantee at least one swap can match targetItemId (mutates grid in place). */
export function ensureFunTargetPlayable(
  grid: Tile[][],
  targetItemId: string,
  allItemIds: string[],
): void {
  if (!targetItemId || allItemIds.length === 0) return;
  if (hasSwapMatchForItem(grid, targetItemId)) return;

  let attempts = 0;
  while (attempts < 48) {
    attempts++;
    const horizontal = randInt(2) === 0;
    if (plantNearMatchForItem(grid, targetItemId, allItemIds, horizontal)) return;
  }
}

/** Prefer a swap that clears itemId; fall back to any valid swap. */
export function findHintMoveForItem(
  grid: Tile[][],
  itemId: string,
): { a: Cell; b: Cell } | null {
  let fallback: { a: Cell; b: Cell } | null = null;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const neighbors: Cell[] = [];
      if (c + 1 < GRID_SIZE) neighbors.push({ r, c: c + 1 });
      if (r + 1 < GRID_SIZE) neighbors.push({ r: r + 1, c });

      for (const to of neighbors) {
        const test = swapGrid(grid, { r, c }, to);
        const matches = findRawMatches(test);
        if (matches.length === 0) continue;

        const move = { a: { r, c }, b: to };
        if (matches.some((m) => m.itemId === itemId)) return move;
        if (!fallback) fallback = move;
      }
    }
  }
  return fallback;
}
