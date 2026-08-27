import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import {
  MOTION_SHEET_PANEL,
  MOTION_STAGGER_CONTAINER,
  MOTION_STAGGER_ITEM,
  MOTION_STAGGER_TIGHT_CONTAINER,
  MOTION_STAGGER_TIGHT_ITEM,
  MOTION_VIGNETTE,
} from '../../lib/motionChoreography';
import { RefreshCw, X } from 'lucide-react';
import { categoryDisplayName, useI18n } from '../../i18n';
import type { ChallengeMode } from '../../types/game';
import { cn } from '../../lib/utils';
import type { FeatureGuideTarget } from '../../lib/firstTimeGuide';
import { GuidedTapHint } from './GuidedTapHint';
import { useLimitedGuidePrompt } from './useLimitedGuidePrompt';

const MODE_EMOJI: Record<Exclude<ChallengeMode, 'review'>, string> = {
  random: '🏁',
  mood: '🎨',
  category: '🧩',
};
const SAY_BLAST_MODE_ID = 'say-blast' as const;

type ChallengePool = {
  id: string;
  label: string;
  subtitle: string;
};

type ModePickerSheetProps = {
  open: boolean;
  onClose: () => void;
  challengeMode: ChallengeMode;
  onChallengeModeChange: (mode: ChallengeMode) => void;
  challengePools: ChallengePool[];
  selectedCategoryId: string;
  onCategoryChange: (id: string) => void;
  onShuffleWords: () => void;
  onRestart: () => void;
  canPlay: boolean;
  categoryUnlocked: boolean;
  moodUnlocked: boolean;
  /** False when today's Mood Board play limit is reached. */
  moodCanStartNew?: boolean;
  sayBlastUnlocked: boolean;
  onOpenSayBlast: () => void;
  guideTarget?: Extract<FeatureGuideTarget, 'sayAndBlast' | 'moodBoard'> | null;
  guidePlayCount?: number;
  onGuidePlaybackStart?: (
    target: Extract<FeatureGuideTarget, 'sayAndBlast' | 'moodBoard'>,
  ) => void;
};

export function ModePickerSheet({
  open,
  onClose,
  challengeMode,
  onChallengeModeChange,
  challengePools,
  selectedCategoryId,
  onCategoryChange,
  onShuffleWords,
  onRestart,
  canPlay,
  categoryUnlocked,
  moodUnlocked,
  moodCanStartNew = true,
  sayBlastUnlocked,
  onOpenSayBlast,
  guideTarget = null,
  guidePlayCount = 0,
  onGuidePlaybackStart,
}: ModePickerSheetProps) {
  const { locale, t, ui } = useI18n();
  const [pulseCategoryId, setPulseCategoryId] = useState<string | null>(null);
  const sayBlastButtonRef = useRef<HTMLButtonElement | null>(null);
  const moodBoardButtonRef = useRef<HTMLButtonElement | null>(null);
  const guidePlaying = useLimitedGuidePrompt({
    eligible: open && guideTarget !== null,
    persistedPlayCount: guidePlayCount,
    onPlaybackStart: () => {
      if (guideTarget) onGuidePlaybackStart?.(guideTarget);
    },
  });
  const guideButtonRef =
    guideTarget === 'sayAndBlast' ? sayBlastButtonRef : moodBoardButtonRef;
  const canShuffleWords =
    canPlay && !(challengeMode === 'mood' && !moodCanStartNew);

  const modeOptions: {
    id: ChallengeMode | typeof SAY_BLAST_MODE_ID;
    label: string;
    emoji: string;
    description: string;
    disabled?: boolean;
  }[] = [
    { id: 'random', label: t.modes.random, emoji: MODE_EMOJI.random, description: t.modes.randomDesc },
    ...(moodUnlocked ? [{
      id: 'mood',
      label: t.modes.moodBoard,
      emoji: MODE_EMOJI.mood,
      description: moodCanStartNew
        ? ui.mode.moodDescription
        : ui.mode.moodDailyLimitReached,
      disabled: !moodCanStartNew && challengeMode !== 'mood',
    } as const] : []),
    ...(sayBlastUnlocked ? [{
      id: SAY_BLAST_MODE_ID,
      label: t.modes.sayBlast,
      emoji: '🎤',
      description: `${t.modes.sayBlastDesc} · 3★ +1 ❤️`,
    } as const] : []),
    ...(categoryUnlocked
      ? [{ id: 'category' as const, label: t.modes.category, emoji: MODE_EMOJI.category, description: t.modes.categoryDesc }]
      : []),
  ];

  useEffect(() => {
    if (!open) setPulseCategoryId(null);
  }, [open]);

  const pickMode = (mode: ChallengeMode | typeof SAY_BLAST_MODE_ID) => {
    if (mode === SAY_BLAST_MODE_ID) {
      setPulseCategoryId(null);
      onClose();
      onOpenSayBlast();
      return;
    }
    if (mode === 'mood' && !moodCanStartNew && challengeMode !== 'mood') return;
    onChallengeModeChange(mode);
    if (mode !== 'category') {
      setPulseCategoryId(null);
      onClose();
      return;
    }
    const hintId =
      challengePools.find((c) => c.id === selectedCategoryId)?.id ??
      challengePools[0]?.id ??
      null;
    setPulseCategoryId(hintId);
  };

  const pickCategory = (id: string) => {
    if (!categoryUnlocked) return;
    setPulseCategoryId(null);
    onCategoryChange(id);
    onChallengeModeChange('category');
    onClose();
  };

  const shuffle = () => {
    onShuffleWords();
    onClose();
  };

  const restart = () => {
    onRestart();
    onClose();
  };

  return (
    <>
      <AnimatePresence>
      {open && (
        <motion.div
          key="mode-picker"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="candy-sheet-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={t.modes.pickerTitle}
          onClick={onClose}
        >
          <motion.div className="candy-sheet-backdrop" aria-hidden />
          <motion.div
            variants={MOTION_SHEET_PANEL}
            className="candy-sheet-panel will-change-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="candy-sheet-handle"
              aria-hidden
              initial={{ scaleX: 0.4, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.div
              className="candy-sheet-header"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 380, damping: 28 }}
            >
              <h2 className="candy-sheet-title">{t.modes.pickerTitle}</h2>
              <motion.button
                type="button"
                onClick={onClose}
                className="candy-sheet-close"
                aria-label={t.common.close}
                whileTap={MOTION_PRESS_TAP}
              >
                <X size={16} strokeWidth={2.75} aria-hidden />
              </motion.button>
            </motion.div>

            <div className="candy-sheet-body">
              <motion.div
                className="candy-sheet-mode-list"
                variants={MOTION_STAGGER_CONTAINER}
                initial="hidden"
                animate="visible"
              >
                {modeOptions.map((opt) => {
                  const selected = opt.id !== SAY_BLAST_MODE_ID && challengeMode === opt.id;
                  const disabled = Boolean(opt.disabled);
                  return (
                    <motion.button
                      key={opt.id}
                      ref={
                        opt.id === SAY_BLAST_MODE_ID
                          ? sayBlastButtonRef
                          : opt.id === 'mood'
                            ? moodBoardButtonRef
                            : undefined
                      }
                      type="button"
                      variants={MOTION_STAGGER_ITEM}
                      whileTap={disabled ? undefined : MOTION_PRESS_TAP}
                      onClick={() => pickMode(opt.id)}
                      disabled={disabled}
                      className={cn(
                        'candy-sheet-mode-btn',
                        selected && 'candy-sheet-mode-btn-active',
                        disabled && 'opacity-45',
                        guidePlaying &&
                          ((guideTarget === 'sayAndBlast' && opt.id === SAY_BLAST_MODE_ID) ||
                            (guideTarget === 'moodBoard' && opt.id === 'mood')) &&
                          'first-time-guide-target-pulse',
                      )}
                      aria-label={opt.label}
                      aria-pressed={selected}
                      aria-disabled={disabled}
                    >
                      <span className="candy-sheet-mode-gloss" aria-hidden />
                      {selected && (
                        <span className="candy-sheet-mode-badge">{t.common.current}</span>
                      )}
                      <span className="candy-sheet-mode-icon" aria-hidden>
                        {opt.emoji}
                      </span>
                      <div className="candy-sheet-mode-label">{opt.label}</div>
                      <div className="mt-1 max-w-[13rem] text-[10px] font-bold leading-snug text-sky-800/70">
                        {opt.description}
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>

              {categoryUnlocked && (
                <motion.div
                  className="mt-3"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, type: 'spring', stiffness: 340, damping: 28 }}
                >
                  <div className="candy-sheet-section-label">{t.modes.categoryThemes}</div>
                  <motion.div
                    className="candy-sheet-category-grid no-scrollbar"
                    variants={MOTION_STAGGER_TIGHT_CONTAINER}
                    initial="hidden"
                    animate="visible"
                  >
                    {challengePools.map((cat) => {
                      const selected =
                        selectedCategoryId === cat.id && challengeMode === 'category';
                      const pulsing = pulseCategoryId === cat.id;
                      return (
                        <motion.button
                          key={cat.id}
                          type="button"
                          variants={MOTION_STAGGER_TIGHT_ITEM}
                          whileTap={MOTION_PRESS_TAP}
                          onClick={() => pickCategory(cat.id)}
                          className={cn(
                            'candy-sheet-category-btn',
                            selected && 'candy-sheet-category-btn-active',
                            pulsing && 'candy-sheet-category-btn-pulse',
                          )}
                        >
                          {categoryDisplayName(cat, locale)}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </motion.div>
              )}

              <motion.div
                className="mt-3 grid grid-cols-2 gap-2"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, type: 'spring', stiffness: 360, damping: 28 }}
              >
                <motion.button
                  type="button"
                  onClick={shuffle}
                  disabled={!canShuffleWords}
                  whileTap={canShuffleWords ? MOTION_PRESS_TAP : undefined}
                  className={cn(
                    'candy-sheet-action-btn candy-sheet-action-btn-blue',
                    !canShuffleWords && 'candy-sheet-action-btn-disabled',
                  )}
                >
                  <RefreshCw size={15} aria-hidden />
                  {t.modes.shuffle}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={restart}
                  disabled={!canPlay}
                  whileTap={canPlay ? MOTION_PRESS_TAP : undefined}
                  className={cn(
                    'candy-sheet-action-btn candy-sheet-action-btn-pink',
                    !canPlay && 'candy-sheet-action-btn-disabled',
                  )}
                >
                  <RefreshCw size={15} aria-hidden />
                  {t.modes.reshuffleBoard}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
      <GuidedTapHint
        visible={guidePlaying}
        targetRef={guideButtonRef}
        fingerOffset={{ x: 24, y: 34 }}
      />
    </>
  );
}
