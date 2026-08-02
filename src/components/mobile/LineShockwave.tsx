import { useLayoutEffect, useMemo, useState, type CSSProperties, type RefObject } from 'react';
import { motion } from 'motion/react';
import { cellBoundsPx, cellCenterPx } from '../../lib/gridLayout';
import type { Cell } from '../../types/game';

const GRID = 7;
/** Fast enough that gravity can start while the wave is still fading. */
const BURST_SEC = 0.42;

type ShockHue = 'pink' | 'gold' | 'blue';

const HUE_VARS: Record<
  ShockHue,
  {
    glow: string;
    mid: string;
    deep: string;
    spark: string;
  }
> = {
  pink: {
    glow: '255, 70, 175',
    mid: '255, 130, 210',
    deep: '230, 40, 150',
    spark: '255, 170, 220',
  },
  gold: {
    glow: '255, 190, 40',
    mid: '255, 230, 120',
    deep: '240, 150, 20',
    spark: '255, 220, 140',
  },
  blue: {
    glow: '60, 160, 255',
    mid: '140, 210, 255',
    deep: '30, 110, 240',
    spark: '160, 220, 255',
  },
};

const HUES: ShockHue[] = ['pink', 'gold', 'blue'];

type LineShockwaveProps = {
  cells: Cell[];
  boardRef: RefObject<HTMLDivElement | null>;
  burstKey: number;
  /** Epicenter of the blast (matched / swapped cell). */
  origin?: Cell | null;
};

function detectLines(cells: Cell[]): { rows: number[]; cols: number[] } {
  const rowCounts = new Map<number, number>();
  const colCounts = new Map<number, number>();
  for (const c of cells) {
    rowCounts.set(c.r, (rowCounts.get(c.r) ?? 0) + 1);
    colCounts.set(c.c, (colCounts.get(c.c) ?? 0) + 1);
  }
  return {
    rows: [...rowCounts.entries()].filter(([, n]) => n >= GRID).map(([r]) => r),
    cols: [...colCounts.entries()].filter(([, n]) => n >= GRID).map(([c]) => c),
  };
}

function clampOrigin(origin: Cell | null | undefined, fallback: Cell): Cell {
  if (!origin) return fallback;
  return {
    r: Math.max(0, Math.min(GRID - 1, origin.r)),
    c: Math.max(0, Math.min(GRID - 1, origin.c)),
  };
}

function hueStyle(hue: ShockHue): CSSProperties {
  const v = HUE_VARS[hue];
  return {
    '--shock-glow': v.glow,
    '--shock-mid': v.mid,
    '--shock-deep': v.deep,
    '--shock-spark': v.spark,
  } as CSSProperties;
}

/** Few CSS sparkles — avoid a Motion node per spark on iOS. */
function Sparkles({
  boardW,
  boardH,
  axis,
  lineIndex,
  originFrac,
}: {
  boardW: number;
  boardH: number;
  axis: 'row' | 'col';
  lineIndex: number;
  originFrac: number;
}) {
  const bounds =
    axis === 'row'
      ? cellBoundsPx(boardW, boardH, { r: lineIndex, c: 0 })
      : cellBoundsPx(boardW, boardH, { r: 0, c: lineIndex });
  const along = axis === 'row' ? boardW : boardH;
  const seeds = [0.2, 0.5, 0.8];

  return (
    <>
      {seeds.map((t, i) => {
        const dist = Math.abs(t - originFrac);
        const delay = dist * BURST_SEC * 0.75;
        const size = 9 + (i % 2) * 3;
        const cross = (i % 2 === 0 ? -1 : 1) * (bounds.h || bounds.w) * 0.18;
        const style: CSSProperties =
          axis === 'row'
            ? {
                left: along * t,
                top: bounds.y + bounds.h / 2 + cross,
                width: size,
                height: size,
                animation: `line-shock-spark-pop 0.45s ease-out ${delay}s both`,
              }
            : {
                left: bounds.x + bounds.w / 2 + cross,
                top: along * t,
                width: size,
                height: size,
                animation: `line-shock-spark-pop 0.45s ease-out ${delay}s both`,
              };
        return <div key={i} className="line-shock-spark" style={style} />;
      })}
    </>
  );
}

function RowBurst({
  boardW,
  boardH,
  row,
  originCol,
}: {
  boardW: number;
  boardH: number;
  row: number;
  originCol: number;
}) {
  const bounds = cellBoundsPx(boardW, boardH, { r: row, c: 0 });
  const origin = cellCenterPx(boardW, boardH, { r: row, c: originCol });
  const bandH = Math.max(32, bounds.h * 1.05);
  const originFrac = origin.x / Math.max(1, boardW);

  return (
    <>
      <motion.div
        className="line-shock-beam line-shock-beam-h"
        style={{
          top: bounds.y + bounds.h / 2,
          height: bandH,
          marginTop: -bandH / 2,
          transformOrigin: `${origin.x}px 50%`,
        }}
        initial={{ scaleX: 0.05, opacity: 0 }}
        animate={{ scaleX: 1, opacity: [0, 1, 1, 0.2] }}
        transition={{
          duration: BURST_SEC,
          ease: [0.12, 0.7, 0.18, 1],
          opacity: { duration: BURST_SEC, times: [0, 0.1, 0.8, 1] },
        }}
      >
        <div className="line-shock-glow-h" />
        <div className="line-shock-core-h" />
        <div className="line-shock-hot-h" />
      </motion.div>
      <motion.div
        className="line-shock-blast"
        style={{ left: origin.x, top: origin.y, width: bandH * 1.35, height: bandH * 1.35 }}
        initial={{ scale: 0.15, opacity: 0 }}
        animate={{ scale: [0.15, 1.35, 1], opacity: [0, 1, 0] }}
        transition={{ duration: BURST_SEC * 0.65, ease: 'easeOut' }}
      />
      <Sparkles
        boardW={boardW}
        boardH={boardH}
        axis="row"
        lineIndex={row}
        originFrac={originFrac}
      />
    </>
  );
}

function ColBurst({
  boardW,
  boardH,
  col,
  originRow,
}: {
  boardW: number;
  boardH: number;
  col: number;
  originRow: number;
}) {
  const bounds = cellBoundsPx(boardW, boardH, { r: 0, c: col });
  const origin = cellCenterPx(boardW, boardH, { r: originRow, c: col });
  const bandW = Math.max(32, bounds.w * 1.05);
  const originFrac = origin.y / Math.max(1, boardH);

  return (
    <>
      <motion.div
        className="line-shock-beam line-shock-beam-v"
        style={{
          left: bounds.x + bounds.w / 2,
          width: bandW,
          marginLeft: -bandW / 2,
          transformOrigin: `50% ${origin.y}px`,
        }}
        initial={{ scaleY: 0.05, opacity: 0 }}
        animate={{ scaleY: 1, opacity: [0, 1, 1, 0.2] }}
        transition={{
          duration: BURST_SEC,
          ease: [0.12, 0.7, 0.18, 1],
          opacity: { duration: BURST_SEC, times: [0, 0.1, 0.8, 1] },
        }}
      >
        <div className="line-shock-glow-v" />
        <div className="line-shock-core-v" />
        <div className="line-shock-hot-v" />
      </motion.div>
      <motion.div
        className="line-shock-blast"
        style={{ left: origin.x, top: origin.y, width: bandW * 1.35, height: bandW * 1.35 }}
        initial={{ scale: 0.15, opacity: 0 }}
        animate={{ scale: [0.15, 1.35, 1], opacity: [0, 1, 0] }}
        transition={{ duration: BURST_SEC * 0.65, ease: 'easeOut' }}
      />
      <Sparkles
        boardW={boardW}
        boardH={boardH}
        axis="col"
        lineIndex={col}
        originFrac={originFrac}
      />
    </>
  );
}

export function LineShockwave({ cells, boardRef, burstKey, origin }: LineShockwaveProps) {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const { rows, cols } = detectLines(cells);
  const hue = useMemo(() => HUES[Math.abs(burstKey) % HUES.length]!, [burstKey]);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board || cells.length === 0) {
      setSize(null);
      return;
    }
    setSize({ w: board.clientWidth, h: board.clientHeight });
  }, [boardRef, cells, burstKey]);

  if (!size || (rows.length === 0 && cols.length === 0)) return null;

  const fallback: Cell = cells[Math.floor(cells.length / 2)] ?? { r: 3, c: 3 };
  const epicenter = clampOrigin(origin, fallback);

  return (
    <div
      key={burstKey}
      className="pointer-events-none absolute inset-0 z-[50] overflow-visible"
      style={hueStyle(hue)}
      data-shock-hue={hue}
      aria-hidden
    >
      {rows.map((row) => (
        <RowBurst
          key={`r-${row}`}
          boardW={size.w}
          boardH={size.h}
          row={row}
          originCol={epicenter.c}
        />
      ))}
      {cols.map((col) => (
        <ColBurst
          key={`c-${col}`}
          boardW={size.w}
          boardH={size.h}
          col={col}
          originRow={epicenter.r}
        />
      ))}
    </div>
  );
}
