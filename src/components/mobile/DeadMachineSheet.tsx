import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { useI18n } from '../../i18n';
import { triggerGameHaptic } from '../../lib/gameHaptics';

type DeadMachineSheetProps = {
  open: boolean;
  nextStaminaAt: number | null;
  hasStamina: boolean;
  canGoSayBlast: boolean;
  canGoReview: boolean;
  canGoMood: boolean;
  onGoSayBlast: () => void;
  onGoReview: () => void;
  onGoMood: () => void;
  onContinue: () => void;
  onGoHome: () => void;
};

/** A soft route change when Adventure needs more stamina. */
export function DeadMachineSheet({
  open,
  nextStaminaAt,
  hasStamina,
  canGoSayBlast,
  canGoReview,
  canGoMood,
  onGoSayBlast,
  onGoReview,
  onGoMood,
  onContinue,
  onGoHome,
}: DeadMachineSheetProps) {
  const { t, ui } = useI18n();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!open) return;
    setNow(Date.now());
    triggerGameHaptic('deadMachine');
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [open]);

  const remainingMs = nextStaminaAt === null ? 0 : Math.max(0, nextStaminaAt - now);
  const remainingTotalSeconds = Math.ceil(remainingMs / 1000);
  const remainingHours = Math.floor(remainingTotalSeconds / 3600);
  const remainingMinutes = Math.floor((remainingTotalSeconds % 3600) / 60);
  const remainingSeconds = remainingTotalSeconds % 60;
  const countdown = remainingHours > 0
    ? `${remainingHours}:${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
    : `${remainingMinutes}:${String(remainingSeconds).padStart(2, '0')}`;

  const primary = hasStamina
    ? { label: ui.deadMachine.continueSet, hint: ui.deadMachine.chargedHint, action: onContinue }
    : canGoSayBlast
    ? { label: ui.deadMachine.earnStamina, hint: ui.deadMachine.earnStaminaHint, action: onGoSayBlast }
    : canGoReview
      ? { label: ui.deadMachine.reinforce, hint: ui.deadMachine.reinforceHint, action: onGoReview }
      : canGoMood
        ? { label: ui.deadMachine.playMood, hint: ui.deadMachine.playMoodHint, action: onGoMood }
        : null;
  const secondary = hasStamina
    ? null
    : canGoReview && primary?.action !== onGoReview
      ? { label: ui.deadMachine.playReview, action: onGoReview }
      : canGoMood && primary?.action !== onGoMood
        ? { label: ui.deadMachine.playMood, action: onGoMood }
        : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="dead-machine"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="pointer-events-auto fixed inset-0 z-[170] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-label={hasStamina ? ui.deadMachine.chargingComplete : t.adventure.deadTitle}
        >
          <motion.button
            type="button"
            className="absolute inset-0 z-0 cursor-default border-0 bg-slate-950/55 backdrop-blur-[2px]"
            aria-label={t.common.close}
            onClick={onGoHome}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 28, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: [0, -5, 5, -3, 3, 0] }}
            exit={{ opacity: 0, scale: 0.92, y: 14 }}
            transition={{ type: 'spring', stiffness: 360, damping: 27, x: { duration: 0.34, ease: 'easeOut' } }}
            className="pointer-events-auto relative z-10 flex w-full max-w-[19rem] flex-col items-center gap-3 rounded-[24px] border-2 border-violet-300/35 bg-gradient-to-b from-[#171633] via-[#12152d] to-[#0d1024] px-5 py-7 shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_20px_50px_rgba(15,23,42,0.65),inset_0_1px_0_rgba(255,255,255,0.08)]"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <span
              className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2 border-violet-400/60"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2 border-violet-400/60"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-violet-400/60"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-violet-400/60"
              aria-hidden
            />

            <div
              className="flex items-center justify-center gap-3 text-5xl drop-shadow-[0_0_12px_rgba(139,92,246,0.5)]"
              aria-hidden
            >
              <motion.span
                animate={{ y: [0, -5, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                ⚡️
              </motion.span>
              <motion.span
                animate={{ y: [0, 5, 0], rotate: [2, -4, 2] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
              >
                🔋
              </motion.span>
            </div>

            <div className="text-center text-xl font-black tracking-wide text-[#f5ecec]">
              {hasStamina ? `${ui.deadMachine.chargingComplete} ⚡️` : t.adventure.deadTitle}
            </div>
            <div className="text-center text-sm font-semibold leading-snug text-[#c4b4b4]">
              {hasStamina ? ui.deadMachine.machineReady : t.adventure.deadSubtitle}
            </div>
            {!hasStamina && nextStaminaAt !== null && (
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-black text-[#e5dada]">
                {ui.deadMachine.nextStamina} · {countdown}
              </div>
            )}

            <div className="relative z-20 mt-1 flex w-full flex-col gap-2.5">
              {primary ? (
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={(e) => {
                    e.stopPropagation();
                    primary.action();
                  }}
                  className="w-full rounded-2xl border border-violet-300/30 bg-gradient-to-r from-violet-700 via-indigo-600 to-violet-700 px-3 py-3 text-sm font-black text-white shadow-[0_4px_18px_rgba(99,102,241,0.35)]"
                >
                  <span className="block">{primary.label}</span>
                  <span className="mt-0.5 block text-[10px] font-bold text-white/75">{primary.hint}</span>
                </motion.button>
              ) : null}
              {secondary && (
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={(e) => {
                    e.stopPropagation();
                    secondary.action();
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-black text-[#e7dddd]"
                >
                  {secondary.label}
                </motion.button>
              )}
              <motion.button
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={(e) => {
                  e.stopPropagation();
                  onGoHome();
                }}
                className="px-3 py-1.5 text-center text-xs font-bold text-white/60"
              >
                {ui.deadMachine.later}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
