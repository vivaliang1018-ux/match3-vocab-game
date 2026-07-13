import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ChevronRight,
  LogIn,
  Music,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { WordMemory } from '../../lib/ebbinghausMemory';
import { masteredEmojiCount } from '../../lib/ebbinghausMemory';
import { privacyPolicyUrl } from '../../lib/privacyPolicyUrl';
import { useAuth } from '../../auth/AuthProvider';
import { MOTION_PRESS_DEEP, MOTION_SPRING_BOUNCY } from '../../lib/motionPresets';
import { LOCALE_OPTIONS, useI18n } from '../../i18n';
import { cn } from '../../lib/utils';
import { EmojiClearStatsBlock } from './EmojiClearStatsBlock';
import { CandyFrostingHeader } from './CandyFrostingHeader';
import { SignInSheet } from './SignInSheet';
import { AccountAvatar, AccountSettingsSheet } from './AccountSettingsSheet';

type ProfilePanelProps = {
  profileAreaRef?: React.RefObject<HTMLDivElement | null>;
  ttsAvailable: boolean;
  usesThiings: boolean;
  wordMemory: Map<string, WordMemory>;
  allPool: { id: string; word: string }[];
  totalEmojiPool: number;
  bgmEnabled: boolean;
  onBgmEnabledChange: (enabled: boolean) => void;
  sfxEnabled: boolean;
  onSfxEnabledChange: (enabled: boolean) => void;
};

export function ProfilePanel({
  profileAreaRef,
  ttsAvailable,
  usesThiings,
  wordMemory,
  allPool,
  totalEmojiPool,
  bgmEnabled,
  onBgmEnabledChange,
  sfxEnabled,
  onSfxEnabledChange,
}: ProfilePanelProps) {
  const { locale, setLocale, t } = useI18n();
  const { user } = useAuth();
  const [signInOpen, setSignInOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const masteredCount = masteredEmojiCount(wordMemory, allPool);

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
        <CandyFrostingHeader title="PROFILE" />

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
            <EmojiClearStatsBlock
              learnedCount={masteredCount}
              totalEmojiPool={totalEmojiPool}
              theme="candy"
            />
          </ProfileSection>

          <ProfileSection>
            <div ref={profileAreaRef} className="grid grid-cols-2 gap-3">
              <CandyToggle
                label={t.profile.sfx}
                enabled={sfxEnabled}
                onLabel={t.profile.toggleOn}
                offLabel={t.profile.toggleOff}
                onIcon={Volume2}
                offIcon={VolumeX}
                onChange={onSfxEnabledChange}
              />
              <CandyToggle
                label={t.profile.bgm}
                enabled={bgmEnabled}
                onLabel={t.profile.toggleOn}
                offLabel={t.profile.toggleOff}
                onIcon={Music}
                offIcon={Music}
                offIconMuted
                onChange={onBgmEnabledChange}
              />
            </div>
          </ProfileSection>

          <ProfileSection>
            <div
              className="flex flex-wrap justify-center gap-2"
              role="radiogroup"
              aria-label={t.profile.language}
            >
              {LOCALE_OPTIONS.map((opt) => {
                const selected = locale === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={opt.label}
                    onClick={() => setLocale(opt.id)}
                    className={cn(
                      'profile-candy-locale-btn',
                      selected && 'profile-candy-locale-btn-active',
                    )}
                  >
                    {opt.shortLabel}
                  </button>
                );
              })}
            </div>
          </ProfileSection>

          <section className="profile-candy-about mt-5">
            <div className="profile-candy-about-title">{t.profile.aboutTitle}</div>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-sky-900/70">
              {t.profile.description}
            </p>
            <p className="mt-2.5 text-[10px] font-bold text-sky-800/75">
              {t.profile.version}: {t.meta.uiVersion}
            </p>
            <p className="mt-1.5">
              <a
                className="text-[10px] font-bold text-pink-600 underline decoration-pink-400/60 underline-offset-2"
                href={privacyPolicyUrl()}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.profile.privacyPolicy}
              </a>
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

      <SignInSheet open={signInOpen} onClose={() => setSignInOpen(false)} />
      <AccountSettingsSheet
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        onDeleted={() => setStatusMsg(t.profile.deleteAccountDone)}
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

function CandyToggle({
  label,
  enabled,
  onLabel,
  offLabel,
  onIcon: OnIcon,
  offIcon: OffIcon,
  offIconMuted = false,
  onChange,
}: {
  label: string;
  enabled: boolean;
  onLabel: string;
  offLabel: string;
  onIcon: LucideIcon;
  offIcon: LucideIcon;
  offIconMuted?: boolean;
  onChange: (enabled: boolean) => void;
}) {
  const stateLabel = enabled ? onLabel : offLabel;
  const Icon = enabled ? OnIcon : OffIcon;

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={`${label}: ${stateLabel}`}
      onClick={() => onChange(!enabled)}
      whileTap={MOTION_PRESS_DEEP}
      className={cn(
        'profile-candy-toggle',
        enabled ? 'profile-candy-toggle-on' : 'profile-candy-toggle-off',
      )}
    >
      <span className="profile-candy-toggle-gloss" aria-hidden />
      <span
        className={cn(
          'profile-candy-toggle-label',
          enabled ? 'profile-candy-toggle-label-on' : 'profile-candy-toggle-label-off',
        )}
      >
        {label}
      </span>
      <motion.span
        className="profile-candy-toggle-knob"
        animate={{
          x: enabled ? 'calc(100cqw - 2.45rem - 0.7rem)' : 0,
          y: '-50%',
          scale: enabled ? [1, 1.08, 1] : [1, 0.94, 1],
        }}
        transition={MOTION_SPRING_BOUNCY}
      >
        <Icon
          size={17}
          className={cn(enabled ? 'text-sky-500' : 'text-pink-500')}
          aria-hidden
        />
        {!enabled && offIconMuted && (
          <span className="profile-candy-toggle-knob-slash" aria-hidden />
        )}
      </motion.span>
    </motion.button>
  );
}
