import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useI18n } from '../../i18n';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { assetUrl } from '../../lib/assetUrl';
import { AWARD_TRACKS, type AwardTrackId } from '../../lib/playerSummary';
import { triggerGameHaptic } from '../../lib/gameHaptics';
import type { WordItem } from '../../types/game';

export type RoundResult = {
  kind: 'learned' | 'review';
  items: WordItem[];
  learnedTotal: number;
  adventureClears: number;
  dayStreak: number;
  collectionAdded: number;
  streakIncreased: boolean;
  unlocks: Array<'review' | 'category'>;
  awardIds: AwardTrackId[];
  perfectQuiz?: boolean;
  nextGoal: string;
  primaryActionLabel?: string;
  followUp: 'advance' | 'forced-review' | 'review-choices' | 'home';
};

type RoundResultSheetProps = {
  result: RoundResult | null;
  onExitComplete: () => void;
  onContinue: () => void;
  onViewCollection: () => void;
  canContinueReview: boolean;
  canGoAdventure: boolean;
  onContinueReview: () => void;
  onGoAdventure: () => void;
  onRest: () => void;
  onClaimAward: (awardId: AwardTrackId) => void;
};

export function RoundResultSheet({
  result,
  onExitComplete,
  onContinue,
  onViewCollection,
  canContinueReview,
  canGoAdventure,
  onContinueReview,
  onGoAdventure,
  onRest,
  onClaimAward,
}: RoundResultSheetProps) {
  const { t, ui } = useI18n();
  const reduceMotion = useReducedMotion();
  const [claimedIds, setClaimedIds] = useState<Set<AwardTrackId>>(() => new Set());
  const [revealPhase, setRevealPhase] = useState<'mystery' | 'revealing' | 'revealed'>('mystery');
  useEffect(() => {
    setClaimedIds(new Set());
    setRevealPhase('mystery');
  }, [result]);
  const firstAwardId = result?.awardIds[0] ?? null;
  const awardDef = firstAwardId
    ? AWARD_TRACKS.find((track) => track.id === firstAwardId) ?? null
    : null;
  const claimStage = firstAwardId !== null && !claimedIds.has(firstAwardId);

  const handleClaimAction = () => {
    if (!firstAwardId || revealPhase === 'revealing') return;
    if (revealPhase === 'mystery') {
      triggerGameHaptic('badgeClaimStart');
      setRevealPhase('revealing');
      return;
    }
    if (revealPhase === 'revealed') {
      setClaimedIds((current) => new Set([...current, firstAwardId]));
    }
  };

  useEffect(() => {
    if (!claimStage || revealPhase !== 'mystery') return;
    triggerGameHaptic('badgeMysteryOpen');
  }, [claimStage, revealPhase]);

  useEffect(() => {
    if (!firstAwardId || revealPhase !== 'revealing') return;
    const timer = window.setTimeout(() => {
      onClaimAward(firstAwardId);
      triggerGameHaptic('majorSuccess');
      setRevealPhase('revealed');
    }, reduceMotion ? 100 : 680);
    return () => window.clearTimeout(timer);
  }, [firstAwardId, onClaimAward, reduceMotion, revealPhase]);
  const unlockLabels = {
    review: ui.roundResult.reviewUnlocked,
    category: ui.roundResult.categoryUnlocked,
  };
  const unlockIcons = { review: '✅', category: '✅' };
  const primaryUnlock = result?.unlocks[0] ?? null;
  const feedbackParts = result
    ? [
        result.collectionAdded > 0
          ? `🧩 ${ui.roundResult.collectionAdded(result.collectionAdded)}`
          : null,
        result.streakIncreased
          ? `🔥 ${ui.roundResult.dayStreak(result.dayStreak)}`
          : null,
        primaryUnlock && result.awardIds.length > 0 ? `🏅 +${result.awardIds.length}` : null,
      ].filter((part): part is string => Boolean(part))
    : [];

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {result && (
        <motion.div
          className="fixed inset-0 z-[160] flex items-center justify-center bg-sky-950/45 px-5 py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={ui.roundResult.aria}
        >
          <motion.div
            className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-[30px] border-4 border-white bg-gradient-to-b from-white to-sky-50 p-5 text-center shadow-2xl"
            initial={{ y: 36, scale: 0.9 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 24, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          >
            {claimStage && firstAwardId ? (
              <motion.div
                key="claim-award"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex min-h-[22rem] flex-col items-center justify-center"
              >
                <div className="text-sm font-black uppercase tracking-[0.14em] text-violet-600">
                  {revealPhase === 'revealed'
                    ? ui.roundResult.congratulations
                    : ui.roundResult.awardReady}
                </div>

                <div className="relative mt-5 grid h-44 w-44 place-items-center" aria-live="polite">
                  <AnimatePresence>
                    {revealPhase === 'revealed' && !reduceMotion && (
                      <motion.div
                        key="badge-rays"
                        className="pointer-events-none absolute inset-[-2rem] rounded-full bg-[conic-gradient(from_0deg,transparent,rgba(250,204,21,0.48),transparent,rgba(244,114,182,0.42),transparent,rgba(129,140,248,0.42),transparent)]"
                        initial={{ opacity: 0, scale: 0.4, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 80 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="button"
                    whileTap={revealPhase === 'revealing' ? undefined : MOTION_PRESS_TAP}
                    disabled={revealPhase === 'revealing'}
                    onClick={handleClaimAction}
                    aria-label={
                      revealPhase === 'revealed'
                        ? t.common.next
                        : ui.roundResult.claim
                    }
                    className="relative h-36 w-36 cursor-pointer appearance-none border-0 bg-transparent p-0 disabled:cursor-default"
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{
                      rotateY: revealPhase === 'mystery' ? 0 : 180,
                      y:
                        revealPhase === 'mystery' && !reduceMotion
                          ? [0, -5, 0]
                          : 0,
                      scale:
                        revealPhase === 'revealing' && !reduceMotion
                          ? [1, 0.88, 1.08]
                          : 1,
                    }}
                    transition={
                      revealPhase === 'mystery'
                        ? { y: { duration: 2.1, repeat: Infinity, ease: 'easeInOut' } }
                        : { duration: reduceMotion ? 0.08 : 0.68, ease: [0.22, 1, 0.36, 1] }
                    }
                  >
                    <div
                      className="absolute inset-0 grid place-items-center rounded-full border-4 border-white bg-gradient-to-br from-violet-300 via-fuchsia-200 to-amber-200 text-7xl font-black text-white shadow-[0_16px_34px_rgba(109,40,217,0.3),inset_0_0_24px_rgba(255,255,255,0.7)]"
                      style={{ backfaceVisibility: 'hidden' }}
                      aria-hidden={revealPhase !== 'mystery'}
                    >
                      <motion.span
                        animate={reduceMotion ? undefined : { opacity: [0.72, 1, 0.72], scale: [0.94, 1.04, 0.94] }}
                        transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        ?
                      </motion.span>
                    </div>
                    <div
                      className="absolute inset-0 grid place-items-center rounded-full"
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                      {awardDef ? (
                        <img
                          src={assetUrl(awardDef.iconSrc)}
                          alt=""
                          className="pointer-events-none h-36 w-36 object-contain drop-shadow-xl"
                          draggable={false}
                        />
                      ) : (
                        <div className="text-8xl" aria-hidden>🏅</div>
                      )}
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {revealPhase === 'revealed' && !reduceMotion && (
                      <motion.div
                        key="badge-sparkles"
                        className="pointer-events-none absolute inset-0"
                        initial="hidden"
                        animate="visible"
                      >
                        {[
                          ['8%', '18%'], ['82%', '10%'], ['94%', '48%'], ['78%', '84%'],
                          ['14%', '82%'], ['0%', '50%'], ['50%', '0%'], ['48%', '92%'],
                        ].map(([left, top], index) => (
                          <motion.span
                            key={`${left}-${top}`}
                            className="absolute text-xl"
                            style={{ left, top }}
                            variants={{
                              hidden: { opacity: 0, scale: 0.2 },
                              visible: { opacity: [0, 1, 0.85], scale: [0.2, 1.35, 1] },
                            }}
                            transition={{ delay: index * 0.045, duration: 0.5 }}
                            aria-hidden
                          >
                            ✨
                          </motion.span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <h2 className="mt-4 min-h-8 text-2xl font-black text-violet-950">
                  {revealPhase === 'revealed' ? t.profile.awardName(firstAwardId) : '???'}
                </h2>
                <motion.button
                  type="button"
                  whileTap={revealPhase === 'revealing' ? undefined : MOTION_PRESS_TAP}
                  disabled={revealPhase === 'revealing'}
                  onClick={handleClaimAction}
                  className="candy-sheet-action-btn candy-sheet-action-btn-pink mt-6 w-full disabled:opacity-70"
                >
                  {revealPhase === 'revealed'
                    ? t.common.next
                    : revealPhase === 'revealing'
                      ? '…'
                      : ui.roundResult.claim}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="round-summary"
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
              >
            <h2 className="text-2xl font-black text-sky-950">
              {result.kind === 'review'
                ? ui.roundResult.strengthened
                : ui.roundResult.discovered(result.items.length)}
            </h2>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {result.items.map((item) => (
                <div key={item.id} className="min-w-0 px-1.5 py-1">
                  <div className="text-2xl leading-none">{item.emoji ?? '✨'}</div>
                  <div className="mt-1 min-w-0 whitespace-normal break-words text-xs font-black leading-tight text-sky-900 [overflow-wrap:anywhere]">
                    {item.word}
                  </div>
                </div>
              ))}
            </div>

            {feedbackParts.length > 0 && (
              <div className="mt-4 text-xs font-bold text-sky-700/80">
                {feedbackParts.join(' · ')}
              </div>
            )}

            {primaryUnlock && (
              <div className="mt-3 rounded-2xl bg-violet-100 px-3 py-2.5 text-sm font-black text-violet-800">
                {unlockIcons[primaryUnlock]} {unlockLabels[primaryUnlock]}
              </div>
            )}
            {result.followUp !== 'review-choices' && result.nextGoal ? (
              <div className="mt-3 text-xs font-bold text-sky-700/75">
                {ui.roundResult.nextGoal}{result.nextGoal}
              </div>
            ) : null}

            {result.followUp === 'review-choices' ? (
              <div className="mt-4 flex w-full flex-col gap-2">
                {canContinueReview ? (
                  <motion.button
                    type="button"
                    whileTap={MOTION_PRESS_TAP}
                    onClick={onContinueReview}
                    className="candy-sheet-action-btn candy-sheet-action-btn-pink w-full"
                  >
                    {t.modes.reviewContinueReview}
                  </motion.button>
                ) : (
                  <div className="rounded-2xl bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800">
                    {t.modes.insufficientReviewHint}
                  </div>
                )}
                {canGoAdventure ? (
                  <motion.button
                    type="button"
                    whileTap={MOTION_PRESS_TAP}
                    onClick={onGoAdventure}
                    className="candy-sheet-action-btn candy-sheet-action-btn-blue w-full"
                  >
                    {t.modes.reviewContinueAdventure}
                  </motion.button>
                ) : (
                  <div className="rounded-2xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900">
                    {t.modes.reviewContinueNoStamina}
                  </div>
                )}
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={onRest}
                  className="rounded-full px-3 py-2 text-sm font-bold text-sky-800/80"
                >
                  {t.modes.reviewContinueRest}
                </motion.button>
              </div>
            ) : (
              <motion.button
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={onContinue}
                className="candy-sheet-action-btn candy-sheet-action-btn-pink mt-4 w-full"
              >
                {result.followUp === 'forced-review'
                  ? result.primaryActionLabel ?? ui.roundResult.startReview
                  : result.followUp === 'home'
                    ? result.primaryActionLabel ?? ui.deadMachine.later
                    : result.primaryActionLabel ?? ui.roundResult.nextSet}
              </motion.button>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-2">
              {result.kind === 'learned' && (
                <button type="button" onClick={onViewCollection} className="text-xs font-black text-sky-700 underline decoration-sky-300 underline-offset-4">
                  {ui.roundResult.viewCollection}
                </button>
              )}
            </div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
