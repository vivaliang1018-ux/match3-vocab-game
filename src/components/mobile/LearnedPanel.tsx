import { useState } from 'react';
import { motion } from 'motion/react';
import { roundLearnedItemIds } from '../../lib/roundLearned';
import { speakWordQuick } from '../../lib/wordSpeech';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import {
  MOTION_STAGGER_TIGHT_CONTAINER,
  MOTION_STAGGER_TIGHT_ITEM,
} from '../../lib/motionChoreography';
import { useI18n } from '../../i18n';
import type { WordItem } from '../../types/game';
import { EmojiClearStatsBlock } from './EmojiClearStatsBlock';
import { CandyFrostingHeader } from './CandyFrostingHeader';
import { LearnedWordModal } from './LearnedWordModal';

type LearnedPanelProps = {
  learnedAreaRef: React.RefObject<HTMLDivElement | null>;
  roundLearnedIds: string[];
  totalEmojiPool: number;
  itemById: Map<string, WordItem>;
  allPool: WordItem[];
};

export function LearnedPanel({
  learnedAreaRef,
  roundLearnedIds,
  totalEmojiPool,
  itemById,
  allPool,
}: LearnedPanelProps) {
  const { t, showChinese } = useI18n();
  const [selectedItem, setSelectedItem] = useState<WordItem | null>(null);

  const learnedIds = roundLearnedItemIds(roundLearnedIds, allPool);
  const clearedItems = learnedIds
    .map((id) => itemById.get(id))
    .filter((item): item is WordItem => item != null);

  const handleChipClick = (item: WordItem) => {
    setSelectedItem(item);
    speakWordQuick(item.word);
  };

  return (
    <>
      <div className="profile-candy-page pb-6" ref={learnedAreaRef}>
        <div className="profile-candy-board">
          <CandyFrostingHeader title="LEARNED" />

          <div className="profile-candy-body">
            <section>
              <div className="profile-candy-panel">
                <EmojiClearStatsBlock
                  learnedCount={learnedIds.length}
                  totalEmojiPool={totalEmojiPool}
                  variant="learned"
                  theme="candy"
                />
              </div>
            </section>

            {clearedItems.length > 0 && (
              <section className="mt-4">
                <div className="profile-candy-section-label">
                  <span className="text-sm leading-none" aria-hidden>
                    ⭐
                  </span>
                  <span>{t.learned.collectionTitle}</span>
                </div>
                <div className="profile-candy-panel mt-2">
                  <motion.div
                    className="grid grid-cols-4 gap-2 sm:grid-cols-5"
                    variants={MOTION_STAGGER_TIGHT_CONTAINER}
                    initial="hidden"
                    animate="visible"
                  >
                    {clearedItems.map((item) => (
                      <motion.button
                        key={item.id}
                        type="button"
                        variants={MOTION_STAGGER_TIGHT_ITEM}
                        whileTap={MOTION_PRESS_TAP}
                        onClick={() => handleChipClick(item)}
                        className="learned-candy-chip"
                        aria-label={t.learned.openWord(item.word)}
                      >
                        <div className="learned-candy-chip-icon">
                          {item.imgSrc ? (
                            <img src={item.imgSrc} alt="" className="h-8 w-8 object-contain" />
                          ) : (
                            <span className="text-2xl leading-none">{item.emoji ?? '·'}</span>
                          )}
                        </div>
                        <span className="learned-candy-chip-word">{item.word}</span>
                        {showChinese && item.cn && (
                          <span className="learned-candy-chip-cn">{item.cn}</span>
                        )}
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              </section>
            )}
          </div>

          <div className="profile-candy-snow-base" aria-hidden />
        </div>
      </div>

      <LearnedWordModal
        item={selectedItem}
        open={selectedItem != null}
        showChinese={showChinese}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}
