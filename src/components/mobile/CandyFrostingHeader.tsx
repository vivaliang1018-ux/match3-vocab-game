import { useId, type CSSProperties } from 'react';

const HEADER_STARS = [
  { x: '6%', y: '28%', size: 12, delay: 0, dur: 2.4 },
  { x: '14%', y: '62%', size: 8, delay: 0.5, dur: 2.8 },
  { x: '22%', y: '38%', size: 14, delay: 0.2, dur: 3.1 },
  { x: '32%', y: '72%', size: 9, delay: 0.9, dur: 2.5 },
  { x: '38%', y: '24%', size: 11, delay: 0.35, dur: 2.9 },
  { x: '48%', y: '58%', size: 16, delay: 0.15, dur: 3.2 },
  { x: '54%', y: '32%', size: 8, delay: 0.7, dur: 2.6 },
  { x: '62%', y: '68%', size: 13, delay: 1.1, dur: 2.7 },
  { x: '70%', y: '42%', size: 10, delay: 0.45, dur: 3 },
  { x: '78%', y: '22%', size: 15, delay: 0.25, dur: 2.8 },
  { x: '84%', y: '56%', size: 9, delay: 0.85, dur: 3.1 },
  { x: '92%', y: '34%', size: 12, delay: 1.3, dur: 2.4 },
  { x: '58%', y: '18%', size: 10, delay: 1.6, dur: 2.9 },
  { x: '44%', y: '78%', size: 7, delay: 0.55, dur: 2.5 },
] as const;

type CandyFrostingHeaderProps = {
  title: string;
};

export function CandyFrostingHeader({ title }: CandyFrostingHeaderProps) {
  const waveId = useId().replace(/:/g, '');

  return (
    <div className="profile-candy-frosting">
      <div className="profile-candy-frosting-stripes" aria-hidden />
      <div className="profile-candy-frosting-shine" aria-hidden />

      {HEADER_STARS.map((star, i) => (
        <span
          key={i}
          className="profile-candy-frosting-star splash-star pointer-events-none absolute z-[1] text-white"
          style={
            {
              left: star.x,
              top: star.y,
              fontSize: star.size,
              '--star-delay': `${star.delay}s`,
              '--star-dur': `${star.dur}s`,
            } as CSSProperties
          }
          aria-hidden
        >
          ✦
        </span>
      ))}

      <h1 className="profile-candy-frosting-title">{title}</h1>
      <svg
        className="profile-candy-frosting-wave"
        viewBox="0 0 400 20"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill={`url(#${waveId})`}
          d="M0,20 H400 V8
             C384,2 366,14 348,8 C330,2 312,14 294,8
             C276,2 258,14 240,8 C222,2 204,14 186,8
             C168,2 150,14 132,8 C114,2 96,14 78,8
             C60,2 42,14 24,8 C12,4 6,12 0,8 Z"
        />
        <defs>
          <linearGradient id={waveId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffdf8" />
            <stop offset="100%" stopColor="#fff6eb" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
