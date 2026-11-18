import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { COURSES } from '../src/courseConfig';
import { EMOJI_NOUN_CATEGORIES } from '../src/data/emojiNouns';
import { RELEASE_GLOSS_RULES } from '../src/data/courseReleaseGlosses';
import { learningWordForCourse, sourceWordForCourse } from '../src/lib/courseWord';

const directory = 'docs/teaching-quality-audit-2026-10-18';
const baselinePath = join(directory, 'release-a-only-before.json');
const items = EMOJI_NOUN_CATEGORIES.flatMap(category => category.items);
const matrix = () => items.map(item => ({ ...item, courses: Object.fromEntries(COURSES.map(course =>
  [course.id, { target: learningWordForCourse(item, course.id), gloss: sourceWordForCourse(item, course.id) }],
)) }));
function fingerprints(directory: string): Record<string, string> {
  const hashes: Record<string, string> = {};
  function walk(path: string) {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      const child = join(path, entry.name);
      if (entry.isDirectory()) walk(child);
      else hashes[child] = createHash('sha256').update(readFileSync(child)).digest('hex');
    }
  }
  walk(directory);
  return hashes;
}
if (process.argv.includes('--capture-before')) {
  assert(!existsSync(baselinePath), 'Refusing to overwrite the pre-change baseline');
  writeFileSync(baselinePath, JSON.stringify({ courses: COURSES, matrix: matrix(),
    sourceHashes: fingerprints('src'), publicHashes: fingerprints('public') }, null, 2) + '\n');
  console.log(`Captured ${items.length} items × ${COURSES.length} courses before integration`);
} else {
  const baseline = JSON.parse(readFileSync(baselinePath, 'utf8')) as {
    courses: typeof COURSES; matrix: ReturnType<typeof matrix>;
    sourceHashes: Record<string, string>; publicHashes: Record<string, string>;
  };
  assert.equal(items.length, 1117);
  assert.equal(COURSES.length, 24);
  assert.deepEqual(COURSES, baseline.courses, 'Course definitions changed');
  assert.deepEqual(fingerprints('public'), baseline.publicHashes, 'Public assets/audio changed');
  const currentSource = fingerprints('src');
  assert.deepEqual(Object.keys(currentSource).sort(), Object.keys(baseline.sourceHashes).sort());
  for (const [path, hash] of Object.entries(baseline.sourceHashes)) {
    if (path !== 'src/data/courseGlossOverrides.ts') assert.equal(currentSource[path], hash, `Unapproved source edit: ${path}`);
  }
  const approved = new Map<string, string>();
  for (const rule of RELEASE_GLOSS_RULES) {
    for (const [target, name] of Object.entries(rule.names)) {
      const matches = items.filter(item => item.emoji === rule.emoji &&
        learningWordForCourse(item, `zh-CN-${target}` as Parameters<typeof learningWordForCourse>[1]) === name);
      assert.equal(matches.length, 1, `Stale/non-unique target guard: ${rule.emoji} ${target} ${name}`);
      for (const [source, gloss] of Object.entries(rule.glosses)) {
        const course = COURSES.find(course => course.sourceLanguage === source && course.targetLanguage === target);
        assert(course, `Invalid course: ${source}-${target}`);
        const key = `${matches[0].id}|${course.id}`;
        assert(!approved.has(key), `Duplicate release gloss: ${key}`);
        approved.set(key, gloss);
      }
    }
  }
  const changes: { id: string; emoji: string; course: string; target: string; before: string | undefined; after: string | undefined }[] = [];
  const current = matrix();
  for (const [index, row] of current.entries()) {
    const before = baseline.matrix[index];
    const { courses: oldCourses, ...oldItem } = before;
    const { courses: newCourses, ...newItem } = row;
    assert.deepEqual(newItem, oldItem, 'Emoji IDs/order/original words/item metadata changed');
    for (const course of COURSES) {
      const oldCell = oldCourses[course.id], newCell = newCourses[course.id];
      assert.equal(newCell.target, oldCell.target, `Target changed: ${row.id} ${course.id}`);
      const expected = approved.get(`${row.id}|${course.id}`) ?? oldCell.gloss;
      assert.equal(newCell.gloss, expected, `Unapproved/missing gloss: ${row.id} ${course.id}`);
      if (newCell.gloss !== oldCell.gloss) changes.push({ id: row.id, emoji: row.emoji, course: course.id,
        target: newCell.target, before: oldCell.gloss, after: newCell.gloss });
    }
  }
  const summary = { items: items.length, courses: COURSES.length, checkedCourseGlosses: items.length * COURSES.length,
    changedGlosses: changes.length, changedEmojis: new Set(changes.map(row => row.id)).size,
    changedTargetWords: 0, changedPublicFiles: 0, approvedCells: approved.size,
    deferredConflict: { id: 'tired-face-2', course: 'zh-CN-ja', target: '疲れた',
      reason: 'Adjective meaning tired; requested face noun adds meaning. Kept unchanged pending confirmation.' },
  };
  writeFileSync(join(directory, 'release-a-only-changes.json'), JSON.stringify(changes, null, 2) + '\n');
  writeFileSync(join(directory, 'release-a-only-result.json'), JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify(summary, null, 2));
}
