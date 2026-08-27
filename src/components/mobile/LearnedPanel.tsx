import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  compareWordsForSpacedReview,
  isDue,
  memoryKeyForWord,
  type WordMemory,
} from '../../lib/ebbinghausMemory';
import { roundLearnedItemIds } from '../../lib/roundLearned';
import { speakWordQuick } from '../../lib/wordSpeech';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import {
  MOTION_STAGGER_TIGHT_CONTAINER,
  MOTION_STAGGER_TIGHT_ITEM,
} from '../../lib/motionChoreography';
import { formatCountdownLocalized, useI18n } from '../../i18n';
import { getEmojiLearningTranslation } from '../../data/emojiLocalizedNames';
import type { WordItem } from '../../types/game';
import { CandyFrostingHeader } from './CandyFrostingHeader';
import { LearnedWordModal } from './LearnedWordModal';
import { cn } from '../../lib/utils';

type MemoryStatus = 'review' | 'growing' | 'strong';
type MemoryFilter = 'all' | 'review' | 'strong';

type LearnedEntry = {
  item: WordItem;
  memory?: WordMemory;
  status: MemoryStatus;
};

type LearnedPanelProps = {
  roundLearnedIds: string[];
  itemById: Map<string, WordItem>;
  allPool: WordItem[];
  wordMemory: Map<string, WordMemory>;
  /** Enough learned words + unlock to build a six-word review board. */
  canGoReview: boolean;
  onGoReview: () => void;
};

export function LearnedPanel({
  roundLearnedIds,
  itemById,
  allPool,
  wordMemory,
  canGoReview,
  onGoReview,
}: LearnedPanelProps) {
  const { locale, t, ui } = useI18n();
  const [selectedItem, setSelectedItem] = useState<WordItem | null>(null);
  const [filter, setFilter] = useState<MemoryFilter>('all');
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const entries = useMemo<LearnedEntry[]>(() => {
    const learnedIds = roundLearnedItemIds(roundLearnedIds, allPool);
    return learnedIds
      .map((id) => itemById.get(id))
      .filter((item): item is WordItem => item != null)
      .map((item) => {
        const memory = wordMemory.get(memoryKeyForWord(item.word));
        const status: MemoryStatus = !memory || isDue(memory, now)
          ? 'review'
          : memory.stage >= 5
            ? 'strong'
            : 'growing';
        return { item, memory, status };
      })
      .sort((a, b) => compareWordsForSpacedReview(a.memory, b.memory, now));
  }, [allPool, itemById, now, roundLearnedIds, wordMemory]);

  const dueCount = entries.filter((entry) => entry.status === 'review').length;
  const nextReviewAt = entries.reduce<number | null>((earliest, entry) => {
    if (!entry.memory || entry.status === 'review') return earliest;
    return earliest === null
      ? entry.memory.nextReviewAt
      : Math.min(earliest, entry.memory.nextReviewAt);
  }, null);
  const visibleEntries = entries.filter((entry) => {
    if (filter === 'review') return entry.status === 'review';
    if (filter === 'strong') return entry.status === 'strong';
    return true;
  });

  const statusLabel = (entry: LearnedEntry): string => {
    if (entry.status === 'review') return ui.learned.ready;
    if (entry.status === 'strong') return ui.learned.fortified;
    if (!entry.memory) return ui.learned.ready;
    return `${ui.learned.growing} · ${formatCountdownLocalized(entry.memory.nextReviewAt - now, t.review.countdown)}`;
  };

  const handleChipClick = (item: WordItem) => {
    setSelectedItem(item);
    speakWordQuick(item.word);
  };

  const selectedMemory = selectedItem
    ? wordMemory.get(memoryKeyForWord(selectedItem.word))
    : undefined;

  return (
    <>
      <div className="profile-candy-page pb-6">
        <div className="profile-candy-board">
          <CandyFrostingHeader title="LEARNED" />

          <div className="profile-candy-body">
            <section className="profile-candy-panel text-center">
              <div className="text-xs font-black uppercase tracking-wide text-sky-700/70">
                {ui.learned.learnedCount(entries.length)}
              </div>
              {dueCount > 0 ? (
                <>
                  <div className="mt-3 text-xl font-black text-sky-950">
                    🛡️ {ui.learned.shieldsDue(dueCount)}
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-sky-800/70">
                    {ui.learned.dueHint}
                  </p>
                  {canGoReview ? (
                    <motion.button
                      type="button"
                      whileTap={MOTION_PRESS_TAP}
                      onClick={onGoReview}
                      className="candy-sheet-action-btn candy-sheet-action-btn-pink mt-4 w-full"
                    >
                      {dueCount >= 6 ? ui.learned.reviewSix : ui.learned.startReview}
                    </motion.button>
                  ) : (
                    <p className="mt-3 text-[11px] font-semibold text-sky-800/75">
                      {t.modes.insufficientReviewHint}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <div className="mt-3 text-xl font-black text-emerald-700">
                    ✨ {ui.learned.stable}
                  </div>
                  {nextReviewAt !== null && (
                    <p className="mt-1 text-[11px] font-semibold text-sky-800/70">
                      {ui.learned.nextReview(
                        formatCountdownLocalized(nextReviewAt - now, t.review.countdown),
                      )}
                    </p>
                  )}
                </>
              )}
            </section>

            {entries.length > 0 && (
              <section className="mt-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="profile-candy-section-label">
                    <span className="text-sm" aria-hidden>🌱</span>
                    <span>{ui.learned.myWords}</span>
                  </div>
                  <div className="flex rounded-full bg-white/65 p-1 text-[10px] font-black text-sky-800">
                    {(['all', 'review', 'strong'] as const).map((id) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setFilter(id)}
                        className={cn(
                          'rounded-full px-2 py-1',
                          filter === id && 'bg-sky-500 text-white shadow-sm',
                        )}
                      >
                        {id === 'all'
                          ? ui.learned.all
                          : id === 'review'
                            ? ui.learned.reinforce
                            : ui.learned.fortified}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="profile-candy-panel mt-2">
                  <motion.div
                    className="grid grid-cols-2 gap-2"
                    variants={MOTION_STAGGER_TIGHT_CONTAINER}
                    initial="hidden"
                    animate="visible"
                  >
                    {visibleEntries.map((entry) => (
                      <motion.button
                        key={entry.item.id}
                        type="button"
                        variants={MOTION_STAGGER_TIGHT_ITEM}
                        whileTap={MOTION_PRESS_TAP}
                        onClick={() => handleChipClick(entry.item)}
                        className={cn(
                          'learned-candy-chip learned-candy-chip-memory',
                          entry.status === 'review' && 'learned-candy-chip-review',
                          entry.status === 'strong' && 'learned-candy-chip-strong',
                        )}
                        aria-label={t.learned.openWord(entry.item.word)}
                      >
                        <div className="learned-candy-chip-icon">
                          {entry.item.imgSrc ? (
                            <img src={entry.item.imgSrc} alt="" className="h-8 w-8 object-contain" />
                          ) : (
                            <span className="text-2xl leading-none">{entry.item.emoji ?? '·'}</span>
                          )}
                        </div>
                        <span className="learned-candy-chip-word">{entry.item.word}</span>
                        {getEmojiLearningTranslation(entry.item, locale) && (
                          <span className="learned-candy-chip-cn">
                            {getEmojiLearningTranslation(entry.item, locale)}
                          </span>
                        )}
                        <span className={cn('learned-memory-status', `learned-memory-status-${entry.status}`)}>
                          {statusLabel(entry)}
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                  {visibleEntries.length === 0 && (
                    <p className="py-5 text-center text-xs font-bold text-sky-800/65">
                      {ui.learned.empty}
                    </p>
                  )}
                </div>
              </section>
            )}
          </div>

          <div className="profile-candy-snow-base" aria-hidden />
        </div>
      </div>

      <LearnedWordModal
        item={selectedItem}
        memory={selectedMemory}
        now={now}
        open={selectedItem != null}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}
