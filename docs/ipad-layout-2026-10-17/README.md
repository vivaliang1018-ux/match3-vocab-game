# iPad game-stage layout fix — 2026-10-17

## Scope

Product change: responsive game-stage CSS in `src/index.css` only. Existing unrelated work is preserved. Build output was regenerated and synced with `npx cap sync ios`; no upload, archive, release or submission was performed.

- Portrait: the HUD and board are centered together with a 16–28pt gap. Board width is bounded by 800pt, available width and viewport height instead of a fixed 480pt ceiling.
- Artwork: tablet tile emoji and images use board-relative container units, up to 72pt, instead of keeping phone-sized artwork inside enlarged bubbles.
- Landscape: retain left goals / center board / right controls. Increase the board ceiling from 620pt to 800pt while respecting height and side-rail room.
- Timed mode: reserve 100pt above the board for target/countdown content and retain height constraints.
- The rules below 700px were not changed. Gameplay, purchases, stamina, notifications and course progression were not modified.

## Verification

`npm run build`, Capacitor iOS sync, native simulator build and the isolated XCTest capture completed successfully. `git diff --check -- src/index.css` passed.

### Actual iOS Simulator

Device: isolated LingoMatch-AppStore-iPad13, iPad Pro 13-inch (M5), iOS 26.5. The app was rebuilt from the current project and existing synced web assets, then updated with the new synced assets. No user's existing simulator installation was erased.

- `native-portrait-before.png`: original 480pt board, top-pinned HUD and large empty gap.
- `native-portrait-after.png`: original XCTest screenshot attachment; board spans x=116..916 (800pt) at a 1032pt viewport. HUD and board are grouped.
- `native-landscape-after.png`: simulator framebuffer rotated 90° to correct capture orientation only; interface pixels are not redrawn. Landscape large-board layout is visible.

### Browser responsive checks (ego-browser)

| Viewport, CSS px | Board width | Result |
| --- | ---: | --- |
| 1032 × 1376 | 800 | Portrait; HUD-to-board gap ~28px; no horizontal overflow |
| 834 × 1194 | 800 | Portrait; board above bottom navigation |
| 744 × 1133 | 720 | Mini portrait; board above bottom navigation |
| 700 × 800 | 540 | Constrained portrait; respects height |
| 1376 × 1032 | 800 | Landscape; side rails do not overlap board |
| 1194 × 834 | 689 | Landscape; height-constrained |
| 1133 × 744 | 599 | Mini landscape; height-constrained |
| 393 × 852 | ~362 | Phone portrait sizing unchanged |
| 375 × 667 | 345 | Small phone portrait sizing unchanged |

An actual pointer swap was performed in the browser; the grid changed and NEW DISCOVERY appeared. `web-landscape-after.png` shows the browser landscape layout, not a native screenshot.

Timed-layout geometry was tested by temporarily applying the existing timed-mode class and an 80px target fixture to the rendered board in the QA browser (not by changing saved data or product code). At 1032×1376, 744×1133, 1376×1032 and 1133×744, the target remained in the viewport, the board stayed above navigation, and portrait targets stayed below the HUD. This is layout-fixture coverage, not a full native timed-review session. The fixture was removed and the QA browser space closed.

Not claimed: end-to-end native Quiz/Say & Blast completion, real-device performance, TestFlight delivery or App Review approval. Screenshots in this directory are evidence, not the completed App Store marketing set.
