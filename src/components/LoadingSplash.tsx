import { useEffect } from 'react';
import { assetUrl } from '../lib/assetUrl';
import { SkySparkleBackground } from './SkySparkleBackground';

export const LOADING_SPLASH_BUILD = '2026-07-08-n';

export type LoadingSplashProps = {
  onDone?: () => void;
  onReady?: () => void;
  durationMs?: number;
  timeScale?: number;
  embedded?: boolean;
  exiting?: boolean;
};

export function LoadingSplash({
  onDone,
  onReady,
  durationMs = 1800,
  timeScale = 1,
  embedded = false,
  exiting = false,
}: LoadingSplashProps) {
  const durScale = Math.max(0.5, timeScale);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  useEffect(() => {
    if (!onDone) return;
    const timer = window.setTimeout(onDone, durationMs * durScale);
    return () => window.clearTimeout(timer);
  }, [onDone, durationMs, durScale]);

  return (
    <div
      className={
        embedded
          ? `splash-screen absolute inset-0 overflow-hidden select-none${exiting ? ' splash-exit' : ''}`
          : `splash-screen fixed inset-0 z-[200] overflow-hidden select-none${exiting ? ' splash-exit' : ''}`
      }
      style={{ '--splash-scale': durScale } as React.CSSProperties}
      aria-hidden
    >
      <SkySparkleBackground timeScale={durScale} variant="splash" />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="splash-logo relative z-20 px-4 text-center">
          <picture>
            <source
              srcSet={`${assetUrl('splash-logo.webp')}?v=20260709a`}
              type="image/webp"
            />
            <img
              src={`${assetUrl('splash-logo.png')}?v=20260709a`}
              alt="emoji match3"
              className="splash-logo-image mx-auto w-[min(80vw,360px)] max-w-full"
              draggable={false}
              decoding="async"
              fetchPriority="high"
              loading="eager"
            />
          </picture>
        </div>
      </div>

      <div className="splash-progress-wrap absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-0 right-0 flex justify-center">
        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/30">
          <div className="splash-progress-bar h-full rounded-full bg-white/90" />
        </div>
      </div>
    </div>
  );
}
