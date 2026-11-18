import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { loadRoundLearnedIds, saveRoundLearnedIds } from '../src/lib/roundLearned';
import { loadModeUnlocks, saveModeUnlocks } from '../src/lib/modeUnlocks';
import { hydrateMatch3Memories, saveWordMemoriesForScope, recordWordExposure } from '../src/lib/ebbinghausMemory';
import { COURSES } from '../src/courseConfig';
import { courseCloudStateDocId } from '../src/lib/courseCloudProgress';
import {
  completeCategoryCycleBoard,
  loadCategoryCycleProgress,
  saveCategoryCycleProgress,
} from '../src/lib/categoryCycleProgress';

beforeEach(() => {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  } });
});

test('same emoji learned in English does not unlock Spanish or Korean', () => {
  saveRoundLearnedIds(['emoji-animal-cat'], 'user', 'zh-CN-en');
  saveModeUnlocks({ adventureClears: 3, reviewUnlockSeen: true,
    categoryUnlockSeen: true, pendingForcedReview: false }, 'user', 'zh-CN-en');
  assert.deepEqual(loadRoundLearnedIds('user', 'zh-CN-es'), []);
  assert.deepEqual(loadRoundLearnedIds('user', 'zh-CN-ko'), []);
  assert.equal(loadModeUnlocks('user', 'zh-CN-es').adventureClears, 0);
  saveRoundLearnedIds(['emoji-food-bread'], 'user', 'zh-CN-es');
  assert.deepEqual(loadRoundLearnedIds('user', 'zh-CN-en'), ['emoji-animal-cat']);
});

test('guest memories are claimed only within the explicitly captured course', () => {
  saveWordMemoriesForScope(recordWordExposure(new Map(), 'gato'), 'guest', 'zh-CN-es');
  assert.equal(hydrateMatch3Memories('user', 'zh-CN-ko').map.size, 0);
  assert.equal(hydrateMatch3Memories('user', 'zh-CN-es').map.has('gato'), true);
  assert.equal(hydrateMatch3Memories('other', 'zh-CN-es').map.size, 0);
});

test('every course has a distinct cloud document and never uses legacy state', () => {
  const ids = COURSES.map((course) => courseCloudStateDocId(course.id));
  assert.equal(new Set(ids).size, COURSES.length);
  assert.equal(ids.includes('state'), false);
});

test('the same category keeps separate cycle progress in every course', () => {
  const categoryId = 'animal-park';
  const itemIds = ['cat', 'dog', 'bear', 'lion', 'tiger', 'fox'];
  const spanish = completeCategoryCycleBoard(
    loadCategoryCycleProgress('user', 'zh-CN-es'),
    categoryId,
    itemIds,
    itemIds.slice(0, 3),
  ).progress;
  saveCategoryCycleProgress(spanish, 'user', 'zh-CN-es');

  assert.deepEqual(
    loadCategoryCycleProgress('user', 'zh-CN-es').categories[categoryId]?.clearedItemIds,
    itemIds.slice(0, 3),
  );
  assert.equal(
    loadCategoryCycleProgress('user', 'zh-CN-ja').categories[categoryId],
    undefined,
  );
});
