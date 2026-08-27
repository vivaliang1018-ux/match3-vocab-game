import { Capacitor } from '@capacitor/core';
import type { AppTab } from '../components/mobile/types';

export async function initCapacitor(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const { StatusBar, Style } = await import('@capacitor/status-bar');

  try {
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({ style: Style.Light });
    // Keep native splash until LoadingSplash paints (see hideNativeSplash).
  } catch {
    // Plugins may be unavailable during web preview.
  }
}

/** Hide the Capacitor/native splash once the in-app loading screen is on screen. */
export async function hideNativeSplash(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { SplashScreen } = await import('@capacitor/splash-screen');
    await SplashScreen.hide({ fadeOutDuration: 0 });
  } catch {
    // Ignore when the plugin is unavailable.
  }
}

export async function syncStatusBarForTab(_tab: AppTab): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  const { StatusBar, Style } = await import('@capacitor/status-bar');

  try {
    await StatusBar.setOverlaysWebView({ overlay: true });
    await StatusBar.setStyle({ style: Style.Light });
  } catch {
    // Ignore when the plugin is unavailable.
  }
}
