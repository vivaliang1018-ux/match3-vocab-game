const STORAGE_KEY = 'match3-stamina-v1';

export const STAMINA_DAILY_BASE = 5;
export const STAMINA_MAX = 5;
export const STAMINA_REGEN_MS = 60 * 60 * 1000;
export const SAY_BLAST_DAILY_REWARD_MAX = 3;

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
  };
}

export function loadStaminaState(now = Date.now()): StaminaState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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
    };
    return tickStamina(base, now);
  } catch {
    return defaultStaminaState(now);
  }
}

export function saveStaminaState(state: StaminaState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore quota
  }
}

/** Apply hourly regen + daily top-up to base when below max. */
export function tickStamina(state: StaminaState, now = Date.now()): StaminaState {
  let { value, bankedRewards, lastRegenAt, dayKey, sayBlastRewardsToday } = state;
  bankedRewards = Number.isFinite(bankedRewards)
    ? Math.max(0, Math.floor(bankedRewards))
    : 0;
  const today = dayKeyFrom(now);

  if (dayKey !== today) {
    dayKey = today;
    sayBlastRewardsToday = 0;
    if (value < STAMINA_DAILY_BASE) value = STAMINA_DAILY_BASE;
    lastRegenAt = now;
  }

  if (value < STAMINA_MAX && lastRegenAt < now) {
    const elapsed = now - lastRegenAt;
    const gained = Math.floor(elapsed / STAMINA_REGEN_MS);
    if (gained > 0) {
      value = clampStamina(value + gained);
      lastRegenAt += gained * STAMINA_REGEN_MS;
      if (value >= STAMINA_MAX) lastRegenAt = now;
    }
  }

  if (value < STAMINA_MAX && bankedRewards > 0) {
    const claimed = Math.min(STAMINA_MAX - value, bankedRewards);
    value += claimed;
    bankedRewards -= claimed;
  }

  return {
    value: clampStamina(value),
    bankedRewards: Math.max(0, Math.floor(bankedRewards)),
    lastRegenAt,
    dayKey,
    sayBlastRewardsToday: Math.max(0, Math.floor(sayBlastRewardsToday)),
  };
}

export function spendStamina(state: StaminaState, amount = 1, now = Date.now()): StaminaState | null {
  const ticked = tickStamina(state, now);
  if (ticked.value < amount) return null;
  const next = { ...ticked, value: ticked.value - amount };
  if (next.value < STAMINA_MAX && next.bankedRewards > 0) {
    const claimed = Math.min(STAMINA_MAX - next.value, next.bankedRewards);
    next.value += claimed;
    next.bankedRewards -= claimed;
  }
  if (ticked.value >= STAMINA_MAX && next.value < STAMINA_MAX) {
    next.lastRegenAt = now;
  }
  return next;
}

export function grantStamina(state: StaminaState, amount = 1, now = Date.now()): StaminaState {
  const ticked = tickStamina(state, now);
  return { ...ticked, value: clampStamina(ticked.value + amount) };
}

export function grantOrBankStamina(
  state: StaminaState,
  amount = 1,
  now = Date.now(),
): { state: StaminaState; outcome: 'granted' | 'banked' } {
  const ticked = tickStamina(state, now);
  const openSlots = Math.max(0, STAMINA_MAX - ticked.value);
  const granted = Math.min(openSlots, Math.max(0, Math.floor(amount)));
  const banked = Math.max(0, Math.floor(amount) - granted);
  return {
    state: {
      ...ticked,
      value: clampStamina(ticked.value + granted),
      bankedRewards: ticked.bankedRewards + banked,
    },
    outcome: banked > 0 ? 'banked' : 'granted',
  };
}

export function grantSayBlastStamina(
  state: StaminaState,
  now = Date.now(),
): { state: StaminaState; outcome: 'granted' | 'banked' | 'daily-limit' } {
  const ticked = tickStamina(state, now);
  if (ticked.sayBlastRewardsToday >= SAY_BLAST_DAILY_REWARD_MAX) {
    return { state: ticked, outcome: 'daily-limit' };
  }
  const reward = grantOrBankStamina(ticked, 1, now);
  return {
    state: {
      ...reward.state,
      sayBlastRewardsToday: ticked.sayBlastRewardsToday + 1,
    },
    outcome: reward.outcome,
  };
}

/** Ms until next +1, or null if full. */
export function msUntilNextStamina(state: StaminaState, now = Date.now()): number | null {
  const ticked = tickStamina(state, now);
  if (ticked.value >= STAMINA_MAX) return null;
  const nextAt = ticked.lastRegenAt + STAMINA_REGEN_MS;
  return Math.max(0, nextAt - now);
}
