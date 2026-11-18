import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useI18n } from './i18n';
import { trackCoreEvent } from './lib/coreAnalytics';
import {
  COURSES,
  SOURCE_LANGUAGES,
  type Course,
  type CourseId,
  type LanguageCode,
} from './courseConfig';

export { COURSES, LANGUAGES, SOURCE_LANGUAGES, languageForCode } from './courseConfig';
export type { Course, CourseId, LanguageCode, LanguageDefinition } from './courseConfig';

export const COURSE_STORAGE_KEY = 'match3-learning-course';
export const SOURCE_LANGUAGE_STORAGE_KEY = 'match3-learning-source-language';

let activeCourseId: CourseId = 'en-es';

export function getActiveCourseId(): CourseId {
  return activeCourseId;
}

export function coursesForSourceLanguage(sourceLanguage: LanguageCode): readonly Course[] {
  return COURSES.filter((course) => course.sourceLanguage === sourceLanguage);
}

function savedCourse(): Course | undefined {
  try {
    const stored = localStorage.getItem(COURSE_STORAGE_KEY);
    return COURSES.find((course) => course.id === stored && course.status === 'available');
  } catch {
    return undefined;
  }
}

export function hasSavedCourseSelection(): boolean {
  return savedCourse() !== undefined;
}

function loadCourse(): CourseId {
  return savedCourse()?.id ?? 'en-es';
}

function loadSourceLanguage(): LanguageCode {
  const course = savedCourse();
  if (course) return course.sourceLanguage;
  try {
    const stored = localStorage.getItem(SOURCE_LANGUAGE_STORAGE_KEY);
    if (SOURCE_LANGUAGES.some((language) => language.id === stored)) return stored as LanguageCode;
  } catch {
    // Ignore unavailable storage and use the default source language.
  }
  return 'en';
}

type CourseContextValue = {
  courseId: CourseId;
  course: Course;
  sourceLanguage: LanguageCode;
  setCourseId: (courseId: CourseId) => void;
  setSourceLanguage: (language: LanguageCode) => void;
};

const CourseContext = createContext<CourseContextValue | null>(null);

export function CourseProvider({ children }: { children: React.ReactNode }) {
  const { setLocale } = useI18n();
  const [courseId, setCourseState] = useState<CourseId>(() => loadCourse());
  const [sourceLanguage, setSourceLanguageState] = useState<LanguageCode>(() => loadSourceLanguage());
  const analyticsSelectionRef = useRef({ selected: hasSavedCourseSelection(), courseId });
  activeCourseId = courseId;

  useEffect(() => {
    if (hasSavedCourseSelection()) setLocale(sourceLanguage);
  }, [sourceLanguage, setLocale]);

  const setCourseId = useCallback((next: CourseId) => {
    activeCourseId = next;
    const nextCourse = COURSES.find((course) => course.id === next);
    if (nextCourse) {
      setSourceLanguageState(nextCourse.sourceLanguage);
      try {
        localStorage.setItem(SOURCE_LANGUAGE_STORAGE_KEY, nextCourse.sourceLanguage);
      } catch {
        // Ignore unavailable storage; the selection still applies this session.
      }
    }
    if (nextCourse?.status === 'available') {
      const previous = analyticsSelectionRef.current;
      if (!previous.selected) {
        trackCoreEvent('course_selected', {
          source_language: nextCourse.sourceLanguage,
          target_language: nextCourse.targetLanguage,
        });
      } else if (previous.courseId !== next) {
        const previousCourse = COURSES.find((course) => course.id === previous.courseId);
        trackCoreEvent('language_switched', {
          from_language: previousCourse?.targetLanguage ?? previous.courseId,
          to_language: nextCourse.targetLanguage,
        });
      }
      analyticsSelectionRef.current = { selected: true, courseId: next };
    }
    setCourseState(next);
    try {
      localStorage.setItem(COURSE_STORAGE_KEY, next);
    } catch {
      // Ignore unavailable storage; the selection still applies this session.
    }
  }, []);

  const setSourceLanguage = useCallback((next: LanguageCode) => {
    setSourceLanguageState(next);
    try {
      localStorage.setItem(SOURCE_LANGUAGE_STORAGE_KEY, next);
    } catch {
      // Ignore unavailable storage; the selection still applies this session.
    }
  }, []);

  const course = COURSES.find((item) => item.id === courseId) ?? COURSES[0];
  const value = useMemo(
    () => ({ courseId, course, sourceLanguage, setCourseId, setSourceLanguage }),
    [courseId, course, sourceLanguage, setCourseId, setSourceLanguage],
  );
  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}

export function useCourse(): CourseContextValue {
  const context = useContext(CourseContext);
  if (!context) throw new Error('useCourse must be used within CourseProvider');
  return context;
}
