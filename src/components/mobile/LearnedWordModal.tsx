import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IOS_EASE, MOTION_PRESS_TAP } from '../../lib/motionPresets';
import {
  MOTION_MODAL_CARD,
  MOTION_VIGNETTE,
} from '../../lib/motionChoreography';
import { Volume2, X } from 'lucide-react';
import { useI18n } from '../../i18n';
import { speakWordQuick, stopAllWordSpeech } from '../../lib/wordSpeech';
import type { WordItem } from '../../types/game';

type LearnedWordModalProps = {
  item: WordItem | null;
  open: boolean;
  showChinese: boolean;
  onClose: () => void;
};

export function LearnedWordModal({ item, open, showChinese, onClose }: LearnedWordModalProps) {
  const { t } = useI18n();

  useEffect(() => {
    if (!open) stopAllWordSpeech();
  }, [open]);

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
            variants={MOTION_MODAL_CARD}
            className="learned-word-modal relative w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              type="button"
              onClick={onClose}
              className="learned-word-modal-close"
              aria-label={t.common.close}
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 11 }}
              exit={{ scale: 0.8, rotate: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 480, damping: 22, delay: 0.12 }}
              whileTap={MOTION_PRESS_TAP}
            >
              <X size={16} strokeWidth={2.75} aria-hidden />
            </motion.button>

            <motion.div
              className="learned-word-modal-emoji-wrap"
              initial={{ scale: 0.5, y: 20, opacity: 0 }}
              animate={{ scale: [0.5, 1.12, 0.96, 1], y: [20, -6, 2, 0], opacity: 1 }}
              transition={{ delay: 0.08, duration: 0.48, times: [0, 0.5, 0.78, 1], ease: IOS_EASE }}
            >
              {item.imgSrc ? (
                <img src={item.imgSrc} alt="" className="h-20 w-20 object-contain" />
              ) : (
                <span className="text-6xl leading-none">{item.emoji ?? '·'}</span>
              )}
            </motion.div>

            <motion.h3
              className="learned-word-modal-word"
              initial={{ opacity: 0, y: 14, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.16, type: 'spring', stiffness: 400, damping: 26 }}
            >
              {item.word}
            </motion.h3>
            {showChinese && item.cn && (
              <motion.p
                className="learned-word-modal-cn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, type: 'spring', stiffness: 360, damping: 28 }}
              >
                {item.cn}
              </motion.p>
            )}

            <motion.div
              className="learned-word-modal-play-wrap"
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.28, type: 'spring', stiffness: 420, damping: 24 }}
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
