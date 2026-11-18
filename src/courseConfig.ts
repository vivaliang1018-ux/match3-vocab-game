/** Shared, framework-free course catalog used by every client surface. */
export type LanguageCode = 'zh-CN' | 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko';
export type CourseId = `${LanguageCode}-${LanguageCode}`;

export type LanguageDefinition = {
  id: LanguageCode;
  nativeName: string;
  englishName: string;
  speechLocale: string;
  status: 'available' | 'coming-soon';
};

export type Course = {
  id: CourseId;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  label: string;
  status: 'available' | 'coming-soon';
};

export const LANGUAGES: readonly LanguageDefinition[] = [
  { id: 'zh-CN', nativeName: '中文', englishName: 'Chinese', speechLocale: 'zh-CN', status: 'available' },
  { id: 'en', nativeName: 'English', englishName: 'English', speechLocale: 'en-US', status: 'available' },
  { id: 'es', nativeName: 'Español', englishName: 'Spanish', speechLocale: 'es-ES', status: 'available' },
  { id: 'ja', nativeName: '日本語', englishName: 'Japanese', speechLocale: 'ja-JP', status: 'available' },
  { id: 'ko', nativeName: '한국어', englishName: 'Korean', speechLocale: 'ko-KR', status: 'available' },
  { id: 'fr', nativeName: 'Français', englishName: 'French', speechLocale: 'fr-FR', status: 'available' },
  { id: 'de', nativeName: 'Deutsch', englishName: 'German', speechLocale: 'de-DE', status: 'available' },
];

export const TARGET_LANGUAGES: readonly LanguageCode[] = ['en', 'es', 'ja', 'ko'];
export const RECORDED_TARGET_LANGUAGES = new Set<LanguageCode>(['en', 'es', 'ja', 'ko']);

/** A target becomes selectable only after its complete recorded library passes import QA. */
export const COURSES: readonly Course[] = LANGUAGES.flatMap((source) =>
  TARGET_LANGUAGES.filter((target) => target !== source.id).map((target) => {
    const targetLanguage = LANGUAGES.find((language) => language.id === target)!;
    return {
      id: `${source.id}-${target}` as CourseId,
      sourceLanguage: source.id,
      targetLanguage: target,
      label: `${source.nativeName} → ${targetLanguage.nativeName}`,
      status: RECORDED_TARGET_LANGUAGES.has(target) ? 'available' : 'coming-soon',
    };
  }),
);

export const SOURCE_LANGUAGES = LANGUAGES.map(({ id, nativeName: label }) => ({ id, label }));

export function languageForCode(code: LanguageCode): LanguageDefinition {
  return LANGUAGES.find((language) => language.id === code) ?? LANGUAGES[0];
}
