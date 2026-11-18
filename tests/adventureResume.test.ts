import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { hasAdventurePayment, hasPaidAdventureBoard, isPaidPlayableAdventureBoard } from '../src/lib/adventureResume';
import { defaultStaminaState, spendStamina, tickStamina } from '../src/lib/stamina';

const values = new Map<string, string>();
beforeEach(() => {
  values.clear();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  } });
});
const paid = { staminaOwed: false, staminaPaid: true, adventurePlayable: true, attemptLost: false, movesLeft: 9 };

test('legacy background previews are not proof of payment, actual matched legacy boards are', () => {
  assert.equal(hasAdventurePayment({}), false);
  assert.equal(isPaidPlayableAdventureBoard({ ...paid, staminaPaid: undefined, itemHitCount: {} }), false);
  assert.equal(isPaidPlayableAdventureBoard({ ...paid, staminaPaid: undefined, itemHitCount: { word: 1 } }), true);
  assert.equal(hasAdventurePayment({ itemHitCount: { word: 0 } }), false);
  assert.equal(hasAdventurePayment({ staminaPaid: false, itemHitCount: { word: 1 } }), false);
});

test('only a paid, unfinished, playable attempt is a free continuation', () => {
  assert.equal(isPaidPlayableAdventureBoard(paid), true);
  for (const changed of [{ staminaOwed: true }, { adventurePlayable: false },
    { attemptLost: true }, { movesLeft: 0 }, { movesLeft: -1 }]) {
    assert.equal(isPaidPlayableAdventureBoard({ ...paid, ...changed }), false);
  }
  assert.equal(isPaidPlayableAdventureBoard({ staminaOwed: false }), false);
});

test('home resume hint checks account, course, paid attempt and rectangular grid', () => {
  const key = 'matchingo-adventure-board-v1:en-es:guest';
  const board = { ...paid, version: 1, userId: 'guest', gameItems: Array(6).fill({}), grid: Array.from({ length: 7 }, () => Array(7).fill({})) };
  values.set(key, JSON.stringify(board));
  assert.equal(hasPaidAdventureBoard('en-es', null), true);
  assert.equal(hasPaidAdventureBoard('en-ja', null), false);
  assert.equal(hasPaidAdventureBoard('en-es', 'other'), false);
  values.set(key, JSON.stringify({ ...board, attemptLost: true }));
  assert.equal(hasPaidAdventureBoard('en-es', null), false);
  values.set(key, JSON.stringify({ ...board, grid: Array(7).fill([]) }));
  assert.equal(hasPaidAdventureBoard('en-es', null), false);
});

test('zero stamina stays empty on the same day; midnight restores three, not a free new board', () => {
  const beforeMidnight = new Date(2026, 9, 16, 23, 46).getTime();
  const empty = { ...defaultStaminaState(beforeMidnight), value: 0, spentToday: 3 };
  assert.equal(tickStamina(empty, beforeMidnight + 60_000).value, 0);
  assert.equal(spendStamina(empty, 1, beforeMidnight + 60_000), null);
  const afterMidnight = new Date(2026, 9, 17, 0, 18).getTime();
  assert.equal(tickStamina(empty, afterMidnight).value, 3);
  assert.equal(spendStamina(empty, 1, afterMidnight)?.value, 2);
});
