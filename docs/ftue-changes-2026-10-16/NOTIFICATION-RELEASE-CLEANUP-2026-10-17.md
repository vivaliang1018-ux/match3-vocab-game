# Remove the verified QA notification entry for release

After the user confirmed real-device test notification delivery, removed Send test notification from NotificationSettingsSheet, the exported test sender, and its seven-locale button/status/body strings. The production notification settings sheet retains its body portal, compact controls and conditional permission/error messages.

Notification ID 73999 remains only as a legacy cleanup identifier: normal refresh cancels it, including when real reminders are disabled. It is never scheduled and is excluded from production pending-count diagnostics. Disabling reminders also cleans that ID. Existing daily/review/stamina reminders and the 45-quote pool remain unchanged. This cleanup affects pending legacy test notifications after the new build runs; it does not claim to have remotely changed the installed phone.

Verification: 57 automated tests passed, including absence of the test sender, no QA ID in production schedules, cleanup while disabled and exclusion from diagnostic counts. TypeScript, changed-file lint, production build, Capacitor iOS sync and Xcode Debug simulator-target compilation passed. A scan of the actual copied iOS JavaScript assets found no test sender, test source or Chinese/English test text remnants.

No device installation, Archive, upload or App Review submission was performed.
