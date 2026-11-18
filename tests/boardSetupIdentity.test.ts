import assert from 'node:assert/strict';
import { test } from 'node:test';
import { boardSetupIdentity } from '../src/lib/boardSetupIdentity';

const base = {
  courseId: 'zh-en',
  userId: 'learner',
  categoryId: 'animals',
  moodPaletteId: 'blue',
} as const;

test('adventure board identity changes only for an explicit destination change', () => {
  const identity = boardSetupIdentity({ ...base, mode: 'random' });
  assert.equal(identity, boardSetupIdentity({ ...base, mode: 'random' }));
  assert.notEqual(identity, boardSetupIdentity({ ...base, courseId: 'zh-ja', mode: 'random' }));
  assert.notEqual(identity, boardSetupIdentity({ ...base, userId: 'other', mode: 'random' }));
});

test('mode-specific board identity includes only the selected destination', () => {
  const category = boardSetupIdentity({ ...base, mode: 'category' });
  assert.notEqual(category, boardSetupIdentity({ ...base, mode: 'category', categoryId: 'food' }));

  const mood = boardSetupIdentity({ ...base, mode: 'mood' });
  assert.notEqual(mood, boardSetupIdentity({ ...base, mode: 'mood', moodPaletteId: 'pink' }));
  assert.notEqual(category, mood);
});
