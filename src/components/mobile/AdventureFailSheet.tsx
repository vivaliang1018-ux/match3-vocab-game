import { AnimatePresence, motion } from 'motion/react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_MODAL_CARD, MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { useI18n } from '../../i18n';
import { useModalDialog } from './useModalDialog';

type AdventureFailSheetProps = {
  open: boolean;
  canRetry: boolean;
  unlimitedRetry: boolean;
  remainingWords: number;
  onRetry: () => void;
  onRecharge: () => void;
  onGoHome: () => void;
};

export function AdventureFailSheet({
  open,
  canRetry,
  unlimitedRetry,
  remainingWords,
  onRetry,
  onRecharge,
  onGoHome,
}: AdventureFailSheetProps) {
  const { t } = useI18n();
  const dialogRef = useModalDialog({ open, onClose: onGoHome });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          key="adventure-fail"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="candy-celebration-overlay candy-celebration-overlay-actionable z-[160]"
          role="dialog"
          aria-modal="true"
          aria-label={t.adventure.reviveFailTitle}
          tabIndex={-1}
        >
          <motion.div className="candy-celebration-backdrop" aria-hidden />
          <motion.div variants={MOTION_MODAL_CARD} className="candy-modal-surface flex flex-col items-center gap-3 px-6 py-7">
            <div className="text-4xl" aria-hidden>
              💨
            </div>
            <div className="candy-modal-title">{t.adventure.reviveFailTitle}</div>
            <div className="candy-modal-body mt-0">{t.adventure.reviveFailSubtitle}</div>
            {remainingWords > 0 && (
              <div className="rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-800 ring-1 ring-amber-200">
                {t.adventure.reviveFailRemaining(remainingWords)}
              </div>
            )}
            <div className="max-w-sm text-center text-sm font-bold leading-relaxed text-sky-800/80">
              {t.adventure.reviveFailSaved}
            </div>
            <div className="candy-modal-actions mt-2">
              {canRetry ? (
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={onRetry}
                  className="candy-sheet-action-btn candy-sheet-action-btn-pink w-full"
                >
                  {unlimitedRetry
                    ? t.adventure.retrySameSet
                    : t.adventure.retrySameSetWithStamina}
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={onRecharge}
                  className="candy-sheet-action-btn candy-sheet-action-btn-pink w-full"
                >
                  {t.adventure.rechargeToRetry}
                </motion.button>
              )}
              <motion.button
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={onGoHome}
                className="mt-1 w-full py-2 text-sm font-extrabold text-sky-800/65 underline decoration-sky-300 underline-offset-4"
              >
                {t.adventure.returnHome}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
