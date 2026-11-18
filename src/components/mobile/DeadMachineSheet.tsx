import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_VIGNETTE } from '../../lib/motionChoreography';
import { useI18n } from '../../i18n';
import { REWARDED_AD_COPY } from '../../i18n/rewardedAdCopy';
import { NOTIFICATION_SETTINGS_COPY } from '../../i18n/notificationSettingsCopy';
import { NOTIFICATION_SCOPE_COPY } from '../../i18n/notificationScopeCopy';
import { triggerGameHaptic } from '../../lib/gameHaptics';
import { useModalDialog } from './useModalDialog';
import { Mic, Video } from 'lucide-react';

type DeadMachineSheetProps = {
  open: boolean;
  nextStaminaAt: number | null;
  hasStamina: boolean;
  canGoSayBlast: boolean;
  canGoReview: boolean;
  canGoMood: boolean;
  rewardedAdsAvailable: boolean;
  adResetsRemaining: number;
  adBusy: boolean;
  adStatus: string | null;
  lifetimeDisplayPrice: string | null;
  onWatchAd: () => void;
  onUnlockPlus: () => void;
  onGoSayBlast: () => void;
  onGoReview: () => void;
  onGoMood: () => void;
  onContinue: () => void;
  onGoHome: () => void;
  remindersEnabled: boolean;
  reminderBusy: boolean;
  onEnableReminders: () => void;
};

/** A soft route change when Adventure needs more stamina. */
export function DeadMachineSheet({
  open,
  nextStaminaAt,
  hasStamina,
  canGoSayBlast,
  canGoReview,
  canGoMood,
  rewardedAdsAvailable,
  adResetsRemaining,
  adBusy,
  adStatus,
  lifetimeDisplayPrice,
  onWatchAd,
  onUnlockPlus,
  onGoSayBlast,
  onGoReview,
  onGoMood,
  onContinue,
  onGoHome,
  remindersEnabled,
  reminderBusy,
  onEnableReminders,
}: DeadMachineSheetProps) {
  const { locale, t, ui } = useI18n();
  const adCopy = REWARDED_AD_COPY[locale];
  const [now, setNow] = useState(Date.now());
  const dialogRef = useModalDialog({ open, closeOnEscape: false });

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
  const rawRemainingMinutes = Math.floor((remainingTotalSeconds % 3600) / 60);
  const remainingMinutes = remainingHours === 0 && rawRemainingMinutes === 0 && remainingTotalSeconds > 0
    ? 1
    : rawRemainingMinutes;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          key="dead-machine"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="dead-machine-overlay pointer-events-auto fixed inset-0 z-[170] flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-label={hasStamina ? ui.deadMachine.chargingComplete : t.adventure.deadTitle}
          tabIndex={-1}
        >
          <motion.div
            className="absolute inset-0 z-0 bg-slate-950/55 backdrop-blur-[2px]"
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.86, y: 28, x: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: [0, -5, 5, -3, 3, 0] }}
            exit={{ opacity: 0, scale: 0.92, y: 14 }}
            transition={{ type: 'spring', stiffness: 360, damping: 27, x: { duration: 0.34, ease: 'easeOut' } }}
            className="dead-machine-panel pointer-events-auto relative z-10 flex w-full max-w-[19rem] flex-col items-center gap-3 rounded-[24px] border-2 border-violet-300/35 bg-gradient-to-b from-[#171633] via-[#12152d] to-[#0d1024] px-5 py-7 shadow-[0_0_0_1px_rgba(139,92,246,0.2),0_20px_50px_rgba(15,23,42,0.65),inset_0_1px_0_rgba(255,255,255,0.08)]"
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
              <div className="grid gap-0.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-center text-[11px] font-black text-[#e5dada]">
                <span>{t.adventure.deadWait}</span>
                <span className="text-white/60">
                  {t.adventure.deadWaitRemaining(remainingHours, remainingMinutes)}
                </span>
              </div>
            )}

            <div className="relative z-20 mt-1 flex w-full flex-col gap-2.5">
              {hasStamina ? (
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={(e) => {
                    e.stopPropagation();
                    onContinue();
                  }}
                  className="w-full rounded-2xl border border-violet-300/30 bg-gradient-to-r from-violet-700 via-indigo-600 to-violet-700 px-3 py-3 text-sm font-black text-white shadow-[0_4px_18px_rgba(99,102,241,0.35)]"
                >
                  <span className="block">{ui.deadMachine.continueSet}</span>
                  <span className="mt-0.5 block text-xs font-bold text-white/75">{ui.deadMachine.chargedHint}</span>
                </motion.button>
              ) : (
                <>
                  <motion.button
                    type="button"
                    whileTap={MOTION_PRESS_TAP}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnlockPlus();
                    }}
                    className="w-full rounded-2xl border border-amber-200/80 bg-gradient-to-b from-amber-100 to-amber-300 px-3 py-3 text-sm font-black text-amber-950 shadow-[0_5px_0_rgba(180,112,10,0.72),0_10px_22px_rgba(245,158,11,0.2),inset_0_1px_0_rgba(255,255,255,0.8)]"
                  >
                    <span className="block">👑 {adCopy.unlockPlus(lifetimeDisplayPrice)}</span>
                  </motion.button>

                  {rewardedAdsAvailable && adResetsRemaining > 0 && (
                    <motion.button
                      type="button"
                      whileTap={MOTION_PRESS_TAP}
                      onClick={(e) => {
                        e.stopPropagation();
                        onWatchAd();
                      }}
                      disabled={adBusy}
                      className="w-full rounded-2xl border border-violet-300/25 bg-violet-500/15 px-3 py-2.5 text-xs font-black text-violet-50 disabled:opacity-60"
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <Video size={15} strokeWidth={2.7} aria-hidden />
                        {adBusy ? adCopy.loading : adCopy.watch}
                      </span>
                      {!adBusy && (
                        <span className="mt-0.5 block text-[11px] font-bold text-white/60">
                          {adCopy.watchReward} · {adCopy.remaining(adResetsRemaining)}
                        </span>
                      )}
                    </motion.button>
                  )}

                  {canGoSayBlast && (
                    <motion.button
                      type="button"
                      whileTap={MOTION_PRESS_TAP}
                      onClick={(e) => {
                        e.stopPropagation();
                        onGoSayBlast();
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-black text-[#e7dddd]"
                    >
                      <span className="flex items-center justify-center gap-1.5">
                        <Mic size={15} strokeWidth={2.7} aria-hidden />
                        {adCopy.practiceForEnergy}
                      </span>
                      <span className="mt-0.5 block text-[11px] font-bold text-white/55">{adCopy.practiceReward}</span>
                    </motion.button>
                  )}
                  {!remindersEnabled && (
                    <div>
                    <button
                      type="button"
                      disabled={reminderBusy}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEnableReminders();
                      }}
                      className="min-h-10 w-full rounded-2xl border border-sky-300/30 bg-sky-400/10 px-3 text-xs font-black text-sky-100"
                    >
                      🔔 {NOTIFICATION_SETTINGS_COPY[locale].staminaPromptTitle}
                    </button>
                    <p className="mt-1 px-1 text-center text-[10px] font-semibold leading-relaxed text-sky-100/75">{NOTIFICATION_SCOPE_COPY[locale].scope}</p>
                    </div>
                  )}
                </>
              )}
              {!hasStamina && rewardedAdsAvailable && adResetsRemaining <= 0 && !adStatus && (
                <div className="px-2 text-center text-[11px] font-bold text-white/60" role="status">
                  {adCopy.dailyLimit}
                </div>
              )}
              {adStatus && (
                <div className="px-2 text-center text-[11px] font-bold text-white/70" role="status">
                  {adStatus}
                </div>
              )}
              {!hasStamina && (canGoReview || canGoMood) && (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-1">
                  {canGoReview && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGoReview();
                      }}
                      className="min-h-8 text-[11px] font-bold text-white/65 underline decoration-white/25 underline-offset-4"
                    >
                      {adCopy.reviewWhileWaiting} ›
                    </button>
                  )}
                  {canGoMood && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGoMood();
                      }}
                      className="min-h-8 text-[11px] font-bold text-white/65 underline decoration-white/25 underline-offset-4"
                    >
                      {ui.deadMachine.playMood} ›
                    </button>
                  )}
                </div>
              )}
              <motion.button
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={(e) => {
                  e.stopPropagation();
                  onGoHome();
                }}
                className="dead-machine-exit min-h-11 px-3 py-2 text-center text-xs font-bold text-white/60"
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
