import { collection, deleteDoc, doc, getDocs, runTransaction, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb } from './firebaseDb';
import { isFirebaseConfigured } from './firebaseCore';
import { tickStamina, type StaminaState } from './stamina';
import {
  grantDailySayBlastRewardState,
  initialDailyQuota,
  resetDailyQuotaFromRewardedAdState,
  spendDailyQuotaState,
  type DailyQuota,
} from './dailyQuotaPolicy';
export type { DailyQuota } from './dailyQuotaPolicy';

function todayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function quotaRef(uid: string, dayKey: string) {
  return doc(getFirebaseDb(), 'users', uid, 'dailyQuotas', dayKey);
}

export function isCloudQuotaAvailable(uid: string | null): uid is string {
  return Boolean(uid && isFirebaseConfigured() && import.meta.env.VITE_CLOUD_DAILY_QUOTA === '1');
}

/** Merge a first sign-in's local usage, then adopt the account ledger. */
export async function synchronizeDailyQuota(
  uid: string,
  localStamina: StaminaState,
  localMoodPlays: number,
): Promise<DailyQuota> {
  const dayKey = todayKey();
  const ref = quotaRef(uid, dayKey);
  return runTransaction(getFirebaseDb(), async (transaction) => {
    const snap = await transaction.get(ref);
    const quota = initialDailyQuota(
      snap.exists() ? snap.data() : null, localStamina, localMoodPlays, dayKey,
    );
    if (!snap.exists()) transaction.set(ref, { ...quota, updatedAt: serverTimestamp() });
    return quota;
  });
}

export function staminaFromDailyQuota(quota: DailyQuota, previous: StaminaState): StaminaState {
  return tickStamina({
    ...previous,
    dayKey: quota.dayKey,
    value: quota.staminaValue,
    spentToday: quota.spentToday,
    sayBlastRewardsToday: quota.sayBlastRewardsToday,
    adResetsToday: quota.adResetsToday,
  });
}

/** Spend atomically across every course and signed-in device. Null means limit reached. */
export async function spendDailyQuota(
  uid: string,
  mode: 'random' | 'category' | 'mood',
  premium: boolean,
  localStamina: StaminaState,
  localMoodPlays: number,
): Promise<DailyQuota | null> {
  const dayKey = todayKey();
  const ref = quotaRef(uid, dayKey);
  return runTransaction(getFirebaseDb(), async (transaction) => {
    const snap = await transaction.get(ref);
    const current = initialDailyQuota(
      snap.exists() ? snap.data() : null, localStamina, localMoodPlays, dayKey,
    );
    const next = spendDailyQuotaState(current, mode, premium);
    if (!next) return null;
    transaction.set(ref, { ...next, updatedAt: serverTimestamp() });
    return next;
  });
}

/** Restore one stamina after a qualifying three-star Say & Blast round. */
export async function grantDailySayBlastReward(
  uid: string,
  localStamina: StaminaState,
  localMoodPlays: number,
): Promise<DailyQuota | null> {
  const dayKey = todayKey();
  const ref = quotaRef(uid, dayKey);
  return runTransaction(getFirebaseDb(), async (transaction) => {
    const snap = await transaction.get(ref);
    const current = initialDailyQuota(
      snap.exists() ? snap.data() : null, localStamina, localMoodPlays, dayKey,
    );
    const next = grantDailySayBlastRewardState(current);
    if (!next) return null;
    transaction.set(ref, { ...next, updatedAt: serverTimestamp() });
    return next;
  });
}

/** Reset stamina to 3 after a rewarded ad has actually completed. */
export async function resetDailyQuotaFromRewardedAd(
  uid: string,
  localStamina: StaminaState,
  localMoodPlays: number,
): Promise<DailyQuota | null> {
  const dayKey = todayKey();
  const ref = quotaRef(uid, dayKey);
  return runTransaction(getFirebaseDb(), async (transaction) => {
    const snap = await transaction.get(ref);
    const current = initialDailyQuota(
      snap.exists() ? snap.data() : null, localStamina, localMoodPlays, dayKey,
    );
    const next = resetDailyQuotaFromRewardedAdState(current);
    if (!next) return null;
    transaction.set(ref, { ...next, updatedAt: serverTimestamp() });
    return next;
  });
}

export async function deleteCloudDailyQuotas(uid: string): Promise<void> {
  const snapshots = await getDocs(collection(getFirebaseDb(), 'users', uid, 'dailyQuotas'));
  await Promise.all(snapshots.docs.map((snapshot) => deleteDoc(snapshot.ref)));
}
