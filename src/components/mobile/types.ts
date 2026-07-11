export type AppTab = 'game' | 'learned' | 'words' | 'profile';

export type OnboardingTarget =
  | 'grid'
  | 'modesButtons'
  | 'profile'
  | 'learned'
  | 'emojiIndex';

export function tabForOnboardingTarget(target: OnboardingTarget): AppTab {
  switch (target) {
    case 'grid':
    case 'modesButtons':
      return 'game';
    case 'profile':
      return 'profile';
    case 'learned':
      return 'learned';
    case 'emojiIndex':
      return 'words';
  }
}
