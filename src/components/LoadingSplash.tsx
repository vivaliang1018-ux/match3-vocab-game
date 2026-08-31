import { useEffect, useRef } from 'react';
import { assetUrl } from '../lib/assetUrl';
import { SkySparkleBackground } from './SkySparkleBackground';

export const LOADING_SPLASH_BUILD = '2026-08-31-lingomatch-logo';

/** Previous logo concepts live under docs/branding/archived/; the active LingoMatch asset is splash-logo.* */
export type SplashVariant = 'logo' | 'tiles' | 'wave';

const LINGOMATCH_LETTERS = [
  { ch: 'L', smile: false },
  { ch: 'i', smile: false },
  { ch: 'n', smile: false },
  { ch: 'g', smile: false },
  { ch: 'o', smile: true },
  { ch: 'M', smile: false },
  { ch: 'a', smile: false },
  { ch: 't', smile: false },
  { ch: 'c', smile: false },
  { ch: 'h', smile: false },
] as const;

const SMILE_FACES = ['😊', '😄', '😁'] as const;

export type LoadingSplashProps = {
  onDone?: () => void;
  onReady?: () => void;
  durationMs?: number;
  timeScale?: number;
  embedded?: boolean;
  exiting?: boolean;
  /** Start from the native launch screen's settled logo instead of replaying the entrance. */
  seamlessEntry?: boolean;
  /** Default: LingoMatch logo. `tiles` / `wave` are alternate schemes. */
  variant?: SplashVariant;
};

export function LoadingSplash({
  onDone,
  onReady,
  durationMs = 1800,
  timeScale = 1,
  embedded = false,
  exiting = false,
  seamlessEntry = false,
  variant = 'logo',
}: LoadingSplashProps) {
  const durScale = Math.max(0.5, timeScale);
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (variant !== 'logo') onReady?.();
  }, [onReady, variant]);

  // Cached/preloaded logos may already be complete before onLoad attaches.
  useEffect(() => {
    if (variant !== 'logo' || !onReady) return;
    const img = logoRef.current;
    if (img?.complete && img.naturalWidth > 0) onReady();
  }, [onReady, variant]);

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

            <div className="splash-matchingo" aria-label="LingoMatch">
              <div className="splash-matchingo-title">
                {LINGOMATCH_LETTERS.map((item, i) => (
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
            <div className="splash-wave-title" aria-label="LingoMatch">
              {LINGOMATCH_LETTERS.map((item, i) => (
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
          <div
            className={`splash-logo relative z-20 px-4 text-center${seamlessEntry ? ' splash-logo--seamless' : ''}`}
          >
            <picture>
              <source
                srcSet={`${assetUrl('splash-logo.webp')}?v=20260831a`}
                type="image/webp"
              />
              <img
                ref={logoRef}
                src={`${assetUrl('splash-logo.png')}?v=20260831a`}
                alt="LingoMatch"
                className="splash-logo-image mx-auto w-[min(44vw,205px)] max-w-full"
                draggable={false}
                decoding="sync"
                fetchPriority="high"
                loading="eager"
                onLoad={onReady}
                onError={onReady}
              />
            </picture>
          </div>
        )}
      </div>

      <div
        className={`splash-progress-wrap absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-0 right-0 flex justify-center${seamlessEntry ? ' splash-progress-wrap--seamless' : ''}`}
      >
        <div className="h-1 w-24 overflow-hidden rounded-full bg-white/30">
          <div className="splash-progress-bar h-full rounded-full bg-white/90" />
        </div>
      </div>
    </div>
  );
}
