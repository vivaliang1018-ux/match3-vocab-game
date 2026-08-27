import { SPARKLE_STARS } from '../data/sparkleStars';
import { cn } from '../lib/utils';

export type SparkleBackgroundVariant = 'splash' | 'game';

/** Keep the full star field for the short splash, but use a sparse field during gameplay. */
const GAME_SPARKLE_STARS = SPARKLE_STARS.filter((_, i) => i % 4 === 0);

type SkySparkleBackgroundProps = {
  className?: string;
  timeScale?: number;
  variant?: SparkleBackgroundVariant;
};

export function SkySparkleBackground({
  className,
  timeScale = 1,
  variant = 'game',
}: SkySparkleBackgroundProps) {
  const durScale = Math.max(0.5, timeScale);
  const stars = variant === 'game' ? GAME_SPARKLE_STARS : SPARKLE_STARS;

  return (
    <div
      className={cn(
        'absolute inset-0 z-0 overflow-hidden',
        variant === 'splash' && 'app-sparkle--splash',
        variant === 'game' && 'app-sparkle--game',
        className,
      )}
      style={{ '--splash-scale': durScale } as React.CSSProperties}
      aria-hidden
    >
      <div
        className={cn(
          'absolute inset-0',
          variant === 'splash' ? 'app-sparkle-bg-splash' : 'app-sparkle-bg-game',
        )}
      />
      <div className="splash-sunburst app-sparkle-sunburst" />
      <div className="app-sparkle-glow app-sparkle-glow-pink" aria-hidden />
      <div className="app-sparkle-glow app-sparkle-glow-cream" aria-hidden />

      {stars.map((star, i) => (
        <span
          key={i}
          className={cn(
            'splash-star pointer-events-none absolute',
            variant === 'splash' ? 'z-10' : 'z-0',
            i % 3 === 0 ? 'text-amber-100' : i % 3 === 1 ? 'text-white' : 'text-pink-100',
          )}
          style={
            {
              left: star.x,
              top: star.y,
              fontSize: star.size,
              '--star-delay': `${star.delay}s`,
              '--star-dur': `${star.dur}s`,
            } as React.CSSProperties
          }
        >
          ✦
        </span>
      ))}
    </div>
  );
}
