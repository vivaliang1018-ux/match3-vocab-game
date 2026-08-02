import { assetUrl } from './assetUrl';

/**
 * Prefer a public https URL for in-app Terms of Service links.
 * Set VITE_TERMS_OF_SERVICE_URL after GitHub Pages (or your domain) is live.
 * Falls back to the bundled terms.html for local / simulator use.
 */
export function termsOfServiceUrl(): string {
  const fromEnv = (import.meta.env.VITE_TERMS_OF_SERVICE_URL as string | undefined)?.trim();
  if (fromEnv) return fromEnv;
  return assetUrl('terms.html');
}
