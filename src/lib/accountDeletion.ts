import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { deleteUser } from 'firebase/auth';
import {
  authErrorMessage,
  getFirebaseAuth,
  isFirebaseConfigured,
} from './firebase';
import {
  clearWordMemoriesForScope,
  memoryScopeForUserId,
} from './ebbinghausMemory';
import { deleteCloudWordMemories } from './memoryCloudSync';
import { clearAvatarPreset } from './accountProfile';
import { clearRoundLearnedIds } from './roundLearned';
import { clearModeUnlocks } from './modeUnlocks';
import { clearAdventureSetHistory } from './adventureSetHistory';
import { clearFirstTimeGuideState } from './firstTimeGuide';

/**
 * Permanently delete the signed-in account: cloud progress, local user bucket, then Auth user.
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

  try {
    await deleteCloudWordMemories(uid);
  } catch {
    // Best-effort: still delete Auth user so the account cannot sign in.
  }
  clearWordMemoriesForScope(scope);
  clearRoundLearnedIds(uid);
  clearModeUnlocks(uid);
  clearAdventureSetHistory(uid);
  clearFirstTimeGuideState(uid);
  clearAvatarPreset(uid);

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

  if (Capacitor.isNativePlatform()) {
    try {
      await FirebaseAuthentication.signOut();
    } catch {
      // ignore
    }
  }
}
