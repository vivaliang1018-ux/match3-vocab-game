import { useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { EMOJI_NOUN_CATEGORIES } from '../../data/emojiNouns';
import { categoryDisplayName, useI18n } from '../../i18n';
import { speakWordQuick } from '../../lib/wordSpeech';
import { cn } from '../../lib/utils';
import { CandyFrostingHeader } from './CandyFrostingHeader';

type WordsPanelProps = {
  emojiIndexAreaRef: React.RefObject<HTMLDivElement | null>;
};

export function WordsPanel({ emojiIndexAreaRef }: WordsPanelProps) {
  const { locale, t, showChinese } = useI18n();
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(EMOJI_NOUN_CATEGORIES[0]?.id ?? null);

  const normalizedQuery = query.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return EMOJI_NOUN_CATEGORIES;
    return EMOJI_NOUN_CATEGORIES.map((cat) => ({
      ...cat,
      items: cat.items.filter(
        (it) =>
          it.word.toLowerCase().includes(normalizedQuery) ||
          (showChinese && it.cn.toLowerCase().includes(normalizedQuery)) ||
          it.emoji.includes(normalizedQuery),
      ),
    })).filter((cat) => cat.items.length > 0);
  }, [normalizedQuery, showChinese]);

  return (
    <div className="profile-candy-page pb-6">
      <div className="profile-candy-board">
        <CandyFrostingHeader title="EMOJI" />

        <div className="profile-candy-body" ref={emojiIndexAreaRef}>
          <div className="words-candy-search-plate">
            <div className="words-candy-search-plate-field">
              <Search className="words-candy-search-plate-icon" size={20} aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
              <div className="profile-candy-about py-6">
                <p className="text-sm font-bold text-amber-900/70">{t.words.noResults}</p>
              </div>
            ) : (
              filteredCategories.map((cat) => {
                const isOpen = expandedId === cat.id || normalizedQuery.length > 0;
                const displayName = categoryDisplayName(cat, locale);
                return (
                  <div key={cat.id} className="words-candy-category">
                    <button
                      type="button"
                      onClick={() => setExpandedId((prev) => (prev === cat.id ? null : cat.id))}
                      className="words-candy-category-header"
                      aria-expanded={isOpen}
                    >
                      <div className="min-w-0">
                        <div className="words-candy-category-title">{displayName}</div>
                        <div className="words-candy-category-meta">
                          {t.words.categoryCount(cat.subtitle, cat.items.length)}
                        </div>
                      </div>
                      <ChevronDown
                        size={20}
                        className={cn('words-candy-category-chevron', isOpen && 'words-candy-category-chevron-open')}
                        aria-hidden
                      />
                    </button>

                    {isOpen && (
                      <ul className="words-candy-category-list">
                        {cat.items.map((it) => (
                          <li key={it.id}>
                            <button
                              type="button"
                              onClick={() => speakWordQuick(it.word)}
                              className="words-candy-row"
                              aria-label={`${it.word}, ${t.learned.playPronunciation}`}
                            >
                              <span className="words-candy-row-emoji">{it.emoji}</span>
                              <div className="min-w-0 flex-1">
                                <div className="words-candy-row-word">{it.word}</div>
                                {showChinese && <div className="words-candy-row-cn">{it.cn}</div>}
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="profile-candy-snow-base" aria-hidden />
      </div>
    </div>
  );
}
