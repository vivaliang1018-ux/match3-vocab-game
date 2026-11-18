import { claimGuestProgress, clearScopedProgress, readScopedProgress, writeScopedProgress } from './progressScope';

// v2 starts a new daily ledger; the old hourly-regeneration state cannot tell
// us how many boards were already played today.
const STORAGE_KEY = 'match3-stamina-v2';

export const STAMINA_DAILY_BASE = 3;
export const STAMINA_MAX = STAMINA_DAILY_BASE;
export const AD_STAMINA_RESETS_DAILY_MAX = 2;

export type StaminaState = {
  value: number;
  /** Earned bonus stamina waiting for an open slot. */
  bankedRewards: number;
  /** Last time a regen tick was applied (ms). */
  lastRegenAt: number;
  /** Local calendar day key `YYYY-MM-DD` for daily top-up. */
  dayKey: string;
  /** Bonus stamina earned from Say & Blast during `dayKey`. */
  sayBlastRewardsToday: number;
  /** Rewarded-ad stamina resets used during `dayKey`. */
  adResetsToday: number;
  /** New boards started today, across every course. */
  spentToday: number;
};

function dayKeyFrom(ms: number): string {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function clampStamina(n: number): number {
  return Math.max(0, Math.min(STAMINA_MAX, Math.floor(n)));
}

export function defaultStaminaState(now = Date.now()): StaminaState {
  return {
    value: STAMINA_DAILY_BASE,
    bankedRewards: 0,
    lastRegenAt: now,
    dayKey: dayKeyFrom(now),
    sayBlastRewardsToday: 0,
    adResetsToday: 0,
    spentToday: 0,
  };
}

export function loadStaminaState(now = Date.now(), userId: string | null = null): StaminaState {
  try {
    claimGuestProgress(STORAGE_KEY, userId);
    const raw = readScopedProgress(STORAGE_KEY, userId);
    if (!raw) return defaultStaminaState(now);
    const parsed = JSON.parse(raw) as Partial<StaminaState>;
    const base: StaminaState = {
      value: typeof parsed.value === 'number' ? parsed.value : STAMINA_DAILY_BASE,
      bankedRewards:
        typeof parsed.bankedRewards === 'number'
          ? Math.max(0, Math.floor(parsed.bankedRewards))
          : 0,
      lastRegenAt: typeof parsed.lastRegenAt === 'number' ? parsed.lastRegenAt : now,
      dayKey: typeof parsed.dayKey === 'string' ? parsed.dayKey : dayKeyFrom(now),
      sayBlastRewardsToday:
        typeof parsed.sayBlastRewardsToday === 'number'
          ? Math.max(0, Math.floor(parsed.sayBlastRewardsToday))
          : 0,
      adResetsToday:
        typeof parsed.adResetsToday === 'number'
          ? Math.min(AD_STAMINA_RESETS_DAILY_MAX, Math.max(0, Math.floor(parsed.adResetsToday)))
          : 0,
      spentToday:
        typeof parsed.spentToday === 'number'
          ? Math.max(0, Math.floor(parsed.spentToday))
          : 0,
    };
    return tickStamina(base, now);
  } catch {
    return defaultStaminaState(now);
  }
}

export function saveStaminaState(state: StaminaState, userId: string | null = null): void {
  try {
    writeScopedProgress(STORAGE_KEY, JSON.stringify(state), userId);
  } catch {
    // ignore quota
  }
}

export function clearStaminaState(userId: string): void {
  clearScopedProgress(STORAGE_KEY, userId);
}

/** Reset to three stamina on a new local day; there is no hourly regeneration. */
export function tickStamina(state: StaminaState, now = Date.now()): StaminaState {
  const today = dayKeyFrom(now);
  if (state.dayKey !== today) return defaultStaminaState(now);
  return {
    value: clampStamina(state.value),
    bankedRewards: 0,
    lastRegenAt: state.lastRegenAt,
    dayKey: today,
    sayBlastRewardsToday: Math.min(10_000, Math.max(0, Math.floor(state.sayBlastRewardsToday) || 0)),
    adResetsToday: Math.min(
      AD_STAMINA_RESETS_DAILY_MAX,
      Math.max(0, Math.floor(state.adResetsToday) || 0),
    ),
    spentToday: Math.min(10_000, Math.max(0, Math.floor(state.spentToday) || 0)),
  };
}

export function spendStamina(state: StaminaState, amount = 1, now = Date.now()): StaminaState | null {
  const ticked = tickStamina(state, now);
  const cost = Math.max(0, Math.floor(amount));
  if (ticked.value < cost) return null;
  return {
    ...ticked,
    value: clampStamina(ticked.value - cost),
    spentToday: ticked.spentToday + cost,
    lastRegenAt: now,
  };
}

export function grantSayBlastStamina(
  state: StaminaState,
  now = Date.now(),
): { state: StaminaState; outcome: 'granted' | 'banked' | 'daily-limit' } {
  const ticked = tickStamina(state, now);
  if (ticked.value >= STAMINA_MAX) return { state: ticked, outcome: 'daily-limit' };
  return {
    state: {
      ...ticked,
      value: ticked.value + 1,
      sayBlastRewardsToday: ticked.sayBlastRewardsToday + 1,
      lastRegenAt: now,
    },
    outcome: 'granted',
  };
}

/** Apply a rewarded-ad result. Call only after the ad reports a reward. */
export function resetStaminaFromRewardedAd(
  state: StaminaState,
  now = Date.now(),
): { state: StaminaState; outcome: 'granted' | 'daily-limit' | 'not-needed' } {
  const ticked = tickStamina(state, now);
  if (ticked.adResetsToday >= AD_STAMINA_RESETS_DAILY_MAX) {
    return { state: ticked, outcome: 'daily-limit' };
  }
  if (ticked.value >= STAMINA_MAX) return { state: ticked, outcome: 'not-needed' };
  return {
    state: {
      ...ticked,
      value: STAMINA_MAX,
      adResetsToday: ticked.adResetsToday + 1,
      lastRegenAt: now,
    },
    outcome: 'granted',
  };
}

/** Ms until the next local daily reset, or null while entries remain. */
export function msUntilNextStamina(state: StaminaState, now = Date.now()): number | null {
  const ticked = tickStamina(state, now);
  if (ticked.value > 0) return null;
  const today = new Date(now);
  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  return Math.max(0, tomorrow.getTime() - now);
}
