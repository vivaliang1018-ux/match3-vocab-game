import { useRef } from 'react';
import { motion } from 'motion/react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { MOTION_TAB_SPRING } from '../../lib/motionChoreography';
import { useI18n } from '../../i18n';
import { triggerGameHaptic } from '../../lib/gameHaptics';
import { cn } from '../../lib/utils';
import type { AppTab } from './types';
import { GuidedTapHint } from './GuidedTapHint';
import { useLimitedGuidePrompt } from './useLimitedGuidePrompt';

const TAB_EMOJI: Record<AppTab, string> = {
  game: '🎮',
  learned: '🧩',
  words: '🤲',
  profile: '🥳',
};

type MobileTabBarProps = {
  active: AppTab;
  onChange: (tab: AppTab) => void;
  badges?: Partial<Record<AppTab, number>>;
  learnedGuide?: {
    playCount: number;
    onPlaybackStart: () => void;
  } | null;
};

export function MobileTabBar({
  active,
  onChange,
  badges,
  learnedGuide = null,
}: MobileTabBarProps) {
  const { t } = useI18n();
  const learnedButtonRef = useRef<HTMLButtonElement | null>(null);
  const learnedGuidePlaying = useLimitedGuidePrompt({
    eligible: learnedGuide !== null,
    persistedPlayCount: learnedGuide?.playCount ?? 0,
    onPlaybackStart: () => learnedGuide?.onPlaybackStart(),
  });
  const tabs: { id: AppTab; label: string }[] = [
    { id: 'game', label: t.tabs.game },
    { id: 'learned', label: t.tabs.learned },
    { id: 'words', label: t.tabs.words },
    { id: 'profile', label: t.tabs.profile },
  ];

  return (
    <>
      <nav
        className="tab-bar-candy relative z-30 shrink-0"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        aria-label={t.tabs.navAria}
      >
      <div className="tab-bar-candy-board" aria-hidden />
      <div className="tab-bar-candy-inner mx-auto flex max-w-lg items-end justify-around gap-0.5 px-2 pb-1.5">
        {tabs.map(({ id, label }) => {
          const isActive = active === id;
          const badge = badges?.[id] ?? 0;
          const showBadge = badge > 0;

          return (
            <motion.button
              key={id}
              ref={id === 'learned' ? learnedButtonRef : undefined}
              type="button"
              onClick={() => {
                if (!isActive) triggerGameHaptic('tabSelection');
                onChange(id);
              }}
              className={cn(
                'tab-candy-item',
                isActive && 'tab-candy-item-active',
                id === 'learned' && learnedGuidePlaying && 'first-time-guide-target-pulse',
              )}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
              whileTap={MOTION_PRESS_TAP}
            >
              <span className={cn('tab-candy-icon-slot', isActive && 'tab-candy-icon-slot-active')}>
                <motion.span
                  className={cn('tab-candy-emoji', isActive && 'tab-candy-emoji-active')}
                  style={{ transformOrigin: 'center bottom' }}
                  aria-hidden
                  layout
                  animate={{
                    y: isActive ? -18 : 8,
                    scale: isActive ? 1.38 : 0.88,
                    rotate: isActive ? [0, -12, 8, -4, 0] : 0,
                    opacity: isActive ? 1 : 0.52,
                  }}
                  transition={{
                    y: MOTION_TAB_SPRING,
                    scale: MOTION_TAB_SPRING,
                    rotate: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.22 },
                    layout: MOTION_TAB_SPRING,
                  }}
                >
                  {TAB_EMOJI[id]}
                </motion.span>
                {showBadge && (
                  <motion.span
                    className="tab-candy-badge"
                    aria-label={t.tabs.dueBadge(badge)}
                    initial={{ scale: 0, opacity: 0, y: 6 }}
                    animate={{ scale: [0, 1.2, 1], opacity: 1, y: 0 }}
                    transition={MOTION_TAB_SPRING}
                  >
                    {badge > 99 ? '99+' : badge}
                  </motion.span>
                )}
              </span>
              <motion.span
                className={cn('tab-candy-label', isActive && 'tab-candy-label-active')}
                animate={{
                  y: isActive ? 3 : 0,
                  scale: isActive ? 1.04 : 0.96,
                  opacity: isActive ? 1 : 0.68,
                }}
                transition={MOTION_TAB_SPRING}
              >
                {label}
              </motion.span>
              {isActive && (
                <motion.span
                  layoutId="tab-candy-indicator"
                  className="absolute bottom-[0.12rem] left-1/2 h-[3px] w-[1.35rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-sky-400 to-pink-400 shadow-[0_1px_0_rgba(255,255,255,0.65)]"
                  transition={MOTION_TAB_SPRING}
                  aria-hidden
                />
              )}
            </motion.button>
          );
        })}
        </div>
      </nav>
      <GuidedTapHint
        visible={learnedGuidePlaying}
        targetRef={learnedButtonRef}
        fingerOffset={{ x: 18, y: 30 }}
      />
    </>
  );
}
