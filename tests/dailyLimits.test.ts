import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import {
  defaultStaminaState,
  clearStaminaState,
  grantSayBlastStamina,
  loadStaminaState,
  msUntilNextStamina,
  resetStaminaFromRewardedAd,
  saveStaminaState,
  spendStamina,
  tickStamina,
} from '../src/lib/stamina';
import { canPlayMoodToday, clearMoodDailyState, loadMoodDailyState, tryConsumeMoodPlay } from '../src/lib/moodBoard';

const today = new Date(2026, 9, 10, 9).getTime();

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

test('three base stamina, Say & Blast +1, two ad resets, and no hourly regeneration', () => {
  let state = defaultStaminaState(today);
  for (let i = 0; i < 3; i++) state = spendStamina(state, 1, today)!;
  assert.equal(state.value, 0);
  assert.equal(spendStamina(state, 1, today), null);
  assert.equal(tickStamina(state, today + 4 * 60 * 60 * 1000).value, 0);

  const reward = grantSayBlastStamina(state, today);
  assert.equal(reward.outcome, 'granted');
  assert.equal(reward.state.value, 1);
  state = spendStamina(reward.state, 1, today)!;
  assert.equal(state.spentToday, 4);
  assert.equal(state.value, 0);

  let ad = resetStaminaFromRewardedAd(state, today);
  assert.equal(ad.outcome, 'granted');
  assert.equal(ad.state.value, 3);
  assert.equal(ad.state.adResetsToday, 1);
  state = spendStamina(ad.state, 3, today)!;
  ad = resetStaminaFromRewardedAd(state, today);
  assert.equal(ad.outcome, 'granted');
  state = spendStamina(ad.state, 3, today)!;
  assert.equal(resetStaminaFromRewardedAd(state, today).outcome, 'daily-limit');
  assert.ok((msUntilNextStamina(state, today) ?? 0) > 0);
  const tomorrow = tickStamina(state, new Date(2026, 9, 11, 0).getTime());
  assert.equal(tomorrow.value, 3);
  assert.equal(tomorrow.adResetsToday, 0);
});

test('Mood Board is shared across courses but free/premium limits differ', () => {
  const free = { userId: 'learner', now: today };
  assert.equal(tryConsumeMoodPlay(free), true);
  assert.equal(canPlayMoodToday(free), false);
  assert.equal(tryConsumeMoodPlay(free), false);
  const premium = { ...free, hasPremiumAccess: true };
  assert.equal(tryConsumeMoodPlay(premium), true);
  assert.equal(tryConsumeMoodPlay(premium), true);
  assert.equal(tryConsumeMoodPlay(premium), false);
  assert.equal(canPlayMoodToday({ ...free, now: new Date(2026, 9, 11).getTime() }), true);
});

test('guest daily quota is claimed once and accounts remain isolated', () => {
  const guest = spendStamina(defaultStaminaState(today), 2, today)!;
  saveStaminaState(guest);

  const firstAccount = loadStaminaState(today, 'user-a');
  assert.equal(firstAccount.spentToday, 2);
  assert.equal(loadStaminaState(today, 'user-b').spentToday, 0);
  assert.equal(loadStaminaState(today).spentToday, 0);

  const accountAAfterPlay = spendStamina(firstAccount, 1, today)!;
  saveStaminaState(accountAAfterPlay, 'user-a');
  assert.equal(loadStaminaState(today, 'user-a').spentToday, 3);
  assert.equal(loadStaminaState(today, 'user-b').spentToday, 0);

  clearStaminaState('user-a');
  assert.equal(loadStaminaState(today, 'user-a').spentToday, 0);
  assert.equal(loadStaminaState(today, 'user-b').spentToday, 0);
});

test('legacy unscoped daily quota migrates without resetting today’s usage', () => {
  const legacy = spendStamina(defaultStaminaState(today), 2, today)!;
  localStorage.setItem('match3-stamina-v2', JSON.stringify(legacy));
  assert.equal(loadStaminaState(today, 'existing-user').spentToday, 2);
  assert.equal(localStorage.getItem('match3-stamina-v2'), null);
  assert.equal(loadStaminaState(today, 'another-user').spentToday, 0);
});

test('account deletion clears only that account’s Mood daily usage', () => {
  assert.equal(tryConsumeMoodPlay({ userId: 'user-a', now: today }), true);
  assert.equal(tryConsumeMoodPlay({ userId: 'user-b', now: today }), true);
  clearMoodDailyState('user-a');
  assert.equal(loadMoodDailyState({ userId: 'user-a', now: today }).plays, 0);
  assert.equal(loadMoodDailyState({ userId: 'user-b', now: today }).plays, 1);
});
