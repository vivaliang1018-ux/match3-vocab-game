import assert from 'node:assert/strict';
import { test } from 'node:test';
import { NOTIFICATION_COPY } from '../src/i18n/notificationCopy';
import { eligibleNotificationIndex, pickNotificationIndex } from '../src/lib/notificationRotation';
import type { Locale } from '../src/i18n/types';

test('all seven locales retain all 45 existing quotes', () => {
  for (const quotes of Object.values(NOTIFICATION_COPY)) {
    assert.equal(quotes.length, 45);
    assert.ok(quotes.every(quote => typeof quote === 'string' && quote.length > 0));
  }
});

test('30 daily quotes avoid the previous seven across locales and supported times', () => {
  for (const locale of Object.keys(NOTIFICATION_COPY) as Locale[]) {
    for (const hour of [8, 12, 19, 21]) {
      let recent: number[] = [];
      for (let date = 1; date <= 30; date++) {
        const options = { locale, day: `2026-11-${String(date).padStart(2, '0')}`, hour,
          recentIndexes: recent, kind: 'daily' as const };
        const index = pickNotificationIndex(options);
        assert.ok(eligibleNotificationIndex(index, options));
        assert.ok(!recent.includes(index), `${locale}/${hour}/${date} repeated ${index}`);
        recent = [...recent, index].slice(-7);
      }
    }
  }
});

test('time-specific fallback never sends bedtime, commuting or full-energy claims at noon', () => {
  const options = { locale: 'zh-CN' as const, day: '2026-10-18', hour: 12, recentIndexes: [], kind: 'daily' as const };
  for (const index of [0, 1, 4, 5, 6, 7, 8, 9, 22, 28, 38, 39, 40]) {
    assert.equal(eligibleNotificationIndex(index, options), false, `index ${index}`);
  }
  assert.equal(eligibleNotificationIndex(21, options), false);
  assert.equal(eligibleNotificationIndex(21, { ...options, lastPlayedDay: '2026-10-17' }), true);
  assert.equal(eligibleNotificationIndex(21, { ...options, lastPlayedDay: '2026-10-16' }), false);
});

test('energy reminders use only existing full-energy copy and exhaust variants before repeating', () => {
  const recent: number[] = [];
  for (let date = 18; date <= 20; date++) {
    const index = pickNotificationIndex({ locale: 'en', day: `2026-10-${date}`, hour: 9, recentIndexes: recent, kind: 'stamina' });
    assert.ok([22, 28, 40].includes(index)); assert.ok(!recent.includes(index)); recent.push(index);
  }
});

test('all 45 quotes are eligible in an appropriate context, rather than silently discarded', () => {
  const covered = new Set<number>();
  for (const hour of [8, 12, 19, 21]) {
    for (const kind of ['daily', 'stamina'] as const) {
      for (let index = 0; index < 45; index++) {
        if (eligibleNotificationIndex(index, { locale: 'zh-CN', day: '2026-10-18', lastPlayedDay: '2026-10-17',
          hour, recentIndexes: [], kind })) covered.add(index);
      }
    }
  }
  assert.equal(covered.size, 45);
});
