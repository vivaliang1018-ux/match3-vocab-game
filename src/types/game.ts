export type ChallengeMode = 'random' | 'category' | 'review' | 'fun';

export type WordItem = {
  id: string;
  word: string;
  cn?: string;
  emoji?: string;
  imgSrc?: string;
};

export type Tile = {
  id: string;
  itemId: string;
};

export type Cell = { r: number; c: number };
