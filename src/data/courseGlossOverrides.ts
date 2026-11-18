import type { LanguageCode } from '../courseConfig';
import { ASR_FOLLOWUP_GLOSSES } from './courseGlossAsrFollowup';
import { SEMANTIC_GLOSS_OVERRIDES } from './courseSemanticGlosses';
import { translatedGloss } from './courseGlossTranslations';
import { englishCourseGloss, NEUTRAL_SPANISH_ALIASES } from './englishCourseGlosses';
import { reverseCourseGloss } from './courseReverseGlosses';
import { releaseCourseGloss } from './courseReleaseGlosses';

export type CourseGlossOverride = {
  target: 'en' | 'es' | 'ja' | 'ko';
  emoji: string;
  /** Match the exact current learning name so later vocabulary edits cannot inherit a stale gloss. */
  learningName: string;
  en: string;
  'zh-CN': string;
};

/**
 * Course-specific explanations only; never rename a target word or its audio.
 * Historical gender batches have ASR evidence; semantic review translates the
 * actual displayed target expression even when ASR remains inconclusive.
 * The reviewed meaning dictionary supplies all five other source locales.
 * Neutral English/Spanish and reverse-direction rules prevent gender or a
 * specialized emoji label from leaking into a broader learning expression.
 */
export const COURSE_GLOSS_OVERRIDES: readonly CourseGlossOverride[] = [
  ...SEMANTIC_GLOSS_OVERRIDES,
  ...ASR_FOLLOWUP_GLOSSES,
  {
    "target": "ja",
    "emoji": "💂‍♀️",
    "learningName": "女性の衛兵",
    "en": "Female guard",
    "zh-CN": "女卫兵"
  },
  {
    "target": "ko",
    "emoji": "💂‍♀️",
    "learningName": "여자 근위병",
    "en": "Female guard",
    "zh-CN": "女卫兵"
  },
  {
    "target": "ja",
    "emoji": "👩‍🎓",
    "learningName": "女子学生",
    "en": "Female student",
    "zh-CN": "女学生"
  },
  {
    "target": "ja",
    "emoji": "👩‍🏫",
    "learningName": "女性の教師",
    "en": "Female teacher",
    "zh-CN": "女教师"
  },
  {
    "target": "ja",
    "emoji": "👩‍🔬",
    "learningName": "女性科学者",
    "en": "Female scientist",
    "zh-CN": "女科学家"
  },
  {
    "target": "ja",
    "emoji": "👮‍♀️",
    "learningName": "女性警察官",
    "en": "Female police officer",
    "zh-CN": "女警察"
  },
  {
    "target": "ja",
    "emoji": "👷‍♀️",
    "learningName": "女性の建設作業員",
    "en": "Female construction worker",
    "zh-CN": "女建筑工人"
  },
  {
    "target": "ja",
    "emoji": "🧙‍♀️",
    "learningName": "女の魔法使い",
    "en": "Female mage",
    "zh-CN": "女法师"
  },
  {
    "target": "ja",
    "emoji": "👩‍🦲",
    "learningName": "髪のない女性",
    "en": "Bald woman",
    "zh-CN": "光头女性"
  },
  {
    "target": "ja",
    "emoji": "👰‍♀️",
    "learningName": "ベールの女性",
    "en": "Woman wearing a veil",
    "zh-CN": "戴面纱的女性"
  },
  {
    "target": "ja",
    "emoji": "🚴‍♀️",
    "learningName": "自転車に乗る女",
    "en": "Woman riding a bicycle",
    "zh-CN": "骑自行车的女性"
  },
  {
    "target": "ja",
    "emoji": "🧕",
    "learningName": "スカーフの女性",
    "en": "Woman wearing a scarf",
    "zh-CN": "戴头巾的女性"
  },
  {
    "target": "ko",
    "emoji": "👱‍♀️",
    "learningName": "금발 여자",
    "en": "Blond-haired woman",
    "zh-CN": "金发女性"
  },
  {
    "target": "ko",
    "emoji": "👩‍🦰",
    "learningName": "빨간 머리 여자",
    "en": "Red-haired woman",
    "zh-CN": "红发女性"
  },
  {
    "target": "ko",
    "emoji": "🧔‍♀️",
    "learningName": "수염 난 여자",
    "en": "Woman with a beard",
    "zh-CN": "留胡须的女性"
  },
  {
    "target": "ko",
    "emoji": "👩‍⚖️",
    "learningName": "여자 판사",
    "en": "Female judge",
    "zh-CN": "女法官"
  },
  {
    "target": "ko",
    "emoji": "👩‍🏭",
    "learningName": "공장 여자 직원",
    "en": "Female factory worker",
    "zh-CN": "女工厂职员"
  },
  {
    "target": "ko",
    "emoji": "👩‍💼",
    "learningName": "여자 회사원",
    "en": "Female office worker",
    "zh-CN": "女公司职员"
  },
  {
    "target": "ko",
    "emoji": "👩‍💻",
    "learningName": "여자 기술 전문가",
    "en": "Female technology expert",
    "zh-CN": "女性技术专家"
  },
  {
    "target": "ko",
    "emoji": "👩‍🎨",
    "learningName": "여자 화가",
    "en": "Female painter",
    "zh-CN": "女画家"
  },
  {
    "target": "ko",
    "emoji": "🕵️‍♀️",
    "learningName": "여자 탐정",
    "en": "Female detective",
    "zh-CN": "女侦探"
  },
  {
    "target": "ko",
    "emoji": "💆‍♀️",
    "learningName": "마사지 받는 여자",
    "en": "Woman getting a massage",
    "zh-CN": "接受按摩的女性"
  },
  {
    "target": "ko",
    "emoji": "🧍‍♀️",
    "learningName": "서 있는 여자",
    "en": "Woman standing",
    "zh-CN": "站立的女性"
  },
  {
    "target": "ko",
    "emoji": "💃",
    "learningName": "여자 댄서",
    "en": "Female dancer",
    "zh-CN": "女舞者"
  },
  {
    "target": "ko",
    "emoji": "🏌️‍♀️",
    "learningName": "골프치는 여자",
    "en": "Woman playing golf",
    "zh-CN": "打高尔夫的女性"
  },
  {
    "target": "ko",
    "emoji": "🏊‍♀️",
    "learningName": "수영하는 여자",
    "en": "Woman swimming",
    "zh-CN": "游泳的女性"
  },
  {
    "target": "ko",
    "emoji": "🚴‍♀️",
    "learningName": "자전거 타는 여자",
    "en": "Woman riding a bicycle",
    "zh-CN": "骑自行车的女性"
  },
  {
    "target": "ko",
    "emoji": "🤽‍♀️",
    "learningName": "수구하는 여자",
    "en": "Woman playing water polo",
    "zh-CN": "打水球的女性"
  },
  {
    "target": "ko",
    "emoji": "🤼‍♂️",
    "learningName": "레슬링하는 남자",
    "en": "Men wrestling",
    "zh-CN": "摔跤的男性"
  },
  {
    "target": "ko",
    "emoji": "🤼‍♀️",
    "learningName": "레슬링하는 여자",
    "en": "Women wrestling",
    "zh-CN": "摔跤的女性"
  },
  {
    "target": "es",
    "emoji": "🙎‍♀️",
    "learningName": "mujer haciendo pucheros",
    "en": "Woman pouting",
    "zh-CN": "噘嘴的女性"
  },
  {
    "target": "es",
    "emoji": "🙅‍♀️",
    "learningName": "mujer haciendo el gesto de no",
    "en": "Woman gesturing no",
    "zh-CN": "做拒绝手势的女性"
  },
  {
    "target": "es",
    "emoji": "💁‍♀️",
    "learningName": "mujer dando información",
    "en": "Woman giving information",
    "zh-CN": "提供信息的女性"
  },
  {
    "target": "es",
    "emoji": "🙋‍♀️",
    "learningName": "mujer con la mano levantada",
    "en": "Woman raising her hand",
    "zh-CN": "举手的女性"
  },
  {
    "target": "es",
    "emoji": "🤦‍♀️",
    "learningName": "mujer con la mano en la frente",
    "en": "Woman with her hand on her forehead",
    "zh-CN": "手放在额头上的女性"
  },
  {
    "target": "es",
    "emoji": "🧖‍♀️",
    "learningName": "mujer en una sauna",
    "en": "Woman in a sauna",
    "zh-CN": "桑拿房中的女性"
  },
  {
    "target": "es",
    "emoji": "🧗‍♀️",
    "learningName": "mujer escalando",
    "en": "Woman climbing",
    "zh-CN": "攀爬的女性"
  },
  {
    "target": "es",
    "emoji": "👩‍🌾",
    "learningName": "agricultora",
    "en": "Female farmer",
    "zh-CN": "女农民"
  },
  {
    "target": "es",
    "emoji": "👩‍🍳",
    "learningName": "cocinera",
    "en": "Female cook",
    "zh-CN": "女厨师"
  },
  {
    "target": "es",
    "emoji": "👩‍🏭",
    "learningName": "trabajadora de fábrica",
    "en": "Female factory worker",
    "zh-CN": "女工厂工人"
  },
  {
    "target": "es",
    "emoji": "👩‍🔬",
    "learningName": "científica",
    "en": "Female scientist",
    "zh-CN": "女科学家"
  },
  {
    "target": "es",
    "emoji": "👩‍💻",
    "learningName": "programadora",
    "en": "Female programmer",
    "zh-CN": "女程序员"
  },
  {
    "target": "es",
    "emoji": "👷‍♀️",
    "learningName": "trabajadora de la construcción",
    "en": "Female construction worker",
    "zh-CN": "女建筑工人"
  },
  {
    "target": "es",
    "emoji": "💇‍♀️",
    "learningName": "mujer cortándose el pelo",
    "en": "Woman getting a haircut",
    "zh-CN": "正在理发的女性"
  },
  {
    "target": "es",
    "emoji": "🚶‍♀️",
    "learningName": "mujer caminando",
    "en": "Woman walking",
    "zh-CN": "行走的女性"
  },
  {
    "target": "es",
    "emoji": "🚶‍♀️‍➡️",
    "learningName": "mujer caminando hacia la derecha",
    "en": "Woman walking to the right",
    "zh-CN": "向右行走的女性"
  },
  {
    "target": "es",
    "emoji": "🧎‍♀️",
    "learningName": "mujer de rodillas",
    "en": "Woman kneeling",
    "zh-CN": "跪地的女性"
  },
  {
    "target": "es",
    "emoji": "🧎‍♀️‍➡️",
    "learningName": "mujer de rodillas hacia la derecha",
    "en": "Woman kneeling facing right",
    "zh-CN": "面向右侧跪地的女性"
  },
  {
    "target": "es",
    "emoji": "👩‍🦯‍➡️",
    "learningName": "mujer con bastón hacia la derecha",
    "en": "Woman with a cane facing right",
    "zh-CN": "拄手杖面向右侧的女性"
  },
  {
    "target": "es",
    "emoji": "👩‍🦼",
    "learningName": "mujer en silla de ruedas eléctrica",
    "en": "Woman in a motorized wheelchair",
    "zh-CN": "乘坐电动轮椅的女性"
  },
  {
    "target": "es",
    "emoji": "👩‍🦽",
    "learningName": "mujer en silla de ruedas manual",
    "en": "Woman in a manual wheelchair",
    "zh-CN": "乘坐手动轮椅的女性"
  },
  {
    "target": "es",
    "emoji": "🏃‍♀️",
    "learningName": "mujer corriendo",
    "en": "Woman running",
    "zh-CN": "跑步的女性"
  },
  {
    "target": "es",
    "emoji": "🏃‍♀️‍➡️",
    "learningName": "mujer corriendo hacia la derecha",
    "en": "Woman running to the right",
    "zh-CN": "向右跑步的女性"
  },
  {
    "target": "es",
    "emoji": "💃",
    "learningName": "mujer bailando",
    "en": "Woman dancing",
    "zh-CN": "跳舞的女性"
  },
  {
    "target": "es",
    "emoji": "🏄‍♀️",
    "learningName": "mujer haciendo surf",
    "en": "Woman surfing",
    "zh-CN": "冲浪的女性"
  },
  {
    "target": "es",
    "emoji": "🏋️‍♀️",
    "learningName": "mujer levantando pesas",
    "en": "Woman lifting weights",
    "zh-CN": "举重的女性"
  },
  {
    "target": "es",
    "emoji": "🚵‍♀️",
    "learningName": "mujer en bicicleta de montaña",
    "en": "Woman mountain biking",
    "zh-CN": "骑山地自行车的女性"
  },
  {
    "target": "es",
    "emoji": "🧘‍♀️",
    "learningName": "mujer en posición de loto",
    "en": "Woman in the lotus position",
    "zh-CN": "呈莲花坐姿的女性"
  },
  {
    "target": "es",
    "emoji": "🤼‍♀️",
    "learningName": "mujeres luchando",
    "en": "Women wrestling",
    "zh-CN": "摔跤的女性"
  }
];

export function courseGlossOverride(
  emoji: string | undefined,
  learningName: string,
  source: LanguageCode,
  target: LanguageCode,
): string | undefined {
  if (!emoji) return undefined;
  const releaseGloss = releaseCourseGloss(emoji, learningName, source, target);
  if (releaseGloss !== undefined) return releaseGloss;
  if (target === 'en') {
    const neutralEnglish = englishCourseGloss(learningName, source);
    if (neutralEnglish !== undefined) return neutralEnglish;
  }
  const entry = COURSE_GLOSS_OVERRIDES.find(candidate =>
    candidate.emoji === emoji && candidate.target === target && candidate.learningName === learningName,
  );
  if (entry) {
    const value = source === 'en' || source === 'zh-CN' ? entry[source] : translatedGloss(entry.en, source);
    if (value !== undefined) return value;
  }
  if (target === 'es') {
    const neutral = NEUTRAL_SPANISH_ALIASES[emoji];
    if (neutral?.[0] === learningName) {
      return source === 'en' ? neutral[1] : englishCourseGloss(neutral[1], source);
    }
  }
  return reverseCourseGloss(emoji, learningName, source, target);
}
