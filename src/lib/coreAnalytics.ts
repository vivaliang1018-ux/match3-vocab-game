import { Capacitor, registerPlugin } from '@capacitor/core';
import type { CoreEventName, CoreEventParams } from './coreAnalyticsEvents';

const NativeAnalytics = registerPlugin<{
  logEvent(options: { name: CoreEventName; params: Record<string, string | number> }): Promise<void>;
}>('LingoMatchAnalytics');

/** Native iOS stream only. Analytics failures must never interrupt gameplay. */
export function trackCoreEvent<N extends CoreEventName>(name: N, params: CoreEventParams[N]): void {
  if (Capacitor.getPlatform() !== 'ios' || !Capacitor.isNativePlatform()) return;
  void NativeAnalytics.logEvent({ name, params }).catch((error: unknown) => {
    console.warn(`[Analytics] ${name} was not logged`, error);
  });
}
