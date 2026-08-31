import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  FALLBACK_MEMBERSHIP_OFFERINGS,
  type MembershipPlan,
  type MembershipOfferings,
} from './membershipOfferings';

export type { MembershipPlan } from './membershipOfferings';

const STORAGE_KEY = 'matchingo-membership-v1';
export const MEMBERSHIP_TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export type MembershipStatus = 'not-started' | 'trial' | 'free' | 'premium';
export type MembershipPaywallSource =
  | 'category-mode'
  | 'learned-tab'
  | 'profile'
  | 'trial-expired';

type StoredMembershipState = {
  version: 1;
  trialStartedAtMs: number | null;
  trialEndsAtMs: number | null;
  trialWelcomeSeen: boolean;
  expirationChoiceSeen: boolean;
  /** Development-only stand-in until App Store purchases are connected. */
  developmentPlan: MembershipPlan | null;
};

type MembershipContextValue = {
  status: MembershipStatus;
  hasPremiumAccess: boolean;
  trialStartedAtMs: number | null;
  trialEndsAtMs: number | null;
  trialRemainingMs: number;
  shouldShowTrialWelcome: boolean;
  shouldShowExpirationChoice: boolean;
  paywallOpen: boolean;
  paywallSource: MembershipPaywallSource;
  offerings: MembershipOfferings;
  startTrial: () => void;
  markTrialWelcomeSeen: () => void;
  continueWithFree: () => void;
  openPaywall: (source: MembershipPaywallSource) => void;
  closePaywall: () => void;
  activateDevelopmentPlan: (plan: MembershipPlan) => void;
};

const DEFAULT_STATE: StoredMembershipState = {
  version: 1,
  trialStartedAtMs: null,
  trialEndsAtMs: null,
  trialWelcomeSeen: false,
  expirationChoiceSeen: false,
  developmentPlan: null,
};

function finiteTimestamp(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : null;
}

function loadState(): StoredMembershipState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<StoredMembershipState>;
    const trialStartedAtMs = finiteTimestamp(parsed.trialStartedAtMs);
    const trialEndsAtMs = finiteTimestamp(parsed.trialEndsAtMs);
    return {
      version: 1,
      trialStartedAtMs,
      trialEndsAtMs:
        trialStartedAtMs === null
          ? null
          : trialEndsAtMs ?? trialStartedAtMs + MEMBERSHIP_TRIAL_DURATION_MS,
      trialWelcomeSeen: Boolean(parsed.trialWelcomeSeen),
      expirationChoiceSeen: Boolean(parsed.expirationChoiceSeen),
      developmentPlan:
        parsed.developmentPlan === 'monthly' || parsed.developmentPlan === 'annual'
          ? parsed.developmentPlan
          : null,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState(state: StoredMembershipState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // A private browsing environment may reject storage. The in-memory trial
    // remains usable for the current session.
  }
}

const MembershipContext = createContext<MembershipContextValue | null>(null);

export function MembershipProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<StoredMembershipState>(loadState);
  const [now, setNow] = useState(Date.now());
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallSource, setPaywallSource] =
    useState<MembershipPaywallSource>('profile');

  const updateStored = useCallback(
    (update: (current: StoredMembershipState) => StoredMembershipState) => {
      setStored((current) => {
        const next = update(current);
        if (next === current) return current;
        saveState(next);
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    const refresh = () => {
      if (document.visibilityState === 'visible') setNow(Date.now());
    };
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  const status = useMemo<MembershipStatus>(() => {
    if (import.meta.env.DEV && stored.developmentPlan) return 'premium';
    if (stored.trialStartedAtMs === null || stored.trialEndsAtMs === null) {
      return 'not-started';
    }
    return now < stored.trialEndsAtMs ? 'trial' : 'free';
  }, [now, stored.developmentPlan, stored.trialEndsAtMs, stored.trialStartedAtMs]);

  const startTrial = useCallback(() => {
    updateStored((current) => {
      if (current.trialStartedAtMs !== null) return current;
      const startedAt = Date.now();
      setNow(startedAt);
      return {
        ...current,
        trialStartedAtMs: startedAt,
        trialEndsAtMs: startedAt + MEMBERSHIP_TRIAL_DURATION_MS,
        trialWelcomeSeen: false,
        expirationChoiceSeen: false,
      };
    });
  }, [updateStored]);

  const markTrialWelcomeSeen = useCallback(() => {
    updateStored((current) =>
      current.trialWelcomeSeen
        ? current
        : { ...current, trialWelcomeSeen: true },
    );
  }, [updateStored]);

  const continueWithFree = useCallback(() => {
    updateStored((current) =>
      current.expirationChoiceSeen
        ? current
        : { ...current, expirationChoiceSeen: true },
    );
    setPaywallOpen(false);
  }, [updateStored]);

  const openPaywall = useCallback((source: MembershipPaywallSource) => {
    setPaywallSource(source);
    setPaywallOpen(true);
  }, []);

  const closePaywall = useCallback(() => setPaywallOpen(false), []);

  const activateDevelopmentPlan = useCallback(
    (plan: MembershipPlan) => {
      if (!import.meta.env.DEV) return;
      updateStored((current) => ({
        ...current,
        developmentPlan: plan,
        expirationChoiceSeen: true,
      }));
      setPaywallOpen(false);
    },
    [updateStored],
  );

  const trialRemainingMs = Math.max(0, (stored.trialEndsAtMs ?? now) - now);
  const shouldShowTrialWelcome =
    status === 'trial' && !stored.trialWelcomeSeen;
  const shouldShowExpirationChoice =
    status === 'free' && !stored.expirationChoiceSeen;

  const value = useMemo<MembershipContextValue>(
    () => ({
      status,
      // Treat the few milliseconds before startTrial runs as entitled so the
      // first game frame never flashes a locked tab.
      hasPremiumAccess:
        status === 'not-started' || status === 'trial' || status === 'premium',
      trialStartedAtMs: stored.trialStartedAtMs,
      trialEndsAtMs: stored.trialEndsAtMs,
      trialRemainingMs,
      shouldShowTrialWelcome,
      shouldShowExpirationChoice,
      paywallOpen,
      paywallSource,
      offerings: FALLBACK_MEMBERSHIP_OFFERINGS,
      startTrial,
      markTrialWelcomeSeen,
      continueWithFree,
      openPaywall,
      closePaywall,
      activateDevelopmentPlan,
    }),
    [
      activateDevelopmentPlan,
      closePaywall,
      continueWithFree,
      markTrialWelcomeSeen,
      openPaywall,
      paywallOpen,
      paywallSource,
      shouldShowExpirationChoice,
      shouldShowTrialWelcome,
      startTrial,
      status,
      stored.trialEndsAtMs,
      stored.trialStartedAtMs,
      trialRemainingMs,
    ],
  );

  return (
    <MembershipContext.Provider value={value}>
      {children}
    </MembershipContext.Provider>
  );
}

export function useMembership(): MembershipContextValue {
  const value = useContext(MembershipContext);
  if (!value) {
    throw new Error('useMembership must be used inside MembershipProvider');
  }
  return value;
}
