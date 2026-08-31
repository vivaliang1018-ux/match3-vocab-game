import {
  EMOJI_LEARNING_BROWSE_SECTIONS,
  EMOJI_LEARNING_CATEGORIES,
  EMOJI_LEARNING_CATEGORY_IDS,
  EMOJI_LEARNING_ITEMS,
  EMOJI_LEARNING_ITEMS_BY_CATEGORY,
} from '../src/lib/emojiLearningCategories';
import { EMOJI_NOUN_CATEGORIES } from '../src/data/emojiNouns';
import {
  completeCategoryCycleBoard,
  pickCategoryCycleItems,
  type CategoryCycleProgress,
} from '../src/lib/categoryCycleProgress';

const sourceTotal = EMOJI_NOUN_CATEGORIES.reduce(
  (total, category) => total + category.items.length,
  0,
);
const errors: string[] = [];

const testPool = Array.from({ length: 8 }, (_, index) => ({ id: `item-${index + 1}` }));
const emptyCycleProgress: CategoryCycleProgress = { version: 1, categories: {} };
const firstBoard = pickCategoryCycleItems(
  testPool,
  6,
  { cycle: 1, clearedItemIds: [] },
);
if (firstBoard.length !== 6 || new Set(firstBoard.map((item) => item.id)).size !== 6) {
  errors.push('Category cycle picker did not return six unique first-board items');
}
if (emptyCycleProgress.categories.test) {
  errors.push('Drawing a category board mutated progress before completion');
}
const firstCompletion = completeCategoryCycleBoard(
  emptyCycleProgress,
  'test',
  testPool.map((item) => item.id),
  firstBoard.map((item) => item.id),
);
if (
  firstCompletion.completion.completedCycle ||
  firstCompletion.completion.clearedInCycle !== 6
) {
  errors.push('First category board did not commit six cleared items');
}
const secondBoard = pickCategoryCycleItems(
  testPool,
  6,
  firstCompletion.progress.categories.test,
);
const unclearedAfterFirst = testPool
  .map((item) => item.id)
  .filter((id) => !firstCompletion.progress.categories.test.clearedItemIds.includes(id));
if (!unclearedAfterFirst.every((id) => secondBoard.some((item) => item.id === id))) {
  errors.push('Cycle-tail board did not include every remaining current-cycle item');
}
const secondCompletion = completeCategoryCycleBoard(
  firstCompletion.progress,
  'test',
  testPool.map((item) => item.id),
  secondBoard.map((item) => item.id),
);
if (
  !secondCompletion.completion.completedCycle ||
  secondCompletion.completion.cycle !== 2 ||
  secondCompletion.completion.clearedInCycle !== 4
) {
  errors.push('Cycle-tail completion did not roll into the next cycle correctly');
}

if (EMOJI_LEARNING_ITEMS.length !== sourceTotal) {
  errors.push(
    `Coverage mismatch: mapped ${EMOJI_LEARNING_ITEMS.length}, source has ${sourceTotal}`,
  );
}

const itemKeys = new Set<string>();
for (const entry of EMOJI_LEARNING_ITEMS) {
  if (itemKeys.has(entry.key)) errors.push(`Duplicate mapped item: ${entry.key}`);
  itemKeys.add(entry.key);
}

const browsedCategoryIds = EMOJI_LEARNING_BROWSE_SECTIONS.flatMap(
  (section) => section.categoryIds,
);
for (const categoryId of EMOJI_LEARNING_CATEGORY_IDS) {
  const occurrences = browsedCategoryIds.filter((candidate) => candidate === categoryId).length;
  if (occurrences !== 1) {
    errors.push(`Browse section coverage for ${categoryId}: expected 1, received ${occurrences}`);
  }
}

console.log('| Browse area | Learning category | Emoji count |');
console.log('|---|---|---:|');
for (const section of EMOJI_LEARNING_BROWSE_SECTIONS) {
  section.categoryIds.forEach((categoryId, index) => {
    const category = EMOJI_LEARNING_CATEGORIES.find((entry) => entry.id === categoryId);
    const count = EMOJI_LEARNING_ITEMS_BY_CATEGORY.get(categoryId)?.length ?? 0;
    if (!category) errors.push(`Missing category definition: ${categoryId}`);
    if (count === 0) errors.push(`Empty learning category: ${categoryId}`);
    console.log(
      `| ${index === 0 ? section.titleCn : ''} | ${category?.titleCn ?? categoryId} | ${count} |`,
    );
  });
}
console.log(`| **Total** | **${EMOJI_LEARNING_CATEGORY_IDS.length} categories** | **${EMOJI_LEARNING_ITEMS.length}** |`);

if (errors.length > 0) {
  console.error('\nAudit failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(
    `\nAudit passed: ${sourceTotal} Emoji mapped exactly once; all 17 categories appear in exactly one browse area.`,
  );
}
