import { calendarDayKey, dayKeyDiff, liveDayStreak, type PlayerSummary } from './playerSummary';

const STORAGE_KEY = 'matchingo-auth-nudge-v1';

type AuthNudgeState = {
  version: 1;
  softPromptCompleted: boolean;
  streakGateDismissedDay: string | null;
};

const DEFAULT_STATE: AuthNudgeState = {
  version: 1,
  softPromptCompleted: false,
  streakGateDismissedDay: null,
};

function loadState(): AuthNudgeState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<AuthNudgeState>;
    return {
      version: 1,
      softPromptCompleted: Boolean(parsed.softPromptCompleted),
      streakGateDismissedDay:
        typeof parsed.streakGateDismissedDay === 'string'
          ? parsed.streakGateDismissedDay
          : null,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state: AuthNudgeState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // A failed preference write may cause a later repeat, but never blocks play.
  }
}

export function hasCompletedSoftAuthPrompt(): boolean {
  return loadState().softPromptCompleted;
}

export function completeSoftAuthPrompt(): void {
  saveState({ ...loadState(), softPromptCompleted: true });
}

export function shouldGateLongTermStreak(summary: PlayerSummary, now = Date.now()): boolean {
  if (liveDayStreak(summary, now) >= 7) return true;
  if (!summary.lastPlayDay || summary.dayStreak < 6) return false;
  return dayKeyDiff(summary.lastPlayDay, calendarDayKey(now)) === 1;
}

export function hasDismissedStreakGateToday(now = Date.now()): boolean {
  return loadState().streakGateDismissedDay === calendarDayKey(now);
}

export function dismissStreakGateForToday(now = Date.now()): void {
  saveState({ ...loadState(), streakGateDismissedDay: calendarDayKey(now) });
}
