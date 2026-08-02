import { motion } from 'motion/react';
import { MOTION_SPRING_SNAPPY } from '../../lib/motionPresets';
import { MOTION_FUN_BANNER } from '../../lib/motionChoreography';
import { TIMED_TARGET_COUNTDOWN_SEC } from '../../lib/scoring';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';
import type { WordItem } from '../../types/game';

type TimedTargetBannerProps = {
  item: WordItem;
  pulseKey: number;
  countdownSec: number;
  /** Full countdown length for the progress ring (defaults to review/revive timer). */
  countdownMaxSec?: number;
};

function wordSizeClass(word: string): string {
  const len = word.length;
  if (len <= 22) return 'text-[clamp(1.2rem,5.2vw,1.85rem)]';
  if (len <= 32) return 'text-[clamp(1.05rem,4.2vw,1.48rem)]';
  if (len <= 42) return 'text-[clamp(0.88rem,3.4vw,1.12rem)]';
  return 'text-[clamp(0.76rem,2.8vw,0.96rem)]';
}

export function TimedTargetBanner({
  item,
  pulseKey,
  countdownSec,
  countdownMaxSec = TIMED_TARGET_COUNTDOWN_SEC,
}: TimedTargetBannerProps) {
  const { t } = useI18n();
  const maxSec = Math.max(1, countdownMaxSec);
  const urgent = countdownSec <= Math.min(3, Math.ceil(maxSec * 0.4));
  const progress = Math.max(0, Math.min(1, countdownSec / maxSec));

  return (
    <motion.div
      key={pulseKey}
      variants={MOTION_FUN_BANNER}
      initial="hidden"
      animate="visible"
      className="h-[4.5rem] w-full overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50/95 via-white/90 to-orange-50/95 px-3 py-2 shadow-md shadow-amber-900/10 backdrop-blur-sm"
    >
      <div className="flex h-full items-center gap-2.5">
        <motion.div
          className="relative flex h-11 w-11 shrink-0 items-center justify-center"
          animate={urgent ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.45, repeat: urgent ? Infinity : 0, repeatDelay: 0.6 }}
        >
          <svg
            className="absolute inset-0 -rotate-90"
            viewBox="0 0 48 48"
            aria-hidden
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-slate-200/90"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress)}`}
              className={cn(
                'transition-[stroke-dashoffset] duration-1000 ease-linear',
                urgent ? 'text-rose-500' : 'text-sky-500',
              )}
            />
          </svg>
          <motion.span
            key={countdownSec}
            initial={{ scale: 1.35, opacity: 0.5, y: 4 }}
            animate={{ scale: [1.35, 0.92, 1.06, 1], opacity: 1, y: [4, -2, 1, 0] }}
            transition={MOTION_SPRING_SNAPPY}
            className={cn(
              'relative text-lg font-black tabular-nums',
              urgent ? 'text-rose-600' : 'text-sky-700',
            )}
          >
            {countdownSec}
          </motion.span>
        </motion.div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-center text-center">
          <div className="shrink-0 truncate text-[9px] font-bold uppercase tracking-wide text-amber-700/90">
            {t.modes.timedTargetFindHint}
          </div>
          <div className="mt-0.5 flex h-[2.5rem] min-w-0 items-center justify-center overflow-hidden">
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={MOTION_SPRING_SNAPPY}
              className={cn(
                'line-clamp-2 w-full text-balance font-black leading-[1.12] tracking-tight text-sky-950 break-words',
                wordSizeClass(item.word),
              )}
            >
              {item.word}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/** @deprecated Use TimedTargetBanner */
export const FunTargetBanner = TimedTargetBanner;
