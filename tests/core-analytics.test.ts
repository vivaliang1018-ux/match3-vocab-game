import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createCoreEventLedger, quizAnalyticsScore } from '../src/lib/coreAnalyticsEvents';

test('repeated render/callback reports each milestone once per attempt', () => {
  const first = createCoreEventLedger();
  for (const event of ['game_started', 'set_completed', 'quiz_completed', 'review_started'] as const) {
    assert.equal(first(event, 'course:board:attempt1'), true);
    assert.equal(first(event, 'course:board:attempt1'), false);
    assert.equal(first(event, 'course:board:attempt2'), true);
  }
});

test('word set and course changes are separate occurrences', () => {
  const first = createCoreEventLedger();
  assert.equal(first('game_started', 'en-es:set1'), true);
  assert.equal(first('game_started', 'en-es:set2'), true);
  assert.equal(first('game_started', 'en-ja:set1'), true);
});

test('quiz score measures distinct words recalled correctly on first try', () => {
  assert.deepEqual(quizAnalyticsScore(['a', 'b', 'c'], ['b', 'b', 'unknown']), { score: 2, accuracy: 66.67 });
  assert.deepEqual(quizAnalyticsScore(['a', 'b', 'c'], []), { score: 3, accuracy: 100 });
  assert.deepEqual(quizAnalyticsScore(['a', 'b', 'c'], ['a', 'b', 'c']), { score: 0, accuracy: 0 });
  assert.deepEqual(quizAnalyticsScore([], []), { score: 0, accuracy: 0 });
});
