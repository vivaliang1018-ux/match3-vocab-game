# TestFlight QA Checklist

**App:** 物品消消乐 (Match-3 Vocab Game)  
**Bundle ID:** `com.match3vocab.game`  
**Build type:** Release (Archive → TestFlight, not Debug simulator)  
**Tester device:** iPhone _____ / iOS _____  
**Build number:** _____  
**Tester name:** _____  
**Date:** _____

---

## How to use

- Test on a **real iPhone** when possible (simulator is not enough for audio, performance, and App Review-like behavior).
- Mark each row: ✅ Pass · ❌ Fail · ⏭ Skip · N/A
- For ❌ Fail, add steps to reproduce and a screenshot or screen recording.
- Play at least **one full round** in each game mode before signing off.

---

## 1. Install & first launch

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 1.1 | Fresh install opens without crash | | |
| 1.2 | Splash screen shows logo, then enters game within ~3s | | |
| 1.3 | Status bar / safe area look correct (notch, Dynamic Island) | | |
| 1.4 | Onboarding appears on first launch | | |
| 1.5 | Onboarding can be completed or skipped | | |
| 1.6 | Onboarding does not reappear after kill + reopen | | |
| 1.7 |「使用引导」can reopen tutorial from settings | | |

---

## 2. Core gameplay (Random mode)

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 2.1 | Board renders 7×7 tiles with emojis | | |
| 2.2 | Tap two adjacent tiles to swap | | |
| 2.3 | Invalid swap animates back | | |
| 2.4 | Match-3+ clears tiles with animation | | |
| 2.5 | Gravity refill feels smooth (no stutter / white flash) | | |
| 2.6 | Cascading matches work | | |
| 2.7 | Word popup appears on clear | | |
| 2.8 | English pronunciation plays (recorded or system TTS) | | |
| 2.9 | Top HUD updates (score / progress) | | |
| 2.10 | Word group row scrolls; selected icon scales subtly | | |
| 2.11 | Play 5+ minutes — no crash, no frozen board | | |

---

## 3. Round quiz (after clearing all words in a round)

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 3.1 | Quiz sheet opens automatically | | |
| 3.2 | Stars / background do not block quiz buttons | | |
| 3.3 | Connect phase: match English to emoji | | |
| 3.4 | Pick phase: choose correct word from options | | |
| 3.5 | Question change does not jitter layout | | |
| 3.6 | Prev / next buttons always visible (disabled when unusable) | | |
| 3.7 | Speech does not interrupt mid-word on question change | | |
| 3.8 |「再听一次」replays English only | | |
| 3.9 | Wrong answer shows feedback; can retry | | |
| 3.10 | Completing quiz shows celebration | | |
| 3.11 | Next round starts with new board | | |

---

## 4. Game modes

### 4a. Fun mode (趣味)

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 4.1 | Target banner shows with countdown ring | | |
| 4.2 | Long target words fit in fixed banner (scale, no overflow) | | |
| 4.3 | Short words display large | | |
| 4.4 | Clearing target word updates countdown / target | | |
| 4.5 | All words reach 3/3 → auto advances to next round | | |

### 4b. Category mode (分类)

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 4.6 | Mode picker opens from settings chip | | |
| 4.7 | Category list shows; picking one starts that pool | | |
| 4.8 | Board uses only emojis from selected category | | |

### 4c. Review mode (复习)

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 4.9 | Tab badge shows due review count | | |
| 4.10 | Review mode uses due words when available | | |
| 4.11 | Empty review pool shows helpful message | | |
| 4.12 | Completing review updates spaced-repetition schedule | | |

### 4d. Mode switching

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 4.13 | Switch random ↔ fun ↔ category ↔ review without crash | | |
| 4.14 |「换一批词」shuffles word set | | |
| 4.15 |「重新开始」resets board cleanly | | |

---

## 5. Learned & word list tabs

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 5.1 | Learned tab shows collected emojis | | |
| 5.2 | Tap learned word opens detail modal | | |
| 5.3 | Play pronunciation from modal | | |
| 5.4 | Words / Emoji tab browses full pool | | |
| 5.5 | Due-for-review indicators accurate | | |

---

## 6. Profile & settings

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 6.1 | Profile shows guest name +「本地存档」badge | | |
| 6.2 | Login button shows「登录 / 注册」+ coming-soon hint (disabled for v1) | | |
| 6.3 | SFX toggle works immediately | | |
| 6.4 | BGM toggle works immediately | | |
| 6.5 | BGM ducks during word playback | | |
| 6.6 | Language switch (中 / EN / ES / FR / DE) updates UI | | |
| 6.7 | Stats (completed emojis) match gameplay | | |
| 6.8 | Version string visible in About | | |

---

## 7. Audio & speech

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 7.1 | BGM plays when enabled | | |
| 7.2 | SFX on match / UI tap when enabled | | |
| 7.3 | Silent mode / mute switch respected (iOS hardware) | | |
| 7.4 | Bluetooth headphones work | | |
| 7.5 | Recorded voice plays for common words | | |
| 7.6 | Missing recording falls back to system TTS (no silent fail) | | |
| 7.7 | Quiz speech queue — no overlap / cut-off | | |

---

## 8. Persistence & edge cases

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 8.1 | Kill app mid-game → reopen restores progress | | |
| 8.2 | Language preference persists | | |
| 8.3 | BGM / SFX preference persists | | |
| 8.4 | Learned words & review schedule persist | | |
| 8.5 | Airplane mode — game still playable offline | | |
| 8.6 | Low storage / background — no data corruption | | |
| 8.7 | Uninstall + reinstall clears progress (expected) | | |

---

## 9. Performance & devices

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 9.1 | Small screen (iPhone SE / mini) — layout not clipped | | |
| 9.2 | Large screen (Pro Max) — layout not overly sparse | | |
| 9.3 | 10+ min session — no memory warning / slowdown | | |
| 9.4 | Animations smooth on target device | | |
| 9.5 | App size & first launch time acceptable | | |
| 9.6 | iPad (if supported) — usable in portrait | | |

---

## 10. Accessibility (smoke test)

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 10.1 | VoiceOver can reach tab bar items | | |
| 10.2 | Board tiles have spoken labels | | |
| 10.3 | Quiz dialog is navigable | | |
| 10.4 | Dynamic Type / large text — no critical overlap | | |

---

## 11. Release & store readiness

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 11.1 | Built with Release / Archive (not Debug) | | |
| 11.2 | App icon correct on home screen | | |
| 11.3 | Display name「物品消消乐」correct | | |
| 11.4 | No debug overlays or console-only UI | | |
| 11.5 | Privacy policy URL ready for App Store Connect | | |

---

## Sign-off

| Role | Name | Date | Result |
|------|------|------|--------|
| Primary tester | | | ☐ Ready for App Review |
| Dev follow-up | | | ☐ Blockers fixed |

**Blocking issues (must fix before submit):**

1. 
2. 
3. 

**Non-blocking issues (can ship in v1.0.x):**

1. 
2. 
