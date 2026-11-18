import { getEmojiLearningTranslation } from '../data/emojiLocalizedNames';
import { COURSES, type CourseId, type LanguageCode } from '../courseConfig';
import { courseGlossOverride } from '../data/courseGlossOverrides';

export function courseForId(courseId: CourseId) {
  return COURSES.find((course) => course.id === courseId) ?? COURSES[0];
}

export function learningLanguageForCourse(courseId: CourseId): LanguageCode {
  return courseForId(courseId).targetLanguage;
}

export function sourceWordForCourse(
  item: { word: string; emoji?: string; cn?: string },
  courseId: CourseId,
): string | undefined {
  const course = courseForId(courseId);
  if (course.sourceLanguage === course.targetLanguage) return undefined;
  const override = courseGlossOverride(
    item.emoji,
    learningWordForCourse(item, courseId),
    course.sourceLanguage,
    course.targetLanguage,
  );
  if (override !== undefined) return override;
  if (course.sourceLanguage === 'en') return item.word;
  if (course.sourceLanguage === 'zh-CN') return item.cn ?? item.word;
  if (item.emoji) {
    return getEmojiLearningTranslation(item, course.sourceLanguage) ?? item.word;
  }
  return item.word;
}

export function learningWordForCourse(
  item: { word: string; emoji?: string; cn?: string },
  courseId: CourseId,
): string {
  const targetLanguage = learningLanguageForCourse(courseId);
  if (targetLanguage !== 'en' && item.emoji) {
    return getEmojiLearningTranslation(item, targetLanguage) ?? item.word;
  }
  return item.word;
}
