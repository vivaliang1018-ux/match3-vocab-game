import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOTION_PRESS_TAP } from '../../lib/motionPresets';
import {
  MOTION_CARD_POP,
  MOTION_FULLSCREEN_RISE,
  MOTION_STAGGER_CONTAINER,
  MOTION_STAGGER_ITEM,
  MOTION_VIGNETTE,
} from '../../lib/motionChoreography';
import { Check, ChevronLeft, ChevronRight, Eye, Link2, Sparkles, X } from 'lucide-react';
import { SCORE_QUIZ_CORRECT, SCORE_QUIZ_WRONG } from '../../lib/scoring';
import { useI18n } from '../../i18n';
import { playQuizWrongSfx, speakWordToCompletion, stopAllWordSpeech } from '../../lib/wordSpeech';
import { cn } from '../../lib/utils';
import type { WordItem } from '../../types/game';
import { SkySparkleBackground } from '../SkySparkleBackground';
import { CelebrationBurst } from './CelebrationBurst';
import { ScoreHud, type ScorePop } from './ScoreHud';

type Phase = 'connect' | 'pick';

type RoundQuizSheetProps = {
  open: boolean;
  items: WordItem[];
  score: number;
  scorePops: ScorePop[];
  onComplete: () => void;
  onScoreChange?: (delta: number) => void;
};

type RoundQuizSheetInnerProps = Omit<RoundQuizSheetProps, 'open'>;

function shuffleItems<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickChoices(correct: WordItem, pool: WordItem[], count = 4): WordItem[] {
  const others = pool.filter((it) => it.id !== correct.id);
  const shuffled = shuffleItems(others);
  const picks = shuffled.slice(0, Math.min(count - 1, shuffled.length));
  return shuffleItems([correct, ...picks]);
}

function ItemVisual({ item, size = 'md' }: { item: WordItem; size?: 'sm' | 'md' | 'lg' }) {
  const box =
    size === 'lg' ? 'h-14 w-14 text-4xl' : size === 'md' ? 'h-10 w-10 text-2xl' : 'h-8 w-8 text-xl';
  if (item.imgSrc) {
    return (
      <img
        src={item.imgSrc}
        alt={item.word}
        className={cn(box, 'object-contain')}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
      />
    );
  }
  return <span className={cn('grid place-items-center', box)}>{item.emoji ?? '·'}</span>;
}

function RoundQuizSheetInner({
  items,
  score,
  scorePops,
  onComplete,
  onScoreChange,
}: RoundQuizSheetInnerProps) {
  const { t, showChinese } = useI18n();
  const pickOrder = useMemo(() => shuffleItems(items), [items]);
  const emojiColumn = useMemo(() => shuffleItems(items), [items]);

  const [phase, setPhase] = useState<Phase>('connect');
  const [connectedIds, setConnectedIds] = useState<Set<string>>(() => new Set());
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [pickIndex, setPickIndex] = useState(0);
  const [furthestPickIndex, setFurthestPickIndex] = useState(0);
  const pickChoicesByIndexRef = useRef<WordItem[][]>([]);
  const [pickChoicesList, setPickChoicesList] = useState<WordItem[]>(() => {
    const first = pickChoices(pickOrder[0] ?? items[0], items);
    pickChoicesByIndexRef.current = [first];
    return first;
  });
  const [celebrate, setCelebrate] = useState<'connect' | 'pick' | null>(null);
  const [peekCn, setPeekCn] = useState(false);
  const [tryAgainOpen, setTryAgainOpen] = useState(false);
  const [speechBusy, setSpeechBusy] = useState(false);
  const pickSpeakSeqRef = useRef(0);
  const speechBusyRef = useRef(false);
  const speakQueueRef = useRef(Promise.resolve());
  const tryAgainTimerRef = useRef<number | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const speakExclusive = useCallback((word: string): Promise<void> => {
    const task = async () => {
      speechBusyRef.current = true;
      setSpeechBusy(true);
      try {
        await speakWordToCompletion(word);
      } finally {
        speechBusyRef.current = false;
        setSpeechBusy(false);
      }
    };
    speakQueueRef.current = speakQueueRef.current.then(task, task);
    return speakQueueRef.current;
  }, []);

  const TRY_AGAIN_MS = 1100;

  const dismissTryAgain = useCallback(() => {
    setTryAgainOpen(false);
    setWrongFlash(false);
    if (phaseRef.current === 'connect') setSelectedWordId(null);
  }, []);

  const showTryAgain = useCallback(() => {
    setWrongFlash(true);
    onScoreChange?.(SCORE_QUIZ_WRONG);
    setTryAgainOpen(true);
    playQuizWrongSfx();
    if (tryAgainTimerRef.current) window.clearTimeout(tryAgainTimerRef.current);
    tryAgainTimerRef.current = window.setTimeout(() => {
      dismissTryAgain();
    }, TRY_AGAIN_MS);
  }, [onScoreChange, dismissTryAgain]);

  useEffect(() => {
    stopAllWordSpeech();
    return () => {
      stopAllWordSpeech();
      if (tryAgainTimerRef.current) window.clearTimeout(tryAgainTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setPeekCn(false);
  }, [pickIndex, phase]);

  useEffect(() => {
    if (phase !== 'pick' || pickOrder.length === 0) return;
    while (pickChoicesByIndexRef.current.length <= pickIndex) {
      const idx = pickChoicesByIndexRef.current.length;
      const current = pickOrder[idx];
      if (!current) break;
      pickChoicesByIndexRef.current.push(pickChoices(current, items));
    }
    setPickChoicesList(pickChoicesByIndexRef.current[pickIndex] ?? []);
  }, [phase, pickIndex, pickOrder, items]);

  useEffect(() => {
    if (phase !== 'pick' || celebrate) return;
    const current = pickOrder[pickIndex];
    if (!current) return;
    pickSpeakSeqRef.current += 1;
    const seq = pickSpeakSeqRef.current;
    void speakExclusive(current.word).then(() => {
      if (seq !== pickSpeakSeqRef.current) return;
    });
  }, [phase, pickIndex, pickOrder, celebrate, speakExclusive]);

  const handleWordClick = (item: WordItem) => {
    if (speechBusy || connectedIds.has(item.id)) return;
    void speakExclusive(item.word).then(() => {
      if (connectedIds.has(item.id)) return;
      if (!selectedWordId || selectedWordId === item.id) {
        setSelectedWordId(item.id);
        return;
      }
      setSelectedWordId(item.id);
    });
  };

  const handleEmojiClick = (itemId: string) => {
    if (speechBusy || connectedIds.has(itemId)) return;
    if (!selectedWordId) return;

    if (selectedWordId === itemId) {
      setConnectedIds((prev) => new Set([...prev, itemId]));
      setSelectedWordId(null);
      onScoreChange?.(SCORE_QUIZ_CORRECT);
      const nextCount = connectedIds.size + 1;
      if (nextCount >= items.length) {
        window.setTimeout(() => setCelebrate('connect'), 200);
      }
      return;
    }

    showTryAgain();
  };

  const handlePick = (choice: WordItem) => {
    if (speechBusy || pickIndex < furthestPickIndex) return;
    const current = pickOrder[pickIndex];
    if (!current) return;
    if (choice.id !== current.id) {
      showTryAgain();
      return;
    }
    onScoreChange?.(SCORE_QUIZ_CORRECT);
    if (pickIndex + 1 >= pickOrder.length) {
      setCelebrate('pick');
      return;
    }
    const nextIndex = pickIndex + 1;
    setPickIndex(nextIndex);
    setFurthestPickIndex(nextIndex);
  };

  const goToPrevPick = () => {
    if (speechBusy || pickIndex <= 0) return;
    dismissTryAgain();
    setPickIndex((i) => i - 1);
  };

  const goToNextPick = () => {
    if (speechBusy || pickIndex >= furthestPickIndex) return;
    dismissTryAgain();
    setPickIndex((i) => i + 1);
  };

  const handleCelebrateDone = () => {
    if (celebrate === 'connect') {
      setCelebrate(null);
      setPhase('pick');
      return;
    }
    if (celebrate === 'pick') {
      setCelebrate(null);
      onComplete();
    }
  };

  const handleExit = () => {
    stopAllWordSpeech();
    if (tryAgainTimerRef.current) window.clearTimeout(tryAgainTimerRef.current);
    setCelebrate(null);
    onComplete();
  };

  const currentPick = pickOrder[pickIndex];
  const isPickReview = phase === 'pick' && pickIndex < furthestPickIndex;
  const canGoPrevPick = phase === 'pick' && pickIndex > 0;
  const canGoNextPick = phase === 'pick' && pickIndex < furthestPickIndex;

  return (
    <motion.div
      key="round-quiz"
      variants={MOTION_FULLSCREEN_RISE}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="candy-quiz-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={t.quiz.dialogAria}
    >
      <SkySparkleBackground variant="game" />
      <div className="candy-quiz-panel">
        <motion.div
          className="candy-quiz-header"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 380, damping: 28 }}
        >
          <div className="min-w-0 flex-1">
            <div className="candy-quiz-phase-row">
              <span className="candy-quiz-phase-pill candy-quiz-phase-pill-active">
                {phase === 'connect' ? (
                  <>
                    <Link2 size={12} aria-hidden />
                    {t.quiz.phaseConnect}
                  </>
                ) : (
                  <>
                    <Sparkles size={12} aria-hidden />
                    {t.quiz.phasePick}
                  </>
                )}
              </span>
            </div>
            <p className="candy-quiz-hint">
              {phase === 'connect' ? t.quiz.connectHint : t.quiz.pickHint}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <motion.button
              type="button"
              onClick={handleExit}
              className="candy-quiz-exit"
              aria-label={t.quiz.exitAria}
              whileTap={MOTION_PRESS_TAP}
            >
              <X size={14} aria-hidden />
              {t.quiz.exit}
            </motion.button>
            <ScoreHud score={score} pops={scorePops} className="shrink-0" />
          </div>
        </motion.div>

        <div className="candy-quiz-body">
          {phase === 'connect' ? (
            <motion.div
              className="candy-quiz-board no-scrollbar"
              variants={MOTION_STAGGER_CONTAINER}
              initial="hidden"
              animate="visible"
            >
              {items.map((wordItem, rowIndex) => {
                const emojiItem = emojiColumn[rowIndex];
                if (!emojiItem) return null;
                const wordDone = connectedIds.has(wordItem.id);
                const emojiDone = connectedIds.has(emojiItem.id);
                const wordActive = selectedWordId === wordItem.id;

                return (
                  <motion.div
                    key={`row-${wordItem.id}`}
                    className="grid grid-cols-2 items-stretch gap-2"
                    variants={MOTION_STAGGER_ITEM}
                  >
                    <motion.button
                      type="button"
                      disabled={wordDone || speechBusy}
                      onClick={() => handleWordClick(wordItem)}
                      whileTap={wordDone ? undefined : MOTION_PRESS_TAP}
                      className={cn(
                        'candy-quiz-cell candy-quiz-cell-word',
                        wordDone && 'candy-quiz-cell-done',
                        !wordDone && wordActive && 'candy-quiz-cell-active',
                        wrongFlash && wordActive && 'candy-quiz-cell-wrong',
                      )}
                    >
                      <span className="line-clamp-2">{wordItem.word}</span>
                      {wordDone && (
                        <Check size={14} className="ml-1 shrink-0 text-emerald-500" aria-hidden />
                      )}
                    </motion.button>

                    <motion.button
                      type="button"
                      disabled={emojiDone || speechBusy}
                      onClick={() => handleEmojiClick(emojiItem.id)}
                      whileTap={emojiDone ? undefined : MOTION_PRESS_TAP}
                      className={cn(
                        'candy-quiz-cell',
                        emojiDone && 'candy-quiz-cell-done',
                        wrongFlash && selectedWordId && !emojiDone && 'candy-quiz-cell-wrong',
                      )}
                    >
                      <ItemVisual item={emojiItem} size="md" />
                    </motion.button>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="candy-quiz-pick-wrap">
              {currentPick && (
                <div className="candy-quiz-pick-card" key={`pick-${pickIndex}`}>
                  <div className="candy-quiz-pick-progress">
                    {pickIndex + 1} / {pickOrder.length}
                    {isPickReview && (
                      <span className="ml-2 normal-case tracking-normal text-emerald-600">
                        {t.quiz.reviewTag}
                      </span>
                    )}
                  </div>
                  <div className="candy-quiz-pick-word">{currentPick.word}</div>
                  {showChinese && currentPick.cn && (
                    <div className="candy-quiz-pick-peek-slot">
                      {peekCn ? (
                        <div className="candy-quiz-peek-cn">{currentPick.cn}</div>
                      ) : (
                        <motion.button
                          type="button"
                          onClick={() => setPeekCn(true)}
                          className="candy-quiz-peek-btn"
                          aria-label={t.quiz.peekCnAria}
                          whileTap={MOTION_PRESS_TAP}
                        >
                          <Eye size={18} aria-hidden />
                        </motion.button>
                      )}
                    </div>
                  )}
                  <div className="candy-quiz-pick-choices">
                    {pickChoicesList.map((choice) => {
                      const isCorrectChoice = choice.id === currentPick.id;
                      return (
                        <motion.button
                          key={`pick-${choice.id}-${pickIndex}`}
                          type="button"
                          disabled={isPickReview || speechBusy}
                          onClick={() => handlePick(choice)}
                          whileTap={isPickReview ? undefined : MOTION_PRESS_TAP}
                          className={cn(
                            'candy-quiz-pick-choice',
                            isPickReview && isCorrectChoice && 'candy-quiz-pick-choice-correct',
                            isPickReview && !isCorrectChoice && 'opacity-55',
                          )}
                        >
                          <ItemVisual item={choice} size="lg" />
                          {isPickReview && isCorrectChoice && (
                            <Check size={16} className="mt-1 text-emerald-600" aria-hidden />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  <div className="candy-quiz-pick-nav">
                    <motion.button
                      type="button"
                      disabled={!canGoPrevPick || speechBusy}
                      onClick={goToPrevPick}
                      className="candy-quiz-nav-btn"
                      whileTap={canGoPrevPick && !speechBusy ? MOTION_PRESS_TAP : undefined}
                    >
                      <ChevronLeft size={18} aria-hidden />
                      {t.quiz.prevQuestion}
                    </motion.button>
                    <motion.button
                      type="button"
                      disabled={!canGoNextPick || speechBusy}
                      onClick={goToNextPick}
                      className="candy-quiz-nav-btn"
                      whileTap={canGoNextPick && !speechBusy ? MOTION_PRESS_TAP : undefined}
                    >
                      {t.quiz.nextQuestion}
                      <ChevronRight size={18} aria-hidden />
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="candy-quiz-footer">
          <div className="candy-quiz-footer-text">
            <Link2 size={14} aria-hidden />
            {phase === 'connect'
              ? t.quiz.connectProgress(connectedIds.size, items.length)
              : isPickReview
                ? t.quiz.pickReview(pickIndex + 1, furthestPickIndex + 1)
                : t.quiz.pickProgress(furthestPickIndex, pickOrder.length)}
          </div>
        </div>
      </div>

      <CelebrationBurst
        show={celebrate === 'connect'}
        title={t.celebration.quizConnect}
        subtitle={t.celebration.quizConnectNext}
        emoji="🎉"
        onDone={handleCelebrateDone}
      />
      <CelebrationBurst
        show={celebrate === 'pick'}
        title={t.celebration.quizDone}
        subtitle={t.celebration.quizDoneNext}
        emoji="🏆"
        onDone={handleCelebrateDone}
      />

      <AnimatePresence>
        {tryAgainOpen && (
          <motion.div
            key="try-again"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={MOTION_VIGNETTE}
            className="fixed inset-0 z-[145] flex items-center justify-center bg-black/35 px-6 pointer-events-none"
            role="status"
            aria-live="assertive"
            aria-label={t.quiz.tryAgain}
          >
            <motion.div variants={MOTION_CARD_POP} className="candy-quiz-try-card">
              <motion.div
                className="candy-quiz-try-title"
                initial={{ scale: 0.6, rotate: -6 }}
                animate={{ scale: [0.6, 1.1, 1], rotate: [-6, 3, 0] }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {t.quiz.tryAgain}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function RoundQuizSheet({ open, items, ...rest }: RoundQuizSheetProps) {
  const quizKey = items.map((it) => it.id).join('|');

  useEffect(() => {
    if (!open) stopAllWordSpeech();
  }, [open]);

  return (
    <AnimatePresence>
      {open && items.length > 0 && <RoundQuizSheetInner key={quizKey} items={items} {...rest} />}
    </AnimatePresence>
  );
}
