import { Capacitor } from '@capacitor/core';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
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
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return 'popup_closed';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      return 'invalid_credentials';
    }
    if (code === 'auth/email-already-in-use') return 'email_in_use';
    if (code === 'auth/weak-password') return 'weak_password';
    if (code === 'auth/too-many-requests') return 'too_many_requests';
    if (code === 'auth/operation-not-allowed') return 'provider_disabled';
  }
  if (error instanceof Error) {
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
