import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { COURSES } from '../src/courseConfig';
import { EMOJI_NOUN_CATEGORIES } from '../src/data/emojiNouns';
import { getEmojiLearningTranslation } from '../src/data/emojiLocalizedNames';
import { COURSE_GLOSS_OVERRIDES, courseGlossOverride } from '../src/data/courseGlossOverrides';
import { ASR_FOLLOWUP_GLOSSES } from '../src/data/courseGlossAsrFollowup';
import { translatedGloss } from '../src/data/courseGlossTranslations';
import { englishCourseGloss, NEUTRAL_SPANISH_ALIASES } from '../src/data/englishCourseGlosses';
import { REVERSE_GLOSS_RULES, reverseCourseGloss } from '../src/data/courseReverseGlosses';
import { learningWordForCourse, sourceWordForCourse } from '../src/lib/courseWord';
import { releaseCourseGloss } from '../src/data/courseReleaseGlosses';

type AuditItem = { id: string; emoji: string; word: string; names: Record<string, string> };
type Transcript = { id: string; locale: string; expected: string; transcript: string };
const manifest: AuditItem[] = JSON.parse(readFileSync('audio-work/gender-audit-2026-10-16/manifest.json', 'utf8'));
const transcripts: Transcript[] = readFileSync('audio-work/gender-audit-2026-10-16/transcripts.jsonl', 'utf8').trim().split('\n').map(line => JSON.parse(line));
const items = EMOJI_NOUN_CATEGORIES.flatMap(category => category.items);
const keys = new Set<string>();
for (const row of COURSE_GLOSS_OVERRIDES) {
  const key = `${row.target}|${row.emoji}|${row.learningName}`;
  assert(!keys.has(key), `Duplicate override: ${key}`);
  keys.add(key);
  assert(items.some(item => item.emoji === row.emoji && learningWordForCourse(item, `zh-CN-${row.target}`) === row.learningName), `Stale override: ${key}`);
  for (const source of ['es','fr','de','ja','ko'] as const) {
    if (source !== row.target) assert(translatedGloss(row.en, source), `Missing ${source} meaning: ${row.en}`);
  }
}
for (const rule of REVERSE_GLOSS_RULES) {
  for (const [target, name] of Object.entries(rule.names)) {
    assert(items.some(item => item.emoji === rule.emoji && learningWordForCourse(item, `zh-CN-${target}` as Parameters<typeof learningWordForCourse>[1]) === name), `Stale reverse guard: ${rule.emoji} ${target} ${name}`);
  }
}
const byLocale: Record<string, number> = {};
for (const row of ASR_FOLLOWUP_GLOSSES) {
  byLocale[row.target] = (byLocale[row.target] ?? 0) + 1;
  const item = manifest.find(candidate => candidate.emoji === row.emoji && (row.target === 'en' ? candidate.word : candidate.names[row.target]) === row.learningName);
  assert(item, `No audited item for ${row.learningName}`);
  assert(transcripts.some(t => t.id === item.id && t.locale === row.target && t.expected === row.learningName), `No ASR evidence: ${row.learningName}`);
  assert.equal(courseGlossOverride(row.emoji, row.learningName + ' changed', 'zh-CN', row.target), undefined, 'Stale-name guard failed');
}

let checked = 0;
let changed = 0;
for (const course of COURSES) {
  for (const item of items) {
    const learning = course.targetLanguage === 'en' ? item.word : getEmojiLearningTranslation(item, course.targetLanguage) ?? item.word;
    assert.equal(learningWordForCourse(item, course.id), learning, 'Target word changed');
    const original = course.sourceLanguage === 'en' ? item.word : course.sourceLanguage === 'zh-CN' ? item.cn : getEmojiLearningTranslation(item, course.sourceLanguage) ?? item.word;
    const override = COURSE_GLOSS_OVERRIDES.find(row => row.target === course.targetLanguage && row.emoji === item.emoji && row.learningName === learning);
    const neutralEnglish = course.targetLanguage === 'en' ? englishCourseGloss(learning, course.sourceLanguage) : undefined;
    const direct = override ? (course.sourceLanguage === 'en' || course.sourceLanguage === 'zh-CN' ? override[course.sourceLanguage] : translatedGloss(override.en, course.sourceLanguage)) : undefined;
    const alias = course.targetLanguage === 'es' ? NEUTRAL_SPANISH_ALIASES[item.emoji] : undefined;
    const neutralSpanish = alias?.[0] === learning ? (course.sourceLanguage === 'en' ? alias[1] : englishCourseGloss(alias[1], course.sourceLanguage)) : undefined;
    const expected = releaseCourseGloss(item.emoji, learning, course.sourceLanguage, course.targetLanguage) ?? neutralEnglish ?? direct ?? neutralSpanish ?? reverseCourseGloss(item.emoji, learning, course.sourceLanguage, course.targetLanguage) ?? original;
    const actual = sourceWordForCourse(item, course.id);
    assert.equal(actual, expected);
    if (actual !== original) changed++;
    checked++;
  }
}
const factory = items.find(item => item.id === 'factory-worker')!;
assert.equal(sourceWordForCourse(factory, 'zh-CN-ja'), '女焊工');
assert.equal(sourceWordForCourse(factory, 'en-ja'), 'Female welder');
assert.equal(learningWordForCourse(factory, 'zh-CN-ja'), '女性の溶接工');
assert.equal(sourceWordForCourse(factory, 'zh-CN-en'), '工厂工人', 'Gender must not leak into neutral English target');
assert.equal(sourceWordForCourse(factory, 'fr-ja'), 'soudeuse');
assert.equal(sourceWordForCourse(factory, 'de-ja'), 'Schweißerin');
assert.equal(sourceWordForCourse(factory, 'ja-en'), '工場作業員');
assert.equal(sourceWordForCourse(factory, 'ko-en'), '공장 노동자');
assert.equal(sourceWordForCourse(factory, 'ja-es'), '女性の工場作業員');
const lobster = items.find(item => item.id === 'lobster')!;
assert.equal(sourceWordForCourse(lobster, 'zh-CN-ja'), '淡水螯虾');
assert.equal(sourceWordForCourse(lobster, 'ja-en'), 'ロブスター');
assert.equal(sourceWordForCourse(lobster, 'de-ja'), 'Flusskrebs');
const flower = items.find(item => item.id === 'white-flower')!;
assert.equal(sourceWordForCourse(flower, 'zh-CN-ja'), '做得非常好！');
assert.equal(sourceWordForCourse(flower, 'ja-en'), '白い花');

const followupKeys = new Set(ASR_FOLLOWUP_GLOSSES.map(row => `${row.target}|${row.emoji}|${row.learningName}`));
const unresolved = transcripts.filter(t => {
  const item = manifest.find(i => i.id === t.id)!;
  const hasGender = t.locale === 'en' ? /\b(?:man|woman|men|women|merman|mermaid)\b/i.test(t.expected)
    : t.locale === 'ja' ? /女|男|ガール|マーメイド|マーマン|おじいさん|おばあさん/.test(t.expected)
    : t.locale === 'ko' ? /여자|남자|여학생|여교사/.test(t.expected)
    : /mujer|hombre|profesora|jueza|mecánica|bombera|superheroína|supervillana|maga|vampiresa|elfa/.test(t.expected);
  if (!hasGender) return false;
  const key = `${t.locale}|${item.emoji}|${t.expected}`;
  return !followupKeys.has(key) && !COURSE_GLOSS_OVERRIDES.some(row => row.target === t.locale && row.emoji === item.emoji && row.learningName === t.expected)
    && !/女|男|仙女|孕妇|夫人|老妇/.test(items.find(i => i.id === t.id)!.cn);
});
console.log(JSON.stringify({followup: ASR_FOLLOWUP_GLOSSES.length, byLocale, totalOverrides: COURSE_GLOSS_OVERRIDES.length, courseItemChecks: checked, changedSourceGlosses: changed, uncoveredGenderGlossCandidateCount: unresolved.length, uncoveredGenderGlossCandidates: unresolved.map(t => ({id:t.id,locale:t.locale,expected:t.expected,asr:t.transcript})), note:'Candidate heuristic is not audio certification. Prior uncertain ASR clips remain unverified by listening.'}, null, 2));
