import assert from 'node:assert/strict';
import { test } from 'node:test';
import { COURSES } from '../src/courseConfig';
import { EMOJI_NOUN_CATEGORIES } from '../src/data/emojiNouns';
import { RELEASE_GLOSS_RULES, releaseCourseGloss } from '../src/data/courseReleaseGlosses';
import { learningWordForCourse, sourceWordForCourse } from '../src/lib/courseWord';

const items = EMOJI_NOUN_CATEGORIES.flatMap(category => category.items);
const item = (id: string) => {
  const found = items.find(row => row.id === id);
  assert(found, id);
  return found;
};

test('release glosses are scoped to the exact original word, target, emoji, and source', () => {
  const seen = new Set<string>();
  for (const rule of RELEASE_GLOSS_RULES) {
    for (const [target, name] of Object.entries(rule.names)) {
      for (const [source, gloss] of Object.entries(rule.glosses)) {
        const course = COURSES.find(row => row.sourceLanguage === source && row.targetLanguage === target);
        assert(course);
        const match = items.filter(row => row.emoji === rule.emoji && learningWordForCourse(row, course.id) === name);
        assert.equal(match.length, 1);
        const key = `${match[0].id}|${course.id}`;
        assert(!seen.has(key), key);
        seen.add(key);
        assert.equal(sourceWordForCourse(match[0], course.id), gloss);
        assert.equal(releaseCourseGloss(rule.emoji, name + ' changed', course.sourceLanguage, course.targetLanguage), undefined);
        assert.equal(releaseCourseGloss('not-the-emoji', name, course.sourceLanguage, course.targetLanguage), undefined);
      }
    }
  }
});

test('B target words remain unchanged even when the reverse A gloss is corrected', () => {
  assert.equal(learningWordForCourse(item('paw-prints'), 'zh-CN-es'), 'huellas de pezuñas');
  assert.equal(sourceWordForCourse(item('paw-prints'), 'es-en'), 'huellas de patas');
  assert.equal(sourceWordForCourse(item('paw-prints'), 'ja-en'), '肉球');
  assert.equal(learningWordForCourse(item('clamp'), 'zh-CN-ko'), '압축기');
  assert.equal(sourceWordForCourse(item('clamp'), 'ko-en'), '클램프');
  assert.equal(learningWordForCourse(item('desert-island'), 'zh-CN-ko'), '사막 섬');
  assert.equal(learningWordForCourse(item('root-vegetable'), 'zh-CN-es'), 'túberculo comestible');
  assert.equal(sourceWordForCourse(item('root-vegetable'), 'es-en'), 'tubérculo comestible');
  assert.equal(learningWordForCourse(item('cinema-light'), 'zh-CN-en'), 'Cinema Light');
  assert.equal(sourceWordForCourse(item('cinema-light'), 'en-es'), 'Cinema');
  assert.equal(sourceWordForCourse(item('shortcake'), 'zh-CN-ja'), '草莓蛋糕');
});

test('action, person, and object are not interchanged across approved course directions', () => {
  assert.equal(sourceWordForCourse(item('juggling'), 'fr-en'), 'jonglage');
  assert.equal(sourceWordForCourse(item('juggling'), 'en-ja'), 'Juggler');
  assert.equal(sourceWordForCourse(item('juggling'), 'zh-CN-ko'), '杂耍者');
  assert.equal(sourceWordForCourse(item('fencing'), 'zh-CN-en'), '击剑运动');
  assert.equal(sourceWordForCourse(item('fencing'), 'en-ko'), 'Fencer');
  assert.equal(sourceWordForCourse(item('nail-polish'), 'zh-CN-es'), '涂指甲油');
  assert.equal(sourceWordForCourse(item('nail-polish'), 'zh-CN-ja'), '正在涂指甲油的手');
  assert.equal(sourceWordForCourse(item('nail-polish'), 'zh-CN-en'), '指甲油');
  assert.equal(sourceWordForCourse(item('envelope-with-arrow'), 'ja-ko'), '送った手紙');
  assert.equal(learningWordForCourse(item('envelope-with-arrow'), 'zh-CN-ja'), 'メール受信');
});

test('actual wording is respected and unresolved adjective/noun conflict is deferred', () => {
  assert.equal(sourceWordForCourse(item('palms-up-together'), 'fr-ko'), 'deux mains tendues');
  assert.equal(sourceWordForCourse(item('closed-mailbox-with-lowered-flag'), 'zh-CN-ko'), '旗子放下的关闭信箱');
  assert.equal(sourceWordForCourse(item('tired-face-2'), 'zh-CN-ja'), '痛苦');
  assert.equal(sourceWordForCourse(item('tired-face-2'), 'zh-CN-ko'), '疲惫的脸');
  assert.equal(sourceWordForCourse(item('timer-clock'), 'fr-en'), 'horloge');
});
