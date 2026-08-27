import { AnimatePresence, motion } from 'motion/react';
import { MOTION_SPRING_POP } from '../../lib/motionPresets';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';
import { HudPlaque, HudStatNumber } from './HudPlaque';

/** @deprecated Kept for quiz typing during transition; scoring removed. */
export type ScorePop = { id: number; delta: number };

type StepsHudProps = {
  steps: number;
  className?: string;
  bonusFlashKey?: number;
};

/** Remaining moves plaque (replaces the old score HUD). */
export function StepsHud({ steps, className, bonusFlashKey = 0 }: StepsHudProps) {
  const { t } = useI18n();

  return (
    <div className={cn('relative', className)}>
      <HudPlaque
        fullWidth
        label={t.hud.moves}
        valueClassName="text-center"
        value={
          <motion.div
            key={steps}
            animate={{ scale: [1, 1.12, 1] }}
            transition={MOTION_SPRING_POP}
          >
            <HudStatNumber>{steps}</HudStatNumber>
          </motion.div>
        }
      />
      <AnimatePresence>
        {bonusFlashKey > 0 && (
          <motion.span
            key={bonusFlashKey}
            className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-lg font-black text-emerald-600 drop-shadow-[0_1px_0_white]"
            initial={{ opacity: 0, y: 8, scale: 0.7 }}
            animate={{ opacity: [0, 1, 1, 0], y: [8, -2, -12, -22], scale: [0.7, 1.15, 1, 0.94] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.15, ease: 'easeOut' }}
            aria-live="polite"
          >
            +8
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

/** @deprecated Use StepsHud — scoring removed. */
export function ScoreHud({
  score,
  className,
}: {
  score: number;
  pops?: ScorePop[];
  className?: string;
}) {
  return <StepsHud steps={score} className={className} />;
}
