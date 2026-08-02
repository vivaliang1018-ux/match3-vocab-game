import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import { useI18n } from '../../i18n';
import type { CelebrationCard } from '../../i18n/types';
import {
  playQuizWrongSfx,
  speakWordToCompletion,
  stopAllWordSpeech,
} from '../../lib/wordSpeech';
import { triggerGameHaptic } from '../../lib/gameHaptics';
import { pickQuizChoices } from '../../lib/quizDistractors';
import { pickRandom } from '../../lib/pickRandom';
import { cn } from '../../lib/utils';
import type { QuizKind, WordItem } from '../../types/game';
import { SkySparkleBackground } from '../SkySparkleBackground';
import { CelebrationBurst } from './CelebrationBurst';

type Phase = QuizKind;

type RoundQuizSheetProps = {
  open: boolean;
  items: WordItem[];
  /** Broader pool for pick-quiz distractors (outside this round). */
  distractorPool?: WordItem[];
  /** `review` uses reinforce copy instead of “new emoji” celebration. */
  celebrateKind?: 'learned' | 'review';
  /** Single quiz type for this round (randomly chosen by parent). */
  quizKind: QuizKind;
  /** Words gained this round — shown on quiz-complete celebration. */
  congratsGained: number;
  /** Passed the quiz — count as learned / clear. */
  onComplete: () => void;
  /** Confirmed abandon — restart set, do not count as learned. */
  onAbandon: () => void;
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

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
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
  distractorPool,
  celebrateKind = 'learned',
  quizKind,
  congratsGained,
  onComplete,
  onAbandon,
}: RoundQuizSheetInnerProps) {
  const { t, showChinese } = useI18n();
  const pickOrder = useMemo(() => shuffleItems(items), [items]);
  const emojiColumn = useMemo(() => shuffleItems(items), [items]);
  const choicePool = distractorPool && distractorPool.length > 0 ? distractorPool : items;

  const [phase] = useState<Phase>(quizKind);
  const [connectedIds, setConnectedIds] = useState<Set<string>>(() => new Set());
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [poppingPairId, setPoppingPairId] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [pickIndex, setPickIndex] = useState(0);
  const [furthestPickIndex, setFurthestPickIndex] = useState(0);
  const pickChoicesByIndexRef = useRef<WordItem[][]>([]);
  const [pickChoicesList, setPickChoicesList] = useState<WordItem[]>(() => {
    const first = pickQuizChoices(pickOrder[0] ?? items[0], items, choicePool);
    pickChoicesByIndexRef.current = [first];
    return first;
  });
  const [celebrate, setCelebrate] = useState<'done' | null>(null);
  const [celebrateCard, setCelebrateCard] = useState<CelebrationCard | null>(null);
  const [peekCn, setPeekCn] = useState(false);
  const [tryAgainOpen, setTryAgainOpen] = useState(false);
  const [tryAgainLabel, setTryAgainLabel] = useState('');
  const [answerPending, setAnswerPending] = useState(false);
  const [abandonConfirmOpen, setAbandonConfirmOpen] = useState(false);
  const tryAgainTimerRef = useRef<number | null>(null);
  const answerFlowIdRef = useRef(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const openLearnedCelebrate = useCallback(() => {
    const cards =
      celebrateKind === 'review'
        ? t.celebration.reviewCelebrateCards(congratsGained)
        : t.celebration.learnedCelebrateCards(congratsGained);
    setCelebrateCard(pickRandom(cards));
    setCelebrate('done');
  }, [celebrateKind, congratsGained, t]);
  const speechTaskRef = useRef<Promise<boolean> | null>(null);

  /**
   * Start the requested word immediately. A new question or word tap supersedes
   * any older pronunciation so visible quiz content never waits behind a queue.
   */
  const speakNow = useCallback(
    (word: string, options?: { quickStart?: boolean }): Promise<boolean> => {
      stopAllWordSpeech();
      const task = speakWordToCompletion(word, options);
      speechTaskRef.current = task;
      const release = () => {
        if (speechTaskRef.current === task) speechTaskRef.current = null;
      };
      void task.then(release, release);
      return task;
    },
    [],
  );

  const TRY_AGAIN_MS = 1100;

  const dismissTryAgain = useCallback(() => {
    setTryAgainOpen(false);
    setTryAgainLabel('');
    setWrongFlash(false);
    setAnswerPending(false);
    if (phaseRef.current === 'connect') setSelectedWordId(null);
  }, []);

  const showTryAgain = useCallback(
    (label?: string, startSpeech?: (() => Promise<boolean>) | null) => {
      const flowId = ++answerFlowIdRef.current;
      const startedAt = Date.now();
      setWrongFlash(true);
      setTryAgainLabel(label?.trim() ? label : t.quiz.tryAgain);
      setTryAgainOpen(true);
      setAnswerPending(true);
      playQuizWrongSfx();
      if (tryAgainTimerRef.current) window.clearTimeout(tryAgainTimerRef.current);
      void (async () => {
        if (startSpeech) {
          // Let React commit the feedback card before starting audio work.
          await new Promise<void>((resolve) => {
            window.requestAnimationFrame(() => {
              if (answerFlowIdRef.current !== flowId) {
                resolve();
                return;
              }
              void startSpeech().then(
                () => resolve(),
                () => resolve(),
              );
            });
          });
        }
        if (answerFlowIdRef.current !== flowId) return;
        const remaining = Math.max(0, TRY_AGAIN_MS - (Date.now() - startedAt));
        tryAgainTimerRef.current = window.setTimeout(() => {
          if (answerFlowIdRef.current === flowId) dismissTryAgain();
        }, remaining);
      })();
    },
    [dismissTryAgain, t.quiz.tryAgain],
  );

  useLayoutEffect(() => {
    stopAllWordSpeech();
    return () => {
      answerFlowIdRef.current += 1;
      speechTaskRef.current = null;
      stopAllWordSpeech();
      if (tryAgainTimerRef.current) window.clearTimeout(tryAgainTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setPeekCn(false);
  }, [pickIndex, phase]);

  useLayoutEffect(() => {
    if (phase !== 'pick' || pickOrder.length === 0) return;
    while (pickChoicesByIndexRef.current.length <= pickIndex) {
      const idx = pickChoicesByIndexRef.current.length;
      const current = pickOrder[idx];
      if (!current) break;
      pickChoicesByIndexRef.current.push(pickQuizChoices(current, items, choicePool));
    }
    setPickChoicesList(pickChoicesByIndexRef.current[pickIndex] ?? []);
  }, [phase, pickIndex, pickOrder, items, choicePool]);

  useLayoutEffect(() => {
    if (phase !== 'pick' || celebrate) return;
    const current = pickOrder[pickIndex];
    if (!current) return;
    speakNow(current.word);
  }, [phase, pickIndex, pickOrder, celebrate, speakNow]);

  const handleWordClick = (item: WordItem) => {
    if (answerPending || connectedIds.has(item.id)) return;
    triggerGameHaptic('quizWordSelection');
    speakNow(item.word);
    setSelectedWordId(item.id);
  };

  const handleEmojiClick = (itemId: string) => {
    if (answerPending || connectedIds.has(itemId)) return;
    if (!selectedWordId) return;

    if (selectedWordId === itemId) {
      triggerGameHaptic('quizCorrect');
      setPoppingPairId(itemId);
      const nextCount = connectedIds.size + 1;
      const speechTask = speechTaskRef.current;
      const flowId = ++answerFlowIdRef.current;
      setAnswerPending(true);
      void (async () => {
        await Promise.all([
          speechTask?.catch(() => false) ?? Promise.resolve(false),
          wait(460),
        ]);
        if (answerFlowIdRef.current !== flowId) return;
        setConnectedIds((prev) => new Set([...prev, itemId]));
        setSelectedWordId(null);
        setPoppingPairId(null);
        setAnswerPending(false);
        if (nextCount >= items.length) openLearnedCelebrate();
      })();
      return;
    }

    triggerGameHaptic('quizWrong');
    showTryAgain();
  };

  const handlePick = (choice: WordItem) => {
    if (answerPending || pickIndex < furthestPickIndex) return;
    const current = pickOrder[pickIndex];
    if (!current) return;
    if (choice.id !== current.id) {
      triggerGameHaptic('quizWrong');
      showTryAgain(
        choice.word,
        () => speakNow(choice.word, { quickStart: true }),
      );
      return;
    }
    triggerGameHaptic('quizCorrect');
    const speechTask = speechTaskRef.current;
    const flowId = ++answerFlowIdRef.current;
    const nextIndex = pickIndex + 1;
    setAnswerPending(true);
    void (async () => {
      if (speechTask) await speechTask.catch(() => false);
      if (answerFlowIdRef.current !== flowId) return;
      setAnswerPending(false);
      if (nextIndex >= pickOrder.length) {
        openLearnedCelebrate();
        return;
      }
      setPickIndex(nextIndex);
      setFurthestPickIndex(nextIndex);
    })();
  };

  const goToPrevPick = () => {
    if (answerPending || pickIndex <= 0) return;
    dismissTryAgain();
    setPickIndex((i) => i - 1);
  };

  const goToNextPick = () => {
    if (answerPending || pickIndex >= furthestPickIndex) return;
    dismissTryAgain();
    setPickIndex((i) => i + 1);
  };

  const handleCelebrateDone = () => {
    if (celebrate === 'done') {
      setCelebrate(null);
      onComplete();
    }
  };

  const handleExit = () => {
    setAbandonConfirmOpen(true);
  };

  const confirmAbandon = () => {
    answerFlowIdRef.current += 1;
    speechTaskRef.current = null;
    stopAllWordSpeech();
    if (tryAgainTimerRef.current) window.clearTimeout(tryAgainTimerRef.current);
    setCelebrate(null);
    setAbandonConfirmOpen(false);
    onAbandon();
  };

  const currentPick = pickOrder[pickIndex];
  const isPickReview = phase === 'pick' && pickIndex < furthestPickIndex;
  const canGoPrevPick = phase === 'pick' && pickIndex > 0 && !answerPending;
  const canGoNextPick =
    phase === 'pick' && pickIndex < furthestPickIndex && !answerPending;

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
                    {t.quiz.phaseConnectSolo}
                  </>
                ) : (
                  <>
                    <Sparkles size={12} aria-hidden />
                    {t.quiz.phasePickSolo}
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
                const wordPopping = poppingPairId === wordItem.id;
                const emojiPopping = poppingPairId === emojiItem.id;

                return (
                  <motion.div
                    key={`row-${wordItem.id}`}
                    className="grid grid-cols-2 items-stretch gap-2"
                    variants={MOTION_STAGGER_ITEM}
                  >
                    <motion.button
                      type="button"
                      disabled={wordDone || answerPending}
                      onClick={() => handleWordClick(wordItem)}
                      whileTap={wordDone || answerPending ? undefined : MOTION_PRESS_TAP}
                      animate={
                        wordPopping
                          ? {
                              y: [0, -7, 2, 0],
                              scale: [1, 1.08, 0.97, 1],
                              rotate: [0, -2, 2, 0],
                            }
                          : { y: 0, scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
                      className={cn(
                        'candy-quiz-cell candy-quiz-cell-word',
                        wordDone && 'candy-quiz-cell-done',
                        !wordDone && wordActive && 'candy-quiz-cell-active',
                        wrongFlash && wordActive && 'candy-quiz-cell-wrong',
                      )}
                    >
                      <span className="min-w-0 flex-1 break-words text-left leading-snug">
                        {wordItem.word}
                      </span>
                      {wordDone && (
                        <Check size={14} className="ml-1 shrink-0 text-emerald-500" aria-hidden />
                      )}
                    </motion.button>

                    <motion.button
                      type="button"
                      disabled={emojiDone || answerPending}
                      onClick={() => handleEmojiClick(emojiItem.id)}
                      whileTap={emojiDone || answerPending ? undefined : MOTION_PRESS_TAP}
                      animate={
                        emojiPopping
                          ? {
                              y: [0, -9, 2, 0],
                              scale: [1, 1.12, 0.96, 1],
                              rotate: [0, 4, -3, 0],
                            }
                          : { y: 0, scale: 1, rotate: 0 }
                      }
                      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
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
                          disabled={isPickReview || answerPending}
                          onClick={() => handlePick(choice)}
                          whileTap={
                            isPickReview || answerPending ? undefined : MOTION_PRESS_TAP
                          }
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
                      disabled={!canGoPrevPick}
                      onClick={goToPrevPick}
                      className="candy-quiz-nav-btn"
                      whileTap={canGoPrevPick ? MOTION_PRESS_TAP : undefined}
                    >
                      <ChevronLeft size={18} aria-hidden />
                      {t.quiz.prevQuestion}
                    </motion.button>
                    <motion.button
                      type="button"
                      disabled={!canGoNextPick}
                      onClick={goToNextPick}
                      className="candy-quiz-nav-btn"
                      whileTap={canGoNextPick ? MOTION_PRESS_TAP : undefined}
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
        show={celebrate === 'done'}
        title={celebrateCard?.title}
        subtitle={celebrateCard?.subtitle}
        emoji={celebrateKind === 'review' ? '🧠' : '🌈'}
        durationMs={1800}
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
            className="fixed inset-0 z-[145] flex items-center justify-center bg-transparent px-6 pointer-events-none"
            role="status"
            aria-live="assertive"
            aria-label={tryAgainLabel || t.quiz.tryAgain}
          >
            <motion.div variants={MOTION_CARD_POP} className="candy-quiz-try-card">
              <motion.div
                className="candy-quiz-try-title"
                initial={{ scale: 0.6, rotate: -6 }}
                animate={{ scale: [0.6, 1.1, 1], rotate: [-6, 3, 0] }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {tryAgainLabel || t.quiz.tryAgain}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {abandonConfirmOpen && (
          <motion.div
            key="abandon-confirm"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={MOTION_VIGNETTE}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/45 px-6"
            role="alertdialog"
            aria-modal="true"
            aria-label={t.quiz.abandonConfirmTitle}
          >
            <motion.div
              variants={MOTION_CARD_POP}
              className="w-full max-w-sm rounded-[24px] border border-white/90 bg-white px-5 py-6 text-center shadow-xl"
            >
              <div className="text-lg font-black text-sky-950">{t.quiz.abandonConfirmTitle}</div>
              <div className="mt-2 text-sm font-semibold leading-snug text-sky-800/85">
                {t.quiz.abandonConfirmBody}
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={() => setAbandonConfirmOpen(false)}
                  className="candy-sheet-action-btn candy-sheet-action-btn-pink w-full"
                >
                  {t.quiz.abandonConfirmStay}
                </motion.button>
                <motion.button
                  type="button"
                  whileTap={MOTION_PRESS_TAP}
                  onClick={confirmAbandon}
                  className="candy-sheet-action-btn candy-sheet-action-btn-blue w-full"
                >
                  {t.quiz.abandonConfirmLeave}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function RoundQuizSheet({ open, items, quizKind, ...rest }: RoundQuizSheetProps) {
  const quizKey = `${quizKind}:${items.map((it) => it.id).join('|')}`;

  useEffect(() => {
    if (!open) stopAllWordSpeech();
  }, [open]);

  return (
    <AnimatePresence>
      {open && items.length > 0 && (
        <RoundQuizSheetInner key={quizKey} items={items} quizKind={quizKind} {...rest} />
      )}
    </AnimatePresence>
  );
}
