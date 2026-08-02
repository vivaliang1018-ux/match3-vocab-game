import { AnimatePresence, motion } from 'motion/react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_MODAL_CARD, MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { useI18n } from '../../i18n';

type ReviewContinueSheetProps = {
  open: boolean;
  canContinueReview: boolean;
  canGoAdventure: boolean;
  onContinueReview: () => void;
  onGoAdventure: () => void;
  onRest: () => void;
};

export function ReviewContinueSheet({
  open,
  canContinueReview,
  canGoAdventure,
  onContinueReview,
  onGoAdventure,
  onRest,
}: ReviewContinueSheetProps) {
  const { t } = useI18n();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="review-continue"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="pointer-events-auto fixed inset-0 z-[170] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-label={t.modes.reviewContinueTitle}
        >
          <motion.button
            type="button"
            className="absolute inset-0 z-0 cursor-default border-0 bg-sky-950/40 backdrop-blur-[1px]"
            aria-label={t.modes.reviewContinueRest}
            onClick={onRest}
          />
          <motion.div
            variants={MOTION_MODAL_CARD}
            className="candy-celebration-card pointer-events-auto relative z-10 gap-3 px-6 py-7"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="text-4xl" aria-hidden>
              🧠
            </div>
            <div className="candy-celebration-title">{t.modes.reviewContinueTitle}</div>
            <div className="candy-celebration-subtitle">{t.modes.reviewContinueSubtitle}</div>
            <div className="relative z-20 mt-2 flex w-full flex-col gap-2">
              {canContinueReview ? (
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={(e) => {
                    e.stopPropagation();
                    onContinueReview();
                  }}
                  className="candy-sheet-action-btn candy-sheet-action-btn-pink w-full"
                >
                  {t.modes.reviewContinueReview}
                </motion.button>
              ) : (
                <div className="rounded-2xl bg-sky-50 px-3 py-2 text-center text-xs font-bold text-sky-800">
                  {t.modes.insufficientReviewHint}
                </div>
              )}
              {canGoAdventure ? (
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={(e) => {
                    e.stopPropagation();
                    onGoAdventure();
                  }}
                  className="candy-sheet-action-btn candy-sheet-action-btn-blue w-full"
                >
                  {t.modes.reviewContinueAdventure}
                </motion.button>
              ) : (
                <div className="rounded-2xl bg-amber-50 px-3 py-2 text-center text-xs font-bold text-amber-900">
                  {t.modes.reviewContinueNoStamina}
                </div>
              )}
              <motion.button
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={(e) => {
                  e.stopPropagation();
                  onRest();
                }}
                className="rounded-full px-3 py-2 text-sm font-bold text-sky-800/80"
              >
                {t.modes.reviewContinueRest}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
