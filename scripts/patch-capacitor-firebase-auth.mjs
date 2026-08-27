import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = path.join(
  projectRoot,
  'node_modules/@capacitor-firebase/authentication/Package.swift',
);

let source;
try {
  source = await readFile(manifestPath, 'utf8');
} catch (error) {
  console.error(`Unable to read ${manifestPath}. Run npm install first.`);
  throw error;
}

const facebookEntries = [
  /^\s*\.package\(url: "https:\/\/github\.com\/facebook\/facebook-ios-sdk(?:\.git)?", from: "[^"]+"\),?\n/m,
  /^\s*\.product\(name: "FacebookCore", package: "facebook-ios-sdk"\),\n/m,
  /^\s*\.product\(name: "FacebookLogin", package: "facebook-ios-sdk"\)\n?/m,
  /^\s*\.define\("RGCFA_INCLUDE_FACEBOOK"\)\n?/m,
];

let patched = source;
for (const entry of facebookEntries) {
  patched = patched.replace(entry, '');
}

if (/facebook-ios-sdk|FacebookCore|FacebookLogin|RGCFA_INCLUDE_FACEBOOK/.test(patched)) {
  throw new Error(
    'The authentication package manifest has an unfamiliar Facebook dependency layout. Refusing to continue so the release cannot silently include tracking SDKs.',
  );
}

if (patched === source) {
  console.log('Firebase Authentication iOS manifest already excludes Facebook SDK.');
} else {
  await writeFile(manifestPath, patched, 'utf8');
  console.log('Removed unused Facebook SDK from Firebase Authentication iOS manifest.');
}
