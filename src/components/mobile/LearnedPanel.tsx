import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
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
import type { Locale } from '../../i18n/types';
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
  showFirstVisitGuide?: boolean;
  onFirstVisitGuideComplete?: () => void;
};

const LEARNED_TOUR_COPY: Record<Locale, {
  steps: Array<{ emoji: string; title: string; body: string }>;
  next: string;
  done: string;
  skip: string;
}> = {
  en: { steps: [
    { emoji: '📚', title: 'Your word collection', body: 'Emoji and English words learned in Adventure are saved here.' },
    { emoji: '🛡️', title: 'Memory shields', body: 'A shield shows how strong each memory is. Review makes it stronger.' },
    { emoji: '⏰', title: 'Come back at the right time', body: 'When a shield needs reinforcement, the word appears under Reinforce.' },
  ], next: 'Next', done: 'Got it', skip: 'Skip' },
  'zh-CN': { steps: [
    { emoji: '📚', title: '这里是你的单词收藏', body: '闯关学会的 Emoji 和英文单词都会保存在这里。' },
    { emoji: '🛡️', title: '记忆护盾', body: '护盾代表每个单词的记忆状态，完成复习可以让它变得更牢固。' },
    { emoji: '⏰', title: '在合适的时间回来', body: '护盾需要加固时，单词会出现在「待加固」中。' },
  ], next: '下一步', done: '知道了', skip: '跳过' },
  es: { steps: [
    { emoji: '📚', title: 'Tu colección de palabras', body: 'Los emojis y las palabras en inglés que aprendas en Aventura se guardan aquí.' },
    { emoji: '🛡️', title: 'Escudos de memoria', body: 'El escudo muestra la fuerza de cada recuerdo. Repasar lo refuerza.' },
    { emoji: '⏰', title: 'Vuelve en el momento justo', body: 'Cuando un escudo necesite refuerzo, la palabra aparecerá en Reforzar.' },
  ], next: 'Siguiente', done: 'Entendido', skip: 'Omitir' },
  fr: { steps: [
    { emoji: '📚', title: 'Ta collection de mots', body: 'Les emojis et les mots anglais appris en Aventure sont enregistrés ici.' },
    { emoji: '🛡️', title: 'Boucliers de mémoire', body: 'Le bouclier indique la solidité de chaque souvenir. Réviser le renforce.' },
    { emoji: '⏰', title: 'Reviens au bon moment', body: 'Quand un bouclier faiblit, le mot apparaît dans À renforcer.' },
  ], next: 'Suivant', done: 'Compris', skip: 'Ignorer' },
  de: { steps: [
    { emoji: '📚', title: 'Deine Wortsammlung', body: 'Emojis und englische Wörter aus dem Abenteuer werden hier gespeichert.' },
    { emoji: '🛡️', title: 'Gedächtnisschilde', body: 'Der Schild zeigt, wie fest ein Wort sitzt. Wiederholen stärkt ihn.' },
    { emoji: '⏰', title: 'Komm zur richtigen Zeit zurück', body: 'Wenn ein Schild schwächer wird, erscheint das Wort unter Verstärken.' },
  ], next: 'Weiter', done: 'Verstanden', skip: 'Überspringen' },
  ja: { steps: [
    { emoji: '📚', title: '単語コレクション', body: '冒険で学んだ絵文字と英単語は、ここに保存されます。' },
    { emoji: '🛡️', title: '記憶のシールド', body: 'シールドは記憶の定着度を表します。復習すると強くなります。' },
    { emoji: '⏰', title: 'ちょうどよい時に復習', body: 'シールドが弱くなると、単語が「強化」に表示されます。' },
  ], next: '次へ', done: 'わかりました', skip: 'スキップ' },
  ko: { steps: [
    { emoji: '📚', title: '나의 단어 컬렉션', body: '모험에서 배운 이모지와 영어 단어가 여기에 저장돼요.' },
    { emoji: '🛡️', title: '기억 방패', body: '방패는 단어를 얼마나 잘 기억하는지 보여 줘요. 복습하면 더 단단해져요.' },
    { emoji: '⏰', title: '알맞은 때에 다시 오세요', body: '방패를 강화할 때가 되면 단어가 강화 목록에 나타나요.' },
  ], next: '다음', done: '알겠어요', skip: '건너뛰기' },
};

export function LearnedPanel({
  roundLearnedIds,
  itemById,
  allPool,
  wordMemory,
  canGoReview,
  onGoReview,
  showFirstVisitGuide = false,
  onFirstVisitGuideComplete,
}: LearnedPanelProps) {
  const { locale, t, ui } = useI18n();
  const [selectedItem, setSelectedItem] = useState<WordItem | null>(null);
  const [filter, setFilter] = useState<MemoryFilter>('all');
  const [now, setNow] = useState(Date.now());
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    if (showFirstVisitGuide) setTourStep(0);
  }, [showFirstVisitGuide]);

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

      <AnimatePresence>
        {showFirstVisitGuide && (
          <motion.div
            className="fixed inset-0 z-[180] flex items-center justify-center bg-sky-950/55 px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={LEARNED_TOUR_COPY[locale].steps[tourStep].title}
          >
            <motion.div
              key={tourStep}
              className="w-full max-w-sm rounded-[2rem] border-4 border-white bg-gradient-to-b from-white to-sky-50 px-6 py-6 text-center shadow-2xl"
              initial={{ y: 24, scale: 0.92 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -12, opacity: 0 }}
            >
              <button
                type="button"
                onClick={onFirstVisitGuideComplete}
                className="float-right text-xs font-black text-sky-700/65"
              >
                {LEARNED_TOUR_COPY[locale].skip}
              </button>
              <div className="clear-both text-6xl" aria-hidden>
                {LEARNED_TOUR_COPY[locale].steps[tourStep].emoji}
              </div>
              <h2 className="mt-4 text-xl font-black text-sky-950">
                {LEARNED_TOUR_COPY[locale].steps[tourStep].title}
              </h2>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-sky-800/80">
                {LEARNED_TOUR_COPY[locale].steps[tourStep].body}
              </p>
              <div className="mt-5 flex justify-center gap-1.5" aria-hidden>
                {LEARNED_TOUR_COPY[locale].steps.map((_, index) => (
                  <span
                    key={index}
                    className={cn(
                      'h-2 rounded-full transition-all',
                      index === tourStep ? 'w-6 bg-pink-500' : 'w-2 bg-sky-200',
                    )}
                  />
                ))}
              </div>
              <motion.button
                type="button"
                whileTap={MOTION_PRESS_TAP}
                onClick={() => {
                  if (tourStep < 2) setTourStep((step) => step + 1);
                  else onFirstVisitGuideComplete?.();
                }}
                className="candy-sheet-action-btn candy-sheet-action-btn-pink mt-5 w-full"
              >
                {tourStep < 2
                  ? LEARNED_TOUR_COPY[locale].next
                  : LEARNED_TOUR_COPY[locale].done}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
