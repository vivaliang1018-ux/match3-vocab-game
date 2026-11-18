# Course isolation release and legacy audit

Date: 2026-10-13 (Asia/Shanghai)

## Production rules

Published via the signed-in Firebase console to project `match3-vocab-game`,
database `(default)`. The rules history displayed a new starred active revision
(`Today • 5:21 PM` in the console). The selected revision contained the
`state--{courseId}` paths and current core-progress and daily-quota validation.

The previously active revision allowed only `memories`, `updatedAtMs`, and
`updatedAt` in `match3/state`. It did not allow core-progress fields or daily
quota writes. The earlier diagnosis that a shared cloud learned-ID list was
the confirmed source of observed contamination was therefore too strong:
shared cloud memory was possible, but cloud learned-ID contamination was not
observed. Current course-keyed component state and captured async write scope
prevent future cross-course reuse.

## Read-only legacy audit

All five user entries visible under `users` were checked through the console.
User identifiers are abbreviated here; no records were modified or deleted.

| Account prefix | Memory records | Stage 0 | Stage 1 or higher | Learned ID list |
| --- | ---: | ---: | ---: | --- |
| 5ZjY | 6 | 6 | 0 | absent |
| 8CM7 | 6 | 6 | 0 | absent |
| ILjw | 6 | 6 | 0 | absent |
| WIPA | 209 | 24 | 185 | absent |
| pdYQ | 23 | 8 | 15 | absent |
| Total | 250 | 50 | 200 | absent |

All inspected word strings were English vocabulary labels. No inspected
legacy document supplied a source/target course identifier. Stage 0 records
represent exposure, not a completed learning quiz. A positive stage is useful
memory evidence but cannot reconstruct exact per-course emoji IDs, completion
counts, or source-language ownership safely.

Legacy documents remain untouched and are not automatically merged into new
course documents. Existing local progress is preserved. Device-local
contamination cannot be audited from the Firebase console: install the latest
Xcode build and retest course switching. If an incorrect Learned list remains,
inspect a device-local export before planning any targeted repair. Do not
clear all storage, reset stamina, or overwrite unrelated course progress.

## Remaining verification

- Real-device course switch and relaunch, including Spanish and Korean.
- Confirm the latest client creates separate `state--...` documents after
  synchronization; production rules publication alone does not verify a
  real-device round trip.
- If local contamination persists, inspect that device's progress with the
  user before making a backed-up, targeted correction.
