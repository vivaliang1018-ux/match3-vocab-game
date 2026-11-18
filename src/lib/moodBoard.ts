import type { WordItem } from '../types/game';
import { claimGuestProgress, clearScopedProgress, readScopedProgress, writeScopedProgress } from './progressScope';

export const MOOD_BOARD_CATEGORY_ID = 'mood-board';

export type MoodPaletteId =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'black'
  | 'white'
  | 'rainbow';

type MoodPalette = {
  id: MoodPaletteId;
  swatch: string;
  emojis: readonly string[];
};

export const MOOD_PALETTES: readonly MoodPalette[] = [
  {
    id: 'red',
    swatch: '🔴',
    emojis: [
      '🍎', '🍓', '🍒', '🌹', '🌺', '❤️', '🧧', '🎈', '🌶️', '🍅',
      '🥩', '🦞', '🦀', '🚗', '🚒', '🧨', '📕', '🧱', '⛽', '🛑',
    ],
  },
  {
    id: 'orange',
    swatch: '🟠',
    emojis: [
      '🍊', '🥕', '🎃', '🧡', '🦊', '🐅', '🐯', '🦁',
      '🐡', '🍂', '🍁', '🥭', '🏀', '🦺', '🪔', '🛶',
    ],
  },
  {
    id: 'yellow',
    swatch: '🟡',
    emojis: [
      '🍋', '🍌', '🌻', '🌟', '💛', '🐥', '🐤', '🐣',
      '🐝', '🍯', '🧀', '🌽', '🔑', '👑', '🚕',
    ],
  },
  {
    id: 'green',
    swatch: '🟢',
    emojis: [
      '🍏', '🥝', '🥦', '🥒', '🥬', '🫑', '🥑', '🌵', '🌲', '🌳',
      '🌴', '🍀', '☘️', '🌿', '🐸', '🐊', '🐢', '🐍', '💚', '♻️',
    ],
  },
  {
    id: 'blue',
    swatch: '🔵',
    emojis: [
      '🫐', '💙', '🐳', '🐋', '🐟', '🐬', '🦋', '🧢',
      '👖', '💎', '🧿', '🌀', '🥶', '📘', '🖊️', '🛜',
    ],
  },
  {
    id: 'purple',
    swatch: '🟣',
    emojis: ['🍇', '🍆', '💜', '☂️', '🔮', '👾', '😈', '👿', '🪻'],
  },
  {
    id: 'pink',
    swatch: '🌸',
    emojis: [
      '🌸', '🌷', '🪷', '🦩', '🐖', '🐷', '🐽', '🎀', '👛',
      '👚', '👙', '🩰', '🍑', '🍥', '🍧', '🧠', '🫁', '🛍️',
    ],
  },
  {
    id: 'brown',
    swatch: '🟤',
    emojis: [
      '🤎', '🐻', '🐵', '🙈', '🙉', '🙊', '🦧', '🦥', '🦫', '🐿️',
      '🦔', '🐗', '🐂', '🐴', '🦌', '🐪', '🦘', '🦉', '🪵', '🥔',
      '🥜', '🌰', '🍞', '🥖', '🥨', '🥐', '🍪', '🍫', '🫘',
    ],
  },
  {
    id: 'black',
    swatch: '⚫',
    emojis: [
      '🖤', '🐈‍⬛', '🦍', '🦨', '🕷️', '🦂', '🪰', '🐜', '🦇', '🐦‍⬛',
      '🎩', '🕶️', '🥷', '🎱', '🛞', '📷', '📹', '🖥️', '💣', '🕳️',
    ],
  },
  {
    id: 'white',
    swatch: '⚪',
    emojis: [
      '🥚', '🥛', '🧄', '🐑', '🐐', '🐇', '🐁', '🦢', '🕊️', '🐻‍❄️',
      '☁️', '❄️', '👻', '💀', '🦷', '🦴', '🧂', '🍚', '🍙', '🍥',
      '📄', '🧻',
    ],
  },
  {
    id: 'rainbow',
    swatch: '🌈',
    emojis: [
      '🌈', '🎨', '🎡', '🎠', '🎪', '🎭', '🎉', '🎊', '🦚', '🦜',
      '🦋', '💐', '🪅', '🎁', '🧩', '🛍️', '🍭', '🍬', '🥗', '🎟️',
    ],
  },
] as const;

const DAILY_PALETTE_WEIGHT: Record<MoodPaletteId, number> = {
  red: 1,
  orange: 3,
  yellow: 3,
  green: 3,
  blue: 3,
  purple: 3,
  pink: 3,
  brown: 3,
  black: 3,
  white: 3,
  rainbow: 3,
};

export function moodPaletteForDay(now = new Date()): MoodPaletteId {
  const key = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-');
  let hash = 2166136261;
  for (let i = 0; i < key.length; i++) {
    hash ^= key.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const totalWeight = MOOD_PALETTES.reduce(
    (total, palette) => total + DAILY_PALETTE_WEIGHT[palette.id],
    0,
  );
  let weightedIndex = (hash >>> 0) % totalWeight;
  for (const palette of MOOD_PALETTES) {
    weightedIndex -= DAILY_PALETTE_WEIGHT[palette.id];
    if (weightedIndex < 0) return palette.id;
  }
  return 'rainbow';
}

export function moodPaletteSwatch(id: MoodPaletteId): string {
  return MOOD_PALETTES.find((palette) => palette.id === id)?.swatch ?? '🌈';
}

export function moodBoardItems(
  allItems: readonly WordItem[],
  paletteId: MoodPaletteId,
): WordItem[] {
  const palette = MOOD_PALETTES.find((entry) => entry.id === paletteId);
  if (!palette) return [];
  const allowed = new Set(palette.emojis);
  return allItems.filter((item) => Boolean(item.emoji) && allowed.has(item.emoji!));
}

const MOOD_DAILY_STORAGE_KEY = 'matchingo-mood-daily-v2';

export const MOOD_DAILY_FREE_PLAY_MAX = 1;
export const MOOD_DAILY_PREMIUM_PLAY_MAX = 3;

export type MoodPlayOptions = {
  hasPremiumAccess?: boolean;
  userId?: string | null;
  now?: number;
};

export type MoodDailyState = {
  dayKey: string;
  plays: number;
};

function moodDayKeyFrom(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function loadMoodDailyState(options: MoodPlayOptions = {}): MoodDailyState {
  const { userId = null, now = Date.now() } = options;
  const today = moodDayKeyFrom(now);
  try {
    claimGuestProgress(MOOD_DAILY_STORAGE_KEY, userId, (accountRaw, guestRaw) => {
      const account = JSON.parse(accountRaw) as MoodDailyState;
      const guest = JSON.parse(guestRaw) as MoodDailyState;
      if (account.dayKey !== today) return guestRaw;
      if (guest.dayKey !== today) return accountRaw;
      return JSON.stringify({ dayKey: today, plays: Math.max(account.plays, guest.plays) });
    });
    const raw = readScopedProgress(MOOD_DAILY_STORAGE_KEY, userId);
    if (!raw) return { dayKey: today, plays: 0 };
    const parsed = JSON.parse(raw) as Partial<MoodDailyState>;
    if (typeof parsed.dayKey !== 'string' || parsed.dayKey !== today) {
      return { dayKey: today, plays: 0 };
    }
    const plays =
      typeof parsed.plays === 'number' && Number.isFinite(parsed.plays)
        ? Math.max(0, Math.floor(parsed.plays))
        : 0;
    return { dayKey: today, plays };
  } catch {
    return { dayKey: today, plays: 0 };
  }
}

export function saveMoodDailyState(state: MoodDailyState, userId: string | null): void {
  try {
    writeScopedProgress(MOOD_DAILY_STORAGE_KEY, JSON.stringify(state), userId);
  } catch {
    // ignore quota
  }
}

export function clearMoodDailyState(userId: string): void {
  clearScopedProgress(MOOD_DAILY_STORAGE_KEY, userId);
}

export function moodPlaysRemainingToday(options: MoodPlayOptions = {}): number {
  const state = loadMoodDailyState(options);
  const limit = options.hasPremiumAccess
    ? MOOD_DAILY_PREMIUM_PLAY_MAX
    : MOOD_DAILY_FREE_PLAY_MAX;
  return Math.max(0, limit - state.plays);
}

export function canPlayMoodToday(options: MoodPlayOptions = {}): boolean {
  return moodPlaysRemainingToday(options) > 0;
}

/** Spend one daily mood play. Returns false when the daily limit is already reached. */
export function tryConsumeMoodPlay(options: MoodPlayOptions = {}): boolean {
  const state = loadMoodDailyState(options);
  const limit = options.hasPremiumAccess
    ? MOOD_DAILY_PREMIUM_PLAY_MAX
    : MOOD_DAILY_FREE_PLAY_MAX;
  if (state.plays >= limit) return false;
  saveMoodDailyState({ dayKey: state.dayKey, plays: state.plays + 1 }, options.userId ?? null);
  return true;
}
