import type { Transition, Variants } from 'motion/react';
import {
  IOS_EASE,
  MOTION_SPRING_BOUNCY,
  MOTION_SPRING_GENTLE,
  MOTION_SPRING_POP,
  MOTION_SPRING_SHEET,
  MOTION_SPRING_SNAPPY,
  MOTION_SPRING_UI,
  STAGGER_FAST,
  STAGGER_MED,
} from './motionPresets';

export const MOTION_VIGNETTE: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ...MOTION_SPRING_GENTLE, opacity: { duration: 0.28, ease: IOS_EASE } },
  },
  exit: {
    opacity: 0,
    scale: 1.03,
    transition: { duration: 0.22, ease: IOS_EASE },
  },
};

export const MOTION_SHEET_PANEL: Variants = {
  hidden: { y: '108%', scale: 0.94, opacity: 0.55 },
  visible: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      y: MOTION_SPRING_SHEET,
      scale: MOTION_SPRING_SHEET,
      opacity: { duration: 0.2, ease: IOS_EASE },
    },
  },
  exit: {
    y: '104%',
    scale: 0.97,
    opacity: 0.4,
    transition: { duration: 0.28, ease: IOS_EASE },
  },
};

export const MOTION_FULLSCREEN_RISE: Variants = {
  hidden: { y: '100%', scale: 0.96, opacity: 0.7 },
  visible: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      y: MOTION_SPRING_SHEET,
      scale: { ...MOTION_SPRING_POP, delay: 0.04 },
      opacity: { duration: 0.24, ease: IOS_EASE },
    },
  },
  exit: {
    y: '12%',
    scale: 0.98,
    opacity: 0,
    transition: { duration: 0.26, ease: IOS_EASE },
  },
};

export const MOTION_CARD_POP: Variants = {
  hidden: { opacity: 0, scale: 0.76, y: 36, rotate: -2.5 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    transition: MOTION_SPRING_POP,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    rotate: 1,
    transition: { duration: 0.22, ease: IOS_EASE },
  },
};

export const MOTION_MODAL_CARD: Variants = {
  hidden: { opacity: 0, scale: 0.68, y: 40 },
  visible: {
    opacity: 1,
    scale: [0.68, 1.08, 0.97, 1],
    y: [40, -8, 3, 0],
    transition: {
      duration: 0.52,
      times: [0, 0.52, 0.78, 1],
      ease: IOS_EASE,
      opacity: { duration: 0.18, ease: IOS_EASE },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.88,
    y: 24,
    transition: { duration: 0.24, ease: IOS_EASE },
  },
};

export const MOTION_STAGGER_CONTAINER: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_MED, delayChildren: 0.08 },
  },
};

export const MOTION_STAGGER_ITEM: Variants = {
  hidden: { opacity: 0, y: 22, scale: 0.86, rotate: -1.5 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: MOTION_SPRING_POP,
  },
};

export const MOTION_STAGGER_TIGHT_CONTAINER: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER_FAST, delayChildren: 0.05 },
  },
};

export const MOTION_STAGGER_TIGHT_ITEM: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: MOTION_SPRING_UI,
  },
};

export const MOTION_SLIDE_UP_CARD: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: MOTION_SPRING_POP,
  },
  exit: {
    opacity: 0,
    y: 18,
    scale: 0.96,
    transition: { duration: 0.2, ease: IOS_EASE },
  },
};

export const MOTION_SPOTLIGHT_RING: Variants = {
  hidden: { opacity: 0, scale: 0.88 },
  visible: {
    opacity: 1,
    scale: [0.88, 1.04, 1],
    transition: {
      duration: 0.42,
      times: [0, 0.65, 1],
      ease: IOS_EASE,
      opacity: { duration: 0.2, ease: IOS_EASE },
    },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.18, ease: IOS_EASE },
  },
};

export const MOTION_FUN_BANNER: Variants = {
  hidden: { opacity: 0, scale: 0.82, y: 16 },
  visible: {
    opacity: 1,
    scale: [0.82, 1.06, 0.98, 1],
    y: [16, -4, 2, 0],
    transition: {
      duration: 0.48,
      times: [0, 0.55, 0.8, 1],
      ease: IOS_EASE,
      opacity: { duration: 0.16, ease: IOS_EASE },
    },
  },
};

export const MOTION_SCORE_FLOAT: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.7, rotate: -6 },
  visible: {
    opacity: [0, 1, 1, 0],
    y: [16, -6, -22, -38],
    scale: [0.7, 1.14, 1, 0.88],
    rotate: [-6, 4, 0, 2],
    transition: { duration: 0.72, ease: IOS_EASE },
  },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

export const MOTION_CELEBRATION_CARD: Variants = {
  hidden: { opacity: 0, scale: 0.45, y: 32, rotate: -4 },
  visible: {
    opacity: 1,
    scale: [0.45, 1.12, 0.96, 1],
    y: [32, -10, 4, 0],
    rotate: [-4, 2, -1, 0],
    transition: {
      duration: 0.58,
      times: [0, 0.5, 0.78, 1],
      ease: IOS_EASE,
      opacity: { duration: 0.2, ease: IOS_EASE },
    },
  },
};

export const MOTION_WORD_POP: Variants = {
  hidden: (from: { x: number; y: number; scale: number }) => ({
    x: from.x,
    y: from.y,
    scale: from.scale * 0.75,
    opacity: 0.4,
  }),
  visible: {
    x: 0,
    y: 0,
    scale: [0.75, 1.14, 0.97, 1],
    opacity: 1,
    transition: {
      duration: 0.5,
      times: [0, 0.48, 0.76, 1],
      ease: IOS_EASE,
      opacity: { duration: 0.15, ease: IOS_EASE },
    },
  },
  exit: (from: { x: number; y: number; scale: number }) => ({
    x: from.x,
    y: from.y,
    scale: from.scale * 0.82,
    opacity: 0,
    transition: { duration: 0.28, ease: IOS_EASE },
  }),
};

export function particleBurstTransition(delay: number, duration = 1.15): Transition {
  return {
    duration,
    delay,
    ease: IOS_EASE,
  };
}

export const MOTION_TAB_SPRING = MOTION_SPRING_BOUNCY;
export const MOTION_TILE_SPRING = MOTION_SPRING_SNAPPY;
