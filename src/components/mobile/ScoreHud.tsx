import { motion } from 'motion/react';
import { MOTION_SPRING_POP } from '../../lib/motionPresets';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';
import { HudPlaque, HudStatNumber } from './HudPlaque';

/** @deprecated Kept for quiz typing during transition; scoring removed. */
export type ScorePop = { id: number; delta: number };

type StepsHudProps = {
  steps: number;
  className?: string;
};

/** Remaining moves plaque (replaces the old score HUD). */
export function StepsHud({ steps, className }: StepsHudProps) {
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
