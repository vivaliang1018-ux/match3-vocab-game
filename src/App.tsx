import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { App as CapacitorApp } from '@capacitor/app';
import { HomePage, type HomeEntry } from './components/HomePage';
import { unlockGameAudio } from './lib/gameSfx';
import { unlockSpeechSynthesis } from './lib/wordSpeech';
import {
  DEFAULT_BGM_VOLUME,
  getBgmUrl,
  HOME_BGM_VOLUME,
  loadBgmEnabled,
  saveBgmEnabled,
} from './lib/bgmPresets';

let gamePagePromise: ReturnType<typeof importGamePage> | null = null;

function importGamePage() {
  return import('./components/ItemMatchGamePage').then((module) => ({
    default: module.ItemMatchGamePage,
  }));
}

function preloadGamePage() {
  gamePagePromise ??= importGamePage();
  return gamePagePromise;
}

const ItemMatchGamePage = lazy(preloadGamePage);

export default function App() {
  const [screen, setScreen] = useState<'home' | 'game'>('home');
  const [homeCoverVisible, setHomeCoverVisible] = useState(true);
  const [gameEntry, setGameEntry] = useState<HomeEntry>('adventure');
  const [bgmEnabled, setBgmEnabled] = useState<boolean>(() => loadBgmEnabled());
  const [bgmPaused, setBgmPaused] = useState(false);
  const bgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgmEnabledRef = useRef(bgmEnabled);
  const bgmPausedRef = useRef(bgmPaused);

  const handlePlay = useCallback((entry: HomeEntry = 'adventure') => {
    if (screen !== 'home') return;

    // Use the explicit Start/entry tap as iOS's audio gesture. Both unlocks
    // are silent and leave the already-playing BGM completely untouched.
    unlockGameAudio();
    unlockSpeechSynthesis();

    // Keep the fully-painted homepage over the game while its first frame mounts.
    // This prevents the body's blue background from flashing between the two screens.
    setGameEntry(entry);
    setScreen('game');
    void preloadGamePage().then(() => {
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => setHomeCoverVisible(false));
      });
    });
  }, [screen]);

  useEffect(() => {
    bgmEnabledRef.current = bgmEnabled;
    saveBgmEnabled(bgmEnabled);
  }, [bgmEnabled]);

  useEffect(() => {
    bgmPausedRef.current = bgmPaused;
  }, [bgmPaused]);

  useEffect(() => {
    let disposed = false;
    const createAudio = (volume: number) => {
      const next = new Audio(getBgmUrl());
      next.loop = true;
      next.preload = 'auto';
      next.volume = volume;
      return next;
    };
    let audio = createAudio(
      screen === 'home' ? HOME_BGM_VOLUME : DEFAULT_BGM_VOLUME,
    );
    bgmAudioRef.current = audio;

    const tryPlay = () => {
      if (!bgmEnabledRef.current || bgmPausedRef.current || !audio.paused) return;
      void audio.play().catch(() => {
        // Browsers can require a user gesture; the global pointer handler below retries.
      });
    };
    const rebuildAfterForeground = () => {
      if (disposed) return;
      const previous = audio;
      const volume = previous.volume;
      let resumeAt = 0;
      try {
        resumeAt = Number.isFinite(previous.currentTime) ? previous.currentTime : 0;
      } catch {
        resumeAt = 0;
      }
      previous.pause();
      previous.removeAttribute('src');
      previous.load();

      audio = createAudio(volume);
      bgmAudioRef.current = audio;
      if (resumeAt > 0) {
        const restorePosition = () => {
          try {
            audio.currentTime =
              Number.isFinite(audio.duration) && audio.duration > 0
                ? resumeAt % audio.duration
                : resumeAt;
          } catch {
            // Restarting from the beginning is preferable to silent BGM.
          }
        };
        if (audio.readyState >= 1) restorePosition();
        else audio.addEventListener('loadedmetadata', restorePosition, { once: true });
      }
      tryPlay();
    };
    const onPointerDown = () => tryPlay();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        audio.pause();
        return;
      }
      tryPlay();
    };
    const onPageHide = () => audio.pause();
    const nativeListener = CapacitorApp.addListener(
      'appStateChange',
      ({ isActive }) => {
        if (disposed) return;
        if (isActive) rebuildAfterForeground();
        else audio.pause();
      },
    );

    tryPlay();
    window.addEventListener('pointerdown', onPointerDown, { capture: true, passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      disposed = true;
      window.removeEventListener('pointerdown', onPointerDown, { capture: true });
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
      void nativeListener.then((handle) => handle.remove());
      audio.pause();
      audio.src = '';
      if (bgmAudioRef.current === audio) bgmAudioRef.current = null;
    };
    // The player is created once when the homepage becomes ready. Screen and
    // setting changes are applied by the effects below without restarting it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const audio = bgmAudioRef.current;
    if (!audio) return;
    audio.volume = screen === 'home' ? HOME_BGM_VOLUME : DEFAULT_BGM_VOLUME;
  }, [screen]);

  useEffect(() => {
    const audio = bgmAudioRef.current;
    if (!audio) return;
    if (!bgmEnabled || bgmPaused) {
      audio.pause();
      return;
    }
    void audio.play().catch(() => {
      // The next pointer gesture retries playback.
    });
  }, [bgmEnabled, bgmPaused]);

  useEffect(() => {
    if (screen !== 'home') return;
    const requestIdle = window.requestIdleCallback?.bind(window);
    if (requestIdle) {
      const idleId = requestIdle(() => void preloadGamePage(), { timeout: 2500 });
      return () => window.cancelIdleCallback(idleId);
    }
    const timer = window.setTimeout(() => void preloadGamePage(), 800);
    return () => window.clearTimeout(timer);
  }, [screen]);

  return (
    <>
      {screen === 'game' && (
        <Suspense fallback={null}>
          <ItemMatchGamePage
            initialEntry={gameEntry}
            bgmEnabled={bgmEnabled}
            onBgmEnabledChange={setBgmEnabled}
            onBgmPauseChange={setBgmPaused}
            onHome={() => {
              setBgmPaused(false);
              setHomeCoverVisible(true);
              setScreen('home');
            }}
          />
        </Suspense>
      )}
      {homeCoverVisible && <HomePage onPlay={handlePlay} />}
    </>
  );
}
