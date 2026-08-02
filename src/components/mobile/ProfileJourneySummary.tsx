import { useState } from 'react';
import { motion } from 'motion/react';
import { MOTION_PRESS_TAP, MOTION_SPRING_POP } from '../../lib/motionPresets';
import { useI18n } from '../../i18n';
import { assetUrl } from '../../lib/assetUrl';
import {
  AWARD_TRACKS,
  awardTrackProgress,
  claimAwardTrack,
  liveDayStreak,
  type AwardAccent,
  type AwardTrackDef,
  type AwardTrackId,
  type AwardTrackProgress,
  type PlayerSummary,
  type SummaryContext,
} from '../../lib/playerSummary';
import { cn } from '../../lib/utils';
import {
  AchievementDetailSheet,
  type AchievementId,
} from './AchievementDetailSheet';
import { AwardClaimSheet } from './AwardClaimSheet';

type ProfileJourneySummaryProps = {
  summary: PlayerSummary;
  adventureClears: number;
  masteredCount: number;
  reviewUnlocked: boolean;
  categoryUnlocked: boolean;
  onPlayerSummaryChange: (next: PlayerSummary) => void;
};

const RECORD_ACCENTS = ['mint', 'amber', 'coral'] as const;

export function ProfileJourneySummary({
  summary,
  adventureClears,
  masteredCount,
  reviewUnlocked,
  categoryUnlocked,
  onPlayerSummaryChange,
}: ProfileJourneySummaryProps) {
  const { t } = useI18n();
  const dayStreak = liveDayStreak(summary);
  const ctx: SummaryContext = {
    adventureClears,
    masteredCount,
    reviewUnlocked,
    categoryUnlocked,
  };

  const [activeId, setActiveId] = useState<AwardTrackId | null>(null);
  const [activeAchievementId, setActiveAchievementId] = useState<AchievementId | null>(
    null,
  );

  const records = [
    {
      id: 'sets',
      value: adventureClears,
      label: t.profile.recordSetsLabel,
      iconSrc: '/branding/records/sets_cleared.webp',
      accent: RECORD_ACCENTS[0],
    },
    {
      id: 'day',
      value: dayStreak,
      label: t.profile.recordDayLabel,
      iconSrc: '/branding/records/day_streak.webp',
      accent: RECORD_ACCENTS[1],
    },
    {
      id: 'combo',
      value: summary.clearStreak,
      label: t.profile.recordComboLabel,
      iconSrc: '/branding/records/clear_streak.webp',
      accent: RECORD_ACCENTS[2],
    },
  ] as const;

  const activeDef: AwardTrackDef | null = activeId
    ? (AWARD_TRACKS.find((d) => d.id === activeId) ?? null)
    : null;
  const activeProgress: AwardTrackProgress | null = activeDef
    ? awardTrackProgress(activeDef, ctx, summary)
    : null;

  return (
    <div className="space-y-4">
      <section>
        <h3 className="profile-candy-section-title">{t.profile.recordsTitle}</h3>
        <div className="mt-2.5 grid grid-cols-3 gap-2">
          {records.map((rec, i) => (
            <motion.button
              key={rec.id}
              type="button"
              whileTap={MOTION_PRESS_TAP}
              onClick={() => setActiveAchievementId(rec.id)}
              className={cn('profile-candy-record-card', accentClass(rec.accent))}
              initial={{ opacity: 0, y: 14, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.06, ...MOTION_SPRING_POP }}
            >
              <div className="profile-candy-record-scene" aria-hidden>
                <img
                  src={assetUrl(rec.iconSrc)}
                  alt=""
                  draggable={false}
                  className="profile-candy-record-icon"
                />
              </div>
              <motion.div
                key={rec.value}
                className="profile-candy-record-num"
                initial={{ scale: 0.75, opacity: 0.4 }}
                animate={{ scale: [0.75, 1.12, 1], opacity: 1 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {rec.value}
              </motion.div>
              <div className="profile-candy-record-label">{rec.label}</div>
            </motion.button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="profile-candy-section-title">{t.profile.awardsTitle}</h3>
        <div className="mt-2.5 grid grid-cols-3 gap-2.5">
          {AWARD_TRACKS.map((def, i) => {
            const progress = awardTrackProgress(def, ctx, summary);
            return (
              <motion.button
                key={def.id}
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={() => setActiveId(def.id)}
                className={cn(
                  'profile-candy-award',
                  accentClass(def.accent),
                  progress.maxed && 'profile-candy-award-maxed',
                  !progress.unlocked && 'profile-candy-award-locked',
                  progress.claimable && 'profile-candy-award-claimable',
                )}
                initial={{ opacity: 0, y: 12, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.04, ...MOTION_SPRING_POP }}
                aria-label={t.profile.awardName(def.id)}
              >
                {progress.claimable && (
                  <span className="profile-candy-award-new">{t.profile.awardNewBadge}</span>
                )}
                <div className="profile-candy-award-medal">
                  <img
                    src={assetUrl(def.iconSrc)}
                    alt=""
                    draggable={false}
                    className="profile-candy-award-icon"
                  />
                </div>
                <div className="profile-candy-award-name">{t.profile.awardName(def.id)}</div>
                <div className="profile-candy-award-progress">
                  {!progress.unlocked
                    ? t.profile.awardLockedHint
                    : progress.maxed
                      ? t.profile.awardMaxed
                      : t.profile.awardProgress(progress.value, progress.next)}
                </div>
                <div className="profile-candy-award-bar" aria-hidden>
                  <motion.div
                    className="profile-candy-award-bar-fill"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: progress.ratio }}
                    transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  />
                </div>
              </motion.button>
            );
          })}
        </div>
      </section>

      <AwardClaimSheet
        open={activeId !== null && activeProgress !== null}
        def={activeDef}
        progress={activeProgress}
        claimedAt={
          activeId && summary.claimedAwardAt[activeId]
            ? summary.claimedAwardAt[activeId]!
            : null
        }
        claimable={Boolean(activeProgress?.claimable)}
        onClose={() => setActiveId(null)}
        onClaim={() => {
          if (!activeId || !activeProgress?.claimable) return;
          const next = claimAwardTrack(summary, activeId, activeProgress.tier);
          onPlayerSummaryChange(next);
        }}
      />
      <AchievementDetailSheet
        achievement={
          activeAchievementId
            ? (records.find((record) => record.id === activeAchievementId) ?? null)
            : null
        }
        onClose={() => setActiveAchievementId(null)}
      />
    </div>
  );
}

function accentClass(accent: AwardAccent | (typeof RECORD_ACCENTS)[number]): string {
  return `profile-candy-accent-${accent}`;
}
