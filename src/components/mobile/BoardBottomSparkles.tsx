import type { CSSProperties } from 'react';
import { BOARD_SPARKLE_STARS } from '../../data/boardSparkleStars';
import { cn } from '../../lib/utils';

export function BoardBottomSparkles() {
  return (
    <div className="game-board-sparkles pointer-events-none" aria-hidden>
      {BOARD_SPARKLE_STARS.map((star, i) => (
        <span
          key={i}
          className={cn(
            'splash-star absolute',
            i % 3 === 0 ? 'text-sky-100' : i % 3 === 1 ? 'text-white' : 'text-pink-100',
          )}
          style={
            {
              left: star.x,
              top: star.y,
              fontSize: star.size,
              '--star-delay': `${star.delay}s`,
              '--star-dur': `${star.dur}s`,
            } as CSSProperties
          }
        >
          ✦
        </span>
      ))}
    </div>
  );
}
