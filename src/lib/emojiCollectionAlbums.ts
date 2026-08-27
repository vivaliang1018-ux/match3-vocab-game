import {
  EMOJI_NOUN_CATEGORIES,
  type EmojiNounCategory,
  type EmojiNounItem,
} from '../data/emojiNouns';

export type EmojiCollectionAlbum = {
  id: string;
  parentCategoryId: string;
  title: string;
  titleCn: string;
  items: EmojiNounItem[];
};

type ItemRange = readonly [start: number, end: number];

type SemanticAlbum = {
  key?: string;
  title: string;
  titleCn: string;
  ranges: readonly ItemRange[];
};

const album = (
  title: string,
  titleCn: string,
  ...ranges: ItemRange[]
): SemanticAlbum => ({ title, titleCn, ranges });

const namedAlbum = (
  key: string,
  title: string,
  titleCn: string,
  ...ranges: ItemRange[]
): SemanticAlbum => ({ key, title, titleCn, ranges });

const FUN_ALBUM_NAMES: Record<string, readonly [english: string, chinese: string]> = {
  'Joy & Affection': ['Sunshine Faces', '阳光笑脸'],
  'Playful Reactions': ['Mischief Club', '调皮俱乐部'],
  'Quiet Expressions': ['Quiet Little Moods', '安静小情绪'],
  'Feeling Unwell': ['Not My Day', '今天不太行'],
  'Personality Faces': ['Faces with Flair', '个性表情派'],
  'Confused & Surprised': ['Wait, What?', '咦？怎么啦'],
  'Sad & Afraid': ['Blue Mood', '胆小又难过'],
  'Angry & Spooky': ['The Wild Side', '生气怪怪团'],
  'Cat Faces': ['Cat Moods', '猫猫有情绪'],
  'Greetings & Palms': ['Hello, Hands!', '小手打招呼'],
  'Fingers & Fists': ['Hands in Action', '手势行动派'],
  'Hands Together': ['Hand in Hand', '双手碰碰乐'],
  'Body & Organs': ['Body Quest', '身体探险队'],
  'Gestures & Reactions': ['Actions Speak', '动作会说话'],
  'People, Ages & Style': ['All Kinds of Us', '各种各样的我们'],
  Professions: ['Dream Jobs', '梦想职业局'],
  'Royalty, Family & Holidays': ['Storybook Guests', '童话与节日来客'],
  'Fantasy People': ['Magic Folk', '魔法居民'],
  'Movement & Accessibility': ['Moving My Way', '我的出发方式'],
  'Sports & Adventure': ['Adventure Crew', '冒险运动队'],
  'Rest & Wellness': ['Cozy Time', '舒服一下'],
  'Canines & Felines': ['Paws & Whiskers', '爪爪和胡须'],
  'Horses & Hoofed Animals': ['Hoofbeat Meadow', '蹄蹄草原'],
  'Large & Wild Mammals': ['Big Wild Friends', '大块头朋友'],
  'Small Mammals': ['Tiny Paws', '小爪子乐园'],
  Birds: ['Feathered Flyers', '羽毛飞行队'],
  'Reptiles & Dinosaurs': ['Scales & Roars', '鳞片与吼吼'],
  'Ocean Life': ['Under the Sea', '海底朋友圈'],
  'Bugs & Tiny Life': ['Mini Beasties', '小小生命家'],
  'Flowers & Sprouts': ['Bloom & Grow', '花花发芽啦'],
  'Trees, Leaves & Woodland': ['Woodland Whispers', '森林悄悄话'],
  Fruit: ['Juicy Bites', '果香满满'],
  'Vegetables, Nuts & Roots': ['Garden Basket', '菜园小篮子'],
  'Bread & Cheese': ['Bakery Hugs', '面包香香屋'],
  'Meat & Fast Food': ['Big Bites', '大口吃一口'],
  'Cooking, Tableware & Seasoning': ['Kitchen Magic', '厨房魔法'],
  'Rice, Noodles & Asian Dishes': ['Bowlful of Joy', '碗里有惊喜'],
  'Desserts & Sweets': ['Sweet Tooth', '甜甜补给站'],
  'Milk, Tea & Soft Drinks': ['Sip & Smile', '喝一口吧'],
  'Celebration Drinks': ['Cheers!', '碰杯时刻'],
  'Stars & Space': ['Starry Trip', '星星旅行团'],
  'Clouds, Rain & Wind': ['Sky on a Stroll', '天空在散步'],
  'Rainbow, Snow & Elements': ['Weather Wonders', '天气变变变'],
  'Natural Places': ['Into the Wild', '出发去自然'],
  'City Views & Leisure': ['City Day Out', '城市漫游日'],
  'Homes & Construction': ['Build a Home', '小房子开工啦'],
  'City Buildings': ['Around Town', '城市逛一圈'],
  'Landmarks & Attractions': ['Wish You Were Here', '地标打卡册'],
  'Rail Transit': ['Choo-Choo Lines', '火车嘟嘟嘟'],
  'Public & Emergency Vehicles': ['City Helpers', '城市救援队'],
  'Cars, Trucks & Motorcycles': ['Wheels on the Go', '车轮出发啦'],
  'Accessible & Personal Transport': ['My Little Ride', '我的轻便座驾'],
  'Water Transport': ['Sail Away', '一起去航海'],
  'Flight, Cableways & Space': ['Up, Up & Away', '飞向高高处'],
  'Traffic & Safety Facilities': ['Roadside Clues', '路上的小提示'],
  'Clocks & Timers': ['Tick-Tock Time', '滴答滴答'],
  'Ball Sports': ['Ball Party', '球球大派对'],
  'Outdoor & Competitive Sports': ['Ready, Set, Go!', '预备，出发！'],
  'Toys, Magic & Video Games': ['Playtime Magic', '玩具魔法屋'],
  'Board & Card Games': ['Game Night', '桌游之夜'],
  'Festivals & Parties': ['Party Sparkles', '节日亮晶晶'],
  'Tickets, Trophies & Medals': ['Winning Moments', '高光时刻'],
  'Art, Film & Crafts': ['Make Something', '灵感动手做'],
  'Music & Instruments': ['Turn Up the Music', '音乐响起来'],
  'Eyewear & Clothing': ['Dress-Up Day', '今天穿什么'],
  'Bags & Accessories': ['Take It Along', '随身小搭档'],
  Shoes: ['Happy Feet', '鞋鞋走天下'],
  'Hats, Jewelry & Beauty': ['A Little Sparkle', '闪亮一下'],
  'Workshop & Repair Tools': ['Fix-It Crew', '修修补补队'],
  'Locks, Keys & Assistance': ['Keys & Clever Tools', '钥匙妙妙屋'],
  'Cleaning & Personal Care': ['Fresh & Ready', '清爽准备好'],
  'Electronics & Lighting': ['Bright Ideas', '闪亮科技站'],
  'Books, Bookmarks & Labels': ['Book Nook', '书本小角落'],
  'Mail, Packages & Writing': ["You've Got Mail", '信件出发啦'],
  'Office & Filing': ['Tidy Desk', '桌面整理术'],
  'Home & Travel Objects': ['Everyday Sidekicks', '日常小帮手'],
  'Money & Payment': ['Pocket Change', '小小钱袋'],
  'Communication & Records': ['Notes & News', '消息记录本'],
  'Weapons & Protection': ['Brave & Protected', '勇气护身符'],
  'Music & Performance Objects': ['Stage Time', '舞台时间'],
  'Hearts & Conversation': ['Love Notes', '心心小纸条'],
  'Buttons & Signals': ['Tap & Connect', '点一点，连起来'],
  'Media Controls': ['Press Play', '播放控制台'],
  'Faith & Peace': ['Peaceful Signs', '和平小宇宙'],
  'Our World & Us': ['Planet & People', '地球和我们'],
};

// Ranges are one-based positions in emojiNouns. They follow meaning boundaries,
// not a target card size, so collections can be naturally large or small.
const SEMANTIC_ALBUMS: Record<string, readonly SemanticAlbum[]> = {
  'smileys-emotion': [
    album('Joy & Affection', '开心与爱意', [1, 20]),
    album('Playful Reactions', '调皮互动与三不猴', [21, 32], [127, 129]),
    album('Quiet Expressions', '平静与复杂表情', [33, 48]),
    album('Feeling Unwell', '生病与不舒服', [49, 60]),
    album('Personality Faces', '个性与特殊表情', [61, 66], [117, 125]),
    album('Confused & Surprised', '困惑与惊讶', [67, 75]),
    album('Sad & Afraid', '悲伤与害怕', [76, 92]),
    album('Angry & Spooky', '生气与怪趣角色', [93, 107], [126, 126]),
    album('Cat Faces', '猫咪表情', [108, 116]),
  ],
  body: [
    album('Greetings & Palms', '招呼与手掌动作', [1, 16]),
    album('Fingers & Fists', '手指与拳头手势', [17, 33]),
    album('Hands Together', '双手互动', [34, 42]),
    album('Body & Organs', '身体与器官', [43, 58]),
    album('Gestures & Reactions', '人物姿势与反应', [59, 69]),
  ],
  people: [
    album('People, Ages & Style', '人物、年龄与造型', [1, 3], [11, 28], [99, 101]),
    album('Professions', '职业人物', [29, 49]),
    album('Royalty, Family & Holidays', '王室、家庭与节日人物', [50, 58]),
    album('Fantasy People', '奇幻人物', [4, 5], [59, 68]),
    album('Movement & Accessibility', '步行与无障碍人物', [71, 83]),
    album('Sports & Adventure', '运动与冒险人物', [7, 10], [84, 98], [102, 106]),
    album('Rest & Wellness', '休息与健康', [6, 6], [69, 70], [107, 108]),
  ],
  animals: [
    album('Canines & Felines', '犬科与猫科动物', [5, 19]),
    album('Horses & Hoofed Animals', '马、牛羊与有蹄动物', [20, 41]),
    album('Large & Wild Mammals', '大型与野生哺乳动物', [1, 4], [42, 46], [57, 65]),
    album('Small Mammals', '小型哺乳动物', [47, 56], [66, 66]),
    album('Birds', '鸟类', [67, 88]),
    album('Reptiles & Dinosaurs', '爬行动物与恐龙', [89, 97]),
    album('Ocean Life', '海洋生物', [98, 114]),
    album('Bugs & Tiny Life', '昆虫与微小生物', [115, 130]),
  ],
  plants: [
    album('Flowers & Sprouts', '花朵与幼苗', [1, 14]),
    album('Trees, Leaves & Woodland', '树木、叶子与林间植物', [15, 29]),
  ],
  'food-drink': [
    album('Fruit', '水果', [1, 17]),
    album('Vegetables, Nuts & Roots', '蔬菜、坚果与根茎', [18, 39]),
    album('Bread & Cheese', '面包与奶酪', [40, 48]),
    album('Meat & Fast Food', '肉类与快餐', [49, 62]),
    album('Cooking, Tableware & Seasoning', '烹饪、餐具与调味', [63, 80]),
    album('Rice, Noodles & Asian Dishes', '米饭、面食与亚洲料理', [81, 97]),
    album('Desserts & Sweets', '甜点与糖果', [98, 111]),
    album('Milk, Tea & Soft Drinks', '牛奶、茶与无酒精饮品', [112, 116], [127, 131]),
    album('Celebration Drinks', '酒类与庆祝饮品', [117, 126]),
  ],
  weather: [
    album('Stars & Space', '星空与宇宙', [1, 5], [26, 26]),
    album('Clouds, Rain & Wind', '云、雨与风', [6, 18]),
    album('Rainbow, Snow & Elements', '彩虹、冰雪与自然元素', [19, 25], [27, 29]),
  ],
  travel: [
    album('Natural Places', '自然景观', [1, 9]),
    album('City Views & Leisure', '城市风景与休闲场所', [10, 19]),
    album('Homes & Construction', '房屋与建筑材料', [20, 29]),
    album('City Buildings', '城市建筑', [30, 43]),
    album('Landmarks & Attractions', '地标、景点与特色设施', [44, 59]),
  ],
  'travel-transport': [
    album('Rail Transit', '火车与轨道交通', [1, 11]),
    album('Public & Emergency Vehicles', '公共与紧急车辆', [12, 21]),
    album('Cars, Trucks & Motorcycles', '汽车、卡车与摩托车', [22, 31]),
    album('Accessible & Personal Transport', '无障碍与个人交通工具', [32, 39]),
    album('Water Transport', '船只与水上交通', [40, 46]),
    album('Flight, Cableways & Space', '飞行、缆车与太空交通', [47, 59]),
  ],
  'travel-signs': [
    album('Traffic & Safety Facilities', '交通与安全设施', [1, 12]),
  ],
  'travel-time': [
    album('Clocks & Timers', '时钟与计时工具', [1, 7]),
  ],
  'sports-games': [
    album('Ball Sports', '球类运动', [1, 16]),
    album('Outdoor & Competitive Sports', '户外与竞技运动', [17, 27]),
    album('Toys, Magic & Video Games', '玩具、魔法与电子游戏', [28, 43]),
    album('Board & Card Games', '棋牌与纸牌游戏', [44, 51]),
  ],
  holidays: [
    album('Festivals & Parties', '节日与派对装饰', [1, 18]),
    album('Tickets, Trophies & Medals', '门票、奖杯与奖牌', [19, 27]),
  ],
  'arts-culture': [
    album('Art, Film & Crafts', '艺术、影像与手工艺', [1, 15]),
  ],
  music: [
    album('Music & Instruments', '音乐与乐器', [1, 15]),
  ],
  'clothing-accessories': [
    album('Eyewear & Clothing', '眼镜与服装', [1, 20]),
    album('Bags & Accessories', '包袋与随身配饰', [21, 26]),
    album('Shoes', '鞋履', [27, 35]),
    album('Hats, Jewelry & Beauty', '帽子、首饰与美容配饰', [36, 47]),
  ],
  tools: [
    album('Workshop & Repair Tools', '工坊与维修工具', [1, 7], [15, 17]),
    album('Locks, Keys & Assistance', '锁、钥匙与辅助工具', [8, 14]),
    album('Cleaning & Personal Care', '清洁与个人护理工具', [18, 21]),
  ],
  objects: [
    album('Electronics & Lighting', '电子设备与照明', [1, 15]),
    album('Books, Bookmarks & Labels', '书籍、书签与标签', [16, 26]),
    album('Mail, Packages & Writing', '邮件、包裹与书写', [27, 37]),
    album('Office & Filing', '办公与文件整理', [38, 54]),
    album('Home & Travel Objects', '家居与旅行用品', [55, 65]),
    album('Money & Payment', '钱币与支付', [66, 72]),
    album('Communication & Records', '通信、行政与票据', [73, 80], [95, 95]),
    album('Weapons & Protection', '武器、防护与护符', [81, 89]),
    album('Music & Performance Objects', '音乐与表演物品', [90, 94]),
  ],
  symbols: [
    album('Hearts & Conversation', '爱心与对话符号', [1, 24]),
    namedAlbum('navigation-device-status', 'Buttons & Signals', '按钮与信号', [25, 34], [61, 65]),
    album('Media Controls', '媒体控制符号', [40, 60]),
    album('Faith & Peace', '信仰与和平符号', [35, 39], [67, 69], [75, 79], [81, 82]),
    namedAlbum('science-safety-identity', 'Our World & Us', '地球与我们', [66, 66], [70, 74], [80, 80], [83, 84]),
  ],
};

function itemsFromRanges(category: EmojiNounCategory, ranges: readonly ItemRange[]) {
  return ranges.flatMap(([start, end]) => category.items.slice(start - 1, end));
}

function semanticAlbumId(categoryId: string, title: string) {
  return `${categoryId}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;
}

function createSemanticAlbums(): EmojiCollectionAlbum[] {
  const result: EmojiCollectionAlbum[] = [];

  for (const category of EMOJI_NOUN_CATEGORIES) {
    const definitions = SEMANTIC_ALBUMS[category.id];
    if (!definitions) throw new Error(`Missing collection albums for ${category.id}`);

    const used = new Set<string>();
    definitions.forEach((definition, index) => {
      const items = itemsFromRanges(category, definition.ranges);
      if (items.length < 2) throw new Error(`Collection album ${category.id}-${index + 1} has fewer than two items`);
      for (const item of items) {
        if (used.has(item.id)) throw new Error(`Duplicate collection item ${category.id}/${item.id}`);
        used.add(item.id);
      }
      const displayName = FUN_ALBUM_NAMES[definition.title];
      if (!displayName) throw new Error(`Missing fun collection name for ${definition.title}`);
      result.push({
        id: definition.key
          ? `${category.id}-${definition.key}`
          : semanticAlbumId(category.id, definition.title),
        parentCategoryId: category.id,
        title: displayName[0],
        titleCn: displayName[1],
        items,
      });
    });

    const missing = category.items.filter((item) => !used.has(item.id));
    if (missing.length > 0 || used.size !== category.items.length) {
      throw new Error(`Collection coverage mismatch for ${category.id}: ${missing.map((item) => item.id).join(', ')}`);
    }
  }

  return result;
}

export const EMOJI_COLLECTION_ALBUMS = createSemanticAlbums();
