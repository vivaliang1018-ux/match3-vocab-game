import { useEffect } from 'react';
import { motion } from 'motion/react';
import { IOS_EASE } from '../../lib/motionPresets';

type Point = { x: number; y: number };

function quadPoint(t: number, p0: Point, p1: Point, p2: Point): Point {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

function StarShape({ size = 8, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      className={className}
      aria-hidden
    >
      <path
        d="M5 0.5 L6.1 3.8 L9.6 3.9 L6.9 6.1 L7.8 9.6 L5 7.7 L2.2 9.6 L3.1 6.1 L0.4 3.9 L3.9 3.8 Z"
        fill="white"
      />
    </svg>
  );
}

export type WordLinkChainProps = {
  from: Point;
  to: Point;
  emoji?: string;
  imgSrc?: string;
  burstKey: number;
  onDone?: () => void;
};

export function WordLinkChain({
  from,
  to,
  emoji,
  imgSrc,
  burstKey,
  onDone,
}: WordLinkChainProps) {
  const ctrl: Point = {
    x: (from.x + to.x) / 2,
    y: Math.min(from.y, to.y) - Math.max(36, Math.abs(to.x - from.x) * 0.18) - 24,
  };
  const pathD = `M ${from.x} ${from.y} Q ${ctrl.x} ${ctrl.y} ${to.x} ${to.y}`;

  const stars = Array.from({ length: 14 }, (_, i) => {
    const t = 0.08 + (i / 13) * 0.84;
    const p = quadPoint(t, from, ctrl, to);
    return { ...p, delay: i * 0.028, size: 5 + (i % 3) * 2, rot: (i * 27) % 360 };
  });

  useEffect(() => {
    const t = window.setTimeout(() => onDone?.(), 780);
    return () => window.clearTimeout(t);
  }, [burstKey, onDone]);

  return (
    <div key={burstKey} className="pointer-events-none absolute inset-0 z-[35] overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <filter id={`link-glow-${burstKey}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth={3}
          strokeLinecap="round"
          filter={`url(#link-glow-${burstKey})`}
          style={{ animation: 'word-link-trail 0.75s var(--ease-ios) forwards' }}
        />
        <path
          d={pathD}
          fill="none"
          stroke="rgba(255,245,200,0.85)"
          strokeWidth={1.2}
          strokeLinecap="round"
          strokeDasharray="4 7"
          style={{ animation: 'word-link-dash 0.75s var(--ease-ios) forwards' }}
        />
      </svg>

      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute left-0 top-0 will-change-transform"
          style={{ transform: `translate3d(${s.x}px, ${s.y}px, 0) translate(-50%, -50%) rotate(${s.rot}deg)` }}
          initial={{ opacity: 0, scale: 0, rotate: s.rot - 40 }}
          animate={{
            opacity: [0, 1, 0.8, 0],
            scale: [0, 1.3, 0.95, 0],
            rotate: [s.rot - 40, s.rot + 20, s.rot],
          }}
          transition={{ duration: 0.58, delay: s.delay, ease: IOS_EASE }}
        >
          <StarShape size={s.size} className="drop-shadow-[0_0_4px_rgba(255,255,255,0.95)]" />
        </motion.div>
      ))}

      <motion.div
        className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-lg bg-white/90 shadow-md shadow-pink-200/60"
        style={{
          offsetPath: `path('${pathD}')`,
          offsetAnchor: 'center',
        }}
        initial={{ offsetDistance: '0%', opacity: 0, scale: 0.45, rotate: -12 }}
        animate={{
          offsetDistance: '100%',
          opacity: [0, 1, 1, 0.9],
          scale: [0.45, 1.15, 1, 0.8],
          rotate: [-12, 6, 0],
        }}
        transition={{ duration: 0.72, ease: IOS_EASE }}
      >
        {imgSrc ? (
          <img src={imgSrc} alt="" className="h-6 w-6 object-contain" />
        ) : (
          <span className="text-xl leading-none">{emoji ?? '·'}</span>
        )}
      </motion.div>
    </div>
  );
}
