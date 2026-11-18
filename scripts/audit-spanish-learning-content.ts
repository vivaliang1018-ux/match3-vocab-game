import { EMOJI_LOCALIZED_NAMES } from '../src/data/emojiLocalizedNames.ts';
import { SPANISH_LEARNING_CONTENT_OVERRIDES } from '../src/data/spanishLearningContent.ts';

const normalize = (value: string) => value.normalize('NFC').trim().toLocaleLowerCase('es');
const effectiveNames = new Map<string, string>();

for (const [emoji, names] of Object.entries(EMOJI_LOCALIZED_NAMES)) {
  const override = SPANISH_LEARNING_CONTENT_OVERRIDES[emoji];
  if (override && normalize(override.canonicalName) !== normalize(names.es)) {
    throw new Error(
      `Stale Spanish override for ${emoji}: expected canonical name “${override.canonicalName}”, found “${names.es}”`,
    );
  }
  effectiveNames.set(emoji, override?.learningName ?? names.es);
}

const reverse = new Map<string, string[]>();
for (const [emoji, name] of effectiveNames) {
  const key = normalize(name);
  reverse.set(key, [...(reverse.get(key) ?? []), emoji]);
}

const duplicates = [...reverse.entries()].filter(([, emoji]) => emoji.length > 1);
const pending = Object.entries(SPANISH_LEARNING_CONTENT_OVERRIDES).filter(
  ([, override]) => override.audioStatus === 'pending',
);

console.log(`Spanish vocabulary: ${effectiveNames.size}`);
console.log(`Learner-facing overrides: ${Object.keys(SPANISH_LEARNING_CONTENT_OVERRIDES).length}`);
console.log(`Pending exact recordings: ${pending.length}`);
console.log(`Duplicate learner-facing names: ${duplicates.length}`);

if (duplicates.length) {
  for (const [name, emoji] of duplicates) console.error(`  ${name}: ${emoji.join(' ')}`);
  process.exitCode = 1;
}
