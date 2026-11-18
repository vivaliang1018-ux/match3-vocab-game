import type { LanguageCode } from '../courseConfig';

type LearningLanguage = 'en' | 'es' | 'ja' | 'ko';
type ReleaseGlossRule = {
  emoji: string;
  /** Exact existing target words: these are guards, not vocabulary renames. */
  names: Partial<Record<LearningLanguage, string>>;
  glosses: Partial<Record<LanguageCode, string>>;
};

/** Approved A-only release fixes. Never infer another course's gloss from an emoji. */
export const RELEASE_GLOSS_RULES: readonly ReleaseGlossRule[] = [
  { emoji: '🐡', names: { en: 'Blowfish', es: 'pez globo', ja: 'フグ', ko: '복어' },
    glosses: { fr: 'poisson-globe' } },
  { emoji: '🤲', names: { en: 'Palms Up Together', es: 'palmas hacia arriba juntas' },
    glosses: { fr: 'deux mains réunies, paumes vers le haut' } },
  { emoji: '🤲', names: { ja: '手のひらを揃えた両手' },
    glosses: { fr: 'deux mains côte à côte' } },
  { emoji: '🤲', names: { ko: '내민 두 손' }, glosses: { fr: 'deux mains tendues' } },
  { emoji: '🐾', names: { en: 'Paw Prints' }, glosses: { es: 'huellas de patas', ko: '발자국' } },
  { emoji: '🗜️', names: { en: 'Clamp' }, glosses: { ko: '클램프' } },
  { emoji: '🏝️', names: { en: 'Desert Island', es: 'isla desierta', ja: '無人島' },
    glosses: { ko: '무인도' } },
  { emoji: '☄️', names: { en: 'Comet', ja: '彗星' }, glosses: { es: 'cometa' } },
  { emoji: '🫜', names: { en: 'Root Vegetable', ja: '根菜', ko: '뿌리채소' },
    glosses: { es: 'tubérculo comestible' } },
  { emoji: '🍥', names: { en: 'Fish Cake with Swirl', ja: 'なると' },
    glosses: { fr: 'gâteau de pâte de poisson japonais à motif en spirale',
      de: 'Japanischer Fischkuchen mit Spiralmuster' } },
  { emoji: '🍥', names: { es: 'pastel de pescado japonés' },
    glosses: { fr: 'gâteau de pâte de poisson japonais', de: 'Japanischer Fischkuchen' } },
  { emoji: '🍥', names: { ko: '어묵' },
    glosses: { fr: 'préparation à base de pâte de poisson', de: 'Fischkuchen' } },
  { emoji: '🍰', names: { ja: 'ショートケーキ' },
    glosses: { fr: 'gâteau à la crème chantilly' } },
  { emoji: '⛄️', names: { es: 'muñeco de nieve', ko: '스노우맨' }, glosses: { 'zh-CN': '雪人' } },
  { emoji: '🎦', names: { ko: '영화' },
    glosses: { 'zh-CN': '电影', en: 'Movie', es: 'película', fr: 'film', de: 'Film' } },
  { emoji: '🎦', names: { es: 'cine' },
    glosses: { en: 'Cinema', 'zh-CN': '电影院；电影', de: 'Kino' } },
  { emoji: '🏮', names: { es: 'lámpara japonesa' }, glosses: { 'zh-CN': '日式灯笼' } },
  { emoji: '📪', names: { es: 'buzón cerrado vacío', ja: '手紙が入っていない閉じた郵便受け' },
    glosses: { 'zh-CN': '空的关闭信箱' } },
  { emoji: '📪', names: { ko: '깃발 내려간 닫힌 우편함' },
    glosses: { 'zh-CN': '旗子放下的关闭信箱' } },
  { emoji: '📩', names: { ko: '보낸 편지' },
    glosses: { 'zh-CN': '已寄出的信', ja: '送った手紙' } },
  { emoji: '⏲', names: { en: 'Timer Clock', es: 'temporizador', ja: 'タイマー', ko: '타이머 시계' },
    glosses: { de: 'Timer' } },
  { emoji: '💅', names: { es: 'pintarse las uñas' },
    glosses: { 'zh-CN': '涂指甲油', en: 'Painting one’s nails', ja: '爪にマニキュアを塗る',
      ko: '매니큐어 바르기', fr: 'se vernir les ongles', de: 'Sich die Nägel lackieren' } },
  { emoji: '💅', names: { ja: 'マニキュアを塗る手' },
    glosses: { 'zh-CN': '正在涂指甲油的手', en: 'A hand having nail polish applied',
      es: 'una mano a la que se le está aplicando esmalte', ko: '매니큐어를 바르고 있는 손',
      fr: 'une main sur laquelle on applique du vernis à ongles', de: 'Eine Hand, deren Nägel lackiert werden' } },
  { emoji: '🤹', names: { en: 'Juggling' },
    glosses: { es: 'hacer malabares', ja: 'ジャグリングをすること', ko: '저글링하기',
      fr: 'jonglage', de: 'Jonglieren' } },
  { emoji: '🤺', names: { en: 'Fencing' },
    glosses: { 'zh-CN': '击剑运动', es: 'esgrima', ja: 'フェンシング', ko: '펜싱',
      fr: 'escrime', de: 'Fechten' } },
  { emoji: '📃', names: { en: 'Page with Curl', es: 'página doblada', ja: '巻きページ', ko: '안으로 말린 문서' },
    glosses: { 'zh-CN': '卷边纸页' } },
  { emoji: '🏇', names: { ko: '승마' },
    glosses: { 'zh-CN': '骑马', en: 'Horse riding', es: 'equitación', ja: '乗馬',
      fr: 'équitation', de: 'Reiten' } },
  { emoji: '🏂', names: { es: 'practicante de snowboard', ja: 'スノーボーダー', ko: '스노보드 타는 사람' },
    glosses: { 'zh-CN': '单板滑雪者' } },
  { emoji: '🧐', names: { es: 'cara con monóculo', ja: 'モノクルを付けた顔', ko: '단안경을 쓴 얼굴' },
    glosses: { 'zh-CN': '戴单片眼镜的脸' } },
  // Japanese 疲れた is an adjective, not a face noun; await confirmation before adding 顔 in its gloss.
  { emoji: '😫', names: { es: 'cara cansada', ko: '피곤한 얼굴' },
    glosses: { 'zh-CN': '疲惫的脸' } },
  { emoji: '🤺', names: { es: 'persona haciendo esgrima', ja: 'フェンシングをする人', ko: '펜싱하는 사람' },
    glosses: { en: 'Fencer' } },
  { emoji: '🤹', names: { es: 'persona haciendo malabares', ja: 'ジャグリングをする人', ko: '저글링하는 사람' },
    glosses: { en: 'Juggler', 'zh-CN': '杂耍者' } },
];

export function releaseCourseGloss(
  emoji: string,
  learningName: string,
  source: LanguageCode,
  target: LanguageCode,
): string | undefined {
  return RELEASE_GLOSS_RULES.find(rule =>
    rule.emoji === emoji && rule.names[target as LearningLanguage] === learningName,
  )?.glosses[source];
}
