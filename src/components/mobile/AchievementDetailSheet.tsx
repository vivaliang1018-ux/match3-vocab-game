import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { assetUrl } from '../../lib/assetUrl';
import { triggerGameHaptic } from '../../lib/gameHaptics';
import { MOTION_MODAL_CARD, MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { useModalDialog } from './useModalDialog';

export type AchievementId = 'sets' | 'day' | 'combo';

type AchievementDetail = {
  id: AchievementId;
  value: number;
  label: string;
  iconSrc: string;
};

type AchievementDetailSheetProps = {
  achievement: AchievementDetail | null;
  onClose: () => void;
};

export function AchievementDetailSheet({
  achievement,
  onClose,
}: AchievementDetailSheetProps) {
  const { t } = useI18n();
  const hapticOpenIdRef = useRef<AchievementId | null>(null);
  const dialogRef = useModalDialog({ open: Boolean(achievement), onClose });

  useEffect(() => {
    if (!achievement) {
      hapticOpenIdRef.current = null;
      return;
    }
    if (hapticOpenIdRef.current === achievement.id) return;

    hapticOpenIdRef.current = achievement.id;
    triggerGameHaptic('achievementOpen');
  }, [achievement]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {achievement && (
        <motion.div
          ref={dialogRef}
          key={`achievement-${achievement.id}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="candy-reward-screen"
          role="dialog"
          aria-modal="true"
          aria-label={achievement.label}
          tabIndex={-1}
        >
          <div className="candy-reward-header">
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-full text-sky-800/70 transition hover:bg-sky-100"
              aria-label={t.common.close}
            >
              <X size={22} strokeWidth={2.5} />
            </button>
            <div className="candy-reward-kicker">
              {t.profile.recordsTitle}
            </div>
            <div className="w-11" aria-hidden />
          </div>

          <div className="candy-reward-body">
            <motion.div
              variants={MOTION_MODAL_CARD}
              className="relative flex flex-col items-center"
            >
              <div className="profile-candy-achievement-hero">
                <img
                  src={assetUrl(achievement.iconSrc)}
                  alt=""
                  draggable={false}
                  className="profile-candy-achievement-hero-icon"
                />
              </div>
              <div className="profile-candy-achievement-value">{achievement.value}</div>
              <h3 className="mt-2 text-center text-xl font-black tracking-tight text-sky-950">
                {achievement.label}
              </h3>
              <p className="mt-4 max-w-[21rem] text-center text-[16px] font-bold leading-relaxed text-sky-950/80">
                {t.profile.recordStory(achievement.id, achievement.value)}
              </p>
            </motion.div>
          </div>

          <div className="candy-reward-footer">
            <motion.button
              type="button"
              whileTap={MOTION_PRESS_TAP}
              onClick={onClose}
              className="candy-sheet-action-btn candy-sheet-action-btn-pink w-full"
            >
              {t.profile.awardClaimedCta}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
