import { AnimatePresence, motion } from 'motion/react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_MODAL_CARD, MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { useI18n } from '../../i18n';
import { useModalDialog } from './useModalDialog';

type AdventureFailSheetProps = {
  open: boolean;
  canRetry: boolean;
  onRetry: () => void;
  onClose: () => void;
};

export function AdventureFailSheet({ open, canRetry, onRetry, onClose }: AdventureFailSheetProps) {
  const { t } = useI18n();
  const dialogRef = useModalDialog({ open, onClose });

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
          className="candy-celebration-overlay z-[160]"
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
            <div className="candy-modal-actions mt-2">
              {canRetry ? (
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={onRetry}
                  className="candy-sheet-action-btn candy-sheet-action-btn-pink w-full"
                >
                  {t.adventure.retrySameSet}
                </motion.button>
              ) : (
                <div className="rounded-2xl bg-sky-50 px-3 py-2 text-center text-xs font-bold text-sky-800">
                  {t.adventure.waitStamina}
                </div>
              )}
              <motion.button
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={onClose}
                className="candy-sheet-action-btn candy-sheet-action-btn-secondary w-full"
              >
                {t.common.close}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
