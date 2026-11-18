export type SayBlastRating = {
  stars: 1 | 2 | 3;
  accuracyGrade: number;
};

export function calculateSayBlastRating({
  accuracy,
}: {
  accuracy: number;
}): SayBlastRating {
  const accuracyGrade = accuracy >= 0.7 ? 3 : accuracy >= 0.5 ? 2 : 1;
  return {
    stars: accuracyGrade as 1 | 2 | 3,
    accuracyGrade,
  };
}
