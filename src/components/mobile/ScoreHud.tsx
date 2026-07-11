import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOTION_SPRING_BOUNCY, MOTION_SPRING_POP } from '../../lib/motionPresets';
import { MOTION_SCORE_FLOAT } from '../../lib/motionChoreography';
import { useI18n } from '../../i18n';
import { cn } from '../../lib/utils';
import { HudPlaque, HudStatNumber } from './HudPlaque';

export type ScorePop = { id: number; delta: number };

type ScoreHudProps = {
  score: number;
  pops: ScorePop[];
  className?: string;
};

export function ScoreHud({ score, pops, className }: ScoreHudProps) {
  const { t } = useI18n();
  const [pulseGain, setPulseGain] = useState(false);
  const [pulseLoss, setPulseLoss] = useState(false);
  const lastPop = pops[pops.length - 1];

  useEffect(() => {
    if (!lastPop) return;
    if (lastPop.delta > 0) {
      setPulseGain(true);
      const timer = window.setTimeout(() => setPulseGain(false), 420);
      return () => window.clearTimeout(timer);
    }
    setPulseLoss(true);
    const timer = window.setTimeout(() => setPulseLoss(false), 380);
    return () => window.clearTimeout(timer);
  }, [lastPop?.id]);

  return (
    <div className={cn('relative', className)}>
      <HudPlaque
        fullWidth
        label={t.hud.score}
        valueClassName="text-center"
        value={
          <motion.div
            key={score}
            animate={{
              scale: pulseGain ? [1, 1.18, 0.97, 1] : pulseLoss ? [1, 0.9, 1.02, 1] : 1,
              y: pulseGain ? [0, -3, 1, 0] : pulseLoss ? [0, 2, 0, 0] : 0,
            }}
            transition={pulseGain ? MOTION_SPRING_POP : pulseLoss ? MOTION_SPRING_BOUNCY : { duration: 0 }}
          >
            <HudStatNumber>{score}</HudStatNumber>
          </motion.div>
        }
      />

      <div className="pointer-events-none absolute inset-0 overflow-visible">
        <AnimatePresence>
          {pops.map((pop) => (
            <motion.div
              key={pop.id}
              variants={MOTION_SCORE_FLOAT}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                'absolute left-1/2 top-0 z-20 -translate-x-1/2 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-black shadow-md ring-2 ring-white/90',
                pop.delta > 0
                  ? 'bg-emerald-500 text-white shadow-emerald-900/25'
                  : 'bg-rose-500 text-white shadow-rose-900/25',
              )}
            >
              {pop.delta > 0 ? `+${pop.delta}` : pop.delta}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
