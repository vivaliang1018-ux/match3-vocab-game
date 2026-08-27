import { useCallback, useEffect, useRef, useState, type ComponentType } from 'react';
import { LoadingSplash } from './components/LoadingSplash';
import { hideNativeSplash } from './lib/capacitorInit';

const MIN_BOOT_SPLASH_MS = 1800;
/** Keep in sync with `.splash-exit` in index.css. */
const SPLASH_EXIT_MS = 280;

function isLoadingPreviewRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hash === '#loading-preview' ||
    new URLSearchParams(window.location.search).get('preview') === 'loading'
  );
}

export default function BootApp() {
  const startedAtRef = useRef(performance.now());
  const loadingReadyRef = useRef(false);
  const [RuntimeApp, setRuntimeApp] = useState<ComponentType | null>(null);
  const [Preview, setPreview] = useState<ComponentType | null>(null);
  const [loadingShellReady, setLoadingShellReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const previewRoute = isLoadingPreviewRoute();

  useEffect(() => {
    let cancelled = false;

    if (previewRoute) {
      void import('./components/LoadingSplashPreview').then((module) => {
        if (!cancelled) setPreview(() => module.LoadingSplashPreview);
      });
      return () => {
        cancelled = true;
      };
    }

    // The loading shell has already committed. Heavy auth, locale, homepage,
    // and game modules can now load without holding the native launch screen.
    void import('./RuntimeApp').then((module) => {
      if (!cancelled) setRuntimeApp(() => module.default);
    });

    return () => {
      cancelled = true;
    };
  }, [previewRoute]);

  useEffect(() => {
    if (!RuntimeApp || !loadingShellReady || previewRoute) return;
    let cancelled = false;
    let exitTimer = 0;
    const elapsed = performance.now() - startedAtRef.current;
    const readyTimer = window.setTimeout(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (cancelled) return;
          setExiting(true);
          exitTimer = window.setTimeout(() => {
            if (!cancelled) setShowSplash(false);
          }, SPLASH_EXIT_MS);
        });
      });
    }, Math.max(0, MIN_BOOT_SPLASH_MS - elapsed));

    return () => {
      cancelled = true;
      window.clearTimeout(readyTimer);
      window.clearTimeout(exitTimer);
    };
  }, [RuntimeApp, loadingShellReady, previewRoute]);

  const handleLoadingReady = useCallback(() => {
    if (loadingReadyRef.current) return;
    loadingReadyRef.current = true;
    // Hide native splash as soon as the still frame is painted — do not wait
    // for RuntimeApp. Double rAF ensures the logo has committed to screen.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setLoadingShellReady(true);
        void hideNativeSplash();
      });
    });
  }, []);

  if (previewRoute && Preview) return <Preview />;

  return (
    <>
      {RuntimeApp && <RuntimeApp />}
      {showSplash && (
        <LoadingSplash
          exiting={exiting}
          seamlessEntry
          onReady={handleLoadingReady}
        />
      )}
    </>
  );
}
