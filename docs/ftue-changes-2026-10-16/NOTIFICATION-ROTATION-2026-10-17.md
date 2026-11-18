# Existing notification quotes connected to V2

## Implemented

- V2 imports the original `notificationCopy.ts` pool: 45 unchanged quotes per locale, seven locales. It no longer uses the single fixed streak sentence for routine invitations.
- Daily invitations prefer the existing time-of-day group and avoid the previous seven selected quotes. If a five-entry group is exhausted, selection expands to eligible general quotes, not inappropriate bedtime/commuting claims.
- Full-energy quotes (indexes 22, 28, 40) are used only for the real depleted-energy recovery reminder, scheduled at 09:00 on the recovery date. These three variants rotate; they cannot provide seven unique energy-only quotes.
- Yesterday claims require a matching recorded activity date. All 45 original quotes remain eligible under an appropriate context.
- Review reminders retain actual due-word counts. Existing one-regular-reminder-per-day, energy-day suppression, permissions, category controls, 30-day horizon and consent scopes remain intact.
- Quote indices are persisted by day and event kind so refreshing/reopening does not randomly replace an eligible scheduled sentence. Existing V1 history migrates without enabling marketing consent.
- Gameplay/Say & Blast activity updates and notification settings now retain current review/energy context; partial-context refreshes must not accidentally remove a valid energy reminder. Repeated matches on the same day no longer cancel/recreate the month of notifications.

## Verification

54 automated tests passed, including all seven locale pools, 30-day seven-quote separation at four supported times, truthful context filtering, same-day schedule stability, rolling horizon/time changes, review counts, 09:00 energy scheduling, category toggles, legacy history migration and existing permission/resume regressions.

Notification SDK tests use mocked Capacitor implementations and capture the actual schedule payload passed by V2. They are not claims of real-device delivery.

TypeScript/production build, Capacitor iOS sync and Xcode Debug simulator-target compilation passed (signing disabled, derived data `/private/tmp/lingomatch-ftue-derived`). No device installation, archive, upload or release was performed. Installing the new build and entering the game refreshes/replaces the existing owned notification queue. A phone that has not installed/run the new build retains its old queue.

New-content/events remain saved preferences only; remote push delivery was not added.
