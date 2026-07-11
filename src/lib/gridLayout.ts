import type { Cell } from '../types/game';

const GRID_SIZE = 7;
// Grid 变小后 cell 会变大，这里把间隙稍微缩小，避免 emoji/特效显得挤
const GRID_GAP_PX = 2;

/** Cell pixel bounds within the board (top-left origin). */
export function cellBoundsPx(
  boardWidth: number,
  boardHeight: number,
  cell: Cell,
): { x: number; y: number; w: number; h: number; rx: number } {
  if (boardWidth <= 0 || boardHeight <= 0) {
    return { x: 0, y: 0, w: 0, h: 0, rx: 0 };
  }
  const cellW = (boardWidth - GRID_GAP_PX * (GRID_SIZE - 1)) / GRID_SIZE;
  const cellH = (boardHeight - GRID_GAP_PX * (GRID_SIZE - 1)) / GRID_SIZE;
  return {
    x: cell.c * (cellW + GRID_GAP_PX),
    y: cell.r * (cellH + GRID_GAP_PX),
    w: cellW,
    h: cellH,
    rx: Math.min(cellW, cellH) * 0.22,
  };
}

export function gridCellMetrics(boardWidth: number, boardHeight: number) {
  const cellW = (boardWidth - GRID_GAP_PX * (GRID_SIZE - 1)) / GRID_SIZE;
  const cellH = (boardHeight - GRID_GAP_PX * (GRID_SIZE - 1)) / GRID_SIZE;
  return { cellW, cellH };
}

/** Pixel center of a cell within the board (top-left origin). */
export function cellCenterPx(
  boardWidth: number,
  boardHeight: number,
  cell: Cell,
): { x: number; y: number } {
  if (boardWidth <= 0 || boardHeight <= 0) {
    return { x: 0, y: 0 };
  }
  const cellW = (boardWidth - GRID_GAP_PX * (GRID_SIZE - 1)) / GRID_SIZE;
  const cellH = (boardHeight - GRID_GAP_PX * (GRID_SIZE - 1)) / GRID_SIZE;
  return {
    x: cell.c * (cellW + GRID_GAP_PX) + cellW / 2,
    y: cell.r * (cellH + GRID_GAP_PX) + cellH / 2,
  };
}

/** Offset from board center to cell center, for pop-from-cell animation. */
export function cellCenterOffset(
  boardWidth: number,
  boardHeight: number,
  cell: Cell,
): { x: number; y: number; scale: number } {
  if (boardWidth <= 0 || boardHeight <= 0) {
    return { x: 0, y: 0, scale: 0.16 };
  }
  const cellW = (boardWidth - GRID_GAP_PX * (GRID_SIZE - 1)) / GRID_SIZE;
  const cellH = (boardHeight - GRID_GAP_PX * (GRID_SIZE - 1)) / GRID_SIZE;
  const cx = cell.c * (cellW + GRID_GAP_PX) + cellW / 2;
  const cy = cell.r * (cellH + GRID_GAP_PX) + cellH / 2;
  const tileScale = Math.min(cellW, cellH) / Math.min(boardWidth, boardHeight);
  return {
    x: cx - boardWidth / 2,
    y: cy - boardHeight / 2,
    scale: Math.max(0.12, Math.min(0.22, tileScale * 2.2)),
  };
}
