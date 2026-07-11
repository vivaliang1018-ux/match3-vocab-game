import { assetUrl } from './assetUrl';

/**
 * Prefer a public https URL for App Store Connect / in-app links.
 * Set VITE_PRIVACY_POLICY_URL after GitHub Pages (or your domain) is live.
 * Falls back to the bundled privacy.html for local / simulator use.
 */
export function privacyPolicyUrl(): string {
  const fromEnv = (import.meta.env.VITE_PRIVACY_POLICY_URL as string | undefined)?.trim();
  if (fromEnv) return fromEnv;
  return assetUrl('privacy.html');
}
