import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_MODAL_CARD, MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { useI18n } from '../../i18n';
import { assetUrl } from '../../lib/assetUrl';
import { triggerGameHaptic } from '../../lib/gameHaptics';
import type { AwardTrackDef, AwardTrackProgress } from '../../lib/playerSummary';
import { calendarDayKey } from '../../lib/playerSummary';
import { useModalDialog } from './useModalDialog';

type AwardClaimSheetProps = {
  open: boolean;
  def: AwardTrackDef | null;
  progress: AwardTrackProgress | null;
  /** ms when claimed; null if not yet claimed. */
  claimedAt: number | null;
  claimable: boolean;
  onClose: () => void;
  onClaim: () => void;
};

export function AwardClaimSheet({
  open,
  def,
  progress,
  claimedAt,
  claimable,
  onClose,
  onClaim,
}: AwardClaimSheetProps) {
  const { t, locale } = useI18n();
  const hapticOpenIdRef = useRef<string | null>(null);
  const dialogRef = useModalDialog({
    open: open && Boolean(def) && Boolean(progress),
    onClose,
  });

  useEffect(() => {
    if (!open) {
      hapticOpenIdRef.current = null;
      return;
    }
    if (!def || !progress?.unlocked || hapticOpenIdRef.current === def.id) return;

    hapticOpenIdRef.current = def.id;
    void triggerGameHaptic('newBadgeOpen');
  }, [def, open, progress?.unlocked]);

  if (!def || !progress || typeof document === 'undefined') return null;

  const milestone = progress.unlocked
    ? progress.achieved > 0
      ? progress.achieved
      : progress.next
    : progress.next;
  const dateLabel = progress.unlocked
    ? formatAwardDate(claimedAt ?? Date.now(), locale)
    : t.profile.awardLockedHint;
  const story = progress.unlocked
    ? t.profile.awardStory(def.id, milestone)
    : t.profile.awardLockedStory(def.id, progress.next);

  const cta = !progress.unlocked
    ? t.profile.awardKeepGoingCta
    : claimable
      ? t.profile.awardClaimCta
      : t.profile.awardClaimedCta;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          key={`award-claim-${def.id}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="candy-reward-screen"
          role="dialog"
          aria-modal="true"
          aria-label={t.profile.awardName(def.id)}
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
              {t.profile.awardsTitle}
            </div>
            <div className="w-11" aria-hidden />
          </div>

          <div className="candy-reward-body">
            <motion.div
              variants={MOTION_MODAL_CARD}
              className="relative flex flex-col items-center"
            >
              <div
                className={
                  progress.unlocked
                    ? 'profile-candy-award-hero'
                    : 'profile-candy-award-hero profile-candy-award-hero-locked'
                }
              >
                <img
                  src={assetUrl(def.iconSrc)}
                  alt=""
                  draggable={false}
                  className="profile-candy-award-hero-icon"
                />
                <div className="profile-candy-award-hero-num" aria-hidden>
                  {milestone}
                </div>
              </div>

              <div className="profile-candy-award-date-pill mt-5">{dateLabel}</div>

              <p className="mt-4 max-w-[20rem] text-center text-[17px] font-black leading-snug tracking-tight text-sky-950">
                {story}
              </p>
            </motion.div>
          </div>

          <div className="candy-reward-footer">
            <motion.button
              type="button"
              whileTap={MOTION_PRESS_TAP}
              onClick={claimable ? onClaim : onClose}
              className="candy-sheet-action-btn candy-sheet-action-btn-pink w-full"
            >
              {cta}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function formatAwardDate(ms: number, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale === 'zh-CN' ? 'zh-CN' : locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(ms));
  } catch {
    return calendarDayKey(ms);
  }
}
