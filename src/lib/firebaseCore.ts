import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
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

export const firebaseClientConfig = readConfig();

export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseClientConfig?.apiKey &&
      firebaseClientConfig.authDomain &&
      firebaseClientConfig.projectId,
  );
}

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!firebaseClientConfig) throw new Error('Firebase is not configured');
  if (!app) app = getApps()[0] ?? initializeApp(firebaseClientConfig);
  return app;
}
