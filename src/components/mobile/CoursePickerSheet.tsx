import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, X } from 'lucide-react';
import { COURSES, SOURCE_LANGUAGES, languageForCode, useCourse, type CourseId, type LanguageCode } from '../../course';
import { useI18n } from '../../i18n';
import { COURSE_SETUP_COPY, localizedLanguageName } from '../../lib/coursePresentation';
import { triggerGameHaptic } from '../../lib/gameHaptics';
import { cn } from '../../lib/utils';
import { useModalDialog } from './useModalDialog';

type CoursePickerSheetProps = {
  initialSourceLanguage: LanguageCode;
  initialCourseId: CourseId;
  required?: boolean;
  onClose: () => void;
  onConfirmed: () => void;
};

function availableCoursesFor(sourceLanguage: LanguageCode) {
  return COURSES.filter(
    (course) => course.sourceLanguage === sourceLanguage && course.status === 'available',
  );
}

const LANGUAGE_FLAGS: Record<LanguageCode, string> = {
  'zh-CN': '🇨🇳', en: '🇺🇸', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', ja: '🇯🇵', ko: '🇰🇷',
};

const COURSE_ART: Partial<Record<LanguageCode, string>> = {
  en: '/course-art/english.png',
  es: '/course-art/spanish.png',
  ja: '/course-art/japanese.png',
  ko: '/course-art/korean.png',
};

export function CoursePickerSheet({
  initialSourceLanguage,
  initialCourseId,
  required = false,
  onClose,
  onConfirmed,
}: CoursePickerSheetProps) {
  const { locale, setLocale } = useI18n();
  const copy = COURSE_SETUP_COPY[locale];
  const { sourceLanguage, setCourseId } = useCourse();
  const [draftSource, setDraftSource] = useState(initialSourceLanguage);
  const [sourceOpen, setSourceOpen] = useState(false);
  const [draftCourseId, setDraftCourseId] = useState<CourseId>(() => {
    const courses = availableCoursesFor(initialSourceLanguage);
    return courses.find((course) => course.id === initialCourseId)?.id ?? courses[0]?.id ?? initialCourseId;
  });
  const availableCourses = availableCoursesFor(draftSource);

  const cancel = () => {
    setLocale(sourceLanguage);
    onClose();
  };
  const dialogRef = useModalDialog({ open: true, onClose: cancel, closeOnEscape: !required });

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-picker-title"
      className="course-picker-backdrop"
      tabIndex={-1}
    >
      <div className="course-picker-sheet">
        <div className="course-picker-content">
          {!required && (
            <button type="button" className="course-picker-close" onClick={cancel} aria-label={copy.cancel}>
              <X size={20} aria-hidden />
            </button>
          )}
          <div className="course-picker-hero" aria-hidden><span>🌍</span></div>
          <h2 id="course-picker-title" className="course-picker-title">{copy.title}</h2>
          <p className="course-picker-description">{copy.body}</p>

          <div className="course-picker-section-label">{copy.sourceLabel}</div>
          <button
            type="button"
            className="course-picker-source-card"
            aria-expanded={sourceOpen}
            aria-controls="course-picker-source-list"
            data-modal-initial-focus=""
            onClick={() => {
              triggerGameHaptic('tabSelection');
              setSourceOpen((open) => !open);
            }}
          >
            <span className="course-picker-flag" aria-hidden>{LANGUAGE_FLAGS[draftSource]}</span>
            <span className="course-picker-source-copy">
              <strong>{languageForCode(draftSource).nativeName}</strong>
              <small>{copy.nativeLanguage}</small>
            </span>
            <ChevronDown className={cn('course-picker-source-chevron', sourceOpen && 'course-picker-source-chevron-open')} size={20} aria-hidden />
          </button>
          {sourceOpen && (
            <div id="course-picker-source-list" className="course-picker-source-list" role="radiogroup" aria-label={copy.sourceLabel}>
              {SOURCE_LANGUAGES.filter((language) => availableCoursesFor(language.id).length > 0).map((language) => (
                <button
                  key={language.id}
                  type="button"
                  role="radio"
                  aria-checked={draftSource === language.id}
                  className={cn('course-picker-source-option', draftSource === language.id && 'course-picker-source-option-selected')}
                  onClick={() => {
                    triggerGameHaptic('tabSelection');
                    const nextCourses = availableCoursesFor(language.id);
                    const previousTarget = COURSES.find((course) => course.id === draftCourseId)?.targetLanguage;
                    const next = nextCourses.find((course) => course.targetLanguage === previousTarget) ?? nextCourses[0];
                    if (!next) return;
                    setDraftSource(language.id);
                    setDraftCourseId(next.id);
                    setLocale(language.id);
                    setSourceOpen(false);
                  }}
                >
                  <span className="course-picker-source-option-flag" aria-hidden>{LANGUAGE_FLAGS[language.id]}</span>
                  <span>{language.label}</span>
                </button>
              ))}
            </div>
          )}

          <div className="course-picker-section-label course-picker-target-label">{copy.targetLabel}</div>
          <div className="course-picker-course-list" role="radiogroup" aria-label={copy.targetLabel}>
            {availableCourses.map((course) => {
              const language = languageForCode(course.targetLanguage);
              return (
                <button
                  key={course.id}
                  type="button"
                  role="radio"
                  aria-checked={draftCourseId === course.id}
                  aria-label={`${localizedLanguageName(locale, draftSource)} → ${localizedLanguageName(locale, course.targetLanguage)}`}
                  className={cn('course-picker-course-card', draftCourseId === course.id && 'course-picker-course-card-selected')}
                  onClick={() => {
                    triggerGameHaptic('tabSelection');
                    setDraftCourseId(course.id);
                  }}
                >
                  <span className="course-picker-course-radio" aria-hidden />
                  <span className="course-picker-flag" aria-hidden>{LANGUAGE_FLAGS[course.targetLanguage]}</span>
                  <span className="course-picker-course-copy">
                    <strong>{localizedLanguageName(locale, draftSource)} → {localizedLanguageName(locale, course.targetLanguage)}</strong>
                    <small>{language.nativeName}</small>
                  </span>
                  {COURSE_ART[course.targetLanguage] && (
                    <img className="course-picker-course-art" src={COURSE_ART[course.targetLanguage]} alt="" aria-hidden />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          className="home-page-play course-picker-confirm"
          onClick={() => {
            setCourseId(draftCourseId);
            onConfirmed();
          }}
        >
          {copy.start}
        </button>
      </div>
    </div>,
    document.body,
  );
}
