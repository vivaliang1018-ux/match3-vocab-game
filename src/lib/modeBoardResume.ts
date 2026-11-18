import type { MoodPaletteId } from './moodBoard';
import type { Tile, WordItem } from '../types/game';
import { getActiveCourseId } from '../course';

export type ResumableMode = 'mood' | 'category';

export type ModeBoardSnapshot = {
  version: 1;
  userId: string;
  mode: ResumableMode;
  categoryId: string | null;
  paletteId: MoodPaletteId | null;
  grid: Tile[][];
  gameItems: WordItem[];
  itemHitCount: Record<string, number>;
  /** False means the daily play and, for free users, board entry were charged. */
  playOwed: boolean;
  savedAt: number;
};

function storageKey(mode: ResumableMode, userId: string | null, categoryId?: string | null): string {
  return `matchingo-mode-board-v1:${getActiveCourseId()}:${userId || 'guest'}:${mode}:${categoryId || '-'}`;
}

export function loadModeBoardSnapshot(
  mode: ResumableMode,
  userId: string | null,
  categoryId?: string | null,
): ModeBoardSnapshot | null {
  try {
    const raw = localStorage.getItem(storageKey(mode, userId, categoryId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ModeBoardSnapshot>;
    if (parsed.version !== 1 || parsed.mode !== mode || parsed.userId !== (userId || 'guest') ||
      parsed.categoryId !== (categoryId || null) || !Array.isArray(parsed.grid) ||
      parsed.grid.length !== 7 || parsed.grid.some((row) => !Array.isArray(row) || row.length !== 7) ||
      !Array.isArray(parsed.gameItems) || parsed.gameItems.length < 6 ||
      typeof parsed.playOwed !== 'boolean') return null;
    return parsed as ModeBoardSnapshot;
  } catch {
    return null;
  }
}

export function validModeBoardSnapshot(
  snapshot: ModeBoardSnapshot,
  available: readonly WordItem[],
): boolean {
  const known = new Set(available.map((item) => item.id));
  const itemIds = new Set(snapshot.gameItems.map((item) => item.id));
  return snapshot.gameItems.every((item) => known.has(item.id)) &&
    snapshot.grid.every((row) => row.every((tile) => itemIds.has(tile.itemId)));
}

export function saveModeBoardSnapshot(snapshot: ModeBoardSnapshot): void {
  try {
    localStorage.setItem(storageKey(snapshot.mode, snapshot.userId, snapshot.categoryId), JSON.stringify(snapshot));
  } catch {
    // Continue the current session even if storage is unavailable.
  }
}

export function removeModeBoardSnapshot(
  mode: ResumableMode,
  userId: string | null,
  categoryId?: string | null,
): void {
  try {
    localStorage.removeItem(storageKey(mode, userId, categoryId));
  } catch {
    // Optional crash recovery only.
  }
}

export function hasPaidModeBoard(
  mode: ResumableMode,
  userId: string | null,
  categoryId?: string | null,
): boolean {
  return loadModeBoardSnapshot(mode, userId, categoryId)?.playOwed === false;
}
