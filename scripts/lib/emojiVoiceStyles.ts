export type EmojiVoiceStyleId = 'game-enthusiastic' | 'angry-scolding';

/** Approved default for batch regen after user sign-off on first 3 samples. */
export const APPROVED_EMOJI_VOICE_STYLE: EmojiVoiceStyleId = 'game-enthusiastic';

export type EmojiVoiceStyle = {
  id: EmojiVoiceStyleId;
  label: string;
  description: string;
  voice: 'Kore' | 'Puck' | 'Charon' | 'Fenrir' | 'Zephyr';
  buildPrompt: (word: string, context?: { emoji?: string; cn?: string }) => string;
};

export const EMOJI_VOICE_STYLES: Record<EmojiVoiceStyleId, EmojiVoiceStyle> = {
  'game-enthusiastic': {
    id: 'game-enthusiastic',
    label: '游戏热情',
    description: '热情、有激情，像游戏主持 — 用户已确认前 3 条 OK',
    voice: 'Kore',
    buildPrompt(word, context) {
      const meaningLine = context?.cn ? `Meaning hint (do NOT speak this): ${context.cn}` : '';
      const emojiLine = context?.emoji ? `Emoji context (do NOT speak this): ${context.emoji}` : '';
      return [
        'You are recording American English vocabulary audio for a fun mobile learning game.',
        'Speak ONLY the English term below.',
        'Priority #1: CLARITY — crisp consonants, clean vowels, every syllable easy to hear.',
        'Priority #2: ENERGY — warm, upbeat, and lightly expressive like a friendly game host.',
        'Pace: moderate and steady. Do NOT rush, slur, whisper, or shout.',
        'Avoid muddy, breathy, overly dramatic, robotic, or monotone delivery.',
        'Do not add extra words, explanations, greetings, or punctuation sounds.',
        emojiLine,
        meaningLine,
        `Term to speak: "${word}"`,
        'Final instruction: one clean take, feminine American English voice, clear first then energetic.',
      ]
        .filter(Boolean)
        .join('\n');
    },
  },
  'angry-scolding': {
    id: 'angry-scolding',
    label: '生气怒骂感',
    description: '生气、愤怒、带训斥/骂人的语气（仍只读英文词本身）',
    voice: 'Kore',
    buildPrompt(word, context) {
      const meaningLine = context?.cn ? `Meaning hint (do NOT speak this): ${context.cn}` : '';
      const emojiLine = context?.emoji ? `Emoji context (do NOT speak this): ${context.emoji}` : '';
      return [
        'You are recording American English vocabulary audio for a dramatic mobile game.',
        'Speak ONLY the English term below.',
        'Delivery style: angry, furious, scolding, and sharp — like you are mad and snapping the word at someone.',
        'Bring intense annoyed energy, like a fed-up character chewing someone out, but still say ONLY the term.',
        'No profanity, no insults, no extra words — only the vocabulary term with angry/scolding tone.',
        'Avoid calm, cheerful, or flat delivery.',
        emojiLine,
        meaningLine,
        `Term to speak: "${word}"`,
        'Final instruction: one clean take, feminine American English voice, angry scolding game style.',
      ]
        .filter(Boolean)
        .join('\n');
    },
  },
};

export function resolveEmojiVoiceStyle(styleId?: string): EmojiVoiceStyle {
  if (styleId && styleId in EMOJI_VOICE_STYLES) {
    return EMOJI_VOICE_STYLES[styleId as EmojiVoiceStyleId];
  }
  return EMOJI_VOICE_STYLES[APPROVED_EMOJI_VOICE_STYLE];
}
