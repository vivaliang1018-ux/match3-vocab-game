import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  verifyBeforeUpdateEmail,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import appletConfig from '../firebase-applet-config.json';

type AppletConfig = {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  appId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  firestoreDatabaseId?: string;
};

const env = import.meta.env;

function readConfig(): AppletConfig | null {
  const apiKey = (env.VITE_FIREBASE_API_KEY as string | undefined) || appletConfig.apiKey;
  if (!apiKey) return null;
  return {
    apiKey,
    authDomain:
      (env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined) || appletConfig.authDomain,
    projectId: (env.VITE_FIREBASE_PROJECT_ID as string | undefined) || appletConfig.projectId,
    appId: (env.VITE_FIREBASE_APP_ID as string | undefined) || appletConfig.appId,
    storageBucket:
      (env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined) || appletConfig.storageBucket,
    messagingSenderId:
      (env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined) ||
      appletConfig.messagingSenderId,
    firestoreDatabaseId:
      (env.VITE_FIREBASE_FIRESTORE_DATABASE_ID as string | undefined) ||
      appletConfig.firestoreDatabaseId,
  };
}

const clientConfig = readConfig();

export function isFirebaseConfigured(): boolean {
  return Boolean(clientConfig?.apiKey && clientConfig.authDomain && clientConfig.projectId);
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function getFirebaseApp(): FirebaseApp {
  if (!clientConfig) {
    throw new Error('Firebase is not configured');
  }
  if (!app) {
    app = getApps()[0] ?? initializeApp(clientConfig);
  }
  return app;
}

/**
 * Capacitor WKWebView needs explicit Auth persistence; plain getAuth() often
 * breaks email/password (and credential linking) on iOS even when web works.
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    const firebaseApp = getFirebaseApp();
    if (Capacitor.isNativePlatform()) {
      try {
        auth = initializeAuth(firebaseApp, {
          persistence: indexedDBLocalPersistence,
        });
      } catch {
        try {
          auth = initializeAuth(firebaseApp, {
            persistence: browserLocalPersistence,
          });
        } catch {
          auth = getAuth(firebaseApp);
        }
      }
    } else {
      auth = getAuth(firebaseApp);
    }
  }
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    const databaseId = clientConfig?.firestoreDatabaseId;
    db = databaseId
      ? getFirestore(getFirebaseApp(), databaseId)
      : getFirestore(getFirebaseApp());
  }
  return db;
}

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');

function authErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code: string }).code);
    console.warn('[match3] auth error', code, error);
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return 'popup_closed';
    }
    if (
      code === 'auth/invalid-credential' ||
      code === 'auth/wrong-password' ||
      code === 'auth/user-not-found'
    ) {
      return 'invalid_credentials';
    }
    if (code === 'auth/invalid-email') return 'invalid_email';
    if (code === 'auth/email-already-in-use') return 'email_in_use';
    if (code === 'auth/weak-password') return 'weak_password';
    if (code === 'auth/too-many-requests') return 'too_many_requests';
    if (code === 'auth/operation-not-allowed') return 'provider_disabled';
    if (code === 'auth/requires-recent-login') return 'requires_recent_login';
    if (code === 'auth/network-request-failed') return 'network';
  }
  if (error instanceof Error) {
    console.warn('[match3] auth error', error.message);
    if (error.message === 'empty_display_name') return 'empty_display_name';
    if (error.message === 'same_email') return 'same_email';
    const msg = error.message.toLowerCase();
    if (msg.includes('cancel') || msg.includes('canceled')) return 'popup_closed';
  }
  return 'unknown';
}

export async function completeAuthRedirect(): Promise<User | null> {
  if (!isFirebaseConfigured()) return null;
  const result = await getRedirectResult(getFirebaseAuth());
  return result?.user ?? null;
}

async function signInWithGoogleNative(): Promise<User> {
  const result = await FirebaseAuthentication.signInWithGoogle({
    skipNativeAuth: true,
  });
  const idToken = result.credential?.idToken;
  if (!idToken) {
    throw new Error('missing_google_id_token');
  }
  const credential = GoogleAuthProvider.credential(idToken, result.credential?.accessToken);
  const signed = await signInWithCredential(getFirebaseAuth(), credential);
  return signed.user;
}

async function signInWithAppleNative(): Promise<User> {
  const result = await FirebaseAuthentication.signInWithApple({
    skipNativeAuth: true,
  });
  const idToken = result.credential?.idToken;
  const rawNonce = result.credential?.nonce;
  if (!idToken) {
    throw new Error('missing_apple_id_token');
  }
  const credential = appleProvider.credential({
    idToken,
    rawNonce: rawNonce ?? undefined,
  });
  const signed = await signInWithCredential(getFirebaseAuth(), credential);
  return signed.user;
}

export async function signInWithGoogle(): Promise<User> {
  const a = getFirebaseAuth();
  if (Capacitor.isNativePlatform()) {
    try {
      return await signInWithGoogleNative();
    } catch {
      // Fallback if native plugin / GoogleService-Info is not ready yet.
      await signInWithRedirect(a, googleProvider);
      throw new Error('redirect_pending');
    }
  }
  const result = await signInWithPopup(a, googleProvider);
  return result.user;
}

export async function signInWithApple(): Promise<User> {
  const a = getFirebaseAuth();
  if (Capacitor.isNativePlatform()) {
    return signInWithAppleNative();
  }
  const result = await signInWithPopup(a, appleProvider);
  return result.user;
}

export async function signInWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(getFirebaseAuth(), email.trim(), password);
  return result.user;
}

export async function signUpWithEmail(email: string, password: string): Promise<User> {
  const result = await createUserWithEmailAndPassword(
    getFirebaseAuth(),
    email.trim(),
    password,
  );
  return result.user;
}

export async function updateUserDisplayName(displayName: string): Promise<User> {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error('not_signed_in');
  }
  const next = displayName.trim().slice(0, 32);
  if (!next) {
    throw new Error('empty_display_name');
  }
  await updateProfile(user, { displayName: next });
  await user.reload();
  return getFirebaseAuth().currentUser ?? user;
}

export function userHasPasswordProvider(user: User | null | undefined): boolean {
  return Boolean(user?.providerData.some((p) => p.providerId === 'password'));
}

async function reauthenticateWithPassword(currentPassword: string): Promise<User> {
  const user = getFirebaseAuth().currentUser;
  if (!user?.email) {
    throw new Error('not_signed_in');
  }
  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  const result = await reauthenticateWithCredential(user, credential);
  return result.user;
}

export async function changeUserPassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  if (newPassword.trim().length < 6) {
    throw Object.assign(new Error('weak_password'), { code: 'auth/weak-password' });
  }
  const user = await reauthenticateWithPassword(currentPassword);
  await updatePassword(user, newPassword.trim());
}

/** Sends a verification link to the new email; address updates after the user confirms. */
export async function changeUserEmail(currentPassword: string, newEmail: string): Promise<void> {
  const next = newEmail.trim();
  if (!next || !next.includes('@')) {
    throw Object.assign(new Error('invalid_email'), { code: 'auth/invalid-email' });
  }
  const user = await reauthenticateWithPassword(currentPassword);
  if (user.email && next.toLowerCase() === user.email.toLowerCase()) {
    throw Object.assign(new Error('same_email'), { code: 'auth/same-email' });
  }
  await verifyBeforeUpdateEmail(user, next);
}

export async function signOutUser(): Promise<void> {
  if (Capacitor.isNativePlatform()) {
    try {
      await FirebaseAuthentication.signOut();
    } catch {
      // ignore — JS auth is source of truth when skipNativeAuth is used
    }
  }
  await firebaseSignOut(getFirebaseAuth());
}

export { authErrorMessage, type User };
