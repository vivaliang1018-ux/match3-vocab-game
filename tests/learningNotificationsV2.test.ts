import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { Capacitor, registerPlugin } from '@capacitor/core';
import { NOTIFICATION_COPY } from '../src/i18n/notificationCopy';

let permission = 'denied';
let settingsOpened = 0;
let requested = 0;
let scheduled = 0;
let openFails = false;
type Scheduled = { id: number; body: string; schedule: { at: Date }; extra: { source: string } };
let batches: Scheduled[][] = [];
let canceled: number[][] = [];
registerPlugin('LocalNotifications', { web: async () => ({
  checkPermissions: async () => ({ display: permission }),
  requestPermissions: async () => { requested++; return { display: permission }; },
  cancel: async ({ notifications }: { notifications: { id: number }[] }) => { canceled.push(notifications.map(item => item.id)); },
  getPending: async () => ({ notifications: [{ id: 73001 }, { id: 73101 }, { id: 73999 }] }),
  schedule: async ({ notifications }: { notifications: Scheduled[] }) => { scheduled++; batches.push(notifications); },
}) });
registerPlugin('LingoMatchSettings', { web: async () => ({
  openNotifications: async () => { if (openFails) throw new Error('unavailable'); settingsOpened++; },
}) });
Capacitor.isNativePlatform = () => true;
Capacitor.isPluginAvailable = () => true;
const reminders = await import('../src/lib/learningNotificationsV2');
const context = { locale: 'en' as const, hasPremiumAccess: false, playedToday: false };
beforeEach(() => {
  permission = 'denied'; settingsOpened = 0; requested = 0; scheduled = 0; openFails = false; batches = []; canceled = [];
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  } });
});

test('already denied: explicit enable opens Settings rather than requesting the impossible prompt', async () => {
  assert.equal(await reminders.enableLearningReminders(context), 'denied');
  assert.equal(settingsOpened, 1); assert.equal(requested, 0); assert.equal(scheduled, 0);
  assert.equal(reminders.readLearningReminderSettings().enabled, false);
  permission = 'granted';
  assert.equal(await reminders.refreshLearningReminder(context), 'enabled');
  assert.equal(reminders.readLearningReminderSettings().enabled, true);
  assert.equal(reminders.readLearningReminderSettings().pendingSystemEnable, false);
  assert.equal(scheduled, 1);
});

test('returning without granting does not enable, schedule, or reopen Settings', async () => {
  await reminders.enableLearningReminders(context);
  assert.equal(await reminders.refreshLearningReminder(context), 'denied');
  assert.equal(settingsOpened, 1); assert.equal(scheduled, 0);
  assert.equal(reminders.readLearningReminderSettings().enabled, false);
});

test('first denial is respected without automatically opening Settings', async () => {
  permission = 'prompt';
  await reminders.enableLearningReminders(context);
  assert.equal(requested, 1); assert.equal(settingsOpened, 0);
  assert.equal(reminders.readLearningReminderSettings().pendingSystemEnable, false);
});

test('disable cancels the outstanding enable intent; Settings failure is not reported as success', async () => {
  await reminders.enableLearningReminders(context);
  await reminders.disableLearningReminders();
  permission = 'granted';
  assert.equal(await reminders.refreshLearningReminder(context), 'disabled');
  permission = 'denied'; openFails = true;
  assert.equal(await reminders.enableLearningReminders(context), 'unavailable');
  assert.equal(reminders.readLearningReminderSettings().pendingSystemEnable, false);
});

const now = new Date(2026, 9, 17, 10);

test('V2 schedules the existing quote pool for 30 days and keeps same-day refresh stable', async () => {
  permission = 'granted';
  await reminders.enableLearningReminders({ ...context, now });
  const first = batches.at(-1)!;
  assert.equal(first.length, 30);
  assert.ok(first.every(item => (NOTIFICATION_COPY.en as readonly string[]).includes(item.body)));
  for (let index = 0; index < first.length; index++) {
    assert.ok(!first.slice(Math.max(0, index - 7), index).some(item => item.body === first[index].body));
  }
  await reminders.refreshLearningReminder({ ...context, now });
  assert.deepEqual(batches.at(-1), first);
  assert.equal(reminders.readLearningReminderSettings().scheduledEntries?.length, 30);
});

test('review keeps its real count; other days use quotes in the selected UI language', async () => {
  permission = 'granted';
  await reminders.enableLearningReminders({ ...context, locale: 'zh-CN', dueReviewCount: 6, now });
  const list = batches.at(-1)!;
  assert.equal(list[0].body, '🧠 6 个单词需要加固，玩两分钟让它们记得更牢。');
  assert.ok(list.slice(1).every(item => (NOTIFICATION_COPY['zh-CN'] as readonly string[]).includes(item.body)));
});

test('energy is scheduled at 09:00 and replaces the routine invitation on that date', async () => {
  permission = 'granted';
  await reminders.enableLearningReminders({ ...context, now, staminaValue: 0,
    nextStaminaAt: new Date(2026, 9, 18, 0).getTime() });
  const list = batches.at(-1)!;
  const energy = list.find(item => item.extra.source === 'stamina-reminder')!;
  assert.equal(energy.schedule.at.getHours(), 9);
  assert.ok([22, 28, 40].some(index => NOTIFICATION_COPY.en[index] === energy.body));
  const sameDate = list.filter(item => item.schedule.at.toDateString() === energy.schedule.at.toDateString());
  assert.equal(sameDate.length, 1);
});

test('played-today refresh postpones today and Settings/category changes retain context', async () => {
  permission = 'granted';
  const game = { ...context, now, staminaValue: 0, nextStaminaAt: new Date(2026, 9, 18, 0).getTime() };
  await reminders.enableLearningReminders(game);
  await reminders.markLearningActivity(game);
  assert.ok(batches.at(-1)!.every(item => item.schedule.at.getDate() !== 17));
  assert.ok(batches.at(-1)!.some(item => item.extra.source === 'stamina-reminder'));
  await reminders.setLearningReminderTime('20:00', { ...game, playedToday: true });
  assert.ok(batches.at(-1)!.some(item => item.extra.source === 'stamina-reminder'));
  await reminders.setLearningReminderCategory('stamina', false, { ...game, playedToday: true });
  assert.ok(!batches.at(-1)!.some(item => item.extra.source === 'stamina-reminder'));
});

test('legacy quote history migrates without losing permission or gaining marketing consent', () => {
  localStorage.setItem('lingomatch-learning-reminders-v1', JSON.stringify({ enabled: true, hour: 19, minute: 30,
    recentIndexes: [1, 2, 3], scheduledEntries: [{ day: '2026-10-18', index: 3 }] }));
  const migrated = reminders.readLearningReminderSettings();
  assert.equal(migrated.enabled, true);
  assert.equal(migrated.newContentEnabled, false);
  assert.deepEqual(migrated.recentIndexes, [1, 2, 3]);
  assert.deepEqual(migrated.scheduledEntries, [{ day: '2026-10-18', index: 3, kind: 'daily' }]);
});

test('rolling the month forward and changing reminder time keeps seven-quote separation', async () => {
  permission = 'granted';
  await reminders.enableLearningReminders({ ...context, now });
  await reminders.refreshLearningReminder({ ...context, now: new Date(2026, 9, 18, 10) });
  await reminders.setLearningReminderTime('21:00', { ...context, now: new Date(2026, 9, 18, 10) });
  const list = batches.at(-1)!;
  assert.equal(list.length, 30);
  for (let index = 0; index < list.length; index++) {
    assert.ok(!list.slice(Math.max(0, index - 7), index).some(item => item.body === list[index].body));
  }
});

test('matching more words on the same day does not repeatedly cancel and schedule 30 notifications', async () => {
  permission = 'granted';
  const game = { ...context, now };
  await reminders.enableLearningReminders(game);
  await reminders.markLearningActivity(game);
  const calls = scheduled;
  await reminders.markLearningActivity(game);
  assert.equal(scheduled, calls);
});

test('production has no test sender and schedules no QA notification', async () => {
  assert.equal('sendLearningReminderTest' in reminders, false);
  permission = 'granted';
  await reminders.enableLearningReminders({ ...context, now });
  assert.ok(batches.flat().every(item => item.id !== 73999 && item.extra.source !== 'test-reminder'));
  assert.ok(canceled.some(ids => ids.includes(73999)));
});

test('legacy QA notification is canceled even when real reminders are disabled', async () => {
  permission = 'granted';
  assert.equal(await reminders.refreshLearningReminder({ ...context, now }), 'disabled');
  assert.deepEqual(canceled, [[73999]]);
  assert.equal(scheduled, 0);
});

test('diagnostics no longer count legacy QA notifications as production reminders', async () => {
  permission = 'granted';
  assert.equal((await reminders.getLearningReminderDiagnostics()).pendingCount, 2);
});
