import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  grantDailySayBlastRewardState,
  initialDailyQuota,
  parseDailyQuota,
  resetDailyQuotaFromRewardedAdState,
  spendDailyQuotaState,
} from '../src/lib/dailyQuotaPolicy';
import { defaultStaminaState } from '../src/lib/stamina';

const now = new Date(2026, 9, 10, 9).getTime();
const dayKey = '2026-10-10';

test('cloud document wins over stale local usage on another device', () => {
  const local = { ...defaultStaminaState(now), spentToday: 1 };
  const cloud = { dayKey, staminaValue: 1, spentToday: 4, sayBlastRewardsToday: 2, adResetsToday: 1, moodPlaysToday: 1 };
  assert.deepEqual(initialDailyQuota(cloud, local, 0, dayKey), cloud);
  assert.deepEqual(initialDailyQuota(null, local, 0, dayKey), {
    dayKey, staminaValue: 3, spentToday: 1, sayBlastRewardsToday: 0, adResetsToday: 0, moodPlaysToday: 0,
  });
  assert.equal(initialDailyQuota(null, local, 0, '2026-10-11').spentToday, 0);
});

test('three stamina, Say & Blast refill, and two rewarded-ad resets are shared across modes', () => {
  let quota = parseDailyQuota({}, dayKey);
  for (const mode of ['random', 'category', 'random'] as const) {
    quota = spendDailyQuotaState(quota, mode, false)!;
  }
  assert.equal(quota.spentToday, 3);
  assert.equal(spendDailyQuotaState(quota, 'random', false), null);
  quota = grantDailySayBlastRewardState(quota)!;
  assert.equal(quota.staminaValue, 1);
  quota = spendDailyQuotaState(quota, 'category', false)!;
  quota = resetDailyQuotaFromRewardedAdState(quota)!;
  assert.equal(quota.staminaValue, 3);
  assert.equal(quota.adResetsToday, 1);
  quota = spendDailyQuotaState(quota, 'random', false)!;
  quota = resetDailyQuotaFromRewardedAdState(quota)!;
  assert.equal(quota.adResetsToday, 2);
  quota = spendDailyQuotaState(quota, 'random', false)!;
  assert.equal(resetDailyQuotaFromRewardedAdState(quota), null);
});

test('Mood allows one free or three premium starts, independent of course', () => {
  const free = spendDailyQuotaState(parseDailyQuota({}, dayKey), 'mood', false)!;
  assert.equal(free.spentToday, 1);
  assert.equal(spendDailyQuotaState(free, 'mood', false), null);

  let premium = parseDailyQuota({}, dayKey);
  for (let i = 0; i < 3; i++) premium = spendDailyQuotaState(premium, 'mood', true)!;
  assert.equal(premium.spentToday, 0);
  assert.equal(premium.moodPlaysToday, 3);
  assert.equal(spendDailyQuotaState(premium, 'mood', true), null);
});
