import { useLayoutEffect, useState } from 'react';
import { cellBoundsPx, cellCenterPx, gridCellMetrics } from '../../lib/gridLayout';
import type { Cell } from '../../types/game';

const GRID = 7;

function orderMatchCells(cells: Cell[]): Cell[] {
  if (cells.length <= 1) return cells;
  const sameRow = cells.every((c) => c.r === cells[0].r);
  if (sameRow) return [...cells].sort((a, b) => a.c - b.c);
  const sameCol = cells.every((c) => c.c === cells[0].c);
  if (sameCol) return [...cells].sort((a, b) => a.r - b.r);
  return [...cells].sort((a, b) => a.r - b.r || a.c - b.c);
}

function detectClearKind(cells: Cell[]): 'match' | 'row' | 'col' | 'cross' {
  const rowCounts = new Map<number, number>();
  const colCounts = new Map<number, number>();
  for (const c of cells) {
    rowCounts.set(c.r, (rowCounts.get(c.r) ?? 0) + 1);
    colCounts.set(c.c, (colCounts.get(c.c) ?? 0) + 1);
  }
  const fullRows = [...rowCounts.entries()].filter(([, n]) => n >= GRID).map(([r]) => r);
  const fullCols = [...colCounts.entries()].filter(([, n]) => n >= GRID).map(([c]) => c);
  if (fullRows.length > 0 && fullCols.length > 0) return 'cross';
  if (fullRows.length > 0) return 'row';
  if (fullCols.length > 0) return 'col';
  return 'match';
}

function buildLightningPath(
  ordered: Cell[],
  boardW: number,
  boardH: number,
  cellW: number,
): string {
  const pts = ordered.map((c) => cellCenterPx(boardW, boardH, c));
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

  const vertical = ordered.every((c) => c.c === ordered[0].c);
  const amp = cellW * 0.14;
  let d = `M ${pts[0].x} ${pts[0].y}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    for (let s = 1; s <= 4; s++) {
      const t = s / 4;
      const x = a.x + (b.x - a.x) * t;
      const y = a.y + (b.y - a.y) * t;
      const j = ((s + i) % 2 === 0 ? 1 : -1) * amp;
      d += vertical ? ` L ${x + j} ${y}` : ` L ${x} ${y + j}`;
    }
  }
  return d;
}

type ClipRect = { x: number; y: number; w: number; h: number; rx: number };

type MatchGeom = {
  mode: 'match';
  w: number;
  h: number;
  clipRects: ClipRect[];
  spine: { x: number; y: number; w: number; h: number };
  lightning: string;
  hotspots: { x: number; y: number; r: number }[];
  vertical: boolean;
};

type LineGeom = {
  mode: 'row' | 'col' | 'cross';
  w: number;
  h: number;
  clipRects: ClipRect[];
  rows: number[];
  cols: number[];
  cellW: number;
  cellH: number;
  sparks: { x: number; y: number; delay: number; size: number }[];
  cross?: { x: number; y: number };
};

type EnergyGeom = MatchGeom | LineGeom;

type MatchClearEnergyProps = {
  cells: Cell[];
  boardRef: React.RefObject<HTMLDivElement | null>;
  burstKey: number;
};

function clipRectsForCells(cells: Cell[], w: number, h: number): ClipRect[] {
  return cells.map((cell) => cellBoundsPx(w, h, cell));
}

function buildLineGeom(cells: Cell[], w: number, h: number, kind: 'row' | 'col' | 'cross'): LineGeom {
  const rowCounts = new Map<number, number>();
  const colCounts = new Map<number, number>();
  for (const c of cells) {
    rowCounts.set(c.r, (rowCounts.get(c.r) ?? 0) + 1);
    colCounts.set(c.c, (colCounts.get(c.c) ?? 0) + 1);
  }
  const rows = [...rowCounts.entries()].filter(([, n]) => n >= GRID).map(([r]) => r);
  const cols = [...colCounts.entries()].filter(([, n]) => n >= GRID).map(([c]) => c);
  const { cellW, cellH } = gridCellMetrics(w, h);

  const sparks: LineGeom['sparks'] = [];
  for (const r of rows) {
    const b = cellBoundsPx(w, h, { r, c: 0 });
    const cy = b.y + b.h / 2;
    for (let i = 0; i < 10; i++) {
      sparks.push({
        x: b.x + (w / 10) * i + cellW * 0.2,
        y: cy + (i % 2 === 0 ? -cellH * 0.18 : cellH * 0.18),
        delay: i * 0.035,
        size: 2 + (i % 3),
      });
    }
  }
  for (const c of cols) {
    const b = cellBoundsPx(w, h, { r: 0, c });
    const cx = b.x + b.w / 2;
    for (let i = 0; i < 10; i++) {
      sparks.push({
        x: cx + (i % 2 === 0 ? -cellW * 0.18 : cellW * 0.18),
        y: b.y + (h / 10) * i + cellH * 0.2,
        delay: 0.05 + i * 0.035,
        size: 2 + (i % 3),
      });
    }
  }

  let cross: { x: number; y: number } | undefined;
  if (kind === 'cross' && rows[0] !== undefined && cols[0] !== undefined) {
    const p = cellCenterPx(w, h, { r: rows[0], c: cols[0] });
    cross = { x: p.x, y: p.y };
  }

  return {
    mode: kind,
    w,
    h,
    clipRects: clipRectsForCells(cells, w, h),
    rows,
    cols,
    cellW,
    cellH,
    sparks,
    cross,
  };
}

function MatchClearMatchEffect({ geom, burstKey }: { geom: MatchGeom; burstKey: number }) {
  const uid = burstKey;
  return (
    <>
      <defs>
        <clipPath id={`match-clip-${uid}`}>
          {geom.clipRects.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx={r.rx} />
          ))}
        </clipPath>
        <linearGradient
          id={`match-grad-${uid}`}
          x1={geom.vertical ? '50%' : '0%'}
          y1={geom.vertical ? '0%' : '50%'}
          x2={geom.vertical ? '50%' : '100%'}
          y2={geom.vertical ? '100%' : '50%'}
        >
          <stop offset="0%" stopColor="rgba(255,210,60,0.15)" />
          <stop offset="35%" stopColor="rgba(255,235,140,0.75)" />
          <stop offset="50%" stopColor="rgba(255,255,255,1)" />
          <stop offset="65%" stopColor="rgba(255,235,140,0.75)" />
          <stop offset="100%" stopColor="rgba(255,210,60,0.15)" />
        </linearGradient>
        <filter id={`match-glow-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`hot-${uid}`}>
          <stop offset="0%" stopColor="rgba(255,255,255,1)" />
          <stop offset="45%" stopColor="rgba(255,230,120,0.85)" />
          <stop offset="100%" stopColor="rgba(255,200,50,0)" />
        </radialGradient>
      </defs>

      <g
        clipPath={`url(#match-clip-${uid})`}
        style={{ animation: 'match-energy-fade 0.5s ease-out forwards' }}
      >
        <rect
          x={geom.spine.x}
          y={geom.spine.y}
          width={geom.spine.w}
          height={geom.spine.h}
          fill={`url(#match-grad-${uid})`}
          rx={geom.spine.w / 2}
        />
        {geom.hotspots.map((hot, i) => (
          <circle
            key={i}
            cx={hot.x}
            cy={hot.y}
            r={hot.r}
            fill={`url(#hot-${uid})`}
            style={{ animation: `match-hotspot-pulse 0.5s ease-out ${i * 0.04}s forwards` }}
          />
        ))}
        <path
          d={geom.lightning}
          fill="none"
          stroke="rgba(255,220,80,0.9)"
          strokeWidth={Math.max(5, geom.spine.w * 0.55)}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#match-glow-${uid})`}
          style={{ animation: 'lightning-strike 0.5s ease-out forwards' }}
        />
        <path
          d={geom.lightning}
          fill="none"
          stroke="white"
          strokeWidth={Math.max(2, geom.spine.w * 0.22)}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animation: 'lightning-strike 0.5s ease-out forwards' }}
        />
      </g>
      {geom.clipRects.map((r, i) => (
        <rect
          key={`frame-${i}`}
          x={r.x + 1}
          y={r.y + 1}
          width={r.w - 2}
          height={r.h - 2}
          rx={r.rx}
          fill="none"
          stroke="rgba(255,225,100,0.95)"
          strokeWidth={2}
          style={{
            animation: 'match-frame-fade 0.5s ease-out forwards',
            filter: 'drop-shadow(0 0 4px rgba(255,210,60,0.85))',
          }}
        />
      ))}
    </>
  );
}

function HorizontalBeam({ w, h, row, uid }: { w: number; h: number; row: number; uid: number }) {
  const bounds = cellBoundsPx(w, h, { r: row, c: 0 });
  const cy = bounds.y + bounds.h / 2;
  const beamH = bounds.h * 0.72;
  const outerH = beamH * 2.1;

  return (
    <g style={{ transformOrigin: `${w / 2}px ${cy}px`, animation: 'line-beam-h 0.62s ease-out forwards' }}>
      <rect
        x={0}
        y={cy - outerH / 2}
        width={w}
        height={outerH}
        rx={outerH / 2}
        fill={`url(#line-outer-h-${uid})`}
        opacity={0.85}
      />
      <rect
        x={bounds.x * 0.02}
        y={cy - beamH / 2}
        width={w * 0.96}
        height={beamH}
        rx={beamH / 2}
        fill={`url(#line-mid-h-${uid})`}
      />
      <rect
        x={w * 0.06}
        y={cy - beamH * 0.14}
        width={w * 0.88}
        height={beamH * 0.28}
        rx={beamH * 0.14}
        fill="white"
        opacity={0.95}
      />
    </g>
  );
}

function VerticalBeam({ w, h, col, uid }: { w: number; h: number; col: number; uid: number }) {
  const bounds = cellBoundsPx(w, h, { r: 0, c: col });
  const cx = bounds.x + bounds.w / 2;
  const beamW = bounds.w * 0.72;
  const outerW = beamW * 2.1;

  return (
    <g style={{ transformOrigin: `${cx}px ${h / 2}px`, animation: 'line-beam-v 0.62s ease-out forwards' }}>
      <rect
        x={cx - outerW / 2}
        y={0}
        width={outerW}
        height={h}
        rx={outerW / 2}
        fill={`url(#line-outer-v-${uid})`}
        opacity={0.85}
      />
      <rect
        x={cx - beamW / 2}
        y={bounds.y * 0.02}
        width={beamW}
        height={h * 0.96}
        rx={beamW / 2}
        fill={`url(#line-mid-v-${uid})`}
      />
      <rect
        x={cx - beamW * 0.14}
        y={h * 0.06}
        width={beamW * 0.28}
        height={h * 0.88}
        rx={beamW * 0.14}
        fill="white"
        opacity={0.95}
      />
    </g>
  );
}

function MatchClearLineEffect({ geom, burstKey }: { geom: LineGeom; burstKey: number }) {
  const uid = burstKey;

  return (
    <>
      <defs>
        <clipPath id={`line-clip-${uid}`}>
          {geom.clipRects.map((r, i) => (
            <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} rx={r.rx} />
          ))}
        </clipPath>
        <linearGradient id={`line-outer-h-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="rgba(255,180,40,0)" />
          <stop offset="20%" stopColor="rgba(255,200,50,0.55)" />
          <stop offset="50%" stopColor="rgba(255,230,100,0.95)" />
          <stop offset="80%" stopColor="rgba(255,200,50,0.55)" />
          <stop offset="100%" stopColor="rgba(255,180,40,0)" />
        </linearGradient>
        <linearGradient id={`line-mid-h-${uid}`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="rgba(255,210,60,0.3)" />
          <stop offset="50%" stopColor="rgba(255,245,160,1)" />
          <stop offset="100%" stopColor="rgba(255,210,60,0.3)" />
        </linearGradient>
        <linearGradient id={`line-outer-v-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,180,40,0)" />
          <stop offset="20%" stopColor="rgba(255,200,50,0.55)" />
          <stop offset="50%" stopColor="rgba(255,230,100,0.95)" />
          <stop offset="80%" stopColor="rgba(255,200,50,0.55)" />
          <stop offset="100%" stopColor="rgba(255,180,40,0)" />
        </linearGradient>
        <linearGradient id={`line-mid-v-${uid}`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,210,60,0.3)" />
          <stop offset="50%" stopColor="rgba(255,245,160,1)" />
          <stop offset="100%" stopColor="rgba(255,210,60,0.3)" />
        </linearGradient>
        <radialGradient id={`cross-flash-${uid}`}>
          <stop offset="0%" stopColor="rgba(255,255,255,1)" />
          <stop offset="40%" stopColor="rgba(255,240,140,0.9)" />
          <stop offset="100%" stopColor="rgba(255,200,50,0)" />
        </radialGradient>
        <filter id={`line-blur-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <g
        clipPath={`url(#line-clip-${uid})`}
        style={{ animation: 'line-energy-fade 0.62s ease-out forwards' }}
      >
        {geom.rows.map((row) => (
          <HorizontalBeam key={`r-${row}`} w={geom.w} h={geom.h} row={row} uid={uid} />
        ))}
        {geom.cols.map((col) => (
          <VerticalBeam key={`c-${col}`} w={geom.w} h={geom.h} col={col} uid={uid} />
        ))}
        {geom.cross && (
          <circle
            cx={geom.cross.x}
            cy={geom.cross.y}
            r={geom.cellW * 0.55}
            fill={`url(#cross-flash-${uid})`}
            filter={`url(#line-blur-${uid})`}
            style={{ animation: 'cross-flash 0.62s ease-out forwards' }}
          />
        )}
        {geom.sparks.map((s, i) => (
          <circle
            key={`spark-${i}`}
            cx={s.x}
            cy={s.y}
            r={s.size}
            fill="white"
            style={{
              animation: `sparkle-twinkle 0.55s ease-out ${s.delay}s forwards`,
              filter: 'drop-shadow(0 0 3px rgba(255,240,120,1))',
            }}
          />
        ))}
      </g>
      {geom.clipRects.map((r, i) => (
        <rect
          key={`line-frame-${i}`}
          x={r.x + 1}
          y={r.y + 1}
          width={r.w - 2}
          height={r.h - 2}
          rx={r.rx}
          fill="none"
          stroke="rgba(255,235,120,1)"
          strokeWidth={2.5}
          style={{
            animation: 'line-frame-pulse 0.62s ease-out forwards',
            filter: 'drop-shadow(0 0 6px rgba(255,210,60,0.95))',
          }}
        />
      ))}
    </>
  );
}

export function MatchClearEnergy({ cells, boardRef, burstKey }: MatchClearEnergyProps) {
  const [geom, setGeom] = useState<EnergyGeom | null>(null);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board || cells.length === 0) {
      setGeom(null);
      return;
    }

    const w = board.clientWidth;
    const h = board.clientHeight;
    const kind = detectClearKind(cells);

    if (kind === 'row' || kind === 'col' || kind === 'cross') {
      setGeom(buildLineGeom(cells, w, h, kind));
      return;
    }

    const ordered = orderMatchCells(cells);
    const { cellW } = gridCellMetrics(w, h);
    const clipRects = clipRectsForCells(ordered, w, h);
    const minX = Math.min(...clipRects.map((r) => r.x));
    const maxX = Math.max(...clipRects.map((r) => r.x + r.w));
    const minY = Math.min(...clipRects.map((r) => r.y));
    const maxY = Math.max(...clipRects.map((r) => r.y + r.h));
    const vertical = ordered.every((c) => c.c === ordered[0].c);
    const spineW = cellW * 0.36;
    const cx = (minX + maxX) / 2;

    setGeom({
      mode: 'match',
      w,
      h,
      clipRects,
      spine: { x: cx - spineW / 2, y: minY, w: spineW, h: maxY - minY },
      lightning: buildLightningPath(ordered, w, h, cellW),
      hotspots: ordered.map((cell) => {
        const p = cellCenterPx(w, h, cell);
        return { x: p.x, y: p.y, r: cellW * 0.38 };
      }),
      vertical,
    });
  }, [cells, boardRef, burstKey]);

  if (!geom) return null;

  return (
    <svg
      key={burstKey}
      className="pointer-events-none absolute inset-0 z-[22]"
      width={geom.w}
      height={geom.h}
      viewBox={`0 0 ${geom.w} ${geom.h}`}
      aria-hidden
    >
      {geom.mode === 'match' ? (
        <MatchClearMatchEffect geom={geom} burstKey={burstKey} />
      ) : (
        <MatchClearLineEffect geom={geom} burstKey={burstKey} />
      )}
    </svg>
  );
}
