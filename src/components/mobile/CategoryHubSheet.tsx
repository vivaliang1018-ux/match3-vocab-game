import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Play, X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { CATEGORY_UI_COPY } from '../../lib/learningCategoryPresentation';
import {
  MOTION_SHEET_PANEL,
  MOTION_STAGGER_TIGHT_CONTAINER,
  MOTION_STAGGER_TIGHT_ITEM,
  MOTION_VIGNETTE,
} from '../../lib/motionChoreography';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import { cn } from '../../lib/utils';
import { useModalDialog } from './useModalDialog';

export type CategoryChallengePool = {
  id: string;
  label: string;
  subtitle: string;
  description: string;
  emoji: string;
  browseSectionId: string;
  cycle: number;
  clearedInCycle: number;
  items: readonly unknown[];
};

export type CategoryBrowseSection = {
  id: string;
  label: string;
};

type CategoryHubSheetProps = {
  open: boolean;
  onClose: () => void;
  onBackToModes: () => void;
  pools: CategoryChallengePool[];
  sections: CategoryBrowseSection[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
};

export function CategoryHubSheet({
  open,
  onClose,
  onBackToModes,
  pools,
  sections,
  selectedCategoryId,
  onSelectCategory,
}: CategoryHubSheetProps) {
  const { locale, t } = useI18n();
  const copy = CATEGORY_UI_COPY[locale];
  const dialogRef = useModalDialog({ open, onClose });
  const selectedPool = pools.find((pool) => pool.id === selectedCategoryId) ?? pools[0] ?? null;
  const selectedPoolIsFresh =
    selectedPool?.cycle === 1 && selectedPool.clearedInCycle === 0;
  const groupedPools = sections
    .map((section) => ({
      ...section,
      pools: pools.filter((pool) => pool.browseSectionId === section.id),
    }))
    .filter((section) => section.pools.length > 0);
  const progressLabel = (pool: CategoryChallengePool) =>
    copy.cycleProgress(pool.cycle, pool.clearedInCycle, pool.items.length);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          key="category-hub"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="candy-sheet-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={copy.explore}
          tabIndex={-1}
          onClick={onClose}
        >
          <motion.div className="candy-sheet-backdrop" aria-hidden />
          <motion.div
            variants={MOTION_SHEET_PANEL}
            className="candy-sheet-panel candy-category-hub-panel will-change-transform"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="candy-sheet-handle" aria-hidden />
            <div className="candy-sheet-header">
              <motion.button
                type="button"
                onClick={onBackToModes}
                className="candy-sheet-close"
                aria-label={copy.backToModes}
                whileTap={MOTION_PRESS_TAP}
              >
                <ArrowLeft size={17} strokeWidth={2.75} aria-hidden />
              </motion.button>
              <div className="min-w-0 flex-1 text-center">
                <h2 className="candy-sheet-title">
                  {copy.title}
                </h2>
                <p className="mt-1 text-[11px] font-bold text-sky-800/65">
                  {copy.subtitle}
                </p>
              </div>
              <motion.button
                type="button"
                onClick={onClose}
                className="candy-sheet-close"
                aria-label={t.common.close}
                whileTap={MOTION_PRESS_TAP}
              >
                <X size={16} strokeWidth={2.75} aria-hidden />
              </motion.button>
            </div>

            <div className="candy-sheet-body candy-category-hub-body no-scrollbar">
              {selectedPool && (
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={() => onSelectCategory(selectedPool.id)}
                  className="candy-category-continue-card"
                >
                  <span className="candy-category-continue-icon" aria-hidden>
                    {selectedPool.emoji}
                  </span>
                  <span className="min-w-0 flex-1 text-left">
                    <small>
                      {selectedPoolIsFresh ? copy.recommended : copy.continueExploring}
                    </small>
                    <strong>{selectedPool.label}</strong>
                    <span>{progressLabel(selectedPool)}</span>
                  </span>
                  <span className="candy-category-continue-play" aria-hidden>
                    <Play size={16} fill="currentColor" />
                  </span>
                </motion.button>
              )}

              <div className="mt-4 space-y-4">
                {groupedPools.map((section) => (
                  <section key={section.id} className="candy-learning-category-section">
                    <h3 className="candy-learning-category-section-title">{section.label}</h3>
                    <motion.div
                      className="candy-learning-category-grid"
                      variants={MOTION_STAGGER_TIGHT_CONTAINER}
                      initial="hidden"
                      animate="visible"
                    >
                      {section.pools.map((pool) => {
                        const selected = pool.id === selectedCategoryId;
                        return (
                          <motion.button
                            key={pool.id}
                            type="button"
                            variants={MOTION_STAGGER_TIGHT_ITEM}
                            whileTap={MOTION_PRESS_TAP}
                            onClick={() => onSelectCategory(pool.id)}
                            className={cn(
                              'candy-learning-category-card candy-category-hub-card',
                              selected && 'candy-learning-category-card-active',
                            )}
                            aria-label={`${pool.label}, ${progressLabel(pool)}`}
                          >
                            <span className="candy-learning-category-icon" aria-hidden>
                              {pool.emoji}
                            </span>
                            <span className="min-w-0 text-left">
                              <strong>{pool.label}</strong>
                              <em>{pool.description}</em>
                              <small>{progressLabel(pool)}</small>
                            </span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </section>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
