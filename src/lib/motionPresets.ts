/** iOS-style ease-out curve — matches UIKit default timing. */
export const IOS_EASE = [0.22, 1, 0.36, 1] as const;

export const IOS_EASE_CSS = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const MOTION_TWEEN_FAST = { duration: 0.22, ease: IOS_EASE } as const;

export const MOTION_TWEEN_MED = { duration: 0.32, ease: IOS_EASE } as const;

export const MOTION_TWEEN_SLOW = { duration: 0.45, ease: IOS_EASE } as const;

/** Quick UI feedback — light overshoot. */
export const MOTION_SPRING_UI = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 28,
  mass: 0.78,
};

/** Bottom sheets — noticeable settle bounce. */
export const MOTION_SPRING_SHEET = {
  type: 'spring' as const,
  stiffness: 340,
  damping: 28,
  mass: 0.92,
};

/** Hero pops, score punches, celebration cards. */
export const MOTION_SPRING_POP = {
  type: 'spring' as const,
  stiffness: 480,
  damping: 22,
  mass: 0.72,
};

/** Playful bounce for tabs, emojis, chips. */
export const MOTION_SPRING_BOUNCY = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 18,
  mass: 0.85,
};

/** Tight press feedback — almost no overshoot. */
export const MOTION_SPRING_SNAPPY = {
  type: 'spring' as const,
  stiffness: 520,
  damping: 34,
  mass: 0.65,
};

/** Soft landings for backdrops and large panels. */
export const MOTION_SPRING_GENTLE = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 30,
  mass: 1,
};

export const STAGGER_TIGHT = 0.035;
export const STAGGER_FAST = 0.05;
export const STAGGER_MED = 0.07;
export const STAGGER_SLOW = 0.09;

export const MOTION_PRESS_TAP = {
  scale: 0.94,
  y: 2,
} as const;

export const MOTION_PRESS_DEEP = {
  scale: 0.9,
  y: 3,
} as const;
