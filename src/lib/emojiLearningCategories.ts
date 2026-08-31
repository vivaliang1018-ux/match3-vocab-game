import {
  EMOJI_NOUN_CATEGORIES,
  type EmojiNounItem,
} from '../data/emojiNouns';
import { EMOJI_COLLECTION_ALBUMS } from './emojiCollectionAlbums';

export const EMOJI_LEARNING_CATEGORY_IDS = [
  'emotional-expression',
  'my-body',
  'all-kinds-of-people',
  'animal-park',
  'ocean-world',
  'plant-world',
  'food-and-cooking',
  'astronomy-and-geography',
  'weather-report',
  'transport-and-travel',
  'cities-and-buildings',
  'daily-life-and-errands',
  'clothing-and-personal-items',
  'tools-and-home-items',
  'interests-and-hobbies',
  'technology-and-symbols',
  'faith-festivals-and-culture',
] as const;

export type EmojiLearningCategoryId =
  (typeof EMOJI_LEARNING_CATEGORY_IDS)[number];

export const EMOJI_LEARNING_BROWSE_SECTION_IDS = [
  'self-and-others',
  'natural-world',
  'life-and-travel',
  'interests-tech-and-culture',
] as const;

export type EmojiLearningBrowseSectionId =
  (typeof EMOJI_LEARNING_BROWSE_SECTION_IDS)[number];

export type EmojiLearningCategory = {
  id: EmojiLearningCategoryId;
  title: string;
  titleCn: string;
  emoji: string;
  purposeCn: string;
  boundaryCn: string;
};

export type EmojiLearningBrowseSection = {
  id: EmojiLearningBrowseSectionId;
  title: string;
  titleCn: string;
  categoryIds: readonly EmojiLearningCategoryId[];
};

/**
 * The 17 stable, user-facing learning categories. Fine-grained semantic albums
 * remain available as internal metadata; they are not another picker level.
 */
export const EMOJI_LEARNING_CATEGORIES: readonly EmojiLearningCategory[] = [
  {
    id: 'emotional-expression',
    title: 'Emotional Expression',
    titleCn: '情感表达',
    emoji: '😊',
    purposeCn: '认识并表达情绪、态度和互动反应。',
    boundaryCn: '收录笑脸、情绪反应、爱心与对话符号；身体部位和手势保留在“认识我的身体”。',
  },
  {
    id: 'my-body',
    title: 'My Body',
    titleCn: '认识我的身体',
    emoji: '🧠',
    purposeCn: '认识身体部位、手势与身体动作。',
    boundaryCn: '收录现有“身体”词库，包括手部动作、器官和人物姿势。',
  },
  {
    id: 'all-kinds-of-people',
    title: 'All Kinds of People',
    titleCn: '各种各样的人',
    emoji: '🧑‍🎓',
    purposeCn: '认识年龄、职业、生活状态和奇幻人物。',
    boundaryCn: '收录真实人物、职业、无障碍人物及奇幻人物；水上运动人物进入“海洋世界”。',
  },
  {
    id: 'animal-park',
    title: 'Animal Park',
    titleCn: '动物乐园',
    emoji: '🐾',
    purposeCn: '认识陆地动物、鸟类、爬行动物和昆虫。',
    boundaryCn: '收录除海洋生物外的动物；海洋生物进入“海洋世界”。',
  },
  {
    id: 'ocean-world',
    title: 'Ocean World',
    titleCn: '海洋世界',
    emoji: '🌊',
    purposeCn: '认识海洋生物、海岸环境、船只与水上活动。',
    boundaryCn: '收录海洋动物、海滩海岛、水上交通、水上运动及海上安全用品。',
  },
  {
    id: 'plant-world',
    title: 'Plant World',
    titleCn: '植物世界',
    emoji: '🌿',
    purposeCn: '认识花朵、幼苗、树木和叶子。',
    boundaryCn: '收录植物与花卉词库；可食用植物保留在“食物与烹饪”。',
  },
  {
    id: 'food-and-cooking',
    title: 'Food and Cooking',
    titleCn: '食物与烹饪',
    emoji: '🍳',
    purposeCn: '认识食材、料理、饮品、烹饪与用餐用品。',
    boundaryCn: '收录全部食物、饮品、餐具和烹饪相关 Emoji。',
  },
  {
    id: 'astronomy-and-geography',
    title: 'Astronomy and Geography',
    titleCn: '天文与地理',
    emoji: '🌍',
    purposeCn: '认识天体、宇宙、自然地貌与地理景观。',
    boundaryCn: '收录星球、彗星、卫星、火箭、山川、沙漠、火山及日出日落；日常天气进入“天气播报”。',
  },
  {
    id: 'weather-report',
    title: 'Weather Report',
    titleCn: '天气播报',
    emoji: '🌦️',
    purposeCn: '认识云、雨、雪、风、雷电和温度感受。',
    boundaryCn: '收录可用于描述当前天气的 Emoji；天体和自然地貌不在此类。',
  },
  {
    id: 'transport-and-travel',
    title: 'Transport and Travel',
    titleCn: '交通与出行',
    emoji: '🚆',
    purposeCn: '认识公路、铁路、航空与出行安全。',
    boundaryCn: '收录陆路交通、铁路交通、航空工具及道路设施；船只进入“海洋世界”，航天器进入“天文与地理”。',
  },
  {
    id: 'cities-and-buildings',
    title: 'Cities and Buildings',
    titleCn: '城市与建筑',
    emoji: '🏙️',
    purposeCn: '认识房屋、城市公共场所、建筑与城市景观。',
    boundaryCn: '收录城市景观、房屋、施工、公共建筑和娱乐场所；宗教建筑进入文化类。',
  },
  {
    id: 'daily-life-and-errands',
    title: 'Daily Life and Errands',
    titleCn: '日常生活与事务',
    emoji: '📅',
    purposeCn: '认识学习、工作、时间、金钱和日常办事用品。',
    boundaryCn: '收录书写、文件、邮件包裹、时间工具、支付和旅行随身事务；穿戴和维修用品分类存放。',
  },
  {
    id: 'clothing-and-personal-items',
    title: 'Clothing and Personal Items',
    titleCn: '穿搭与个人用品',
    emoji: '👕',
    purposeCn: '认识衣物、鞋帽、包袋、配饰和个人护理用品。',
    boundaryCn: '收录穿戴、配饰、美容及个人护理用品；宗教念珠进入文化类。',
  },
  {
    id: 'tools-and-home-items',
    title: 'Tools and Home Items',
    titleCn: '工具与居家用品',
    emoji: '🔧',
    purposeCn: '认识清洁、维修、照明、供电和居家防护用品。',
    boundaryCn: '收录工具、锁钥匙、清洁用品、电池、插头、灯泡、手电筒、灯笼和盾牌。',
  },
  {
    id: 'interests-and-hobbies',
    title: 'Interests and Hobbies',
    titleCn: '兴趣与爱好',
    emoji: '🎨',
    purposeCn: '认识运动、游戏、艺术、音乐、表演与收藏用品。',
    boundaryCn: '收录运动游戏、创作表演、门票奖牌及弓箭、回旋镖、香烟等已确认边界项；水上活动进入“海洋世界”。',
  },
  {
    id: 'technology-and-symbols',
    title: 'Technology and Symbols',
    titleCn: '科技与符号',
    emoji: '📱',
    purposeCn: '认识数码设备、网络通信、媒体控制、界面按钮及科学安全标识。',
    boundaryCn: '收录手机电脑、数码存储、邮件信号、播放控制与抽象标识；电池和插头进入“工具与居家用品”。',
  },
  {
    id: 'faith-festivals-and-culture',
    title: 'Faith, Festivals and Culture',
    titleCn: '信仰、节日与文化',
    emoji: '🎊',
    purposeCn: '认识节庆、信仰、宗教建筑、文化符号与传统物品。',
    boundaryCn: '收录节日装饰、宗教建筑与符号、祈祷物品、墓碑、护符和邪眼。',
  },
] as const;

/** Four browse areas keep the 17 content categories scannable without adding a picker step. */
export const EMOJI_LEARNING_BROWSE_SECTIONS: readonly EmojiLearningBrowseSection[] = [
  {
    id: 'self-and-others',
    title: 'Know Yourself and Others',
    titleCn: '认识自己与他人',
    categoryIds: [
      'emotional-expression',
      'my-body',
      'all-kinds-of-people',
    ],
  },
  {
    id: 'natural-world',
    title: 'Explore the Natural World',
    titleCn: '探索自然世界',
    categoryIds: [
      'animal-park',
      'ocean-world',
      'plant-world',
      'astronomy-and-geography',
      'weather-report',
    ],
  },
  {
    id: 'life-and-travel',
    title: 'Life and Travel',
    titleCn: '生活与出行',
    categoryIds: [
      'food-and-cooking',
      'transport-and-travel',
      'cities-and-buildings',
      'daily-life-and-errands',
      'clothing-and-personal-items',
      'tools-and-home-items',
    ],
  },
  {
    id: 'interests-tech-and-culture',
    title: 'Interests, Technology and Culture',
    titleCn: '兴趣、科技与文化',
    categoryIds: [
      'interests-and-hobbies',
      'technology-and-symbols',
      'faith-festivals-and-culture',
    ],
  },
] as const;

export type EmojiLearningItem = {
  key: string;
  sourceCategoryId: string;
  sourceAlbumId: string;
  item: EmojiNounItem;
  primaryCategoryId: EmojiLearningCategoryId;
};

export function emojiLearningItemKey(sourceCategoryId: string, itemId: string) {
  return `${sourceCategoryId}/${itemId}`;
}

function itemKeys(sourceCategoryId: string, ...itemIds: string[]) {
  return new Set(itemIds.map((itemId) => emojiLearningItemKey(sourceCategoryId, itemId)));
}

function albumItemKeys(albumId: string) {
  const album = EMOJI_COLLECTION_ALBUMS.find((candidate) => candidate.id === albumId);
  if (!album) throw new Error(`Unknown emoji collection album: ${albumId}`);
  return new Set(
    album.items.map((item) => emojiLearningItemKey(album.parentCategoryId, item.id)),
  );
}

const OCEAN_ANIMAL_KEYS = albumItemKeys('animals-ocean-life');
const HOLIDAY_KEYS = albumItemKeys('holidays-festivals-parties');
const AWARD_AND_TICKET_KEYS = albumItemKeys('holidays-tickets-trophies-medals');
const HEART_AND_CONVERSATION_KEYS = albumItemKeys('symbols-hearts-conversation');
const TECHNOLOGY_SYMBOL_KEYS = new Set([
  ...albumItemKeys('symbols-navigation-device-status'),
  ...albumItemKeys('symbols-media-controls'),
  ...albumItemKeys('symbols-science-safety-identity'),
]);
const FAITH_SYMBOL_KEYS = albumItemKeys('symbols-faith-peace');

const OCEAN_KEYS = new Set([
  ...itemKeys('weather', 'water-wave'),
  ...itemKeys('travel', 'beach-with-umbrella', 'desert-island'),
  ...itemKeys(
    'travel-transport',
    'sailboat',
    'canoe',
    'speedboat',
    'passenger-ship',
    'ferry',
    'motor-boat',
    'ship',
  ),
  ...itemKeys('travel-signs', 'anchor', 'ring-buoy'),
  ...itemKeys('sports-games', 'fishing-pole', 'diving-mask'),
  ...itemKeys('people', 'surfing', 'rowing-boat', 'swimming', 'playing-water-polo'),
]);

const ASTRONOMY_KEYS = new Set([
  ...itemKeys(
    'weather',
    'ringed-planet',
    'star',
    'glowing-star',
    'shooting-star',
    'milky-way',
    'comet',
  ),
  ...itemKeys(
    'travel',
    'snow-capped-mountain',
    'mountain',
    'volcano',
    'mount-fuji',
    'desert',
    'national-park',
    'night-with-stars',
    'sunrise-over-mountains',
    'sunrise',
    'sunset',
    'hot-springs',
    'rock',
  ),
  ...itemKeys('travel-transport', 'satellite', 'rocket', 'flying-saucer'),
]);

const FAITH_AND_CULTURE_KEYS = new Set([
  ...itemKeys(
    'travel',
    'church',
    'mosque',
    'hindu-temple',
    'synagogue',
    'shinto-shrine',
    'kaaba',
  ),
  ...itemKeys('clothing-accessories', 'prayer-beads'),
  ...itemKeys('objects', 'diya-lamp', 'headstone', 'nazar-amulet', 'hamsa'),
]);

const INTEREST_KEYS = new Set([
  ...itemKeys(
    'travel',
    'camping',
    'stadium',
    'carousel-horse',
    'tent',
    'playground-slide',
    'ferris-wheel',
    'roller-coaster',
    'circus-tent',
  ),
  ...itemKeys('objects', 'dagger', 'boomerang', 'bow-and-arrow', 'cigarette'),
]);

const TECHNOLOGY_ITEM_KEYS = itemKeys(
  'objects',
  'mobile-phone',
  'mobile-phone-with-arrow',
  'laptop-computer',
  'desktop-computer',
  'printer',
  'computer-mouse',
  'trackball',
  'computer-disk',
  'floppy-disk',
  'dvd',
  'e-mail',
  'outbox-tray',
  'inbox-tray',
  'link',
  'bomb',
);

const HOME_ITEM_KEYS = itemKeys(
  'objects',
  'battery',
  'electric-plug',
  'light-bulb',
  'flashlight',
  'paper-lantern',
  'shield',
);

const PERSONAL_ITEM_KEYS = itemKeys('objects', 'toothbrush');

function primaryCategoryFor(
  sourceCategoryId: string,
  itemId: string,
): EmojiLearningCategoryId {
  const key = emojiLearningItemKey(sourceCategoryId, itemId);

  if (OCEAN_ANIMAL_KEYS.has(key) || OCEAN_KEYS.has(key)) return 'ocean-world';
  if (ASTRONOMY_KEYS.has(key)) return 'astronomy-and-geography';
  if (FAITH_SYMBOL_KEYS.has(key) || FAITH_AND_CULTURE_KEYS.has(key) || HOLIDAY_KEYS.has(key)) {
    return 'faith-festivals-and-culture';
  }
  if (HEART_AND_CONVERSATION_KEYS.has(key)) return 'emotional-expression';
  if (TECHNOLOGY_SYMBOL_KEYS.has(key) || TECHNOLOGY_ITEM_KEYS.has(key)) {
    return 'technology-and-symbols';
  }
  if (AWARD_AND_TICKET_KEYS.has(key) || INTEREST_KEYS.has(key)) return 'interests-and-hobbies';
  if (HOME_ITEM_KEYS.has(key)) return 'tools-and-home-items';
  if (PERSONAL_ITEM_KEYS.has(key)) return 'clothing-and-personal-items';

  switch (sourceCategoryId) {
    case 'smileys-emotion':
      return 'emotional-expression';
    case 'body':
      return 'my-body';
    case 'people':
      return 'all-kinds-of-people';
    case 'animals':
      return 'animal-park';
    case 'plants':
      return 'plant-world';
    case 'food-drink':
      return 'food-and-cooking';
    case 'weather':
      return 'weather-report';
    case 'travel':
      return itemId === 'locomotive'
        ? 'transport-and-travel'
        : 'cities-and-buildings';
    case 'travel-transport':
    case 'travel-signs':
      return 'transport-and-travel';
    case 'travel-time':
      return 'daily-life-and-errands';
    case 'sports-games':
    case 'arts-culture':
    case 'music':
      return 'interests-and-hobbies';
    case 'holidays':
      return 'faith-festivals-and-culture';
    case 'clothing-accessories':
      return 'clothing-and-personal-items';
    case 'tools':
      return itemId === 'razor'
        ? 'clothing-and-personal-items'
        : 'tools-and-home-items';
    case 'objects':
      return itemId === 'musical-score' ||
        itemId === 'postal-horn' ||
        itemId === 'musical-notes' ||
        itemId === 'musical-note' ||
        itemId === 'juggling'
        ? 'interests-and-hobbies'
        : 'daily-life-and-errands';
    case 'symbols':
      // Every current symbol is covered by the album-level rules above.
      throw new Error(`Unmapped symbol item: ${key}`);
    default:
      throw new Error(`Unmapped source category: ${sourceCategoryId}`);
  }
}

const albumIdByItemKey = new Map<string, string>();
for (const album of EMOJI_COLLECTION_ALBUMS) {
  for (const item of album.items) {
    const key = emojiLearningItemKey(album.parentCategoryId, item.id);
    if (albumIdByItemKey.has(key)) throw new Error(`Duplicate semantic album item: ${key}`);
    albumIdByItemKey.set(key, album.id);
  }
}

export const EMOJI_LEARNING_ITEMS: readonly EmojiLearningItem[] =
  EMOJI_NOUN_CATEGORIES.flatMap((sourceCategory) =>
    sourceCategory.items.map((item) => {
      const key = emojiLearningItemKey(sourceCategory.id, item.id);
      const sourceAlbumId = albumIdByItemKey.get(key);
      if (!sourceAlbumId) throw new Error(`Missing semantic album for learning item: ${key}`);
      return {
        key,
        sourceCategoryId: sourceCategory.id,
        sourceAlbumId,
        item,
        primaryCategoryId: primaryCategoryFor(sourceCategory.id, item.id),
      };
    }),
  );

export const EMOJI_LEARNING_ITEMS_BY_CATEGORY: ReadonlyMap<
  EmojiLearningCategoryId,
  readonly EmojiLearningItem[]
> = new Map(
  EMOJI_LEARNING_CATEGORY_IDS.map((categoryId) => [
    categoryId,
    EMOJI_LEARNING_ITEMS.filter((entry) => entry.primaryCategoryId === categoryId),
  ]),
);

export function getEmojiLearningCategory(categoryId: EmojiLearningCategoryId) {
  const category = EMOJI_LEARNING_CATEGORIES.find((entry) => entry.id === categoryId);
  if (!category) throw new Error(`Unknown emoji learning category: ${categoryId}`);
  return category;
}

export function getEmojiLearningBrowseSection(categoryId: EmojiLearningCategoryId) {
  const section = EMOJI_LEARNING_BROWSE_SECTIONS.find((entry) =>
    entry.categoryIds.includes(categoryId),
  );
  if (!section) throw new Error(`Category has no browse section: ${categoryId}`);
  return section;
}
