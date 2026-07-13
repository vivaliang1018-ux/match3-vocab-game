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
  changeUserEmail,
  changeUserPassword,
  completeAuthRedirect,
  getFirebaseAuth,
  isFirebaseConfigured,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  signUpWithEmail,
  updateUserDisplayName,
  userHasPasswordProvider,
} from '../lib/firebase';
import { deleteAccountUser } from '../lib/accountDeletion';

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  configured: boolean;
  busy: boolean;
  lastError: string | null;
  hasPasswordProvider: boolean;
  signInGoogle: () => Promise<string | null>;
  signInApple: () => Promise<string | null>;
  signInEmail: (email: string, password: string) => Promise<string | null>;
  signUpEmail: (email: string, password: string) => Promise<string | null>;
  updateDisplayName: (displayName: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<string | null>;
  changeEmail: (currentPassword: string, newEmail: string) => Promise<string | null>;
  refreshUser: () => Promise<void>;
  signOut: () => Promise<string | null>;
  deleteAccount: () => Promise<string | null>;
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

  const runAuth = useCallback(async (fn: () => Promise<void>): Promise<string | null> => {
    if (!configured) {
      setLastError('not_configured');
      return 'not_configured';
    }
    setBusy(true);
    setLastError(null);
    try {
      await fn();
      return null;
    } catch (error) {
      if (error instanceof Error && error.message === 'redirect_pending') {
        return 'redirect_pending';
      }
      if (error instanceof Error && error.message === 'requires_recent_login') {
        setLastError('requires_recent_login');
        return 'requires_recent_login';
      }
      const mapped = authErrorMessage(error);
      setLastError(mapped);
      return mapped;
    } finally {
      setBusy(false);
    }
  }, [configured]);

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      configured,
      busy,
      lastError,
      hasPasswordProvider: userHasPasswordProvider(user),
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
      updateDisplayName: async (displayName) => {
        if (!configured) {
          setLastError('not_configured');
          return false;
        }
        setBusy(true);
        setLastError(null);
        try {
          const next = await updateUserDisplayName(displayName);
          setUser(next);
          return true;
        } catch (error) {
          setLastError(authErrorMessage(error));
          return false;
        } finally {
          setBusy(false);
        }
      },
      changePassword: (currentPassword, newPassword) =>
        runAuth(async () => {
          await changeUserPassword(currentPassword, newPassword);
        }),
      changeEmail: (currentPassword, newEmail) =>
        runAuth(async () => {
          await changeUserEmail(currentPassword, newEmail);
        }),
      refreshUser: async () => {
        if (!configured) return;
        const current = getFirebaseAuth().currentUser;
        if (!current) {
          setUser(null);
          return;
        }
        await current.reload();
        setUser(getFirebaseAuth().currentUser);
      },
      signOut: () =>
        runAuth(async () => {
          await signOutUser();
        }),
      deleteAccount: () =>
        runAuth(async () => {
          await deleteAccountUser();
        }),
      clearError,
    }),
    [user, ready, configured, busy, lastError, runAuth, clearError],
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
