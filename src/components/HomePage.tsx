import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useI18n, type Locale } from '../i18n';
import { hasSavedCourseSelection, languageForCode, useCourse, type LanguageCode } from '../course';
import { loadPendingQuiz } from '../lib/pendingQuiz';
import { learningWordForCourse } from '../lib/courseWord';
import { EMOJI_NOUN_CATEGORIES } from '../data/emojiNouns';
import { COURSE_SETUP_COPY, HOME_SCENE_COPY, homeCourseHeadline } from '../lib/coursePresentation';
import { isReviewUnlocked, loadModeUnlocks } from '../lib/modeUnlocks';
import { liveDayStreak, loadPlayerSummary } from '../lib/playerSummary';
import { completeSoftAuthPrompt, hasCompletedSoftAuthPrompt } from '../lib/authNudge';
import { loadRoundLearnedIds } from '../lib/roundLearned';
import { hydrateMatch3Memories, isDue, memoryKeyForWord } from '../lib/ebbinghausMemory';
import { speakWordQuick } from '../lib/wordSpeech';
import { ChevronDown, Languages, Mic, Video } from 'lucide-react';
import {
  AD_STAMINA_RESETS_DAILY_MAX,
  loadStaminaState,
  resetStaminaFromRewardedAd,
  saveStaminaState,
  msUntilNextStamina,
  STAMINA_MAX,
} from '../lib/stamina';
import { canPlayMoodToday, loadMoodDailyState, saveMoodDailyState } from '../lib/moodBoard';
import { isCloudQuotaAvailable, resetDailyQuotaFromRewardedAd, staminaFromDailyQuota, synchronizeDailyQuota } from '../lib/dailyQuotaCloud';
import { rewardedAdsSupported, rewardedAdsTestMode, showStaminaRewardedAd } from '../lib/rewardedAds';
import { REWARDED_AD_COPY } from '../i18n/rewardedAdCopy';
import { hasPaidAdventureBoard } from '../lib/adventureResume';
import { hasPaidModeBoard } from '../lib/modeBoardResume';
import { useMembership } from '../membership/MembershipProvider';
import { SkySparkleBackground } from './SkySparkleBackground';
import { CoursePickerSheet } from './mobile/CoursePickerSheet';

const AccountPromptSheet = lazy(() =>
  import('./mobile/AccountPromptSheet').then((module) => ({
    default: module.AccountPromptSheet,
  })),
);
const SignInSheet = lazy(() =>
  import('./mobile/SignInSheet').then((module) => ({ default: module.SignInSheet })),
);

export type HomeEntry =
  | 'adventure'
  | 'review'
  | 'mood'
  | 'say-blast'
  | 'learned'
  | 'collection'
  | 'profile';

type HomePageProps = {
  onPlay: (entry?: HomeEntry) => void;
};

type EmojiTransform = { x: number; y: number; scale: number };
type EmojiLayout = Record<string, EmojiTransform>;
type CanvasPoint = { x: number; y: number };

const HOME_LAYOUT_KEY = 'matchingo-home-emoji-layout-v1';
const COURSE_LANGUAGE_SHORT: Record<LanguageCode, string> = {
  'zh-CN': '中文', en: 'EN', es: 'ES', fr: 'FR', de: 'DE', ja: 'JP', ko: 'KR',
};
const HOME_EMOJI_ITEMS = new Map(
  EMOJI_NOUN_CATEGORIES.flatMap((category) => category.items)
    .filter((item) => Boolean(item.emoji))
    .map((item) => [item.emoji!, item] as const),
);

function staminaCountdownParts(ms: number): { hours: number; minutes: number } {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return { hours, minutes: hours === 0 && minutes === 0 && totalSeconds > 0 ? 1 : minutes };
}

const DEFAULT_EMOJI_LAYOUT: EmojiLayout = {
  dino: { x: -29.51653944020357, y: -1.956181533646323, scale: 0.7 },
  sheep: { x: -4.919423240033934, y: -2.7386541471048718, scale: 0.45 },
  'near-plant-2': { x: 55.385920271416445, y: -0.11737089201879256, scale: 1 },
  cow: { x: 40.20356234096693, y: -0.2347417840376167, scale: 0.6 },
  goose: { x: 56.658184902459666, y: -3.3646322378716795, scale: 0.8 },
  'flower-1': { x: 3.9864291772688496, y: 4.420970266040668, scale: 1.1 },
  dog: { x: -27.820186598812555, y: -4.89045383411581, scale: 0.5 },
  flamingo: { x: -21.882951653944023, y: -9.66353677621283, scale: 1 },
  'flower-2': { x: -50.63613231552166, y: 5.125195618153375, scale: 1.2 },
  horse: { x: -52.58693808312127, y: 0.11737089201878748, scale: 0.6 },
  pine: { x: 33.84223918575066, y: -4.773082942097023, scale: 1.8 },
  'tree-right': { x: 1.1874469889736994, y: -2.151799687010966, scale: 0.7 },
  'cloud-1': { x: 0, y: 0, scale: 1 },
  'far-plant-4': { x: -3.1382527565733724, y: -0.15649452269169584, scale: 1.5 },
  'near-plant-6': { x: -5.428329092451195, y: 2.738654147104855, scale: 1.1 },
  llama: { x: 36.1323155216285, y: -5.594679186228447, scale: 1.1 },
  'near-plant-1': { x: 6.191687871077139, y: -17.136150234741784, scale: 0.7 },
  'near-plant-3': { x: 0, y: 0, scale: 1 },
  'near-plant-4': { x: -47.32824427480915, y: -5.32081377151799, scale: 0.7 },
  'far-plant-3': { x: 44.10517387616623, y: 10.250391236306761, scale: 1.5 },
  'flower-3': { x: -43.681085665818514, y: -10.954616588419388, scale: 0.7 },
  'far-plant-2': { x: -8.3969465648855, y: 2.543035993740217, scale: 0.7 },
  tent: { x: 16.624257845631906, y: -1.9561815336463182, scale: 1.6 },
  'tree-left': { x: 1.2722646310432568, y: -0.8215962441314555, scale: 1.1 },
  bird: { x: 3.7319762510602246, y: -14.514866979655716, scale: 1 },
  bee: { x: 70.39864291772687, y: 12.754303599374035, scale: 0.6 },
};

function loadEmojiLayout(): EmojiLayout {
  if (typeof window === 'undefined') return { ...DEFAULT_EMOJI_LAYOUT };
  try {
    const parsed = JSON.parse(localStorage.getItem(HOME_LAYOUT_KEY) ?? '{}') as Record<
      string,
      Partial<EmojiTransform>
    >;
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_EMOJI_LAYOUT };
    const savedLayout = Object.fromEntries(
      Object.entries(parsed).map(([id, value]) => [
        id,
        {
          x: typeof value.x === 'number' ? value.x : 0,
          y: typeof value.y === 'number' ? value.y : 0,
          scale: typeof value.scale === 'number' ? value.scale : 1,
        },
      ]),
    );
    return { ...DEFAULT_EMOJI_LAYOUT, ...savedLayout };
  } catch {
    return { ...DEFAULT_EMOJI_LAYOUT };
  }
}

type DraggableEmojiProps = {
  id: string;
  emoji: string;
  word: string;
  locale: Locale;
  className: string;
  transform: EmojiTransform;
  editable: boolean;
  selected: boolean;
  onSpeak: (word: string) => void;
  onSelect: (id: string, emoji: string) => void;
};

function DraggableEmoji({
  id,
  emoji,
  word,
  locale,
  className,
  transform,
  editable,
  selected,
  onSpeak,
  onSelect,
}: DraggableEmojiProps) {
  const handlePointerDown = (event: PointerEvent<HTMLSpanElement>) => {
    if (!editable || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    onSelect(id, emoji);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (editable || (event.key !== 'Enter' && event.key !== ' ')) return;
    event.preventDefault();
    onSpeak(word);
  };

  return (
    <span
      className={`home-page-draggable${editable ? ' home-page-draggable--editable' : ''}${selected ? ' home-page-draggable--selected' : ''} ${className}`}
      style={{
        '--emoji-x': transform.x,
        '--emoji-y': transform.y,
        scale: transform.scale,
      } as CSSProperties}
      onPointerDown={handlePointerDown}
      data-emoji-id={id}
      data-emoji-value={emoji}
      onClick={() => {
        if (!editable) onSpeak(word);
      }}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={editable ? -1 : 0}
      aria-label={editable ? HOME_SCENE_COPY[locale].move(word) : HOME_SCENE_COPY[locale].hear(word)}
    >
      <span className="home-page-drag-content">{emoji}</span>
    </span>
  );
}

export function HomePage({ onPlay }: HomePageProps) {
  const spokenWordTimerRef = useRef<number | null>(null);
  const { user, ready: authReady, configured: authConfigured } = useAuth();
  const { locale, t, ui } = useI18n();
  const { courseId, course, sourceLanguage } = useCourse();
  const { hasPremiumAccess, offerings, openPaywall } = useMembership();
  const [hasCourseSelection, setHasCourseSelection] = useState(hasSavedCourseSelection);
  const [courseSetupOpen, setCourseSetupOpen] = useState(() => !hasSavedCourseSelection());
  const [cloudRefreshKey, setCloudRefreshKey] = useState(0);
  const [dueReviewCount, setDueReviewCount] = useState(0);
  const [staminaClock, setStaminaClock] = useState(() => Date.now());
  const [rewardedAdBusy, setRewardedAdBusy] = useState(false);
  const [rewardedAdStatus, setRewardedAdStatus] = useState<string | null>(null);
  const stamina = useMemo(() => loadStaminaState(staminaClock, user?.uid ?? null), [staminaClock, user?.uid]);
  useEffect(() => {
    const uid = user?.uid ?? null;
    if (!isCloudQuotaAvailable(uid)) return;
    let disposed = false;
    const refresh = async () => {
      try {
        const local = loadStaminaState(Date.now(), uid);
        const quota = await synchronizeDailyQuota(uid, local, loadMoodDailyState({ userId: uid }).plays);
        if (disposed) return;
        saveStaminaState(staminaFromDailyQuota(quota, local), uid);
        saveMoodDailyState({ dayKey: quota.dayKey, plays: quota.moodPlaysToday }, uid);
        setStaminaClock(Date.now());
        setCloudRefreshKey((key) => key + 1);
      } catch (error) {
        console.warn('[match3] daily quota sync failed', error);
      }
    };
    void refresh();
    const onVisible = () => {
      if (document.visibilityState === 'visible') void refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      disposed = true;
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [user?.uid]);
  const journey = useMemo(() => {
    void cloudRefreshKey;
    // Storage helpers namespace reads through the active course singleton.
    void courseId;
    const userId = user?.uid ?? null;
    const learnedIds = loadRoundLearnedIds(userId);
    const unlocks = loadModeUnlocks(userId);
    const summary = loadPlayerSummary(userId);
    return {
      learnedCount: learnedIds.length,
      clears: unlocks.adventureClears,
      pendingQuiz: Boolean(loadPendingQuiz(courseId, userId)),
      pendingForcedReview: unlocks.pendingForcedReview,
      dayStreak: liveDayStreak(summary),
      canReview: isReviewUnlocked(unlocks.adventureClears) && learnedIds.length >= 6,
      canPlayMood: unlocks.adventureClears >= 3 &&
        (hasPaidModeBoard('mood', userId) ||
          (canPlayMoodToday({ hasPremiumAccess, userId }) &&
            (hasPremiumAccess || stamina.value > 0))),
      canPlaySayBlast:
        learnedIds.filter((id) => id.startsWith('emoji-')).length >= 6,
    };
  }, [cloudRefreshKey, user?.uid, courseId, hasPremiumAccess, stamina.value]);

  const courseCopy = COURSE_SETUP_COPY[locale];
  const homeHeadline = homeCourseHeadline(course.targetLanguage);

  useEffect(() => {
    let cancelled = false;
    const userId = user?.uid ?? null;
    const learnedIds = loadRoundLearnedIds(userId);
    if (learnedIds.length === 0) {
      setDueReviewCount(0);
      return;
    }
    const memories = hydrateMatch3Memories(userId).map;
    void Promise.all([import('../data/emojiNouns'), import('../data/thiings100')]).then(
      ([{ EMOJI_NOUN_CATEGORIES }, { THIINGS_100 }]) => {
        if (cancelled) return;
        const wordsById = new Map<string, string>([
          ...EMOJI_NOUN_CATEGORIES.flatMap((category) =>
            category.items.map((item) => [
              `emoji-${category.id}-${item.id}`,
              learningWordForCourse(item, courseId),
            ] as const),
          ),
          ...(course.targetLanguage === 'en'
            ? THIINGS_100.map((item) => [`thiings-${item.id}`, item.word] as const)
            : []),
        ]);
        setDueReviewCount(
          learnedIds.reduce((count, id) => {
            const word = wordsById.get(id);
            const memory = word ? memories.get(memoryKeyForWord(word)) : undefined;
            return count + (memory && isDue(memory) ? 1 : 0);
          }, 0),
        );
      },
    );
    return () => {
      cancelled = true;
    };
  }, [cloudRefreshKey, user?.uid, courseId, course.targetLanguage]);

  // Recovery choices depend on energy, not whether a saved round exists.
  const adventureResting = !hasPremiumAccess && stamina.value <= 0;
  const canResumeCurrentSet = journey.pendingQuiz || hasPaidAdventureBoard(courseId, user?.uid ?? null);
  const resumeLabel: Record<Locale, string> = {
    en: 'Resume current set', 'zh-CN': '继续当前组', es: 'Continuar la serie actual',
    fr: 'Reprendre la série en cours', de: 'Aktuelles Set fortsetzen', ja: '現在のセットを再開', ko: '현재 세트 이어하기',
  };
  const nextStaminaMs = adventureResting
    ? (msUntilNextStamina(stamina, staminaClock) ?? 0)
    : 0;
  const nextStaminaCountdown = staminaCountdownParts(nextStaminaMs);
  const canEarnStamina = journey.canPlaySayBlast && stamina.value < STAMINA_MAX;
  const adCopy = REWARDED_AD_COPY[locale];
  const lifetimeDisplayPrice = offerings.lifetime.displayPrice === '—'
    ? null
    : offerings.lifetime.displayPrice;
  const rewardedAdResetsRemaining = Math.max(
    0,
    AD_STAMINA_RESETS_DAILY_MAX - stamina.adResetsToday,
  );

  useEffect(() => {
    if (!adventureResting) return;
    const timer = window.setInterval(() => setStaminaClock(Date.now()), 1_000);
    return () => window.clearInterval(timer);
  }, [adventureResting]);

  const primaryEntry: HomeEntry = 'adventure';
  const primaryLabel = journey.clears === 0 && !journey.pendingQuiz
    ? ui.home.startAdventure
    : ui.home.continueAdventure;
  const progressLine = `${ui.learned.learnedCount(journey.learnedCount)} · 🔥 ${ui.roundResult.dayStreak(journey.dayStreak)}`;
  const [signInOpen, setSignInOpen] = useState(false);
  const [signInInitialMode, setSignInInitialMode] = useState<'signIn' | 'signUp'>('signIn');
  const [accountPromptOpen, setAccountPromptOpen] = useState(false);
  const [progressSavedVisible, setProgressSavedVisible] = useState(false);
  const promptAuthStartedRef = useRef(false);
  const [savedLayout, setSavedLayout] = useState<EmojiLayout>(loadEmojiLayout);
  const [emojiLayout, setEmojiLayout] = useState<EmojiLayout>(() => ({ ...savedLayout }));
  const [selectedEmoji, setSelectedEmoji] = useState<{ id: string; emoji: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [spokenWord, setSpokenWord] = useState<{ word: string; key: number } | null>(null);
  const emojiLayoutRef = useRef(emojiLayout);
  const canvasGestureRef = useRef<{
    pointers: Map<number, CanvasPoint>;
    targetId: string | null;
    origin: EmojiTransform;
    startCenter: CanvasPoint;
    startDistance: number;
    dragFromEmoji: boolean;
  }>({
    pointers: new Map(),
    targetId: null,
    origin: { x: 0, y: 0, scale: 1 },
    startCenter: { x: 0, y: 0 },
    startDistance: 0,
    dragFromEmoji: false,
  });

  useEffect(() => {
    emojiLayoutRef.current = emojiLayout;
  }, [emojiLayout]);

  useEffect(() => {
    return () => {
      if (spokenWordTimerRef.current !== null) window.clearTimeout(spokenWordTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    void import('../lib/memoryCloudSync')
      .then(({ hydrateCoreProgressWithCloud }) => hydrateCoreProgressWithCloud(user.uid, courseId))
      .then(() => {
        if (cancelled) return;
        setCloudRefreshKey((key) => key + 1);
        if (promptAuthStartedRef.current) {
          promptAuthStartedRef.current = false;
          setProgressSavedVisible(true);
          window.setTimeout(() => setProgressSavedVisible(false), 1800);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [user?.uid, courseId]);

  useEffect(() => {
    if (
      !hasCourseSelection ||
      !authReady ||
      !authConfigured ||
      user ||
      journey.clears < 3 ||
      journey.learnedCount < 18 ||
      journey.pendingForcedReview ||
      hasCompletedSoftAuthPrompt()
    ) {
      return;
    }
    setAccountPromptOpen(true);
  }, [authConfigured, authReady, hasCourseSelection, journey.clears, journey.learnedCount, journey.pendingForcedReview, user]);

  const dismissAccountPrompt = () => {
    completeSoftAuthPrompt();
    setAccountPromptOpen(false);
  };

  const openPromptAuth = (mode: 'signIn' | 'signUp') => {
    completeSoftAuthPrompt();
    promptAuthStartedRef.current = true;
    setAccountPromptOpen(false);
    setSignInInitialMode(mode);
    setSignInOpen(true);
  };

  const handleRewardedAd = async () => {
    if (rewardedAdBusy) return;
    if (rewardedAdResetsRemaining <= 0) {
      setRewardedAdStatus(adCopy.dailyLimit);
      return;
    }
    setRewardedAdBusy(true);
    setRewardedAdStatus(adCopy.loading);
    try {
      await showStaminaRewardedAd();
      const uid = user?.uid ?? null;
      if (isCloudQuotaAvailable(uid)) {
        const quota = await resetDailyQuotaFromRewardedAd(
          uid,
          stamina,
          loadMoodDailyState({ userId: uid }).plays,
        );
        if (!quota) {
          setRewardedAdStatus(adCopy.dailyLimit);
          return;
        }
        saveStaminaState(staminaFromDailyQuota(quota, stamina), uid);
        saveMoodDailyState({ dayKey: quota.dayKey, plays: quota.moodPlaysToday }, uid);
      } else {
        const reward = resetStaminaFromRewardedAd(stamina);
        if (reward.outcome !== 'granted') {
          setRewardedAdStatus(
            reward.outcome === 'daily-limit' ? adCopy.dailyLimit : adCopy.rewarded,
          );
          return;
        }
        saveStaminaState(reward.state, uid);
      }
      setStaminaClock(Date.now());
      setCloudRefreshKey((key) => key + 1);
      setRewardedAdStatus(adCopy.rewarded);
    } catch (error) {
      console.warn('[match3] rewarded ad failed', error);
      setRewardedAdStatus(
        rewardedAdsTestMode()
          ? `Test ad error: ${error instanceof Error ? error.message : String(error)}`
          : adCopy.unavailable,
      );
    } finally {
      setRewardedAdBusy(false);
    }
  };

  const moveEmoji = (id: string, transform: EmojiTransform) => {
    const next = { ...emojiLayoutRef.current, [id]: transform };
    emojiLayoutRef.current = next;
    setEmojiLayout(next);
  };

  const canvasGestureGeometry = (pointers: Map<number, CanvasPoint>) => {
    const points = [...pointers.values()].slice(0, 2);
    const first = points[0] ?? { x: 0, y: 0 };
    const second = points[1];
    return {
      center: second
        ? { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 }
        : first,
      distance: second ? Math.hypot(second.x - first.x, second.y - first.y) : 0,
    };
  };

  const resetCanvasGestureBaseline = () => {
    const gesture = canvasGestureRef.current;
    if (!gesture.targetId) return;
    const geometry = canvasGestureGeometry(gesture.pointers);
    gesture.origin = emojiLayoutRef.current[gesture.targetId] ?? { x: 0, y: 0, scale: 1 };
    gesture.startCenter = geometry.center;
    gesture.startDistance = geometry.distance;
  };

  const handleCanvasPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (!editing || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('button, input, a, [role="dialog"]')) return;
    const emojiTarget = target?.closest<HTMLElement>('[data-emoji-id]');
    const hitId = emojiTarget?.dataset.emojiId;
    const targetId = hitId ?? selectedEmoji?.id;
    if (!targetId) return;

    const gesture = canvasGestureRef.current;
    if (gesture.pointers.size >= 2 && !gesture.pointers.has(event.pointerId)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    if (gesture.pointers.size === 0) {
      gesture.targetId = targetId;
      gesture.dragFromEmoji = Boolean(hitId);
      if (hitId) {
        setSelectedEmoji({ id: hitId, emoji: emojiTarget?.dataset.emojiValue ?? '' });
      }
    }
    gesture.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    resetCanvasGestureBaseline();
  };

  const handleCanvasPointerMove = (event: PointerEvent<HTMLElement>) => {
    const gesture = canvasGestureRef.current;
    const targetId = gesture.targetId;
    if (!editing || !targetId || !gesture.pointers.has(event.pointerId)) return;
    event.preventDefault();
    gesture.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const geometry = canvasGestureGeometry(gesture.pointers);
    const pinching = gesture.pointers.size >= 2 && gesture.startDistance > 0;
    if (!pinching && !gesture.dragFromEmoji) return;
    const scaleRatio = pinching ? geometry.distance / gesture.startDistance : 1;
    moveEmoji(targetId, {
      x: gesture.origin.x + ((geometry.center.x - gesture.startCenter.x) / window.innerWidth) * 100,
      y: gesture.origin.y + ((geometry.center.y - gesture.startCenter.y) / window.innerHeight) * 100,
      scale: Math.min(2, Math.max(0.45, gesture.origin.scale * scaleRatio)),
    });
  };

  const finishCanvasGesture = (event: PointerEvent<HTMLElement>) => {
    const gesture = canvasGestureRef.current;
    if (!gesture.pointers.delete(event.pointerId)) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (gesture.pointers.size > 0) {
      gesture.dragFromEmoji = false;
      resetCanvasGestureBaseline();
      return;
    }
    gesture.targetId = null;
    gesture.dragFromEmoji = false;
  };

  const speakAndShowWord = (word: string) => {
    speakWordQuick(word);
    setSpokenWord({ word, key: Date.now() });
    if (spokenWordTimerRef.current !== null) window.clearTimeout(spokenWordTimerRef.current);
    spokenWordTimerRef.current = window.setTimeout(() => {
      setSpokenWord(null);
      spokenWordTimerRef.current = null;
    }, 1400);
  };

  const emoji = (id: string, value: string, word: string, className: string) => {
    const courseItem = HOME_EMOJI_ITEMS.get(value);
    const learningWord = courseItem ? learningWordForCourse(courseItem, courseId) : word;
    return (
    <DraggableEmoji
      key={id}
      id={id}
      emoji={value}
      word={learningWord}
      locale={locale}
      className={className}
      transform={emojiLayout[id] ?? { x: 0, y: 0, scale: 1 }}
      editable={editing}
      selected={editing && selectedEmoji?.id === id}
      onSpeak={speakAndShowWord}
      onSelect={(selectedId, selectedValue) =>
        setSelectedEmoji({ id: selectedId, emoji: selectedValue })
      }
    />
    );
  };

  const beginEditing = () => {
    setEmojiLayout({ ...savedLayout });
    setSelectedEmoji(null);
    setSpokenWord(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEmojiLayout({ ...savedLayout });
    setSelectedEmoji(null);
    setEditing(false);
  };

  const resetLayout = () => {
    setEmojiLayout({ ...DEFAULT_EMOJI_LAYOUT });
    setSelectedEmoji(null);
  };

  const saveEditing = () => {
    const next = { ...emojiLayout };
    localStorage.setItem(HOME_LAYOUT_KEY, JSON.stringify(next));
    setSavedLayout(next);
    setSelectedEmoji(null);
    setEditing(false);
  };

  return (
    <main
      className={`home-page${editing ? ' home-page--editing' : ''}`}
      onPointerDownCapture={handleCanvasPointerDown}
      onPointerMoveCapture={handleCanvasPointerMove}
      onPointerUpCapture={finishCanvasGesture}
      onPointerCancelCapture={finishCanvasGesture}
    >
      <SkySparkleBackground variant="splash" />

      {!editing && spokenWord && (
        <div
          key={spokenWord.key}
          className="home-page-spoken-word"
          role="status"
          aria-live="polite"
        >
          {spokenWord.word}
        </div>
      )}

      <div className="home-page-clouds">
        {emoji('cloud-1', '☁️', 'Cloud', 'home-page-cloud home-page-cloud--one')}
        {emoji('cloud-2', '☁️', 'Cloud', 'home-page-cloud home-page-cloud--two')}
        {emoji('cloud-3', '☁️', 'Cloud', 'home-page-cloud home-page-cloud--three')}
        {emoji('bird', '🕊️', 'Dove', 'home-page-sky-life home-page-sky-life--bird')}
      </div>

      <div className="home-page-bee-layer">
        {emoji('bee', '🐝', 'Honeybee', 'home-page-sky-life home-page-sky-life--bee')}
      </div>

      <div className="home-page-landscape">
        <div className="home-page-far-hill">
          {emoji('tree-left', '🌳', 'Deciduous Tree', 'home-page-tree home-page-tree--left')}
          {emoji('tree-right', '🌳', 'Deciduous Tree', 'home-page-tree home-page-tree--right')}
          {emoji('pine', '🌲', 'Evergreen Tree', 'home-page-distant home-page-distant--pine')}
          {emoji('tent', '🏕️', 'Camping', 'home-page-distant home-page-distant--tent')}
          {emoji('far-plant-1', '🌱', 'Seedling', 'home-page-plant home-page-plant--far-1')}
          {emoji('far-plant-2', '🌿', 'Herb', 'home-page-plant home-page-plant--far-2')}
          {emoji('far-plant-3', '☘️', 'Shamrock', 'home-page-plant home-page-plant--far-3')}
          {emoji('far-plant-4', '🌵', 'Cactus', 'home-page-plant home-page-plant--far-4')}
          {emoji('far-plant-5', '🌴', 'Palm Tree', 'home-page-plant home-page-plant--far-5')}
        </div>
        <span className="home-page-grass" />
        {emoji('near-plant-1', '🌿', 'Herb', 'home-page-plant home-page-plant--near-1')}
        {emoji('near-plant-2', '☘️', 'Shamrock', 'home-page-plant home-page-plant--near-2')}
        {emoji('near-plant-3', '🌱', 'Seedling', 'home-page-plant home-page-plant--near-3')}
        {emoji('near-plant-4', '🌿', 'Herb', 'home-page-plant home-page-plant--near-4')}
        {emoji('near-plant-5', '☘️', 'Shamrock', 'home-page-plant home-page-plant--near-5')}
        {emoji('near-plant-6', '🌱', 'Seedling', 'home-page-plant home-page-plant--near-6')}
        {emoji('flower-1', '🌷', 'Tulip', 'home-page-flower home-page-flower--one')}
        {emoji('flower-2', '🪻', 'Hyacinth', 'home-page-flower home-page-flower--two')}
        {emoji('flower-3', '🌼', 'Blossom', 'home-page-flower home-page-flower--three')}
      </div>

      <div className="home-page-card">
        <button
          type="button"
          className="home-page-course-switch"
          aria-label={`${courseCopy.changeCourse}: ${course.label}`}
          onClick={() => {
            setCourseSetupOpen(true);
          }}
        >
          <Languages size={17} strokeWidth={2.4} aria-hidden />
          <span>{languageForCode(course.sourceLanguage).nativeName} → {COURSE_LANGUAGE_SHORT[course.targetLanguage]}</span>
          <ChevronDown size={15} strokeWidth={3} aria-hidden />
        </button>
        <h1 className="home-page-title">{homeHeadline.primary}<span>{homeHeadline.secondary}</span></h1>

        <div className="home-page-animals">
          {emoji('cow', '🐄', 'Cow', 'home-page-animal home-page-animal--cow')}
          {emoji('sheep', '🐑', 'Ewe', 'home-page-animal home-page-animal--sheep')}
          {emoji('horse', '🐎', 'Horse', 'home-page-animal home-page-animal--horse')}
          {emoji('dog', '🐕', 'Dog', 'home-page-animal home-page-animal--dog')}
          {emoji('goose', '🪿', 'Goose', 'home-page-animal home-page-animal--goose')}
          {emoji('dino', '🦕', 'Sauropod', 'home-page-animal home-page-animal--dino')}
          {emoji('llama', '🦙', 'Llama', 'home-page-animal home-page-animal--llama')}
          {emoji('flamingo', '🦩', 'Flamingo', 'home-page-animal home-page-animal--flamingo')}
        </div>

        {!editing && (
          <div className="home-page-actions">
            {journey.learnedCount > 0 && (
              <div className="home-page-progress-copy" aria-label={ui.home.todaysProgress}>
                <div className="home-page-progress-meta">
                  {progressLine} · ⚡ {hasPremiumAccess ? '∞' : `${stamina.value}/${STAMINA_MAX}`}
                </div>
              </div>
            )}
            {adventureResting ? (
              <>
                <div className="home-page-rest-status" role="status">
                  <strong>{t.modes.noStamina}</strong>
                  <span>{t.adventure.deadWait}</span>
                  <span>{t.adventure.deadWaitRemaining(nextStaminaCountdown.hours, nextStaminaCountdown.minutes)}</span>
                </div>
                <div className="home-page-rest-modes">
                  {canResumeCurrentSet && (
                    <button className="home-page-rest-secondary" type="button" onClick={() => onPlay('adventure')}>
                      {resumeLabel[locale]} ›
                    </button>
                  )}
                  <button
                    className="home-page-rest-primary"
                    type="button"
                    onClick={() => openPaywall('profile')}
                  >
                    <span aria-hidden>👑</span> {adCopy.unlockPlus(lifetimeDisplayPrice)}
                  </button>
                  <div className="home-page-rest-recovery">
                    {rewardedAdsSupported() && rewardedAdResetsRemaining > 0 && (
                      <button
                        className="home-page-rest-secondary"
                        type="button"
                        disabled={rewardedAdBusy}
                        onClick={() => void handleRewardedAd()}
                      >
                        <span className="home-page-rest-label">
                          <Video size={16} strokeWidth={2.7} aria-hidden />
                          {rewardedAdBusy ? adCopy.loading : adCopy.watch}
                        </span>
                        {!rewardedAdBusy && (
                          <small>
                            {adCopy.watchReward}
                            <span className="home-page-rest-quota"> · {adCopy.remaining(rewardedAdResetsRemaining)}</span>
                          </small>
                        )}
                      </button>
                    )}
                    {canEarnStamina && (
                      <button
                        className="home-page-rest-secondary"
                        type="button"
                        onClick={() => onPlay('say-blast')}
                      >
                        <span className="home-page-rest-label">
                          <Mic size={16} strokeWidth={2.7} aria-hidden />
                          {adCopy.practiceForEnergy}
                        </span>
                        <small>{adCopy.practiceReward}</small>
                      </button>
                    )}
                  </div>
                  {(journey.canReview || journey.canPlayMood) && (
                    <div className="home-page-rest-practice">
                      {journey.canReview && (
                        <button type="button" onClick={() => onPlay('review')}>
                          {adCopy.reviewWhileWaiting} ›
                        </button>
                      )}
                      {journey.canPlayMood && (
                        <button type="button" onClick={() => onPlay('mood')}>
                          {ui.deadMachine.playMood} ›
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {rewardedAdStatus && (
                  <div className="home-page-rest-feedback" role="status">
                    {rewardedAdStatus}
                  </div>
                )}
              </>
            ) : (
              <button className="home-page-play" type="button" onClick={() => onPlay(primaryEntry)}>{primaryLabel}</button>
            )}
            {journey.learnedCount > 0 && (
              <button className="home-page-review-entry" type="button" onClick={() => onPlay('learned')}>
                🧠 {dueReviewCount > 0 ? ui.home.reviewReady(dueReviewCount) : ui.learned.myWords} ›
              </button>
            )}
          </div>
        )}

        {editing && (
          <button className="home-page-done" type="button" onClick={saveEditing}>{t.common.done}</button>
        )}
      </div>

      <div className="home-page-edit-actions">
        {editing ? (
          <>
            <button type="button" onClick={cancelEditing}>{courseCopy.cancel}</button>
            <button type="button" onClick={resetLayout}>{HOME_SCENE_COPY[locale].reset}</button>
          </>
        ) : (
          <button type="button" onClick={beginEditing}>{HOME_SCENE_COPY[locale].edit}</button>
        )}
      </div>

      {progressSavedVisible && (
        <div className="home-page-save-confirmation" role="status">✅ {ui.progressSaved}</div>
      )}

      <Suspense fallback={null}>
        {courseSetupOpen && (
          <CoursePickerSheet
            initialSourceLanguage={hasCourseSelection ? sourceLanguage : locale}
            initialCourseId={courseId}
            required={!hasCourseSelection}
            onClose={() => setCourseSetupOpen(false)}
            onConfirmed={() => {
              setHasCourseSelection(true);
              setCourseSetupOpen(false);
              onPlay('adventure');
            }}
          />
        )}
        {accountPromptOpen && (
          <AccountPromptSheet
            open
            kind="soft"
            discoveredCount={journey.learnedCount}
            onCreateAccount={() => openPromptAuth('signUp')}
            onSignIn={() => openPromptAuth('signIn')}
            onDismiss={dismissAccountPrompt}
          />
        )}
        {signInOpen && (
          <SignInSheet
            open
            initialMode={signInInitialMode}
            onClose={() => setSignInOpen(false)}
          />
        )}
      </Suspense>
    </main>
  );
}
