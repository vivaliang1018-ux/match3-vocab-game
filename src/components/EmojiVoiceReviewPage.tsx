import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EMOJI_NOUN_CATEGORIES } from '../data/emojiNouns';
import { EMOJI_VOICE_REGENERATE_QUEUE } from '../data/emojiVoiceReviewQueue';
import { assetUrl } from '../lib/assetUrl';

type ReviewStatus = 'pending' | 'ok' | 'wrong';

type ReviewItem = {
  id: string;
  emoji: string;
  word: string;
  cn: string;
  categoryId: string;
  categoryLabel: string;
  categorySubtitle: string;
};

const STORAGE_KEY = 'emoji-voice-review-v1';
const SETTINGS_KEY = 'emoji-voice-review-settings-v1';
const ACTIVE_KEY = 'emoji-voice-review-active-v1';

function voiceUrl(word: string): string {
  return `${assetUrl('emoji-voice')}/${encodeURIComponent(word)}.mp3`;
}

function loadStatuses(): Record<string, ReviewStatus> {
  let parsed: Record<string, ReviewStatus> = {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const value = JSON.parse(raw) as Record<string, ReviewStatus>;
      if (value && typeof value === 'object') parsed = value;
    }
  } catch {
    parsed = {};
  }
  for (const item of EMOJI_VOICE_REGENERATE_QUEUE) {
    if (parsed[item.id] !== 'ok') parsed[item.id] = 'wrong';
  }
  return parsed;
}

function loadSettings(): { autoPlay: boolean; autoAdvance: boolean } {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { autoPlay: true, autoAdvance: true };
    const parsed = JSON.parse(raw) as { autoPlay?: boolean; autoAdvance?: boolean };
    return {
      autoPlay: parsed.autoPlay !== false,
      autoAdvance: parsed.autoAdvance !== false,
    };
  } catch {
    return { autoPlay: true, autoAdvance: true };
  }
}

function loadActiveId(fallback: string): string {
  try {
    return localStorage.getItem(ACTIVE_KEY) || fallback;
  } catch {
    return fallback;
  }
}

const ALL_ITEMS: ReviewItem[] = EMOJI_NOUN_CATEGORIES.flatMap((category) =>
  category.items.map((item) => ({
    id: item.id,
    emoji: item.emoji,
    word: item.word,
    cn: item.cn,
    categoryId: category.id,
    categoryLabel: category.label,
    categorySubtitle: category.subtitle,
  })),
);

export function EmojiVoiceReviewPage() {
  const [statuses, setStatuses] = useState<Record<string, ReviewStatus>>(loadStatuses);
  const [query, setQuery] = useState('');
  const [categoryId, setCategoryId] = useState('all');
  const [activeId, setActiveId] = useState(() => loadActiveId(ALL_ITEMS[0]?.id ?? ''));
  const [autoPlay, setAutoPlay] = useState(() => loadSettings().autoPlay);
  const [autoAdvance, setAutoAdvance] = useState(() => loadSettings().autoAdvance);
  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [missingAudio, setMissingAudio] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const playGen = useRef(0);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_ITEMS.filter((item) => {
      if (categoryId !== 'all' && item.categoryId !== categoryId) return false;
      if (!q) return true;
      return (
        item.word.toLowerCase().includes(q) ||
        item.cn.includes(query.trim()) ||
        item.emoji.includes(query.trim()) ||
        item.id.toLowerCase().includes(q)
      );
    });
  }, [categoryId, query]);

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  );
  const active = items[activeIndex] ?? items[0] ?? null;
  const queuedRegen = active
    ? EMOJI_VOICE_REGENERATE_QUEUE.find((item) => item.id === active.id)
    : null;
  const prevItem = activeIndex > 0 ? items[activeIndex - 1] : null;
  const nextItem = activeIndex >= 0 ? items[activeIndex + 1] ?? null : null;

  const counts = useMemo(() => {
    let pending = 0;
    let ok = 0;
    let wrong = 0;
    for (const item of ALL_ITEMS) {
      const status = statuses[item.id] ?? 'pending';
      if (status === 'ok') ok += 1;
      else if (status === 'wrong') wrong += 1;
      else pending += 1;
    }
    return { pending, ok, wrong, total: ALL_ITEMS.length };
  }, [statuses]);

  const wrongItems = useMemo(
    () => ALL_ITEMS.filter((item) => statuses[item.id] === 'wrong'),
    [statuses],
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
  }, [statuses]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ autoPlay, autoAdvance }));
  }, [autoAdvance, autoPlay]);

  useEffect(() => {
    if (active) localStorage.setItem(ACTIVE_KEY, active.id);
  }, [active]);

  useEffect(() => {
    const node = listRef.current?.querySelector(`[data-id="${active?.id ?? ''}"]`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [active?.id]);

  const stopAudio = useCallback(() => {
    playGen.current += 1;
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    setPlaying(false);
  }, []);

  const playItem = useCallback(async (item: ReviewItem) => {
    const gen = ++playGen.current;
    setMissingAudio(false);
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    audio.pause();
    audio.src = voiceUrl(item.word);
    setPlaying(true);
    try {
      await audio.play();
      if (gen !== playGen.current) return;
      await new Promise<void>((resolve) => {
        const done = () => {
          audio.removeEventListener('ended', done);
          audio.removeEventListener('error', done);
          resolve();
        };
        audio.addEventListener('ended', done, { once: true });
        audio.addEventListener('error', done, { once: true });
      });
    } catch {
      if (gen === playGen.current) {
        setMissingAudio(true);
        setStatuses((prev) =>
          prev[item.id] === 'ok' ? prev : { ...prev, [item.id]: 'wrong' },
        );
      }
    } finally {
      if (gen === playGen.current) setPlaying(false);
    }
  }, []);

  const selectItem = useCallback(
    (item: ReviewItem, shouldPlay = autoPlay) => {
      setActiveId(item.id);
      if (shouldPlay) void playItem(item);
    },
    [autoPlay, playItem],
  );

  const goPrev = useCallback(() => {
    if (prevItem) selectItem(prevItem);
  }, [prevItem, selectItem]);

  const goNext = useCallback(() => {
    if (nextItem) selectItem(nextItem);
  }, [nextItem, selectItem]);

  const mark = useCallback(
    (status: ReviewStatus) => {
      if (!active) return;
      const currentId = active.id;
      setStatuses((prev) => {
        const next = { ...prev };
        if (status === 'pending') delete next[currentId];
        else next[currentId] = status;
        return next;
      });
      if (!autoAdvance || status === 'pending') return;
      const following = items[activeIndex + 1];
      if (following) window.setTimeout(() => selectItem(following), 40);
    },
    [active, activeIndex, autoAdvance, items, selectItem],
  );

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        if (active) void playItem(active);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'j') {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'k') {
        event.preventDefault();
        goPrev();
      } else if (event.key === '1' || event.key.toLowerCase() === 'c') {
        event.preventDefault();
        mark('ok');
      } else if (event.key === '2' || event.key.toLowerCase() === 'x') {
        event.preventDefault();
        mark('wrong');
      } else if (event.key === '0' || event.key.toLowerCase() === 'u') {
        event.preventDefault();
        mark('pending');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, goNext, goPrev, mark, playItem]);

  const exportWrong = useCallback(async () => {
    const payload = wrongItems.map((item) => ({
      id: item.id,
      emoji: item.emoji,
      word: item.word,
      cn: item.cn,
      category: item.categoryLabel,
    }));
    const text = JSON.stringify(payload, null, 2);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);

    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'emoji-voice-wrong.json';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [wrongItems]);

  const resetAll = useCallback(() => {
    if (!window.confirm('清空所有已标记的正确/不正确？进度会从零开始。')) return;
    stopAudio();
    const seeded: Record<string, ReviewStatus> = {};
    for (const item of EMOJI_VOICE_REGENERATE_QUEUE) seeded[item.id] = 'wrong';
    setStatuses(seeded);
  }, [stopAudio]);

  return (
    <div className="h-full overflow-hidden bg-slate-50 text-slate-900">
      <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col gap-4 px-4 py-5">
        <header className="shrink-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Emoji 英语读音核对</h1>
              <p className="mt-1 text-sm text-slate-500">
                按完整顺序听。上一条 / 下一条不区分有没有听过。
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Stat label="未标" value={counts.pending} tone="slate" />
              <Stat label="正确" value={counts.ok} tone="emerald" />
              <Stat label="待修" value={counts.wrong} tone="rose" />
              <Stat label="全部" value={counts.total} tone="sky" />
            </div>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-3">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索 emoji / 英文 / 中文"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-sky-400"
            />
            <select
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm"
            >
              <option value="all">全部分类</option>
              {EMOJI_NOUN_CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label} · {category.subtitle}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-3 px-1 text-sm">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(event) => setAutoPlay(event.target.checked)}
                />
                选中即播
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={(event) => setAutoAdvance(event.target.checked)}
                />
                标记后下一条
              </label>
            </div>
          </div>
        </header>

        {active ? (
          <section className="shrink-0 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={!prevItem}
                className="min-w-28 rounded-2xl bg-slate-900 px-5 py-4 text-lg font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                ← 上一条
              </button>
              <div className="text-center text-sm text-slate-400">
                {activeIndex + 1} / {items.length}
              </div>
              <button
                type="button"
                onClick={goNext}
                disabled={!nextItem}
                className="min-w-28 rounded-2xl bg-slate-900 px-5 py-4 text-lg font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                下一条 →
              </button>
            </div>

            <div className="mt-5 text-xs font-medium tracking-wide text-slate-400 uppercase">
              {active.categoryLabel} · {active.categorySubtitle}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-5">
              <div className="text-7xl leading-none">{active.emoji}</div>
              <div className="min-w-0 flex-1">
                <div className="text-3xl font-semibold tracking-tight">{active.word}</div>
                <div className="mt-1 flex items-center gap-2 text-lg text-slate-500">
                  <span>{active.cn}</span>
                  <StatusPill status={statuses[active.id] ?? 'pending'} />
                </div>
                {prevItem ? (
                  <div className="mt-2 text-sm text-slate-400">上一条：{prevItem.emoji} {prevItem.word}</div>
                ) : null}
                {queuedRegen ? (
                  <div className="mt-2 text-sm text-rose-600">
                    已记入不正确。生成时会重新录音并绑定为「{queuedRegen.bindAs}」。
                  </div>
                ) : missingAudio ? (
                  <div className="mt-2 text-sm text-rose-600">
                    没有找到对应 MP3，或播放失败。已记入不正确，生成时会按「{active.word}.mp3」重新绑定。
                  </div>
                ) : null}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void playItem(active)}
                className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
              >
                {playing ? '播放中…' : '播放现有读音'}
              </button>
              <button
                type="button"
                onClick={() => mark('ok')}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                正确 (1 / C)
              </button>
              <button
                type="button"
                onClick={() => mark('wrong')}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
              >
                不正确 (2 / X)
              </button>
              <button
                type="button"
                onClick={() => mark('pending')}
                className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
              >
                清除标记
              </button>
              <button
                type="button"
                onClick={exportWrong}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
              >
                {copied ? '已复制不正确列表' : `复制并下载不正确 (${wrongItems.length})`}
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                清空进度
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              快捷键：← / ↑ / K 上一条 · → / ↓ / J 下一条 · 空格播放 · 1/C 正确 · 2/X 不正确
            </p>
          </section>
        ) : (
          <section className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow-sm ring-1 ring-slate-200">
            当前没有条目。
          </section>
        )}

        <section
          ref={listRef}
          className="emoji-voice-review-list min-h-0 flex-1 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
        >
          {items.map((item, index) => {
            const status = statuses[item.id] ?? 'pending';
            const isActive = item.id === active?.id;
            return (
              <button
                key={item.id}
                type="button"
                data-id={item.id}
                onClick={() => selectItem(item)}
                className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-left hover:bg-slate-50 ${
                  isActive ? 'bg-sky-50' : ''
                }`}
              >
                <span className="w-8 shrink-0 text-right font-mono text-xs text-slate-400">
                  {index + 1}
                </span>
                <span className="w-10 shrink-0 text-2xl leading-none">{item.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{item.word}</span>
                  <span className="block truncate text-xs text-slate-500">{item.cn}</span>
                </span>
                <StatusPill status={status} />
              </button>
            );
          })}
        </section>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: 'slate' | 'emerald' | 'rose' | 'sky';
}) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-rose-50 text-rose-700',
    sky: 'bg-sky-50 text-sky-700',
  };
  return (
    <div className={`rounded-xl px-3 py-2 ${tones[tone]}`}>
      <div className="text-[11px] tracking-wide uppercase">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: ReviewStatus }) {
  if (status === 'ok') {
    return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">正确</span>;
  }
  if (status === 'wrong') {
    return <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700">不正确</span>;
  }
  return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400">未标</span>;
}
