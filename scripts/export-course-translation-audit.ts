import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { COURSES, LANGUAGES } from '../src/courseConfig';
import { EMOJI_NOUN_CATEGORIES } from '../src/data/emojiNouns';
import { getEmojiLearningTranslation } from '../src/data/emojiLocalizedNames';
import { COURSE_GLOSS_OVERRIDES } from '../src/data/courseGlossOverrides';
import { SEMANTIC_GLOSS_OVERRIDES } from '../src/data/courseSemanticGlosses';
import { learningWordForCourse, sourceWordForCourse } from '../src/lib/courseWord';

const oldEntries = COURSE_GLOSS_OVERRIDES.filter(row => !SEMANTIC_GLOSS_OVERRIDES.includes(row));
assert.equal(oldEntries.length, 174, 'Historical comparison baseline changed');
const items = EMOJI_NOUN_CATEGORIES.flatMap(category => category.items.map(item => ({...item, category:category.id})));
const changes: object[] = [];
const bySource: Record<string, number> = {};
const byTarget: Record<string, number> = {};
let checked = 0;
const inventory = items.map(item => {
  const names = Object.fromEntries(LANGUAGES.map(language => [language.id,
    language.id === 'en' ? item.word : language.id === 'zh-CN' ? item.cn : getEmojiLearningTranslation(item, language.id)]));
  assert(Object.values(names).every(name => typeof name === 'string' && name.trim()), `Missing name: ${item.id}`);
  const courses = Object.fromEntries(COURSES.map(course => {
    const target = learningWordForCourse(item, course.id);
    assert.equal(target, names[course.targetLanguage], `Target text changed: ${course.id} ${item.id}`);
    const fallback = course.sourceLanguage === 'en' ? item.word : course.sourceLanguage === 'zh-CN' ? item.cn : names[course.sourceLanguage];
    const prior = oldEntries.find(row => row.target === course.targetLanguage && row.emoji === item.emoji && row.learningName === target);
    const before = prior && (course.sourceLanguage === 'en' || course.sourceLanguage === 'zh-CN') ? prior[course.sourceLanguage] : fallback;
    const after = sourceWordForCourse(item, course.id);
    assert(typeof after === 'string' && after.trim(), `Empty gloss: ${course.id} ${item.id}`);
    checked++;
    if (after !== before) {
      changes.push({id:item.id,emoji:item.emoji,course:course.id,target,before,after});
      bySource[course.sourceLanguage] = (bySource[course.sourceLanguage] ?? 0) + 1;
      byTarget[course.targetLanguage] = (byTarget[course.targetLanguage] ?? 0) + 1;
    }
    return [course.id, {target, gloss:after}];
  }));
  return {...item, names, courses};
});
const summary = {items:items.length,sourceLanguages:LANGUAGES.length,targetLanguages:4,courses:COURSES.length,
  courseItemChecks:checked,changedSincePreviousPass:changes.length,bySource,byTarget,
  scope:'First-pass semantic review plus structural regression; not native-speaker certification or audio listening certification.'};
if (process.argv.includes('--write-report')) {
  const dir = join(process.cwd(), 'docs/course-translation-audit-2026-10-17');
  mkdirSync(dir, {recursive:true});
  writeFileSync(join(dir, 'inventory.json'), JSON.stringify(inventory, null, 2)+'\n');
  writeFileSync(join(dir, 'changes.json'), JSON.stringify(changes, null, 2)+'\n');
  writeFileSync(join(dir, 'summary.json'), JSON.stringify(summary, null, 2)+'\n');
}
console.log(JSON.stringify(summary, null, 2));
