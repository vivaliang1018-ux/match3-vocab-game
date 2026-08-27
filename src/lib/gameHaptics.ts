import { Capacitor } from '@capacitor/core';
import {
  Haptics,
  ImpactStyle,
  NotificationType,
} from '@capacitor/haptics';

export const HAPTICS_ENABLED_KEY = 'smellycat-match3-haptics-enabled';

export type GameHapticEvent =
  | 'tileSelection'
  | 'tabSelection'
  | 'specialClear'
  | 'sayBlastExplosion'
  | 'cascadeWave'
  | 'deadMachine'
  | 'majorSuccess'
  | 'achievementOpen'
  | 'newBadgeOpen'
  | 'badgeMysteryOpen'
  | 'badgeClaimStart'
  | 'quizWordSelection'
  | 'quizCorrect'
  | 'quizWrong';

let celebrationSequenceId = 0;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function loadHapticsEnabled(): boolean {
  try {
    const raw = localStorage.getItem(HAPTICS_ENABLED_KEY);
    return raw === null ? true : raw === '1';
  } catch {
    return true;
  }
}

export function saveHapticsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(HAPTICS_ENABLED_KEY, enabled ? '1' : '0');
  } catch {
    // Ignore unavailable or full storage.
  }
}

function canUseHaptics(): boolean {
  return (
    loadHapticsEnabled() &&
    Capacitor.isNativePlatform() &&
    Capacitor.isPluginAvailable('Haptics')
  );
}

/**
 * The only entry point for game haptics. Unsupported platforms, disabled
 * settings, and native plugin failures are intentionally silent.
 */
export function triggerGameHaptic(event: GameHapticEvent): void {
  if (!canUseHaptics()) return;

  void (async () => {
    try {
      switch (event) {
        case 'tileSelection':
        case 'tabSelection':
        case 'quizWordSelection':
          await Haptics.selectionStart();
          await Haptics.selectionChanged();
          await Haptics.selectionEnd();
          break;
        case 'quizCorrect':
        case 'deadMachine':
        case 'badgeMysteryOpen':
          await Haptics.impact({ style: ImpactStyle.Light });
          break;
        case 'specialClear':
          await Haptics.impact({ style: ImpactStyle.Heavy });
          break;
        case 'sayBlastExplosion':
          await Haptics.vibrate({ duration: 180 });
          break;
        case 'quizWrong':
        case 'badgeClaimStart':
          await Haptics.impact({ style: ImpactStyle.Medium });
          break;
        case 'achievementOpen':
        case 'newBadgeOpen': {
          const sequenceId = ++celebrationSequenceId;
          await Haptics.impact({ style: ImpactStyle.Heavy });
          await wait(120);
          if (sequenceId !== celebrationSequenceId || !canUseHaptics()) break;
          await Haptics.impact({ style: ImpactStyle.Heavy });
          await wait(160);
          if (sequenceId !== celebrationSequenceId || !canUseHaptics()) break;
          await Haptics.impact({ style: ImpactStyle.Heavy });
          break;
        }
        case 'cascadeWave':
          await Haptics.impact({ style: ImpactStyle.Light });
          break;
        case 'majorSuccess':
          await Haptics.notification({ type: NotificationType.Success });
          break;
      }
    } catch {
      // Haptics are optional; never interrupt gameplay.
    }
  })();
}
