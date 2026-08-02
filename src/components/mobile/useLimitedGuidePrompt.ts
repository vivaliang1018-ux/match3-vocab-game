import { useCallback, useEffect, useRef, useState } from 'react';

type LimitedGuidePromptOptions = {
  eligible: boolean;
  persistedPlayCount: number;
  onPlaybackStart: () => void;
  durationMs?: number;
};

/** Starts at most one playback per visible visit and never more than two overall. */
export function useLimitedGuidePrompt({
  eligible,
  persistedPlayCount,
  onPlaybackStart,
  durationMs = 8000,
}: LimitedGuidePromptOptions): boolean {
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState !== 'hidden',
  );
  const [visibilityVisit, setVisibilityVisit] = useState(0);
  const [playing, setPlaying] = useState(false);
  const playCountRef = useRef(persistedPlayCount);
  const onPlaybackStartRef = useRef(onPlaybackStart);
  const playedVisitRef = useRef<string | null>(null);

  playCountRef.current = persistedPlayCount;
  onPlaybackStartRef.current = onPlaybackStart;

  useEffect(() => {
    const handleVisibility = () => {
      const visible = document.visibilityState !== 'hidden';
      setDocumentVisible(visible);
      if (visible) setVisibilityVisit((value) => value + 1);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const stop = useCallback(() => setPlaying(false), []);

  useEffect(() => {
    const canPlay = eligible && documentVisible && playCountRef.current < 2;
    if (!canPlay) {
      stop();
      if (!eligible || !documentVisible) playedVisitRef.current = null;
      return;
    }

    const visitKey = `${visibilityVisit}`;
    if (playedVisitRef.current === visitKey) return;
    playedVisitRef.current = visitKey;
    setPlaying(true);
    onPlaybackStartRef.current();
    const timer = window.setTimeout(stop, durationMs);
    return () => window.clearTimeout(timer);
  }, [documentVisible, durationMs, eligible, stop, visibilityVisit]);

  return playing && eligible && documentVisible;
}
