import { App } from '@capacitor/app';

/** Return the App Store version/build on native platforms, with a web fallback. */
export async function readAppVersionLabel(fallback: string): Promise<string> {
  try {
    const info = await App.getInfo();
    return `${info.version} (${info.build})`;
  } catch {
    return fallback;
  }
}
