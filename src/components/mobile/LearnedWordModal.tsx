import { AnimatePresence, motion } from 'motion/react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import {
  MOTION_CARD_POP,
  MOTION_VIGNETTE,
} from '../../lib/motionChoreography';
import { Volume2, X } from 'lucide-react';
import { formatCountdownLocalized, useI18n } from '../../i18n';
import { getEmojiLearningTranslation } from '../../data/emojiLocalizedNames';
import { speakWordQuick } from '../../lib/wordSpeech';
import type { WordItem } from '../../types/game';
import { isDue, type WordMemory } from '../../lib/ebbinghausMemory';

type LearnedWordModalProps = {
  item: WordItem | null;
  memory?: WordMemory;
  now?: number;
  open: boolean;
  onClose: () => void;
};

export function LearnedWordModal({
  item,
  memory,
  now = Date.now(),
  open,
  onClose,
}: LearnedWordModalProps) {
  const { locale, t, ui } = useI18n();
  const nativeTranslation = item ? getEmojiLearningTranslation(item, locale) : null;

  const handlePlay = () => {
    if (!item) return;
    speakWordQuick(item.word);
  };

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          key="learned-word-modal"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={MOTION_VIGNETTE}
          className="fixed inset-0 z-[120] flex items-center justify-center px-5"
          role="dialog"
          aria-modal="true"
          aria-label={t.learned.wordDialogAria}
          onClick={onClose}
        >
          <motion.div className="absolute inset-0 bg-black/45" aria-hidden />
          <motion.div
            variants={MOTION_CARD_POP}
            className="learned-word-modal relative w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              type="button"
              onClick={onClose}
              className="learned-word-modal-close"
              aria-label={t.common.close}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 480, damping: 24, delay: 0.1 }}
              whileTap={MOTION_PRESS_TAP}
            >
              <X size={16} strokeWidth={2.75} aria-hidden />
            </motion.button>

            <motion.div
              className="learned-word-modal-emoji-wrap"
              initial={{ scale: 0.72, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 440, damping: 22, delay: 0.06 }}
            >
              {item.imgSrc ? (
                <img src={item.imgSrc} alt="" className="h-20 w-20 object-contain" />
              ) : (
                <span className="text-6xl leading-none">{item.emoji ?? '·'}</span>
              )}
            </motion.div>

            <motion.h3
              className="learned-word-modal-word"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 400, damping: 28 }}
            >
              {item.word}
            </motion.h3>
            {nativeTranslation && (
              <motion.p
                className="learned-word-modal-cn"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16, type: 'spring', stiffness: 380, damping: 28 }}
              >
                {nativeTranslation}
              </motion.p>
            )}

            <div className="mt-3 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-black text-sky-700">
              {!memory || isDue(memory, now)
                ? ui.learned.shieldReady
                : memory.stage >= 5
                  ? ui.learned.fortified
                  : ui.learned.growingWithCountdown(
                      formatCountdownLocalized(memory.nextReviewAt - now, t.review.countdown),
                    )}
            </div>

            <motion.div
              className="learned-word-modal-play-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 26 }}
            >
              <motion.button
                type="button"
                onClick={handlePlay}
                className="learned-word-modal-play"
                whileTap={MOTION_PRESS_TAP}
              >
                <Volume2 size={14} strokeWidth={2.5} aria-hidden />
                <span>{t.learned.playPronunciation}</span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
