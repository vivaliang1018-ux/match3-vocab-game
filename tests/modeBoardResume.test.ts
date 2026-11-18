import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import {
  hasPaidModeBoard,
  loadModeBoardSnapshot,
  removeModeBoardSnapshot,
  saveModeBoardSnapshot,
  validModeBoardSnapshot,
  type ModeBoardSnapshot,
} from '../src/lib/modeBoardResume';

beforeEach(() => {
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    },
  });
});

function snapshot(mode: 'mood' | 'category', categoryId: string | null): ModeBoardSnapshot {
  const items = Array.from({ length: 6 }, (_, i) => ({ id: `word-${i}`, word: `word ${i}` }));
  return {
    version: 1,
    userId: 'learner',
    mode,
    categoryId,
    paletteId: mode === 'mood' ? 'blue' : null,
    grid: Array.from({ length: 7 }, (_, r) =>
      Array.from({ length: 7 }, (_, c) => ({ id: `${r}-${c}`, itemId: items[(r + c) % 6].id }))),
    gameItems: items,
    itemHitCount: { 'word-0': 1 },
    playOwed: false,
    savedAt: Date.now(),
  };
}

test('paid Mood board resumes at zero remaining plays without charging again', () => {
  const board = snapshot('mood', null);
  saveModeBoardSnapshot(board);
  assert.equal(hasPaidModeBoard('mood', 'learner'), true);
  assert.deepEqual(loadModeBoardSnapshot('mood', 'learner'), board);
  assert.equal(validModeBoardSnapshot(board, board.gameItems), true);
  removeModeBoardSnapshot('mood', 'learner');
  assert.equal(hasPaidModeBoard('mood', 'learner'), false);
});

test('Category snapshots are isolated by category and account', () => {
  saveModeBoardSnapshot(snapshot('category', 'animals'));
  assert.equal(hasPaidModeBoard('category', 'learner', 'animals'), true);
  assert.equal(hasPaidModeBoard('category', 'learner', 'food'), false);
  assert.equal(hasPaidModeBoard('category', 'other', 'animals'), false);
});

test('stale or malformed board items are rejected', () => {
  const board = snapshot('mood', null);
  assert.equal(validModeBoardSnapshot(board, board.gameItems.slice(1)), false);
  board.grid[0][0].itemId = 'unknown';
  assert.equal(validModeBoardSnapshot(board, board.gameItems), false);
});
