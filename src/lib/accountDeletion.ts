import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { deleteUser } from 'firebase/auth';
import {
  authErrorMessage,
  getFirebaseAuth,
  isFirebaseConfigured,
  prepareAppleTokenRevocation,
  revokePreparedAppleToken,
} from './firebase';
import {
  clearWordMemoriesForScope,
  memoryScopeForUserId,
} from './ebbinghausMemory';
import { clearAvatarPreset } from './accountProfile';
import { clearRoundLearnedIds } from './roundLearned';
import { clearModeUnlocks } from './modeUnlocks';
import { clearAdventureSetHistory } from './adventureSetHistory';
import { clearFirstTimeGuideState } from './firstTimeGuide';
import { clearSayBlastStats } from './sayBlastStats';
import { clearPlayerSummary } from './playerSummary';
import { clearCategoryCycleProgress } from './categoryCycleProgress';
import { clearStaminaState } from './stamina';
import { clearMoodDailyState } from './moodBoard';
import { COURSES } from '../courseConfig';

/**
 * Permanently delete the signed-in account: cloud progress, Auth user, then local user bucket.
 * May surface requires_recent_login — ask the user to sign in again and retry.
 */
export async function deleteAccountUser(): Promise<void> {
  if (!isFirebaseConfigured()) {
    throw Object.assign(new Error('not_configured'), { code: 'not_configured' });
  }

  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw Object.assign(new Error('not_signed_in'), { code: 'not_signed_in' });
  }

  const uid = user.uid;
  const scope = memoryScopeForUserId(uid);

  // Firebase does not retain the Apple token needed for revocation. Apple
  // accounts must authenticate again so the fresh authorization code can be
  // revoked after cloud data is gone and before the Firebase user is deleted.
  const appleRevocation = await prepareAppleTokenRevocation();

  // Never delete the Auth identity while its cloud data still exists. If the
  // Firestore operation fails, abort so the user can retry with an account that
  // still has permission to remove its own data.
  const { deleteCloudWordMemories } = await import('./memoryCloudSync');
  if (import.meta.env.VITE_CLOUD_DAILY_QUOTA === '1') {
    const { deleteCloudDailyQuotas } = await import('./dailyQuotaCloud');
    await deleteCloudDailyQuotas(uid);
  }
  await deleteCloudWordMemories(uid);
  await revokePreparedAppleToken(appleRevocation);

  try {
    await deleteUser(user);
  } catch (error) {
    const mapped = authErrorMessage(error);
    if (mapped === 'requires_recent_login') {
      throw Object.assign(new Error('requires_recent_login'), {
        code: 'auth/requires-recent-login',
      });
    }
    throw error;
  }

  for (const course of COURSES) {
    clearWordMemoriesForScope(scope, course.id);
    clearRoundLearnedIds(uid, course.id);
    clearModeUnlocks(uid, course.id);
    clearPlayerSummary(uid, course.id);
    clearCategoryCycleProgress(uid, course.id);
  }
  clearAdventureSetHistory(uid);
  clearFirstTimeGuideState(uid);
  clearSayBlastStats(uid);
  clearStaminaState(uid);
  clearMoodDailyState(uid);
  clearAvatarPreset(uid);

  if (Capacitor.isNativePlatform()) {
    try {
      await FirebaseAuthentication.signOut();
    } catch {
      // ignore
    }
  }
}
