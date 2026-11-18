import assert from 'node:assert/strict';
import test from 'node:test';
import { COURSES, languageForCode } from '../src/courseConfig';
import { resolveSupportedLocale } from '../src/i18n';

test('every available course uses the target language speech locale', () => {
  for (const course of COURSES.filter((item) => item.status === 'available')) {
    const locale = languageForCode(course.targetLanguage).speechLocale;
    assert.match(locale, /^[a-z]{2}-[A-Z]{2}$/, `${course.id}: ${locale}`);
  }
});

test('Chinese device locales, including Hong Kong and Traditional, use the Simplified UI', () => {
  assert.equal(resolveSupportedLocale(['zh-CN']), 'zh-CN');
  assert.equal(resolveSupportedLocale(['zh-Hans']), 'zh-CN');
  assert.equal(resolveSupportedLocale(['zh-Hant-HK']), 'zh-CN');
  assert.equal(resolveSupportedLocale(['zh-HK']), 'zh-CN');
  assert.equal(resolveSupportedLocale(['zh-TW']), 'zh-CN');
});

test('unknown device locales still fall back to English', () => {
  assert.equal(resolveSupportedLocale(['it-IT']), 'en');
});
