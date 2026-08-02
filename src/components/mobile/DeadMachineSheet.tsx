import { AnimatePresence, motion } from 'motion/react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_MODAL_CARD, MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { useI18n } from '../../i18n';

type DeadMachineSheetProps = {
  open: boolean;
  canGoReview: boolean;
  onGoReview: () => void;
  onClose: () => void;
};

/** Shown when adventure is dead: no moves path left and no stamina. Gothic black card. */
export function DeadMachineSheet({
  open,
  canGoReview,
  onGoReview,
  onClose,
}: DeadMachineSheetProps) {
  const { t } = useI18n();

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
          aria-label={t.adventure.deadTitle}
        >
          <motion.button
            type="button"
            className="absolute inset-0 z-0 cursor-default border-0 bg-black/75 backdrop-blur-[2px]"
            aria-label={t.common.close}
            onClick={onClose}
          />
          <motion.div
            variants={MOTION_MODAL_CARD}
            className="pointer-events-auto relative z-10 flex w-full max-w-[19rem] flex-col items-center gap-3 rounded-[22px] border-2 border-[#4a1c1c] bg-gradient-to-b from-[#0c0a0a] via-[#141010] to-[#080606] px-5 py-7 shadow-[0_0_0_1px_rgba(120,20,20,0.45),0_20px_50px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.06)]"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <span
              className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l-2 border-t-2 border-[#8b1a1a]"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r-2 border-t-2 border-[#8b1a1a]"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-[#8b1a1a]"
              aria-hidden
            />
            <span
              className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b-2 border-r-2 border-[#8b1a1a]"
              aria-hidden
            />

            <div
              className="flex items-center justify-center gap-3 text-5xl drop-shadow-[0_0_12px_rgba(180,30,30,0.55)]"
              aria-hidden
            >
              <motion.span
                animate={{ y: [0, -5, 0], rotate: [-3, 3, -3] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                👻
              </motion.span>
              <motion.span
                animate={{ y: [0, 5, 0], rotate: [2, -4, 2] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
              >
                👾
              </motion.span>
            </div>

            <div className="text-center text-xl font-black tracking-wide text-[#f5ecec]">
              {t.adventure.deadTitle}
            </div>
            <div className="text-center text-sm font-semibold leading-snug text-[#c4b4b4]">
              {t.adventure.deadSubtitle}
            </div>

            <div className="relative z-20 mt-1 flex w-full flex-col gap-2.5">
              {canGoReview ? (
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={(e) => {
                    e.stopPropagation();
                    onGoReview();
                  }}
                  className="w-full rounded-2xl border border-[#6b1515] bg-gradient-to-r from-[#5c0f0f] via-[#8b1a1a] to-[#5c0f0f] px-3 py-3 text-sm font-black text-[#fff5f5] shadow-[0_4px_18px_rgba(120,20,20,0.45)]"
                >
                  {t.adventure.deadGoReview}
                </motion.button>
              ) : null}
              <motion.button
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="w-full rounded-2xl border border-white/10 bg-black/50 px-3 py-2.5 text-center text-xs font-bold text-[#d2c8c8]"
              >
                {t.adventure.deadWait}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
