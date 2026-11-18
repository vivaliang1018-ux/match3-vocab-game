import {
  AD_STAMINA_RESETS_DAILY_MAX,
  STAMINA_DAILY_BASE,
  STAMINA_MAX,
  type StaminaState,
} from './stamina';
import { MOOD_DAILY_FREE_PLAY_MAX, MOOD_DAILY_PREMIUM_PLAY_MAX } from './moodBoard';

export type DailyQuota = {
  dayKey: string;
  staminaValue: number;
  spentToday: number;
  sayBlastRewardsToday: number;
  adResetsToday: number;
  moodPlaysToday: number;
};

function bounded(value: unknown, max: number): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(0, Math.floor(value))) : 0;
}

export function parseDailyQuota(raw: unknown, dayKey: string): DailyQuota {
  const value = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
  const spentToday = bounded(value.spentToday, 10_000);
  const sayBlastRewardsToday = bounded(value.sayBlastRewardsToday, 10_000);
  const legacyStamina = STAMINA_DAILY_BASE + sayBlastRewardsToday - spentToday;
  return {
    dayKey,
    staminaValue: typeof value.staminaValue === 'number'
      ? bounded(value.staminaValue, STAMINA_MAX)
      : Math.max(0, Math.min(STAMINA_MAX, legacyStamina)),
    spentToday,
    sayBlastRewardsToday,
    adResetsToday: bounded(value.adResetsToday, AD_STAMINA_RESETS_DAILY_MAX),
    moodPlaysToday: bounded(value.moodPlaysToday, MOOD_DAILY_PREMIUM_PLAY_MAX),
  };
}

/** Only a missing cloud document may inherit this account's local usage. */
export function initialDailyQuota(
  cloudDocument: unknown | null,
  localStamina: StaminaState,
  localMoodPlays: number,
  dayKey: string,
): DailyQuota {
  if (cloudDocument !== null) return parseDailyQuota(cloudDocument, dayKey);
  if (localStamina.dayKey !== dayKey) return parseDailyQuota({}, dayKey);
  return parseDailyQuota({
    staminaValue: localStamina.value,
    spentToday: localStamina.spentToday,
    sayBlastRewardsToday: localStamina.sayBlastRewardsToday,
    adResetsToday: localStamina.adResetsToday,
    moodPlaysToday: localMoodPlays,
  }, dayKey);
}

export function spendDailyQuotaState(
  current: DailyQuota,
  mode: 'random' | 'category' | 'mood',
  premium: boolean,
): DailyQuota | null {
  if (mode === 'mood' && current.moodPlaysToday >=
    (premium ? MOOD_DAILY_PREMIUM_PLAY_MAX : MOOD_DAILY_FREE_PLAY_MAX)) return null;
  if (!premium && current.staminaValue <= 0) return null;
  return {
    ...current,
    staminaValue: current.staminaValue - (premium ? 0 : 1),
    spentToday: current.spentToday + (premium ? 0 : 1),
    moodPlaysToday: current.moodPlaysToday + (mode === 'mood' ? 1 : 0),
  };
}

export function grantDailySayBlastRewardState(current: DailyQuota): DailyQuota | null {
  if (current.staminaValue >= STAMINA_MAX) return null;
  return {
    ...current,
    staminaValue: current.staminaValue + 1,
    sayBlastRewardsToday: current.sayBlastRewardsToday + 1,
  };
}

export function resetDailyQuotaFromRewardedAdState(current: DailyQuota): DailyQuota | null {
  if (current.adResetsToday >= AD_STAMINA_RESETS_DAILY_MAX || current.staminaValue >= STAMINA_MAX) {
    return null;
  }
  return {
    ...current,
    staminaValue: STAMINA_MAX,
    adResetsToday: current.adResetsToday + 1,
  };
}
