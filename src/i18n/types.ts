export type Locale = 'zh-CN' | 'en' | 'es' | 'fr' | 'de' | 'ja' | 'ko';

export const LOCALES: readonly Locale[] = ['zh-CN', 'en', 'es', 'fr', 'de', 'ja', 'ko'] as const;

export type CountdownCopy = {
  due: string;
  days: (n: number) => string;
  hours: (n: number) => string;
  minutes: (n: number) => string;
  seconds: (n: number) => string;
};

/** Paired playful celebration card (title + body + CTAs). */
export type CelebrationCard = {
  title: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
};

export type Messages = {
  meta: { appTitle: string; uiVersion: string };
  common: {
    close: string;
    skip: string;
    prev: string;
    next: string;
    done: string;
    current: string;
    preview: string;
    words: string;
  };
  tabs: {
    navAria: string;
    game: string;
    learned: string;
    words: string;
    profile: string;
    dueBadge: (n: number) => string;
  };
  profile: {
    guestName: string;
    guestBadge: string;
    subtitle: string;
    signInCta: string;
    signInComingSoonHint: string;
    statsTitle: string;
    /** Personal bests + award tracks. */
    recordsTitle: string;
    awardsTitle: string;
    recordSetsLabel: string;
    recordDayLabel: string;
    recordComboLabel: string;
    recordStory: (id: 'sets' | 'day' | 'combo', value: number) => string;
    awardMaxed: string;
    awardProgress: (current: number, next: number) => string;
    awardNewBadge: string;
    awardLockedHint: string;
    awardClaimCta: string;
    awardClaimedCta: string;
    awardKeepGoingCta: string;
    awardLockedStory: (
      id:
        | 'set_hunter'
        | 'day_nail'
        | 'combo_king'
        | 'dex_collector'
        | 'review_brain'
        | 'category_fan',
      next: number,
    ) => string;
    awardStory: (
      id:
        | 'set_hunter'
        | 'day_nail'
        | 'combo_king'
        | 'dex_collector'
        | 'review_brain'
        | 'category_fan',
      value: number,
    ) => string;
    awardName: (
      id:
        | 'set_hunter'
        | 'day_nail'
        | 'combo_king'
        | 'dex_collector'
        | 'review_brain'
        | 'category_fan',
    ) => string;
    emojisCleared: string;
    emojiProgress: string;
    emojiProgressDetail: (cleared: number, total: number) => string;
    language: string;
    languageHint: string;
    preferencesTitle: string;
    toggleOn: string;
    toggleOff: string;
    bgm: string;
    sfx: string;
    haptics: string;
    actionsTitle: string;
    openLearned: string;
    openWords: string;
    aboutTitle: string;
    description: string;
    version: string;
    termsOfService: string;
    privacyPolicy: string;
    ttsUnavailable: string;
    thiingsCredit: string;
    signedInBadge: string;
    signedInSubtitle: string;
    signOutCta: string;
    deleteAccountCta: string;
    deleteAccountConfirmTitle: string;
    deleteAccountConfirmBody: string;
    deleteAccountConfirmAction: string;
    deleteAccountCancel: string;
    deleteAccountDone: string;
    deleteAccountNeedsRelogin: string;
    deleteAccountFailed: string;
    accountSettingsTitle: string;
    accountOpenSettings: string;
    accountChangeAvatar: string;
    accountDisplayName: string;
    accountDisplayNamePlaceholder: string;
    accountSaveName: string;
    accountNameSaved: string;
    accountNameEmpty: string;
    accountNameSaveFailed: string;
    accountLinkedTitle: string;
    accountEmail: string;
    accountEmailHidden: string;
    accountProviders: string;
    accountProviderApple: string;
    accountProviderGoogle: string;
    accountProviderEmail: string;
    accountProviderLinked: string;
    accountSecurityTitle: string;
    accountChangeEmail: string;
    accountChangePassword: string;
    accountCurrentPassword: string;
    accountNewEmail: string;
    accountNewPassword: string;
    accountConfirmPassword: string;
    accountSaveEmail: string;
    accountSavePassword: string;
    accountEmailVerifySent: string;
    accountPasswordChanged: string;
    accountPasswordMismatch: string;
    accountSecurityOnlyPassword: string;
    accountWrongPassword: string;
    accountInvalidEmail: string;
    accountSameEmail: string;
  };
  auth: {
    dialogAria: string;
    dialogTitle: string;
    dialogBody: string;
    appleCta: string;
    googleCta: string;
    emailDivider: string;
    socialDivider: string;
    email: string;
    password: string;
    emailSignInCta: string;
    emailSignUpCta: string;
    emailSigningIn: string;
    emailSigningUp: string;
    noAccount: string;
    hasAccount: string;
    switchToSignUp: string;
    switchToSignIn: string;
    forgotPassword: string;
    resetPasswordSent: string;
    resetPasswordNeedEmail: string;
    successSignIn: string;
    successSignUp: string;
    errorNeedEmail: string;
    errorPopupClosed: string;
    errorInvalidCredentials: string;
    errorEmailInUse: string;
    errorWeakPassword: string;
    errorTooManyRequests: string;
    errorNotConfigured: string;
    errorProviderDisabled: string;
    errorRequiresRecentLogin: string;
    errorNetwork: string;
    errorUnknown: string;
  };
  gameSettings: {
    title: string;
    dialogAria: string;
    bgm: string;
    mute: string;
    restart: string;
    home: string;
    homeConfirmTitle: string;
    homeConfirmBody: string;
    homeConfirmStay: string;
    homeConfirmLeave: string;
  };
  modes: {
    pickerTitle: string;
    /** Adventure / 闯关 (legacy key `random`). */
    random: string;
    randomDesc: string;
    category: string;
    categoryDesc: string;
    review: string;
    reviewDesc: string;
    /** @deprecated Prefer adventure.reviveTitle — kept for legacy keys. */
    fun: string;
    funDesc: string;
    funChallenge: string;
    /** Timed-target hunt hint (revive / review). */
    timedTargetFindHint: string;
    /** @deprecated Alias of timedTargetFindHint. */
    funFindHint: string;
    categoryThemes: string;
    shuffle: string;
    reshuffleBoard: string;
    randomChallenge: string;
    reviewMode: string;
    categoryFallback: string;
    thiingsLabel: string;
    thiingsSubtitle: string;
    moodBoard: string;
    moodSwitchBoard: string;
    sayBlast: string;
    sayBlastDesc: string;
    moodPaletteName: (
      id:
        | 'red'
        | 'orange'
        | 'yellow'
        | 'green'
        | 'blue'
        | 'purple'
        | 'pink'
        | 'brown'
        | 'black'
        | 'white'
        | 'rainbow',
    ) => string;
    insufficientReview: string;
    insufficientPool: string;
    insufficientReviewHint: string;
    insufficientPoolHint: string;
    goAdventureCta: string;
    locked: string;
    lockedReviewHint: string;
    lockedCategoryHint: string;
    noStamina: string;
    noStaminaHint: string;
    forcedReviewTitle: string;
    forcedReviewSubtitle: string;
    pendingReviewBanner: string;
    pendingReviewCta: string;
    reviewPause: string;
    reviewResume: string;
    reviewPausedTitle: string;
    reviewPausedHint: string;
    reviewContinueTitle: string;
    reviewContinueSubtitle: string;
    reviewContinueReview: string;
    reviewContinueAdventure: string;
    reviewContinueNoStamina: string;
    reviewContinueRest: string;
  };
  hud: {
    /** Current adventure set index (cleared + 1). */
    wordSet: string;
    /** Display current set number. */
    wordSetCount: (current: number) => string;
    /** @deprecated Prefer wordSetCount */
    wordSetOf: (current: number, total: number) => string;
    score: string;
    moves: string;
    stamina: string;
    /** e.g. 2/3 */
    staminaCount: (current: number, max: number) => string;
    matchesCleared: (n: number) => string;
    modePickerAria: string;
    tileAria: string;
  };
  adventure: {
    reviveTitle: string;
    reviveSubtitle: string;
    reviveStrike: (wrong: number, limit: number) => string;
    reviveProgress: (correct: number, needed: number) => string;
    reviveSuccessTitle: string;
    reviveSuccessSubtitle: string;
    reviveFailTitle: string;
    reviveFailSubtitle: string;
    reviveRetryTitle: string;
    reviveRetrySubtitle: string;
    reviveExit: string;
    reviveExitAria: string;
    outOfMovesTitle: string;
    outOfMovesSubtitle: string;
    retrySameSet: string;
    waitStamina: string;
    deadTitle: string;
    deadSubtitle: string;
    deadWait: string;
    deadGoReview: string;
  };
  consent: {
    dialogAria: string;
    title: string;
    intro: string;
    agreeBefore: string;
    termsLink: string;
    agreeAnd: string;
    privacyLink: string;
    agreeAfter: string;
    accept: string;
  };
  celebration: {
    /** Board cleared → quiz — random paired card on show. */
    roundCelebrateCards: CelebrationCard[];
    default: string;
    quizConnect: string;
    quizConnectNext: string;
    quizDone: string;
    quizDoneNext: string;
    /** Quiz passed after adventure — “new emojis” copy. */
    learnedCelebrateCards: (n: number) => CelebrationCard[];
    /** Quiz passed after review — reinforce copy, not “new”. */
    reviewCelebrateCards: (n: number) => CelebrationCard[];
    unlockReviewTitle: string;
    unlockReviewSubtitle: string;
    unlockCategoryTitle: string;
    unlockCategorySubtitle: string;
  };
  quiz: {
    dialogAria: string;
    phaseConnect: string;
    phasePick: string;
    phaseConnectSolo: string;
    phasePickSolo: string;
    connectHint: string;
    pickHint: string;
    colEnglish: string;
    colPicture: string;
    reviewTag: string;
    peekCn: string;
    peekCnAria: string;
    listenAgain: string;
    prevQuestion: string;
    nextQuestion: string;
    tryAgain: string;
    tryAgainCn: string;
    connectProgress: (done: number, total: number) => string;
    pickProgress: (done: number, total: number) => string;
    pickReview: (current: number, furthest: number) => string;
    exit: string;
    exitAria: string;
    abandonConfirmTitle: string;
    abandonConfirmBody: string;
    abandonConfirmStay: string;
    abandonConfirmLeave: string;
  };
  learned: {
    title: string;
    statsTitle: string;
    emojisCleared: string;
    emojiProgress: string;
    emojiProgressDetail: (cleared: number, total: number) => string;
    collectionTitle: string;
    wordDialogAria: string;
    playPronunciation: string;
    openWord: (word: string) => string;
    goReview: string;
  };
  review: {
    title: string;
    whatIsThis: string;
    summary: string;
    intro: string;
    tracked: (n: number) => string;
    curveTitle: string;
    curveHint: string;
    ebbinghausLabels: readonly string[];
    dueTitle: string;
    dueSubtitle: string;
    dueList: string;
    dueEmpty: string;
    stage: (n: number) => string;
    upcoming: string;
    countdown: CountdownCopy;
  };
  words: {
    title: string;
    stats: (categories: number, total: number) => string;
    searchPlaceholder: string;
    noResults: string;
    categoryCount: (subtitle: string, n: number) => string;
  };
};
