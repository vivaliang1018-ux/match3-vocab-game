import type { LanguageCode } from '../course';
import type { Locale } from '../i18n';

type CourseSetupCopy = {
  title: string;
  body: string;
  sourceLabel: string;
  nativeLanguage: string;
  targetLabel: string;
  start: string;
  cancel: string;
  soon: string;
  currentCourse: string;
  changeCourse: string;
};

const LANGUAGE_NAMES: Record<Locale, Record<LanguageCode, string>> = {
  en: { 'zh-CN': 'Chinese', en: 'English', es: 'Spanish', fr: 'French', de: 'German', ja: 'Japanese', ko: 'Korean' },
  'zh-CN': { 'zh-CN': '中文', en: '英语', es: '西班牙语', fr: '法语', de: '德语', ja: '日语', ko: '韩语' },
  es: { 'zh-CN': 'chino', en: 'inglés', es: 'español', fr: 'francés', de: 'alemán', ja: 'japonés', ko: 'coreano' },
  fr: { 'zh-CN': 'le chinois', en: 'l’anglais', es: 'l’espagnol', fr: 'le français', de: 'l’allemand', ja: 'le japonais', ko: 'le coréen' },
  de: { 'zh-CN': 'Chinesisch', en: 'Englisch', es: 'Spanisch', fr: 'Französisch', de: 'Deutsch', ja: 'Japanisch', ko: 'Koreanisch' },
  ja: { 'zh-CN': '中国語', en: '英語', es: 'スペイン語', fr: 'フランス語', de: 'ドイツ語', ja: '日本語', ko: '韓国語' },
  ko: { 'zh-CN': '중국어', en: '영어', es: '스페인어', fr: '프랑스어', de: '독일어', ja: '일본어', ko: '한국어' },
};

export const COURSE_SETUP_COPY: Record<Locale, CourseSetupCopy> = {
  en: { title: 'Choose your language adventure', body: 'Choose the language you use, then the language you want to learn.', sourceLabel: 'I speak', nativeLanguage: 'My language', targetLabel: 'I want to learn', start: 'Start adventure!', cancel: 'Cancel', soon: 'Soon', currentCourse: 'Learning course', changeCourse: 'Change course' },
  'zh-CN': { title: '选择你的语言冒险', body: '先选择你使用的语言，再选择你想学习的语言。', sourceLabel: '我使用', nativeLanguage: '我的语言', targetLabel: '我想学习', start: '开始冒险！', cancel: '取消', soon: '即将开放', currentCourse: '学习课程', changeCourse: '切换课程' },
  es: { title: 'Elige tu aventura de idiomas', body: 'Elige el idioma que usas y después el que quieres aprender.', sourceLabel: 'Hablo', nativeLanguage: 'Mi idioma', targetLabel: 'Quiero aprender', start: '¡Empezar la aventura!', cancel: 'Cancelar', soon: 'Próximamente', currentCourse: 'Curso de aprendizaje', changeCourse: 'Cambiar curso' },
  fr: { title: 'Choisis ton aventure linguistique', body: 'Choisis la langue que tu utilises, puis celle que tu veux apprendre.', sourceLabel: 'Je parle', nativeLanguage: 'Ma langue', targetLabel: 'Je veux apprendre', start: 'Lancer l’aventure !', cancel: 'Annuler', soon: 'Bientôt', currentCourse: 'Cours de langue', changeCourse: 'Changer de cours' },
  de: { title: 'Wähle dein Sprachenabenteuer', body: 'Wähle zuerst deine Sprache und dann die Sprache, die du lernen möchtest.', sourceLabel: 'Ich spreche', nativeLanguage: 'Meine Sprache', targetLabel: 'Ich möchte lernen', start: 'Abenteuer starten!', cancel: 'Abbrechen', soon: 'Bald', currentCourse: 'Sprachkurs', changeCourse: 'Kurs wechseln' },
  ja: { title: '言語の冒険を選ぼう', body: '使用する言語を選び、次に学びたい言語を選んでください。', sourceLabel: '話す言語', nativeLanguage: '自分の言語', targetLabel: '学びたい言語', start: '冒険を始めよう！', cancel: 'キャンセル', soon: '近日公開', currentCourse: '学習コース', changeCourse: 'コースを変更' },
  ko: { title: '언어 모험 선택', body: '사용하는 언어를 선택한 다음 배우고 싶은 언어를 선택하세요.', sourceLabel: '내가 쓰는 언어', nativeLanguage: '내 언어', targetLabel: '배우고 싶은 언어', start: '모험 시작!', cancel: '취소', soon: '곧 제공', currentCourse: '학습 코스', changeCourse: '코스 변경' },
};

export function localizedLanguageName(locale: Locale, language: LanguageCode): string {
  return LANGUAGE_NAMES[locale][language];
}

export const HOME_SCENE_COPY: Record<Locale, { edit: string; reset: string; hear: (word: string) => string; move: (word: string) => string }> = {
  en: { edit: 'Edit Scene', reset: 'Reset', hear: (word) => `Hear ${word}`, move: (word) => `Move or pinch to resize ${word}` },
  'zh-CN': { edit: '编辑场景', reset: '重置', hear: (word) => `聆听${word}`, move: (word) => `拖动或双指缩放${word}` },
  es: { edit: 'Editar escena', reset: 'Restablecer', hear: (word) => `Escuchar ${word}`, move: (word) => `Mueve o pellizca para cambiar el tamaño de ${word}` },
  fr: { edit: 'Modifier la scène', reset: 'Réinitialiser', hear: (word) => `Écouter ${word}`, move: (word) => `Déplace ou pince pour redimensionner ${word}` },
  de: { edit: 'Szene bearbeiten', reset: 'Zurücksetzen', hear: (word) => `${word} anhören`, move: (word) => `${word} verschieben oder mit zwei Fingern skalieren` },
  ja: { edit: 'シーンを編集', reset: 'リセット', hear: (word) => `${word}の発音を聞く`, move: (word) => `${word}を移動またはピンチで拡大縮小` },
  ko: { edit: '장면 편집', reset: '초기화', hear: (word) => `${word} 발음 듣기`, move: (word) => `${word} 이동하거나 두 손가락으로 크기 조절` },
};

export function homeCourseHeadline(target: LanguageCode): { primary: string; secondary: string } {
  const language = localizedLanguageName('en', target);
  return { primary: 'Match emoji.', secondary: `Learn ${language}. Spark joy.` };
}
