import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, ChevronLeft, ChevronRight, Gift, Search, X } from 'lucide-react';
import {
  EMOJI_NOUN_CATEGORIES,
  type EmojiNounItem,
} from '../../data/emojiNouns';
import { getEmojiLearningTranslation } from '../../data/emojiLocalizedNames';
import { categoryDisplayName, useI18n } from '../../i18n';
import {
  EMOJI_COLLECTION_ALBUMS,
  type EmojiCollectionAlbum,
} from '../../lib/emojiCollectionAlbums';
import { triggerGameHaptic } from '../../lib/gameHaptics';
import { MOTION_PRESS_TAP, MOTION_SPRING_SNAPPY } from '../../lib/motionPresets';
import {
  COLLECTION_BADGES_KEY,
  COLLECTION_SEEN_KEY,
  collectionGameItemId as gameItemId,
  itemCollectionKey,
  loadCollectionSet as loadStoredSet,
  saveCollectionSet as saveStoredSet,
} from '../../lib/emojiCollectionProgress';
import { speakWordQuick } from '../../lib/wordSpeech';
import { cn } from '../../lib/utils';
import { CandyFrostingHeader } from './CandyFrostingHeader';

const ITEMS_PER_PAGE = 12;
const ALL_COLLECTION_ITEMS = EMOJI_NOUN_CATEGORIES.flatMap((category) =>
  category.items.map((item) => ({ categoryId: category.id, item })),
);

type WordsPanelProps = {
  learnedIds: string[];
  progressUserId?: string | null;
  onNewCountChange?: (count: number) => void;
  /** Newly discovered game-item ids to reveal when entering from settlement. */
  focusItemIds?: string[];
};

type CollectionCopy = {
  collection: string;
  dictionary: string;
  overall: string;
  collected: string;
  albumBadges: string;
  newLabel: string;
  complete: string;
  rewardReady: string;
  claimBadge: string;
  badgeClaimed: string;
  locked: string;
  page: (current: number, total: number) => string;
};

const COLLECTION_COPY: Record<import('../../i18n').Locale, CollectionCopy> = {
  en: { collection: 'Collection', dictionary: 'All Emojis', overall: 'Overall collection', collected: 'Collected', albumBadges: 'Album badges', newLabel: 'NEW', complete: 'Complete', rewardReady: 'Collection reward unlocked', claimBadge: 'Claim album badge', badgeClaimed: 'Badge collected', locked: 'Not collected yet', page: (current, total) => `Page ${current} of ${total}` },
  es: { collection: 'Colección', dictionary: 'Todos los Emojis', overall: 'Progreso total', collected: 'Coleccionados', albumBadges: 'Insignias de álbum', newLabel: 'NUEVO', complete: 'Completo', rewardReady: 'Recompensa de colección desbloqueada', claimBadge: 'Recibir insignia del álbum', badgeClaimed: 'Insignia recibida', locked: 'Aún no coleccionado', page: (current, total) => `Página ${current} de ${total}` },
  fr: { collection: 'Collection', dictionary: 'Tous les Emojis', overall: 'Progression globale', collected: 'Collectionnés', albumBadges: 'Badges d’album', newLabel: 'NOUVEAU', complete: 'Terminé', rewardReady: 'Récompense de collection débloquée', claimBadge: 'Récupérer le badge de l’album', badgeClaimed: 'Badge récupéré', locked: 'Pas encore collectionné', page: (current, total) => `Page ${current} sur ${total}` },
  de: { collection: 'Sammlung', dictionary: 'Alle Emojis', overall: 'Gesamtfortschritt', collected: 'Gesammelt', albumBadges: 'Albumabzeichen', newLabel: 'NEU', complete: 'Vollständig', rewardReady: 'Sammlungsbelohnung freigeschaltet', claimBadge: 'Albumabzeichen abholen', badgeClaimed: 'Abzeichen abgeholt', locked: 'Noch nicht gesammelt', page: (current, total) => `Seite ${current} von ${total}` },
  ja: { collection: 'コレクション', dictionary: 'すべての絵文字', overall: '全体の収集状況', collected: '収集済み', albumBadges: 'アルバムバッジ', newLabel: '新着', complete: 'コンプリート', rewardReady: 'コレクション報酬をアンロック', claimBadge: 'アルバムバッジを受け取る', badgeClaimed: 'バッジ受取済み', locked: '未収集', page: (current, total) => `${current} / ${total}ページ` },
  ko: { collection: '컬렉션', dictionary: '모든 이모지', overall: '전체 수집 진행도', collected: '수집함', albumBadges: '앨범 배지', newLabel: '새 항목', complete: '완료', rewardReady: '컬렉션 보상 잠금 해제', claimBadge: '앨범 배지 받기', badgeClaimed: '배지 받음', locked: '아직 수집하지 않음', page: (current, total) => `${current} / ${total}페이지` },
  'zh-CN': { collection: '收藏图鉴', dictionary: '全部 Emoji', overall: '收集总进度', collected: '已收集', albumBadges: '相册徽章', newLabel: '新', complete: '已集齐', rewardReady: '集齐奖励已解锁', claimBadge: '领取相册徽章', badgeClaimed: '徽章已收藏', locked: '尚未收集', page: (current, total) => `${current} / ${total} 页` },
};

const ALBUM_PREVIEW_ITEM_IDS: Record<string, string[]> = {
  'symbols-navigation-device-status': [
    'clockwise-arrows',
    'wireless',
    'vibration-mode',
    'mobile-phone-off',
  ],
};

function categoryPreview(category: { id?: string; items: EmojiNounItem[] }): EmojiNounItem[] {
  const preferredIds = category.id ? ALBUM_PREVIEW_ITEM_IDS[category.id] : undefined;
  if (preferredIds) {
    const preferredItems = preferredIds
      .map((id) => category.items.find((item) => item.id === id))
      .filter((item): item is EmojiNounItem => Boolean(item));
    if (preferredItems.length === preferredIds.length) return preferredItems;
  }
  if (category.items.length <= 4) return category.items;
  const indexes = [0, Math.floor(category.items.length * 0.34), Math.floor(category.items.length * 0.67), category.items.length - 1];
  return indexes.map((index) => category.items[index]);
}

function albumDisplayName(album: EmojiCollectionAlbum, showChinese: boolean): string {
  return showChinese ? album.titleCn : album.title;
}

export function WordsPanel({
  learnedIds,
  progressUserId = null,
  onNewCountChange,
  focusItemIds = [],
}: WordsPanelProps) {
  const { locale, t, showChinese } = useI18n();
  const copy = COLLECTION_COPY[locale];
  const [view, setView] = useState<'collection' | 'dictionary'>('collection');
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(
    EMOJI_NOUN_CATEGORIES[0]?.id ?? null,
  );
  const [selectedAlbum, setSelectedAlbum] = useState<EmojiCollectionAlbum | null>(null);
  const [page, setPage] = useState(0);
  const [seenKeys, setSeenKeys] = useState<Set<string>>(() =>
    loadStoredSet(COLLECTION_SEEN_KEY, progressUserId),
  );
  const [claimedBadges, setClaimedBadges] = useState<Set<string>>(() =>
    loadStoredSet(COLLECTION_BADGES_KEY, progressUserId),
  );

  const learnedSet = useMemo(() => new Set(learnedIds), [learnedIds]);
  const albumRefs = useRef(new Map<string, HTMLButtonElement>());
  const handledFocusKeyRef = useRef('');
  useEffect(() => {
    setSeenKeys(loadStoredSet(COLLECTION_SEEN_KEY, progressUserId));
    setClaimedBadges(loadStoredSet(COLLECTION_BADGES_KEY, progressUserId));
  }, [progressUserId]);

  const newCount = useMemo(
    () => ALL_COLLECTION_ITEMS.reduce(
      (count, { categoryId, item }) => count + (
        learnedSet.has(gameItemId(categoryId, item.id)) &&
        !seenKeys.has(itemCollectionKey(categoryId, item)) ? 1 : 0
      ),
      0,
    ),
    [learnedSet, seenKeys],
  );

  useEffect(() => {
    onNewCountChange?.(newCount);
  }, [newCount, onNewCountChange]);

  const collectedCount = useMemo(
    () => ALL_COLLECTION_ITEMS.reduce(
      (count, { categoryId, item }) => count + (
        learnedSet.has(gameItemId(categoryId, item.id)) ? 1 : 0
      ),
      0,
    ),
    [learnedSet],
  );

  const albumRows = useMemo(() => EMOJI_COLLECTION_ALBUMS.map((album, originalIndex) => {
    const collected = album.items.filter((item) =>
      learnedSet.has(gameItemId(album.parentCategoryId, item.id)),
    ).length;
    const fresh = album.items.filter((item) =>
      learnedSet.has(gameItemId(album.parentCategoryId, item.id)) &&
      !seenKeys.has(itemCollectionKey(album.parentCategoryId, item)),
    ).length;
    return { album, collected, fresh, originalIndex };
  }).sort((a, b) => {
    if ((a.fresh > 0) !== (b.fresh > 0)) return a.fresh > 0 ? -1 : 1;
    if ((a.collected > 0) !== (b.collected > 0)) return a.collected > 0 ? -1 : 1;
    if (a.collected !== b.collected) return b.collected - a.collected;
    return a.originalIndex - b.originalIndex;
  }), [learnedSet, seenKeys]);

  useEffect(() => {
    const focusKey = focusItemIds.join('|');
    if (!focusKey || handledFocusKeyRef.current === focusKey) return;
    const target = EMOJI_COLLECTION_ALBUMS.find((album) =>
      album.items.some((item) =>
        focusItemIds.includes(gameItemId(album.parentCategoryId, item.id)),
      ),
    );
    if (!target) return;
    handledFocusKeyRef.current = focusKey;
    setView('collection');
    window.requestAnimationFrame(() => {
      albumRefs.current.get(target.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [focusItemIds]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return EMOJI_NOUN_CATEGORIES;
    return EMOJI_NOUN_CATEGORIES.map((category) => ({
      ...category,
      items: category.items.filter(
        (item) =>
          item.word.toLowerCase().includes(normalizedQuery) ||
          (getEmojiLearningTranslation(item, locale)?.toLowerCase().includes(normalizedQuery) ?? false) ||
          item.emoji.includes(normalizedQuery),
      ),
    })).filter((category) => category.items.length > 0);
  }, [locale, normalizedQuery]);

  const openAlbum = (album: EmojiCollectionAlbum) => {
    setSelectedAlbum(album);
    setPage(0);
    triggerGameHaptic('tabSelection');
  };

  const closeAlbum = () => {
    setSelectedAlbum(null);
  };

  const openCollectedItem = (item: EmojiNounItem) => {
    if (!selectedAlbum) return;
    const key = itemCollectionKey(selectedAlbum.parentCategoryId, item);
    if (!selectedAlbum.id.startsWith('dictionary-')) {
      setSeenKeys((current) => {
        if (current.has(key)) return current;
        const next = new Set(current).add(key);
        saveStoredSet(COLLECTION_SEEN_KEY, next, progressUserId);
        return next;
      });
    }
    speakWordQuick(item.word);
  };

  const claimBadge = (categoryId: string) => {
    setClaimedBadges((current) => {
      const next = new Set(current).add(categoryId);
      saveStoredSet(COLLECTION_BADGES_KEY, next, progressUserId);
      return next;
    });
    triggerGameHaptic('achievementOpen');
  };

  const pageCount = selectedAlbum
    ? Math.max(1, Math.ceil(selectedAlbum.items.length / ITEMS_PER_PAGE))
    : 1;
  const pageItems = selectedAlbum?.items.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE,
  ) ?? [];
  const selectedIsDictionary = selectedAlbum?.id.startsWith('dictionary-') ?? false;
  const selectedCollected = selectedAlbum
    ? selectedIsDictionary
      ? selectedAlbum.items.length
      : selectedAlbum.items.filter((item) =>
          learnedSet.has(gameItemId(selectedAlbum.parentCategoryId, item.id)),
        ).length
    : 0;
  const selectedComplete = Boolean(selectedAlbum && selectedCollected === selectedAlbum.items.length);

  return (
    <>
      <div className={cn('profile-candy-page pb-6', view === 'collection' && 'collection-page-environment')}>
        <div className="profile-candy-board">
          <CandyFrostingHeader title="EMOJI" />

          <div className="profile-candy-body">
            <div
              className={cn('collection-view-toggle', view === 'dictionary' && 'collection-view-toggle-dictionary')}
              role="tablist"
            >
              <button
                type="button"
                role="tab"
                aria-selected={view === 'collection'}
                className={cn('collection-view-toggle-button', view === 'collection' && 'collection-view-toggle-button-active')}
                onClick={() => setView('collection')}
              >
                {copy.collection}
                {newCount > 0 && <span className="collection-toggle-badge">{newCount > 99 ? '99+' : newCount}</span>}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === 'dictionary'}
                className={cn('collection-view-toggle-button', view === 'dictionary' && 'collection-view-toggle-button-active')}
                onClick={() => setView('dictionary')}
              >
                {copy.dictionary}
              </button>
            </div>

            {view === 'collection' ? (
              <>
                <section className="collection-overall-card">
                  <div className="collection-overall-topline">
                    <div>
                      <div className="collection-overall-eyebrow">{copy.overall}</div>
                    </div>
                    <div className="collection-badge-count">
                      <span aria-hidden>⭐</span>
                      <div><strong>{claimedBadges.size}</strong><small>{copy.albumBadges}</small></div>
                    </div>
                  </div>
                  <div className="collection-progress-track" aria-label={`${collectedCount} / ${ALL_COLLECTION_ITEMS.length}`}>
                    <span className="collection-progress-fill" style={{ width: `${(collectedCount / ALL_COLLECTION_ITEMS.length) * 100}%` }} />
                    <strong className="collection-progress-value">{collectedCount}/{ALL_COLLECTION_ITEMS.length}</strong>
                  </div>
                </section>

                <div className="collection-album-grid">
                  {albumRows.map(({ album, collected: categoryCollected, fresh: categoryNew }) => {
                    const complete = categoryCollected === album.items.length;
                    return (
                      <motion.button
                        key={album.id}
                        ref={(node) => {
                          if (node) albumRefs.current.set(album.id, node);
                          else albumRefs.current.delete(album.id);
                        }}
                        type="button"
                        whileTap={MOTION_PRESS_TAP}
                        className={cn('collection-album-card', complete && 'collection-album-card-complete')}
                        onClick={() => openAlbum(album)}
                      >
                        {categoryNew > 0 && <span className="collection-new-ribbon">{copy.newLabel}</span>}
                        {complete && <span className="collection-complete-star" aria-label={copy.complete}>⭐</span>}
                        <div className="collection-album-emoji-cluster" aria-hidden>
                          {categoryPreview(album).map((item) => <span key={itemCollectionKey(album.parentCategoryId, item)}>{item.emoji}</span>)}
                        </div>
                        <div className="collection-album-title">{albumDisplayName(album, showChinese)}</div>
                        <div className="collection-album-progress" aria-label={`${categoryCollected} / ${album.items.length}`}>
                          <span className="collection-album-progress-fill" style={{ width: `${(categoryCollected / album.items.length) * 100}%` }} />
                          <strong className="collection-album-progress-value">{categoryCollected}/{album.items.length}</strong>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="words-candy-search-plate">
                  <div className="words-candy-search-plate-field">
                    <Search className="words-candy-search-plate-icon" size={20} aria-hidden />
                    <input
                      type="search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={t.words.searchPlaceholder}
                      className="words-candy-search-plate-input"
                      enterKeyHint="search"
                      autoCorrect="off"
                      autoCapitalize="off"
                      spellCheck={false}
                    />
                  </div>
                </div>
                <div className="mt-3 space-y-2.5">
                  {filteredCategories.length === 0 ? (
                    <div className="profile-candy-about py-6"><p className="text-sm font-bold text-amber-900/70">{t.words.noResults}</p></div>
                  ) : filteredCategories.map((category) => {
                    const isOpen = expandedId === category.id || normalizedQuery.length > 0;
                    return (
                      <div key={category.id} className="words-candy-category">
                        <button
                          type="button"
                          className="words-candy-category-header"
                          onClick={() => setExpandedId((current) => current === category.id ? null : category.id)}
                          aria-expanded={isOpen}
                        >
                          <div className="min-w-0">
                            <div className="words-candy-category-title">{categoryDisplayName(category, locale)}</div>
                            <div className="words-candy-category-meta">{t.words.categoryCount(category.subtitle, category.items.length)}</div>
                          </div>
                          <ChevronDown
                            className={cn('words-candy-category-chevron', isOpen && 'words-candy-category-chevron-open')}
                            size={20}
                            aria-hidden
                          />
                        </button>

                        {isOpen && (
                          <ul className="words-candy-category-list">
                            {category.items.map((item) => (
                              <li key={item.id}>
                                <button
                                  type="button"
                                  className="words-candy-row"
                                  onClick={() => speakWordQuick(item.word)}
                                  aria-label={`${item.word}, ${t.learned.playPronunciation}`}
                                >
                                  <span className="words-candy-row-emoji">{item.emoji}</span>
                                  <div className="min-w-0 flex-1">
                                    <div className="words-candy-row-word">{item.word}</div>
                                    {getEmojiLearningTranslation(item, locale) && (
                                      <div className="words-candy-row-cn">
                                        {getEmojiLearningTranslation(item, locale)}
                                      </div>
                                    )}
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className="profile-candy-snow-base" aria-hidden />
        </div>
      </div>

      <AnimatePresence>
        {selectedAlbum && (
          <motion.div
            className="collection-detail-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={albumDisplayName(selectedAlbum, showChinese)}
          >
            <motion.div
              className="collection-detail-sheet"
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 18 }}
              transition={MOTION_SPRING_SNAPPY}
            >
              <button type="button" className="collection-detail-close" onClick={closeAlbum} aria-label="Close"><X size={22} aria-hidden /></button>
              <div className="collection-detail-hero">
                <div className="collection-detail-preview" aria-hidden>{categoryPreview(selectedAlbum).map((item) => item.emoji).join('')}</div>
                <div className="collection-detail-title">{albumDisplayName(selectedAlbum, showChinese)}</div>
                <div className="collection-detail-progress-row"><span>{copy.collected}</span><strong>{selectedCollected}/{selectedAlbum.items.length}</strong></div>
                <div className="collection-progress-track collection-detail-progress"><span style={{ width: `${(selectedCollected / selectedAlbum.items.length) * 100}%` }} /></div>
              </div>

              {selectedComplete && !selectedAlbum.id.startsWith('dictionary-') && (
                <div className="collection-reward-row">
                  <Gift size={18} aria-hidden />
                  <span>{copy.rewardReady}</span>
                  <button type="button" disabled={claimedBadges.has(selectedAlbum.id)} onClick={() => claimBadge(selectedAlbum.id)}>
                    {claimedBadges.has(selectedAlbum.id) ? copy.badgeClaimed : copy.claimBadge}
                  </button>
                </div>
              )}

              <div className="collection-item-grid">
                {pageItems.map((item) => {
                  const collected = selectedIsDictionary || learnedSet.has(gameItemId(selectedAlbum.parentCategoryId, item.id));
                  const isNew = !selectedIsDictionary && collected && !seenKeys.has(itemCollectionKey(selectedAlbum.parentCategoryId, item));
                  return (
                    <motion.button
                      key={itemCollectionKey(selectedAlbum.parentCategoryId, item)}
                      type="button"
                      whileTap={collected ? MOTION_PRESS_TAP : undefined}
                      disabled={!collected}
                      className={cn('collection-item-card', !collected && 'collection-item-card-locked')}
                      onClick={() => collected && openCollectedItem(item)}
                      aria-label={collected ? item.word : copy.locked}
                    >
                      {isNew && <span className="collection-item-new">{copy.newLabel}</span>}
                      <span className={cn('collection-item-emoji', !collected && 'collection-item-emoji-locked')} aria-hidden>{item.emoji}</span>
                      <span className="collection-item-word">{collected ? item.word : '???'}</span>
                      {collected && getEmojiLearningTranslation(item, locale) && (
                        <span className="collection-item-cn">
                          {getEmojiLearningTranslation(item, locale)}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="collection-pagination">
                <button type="button" disabled={page === 0} onClick={() => setPage((current) => Math.max(0, current - 1))} aria-label="Previous page"><ChevronLeft size={22} aria-hidden /></button>
                <span>{copy.page(page + 1, pageCount)}</span>
                <button type="button" disabled={page >= pageCount - 1} onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))} aria-label="Next page"><ChevronRight size={22} aria-hidden /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
