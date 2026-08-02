import { useEffect } from 'react';
import { assetUrl } from '../lib/assetUrl';
import { SkySparkleBackground } from './SkySparkleBackground';

export const LOADING_SPLASH_BUILD = '2026-07-15-logo';

/** Candy logo archived under public/branding/archived/; live asset is public/splash-logo.* */
export type SplashVariant = 'logo' | 'tiles' | 'wave';

const MATCHINGO_LETTERS = [
  { ch: 'M', smile: false },
  { ch: 'a', smile: false },
  { ch: 't', smile: false },
  { ch: 'c', smile: false },
  { ch: 'h', smile: false },
  { ch: 'i', smile: false },
  { ch: 'n', smile: false },
  { ch: 'g', smile: false },
  { ch: 'o', smile: true },
] as const;

const SMILE_FACES = ['😊', '😄', '😁'] as const;

export type LoadingSplashProps = {
  onDone?: () => void;
  onReady?: () => void;
  durationMs?: number;
  timeScale?: number;
  embedded?: boolean;
  exiting?: boolean;
  /** Default: candy logo. `tiles` / `wave` are alternate schemes. */
  variant?: SplashVariant;
};

export function LoadingSplash({
  onDone,
  onReady,
  durationMs = 1800,
  timeScale = 1,
  embedded = false,
  exiting = false,
  variant = 'logo',
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
        {variant === 'tiles' ? (
          <div className="splash-match-seq relative z-20 px-3 text-center">
            <div className="splash-match3">
              <div className="splash-match3-burst" />
              <div className="splash-match3-row">
                {SMILE_FACES.map((face, i) => (
                  <div
                    key={face}
                    className="splash-match3-slot"
                    style={{ '--i': i } as React.CSSProperties}
                  >
                    <div className="splash-match3-tile">
                      <span className="splash-match3-shine" />
                      <span className="splash-match3-face">{face}</span>
                      <span className="splash-match3-flash" />
                      <span className="splash-match3-spark" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="splash-matchingo" aria-label="Matchingo">
              <div className="splash-matchingo-title">
                {MATCHINGO_LETTERS.map((item, i) => (
                  <span
                    key={`${item.ch}-${i}`}
                    className={
                      item.smile
                        ? 'splash-matchingo-letter splash-matchingo-smile'
                        : 'splash-matchingo-letter'
                    }
                    style={{ '--i': i } as React.CSSProperties}
                  >
                    {item.smile ? (
                      <span className="splash-matchingo-face" aria-hidden>
                        😊
                      </span>
                    ) : (
                      item.ch
                    )}
                  </span>
                ))}
              </div>
              <div className="splash-matchingo-go" aria-hidden>
                <span style={{ '--i': 0 } as React.CSSProperties}>GO</span>
                <span style={{ '--i': 1 } as React.CSSProperties}>GO</span>
                <span style={{ '--i': 2 } as React.CSSProperties}>GO</span>
              </div>
            </div>
          </div>
        ) : variant === 'wave' ? (
          <div className="splash-wave relative z-20 px-3 text-center">
            <div className="splash-wave-title" aria-label="Matchingo">
              {MATCHINGO_LETTERS.map((item, i) => (
                <span
                  key={`${item.ch}-${i}`}
                  className={
                    item.smile
                      ? 'splash-wave-letter splash-wave-smile'
                      : 'splash-wave-letter'
                  }
                  style={{ '--i': i } as React.CSSProperties}
                >
                  {item.smile ? (
                    <span className="splash-wave-face" aria-hidden>
                      😊
                    </span>
                  ) : (
                    item.ch
                  )}
                </span>
              ))}
            </div>
            <div className="splash-wave-go" aria-hidden>
              <span style={{ '--i': 0 } as React.CSSProperties}>GO</span>
              <span style={{ '--i': 1 } as React.CSSProperties}>GO</span>
              <span style={{ '--i': 2 } as React.CSSProperties}>GO</span>
            </div>
          </div>
        ) : (
          <div className="splash-logo relative z-20 px-4 text-center">
            <picture>
              <source
                srcSet={`${assetUrl('splash-logo.webp')}?v=20260715e`}
                type="image/webp"
              />
              <img
                src={`${assetUrl('splash-logo.png')}?v=20260715e`}
                alt="Matchingo"
                className="splash-logo-image mx-auto w-[min(80vw,360px)] max-w-full"
                draggable={false}
                decoding="async"
                fetchPriority="high"
                loading="eager"
              />
            </picture>
          </div>
        )}
      </div>

      <div className="splash-progress-wrap absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-0 right-0 flex justify-center">
        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/30">
          <div className="splash-progress-bar h-full rounded-full bg-white/90" />
        </div>
      </div>
    </div>
  );
}
