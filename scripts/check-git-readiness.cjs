// Read-only pre-push audit. Writes reports only; never stages, commits or deletes.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync, execFile } = require('node:child_process');
const { promisify } = require('node:util');
const esbuild = require('esbuild');
const root = path.resolve(__dirname, '..');
const output = process.argv[2];
if (!output) throw new Error('Pass a report output path');
const compiled = esbuild.buildSync({ stdin: { contents: `export { EMOJI_NOUN_CATEGORIES } from './src/data/emojiNouns'; export { COURSES } from './src/courseConfig'; export { learningWordForCourse, sourceWordForCourse } from './src/lib/courseWord'; export { primaryEmojiVoiceUrl, buildEmojiVoiceUrls } from './src/lib/emojiVoiceFileUrl';`, resolveDir: root, loader: 'ts' }, bundle: true, write: false, platform: 'node', format: 'cjs', define: { 'import.meta.env.BASE_URL': JSON.stringify('/') } }).outputFiles[0].text;
const mod = { exports: {} };
new Function('module', 'exports', 'require', compiled)(mod, mod.exports, require);
const api = mod.exports;
const items = api.EMOJI_NOUN_CATEGORIES.flatMap((category) => category.items);
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 40 * 1024 * 1024, encoding: 'utf8' }).split('\0').filter(Boolean);
const candidates = [...new Set([...git('ls-files', '-z'), ...git('ls-files', '--others', '--exclude-standard', '-z')])];
const excluded = /^(release-artifacts|audio-work|marketing|miniapp|public\/qa)\//;
const report = { itemCount: items.length, uniqueIds: new Set(items.map((i) => i.id)).size, courseCount: api.COURSES.length, emptyCourseFields: [], inventory: {}, largeFiles: [], sensitivePaths: [], tokenPatternFiles: [], audio: [] };
for (const file of candidates) {
  const full = path.join(root, file);
  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) continue;
  const stat = fs.statSync(full);
  const group = file.split('/')[0];
  report.inventory[group] ??= { files: 0, bytes: 0 };
  report.inventory[group].files++; report.inventory[group].bytes += stat.size;
  if (stat.size > 50 * 1024 * 1024) report.largeFiles.push({ file, bytes: stat.size });
  if (/(^|\/)\.env($|\.)/.test(file) && !file.endsWith('.example') || /\.(p8|p12|mobileprovision|key|pem)$/.test(file)) report.sensitivePaths.push(file);
  // Do not inspect credentials/environment values. Report token-like source
  // locations only, never include matching strings in audit output.
  if (!excluded.test(file) && !report.sensitivePaths.includes(file) && stat.size < 2e6 && /\.(ts|tsx|js|mjs|cjs|json|swift|md|html|plist)$/.test(file)) {
    if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|\bsk-[A-Za-z0-9_-]{24,}/.test(fs.readFileSync(full, 'utf8'))) report.tokenPatternFiles.push(file);
  }
}
for (const course of api.COURSES) for (const item of items) {
  if (!api.learningWordForCourse(item, course.id)?.trim() || !api.sourceWordForCourse(item, course.id)?.trim()) report.emptyCourseFields.push({ id: item.id, course: course.id });
}
const run = promisify(execFile);
const hash = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
(async () => {
  for (const locale of ['en', 'es', 'ja', 'ko']) {
    const relative = `public/emoji-voice${locale === 'en' ? '' : '-' + locale}`;
    const dir = path.join(root, relative);
    const names = fs.readdirSync(dir).filter((name) => name.toLowerCase().endsWith('.mp3'));
    const course = api.COURSES.find((c) => c.targetLanguage === locale);
    const used = new Set();
    const entry = { locale, files: names.length, missing: [], primaryMissing: [], unused: [], normalizedDuplicates: [], invalid: [], formats: {}, iosHashMismatches: [], iosMissing: [], trackedFiles: git('ls-files', '-z', relative).length };
    const normalized = new Map();
    for (const name of names) {
      const key = name.normalize('NFC').toLowerCase();
      if (normalized.has(key)) entry.normalizedDuplicates.push([normalized.get(key), name]);
      normalized.set(key, name);
    }
    for (const item of items) {
      const word = api.learningWordForCourse(item, course.id);
      const base = relative.replace(/^public/, '');
      const primary = decodeURIComponent(api.primaryEmojiVoiceUrl(base, word)).slice(1).replace(/^emoji-voice/, 'public/emoji-voice');
      if (!fs.existsSync(path.join(root, primary))) entry.primaryMissing.push({ id: item.id, word });
      const actual = api.buildEmojiVoiceUrls(base, word).map((url) => decodeURIComponent(url).split('/').pop()).find((name) => names.includes(name));
      if (!actual) entry.missing.push({ id: item.id, word }); else used.add(actual);
    }
    entry.unused = names.filter((name) => !used.has(name));
    let index = 0;
    await Promise.all(Array.from({ length: 8 }, async () => {
      while (index < names.length) {
        const name = names[index++], full = path.join(dir, name);
        try {
          const { stdout } = await run('ffprobe', ['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_name,sample_rate,channels:format=duration', '-of', 'json', full], { timeout: 15000 });
          const result = JSON.parse(stdout), stream = result.streams?.[0];
          if (!stream || stream.codec_name !== 'mp3' || !(Number(result.format?.duration) > 0)) entry.invalid.push(name);
          else { const format = `${stream.codec_name}/${stream.sample_rate}/${stream.channels}`; entry.formats[format] = (entry.formats[format] ?? 0) + 1; }
        } catch { entry.invalid.push(name); }
        const bundled = path.join(root, 'ios/App/App', relative, name);
        if (!fs.existsSync(bundled)) entry.iosMissing.push(name);
        else if (hash(full) !== hash(bundled)) entry.iosHashMismatches.push(name);
      }
    }));
    report.audio.push(entry);
    console.log(JSON.stringify(entry));
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ itemCount: report.itemCount, uniqueIds: report.uniqueIds, courseCount: report.courseCount, emptyCourseFields: report.emptyCourseFields.length, inventory: report.inventory, largeFiles: report.largeFiles, sensitivePaths: report.sensitivePaths, tokenPatternFiles: report.tokenPatternFiles }));
})();
