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

const MODE_EMOJI: Record<ChallengeMode, string> = {
  random: '🎲',
  fun: '🎯',
  category: '🧩',
  review: '⭐',
};

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
}: ModePickerSheetProps) {
  const { locale, t } = useI18n();

  const modeOptions: { id: ChallengeMode; label: string }[] = [
    { id: 'random', label: t.modes.random },
    { id: 'fun', label: t.modes.fun },
    { id: 'category', label: t.modes.category },
    { id: 'review', label: t.modes.review },
  ];

  const pickMode = (mode: ChallengeMode) => {
    onChallengeModeChange(mode);
    if (mode !== 'category') onClose();
  };

  const pickCategory = (id: string) => {
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
                  const selected = challengeMode === opt.id;
                  return (
                    <motion.button
                      key={opt.id}
                      type="button"
                      variants={MOTION_STAGGER_ITEM}
                      whileTap={MOTION_PRESS_TAP}
                      onClick={() => pickMode(opt.id)}
                      className={cn('candy-sheet-mode-btn', selected && 'candy-sheet-mode-btn-active')}
                      aria-label={opt.label}
                      aria-pressed={selected}
                      animate={selected ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                      transition={{ duration: 0.35 }}
                    >
                      <span className="candy-sheet-mode-gloss" aria-hidden />
                      {selected && (
                        <motion.span
                          className="candy-sheet-mode-badge"
                          initial={{ scale: 0, rotate: -12 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 480, damping: 20 }}
                        >
                          {t.common.current}
                        </motion.span>
                      )}
                      <span className="candy-sheet-mode-icon" aria-hidden>
                        {MODE_EMOJI[opt.id]}
                      </span>
                      <div className="candy-sheet-mode-label">{opt.label}</div>
                    </motion.button>
                  );
                })}
              </motion.div>

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
                    const selected = selectedCategoryId === cat.id && challengeMode === 'category';
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
                        )}
                        animate={selected ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                      >
                        {categoryDisplayName(cat, locale)}
                      </motion.button>
                    );
                  })}
                </motion.div>
              </motion.div>

              <motion.div
                className="mt-3 grid grid-cols-2 gap-2"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, type: 'spring', stiffness: 360, damping: 28 }}
              >
                <motion.button
                  type="button"
                  onClick={shuffle}
                  disabled={!canPlay}
                  whileTap={canPlay ? MOTION_PRESS_TAP : undefined}
                  className={cn(
                    'candy-sheet-action-btn candy-sheet-action-btn-blue',
                    !canPlay && 'candy-sheet-action-btn-disabled',
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
                  {t.gameSettings.restart}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
