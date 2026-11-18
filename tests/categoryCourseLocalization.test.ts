import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { COURSES, type LanguageCode } from '../src/courseConfig';
import { EMOJI_NOUN_CATEGORIES } from '../src/data/emojiNouns';
import { encodeVoicePathSegment } from '../src/lib/emojiVoiceFileUrl';
import { learningWordForCourse, sourceWordForCourse } from '../src/lib/courseWord';

const items = EMOJI_NOUN_CATEGORIES.flatMap((category) => category.items);
const voiceFolders: Record<Extract<LanguageCode, 'en' | 'es' | 'ja' | 'ko'>, string> = {
  en: 'emoji-voice',
  es: 'emoji-voice-es',
  ja: 'emoji-voice-ja',
  ko: 'emoji-voice-ko',
};

test('every category item has target and source copy for every available course', () => {
  for (const course of COURSES.filter((entry) => entry.status === 'available')) {
    for (const item of items) {
      assert.ok(
        learningWordForCourse(item, course.id).trim(),
        `${course.id}: missing target word for ${item.emoji}`,
      );
      assert.ok(
        sourceWordForCourse(item, course.id)?.trim(),
        `${course.id}: missing source translation for ${item.emoji}`,
      );
    }
  }
});

test('every category target word resolves to a shipped recording', () => {
  for (const target of Object.keys(voiceFolders) as Array<keyof typeof voiceFolders>) {
    const folder = join(process.cwd(), 'public', voiceFolders[target]);
    const stems = new Set(
      readdirSync(folder)
        .filter((name) => name.endsWith('.mp3'))
        .map((name) => name.slice(0, -4).normalize('NFC')),
    );
    const course = COURSES.find(
      (entry) => entry.targetLanguage === target && entry.sourceLanguage !== target,
    );
    assert.ok(course, `missing course for ${target}`);
    const missing = items
      .map((item) => learningWordForCourse(item, course!.id))
      .filter((word) => {
        const stem = decodeURIComponent(encodeVoicePathSegment(word)).normalize('NFC');
        return !stems.has(stem);
      });
    assert.deepEqual(missing, [], `${target}: recordings missing`);
  }
});
