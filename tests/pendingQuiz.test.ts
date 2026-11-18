import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { clearPendingQuiz, loadPendingQuiz, savePendingQuiz, saveQuizProgress, type PendingQuiz, type QuizProgress } from '../src/lib/pendingQuiz';

beforeEach(() => {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  } });
});

function quiz(): PendingQuiz {
  return { version: 1, id: 'round-1', courseId: 'en-es', userId: 'guest',
    items: Array.from({ length: 6 }, (_, i) => ({ id: `word-${i}`, word: `palabra ${i}` })),
    kind: 'pick', mode: 'random', level: 1, categoryId: null, paletteId: 'blue',
    forcedReview: false, attemptLost: false, hitCount: {} };
}
function progress(): QuizProgress {
  const ids = quiz().items.map(item => item.id);
  return { orderIds: ids, emojiIds: [...ids].reverse(), connectedIds: [], pickIndex: 3,
    answeredCount: 3, choiceIds: [], mistakenIds: ['word-1'], completed: false };
}

test('unfinished quiz and question order survive reload, isolated by course and account', () => {
  const q = quiz(); savePendingQuiz(q); saveQuizProgress(q, progress());
  assert.deepEqual(loadPendingQuiz('en-es', null), { ...q, progress: progress() });
  assert.equal(loadPendingQuiz('en-ja', null), null);
  assert.equal(loadPendingQuiz('en-es', 'someone'), null);
});

test('sixth accepted answer survives an interruption before settlement', () => {
  const q = quiz(); savePendingQuiz(q);
  saveQuizProgress(q, { ...progress(), answeredCount: 6, pickIndex: 5, completed: true });
  assert.equal(loadPendingQuiz('en-es', null)?.progress?.completed, true);
  clearPendingQuiz('en-es', null);
  saveQuizProgress(q, progress());
  assert.equal(loadPendingQuiz('en-es', null), null, 'unmounted stale UI cannot recreate a settled quiz');
});

test('connect quiz preserves answered pairs and mistaken words', () => {
  const q = { ...quiz(), kind: 'connect' as const }; savePendingQuiz(q);
  const p = { ...progress(), connectedIds: ['word-0', 'word-2'], pickIndex: 0, answeredCount: 0 };
  saveQuizProgress(q, p);
  assert.deepEqual(loadPendingQuiz('en-es', null)?.progress, p);
});

test('old UI cannot overwrite a new quiz, and malformed progress is rejected', () => {
  const q = quiz(); savePendingQuiz({ ...q, id: 'round-2' });
  saveQuizProgress(q, progress());
  assert.equal(loadPendingQuiz('en-es', null)?.progress, undefined);
  savePendingQuiz({ ...q, progress: { ...progress(), orderIds: ['unknown'] } });
  assert.equal(loadPendingQuiz('en-es', null), null);
});

test('inconsistent completed state cannot strand the player on an already answered sixth question', () => {
  const q = quiz();
  savePendingQuiz({ ...q, progress: { ...progress(), answeredCount: 6, pickIndex: 5, completed: false } });
  assert.equal(loadPendingQuiz('en-es', null), null);
});
