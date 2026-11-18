export type ChallengeMode = 'random' | 'mood' | 'category' | 'review';

export type QuizKind = 'connect' | 'pick';

export type WordItem = {
  id: string;
  word: string;
  /** Optional source-language gloss for a target-language course. */
  sourceWord?: string;
  cn?: string;
  emoji?: string;
  imgSrc?: string;
};

export type Cell = { r: number; c: number };

export type Tile = {
  id: string;
  itemId: string;
};
