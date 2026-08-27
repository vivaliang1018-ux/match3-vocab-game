import type { Cell, Tile } from '../types/game';

export const GRID_SIZE = 7;

function randInt(max: number) {
  return Math.floor(Math.random() * max);
}

function pickOtherId(itemIds: string[], exclude: string): string {
  const pool = itemIds.filter((id) => id !== exclude);
  return pool.length > 0 ? pool[randInt(pool.length)] : itemIds[randInt(itemIds.length)];
}

function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = randInt(i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
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
  preferIds?: readonly string[],
): string {
  if (itemIds.length === 0) return '';

  const below = r + 1 < GRID_SIZE ? grid[r + 1][c]?.itemId : '';
  const below2 = r + 2 < GRID_SIZE ? grid[r + 2][c]?.itemId : '';
  const above = r - 1 >= 0 ? grid[r - 1][c]?.itemId : '';
  const above2 = r - 2 >= 0 ? grid[r - 2][c]?.itemId : '';

  const tryId = (id: string) => id && !wouldAutoMatch(grid, r, c, id);
  const prefer =
    preferIds && preferIds.length > 0
      ? preferIds.filter((id) => itemIds.includes(id))
      : [];

  // Late-board assist: unfinished words drop more often so the player can finish.
  if (prefer.length > 0 && Math.random() < 0.62) {
    const pick = prefer[randInt(prefer.length)];
    if (tryId(pick)) return pick;
    for (let i = 0; i < prefer.length; i++) {
      const id = prefer[(randInt(prefer.length) + i) % prefer.length];
      if (tryId(id)) return id;
    }
  }

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

  if (prefer.length > 0 && Math.random() < 0.45) {
    const pick = prefer[randInt(prefer.length)];
    if (tryId(pick)) return pick;
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
  /** Variant: A A X A or A X A A (one adjacent swap → AAAA). Never XAAA / AAAX (auto-match). */
  const gapSecond = Math.random() < 0.45;

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
    if (gapSecond) {
      grid[r][c].itemId = itemId;
      grid[r][c + 1].itemId = otherId;
      grid[r][c + 2].itemId = itemId;
      grid[r][c + 3].itemId = itemId;
    } else {
      grid[r][c].itemId = itemId;
      grid[r][c + 1].itemId = itemId;
      grid[r][c + 2].itemId = otherId;
      grid[r][c + 3].itemId = itemId;
    }
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
  if (gapSecond) {
    grid[r][c].itemId = itemId;
    grid[r + 1][c].itemId = otherId;
    grid[r + 2][c].itemId = itemId;
    grid[r + 3][c].itemId = itemId;
  } else {
    grid[r][c].itemId = itemId;
    grid[r + 1][c].itemId = itemId;
    grid[r + 2][c].itemId = otherId;
    grid[r + 3][c].itemId = itemId;
  }
  if (findRawMatches(grid).length > 0) {
    restoreCells(grid, backup);
    return false;
  }
  return true;
}

/** Easy 3: A A X with A under/over X — one vertical swap → AAA. */
function tryPlantNearThree(grid: Tile[][], itemIds: string[], horizontal: boolean): boolean {
  const itemId = itemIds[randInt(itemIds.length)];
  const otherId = pickOtherId(itemIds, itemId);

  if (horizontal) {
    if (GRID_SIZE < 2) return false;
    const r = randInt(GRID_SIZE - 1);
    const c = randInt(GRID_SIZE - 2);
    const below = Math.random() < 0.5;
    const bridgeR = below ? r + 1 : r;
    const lineR = below ? r : r + 1;
    const cells = [
      { r: lineR, c },
      { r: lineR, c: c + 1 },
      { r: lineR, c: c + 2 },
      { r: bridgeR, c: c + 2 },
    ];
    const backup = snapshotCells(grid, cells);
    grid[lineR][c].itemId = itemId;
    grid[lineR][c + 1].itemId = itemId;
    grid[lineR][c + 2].itemId = otherId;
    grid[bridgeR][c + 2].itemId = itemId;
    if (findRawMatches(grid).length > 0) {
      restoreCells(grid, backup);
      return false;
    }
    return true;
  }

  if (GRID_SIZE < 2) return false;
  const c = randInt(GRID_SIZE - 1);
  const r = randInt(GRID_SIZE - 2);
  const right = Math.random() < 0.5;
  const bridgeC = right ? c + 1 : c;
  const lineC = right ? c : c + 1;
  const cells = [
    { r, c: lineC },
    { r: r + 1, c: lineC },
    { r: r + 2, c: lineC },
    { r: r + 2, c: bridgeC },
  ];
  const backup = snapshotCells(grid, cells);
  grid[r][lineC].itemId = itemId;
  grid[r + 1][lineC].itemId = itemId;
  grid[r + 2][lineC].itemId = otherId;
  grid[r + 2][bridgeC].itemId = itemId;
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

/** Count adjacent swaps that create matches; long runs weighted higher. */
export function scoreOpeningJuice(grid: Tile[][]): number {
  let any = 0;
  let long = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const neighbors: Cell[] = [];
      if (c + 1 < GRID_SIZE) neighbors.push({ r, c: c + 1 });
      if (r + 1 < GRID_SIZE) neighbors.push({ r: r + 1, c });
      for (const to of neighbors) {
        const test = swapGrid(grid, { r, c }, to);
        const matches = findRawMatches(test);
        if (matches.length === 0) continue;
        any++;
        if (matches.some((m) => m.cells.length >= 4)) long++;
      }
    }
  }
  return any + long * 3;
}

export type OpeningBoardAnalysis = {
  counts: Map<string, number>;
  hasAutoMatch: boolean;
  legalMoveCount: number;
  longMoveCount: number;
  minCount: number;
  maxCount: number;
};

/** Inspect all opening-board constraints without mutating the board. */
export function analyzeOpeningBoard(
  grid: Tile[][],
  itemIds: readonly string[],
): OpeningBoardAnalysis {
  const uniqueIds = [...new Set(itemIds)];
  const counts = new Map(uniqueIds.map((id) => [id, 0]));
  for (const row of grid) {
    for (const tile of row) {
      if (counts.has(tile.itemId)) {
        counts.set(tile.itemId, (counts.get(tile.itemId) ?? 0) + 1);
      }
    }
  }

  let legalMoveCount = 0;
  let longMoveCount = 0;
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const neighbors: Cell[] = [];
      if (c + 1 < GRID_SIZE) neighbors.push({ r, c: c + 1 });
      if (r + 1 < GRID_SIZE) neighbors.push({ r: r + 1, c });
      for (const to of neighbors) {
        const test = swapGrid(grid, { r, c }, to);
        const matches = findRawMatches(test);
        if (matches.length === 0) continue;
        legalMoveCount++;
        if (matches.some((match) => match.cells.length >= 4)) longMoveCount++;
      }
    }
  }

  const countValues = [...counts.values()];
  return {
    counts,
    hasAutoMatch: findRawMatches(grid).length > 0,
    legalMoveCount,
    longMoveCount,
    minCount: countValues.length > 0 ? Math.min(...countValues) : 0,
    maxCount: countValues.length > 0 ? Math.max(...countValues) : 0,
  };
}

type OpeningOpportunityTemplate = {
  line: Cell[];
  gap: Cell;
  feeder: Cell;
};

type BalancedOpeningOptions = {
  /** Make the first planted 4+/5+ opportunity use this item when possible. */
  preferredOpportunityIds?: readonly string[];
};

function openingOpportunityTemplates(): OpeningOpportunityTemplate[] {
  const templates: OpeningOpportunityTemplate[] = [];
  for (const length of [4, 5]) {
    const gapOffsets = length === 4 ? [1, 2] : [2];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c <= GRID_SIZE - length; c++) {
        for (const gapOffset of gapOffsets) {
          for (const dr of [-1, 1]) {
            const feederR = r + dr;
            if (feederR < 0 || feederR >= GRID_SIZE) continue;
            const line = Array.from({ length }, (_, i) => ({ r, c: c + i }));
            templates.push({
              line,
              gap: line[gapOffset],
              feeder: { r: feederR, c: c + gapOffset },
            });
          }
        }
      }
    }
    for (let c = 0; c < GRID_SIZE; c++) {
      for (let r = 0; r <= GRID_SIZE - length; r++) {
        for (const gapOffset of gapOffsets) {
          for (const dc of [-1, 1]) {
            const feederC = c + dc;
            if (feederC < 0 || feederC >= GRID_SIZE) continue;
            const line = Array.from({ length }, (_, i) => ({ r: r + i, c }));
            templates.push({
              line,
              gap: line[gapOffset],
              feeder: { r: r + gapOffset, c: feederC },
            });
          }
        }
      }
    }
  }
  return templates;
}

const OPENING_OPPORTUNITY_TEMPLATES = openingOpportunityTemplates();

function openingQuotas(itemIds: readonly string[]): Map<string, number> {
  const shuffledIds = shuffle(itemIds);
  const totalCells = GRID_SIZE * GRID_SIZE;
  const base = Math.floor(totalCells / shuffledIds.length);
  let remainder = totalCells % shuffledIds.length;
  const quotas = new Map<string, number>();
  for (const id of shuffledIds) {
    quotas.set(id, base + (remainder > 0 ? 1 : 0));
    remainder--;
  }
  return quotas;
}

function reserveOpeningOpportunities(
  itemIds: readonly string[],
  quotas: ReadonlyMap<string, number>,
  desiredCount: number,
  preferredIds?: readonly string[],
): Map<string, string> | null {
  const preferred = (preferredIds ?? []).filter(
    (id, index, ids) => itemIds.includes(id) && ids.indexOf(id) === index,
  );
  const targets = [
    ...preferred,
    ...shuffle(itemIds.filter((id) => !preferred.includes(id))),
  ].slice(0, desiredCount);
  if (targets.length < desiredCount) return null;

  const reservations = new Map<string, string>();
  const reservedCounts = new Map(itemIds.map((id) => [id, 0]));
  const templates = shuffle(OPENING_OPPORTUNITY_TEMPLATES);

  for (const targetId of targets) {
    let planted = false;
    for (const template of templates) {
      const cells = [...template.line, template.feeder];
      if (cells.some((cell) => reservations.has(`${cell.r}:${cell.c}`))) continue;
      const targetNeeded = template.line.length;
      if ((reservedCounts.get(targetId) ?? 0) + targetNeeded > (quotas.get(targetId) ?? 0)) {
        continue;
      }

      const gapIds = shuffle(itemIds.filter((id) => id !== targetId));
      const gapId = gapIds.find(
        (id) => (reservedCounts.get(id) ?? 0) + 1 <= (quotas.get(id) ?? 0),
      );
      if (!gapId) continue;

      for (const cell of template.line) {
        reservations.set(
          `${cell.r}:${cell.c}`,
          cell.r === template.gap.r && cell.c === template.gap.c ? gapId : targetId,
        );
      }
      reservations.set(`${template.feeder.r}:${template.feeder.c}`, targetId);
      reservedCounts.set(targetId, (reservedCounts.get(targetId) ?? 0) + targetNeeded);
      reservedCounts.set(gapId, (reservedCounts.get(gapId) ?? 0) + 1);
      planted = true;
      break;
    }
    if (!planted) return null;
  }

  return reservations;
}

function fillBalancedOpeningGrid(
  itemIds: readonly string[],
  quotas: ReadonlyMap<string, number>,
  reservations: ReadonlyMap<string, string>,
  makeTileId: () => string,
): Tile[][] | null {
  const grid: Tile[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({ id: makeTileId(), itemId: '' })),
  );
  const remaining = new Map(quotas);
  for (const [key, itemId] of reservations) {
    const [r, c] = key.split(':').map(Number);
    grid[r][c].itemId = itemId;
    remaining.set(itemId, (remaining.get(itemId) ?? 0) - 1);
  }
  if ([...remaining.values()].some((count) => count < 0)) return null;

  const openCells: Cell[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (!grid[r][c].itemId) openCells.push({ r, c });
    }
  }

  for (const cell of shuffle(openCells)) {
    const candidates = itemIds.filter(
      (id) => (remaining.get(id) ?? 0) > 0 && !wouldAutoMatch(grid, cell.r, cell.c, id),
    );
    if (candidates.length === 0) return null;
    const weighted = candidates.flatMap((id) =>
      Array.from({ length: remaining.get(id) ?? 0 }, () => id),
    );
    const itemId = weighted[randInt(weighted.length)];
    grid[cell.r][cell.c].itemId = itemId;
    remaining.set(itemId, (remaining.get(itemId) ?? 0) - 1);
  }

  if ([...remaining.values()].some((count) => count !== 0)) return null;
  return grid;
}

/**
 * Build a 7×7 opening from per-item quotas, then reserve one or two local
 * A-A-X-A / A-A-X-A-A patterns with an adjacent feeder A. Swapping the feeder
 * into X creates a verified 4/5 line without changing any item's total count.
 */
export function createBalancedOpeningGrid(
  rawItemIds: readonly string[],
  makeTileId: () => string,
  options?: BalancedOpeningOptions,
): Tile[][] {
  const itemIds = [...new Set(rawItemIds.filter(Boolean))];
  if (itemIds.length === 0) {
    return Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({ id: makeTileId(), itemId: '' })),
    );
  }
  if (itemIds.length === 1) {
    return Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({ id: makeTileId(), itemId: itemIds[0] })),
    );
  }

  let best: Tile[][] | null = null;
  let bestLongDistance = Number.POSITIVE_INFINITY;
  let bestPlayableItemCount = -1;
  for (let attempt = 0; attempt < 320; attempt++) {
    const quotas = openingQuotas(itemIds);
    const desiredOpportunityCount = Math.random() < 0.5 ? 1 : 2;
    const reservations = reserveOpeningOpportunities(
      itemIds,
      quotas,
      desiredOpportunityCount,
      options?.preferredOpportunityIds,
    );
    if (!reservations) continue;
    const candidate = fillBalancedOpeningGrid(itemIds, quotas, reservations, makeTileId);
    if (!candidate) continue;

    const analysis = analyzeOpeningBoard(candidate, itemIds);
    if (analysis.hasAutoMatch || analysis.legalMoveCount === 0 || analysis.longMoveCount === 0) {
      continue;
    }
    const balanced =
      itemIds.length !== 6 ||
      (analysis.minCount >= 6 && analysis.maxCount <= 10 && analysis.maxCount - analysis.minCount <= 4);
    if (!balanced) continue;
    const preferredPlayable = (options?.preferredOpportunityIds ?? []).every((id) =>
      hasSwapMatchForItem(candidate, id),
    );
    if (!preferredPlayable) continue;
    const playableItemCount = itemIds.reduce(
      (count, id) => count + (hasSwapMatchForItem(candidate, id) ? 1 : 0),
      0,
    );

    const longDistance =
      analysis.longMoveCount < 1
        ? 1 - analysis.longMoveCount
        : analysis.longMoveCount > 2
          ? analysis.longMoveCount - 2
          : 0;
    if (
      playableItemCount > bestPlayableItemCount ||
      (playableItemCount === bestPlayableItemCount && longDistance < bestLongDistance)
    ) {
      best = candidate;
      bestPlayableItemCount = playableItemCount;
      bestLongDistance = longDistance;
    }
    // Four of six words immediately playable is a good opening spread without
    // spending hundreds of randomized attempts chasing a perfect board.
    const balancedOpportunityTarget = Math.min(itemIds.length, 4);
    if (playableItemCount >= balancedOpportunityTarget && longDistance === 0) {
      return candidate;
    }
  }

  if (best) return best;

  // Extremely defensive fallback. With six IDs the quota builder normally
  // succeeds long before this point; keep the board balanced even if it cannot
  // satisfy the preferred 4+ opportunity after repeated randomized attempts.
  for (let attempt = 0; attempt < 160; attempt++) {
    const quotas = openingQuotas(itemIds);
    const candidate = fillBalancedOpeningGrid(itemIds, quotas, new Map(), makeTileId);
    if (!candidate) continue;
    const analysis = analyzeOpeningBoard(candidate, itemIds);
    if (!analysis.hasAutoMatch && analysis.legalMoveCount > 0) return candidate;
  }

  const quotas = openingQuotas(itemIds);
  const bag = shuffle(
    itemIds.flatMap((id) => Array.from({ length: quotas.get(id) ?? 0 }, () => id)),
  );
  return Array.from({ length: GRID_SIZE }, (_, r) =>
    Array.from({ length: GRID_SIZE }, (_, c) => ({
      id: makeTileId(),
      itemId: bag[r * GRID_SIZE + c] ?? itemIds[0],
    })),
  );
}

/** Plant several "one swap from 3 / 4+" patterns on a match-free board. */
export function seedNearFourMatchOpportunities(
  grid: Tile[][],
  itemIds: string[],
  target = 9,
): void {
  if (itemIds.length < 2) return;

  let planted = 0;
  let attempts = 0;
  while (planted < target && attempts < 100) {
    attempts++;
    const roll = randInt(12);
    const ok =
      roll < 3
        ? tryPlantNearThree(grid, itemIds, true)
        : roll < 6
          ? tryPlantNearThree(grid, itemIds, false)
          : roll < 8
            ? tryPlantNearFour(grid, itemIds, true)
            : roll < 10
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
    if (findRawMatches(grid).length > 0 || !hasSwapMatchForItem(grid, targetItemId)) {
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
  grid[r][c].itemId = targetItemId;
  grid[r + 1][c].itemId = targetItemId;
  grid[r + 2][c].itemId = otherId;
  grid[r + 3][c].itemId = targetItemId;
  if (findRawMatches(grid).length > 0 || !hasSwapMatchForItem(grid, targetItemId)) {
    restoreCells(grid, backup);
    return false;
  }
  return true;
}

/**
 * Last-resort plant: overwrite a 4-cell window to T-T-O-T so one swap
 * makes three-in-a-row. Nudges neighbors to reduce accidental auto-matches.
 * Returns true only when a verified one-swap target match exists.
 */
function forcePlantTargetMatch(
  grid: Tile[][],
  targetItemId: string,
  allItemIds: string[],
): boolean {
  const others = allItemIds.filter((id) => id !== targetItemId);
  if (others.length === 0) return hasSwapMatchForItem(grid, targetItemId);

  const scrubAroundHoriz = (r: number, c: number) => {
    for (const dc of [0, 1, 2, 3]) {
      const col = c + dc;
      const id = grid[r][col].itemId;
      if (r > 0 && grid[r - 1][col].itemId === id) {
        grid[r - 1][col].itemId = pickOtherId(allItemIds, id);
      }
      if (r + 1 < GRID_SIZE && grid[r + 1][col].itemId === id) {
        grid[r + 1][col].itemId = pickOtherId(allItemIds, id);
      }
    }
    // Keep the gap cell from matching target via longer runs.
    for (const dc of [0, 1, 2, 3]) {
      const col = c + dc;
      if (grid[r][col].itemId === targetItemId) continue;
      if (wouldAutoMatch(grid, r, col, grid[r][col].itemId)) {
        grid[r][col].itemId = pickOtherId(others, grid[r][col].itemId);
      }
    }
  };

  const scrubAroundVert = (r: number, c: number) => {
    for (const dr of [0, 1, 2, 3]) {
      const row = r + dr;
      const id = grid[row][c].itemId;
      if (c > 0 && grid[row][c - 1].itemId === id) {
        grid[row][c - 1].itemId = pickOtherId(allItemIds, id);
      }
      if (c + 1 < GRID_SIZE && grid[row][c + 1].itemId === id) {
        grid[row][c + 1].itemId = pickOtherId(allItemIds, id);
      }
    }
    for (const dr of [0, 1, 2, 3]) {
      const row = r + dr;
      if (grid[row][c].itemId === targetItemId) continue;
      if (wouldAutoMatch(grid, row, c, grid[row][c].itemId)) {
        grid[row][c].itemId = pickOtherId(others, grid[row][c].itemId);
      }
    }
  };

  const tryHoriz = (r: number, c: number) => {
    if (c + 3 >= GRID_SIZE) return false;
    const cells = [
      { r, c },
      { r, c: c + 1 },
      { r, c: c + 2 },
      { r, c: c + 3 },
    ];
    // Also scrub neighbors — include them in backup.
    const neighborhood: Cell[] = [...cells];
    for (const dc of [0, 1, 2, 3]) {
      if (r > 0) neighborhood.push({ r: r - 1, c: c + dc });
      if (r + 1 < GRID_SIZE) neighborhood.push({ r: r + 1, c: c + dc });
    }
    const backup = snapshotCells(grid, neighborhood);
    const otherId = others[randInt(others.length)];
    grid[r][c].itemId = targetItemId;
    grid[r][c + 1].itemId = targetItemId;
    grid[r][c + 2].itemId = otherId;
    grid[r][c + 3].itemId = targetItemId;
    scrubAroundHoriz(r, c);
    if (findRawMatches(grid).length > 0) {
      grid[r][c + 2].itemId = pickOtherId(others, otherId);
      scrubAroundHoriz(r, c);
    }
    if (findRawMatches(grid).length === 0 && hasSwapMatchForItem(grid, targetItemId)) {
      return true;
    }
    restoreCells(grid, backup);
    return false;
  };

  const tryVert = (r: number, c: number) => {
    if (r + 3 >= GRID_SIZE) return false;
    const cells = [
      { r, c },
      { r: r + 1, c },
      { r: r + 2, c },
      { r: r + 3, c },
    ];
    const neighborhood: Cell[] = [...cells];
    for (const dr of [0, 1, 2, 3]) {
      if (c > 0) neighborhood.push({ r: r + dr, c: c - 1 });
      if (c + 1 < GRID_SIZE) neighborhood.push({ r: r + dr, c: c + 1 });
    }
    const backup = snapshotCells(grid, neighborhood);
    const otherId = others[randInt(others.length)];
    grid[r][c].itemId = targetItemId;
    grid[r + 1][c].itemId = targetItemId;
    grid[r + 2][c].itemId = otherId;
    grid[r + 3][c].itemId = targetItemId;
    scrubAroundVert(r, c);
    if (findRawMatches(grid).length > 0) {
      grid[r + 2][c].itemId = pickOtherId(others, otherId);
      scrubAroundVert(r, c);
    }
    if (findRawMatches(grid).length === 0 && hasSwapMatchForItem(grid, targetItemId)) {
      return true;
    }
    restoreCells(grid, backup);
    return false;
  };

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE - 3; c++) {
      if (tryHoriz(r, c)) return true;
    }
  }
  for (let c = 0; c < GRID_SIZE; c++) {
    for (let r = 0; r < GRID_SIZE - 3; r++) {
      if (tryVert(r, c)) return true;
    }
  }

  // Nuclear centre plant: wipe a clean band so T-T-O-T cannot be blocked.
  const r = 3;
  const c = 1;
  const otherId = others[0];
  for (let rr = Math.max(0, r - 1); rr <= Math.min(GRID_SIZE - 1, r + 1); rr++) {
    for (let cc = c; cc <= c + 3; cc++) {
      grid[rr][cc].itemId = pickOtherId(others, targetItemId);
    }
  }
  grid[r][c].itemId = targetItemId;
  grid[r][c + 1].itemId = targetItemId;
  grid[r][c + 2].itemId = otherId;
  grid[r][c + 3].itemId = targetItemId;
  return hasSwapMatchForItem(grid, targetItemId);
}

/** Guarantee at least one swap can match targetItemId (mutates grid in place). */
export function ensureTimedTargetPlayable(
  grid: Tile[][],
  targetItemId: string,
  allItemIds: string[],
): boolean {
  if (!targetItemId || allItemIds.length === 0) return false;
  if (hasSwapMatchForItem(grid, targetItemId)) return true;

  let attempts = 0;
  while (attempts < 64) {
    attempts++;
    if (plantNearMatchForItem(grid, targetItemId, allItemIds, randInt(2) === 0)) return true;
  }

  if (forcePlantTargetMatch(grid, targetItemId, allItemIds)) return true;

  // Final guarantee: rebuild a minimal playable window even if the board is hostile.
  forcePlantTargetMatch(grid, targetItemId, allItemIds);
  return hasSwapMatchForItem(grid, targetItemId);
}

/** @deprecated Use ensureTimedTargetPlayable */
export const ensureFunTargetPlayable = ensureTimedTargetPlayable;

/**
 * Late-round assist: when unfinished words are too scarce on the board to match,
 * convert donor tiles (prefer finished / over-represented) into the scarce id,
 * then ensure at least one playable swap for that word.
 */
export function boostScarceUnfinishedWords(
  grid: Tile[][],
  unfinishedIds: readonly string[],
  allItemIds: readonly string[],
  minCount = 4,
): boolean {
  if (unfinishedIds.length === 0 || allItemIds.length === 0) return false;
  const unfinished = new Set(unfinishedIds);
  let changed = false;

  const recount = () => {
    const m = new Map<string, number>();
    for (const row of grid) {
      for (const t of row) {
        m.set(t.itemId, (m.get(t.itemId) ?? 0) + 1);
      }
    }
    return m;
  };

  const pickDonor = (needId: string, counts: Map<string, number>, allowAutoMatch: boolean): Cell | null => {
    let best: Cell | null = null;
    let bestScore = -1;
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const id = grid[r][c].itemId;
        if (id === needId) continue;
        const donorCount = counts.get(id) ?? 0;
        if (unfinished.has(id) && donorCount <= minCount) continue;
        if (!allowAutoMatch && wouldAutoMatch(grid, r, c, needId)) continue;
        const score = (unfinished.has(id) ? 0 : 50) + donorCount;
        if (score > bestScore) {
          bestScore = score;
          best = { r, c };
        }
      }
    }
    return best;
  };

  for (const needId of unfinishedIds) {
    let counts = recount();
    while ((counts.get(needId) ?? 0) < minCount) {
      const donor =
        pickDonor(needId, counts, false) ?? pickDonor(needId, counts, true);
      if (!donor) break;
      grid[donor.r][donor.c] = {
        id: grid[donor.r][donor.c].id,
        itemId: needId,
      };
      changed = true;
      counts = recount();
    }
    if ((recount().get(needId) ?? 0) >= 3) {
      ensureFunTargetPlayable(grid, needId, [...allItemIds]);
    }
  }

  return changed;
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
