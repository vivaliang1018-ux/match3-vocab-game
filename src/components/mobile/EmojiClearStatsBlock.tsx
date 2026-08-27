import { motion } from 'motion/react';
import { MOTION_SPRING_POP } from '../../lib/motionPresets';
import { useI18n } from '../../i18n';

type EmojiClearStatsBlockProps = {
  learnedCount: number;
  totalEmojiPool: number;
  variant?: 'profile' | 'learned';
  theme?: 'default' | 'candy';
};

export function EmojiClearStatsBlock({
  learnedCount,
  totalEmojiPool,
  variant = 'profile',
  theme = 'default',
}: EmojiClearStatsBlockProps) {
  const { t } = useI18n();
  const copy = variant === 'learned' ? t.learned : t.profile;
  const progressPct =
    totalEmojiPool > 0 ? Math.min(100, Math.round((learnedCount / totalEmojiPool) * 100)) : 0;
  const progressRatio = progressPct / 100;

  const candy = theme === 'candy';

  if (candy) {
    return (
      <>
        <motion.div
          className="profile-candy-stat-hero"
          initial={{ opacity: 0, scale: 0.88, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={MOTION_SPRING_POP}
        >
          <div className="profile-candy-stat-hero-gloss" aria-hidden />
          <motion.div
            key={learnedCount}
            className="profile-candy-stat-number"
            initial={{ scale: 0.7, opacity: 0, y: 12 }}
            animate={{ scale: [0.7, 1.14, 1], opacity: 1, y: [12, -4, 0] }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            {learnedCount}
          </motion.div>
          <div className="mt-1 text-[11px] font-bold text-pink-600/90">{copy.emojisCleared}</div>
        </motion.div>

        <motion.div
          className="mt-3.5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ...MOTION_SPRING_POP }}
        >
          <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-sky-900">
            <span>{copy.emojiProgress}</span>
            <span className="tabular-nums">{copy.emojiProgressDetail(learnedCount, totalEmojiPool)}</span>
          </div>
          <div className="profile-candy-progress-track mt-2">
            <motion.div
              className="profile-candy-progress-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progressRatio }}
              transition={{ type: 'spring', stiffness: 280, damping: 26, mass: 0.9 }}
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={copy.emojiProgress}
            />
          </div>
          <motion.p
            key={progressPct}
            className="mt-1.5 text-right text-[10px] font-black tabular-nums text-pink-600"
            initial={{ scale: 0.85, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={MOTION_SPRING_POP}
          >
            {progressPct}%
          </motion.p>
        </motion.div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="text-xs font-black text-violet-900">{copy.statsTitle}</div>
      </div>

      <div className="mt-3 rounded-2xl border border-violet-100 bg-violet-50/40 px-4 py-3 text-center">
        <div className="text-3xl font-black tabular-nums text-violet-800">{learnedCount}</div>
        <div className="mt-1 text-[11px] font-bold text-violet-600/80">{copy.emojisCleared}</div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-violet-700">
          <span>{copy.emojiProgress}</span>
          <span className="tabular-nums">{copy.emojiProgressDetail(learnedCount, totalEmojiPool)}</span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full border bg-violet-100">
          <motion.div
            className="h-full w-full origin-left rounded-full bg-gradient-to-r from-violet-500 to-violet-600 will-change-transform"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progressRatio }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={copy.emojiProgress}
          />
        </div>
        <p className="mt-1.5 text-right text-[10px] font-bold text-violet-500">{progressPct}%</p>
      </div>
    </>
  );
}
