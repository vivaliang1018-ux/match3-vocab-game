/** Pick one item at random from a non-empty list. */
export function pickRandom<T>(items: readonly T[]): T {
  if (items.length === 0) {
    throw new Error('pickRandom: empty list');
  }
  return items[Math.floor(Math.random() * items.length)]!;
}
