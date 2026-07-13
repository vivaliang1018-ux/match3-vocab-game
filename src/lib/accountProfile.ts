const STORAGE_PREFIX = 'match3.avatarPreset.';

export type AvatarPreset = {
  id: string;
  emoji: string;
  from: string;
  to: string;
};

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: 'star', emoji: '⭐', from: '#7dd3fc', to: '#f472b6' },
  { id: 'cat', emoji: '🐱', from: '#fde68a', to: '#fb7185' },
  { id: 'fox', emoji: '🦊', from: '#fdba74', to: '#f472b6' },
  { id: 'panda', emoji: '🐼', from: '#e2e8f0', to: '#94a3b8' },
  { id: 'unicorn', emoji: '🦄', from: '#c4b5fd', to: '#f9a8d4' },
  { id: 'rocket', emoji: '🚀', from: '#93c5fd', to: '#38bdf8' },
  { id: 'cake', emoji: '🎂', from: '#fbcfe8', to: '#f472b6' },
  { id: 'game', emoji: '🎮', from: '#86efac', to: '#38bdf8' },
];

export function getAvatarPresetId(uid: string): string {
  try {
    const stored = localStorage.getItem(STORAGE_PREFIX + uid);
    if (stored && AVATAR_PRESETS.some((p) => p.id === stored)) return stored;
  } catch {
    // ignore
  }
  return AVATAR_PRESETS[0].id;
}

export function setAvatarPresetId(uid: string, presetId: string): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + uid, presetId);
  } catch {
    // ignore
  }
}

export function getAvatarPreset(uid: string): AvatarPreset {
  const id = getAvatarPresetId(uid);
  return AVATAR_PRESETS.find((p) => p.id === id) ?? AVATAR_PRESETS[0];
}

export function clearAvatarPreset(uid: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + uid);
  } catch {
    // ignore
  }
}

export function providerLabel(providerId: string): 'apple' | 'google' | 'password' | 'other' {
  if (providerId === 'apple.com') return 'apple';
  if (providerId === 'google.com') return 'google';
  if (providerId === 'password') return 'password';
  return 'other';
}
