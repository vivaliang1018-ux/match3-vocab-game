import type { WordItem } from '../types/game';

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

export function nextMoodPalette(id: MoodPaletteId): MoodPaletteId {
  const current = MOOD_PALETTES.findIndex((palette) => palette.id === id);
  return MOOD_PALETTES[(current + 1 + MOOD_PALETTES.length) % MOOD_PALETTES.length]!.id;
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
