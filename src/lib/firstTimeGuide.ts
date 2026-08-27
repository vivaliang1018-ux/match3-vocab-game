import {
  claimGuestProgress,
  clearScopedProgress,
  readScopedProgress,
  writeScopedProgress,
} from './progressScope';

const STORAGE_KEY = 'matchingo-first-time-guide-v1';

export type FeatureGuideTarget =
  | 'learned'
  | 'sayAndBlastModePicker'
  | 'sayAndBlast'
  | 'moodBoardModePicker'
  | 'moodBoard';

export type FirstTimeGuideStage =
  | 'none'
  | 'learned'
  | 'sayAndBlast'
  | 'awaitingSayAndBlastCompletion'
  | 'moodBoard'
  | 'completed';

export type FirstTimeGuideState = {
  version: 1;
  hasCompletedFirstSwapTutorial: boolean;
  hasStartedFreeMoveRuleTutorial: boolean;
  hasCompletedFreeMoveRuleTutorial: boolean;
  hasCompletedReviewTutorial: boolean;
  hasSeenReviveTutorial: boolean;
  hasSeenStaminaShortage: boolean;
  stage: FirstTimeGuideStage;
  promptCounts: Record<FeatureGuideTarget, number>;
};

const DEFAULT_STATE: FirstTimeGuideState = {
  version: 1,
  hasCompletedFirstSwapTutorial: false,
  hasStartedFreeMoveRuleTutorial: false,
  hasCompletedFreeMoveRuleTutorial: false,
  hasCompletedReviewTutorial: false,
  hasSeenReviveTutorial: false,
  hasSeenStaminaShortage: false,
  stage: 'none',
  promptCounts: {
    learned: 0,
    sayAndBlastModePicker: 0,
    sayAndBlast: 0,
    moodBoardModePicker: 0,
    moodBoard: 0,
  },
};

const GUIDE_STAGES = new Set<FirstTimeGuideStage>([
  'none',
  'learned',
  'sayAndBlast',
  'awaitingSayAndBlastCompletion',
  'moodBoard',
  'completed',
]);

function promptCount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.min(2, Math.floor(value)))
    : 0;
}

export function loadFirstTimeGuideState(
  userUid?: string | null,
): FirstTimeGuideState {
  claimGuestProgress(STORAGE_KEY, userUid);
  try {
    const raw = readScopedProgress(STORAGE_KEY, userUid);
    if (!raw) return structuredClone(DEFAULT_STATE);
    const parsed = JSON.parse(raw) as Partial<FirstTimeGuideState>;
    const counts = parsed.promptCounts as
      | Partial<Record<FeatureGuideTarget, unknown>>
      | undefined;
    return {
      version: 1,
      hasCompletedFirstSwapTutorial: Boolean(
        parsed.hasCompletedFirstSwapTutorial,
      ),
      hasStartedFreeMoveRuleTutorial: Boolean(parsed.hasStartedFreeMoveRuleTutorial),
      hasCompletedFreeMoveRuleTutorial: Boolean(parsed.hasCompletedFreeMoveRuleTutorial),
      hasCompletedReviewTutorial: Boolean(parsed.hasCompletedReviewTutorial),
      hasSeenReviveTutorial: Boolean(parsed.hasSeenReviveTutorial),
      hasSeenStaminaShortage: Boolean(parsed.hasSeenStaminaShortage),
      stage:
        typeof parsed.stage === 'string' &&
        GUIDE_STAGES.has(parsed.stage as FirstTimeGuideStage)
          ? (parsed.stage as FirstTimeGuideStage)
          : 'none',
      promptCounts: {
        learned: promptCount(counts?.learned),
        sayAndBlastModePicker: promptCount(counts?.sayAndBlastModePicker),
        sayAndBlast: promptCount(counts?.sayAndBlast),
        moodBoardModePicker: promptCount(counts?.moodBoardModePicker),
        moodBoard: promptCount(counts?.moodBoard),
      },
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}

export function saveFirstTimeGuideState(
  state: FirstTimeGuideState,
  userUid?: string | null,
): void {
  writeScopedProgress(STORAGE_KEY, JSON.stringify(state), userUid);
}

export function clearFirstTimeGuideState(userUid?: string | null): void {
  clearScopedProgress(STORAGE_KEY, userUid);
}

export function recordFeatureGuidePrompt(
  state: FirstTimeGuideState,
  target: FeatureGuideTarget,
): FirstTimeGuideState {
  const count = state.promptCounts[target];
  if (count >= 2) return state;
  return {
    ...state,
    promptCounts: {
      ...state.promptCounts,
      [target]: count + 1,
    },
  };
}
