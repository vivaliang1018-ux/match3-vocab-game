import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { assetUrl } from '../../lib/assetUrl';
import { triggerGameHaptic } from '../../lib/gameHaptics';
import { MOTION_MODAL_CARD, MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';

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

  useEffect(() => {
    if (!achievement) {
      hapticOpenIdRef.current = null;
      return;
    }
    if (hapticOpenIdRef.current === achievement.id) return;

    hapticOpenIdRef.current = achievement.id;
    triggerGameHaptic('achievementOpen');
  }, [achievement]);

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={`achievement-${achievement.id}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="pointer-events-auto fixed inset-0 z-[200] flex flex-col bg-gradient-to-b from-sky-50 via-white to-rose-50"
          role="dialog"
          aria-modal="true"
          aria-label={achievement.label}
        >
          <div className="flex items-center justify-between px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-sky-800/70 transition hover:bg-sky-100"
              aria-label={t.common.close}
            >
              <X size={22} strokeWidth={2.5} />
            </button>
            <div className="text-[11px] font-black uppercase tracking-wide text-sky-800/50">
              {t.profile.recordsTitle}
            </div>
            <div className="w-10" aria-hidden />
          </div>

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 pb-4">
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

          <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2">
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
    </AnimatePresence>
  );
}
