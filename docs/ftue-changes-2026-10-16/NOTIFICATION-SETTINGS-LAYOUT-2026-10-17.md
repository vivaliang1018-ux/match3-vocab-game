# Notification settings cleanup and visible test action

The user's screenshot showed the bottom tab bar above the settings sheet, hiding its lower content/test action. The sheet was rendered inside Profile's stacking context. It now uses a body portal, matching other app dialogs, so background navigation is inert and cannot cover the sheet.

Removed the two header explanations, two long new-content explanations and always-visible system permission/pending-count block. New content retains a short localized Coming soon label; it still saves preferences rather than implying remote delivery is implemented. Denied/unavailable permission explanations remain conditional. Category switches, reminder time and consent logic are unchanged.

The header and Send test notification footer do not scroll. Only settings content scrolls when height is limited. Safe-area padding is applied to the modal container. Stale success/failure notices reset when reopening or changing UI language.

## Verification

- Actual sheet component rendered in an isolated Vite QA harness with an intentionally transformed parent and high-z-index bottom navigation. Native notification permission/queue were mocked as granted/30 pending, not read from the phone.
- Browser viewports 320×568, 375×667, 393×852, 430×932 and 667×375: test action remained inside the viewport and passed center-point hit testing without navigation interception. Landscape content scrolled while the action stayed visible.
- Root background was inert while the portal dialog was open.
- Clicking the Chinese test action passed notification ID 73999 and its existing Chinese body to the SDK schedule mock, approximately five seconds in the future. This verifies dispatch, not real iOS delivery.
- Chinese and English labels inspected. [Chinese small-screen screenshot](notification-settings-clean-375.png).
- 54 automated tests passed. TypeScript/production build, lint for changed files, Capacitor iOS sync and Xcode Debug simulator-target compilation passed. No device install/upload/release.

The temporary QA harness was removed after use. Final installed-iPhone safe-area/notification delivery confirmation remains with the user.
