import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Bell, CheckCircle2, ChevronRight, Crown, Languages, LogIn, Music, ShieldCheck, Vibrate, Volume2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { WordMemory } from '../../lib/ebbinghausMemory';
import { masteredEmojiCount } from '../../lib/ebbinghausMemory';
import { assetUrl } from '../../lib/assetUrl';
import { useAuth } from '../../auth/AuthProvider';
import { MOTION_PRESS_DEEP } from '../../lib/motionPresets';
import { useI18n } from '../../i18n';
import { COURSE_SETUP_COPY } from '../../lib/coursePresentation';
import { useCourse } from '../../course';
import { useMembership } from '../../membership/MembershipProvider';
import { MEMBERSHIP_COPY } from '../../membership/membershipCopy';
import { cn } from '../../lib/utils';
import { readAppVersionLabel } from '../../lib/appVersion';
import { REWARDED_AD_COPY } from '../../i18n/rewardedAdCopy';
import { NOTIFICATION_SETTINGS_COPY } from '../../i18n/notificationSettingsCopy';
import { NOTIFICATION_SCOPE_COPY } from '../../i18n/notificationScopeCopy';
import { adPrivacyOptionsRequired, showAdPrivacyOptions } from '../../lib/rewardedAds';
import {
  readLearningReminderSettings,
  type LearningReminderContext,
} from '../../lib/learningNotificationsV2';
import { NotificationSettingsSheet } from './NotificationSettingsSheet';
import { ProfileJourneySummary } from './ProfileJourneySummary';
import { CandyFrostingHeader } from './CandyFrostingHeader';
import { CoursePickerSheet } from './CoursePickerSheet';
import { SignInSheet } from './SignInSheet';
import { AccountAvatar, AccountSettingsSheet } from './AccountSettingsSheet';
import { LegalDocSheet } from './LegalDocSheet';
import {
  isCategoryUnlocked,
  isReviewUnlocked,
} from '../../lib/modeUnlocks';
import {
  reconcileBadges,
  savePlayerSummary,
  type PlayerSummary,
} from '../../lib/playerSummary';

type ProfilePanelProps = {
  ttsAvailable: boolean;
  usesThiings: boolean;
  wordMemory: Map<string, WordMemory>;
  allPool: { id: string; word: string }[];
  adventureClears: number;
  playerSummary: PlayerSummary;
  onPlayerSummaryChange: (next: PlayerSummary) => void;
  bgmEnabled: boolean;
  onBgmEnabledChange: (enabled: boolean) => void;
  sfxEnabled: boolean;
  onSfxEnabledChange: (enabled: boolean) => void;
  hapticsEnabled: boolean;
  onHapticsEnabledChange: (enabled: boolean) => void;
  playedToday: boolean;
  reminderGameState?: Pick<LearningReminderContext, 'dueReviewCount' | 'staminaValue' | 'nextStaminaAt'>;
};

export function ProfilePanel({
  ttsAvailable,
  usesThiings,
  wordMemory,
  allPool,
  adventureClears,
  playerSummary,
  onPlayerSummaryChange,
  bgmEnabled,
  onBgmEnabledChange,
  sfxEnabled,
  onSfxEnabledChange,
  hapticsEnabled,
  onHapticsEnabledChange,
  playedToday,
  reminderGameState,
}: ProfilePanelProps) {
  const { locale, t } = useI18n();
  const courseCopy = COURSE_SETUP_COPY[locale];
  const { courseId, course, sourceLanguage } = useCourse();
  const { user } = useAuth();
  const { storeSupported, status: membershipStatus, openPaywall } = useMembership();
  const [signInOpen, setSignInOpen] = useState(false);
  const [legalDoc, setLegalDoc] = useState<'terms' | 'privacy' | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [coursePickerOpen, setCoursePickerOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [versionLabel, setVersionLabel] = useState(t.meta.uiVersion);
  const [showAdPrivacy, setShowAdPrivacy] = useState(false);
  const [reminderSettings, setReminderSettings] = useState(() => readLearningReminderSettings());
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);
  const masteredCount = masteredEmojiCount(wordMemory, allPool);
  const reminderCopy = NOTIFICATION_SETTINGS_COPY[locale];
  const hasPremiumAccess = membershipStatus === 'premium';

  useEffect(() => {
    let active = true;
    setVersionLabel(t.meta.uiVersion);
    void readAppVersionLabel(t.meta.uiVersion).then((label) => {
      if (active) setVersionLabel(label);
    });
    return () => {
      active = false;
    };
  }, [t.meta.uiVersion]);

  useEffect(() => {
    let active = true;
    void adPrivacyOptionsRequired().then((required) => {
      if (active) setShowAdPrivacy(required);
    });
    return () => {
      active = false;
    };
  }, []);

  // Retroactively unlock badges from existing progress when opening profile.
  useEffect(() => {
    const next = reconcileBadges(playerSummary, {
      adventureClears,
      masteredCount,
      reviewUnlocked: isReviewUnlocked(adventureClears),
      categoryUnlocked: isCategoryUnlocked(adventureClears),
    });
    const prevIds = playerSummary.badges
      .map((b) => b.id)
      .sort()
      .join('|');
    const nextIds = next.badges
      .map((b) => b.id)
      .sort()
      .join('|');
    if (prevIds !== nextIds) {
      savePlayerSummary(next, user?.uid ?? null);
      onPlayerSummaryChange(next);
    }
  }, [adventureClears, masteredCount, playerSummary, onPlayerSummaryChange, user?.uid]);

  const displayName = user?.displayName || user?.email?.split('@')[0] || t.profile.guestName;
  const badge = user ? t.profile.signedInBadge : t.profile.guestBadge;
  const subtitle = user ? t.profile.signedInSubtitle : t.profile.subtitle;

  useEffect(() => {
    if (!statusMsg) return;
    const id = window.setTimeout(() => setStatusMsg(null), 2800);
    return () => window.clearTimeout(id);
  }, [statusMsg]);

  return (
    <div className="profile-candy-page pb-6">
      <div className="profile-candy-board">
        <CandyFrostingHeader title={t.tabs.profile} />

        <div className="profile-candy-body">
          {user ? (
            <button
              type="button"
              className="profile-candy-user-card profile-candy-user-card-btn"
              onClick={() => setAccountOpen(true)}
              aria-label={t.profile.accountSettingsTitle}
            >
              <div className="profile-candy-avatar-wrap">
                <div className="profile-candy-avatar profile-candy-avatar-flush">
                  <AccountAvatar user={user} />
                </div>
              </div>
              <div className="profile-candy-user-plate min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-black tracking-tight text-white">{displayName}</h2>
                  <span className="rounded-full bg-white/25 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white shadow-sm ring-1 ring-white/40">
                    {badge}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] font-bold text-sky-50/95">{subtitle}</p>
                <p className="mt-1 flex items-center gap-0.5 text-[10px] font-extrabold text-white/90">
                  {t.profile.accountOpenSettings}
                  <ChevronRight size={12} aria-hidden />
                </p>
              </div>
            </button>
          ) : (
            <div className="profile-candy-user-card">
              <div className="profile-candy-avatar-wrap">
                <div className="profile-candy-avatar">
                  <AccountAvatar user={null} />
                </div>
              </div>
              <div className="profile-candy-user-plate min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-black tracking-tight text-white">{displayName}</h2>
                  <span className="rounded-full bg-white/25 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-white shadow-sm ring-1 ring-white/40">
                    {badge}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] font-bold text-sky-50/95">{subtitle}</p>
              </div>
            </div>
          )}

          <div className="mt-3.5 space-y-2">
            {storeSupported && (
              <motion.button
                type="button"
                className={cn('membership-profile-card', membershipStatus === 'premium' && 'membership-profile-card-premium')}
                whileTap={MOTION_PRESS_DEEP}
                disabled={membershipStatus === 'premium'}
                onClick={() => {
                  if (membershipStatus !== 'premium') openPaywall('profile');
                }}
              >
                <span className="membership-profile-icon" aria-hidden><Crown size={19} /></span>
                <span className="membership-profile-copy">
                  <strong>{MEMBERSHIP_COPY[locale].plus}</strong>
                  <small>{membershipStatus === 'premium'
                    ? MEMBERSHIP_COPY[locale].profileActiveSummary
                    : MEMBERSHIP_COPY[locale].profileSummary}</small>
                </span>
                <span className="membership-profile-action" aria-hidden>
                  {membershipStatus === 'premium' ? <CheckCircle2 size={20} /> : <ChevronRight size={18} />}
                </span>
              </motion.button>
            )}
            {!user && (
              <>
                <motion.button
                  type="button"
                  className="profile-candy-btn profile-candy-btn-pink w-full"
                  whileTap={MOTION_PRESS_DEEP}
                  onClick={() => setSignInOpen(true)}
                >
                  <LogIn size={18} aria-hidden />
                  {t.profile.signInCta}
                </motion.button>
                <p
                  id="profile-sign-in-hint"
                  className="mt-1.5 text-center text-[9px] font-bold leading-snug text-sky-800/65"
                >
                  {t.profile.signInComingSoonHint}
                </p>
              </>
            )}
            {statusMsg && (
              <p className="text-center text-[11px] font-bold text-emerald-700">{statusMsg}</p>
            )}
          </div>

          <ProfileSection>
            <button
              type="button"
              className="profile-candy-course-row"
              aria-label={`${courseCopy.changeCourse}: ${course.label}`}
              onClick={() => setCoursePickerOpen(true)}
            >
              <span className="profile-candy-setting-icon"><Languages size={18} aria-hidden /></span>
              <span className="profile-candy-course-row-copy">
                <strong>{courseCopy.currentCourse}</strong>
                <small>{course.label}</small>
              </span>
              <ChevronRight size={19} aria-hidden />
            </button>
          </ProfileSection>

          <ProfileSection>
            <div className="profile-candy-preferences">
              <CompactPreferenceSwitch
                label={t.profile.sfx}
                enabled={sfxEnabled}
                onLabel={t.profile.toggleOn}
                offLabel={t.profile.toggleOff}
                icon={Volume2}
                onChange={onSfxEnabledChange}
              />
              <CompactPreferenceSwitch
                label={t.profile.bgm}
                enabled={bgmEnabled}
                onLabel={t.profile.toggleOn}
                offLabel={t.profile.toggleOff}
                icon={Music}
                onChange={onBgmEnabledChange}
              />
              <CompactPreferenceSwitch
                label={t.profile.haptics}
                enabled={hapticsEnabled}
                onLabel={t.profile.toggleOn}
                offLabel={t.profile.toggleOff}
                icon={Vibrate}
                onChange={onHapticsEnabledChange}
              />
              <button
                type="button"
                className="profile-candy-preference-row"
                onClick={() => setNotificationSettingsOpen(true)}
              >
                <span className="profile-candy-setting-icon"><Bell size={18} aria-hidden /></span>
                <span className="profile-candy-preference-label">{NOTIFICATION_SCOPE_COPY[locale].notifications}</span>
                <span className="ml-auto text-[11px] font-black text-sky-700/70">
                  {reminderSettings.enabled ? reminderCopy.summaryOn : reminderCopy.summaryOff}
                </span>
                <ChevronRight size={17} aria-hidden />
              </button>
            </div>
          </ProfileSection>

          <ProfileSection>
            <ProfileJourneySummary
              summary={playerSummary}
              adventureClears={adventureClears}
              masteredCount={masteredCount}
              reviewUnlocked={isReviewUnlocked(adventureClears)}
              categoryUnlocked={isCategoryUnlocked(adventureClears)}
              onPlayerSummaryChange={onPlayerSummaryChange}
            />
          </ProfileSection>

          <section className="profile-candy-about mt-5">
            <div className="profile-candy-about-title">{t.profile.aboutTitle}</div>
            <p className="mt-2 whitespace-pre-line text-xs font-semibold leading-relaxed text-sky-900/70">
              {t.profile.description}
            </p>
            <p className="mt-2.5 text-[10px] font-bold text-sky-800/75">
              {t.profile.version}: {versionLabel}
            </p>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
              <button
                type="button"
                className="text-[10px] font-bold text-pink-600 underline decoration-pink-400/60 underline-offset-2"
                onClick={() => setLegalDoc('terms')}
              >
                {t.profile.termsOfService}
              </button>
              <button
                type="button"
                className="text-[10px] font-bold text-pink-600 underline decoration-pink-400/60 underline-offset-2"
                onClick={() => setLegalDoc('privacy')}
              >
                {t.profile.privacyPolicy}
              </button>
              {showAdPrivacy && (
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-pink-600 underline decoration-pink-400/60 underline-offset-2"
                  onClick={() => {
                    void showAdPrivacyOptions()
                      .then(() => setStatusMsg(REWARDED_AD_COPY[locale].privacyUpdated))
                      .catch(() => setStatusMsg(REWARDED_AD_COPY[locale].privacyUnavailable));
                  }}
                >
                  <ShieldCheck size={11} aria-hidden />
                  {REWARDED_AD_COPY[locale].privacyChoices}
                </button>
              )}
            </p>
            {usesThiings && (
              <p className="mt-1.5 text-[10px] font-medium text-sky-800/65">
                {t.profile.thiingsCredit}{' '}
                <a className="font-bold text-pink-600 underline" href="https://www.thiings.co/terms">
                  thiings.co
                </a>
              </p>
            )}
            {!ttsAvailable && (
              <p className="mt-2 text-[10px] font-semibold text-pink-600/90">{t.profile.ttsUnavailable}</p>
            )}
          </section>
        </div>

        <div className="profile-candy-snow-base" aria-hidden />
      </div>

      {coursePickerOpen && (
        <CoursePickerSheet
          initialSourceLanguage={sourceLanguage}
          initialCourseId={courseId}
          onClose={() => setCoursePickerOpen(false)}
          onConfirmed={() => setCoursePickerOpen(false)}
        />
      )}
      <SignInSheet open={signInOpen} onClose={() => setSignInOpen(false)} />
      <AccountSettingsSheet
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        onDeleted={() => setStatusMsg(t.profile.deleteAccountDone)}
      />
      <LegalDocSheet
        open={legalDoc !== null}
        title={legalDoc === 'terms' ? t.profile.termsOfService : t.profile.privacyPolicy}
        src={assetUrl(legalDoc === 'terms' ? 'terms.html' : 'privacy.html')}
        onClose={() => setLegalDoc(null)}
      />
      <NotificationSettingsSheet
        open={notificationSettingsOpen}
        locale={locale}
        hasPremiumAccess={hasPremiumAccess}
        playedToday={playedToday}
        reminderGameState={reminderGameState}
        onClose={() => {
          setNotificationSettingsOpen(false);
          setReminderSettings(readLearningReminderSettings());
        }}
        onStatus={setStatusMsg}
      />
    </div>
  );
}

function ProfileSection({ children }: { children: ReactNode }) {
  return (
    <section className="mt-4">
      <div className="profile-candy-panel">{children}</div>
    </section>
  );
}

function CompactPreferenceSwitch({
  label,
  enabled,
  onLabel,
  offLabel,
  icon: Icon,
  disabled = false,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onLabel: string;
  offLabel: string;
  icon: LucideIcon;
  disabled?: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${label}: ${enabled ? onLabel : offLabel}`}
      disabled={disabled}
      onClick={() => onChange(!enabled)}
      className="profile-candy-preference-row"
    >
      <span className="profile-candy-setting-icon"><Icon size={18} aria-hidden /></span>
      <span className="profile-candy-preference-label">{label}</span>
      <span className={cn('profile-candy-mini-switch', enabled && 'profile-candy-mini-switch-on')} aria-hidden>
        <span className="profile-candy-mini-switch-thumb" />
      </span>
    </button>
  );
}
