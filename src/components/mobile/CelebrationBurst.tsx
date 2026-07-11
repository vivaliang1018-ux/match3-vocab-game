import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOTION_SPRING_POP } from '../../lib/motionPresets';
import {
  MOTION_MODAL_CARD,
  MOTION_VIGNETTE,
  particleBurstTransition,
} from '../../lib/motionChoreography';
import { cn } from '../../lib/utils';

const CONFETTI = ['✨', '⭐', '🌟', '💫', '🎊', '💖', '🩵', '💗'];

type CelebrationBurstProps = {
  show: boolean;
  title?: string;
  subtitle?: string;
  emoji?: string;
  imgSrc?: string;
  onDone?: () => void;
  durationMs?: number;
  className?: string;
};

export function CelebrationBurst({
  show,
  title = '太棒了！',
  subtitle,
  emoji,
  imgSrc,
  onDone,
  durationMs = 1800,
  className,
}: CelebrationBurstProps) {
  useEffect(() => {
    if (!show) return;
    const t = window.setTimeout(() => onDone?.(), durationMs);
    return () => window.clearTimeout(t);
  }, [show, durationMs, onDone]);

  const particles = CONFETTI.map((c, i) => {
    const angle = (i / CONFETTI.length) * Math.PI * 2;
    const radius = 26 + (i % 3) * 12;
    return {
      char: c,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius - 18,
      delay: (i % 5) * 0.05,
      rotate: (i % 2 === 0 ? 1 : -1) * (14 + i * 10),
    };
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="celebration"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className={cn('candy-celebration-overlay', className)}
          aria-live="polite"
          aria-label={title}
        >
          <motion.div className="candy-celebration-backdrop" aria-hidden />

          {particles.map((p, i) => (
            <motion.span
              key={i}
              className="candy-celebration-particle"
              initial={{ opacity: 0, scale: 0.15, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0.55, 0],
                scale: [0.15, 1.18, 1, 0.88, 0.42],
                x: [0, p.x * 0.38, p.x],
                y: [0, p.y * 0.32 - 16, p.y - 52 - i * 6],
                rotate: [0, p.rotate * 0.45, p.rotate],
              }}
              transition={particleBurstTransition(p.delay, 1.1)}
            >
              {p.char}
            </motion.span>
          ))}

          <motion.div
            variants={MOTION_MODAL_CARD}
            initial="hidden"
            animate="visible"
            className="candy-celebration-card"
          >
            <motion.div
              className="candy-celebration-emoji-wrap"
              initial={{ scale: 0.45, y: 18, opacity: 0 }}
              animate={{ scale: [0.45, 1.1, 0.96, 1], y: [18, -6, 2, 0], opacity: 1 }}
              transition={{ duration: 0.48, times: [0, 0.5, 0.78, 1], ease: [0.22, 1, 0.36, 1] }}
            >
              {imgSrc ? (
                <img src={imgSrc} alt="" className="h-14 w-14 object-contain" />
              ) : (
                <span className="text-4xl leading-none">{emoji ?? '🎉'}</span>
              )}
            </motion.div>
            <motion.div
              className="candy-celebration-title"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.16, ...MOTION_SPRING_POP }}
            >
              {title}
            </motion.div>
            {subtitle && (
              <motion.div
                className="candy-celebration-subtitle"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.24, type: 'spring', stiffness: 360, damping: 28 }}
              >
                {subtitle}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
