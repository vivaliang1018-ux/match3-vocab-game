# Zero-energy recovery controls and phantom paid snapshots

## Code-confirmed cause

Home previously suppressed the whole recovery panel when a saved board looked paid. Adventure initializes word/grid state even when entered through Learned. Its initial `staminaOwed` ref was false, and the snapshot writer could run before board setup armed the charge. This permitted an unplayed background preview to be persisted as paid. The prior empty-storage test did not cover this state.

## Changes

- Zero energy always shows Home recovery choices regardless of a saved board or pending quiz. Ad availability/daily ad limits and speaking unlock requirements still apply.
- Genuine paid unfinished boards/pending quizzes have a separately labelled **Resume current set** action. This does not authorize starting the next set without energy.
- New Adventure state starts with payment owed. Successful charging records explicit `staminaPaid` evidence, carried through saves and restores and reset for new rounds/retries.
- Legacy `staminaOwed=false` alone is no longer payment evidence. Legacy previews with no successful word hits require payment, while legacy matched boards retain continuation. An explicit new-format `staminaPaid=false` cannot be overridden by hits.
- Snapshot writing is restricted to the active game tab and Adventure-owned boards. Opening Learned/Profile cannot overwrite a saved Adventure with a background preview.
- Mount-time restoration of an unpaid saved preview at zero energy is blocked before opening a playable board.

## Verification

42 automated tests passed. TypeScript, production build and Capacitor iOS sync passed. Xcode Debug simulator-target compilation passed with signing disabled. No deployment, device installation, upload or release.

Browser checks used a new isolated origin (`127.0.0.1:5203`), guest progress, English → Japanese, mobile viewport 393×852 and synthetic saved states:

1. Seed 24 learned words, zero energy and a legacy unpaid preview incorrectly marked `staminaOwed=false`: Home shows recovery choices and no ordinary Continue Adventure action. [Screenshot](phantom-board-home-fixed.png).
2. Open My words: 24 actual entries are visible; the saved preview is not replaced by background initialization. Switch to Play: depleted-energy dialog appears, no playable board. [Screenshot](phantom-board-play-blocked.png).
3. Return Home: recovery choices remain. Seed a genuinely paid unfinished board: both recovery choices and Resume current set are present. Resume preserves the round ID and zero remaining energy.
4. Seed a completed six-answer Quiz checkpoint for that paid round (not a manual full gameplay session): settlement adds six learned words. Click Next set without enabling reminders: energy remains zero, pending Quiz/snapshot clear, and the depleted-energy dialog blocks the next set. [Screenshot](next-set-at-zero-blocked.png).
5. Return Home, open course selection and confirm Start adventure at zero energy: entry is blocked by the same depleted-energy dialog.

Browser checks do not play native rewarded ads; the native-only ad entry remains subject to the existing supported-platform and quota checks. The connected phone's app-data listing was restricted by the execution environment; no broad device data extraction was performed. The user's precise saved device state has not been read or erased. Final installed-iPhone confirmation is still needed.
