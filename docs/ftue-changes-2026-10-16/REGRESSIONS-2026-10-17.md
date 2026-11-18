# Notification, Home and stamina regression checks

## Changes

- iOS denied-notification enable taps now open the native notification Settings page. First-time refusal is respected without an automatic Settings redirect. Returning with permission granted completes the explicitly requested enable action and schedules reminders; returning without granting does not enable or schedule them. Turning reminders off clears pending enable intent.
- Notification settings refresh when returning to the app or preferences change.
- Home keeps My words available whenever learned words exist, independently of due-review count and stamina. Progress also displays remaining energy. Existing recovery actions remain conditional on depleted stamina.
- The stamina sheet only overlays the game tab, not Learned/Profile/Emojis.
- Paid Adventure continuation checks now reject failed, blocked and exhausted-move attempts. Restoring a failed attempt through mode navigation preserves the failure/retry UI rather than quietly reopening play.

## Verified

- 41 automated tests passed, including seven new permission-flow/resume/midnight cases. Permission tests use mocked Capacitor plugins, not real iOS authorization.
- TypeScript and production build passed; Capacitor iOS sync completed.
- Xcode Debug simulator-target compilation succeeded using `/private/tmp/lingomatch-ftue-derived`, signing disabled. No device installation, upload or release performed.
- Browser checks used isolated test-origin data at `127.0.0.1:5201`, with 18 valid learned word IDs and zero stamina. My words opened Learned with all 18 entries without the stamina overlay. Switching to Play showed the depleted-energy sheet and no playable board. With three stamina, Home contained Continue Adventure, learned count, energy count and My words even with no stored due memories.
- Browser screenshot: [Zero-energy blocked game](zero-energy-blocked.png). Desktop browser viewport only; not a new iPhone-layout test.

## Limits and interpretation

The supplied screenshots show 23:46 and then 00:18. Existing stamina logic replenishes three points at local midnight; automated boundary tests confirm this. The screenshots alone do not establish a same-day unpaid-board bypass. Already-paid unfinished rounds and pending Quiz are intentional continuations, not new free rounds.

Native Settings navigation and delivery still require a fresh build installed on a real iPhone: deny notification permission, tap Remind me, enable Allow Notifications in Settings, return, verify master enabled and pending reminders, then use Send test notification. Focus modes and OS delivery settings can affect presentation.

The isolated browser test did not inspect or alter the user's real device data.
