import type { CourseId } from '../courseConfig';
import type { ChallengeMode, QuizKind, WordItem } from '../types/game';
import type { MoodPaletteId } from './moodBoard';

export type QuizProgress = {
  orderIds: string[];
  emojiIds: string[];
  connectedIds: string[];
  pickIndex: number;
  answeredCount: number;
  choiceIds: string[][];
  mistakenIds: string[];
  completed: boolean;
};

export type PendingQuiz = {
  version: 1;
  id: string;
  courseId: CourseId;
  userId: string;
  items: WordItem[];
  kind: QuizKind;
  mode: ChallengeMode;
  level: number;
  categoryId: string | null;
  paletteId: MoodPaletteId;
  attemptLost: boolean;
  forcedReview: boolean;
  hitCount: Record<string, number>;
  progress?: QuizProgress;
};

const key = (courseId: CourseId, userId: string | null) =>
  `lingomatch-pending-quiz-v1:${courseId}:${userId || 'guest'}`;

export function loadPendingQuiz(courseId: CourseId, userId: string | null): PendingQuiz | null {
  try {
    const raw = localStorage.getItem(key(courseId, userId));
    if (!raw) return null;
    const quiz = JSON.parse(raw) as PendingQuiz;
    if (quiz.version !== 1 || quiz.courseId !== courseId || quiz.userId !== (userId || 'guest') ||
      typeof quiz.id !== 'string' || !Array.isArray(quiz.items) || quiz.items.length !== 6 ||
      quiz.items.some(item => !item || typeof item.id !== 'string' || typeof item.word !== 'string') ||
      new Set(quiz.items.map(item => item.id)).size !== 6 ||
      !['pick', 'connect'].includes(quiz.kind) ||
      !['random', 'review', 'category', 'mood'].includes(quiz.mode) ||
      !Number.isInteger(quiz.level) || quiz.level < 1 ||
      !quiz.hitCount || typeof quiz.hitCount !== 'object' ||
      Object.values(quiz.hitCount).some(value => typeof value !== 'number' || !Number.isFinite(value) || value < 0) ||
      typeof quiz.attemptLost !== 'boolean' || typeof quiz.forcedReview !== 'boolean' ||
      (quiz.categoryId !== null && typeof quiz.categoryId !== 'string') ||
      !['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white', 'rainbow'].includes(quiz.paletteId)) return null;
    const p = quiz.progress;
    if (p) {
      const ids = new Set(quiz.items.map(item => item.id));
      const permutation = (values: string[]) => Array.isArray(values) && values.length === 6 &&
        new Set(values).size === 6 && values.every(id => ids.has(id));
      if (!permutation(p.orderIds) || !permutation(p.emojiIds) ||
        !Array.isArray(p.connectedIds) || p.connectedIds.some(id => !ids.has(id)) ||
        !Array.isArray(p.mistakenIds) || p.mistakenIds.some(id => !ids.has(id)) ||
        !Array.isArray(p.choiceIds) || p.choiceIds.some(row => !Array.isArray(row) || row.some(id => typeof id !== 'string')) ||
        !Number.isInteger(p.answeredCount) || p.answeredCount < 0 || p.answeredCount > 6 ||
        !Number.isInteger(p.pickIndex) || p.pickIndex < 0 || p.pickIndex > Math.min(p.answeredCount, 5) ||
        typeof p.completed !== 'boolean' ||
        p.completed !== (quiz.kind === 'pick' ? p.answeredCount === 6 : new Set(p.connectedIds).size === 6)) return null;
    }
    return quiz;
  } catch { return null; }
}

export function savePendingQuiz(quiz: PendingQuiz): void {
  localStorage.setItem(key(quiz.courseId, quiz.userId === 'guest' ? null : quiz.userId), JSON.stringify(quiz));
}

/** Persist answers immediately, before speech/animations finish. Ignore stale unmounted quizzes. */
export function saveQuizProgress(quiz: PendingQuiz, progress: QuizProgress): void {
  const current = loadPendingQuiz(quiz.courseId, quiz.userId === 'guest' ? null : quiz.userId);
  if (current?.id === quiz.id) savePendingQuiz({ ...current, progress });
}

export function clearPendingQuiz(courseId: CourseId, userId: string | null): void {
  localStorage.removeItem(key(courseId, userId));
}
