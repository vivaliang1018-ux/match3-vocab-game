import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import {
  authErrorMessage,
  completeAuthRedirect,
  getFirebaseAuth,
  isFirebaseConfigured,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
} from '../lib/firebase';

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  configured: boolean;
  busy: boolean;
  lastError: string | null;
  signInGoogle: () => Promise<void>;
  signInApple: () => Promise<void>;
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!configured);
  const [busy, setBusy] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;

    void completeAuthRedirect()
      .catch(() => {
        // ignore — no pending redirect
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });

    const unsubscribe = onAuthStateChanged(getFirebaseAuth(), (next) => {
      if (!cancelled) {
        setUser(next);
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [configured]);

  const runAuth = useCallback(async (fn: () => Promise<void>) => {
    if (!configured) {
      setLastError('not_configured');
      return;
    }
    setBusy(true);
    setLastError(null);
    try {
      await fn();
    } catch (error) {
      if (error instanceof Error && error.message === 'redirect_pending') {
        return;
      }
      setLastError(authErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }, [configured]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      configured,
      busy,
      lastError,
      signInGoogle: () =>
        runAuth(async () => {
          await signInWithGoogle();
        }),
      signInApple: () =>
        runAuth(async () => {
          await signInWithApple();
        }),
      signInEmail: (email, password) =>
        runAuth(async () => {
          await signInWithEmail(email, password);
        }),
      signUpEmail: (email, password) =>
        runAuth(async () => {
          await signUpWithEmail(email, password);
        }),
      signOut: () =>
        runAuth(async () => {
          await signOutUser();
        }),
      clearError: () => setLastError(null),
    }),
    [user, ready, configured, busy, lastError, runAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
