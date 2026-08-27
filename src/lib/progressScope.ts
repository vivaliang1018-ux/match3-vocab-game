export const GUEST_PROGRESS_SCOPE = 'guest';

export function progressScopeForUserId(userUid: string | null | undefined): string {
  return userUid && userUid.length > 0 ? userUid : GUEST_PROGRESS_SCOPE;
}

function scopedStorageKey(baseKey: string, userUid: string | null | undefined): string {
  return `${baseKey}:${progressScopeForUserId(userUid)}`;
}

/**
 * Read account-scoped progress. Existing unscoped installs are first adopted by
 * the guest bucket so the next signed-in account can claim that progress once.
 */
export function readScopedProgress(
  baseKey: string,
  userUid: string | null | undefined,
): string | null {
  try {
    const key = scopedStorageKey(baseKey, userUid);
    const scoped = localStorage.getItem(key);
    if (scoped !== null) return scoped;

    if (progressScopeForUserId(userUid) !== GUEST_PROGRESS_SCOPE) return null;
    const legacy = localStorage.getItem(baseKey);
    if (legacy === null) return null;
    localStorage.setItem(key, legacy);
    localStorage.removeItem(baseKey);
    return legacy;
  } catch {
    return null;
  }
}

export function writeScopedProgress(
  baseKey: string,
  value: string,
  userUid: string | null | undefined,
): void {
  try {
    localStorage.setItem(scopedStorageKey(baseKey, userUid), value);
  } catch {
    // ignore quota
  }
}

export function clearScopedProgress(
  baseKey: string,
  userUid: string | null | undefined,
): void {
  try {
    localStorage.removeItem(scopedStorageKey(baseKey, userUid));
  } catch {
    // ignore
  }
}

/**
 * Move the current guest bucket into a signed-in account exactly once.
 * Existing account data wins; either way the guest bucket is drained so it
 * cannot leak into another account on a later login.
 */
export function claimGuestProgress(
  baseKey: string,
  userUid: string | null | undefined,
  merge?: (accountRaw: string, guestRaw: string) => string,
): void {
  if (!userUid) return;
  try {
    const guestRaw = readScopedProgress(baseKey, null);
    if (guestRaw === null) return;
    const userKey = scopedStorageKey(baseKey, userUid);
    const accountRaw = localStorage.getItem(userKey);
    localStorage.setItem(
      userKey,
      accountRaw === null ? guestRaw : merge ? merge(accountRaw, guestRaw) : accountRaw,
    );
    localStorage.removeItem(scopedStorageKey(baseKey, null));
  } catch {
    // keep the source bucket if storage is unavailable
  }
}
