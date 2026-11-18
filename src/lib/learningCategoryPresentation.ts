import type { Locale } from '../i18n';
import type {
  EmojiLearningBrowseSection,
  EmojiLearningBrowseSectionId,
  EmojiLearningCategory,
  EmojiLearningCategoryId,
} from './emojiLearningCategories';

type OtherLocale = Exclude<Locale, 'en' | 'zh-CN'>;

const CATEGORY_TITLES: Record<OtherLocale, Record<EmojiLearningCategoryId, string>> = {
  es: {
    'emotional-expression': 'Expresiones y emociones', 'my-body': 'Mi cuerpo', 'all-kinds-of-people': 'Todo tipo de personas',
    'animal-park': 'Parque de animales', 'ocean-world': 'Mundo marino', 'plant-world': 'Mundo vegetal',
    'food-and-cooking': 'Comida y cocina', 'astronomy-and-geography': 'Astronomía y geografía', 'weather-report': 'El tiempo',
    'transport-and-travel': 'Transporte y viajes', 'cities-and-buildings': 'Ciudades y edificios', 'daily-life-and-errands': 'Vida cotidiana',
    'clothing-and-personal-items': 'Ropa y objetos personales', 'tools-and-home-items': 'Herramientas y hogar',
    'interests-and-hobbies': 'Intereses y aficiones', 'technology-and-symbols': 'Tecnología y símbolos',
    'faith-festivals-and-culture': 'Creencias, fiestas y cultura',
  },
  fr: {
    'emotional-expression': 'Émotions et expressions', 'my-body': 'Mon corps', 'all-kinds-of-people': 'Toutes sortes de personnes',
    'animal-park': 'Le monde des animaux', 'ocean-world': 'Le monde marin', 'plant-world': 'Le monde végétal',
    'food-and-cooking': 'Cuisine et aliments', 'astronomy-and-geography': 'Astronomie et géographie', 'weather-report': 'La météo',
    'transport-and-travel': 'Transports et voyages', 'cities-and-buildings': 'Villes et bâtiments', 'daily-life-and-errands': 'La vie quotidienne',
    'clothing-and-personal-items': 'Vêtements et objets personnels', 'tools-and-home-items': 'Outils et maison',
    'interests-and-hobbies': 'Loisirs et passions', 'technology-and-symbols': 'Technologie et symboles',
    'faith-festivals-and-culture': 'Croyances, fêtes et culture',
  },
  de: {
    'emotional-expression': 'Gefühle und Ausdruck', 'my-body': 'Mein Körper', 'all-kinds-of-people': 'Menschen aller Art',
    'animal-park': 'Tierwelt', 'ocean-world': 'Meereswelt', 'plant-world': 'Pflanzenwelt',
    'food-and-cooking': 'Essen und Kochen', 'astronomy-and-geography': 'Astronomie und Geografie', 'weather-report': 'Wetterbericht',
    'transport-and-travel': 'Verkehr und Reisen', 'cities-and-buildings': 'Städte und Gebäude', 'daily-life-and-errands': 'Alltag und Erledigungen',
    'clothing-and-personal-items': 'Kleidung und Persönliches', 'tools-and-home-items': 'Werkzeuge und Haushalt',
    'interests-and-hobbies': 'Interessen und Hobbys', 'technology-and-symbols': 'Technik und Symbole',
    'faith-festivals-and-culture': 'Glaube, Feste und Kultur',
  },
  ja: {
    'emotional-expression': '感情と表情', 'my-body': 'からだ', 'all-kinds-of-people': 'いろいろな人',
    'animal-park': '動物の世界', 'ocean-world': '海の世界', 'plant-world': '植物の世界',
    'food-and-cooking': '食べ物と料理', 'astronomy-and-geography': '天文と地理', 'weather-report': '天気',
    'transport-and-travel': '乗り物と旅行', 'cities-and-buildings': '街と建物', 'daily-life-and-errands': '毎日の生活',
    'clothing-and-personal-items': '服と身の回りの物', 'tools-and-home-items': '道具と家庭用品',
    'interests-and-hobbies': '趣味と遊び', 'technology-and-symbols': 'テクノロジーと記号',
    'faith-festivals-and-culture': '信仰・祭り・文化',
  },
  ko: {
    'emotional-expression': '감정과 표현', 'my-body': '나의 몸', 'all-kinds-of-people': '다양한 사람들',
    'animal-park': '동물 세상', 'ocean-world': '바다 세상', 'plant-world': '식물 세상',
    'food-and-cooking': '음식과 요리', 'astronomy-and-geography': '천문과 지리', 'weather-report': '날씨',
    'transport-and-travel': '교통과 여행', 'cities-and-buildings': '도시와 건물', 'daily-life-and-errands': '일상생활',
    'clothing-and-personal-items': '옷과 개인용품', 'tools-and-home-items': '도구와 집안용품',
    'interests-and-hobbies': '관심사와 취미', 'technology-and-symbols': '기술과 기호',
    'faith-festivals-and-culture': '신앙·축제·문화',
  },
};

const SECTION_TITLES: Record<OtherLocale, Record<EmojiLearningBrowseSectionId, string>> = {
  es: { 'self-and-others': 'Conócete y conoce a los demás', 'natural-world': 'Explora la naturaleza', 'life-and-travel': 'Vida y viajes', 'interests-tech-and-culture': 'Aficiones, tecnología y cultura' },
  fr: { 'self-and-others': 'Soi et les autres', 'natural-world': 'Explore la nature', 'life-and-travel': 'Vie et voyages', 'interests-tech-and-culture': 'Loisirs, technologie et culture' },
  de: { 'self-and-others': 'Ich und die anderen', 'natural-world': 'Die Natur entdecken', 'life-and-travel': 'Alltag und Reisen', 'interests-tech-and-culture': 'Hobbys, Technik und Kultur' },
  ja: { 'self-and-others': '自分とまわりの人', 'natural-world': '自然を探検', 'life-and-travel': '生活と旅行', 'interests-tech-and-culture': '趣味・技術・文化' },
  ko: { 'self-and-others': '나와 다른 사람들', 'natural-world': '자연 탐험', 'life-and-travel': '생활과 여행', 'interests-tech-and-culture': '취미·기술·문화' },
};

export function learningCategoryTitle(category: EmojiLearningCategory, locale: Locale): string {
  if (locale === 'en') return category.title;
  if (locale === 'zh-CN') return category.titleCn;
  return CATEGORY_TITLES[locale][category.id];
}

export function learningSectionTitle(section: EmojiLearningBrowseSection, locale: Locale): string {
  if (locale === 'en') return section.title;
  if (locale === 'zh-CN') return section.titleCn;
  return SECTION_TITLES[locale][section.id];
}

type CategoryUiCopy = {
  description: string;
  explore: string;
  backToModes: string;
  title: string;
  subtitle: string;
  recommended: string;
  continueExploring: string;
  extras: string;
  imagePack: string;
  cycleProgress: (cycle: number, cleared: number, total: number) => string;
  trainingComplete: (title: string) => string;
  cycleComplete: (cycle: number) => string;
  cycleLabel: (cycle: number) => string;
  continueCategory: (title: string) => string;
  backToCategories: string;
  quotaSyncError: string;
};

export const CATEGORY_UI_COPY: Record<Locale, CategoryUiCopy> = {
  en: { description: 'Learn words in this theme', explore: 'Explore categories', backToModes: 'Back to modes', title: 'What do you want to explore?', subtitle: 'Choose a theme and focus on its words', recommended: 'Recommended theme', continueExploring: 'Continue exploring', extras: 'More', imagePack: 'Image Pack', cycleProgress: (c, done, total) => `Cycle ${c} · ${done}/${total}`, trainingComplete: (title) => `${title} complete`, cycleComplete: (c) => `Cycle ${c} complete`, cycleLabel: (c) => `Cycle ${c} progress`, continueCategory: (title) => `Continue ${title}`, backToCategories: 'Back to categories', quotaSyncError: 'Daily plays could not sync. Check your connection and try again.' },
  'zh-CN': { description: '认识这个主题里的词语', explore: '分类探索', backToModes: '返回模式选择', title: '想认识什么？', subtitle: '选择一个主题，集中认识其中的词', recommended: '推荐主题', continueExploring: '继续探索', extras: '更多内容', imagePack: '图片词包', cycleProgress: (c, done, total) => `第 ${c} 轮 · ${done}/${total}`, trainingComplete: (title) => `${title}训练完成`, cycleComplete: (c) => `第 ${c} 轮全部通过`, cycleLabel: (c) => `第 ${c} 轮进度`, continueCategory: (title) => `继续探索${title}`, backToCategories: '返回分类首页', quotaSyncError: '每日额度同步失败，请检查网络后重试。' },
  es: { description: 'Aprende las palabras de este tema', explore: 'Explorar categorías', backToModes: 'Volver a los modos', title: '¿Qué quieres explorar?', subtitle: 'Elige un tema y aprende sus palabras', recommended: 'Tema recomendado', continueExploring: 'Seguir explorando', extras: 'Más', imagePack: 'Paquete de imágenes', cycleProgress: (c, done, total) => `Ciclo ${c} · ${done}/${total}`, trainingComplete: (title) => `${title} completado`, cycleComplete: (c) => `Ciclo ${c} completado`, cycleLabel: (c) => `Progreso del ciclo ${c}`, continueCategory: (title) => `Continuar ${title}`, backToCategories: 'Volver a categorías', quotaSyncError: 'No se pudo sincronizar el límite diario. Comprueba tu conexión e inténtalo de nuevo.' },
  fr: { description: 'Apprends les mots de ce thème', explore: 'Explorer les catégories', backToModes: 'Retour aux modes', title: 'Que veux-tu explorer ?', subtitle: 'Choisis un thème et découvre ses mots', recommended: 'Thème recommandé', continueExploring: 'Continuer à explorer', extras: 'Plus', imagePack: 'Pack d’images', cycleProgress: (c, done, total) => `Cycle ${c} · ${done}/${total}`, trainingComplete: (title) => `${title} terminé`, cycleComplete: (c) => `Cycle ${c} terminé`, cycleLabel: (c) => `Progression du cycle ${c}`, continueCategory: (title) => `Continuer ${title}`, backToCategories: 'Retour aux catégories', quotaSyncError: 'Impossible de synchroniser la limite du jour. Vérifie ta connexion et réessaie.' },
  de: { description: 'Lerne Wörter zu diesem Thema', explore: 'Kategorien entdecken', backToModes: 'Zurück zu den Modi', title: 'Was möchtest du entdecken?', subtitle: 'Wähle ein Thema und lerne die Wörter', recommended: 'Empfohlenes Thema', continueExploring: 'Weiter entdecken', extras: 'Mehr', imagePack: 'Bilderpaket', cycleProgress: (c, done, total) => `Runde ${c} · ${done}/${total}`, trainingComplete: (title) => `${title} abgeschlossen`, cycleComplete: (c) => `Runde ${c} abgeschlossen`, cycleLabel: (c) => `Fortschritt in Runde ${c}`, continueCategory: (title) => `${title} fortsetzen`, backToCategories: 'Zurück zu den Kategorien', quotaSyncError: 'Das Tageslimit konnte nicht synchronisiert werden. Prüfe deine Verbindung und versuche es erneut.' },
  ja: { description: 'このテーマの単語を学ぼう', explore: 'カテゴリーを探す', backToModes: 'モード選択に戻る', title: '何を学びたい？', subtitle: 'テーマを選んで単語を覚えよう', recommended: 'おすすめのテーマ', continueExploring: '学習を続ける', extras: 'その他', imagePack: '画像パック', cycleProgress: (c, done, total) => `第${c}ラウンド · ${done}/${total}`, trainingComplete: (title) => `${title}をクリア！`, cycleComplete: (c) => `第${c}ラウンドをクリア`, cycleLabel: (c) => `第${c}ラウンドの進捗`, continueCategory: (title) => `${title}を続ける`, backToCategories: 'カテゴリー一覧に戻る', quotaSyncError: '1日のプレイ回数を同期できませんでした。接続を確認して再試行してください。' },
  ko: { description: '이 주제의 단어를 배워요', explore: '카테고리 탐색', backToModes: '모드 선택으로 돌아가기', title: '무엇을 탐색할까요?', subtitle: '주제를 선택하고 단어를 배워요', recommended: '추천 주제', continueExploring: '계속 탐색', extras: '더 보기', imagePack: '이미지 팩', cycleProgress: (c, done, total) => `${c}라운드 · ${done}/${total}`, trainingComplete: (title) => `${title} 완료`, cycleComplete: (c) => `${c}라운드 완료`, cycleLabel: (c) => `${c}라운드 진행 상황`, continueCategory: (title) => `${title} 계속하기`, backToCategories: '카테고리 목록으로', quotaSyncError: '일일 플레이 횟수를 동기화하지 못했습니다. 연결을 확인한 뒤 다시 시도해 주세요.' },
};
