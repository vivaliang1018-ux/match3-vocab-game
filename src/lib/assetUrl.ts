/** Resolve public-folder assets for web and Capacitor (relative base). */
export function assetUrl(path: string): string {
  const normalized = path.replace(/^\//, '');
  const base = import.meta.env.BASE_URL;
  return `${base}${normalized}`;
}
