export type EmojiVoiceRegenItem = {
  id: string;
  emoji: string;
  word: string;
  cn: string;
  reason: string;
  bindAs: string;
};

/** Words to regenerate and bind to the exact `word` filename. */
export const EMOJI_VOICE_REGENERATE_QUEUE: EmojiVoiceRegenItem[] = [];
