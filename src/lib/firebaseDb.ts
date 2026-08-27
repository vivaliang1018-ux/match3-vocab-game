import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseClientConfig, getFirebaseApp } from './firebaseCore';

let db: Firestore | null = null;

export function getFirebaseDb(): Firestore {
  if (!db) {
    const databaseId = firebaseClientConfig?.firestoreDatabaseId;
    db = databaseId
      ? getFirestore(getFirebaseApp(), databaseId)
      : getFirestore(getFirebaseApp());
  }
  return db;
}
