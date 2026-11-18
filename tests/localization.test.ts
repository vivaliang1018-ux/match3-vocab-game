import assert from 'node:assert/strict';
import { test } from 'node:test';
import { LOCALES } from '../src/i18n/types';
import { EMOJI_LEARNING_BROWSE_SECTIONS, EMOJI_LEARNING_CATEGORIES } from '../src/lib/emojiLearningCategories';
import { CATEGORY_UI_COPY, learningCategoryTitle, learningSectionTitle } from '../src/lib/learningCategoryPresentation';
import { COURSE_SETUP_COPY, HOME_SCENE_COPY, homeCourseHeadline } from '../src/lib/coursePresentation';
import { MEMBERSHIP_COPY } from '../src/membership/membershipCopy';

test('all seven locales provide the home, course, category and membership UI', () => {
  for (const locale of LOCALES) {
    assert.ok(COURSE_SETUP_COPY[locale].title, locale);
    assert.ok(HOME_SCENE_COPY[locale].edit, locale);
    assert.ok(CATEGORY_UI_COPY[locale].title, locale);
    assert.ok(MEMBERSHIP_COPY[locale].paywallBody, locale);
    assert.equal(MEMBERSHIP_COPY[locale].benefits.length, 3, locale);
    assert.ok(homeCourseHeadline('en').secondary, locale);
    for (const category of EMOJI_LEARNING_CATEGORIES) {
      assert.ok(learningCategoryTitle(category, locale), `${locale}: ${category.id}`);
    }
    for (const section of EMOJI_LEARNING_BROWSE_SECTIONS) {
      assert.ok(learningSectionTitle(section, locale), `${locale}: ${section.id}`);
    }
  }
});

test('non-English membership copy does not inherit visible English labels', () => {
  const english = MEMBERSHIP_COPY.en;
  for (const locale of LOCALES.filter((value) => value !== 'en')) {
    const copy = MEMBERSHIP_COPY[locale];
    for (const key of Object.keys(english) as Array<keyof typeof english>) {
      if (key === 'plus' || key === 'remaining' || key === 'benefits') continue;
      assert.notEqual(copy[key], english[key], `${locale}: ${key}`);
    }
    for (let index = 0; index < 3; index++) {
      assert.notEqual(copy.benefits[index], english.benefits[index], `${locale}: benefit ${index}`);
    }
  }
});

test('home headline stays English while the learning language changes by course', () => {
  assert.deepEqual(homeCourseHeadline('en'), {
    primary: 'Match emoji.',
    secondary: 'Learn English. Spark joy.',
  });
  assert.equal(homeCourseHeadline('ja').secondary, 'Learn Japanese. Spark joy.');
  assert.match(CATEGORY_UI_COPY.ja.cycleProgress(2, 3, 6), /第2ラウンド/);
  assert.match(MEMBERSHIP_COPY.ja.lifetime, /永久/);
});
