import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { assetUrl } from '../lib/assetUrl';
import { buildEmojiVoiceUrls } from '../lib/emojiVoiceFileUrl';

type WrongVoiceItem = {
  id: string;
  emoji: string;
  word: string;
  cn: string;
  category: string;
};

type ReviewStatus = 'pending' | 'approved' | 'keep-old' | 'reject';

const STORAGE_KEY = 'emoji-voice-regen-review-v1';
const ACTIVE_KEY = 'emoji-voice-regen-active-v1';

function oldVoiceUrls(word: string): string[] {
  return buildEmojiVoiceUrls('emoji-voice', word);
}

function newVoiceUrls(word: string, cacheBust?: number): string[] {
  return buildEmojiVoiceUrls('emoji-voice-regen', word).map((url) =>
    cacheBust ? `${url}?t=${cacheBust}` : url,
  );
}

function loadStatuses(): Record<string, ReviewStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ReviewStatus>;
  } catch {
    return {};
  }
}

function loadActiveId(fallback: string): string {
  try {
    return localStorage.getItem(ACTIVE_KEY) || fallback;
  } catch {
    return fallback;
  }
}

const REVIEW_PLAYBACK_GAIN = 2.3;

export function EmojiVoiceRegenReviewPage() {
  const [items, setItems] = useState<WrongVoiceItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [statuses, setStatuses] = useState<Record<string, ReviewStatus>>(loadStatuses);
  const [activeId, setActiveId] = useState('');
  const [playing, setPlaying] = useState<'old' | 'new' | null>(null);
  const [busy, setBusy] = useState<'generate' | 'approve' | null>(null);
  const [message, setMessage] = useState('');
  const [newCacheBust, setNewCacheBust] = useState<Record<string, number>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const skipStatusPersistRef = useRef(true);
  const lastPersistedStatusesRef = useRef('');

  const persistStatuses = useCallback((next: Record<string, ReviewStatus>) => {
    const serialized = JSON.stringify(next);
    if (serialized === lastPersistedStatusesRef.current) return;
    lastPersistedStatusesRef.current = serialized;
    localStorage.setItem(STORAGE_KEY, serialized);
    void fetch('/api/emoji-voice-regen/review-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statuses: next }),
    }).catch(() => undefined);
  }, []);

  const getBoostedAudio = useCallback(() => {
    const audio = audioRef.current ?? new Audio();
    audioRef.current = audio;
    try {
      const Ctx =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (Ctx && !gainRef.current) {
        audioCtxRef.current = new Ctx();
        const source = audioCtxRef.current.createMediaElementSource(audio);
        gainRef.current = audioCtxRef.current.createGain();
        gainRef.current.gain.value = REVIEW_PLAYBACK_GAIN;
        source.connect(gainRef.current);
        gainRef.current.connect(audioCtxRef.current.destination);
      }
      if (gainRef.current) gainRef.current.gain.value = REVIEW_PLAYBACK_GAIN;
      void audioCtxRef.current?.resume();
    } catch {
      audio.volume = 1;
    }
    return audio;
  }, []);

  useEffect(() => {
    void fetch(`${assetUrl('emoji-voice-regen')}/wrong.json`)
      .then((res) => res.json())
      .then((data: WrongVoiceItem[]) => {
        setItems(data);
        setActiveId((prev) => prev || loadActiveId(data[0]?.id ?? ''));
      })
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    void fetch('/api/emoji-voice-regen/review-status')
      .then((res) => (res.ok ? res.json() : { statuses: {} }))
      .then((data: { statuses?: Record<string, ReviewStatus> }) => {
        const fromFile = data.statuses ?? {};
        const fromLocal = loadStatuses();
        setStatuses((prev) => {
          const merged = { ...fromFile, ...fromLocal, ...prev };
          lastPersistedStatusesRef.current = JSON.stringify(merged);
          return merged;
        });
      })
      .catch(() => undefined)
      .finally(() => {
        skipStatusPersistRef.current = false;
      });
  }, []);

  useEffect(() => {
    if (skipStatusPersistRef.current) return;
    persistStatuses(statuses);
  }, [statuses, persistStatuses]);

  const activeIndex = Math.max(0, items.findIndex((item) => item.id === activeId));
  const active = items[activeIndex] ?? items[0] ?? null;
  const prevItem = activeIndex > 0 ? items[activeIndex - 1] : null;
  const nextItem = activeIndex >= 0 ? items[activeIndex + 1] ?? null : null;

  const counts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let keepOld = 0;
    let reject = 0;
    for (const item of items) {
      const status = statuses[item.id] ?? 'pending';
      if (status === 'approved') approved += 1;
      else if (status === 'keep-old') keepOld += 1;
      else if (status === 'reject') reject += 1;
      else pending += 1;
    }
    return { pending, approved, keepOld, reject, total: items.length };
  }, [items, statuses]);

  useEffect(() => {
    if (active) localStorage.setItem(ACTIVE_KEY, active.id);
  }, [active]);

  useEffect(() => {
    const node = listRef.current?.querySelector(`[data-id="${active?.id ?? ''}"]`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [active?.id]);

  const stopAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
    setPlaying(null);
  }, []);

  const playUrls = useCallback(
    async (kind: 'old' | 'new', urls: string[]) => {
      stopAudio();
      if (!urls.length) {
        setMessage(kind === 'new' ? '新读音还没生成，或播放失败。' : '旧读音播放失败。');
        return;
      }
      const audio = getBoostedAudio();
      setPlaying(kind);
      for (const url of urls) {
        audio.pause();
        audio.src = url;
        try {
          await audio.play();
          await new Promise<void>((resolve) => {
            const done = () => {
              audio.removeEventListener('ended', done);
              audio.removeEventListener('error', done);
              resolve();
            };
            audio.addEventListener('ended', done, { once: true });
            audio.addEventListener('error', done, { once: true });
          });
          setMessage('');
          setPlaying(null);
          return;
        } catch {
          // try next filename variant
        }
      }
      setMessage(kind === 'new' ? '新读音还没生成，或播放失败。' : '旧读音播放失败。');
      setPlaying(null);
    },
    [getBoostedAudio, stopAudio],
  );

  const selectItem = useCallback(
    (item: WrongVoiceItem, shouldPlayNew = true) => {
      stopAudio();
      setMessage('');
      setActiveId(item.id);
      if (shouldPlayNew) {
        window.setTimeout(() => {
          void playUrls('new', newVoiceUrls(item.word, newCacheBust[item.id]));
        }, 40);
      }
    },
    [newCacheBust, playUrls, stopAudio],
  );

  const goPrev = useCallback(() => {
    if (prevItem) selectItem(prevItem);
  }, [prevItem, selectItem]);

  const goNext = useCallback(() => {
    if (nextItem) selectItem(nextItem);
  }, [nextItem, selectItem]);

  const regenerate = useCallback(async () => {
    if (!active) return;
    setBusy('generate');
    setMessage('正在生成新读音…');
    try {
      const res = await fetch('/api/emoji-voice-regen/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(active),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; url?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || '生成失败');
      const bust = Date.now();
      setNewCacheBust((prev) => ({ ...prev, [active.id]: bust }));
      setStatuses((prev) => ({ ...prev, [active.id]: 'pending' }));
      setMessage('新读音已生成，请播放试听。');
      await playUrls('new', newVoiceUrls(active.word, bust));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '生成失败');
    } finally {
      setBusy(null);
    }
  }, [active, playUrls]);

  const keepOld = useCallback(() => {
    if (!active) return;
    setStatuses((prev) => ({ ...prev, [active.id]: 'keep-old' }));
    setMessage(`已保留旧读音「${active.word}.mp3」，不会替换。`);
    if (nextItem) window.setTimeout(() => selectItem(nextItem, true), 300);
  }, [active, nextItem, selectItem]);

  const approve = useCallback(async () => {
    if (!active) return;
    setBusy('approve');
    setMessage('正在替换旧文件…');
    try {
      const res = await fetch('/api/emoji-voice-regen/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: active.word }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || '替换失败');
      setStatuses((prev) => ({ ...prev, [active.id]: 'approved' }));
      setMessage(`已替换为「${active.word}.mp3」。`);
      if (nextItem) window.setTimeout(() => selectItem(nextItem, true), 300);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '替换失败');
    } finally {
      setBusy(null);
    }
  }, [active, nextItem, selectItem]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'k') {
        event.preventDefault();
        goPrev();
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === 'j') {
        event.preventDefault();
        goNext();
      } else if (event.key === '1') {
        event.preventDefault();
        if (active) void playUrls('old', oldVoiceUrls(active.word));
      } else if (event.key === '2') {
        event.preventDefault();
        if (active) void playUrls('new', newVoiceUrls(active.word, newCacheBust[active.id]));
      } else if (event.key === '3' || event.key.toLowerCase() === 'a') {
        event.preventDefault();
        void approve();
      } else if (event.key === '5' || event.key.toLowerCase() === 'o') {
        event.preventDefault();
        keepOld();
      } else if (event.key === '4' || event.key.toLowerCase() === 'r') {
        event.preventDefault();
        void regenerate();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, approve, goNext, goPrev, keepOld, newCacheBust, playUrls, regenerate]);

  if (loadingList) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50">加载列表…</div>;
  }

  if (!active) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-50">没有待核对条目。</div>;
  }

  const status = statuses[active.id] ?? 'pending';

  return (
    <div className="h-full overflow-hidden bg-slate-50 text-slate-900">
      <div className="mx-auto flex h-full min-h-0 max-w-6xl flex-col gap-4 px-4 py-5">
        <header className="shrink-0 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold tracking-tight">新读音试听核对</h1>
              <p className="mt-1 text-sm text-slate-500">
                对比旧/新读音。新读音对了就替换；想继续用旧读音就点「保留旧读音」。
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <Stat label="待听" value={counts.pending} tone="slate" />
              <Stat label="已替换" value={counts.approved} tone="emerald" />
              <Stat label="保留旧" value={counts.keepOld} tone="amber" />
              <Stat label="待重生成" value={counts.reject} tone="rose" />
              <Stat label="全部" value={counts.total} tone="sky" />
            </div>
          </div>
        </header>

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
            {active.category}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-5">
            <div className="text-7xl leading-none">{active.emoji}</div>
            <div className="min-w-0 flex-1">
              <div className="text-3xl font-semibold tracking-tight">{active.word}</div>
              <div className="mt-1 flex items-center gap-2 text-lg text-slate-500">
                <span>{active.cn}</span>
                <StatusPill status={status} />
              </div>
              {message ? <div className="mt-2 text-sm text-slate-600">{message}</div> : null}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void playUrls('old', oldVoiceUrls(active.word))}
              className="rounded-xl bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {playing === 'old' ? '播放旧读音中…' : '播放旧读音 (1)'}
            </button>
            <button
              type="button"
              onClick={() =>
                void playUrls('new', newVoiceUrls(active.word, newCacheBust[active.id]))
              }
              className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
            >
              {playing === 'new' ? '播放新读音中…' : '播放新读音 (2)'}
            </button>
            <button
              type="button"
              onClick={() => void approve()}
              disabled={busy !== null}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {busy === 'approve' ? '替换中…' : '新读音正确，替换 (3 / A)'}
            </button>
            <button
              type="button"
              onClick={keepOld}
              disabled={busy !== null}
              className="rounded-xl bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-60"
            >
              保留旧读音 (5 / O)
            </button>
            <button
              type="button"
              onClick={() => void regenerate()}
              disabled={busy !== null}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
            >
              {busy === 'generate' ? '生成中…' : '不正确，再生成 (4 / R)'}
            </button>
            <button
              type="button"
              onClick={() =>
                setStatuses((prev) => {
                  const next = { ...prev };
                  delete next[active.id];
                  return next;
                })
              }
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              清除标记
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            快捷键：←/K 上一条 · →/J 下一条 · 1 旧读音 · 2 新读音 · 3/A 替换 · 5/O 保留旧读音 · 4/R 再生成
          </p>
        </section>

        <section
          ref={listRef}
          className="emoji-voice-review-list min-h-0 flex-1 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
        >
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              data-id={item.id}
              onClick={() => selectItem(item, true)}
              className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-2.5 text-left hover:bg-slate-50 ${
                item.id === active.id ? 'bg-sky-50' : ''
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
              <StatusPill status={statuses[item.id] ?? 'pending'} />
            </button>
          ))}
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
  tone: 'slate' | 'emerald' | 'rose' | 'sky' | 'amber';
}) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-rose-50 text-rose-700',
    sky: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700',
  };
  return (
    <div className={`rounded-xl px-3 py-2 ${tones[tone]}`}>
      <div className="text-[11px] tracking-wide uppercase">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: ReviewStatus }) {
  if (status === 'approved') {
    return <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">已替换</span>;
  }
  if (status === 'keep-old') {
    return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-700">保留旧</span>;
  }
  if (status === 'reject') {
    return <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-700">待重生成</span>;
  }
  return <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-400">待听</span>;
}
