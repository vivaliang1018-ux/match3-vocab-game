import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { LoadingSplash } from './components/LoadingSplash';
import { LoadingSplashPreview } from './components/LoadingSplashPreview';
import { hideNativeSplash } from './lib/capacitorInit';

const ItemMatchGamePage = lazy(() =>
  import('./components/ItemMatchGamePage').then((m) => ({ default: m.ItemMatchGamePage })),
);

function isLoadingPreviewRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hash === '#loading-preview' ||
    new URLSearchParams(window.location.search).get('preview') === 'loading'
  );
}

export default function App() {
  const [showPreview, setShowPreview] = useState(isLoadingPreviewRoute);

  useEffect(() => {
    const sync = () => setShowPreview(isLoadingPreviewRoute());
    sync();
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  if (showPreview) {
    return <LoadingSplashPreview />;
  }

  return <MainApp />;
}

const GAME_PAGE_PRELOAD = import('./components/ItemMatchGamePage');
const MIN_SPLASH_MS = 1300;
/** Keep in sync with `.splash-exit` duration in index.css */
const SPLASH_EXIT_MS = 360;

function MainApp() {
  const [showSplash, setShowSplash] = useState(true);
  const [exiting, setExiting] = useState(false);
  const [gameReady, setGameReady] = useState(false);

  const handleSplashReady = useCallback(() => {
    void hideNativeSplash();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const minWait = new Promise<void>((resolve) => {
      window.setTimeout(resolve, MIN_SPLASH_MS);
    });

    void Promise.all([GAME_PAGE_PRELOAD, minWait]).then(() => {
      if (cancelled) return;
      // Mount game under the splash first, then fade splash out over it.
      setGameReady(true);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (cancelled) return;
          setExiting(true);
          window.setTimeout(() => {
            if (!cancelled) setShowSplash(false);
          }, SPLASH_EXIT_MS);
        });
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      {gameReady && (
        <Suspense fallback={null}>
          <ItemMatchGamePage />
        </Suspense>
      )}
      {showSplash && <LoadingSplash exiting={exiting} onReady={handleSplashReady} />}
    </>
  );
}
