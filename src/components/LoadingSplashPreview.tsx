import { useCallback, useState } from 'react';
import {
  LoadingSplash,
  LOADING_SPLASH_BUILD,
  type SplashVariant,
} from './LoadingSplash';

const SPEED_OPTIONS = [
  { label: '0.5× 慢', value: 2 },
  { label: '1× 正常', value: 1 },
  { label: '1.5×', value: 0.67 },
  { label: '2× 快', value: 0.5 },
] as const;

const VARIANT_OPTIONS: { label: string; value: SplashVariant }[] = [
  { label: 'Candy Logo', value: 'logo' },
  { label: '三消→标题', value: 'tiles' },
  { label: 'Wave 文字', value: 'wave' },
];

export function LoadingSplashPreview() {
  const [playKey, setPlayKey] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [loop, setLoop] = useState(true);
  const [timeScale, setTimeScale] = useState(2);
  const [variant, setVariant] = useState<SplashVariant>('logo');

  const replay = useCallback(() => {
    setPlaying(true);
    setPlayKey((k) => k + 1);
  }, []);

  const handleDone = useCallback(() => {
    if (loop) {
      window.setTimeout(() => setPlayKey((k) => k + 1), 600);
      return;
    }
    setPlaying(false);
  }, [loop]);

  return (
    <div className="relative h-full min-h-0 overflow-hidden">
      {playing && (
        <LoadingSplash
          key={`${playKey}-${variant}`}
          timeScale={timeScale}
          durationMs={2400}
          onDone={handleDone}
          variant={variant}
        />
      )}

      {!playing && (
        <div className="absolute inset-0 z-[210] flex flex-col items-center justify-center gap-3 bg-[#faf8ff] text-violet-900">
          <p className="text-sm font-bold">动画已结束</p>
          <button
            type="button"
            onClick={replay}
            className="rounded-full bg-violet-600 px-4 py-2 text-xs font-bold text-white active:bg-violet-700"
          >
            重新播放
          </button>
        </div>
      )}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[210] bg-gradient-to-b from-black/55 to-transparent px-4 pb-8 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <h1 className="pointer-events-auto text-sm font-bold text-white">
          Loading 预览 · {LOADING_SPLASH_BUILD}
        </h1>
        <p className="pointer-events-auto mt-0.5 text-xs text-white/75">
          Candy Logo（默认）· 三消 / Wave 可切换
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[210] space-y-3 bg-gradient-to-t from-black/60 to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-10">
        <div className="pointer-events-auto flex flex-wrap gap-2">
          <button
            type="button"
            onClick={replay}
            className="rounded-full bg-violet-600 px-4 py-2 text-xs font-bold text-white active:bg-violet-700"
          >
            重播
          </button>
          <button
            type="button"
            onClick={() => setLoop((v) => !v)}
            className={
              loop
                ? 'rounded-full bg-white/20 px-4 py-2 text-xs font-bold text-white ring-1 ring-white/30'
                : 'rounded-full bg-white/10 px-4 py-2 text-xs font-bold text-white/70'
            }
          >
            {loop ? '循环：开' : '循环：关'}
          </button>
        </div>

        <div className="pointer-events-auto">
          <div className="mb-1.5 text-[11px] font-bold text-white/70">方案</div>
          <div className="flex flex-wrap gap-2">
            {VARIANT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setVariant(opt.value);
                  replay();
                }}
                className={
                  variant === opt.value
                    ? 'rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-amber-950'
                    : 'rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white/80'
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pointer-events-auto">
          <div className="mb-1.5 text-[11px] font-bold text-white/70">播放速度</div>
          <div className="flex flex-wrap gap-2">
            {SPEED_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => {
                  setTimeScale(opt.value);
                  replay();
                }}
                className={
                  timeScale === opt.value
                    ? 'rounded-full bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-amber-950'
                    : 'rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white/80'
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
