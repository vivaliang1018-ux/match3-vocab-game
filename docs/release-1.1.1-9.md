# iOS 1.1.1 (9) metadata release

- Purpose: ship the approved English (U.S.) App Store name `LingoMatch: Learn Languages` and subtitle `Relaxing Match-3 Language Game`. These are App Store Connect metadata, not compiled bundle display-name changes.
- Changed only Debug/Release MARKETING_VERSION (1.1 → 1.1.1) and CURRENT_PROJECT_VERSION (7 → 9) in the Xcode project for this archive.
- Baseline: `2026-10-18/LingoMatch 1.1 (7).xcarchive`. Its distribution record confirms upload to App Store Connect as build 8.
- No npm web build or Capacitor sync was run. Existing iOS public resources were preserved, excluding recent WeChat mini-program changes.
- Archive: `release-artifacts/LingoMatch-1.1.1-9.xcarchive`.
- Verification: xcodebuild ARCHIVE SUCCEEDED; archived Info.plist confirms 1.1.1/9; recursive comparison of bundled public resources with the uploaded baseline shows no differences; codesign deep/strict verification passes.
- Diagnostic warning: App Intents metadata extraction skipped because the project does not depend on AppIntents.framework. No archive error.
- Opened the archive in Xcode. Not uploaded or submitted to App Review by this task.
- Next: Distribute App → App Store Connect → Upload; after processing, select the new build for the 1.1.1 draft and verify the English (U.S.) name/subtitle before submission.
