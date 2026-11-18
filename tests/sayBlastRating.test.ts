import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateSayBlastRating } from '../src/lib/sayBlastRating';

test('Say & Blast awards three stars at 70% accuracy with no target minimum', () => {
  assert.equal(calculateSayBlastRating({ accuracy: 0.7 }).stars, 3);
  assert.equal(calculateSayBlastRating({ accuracy: 0.699 }).stars, 2);
  assert.equal(calculateSayBlastRating({ accuracy: 0.5 }).stars, 2);
  assert.equal(calculateSayBlastRating({ accuracy: 0.499 }).stars, 1);
});
