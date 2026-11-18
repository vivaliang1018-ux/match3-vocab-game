import { EMOJI_NOUN_CATEGORIES } from '../src/data/emojiNouns.ts';
import { getEmojiLearningTranslation } from '../src/data/emojiLocalizedNames.ts';

type Locale = 'es' | 'fr' | 'de' | 'ja' | 'ko';

const locales: Locale[] = ['es', 'fr', 'de', 'ja', 'ko'];
const items = EMOJI_NOUN_CATEGORIES.flatMap((category) => category.items);

console.log(`Emoji items: ${items.length}`);

for (const locale of locales) {
  const learningName = (item: (typeof items)[number]) =>
    getEmojiLearningTranslation(item, locale)?.trim() ?? '';
  const missing = items.filter((item) => !learningName(item));
  const names = items
    .map((item) => learningName(item).toLocaleLowerCase(locale))
    .filter((name): name is string => Boolean(name));
  const counts = new Map<string, number>();
  for (const name of names) counts.set(name, (counts.get(name) ?? 0) + 1);
  const duplicates = [...counts.entries()]
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1]);
  const longNames = items.filter((item) => {
    const name = learningName(item);
    return name.split(/\s+/).length >= 9;
  });

  console.log(`\n${locale}: ${names.length} translated, ${missing.length} missing, ${duplicates.length} duplicate names, ${longNames.length} long names`);
  if (missing.length) console.log('  missing:', missing.slice(0, 12).map((item) => `${item.emoji} ${item.id}`).join(' · '));
  if (duplicates.length) console.log('  duplicates:', duplicates.slice(0, 12).map(([name, count]) => `${name} (${count})`).join(' · '));
  if (longNames.length) console.log('  long examples:', longNames.slice(0, 5).map((item) => `${item.emoji} ${learningName(item)}`).join(' · '));
}
