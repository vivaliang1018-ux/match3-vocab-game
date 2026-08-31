# TestFlight QA Checklist

**App:** LingoMatch
**Bundle ID:** `com.matchingo.game`  
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
| 1.4 | Legal consent modal appears on first launch | | |
| 1.5 | Terms of Service & Privacy Policy links open | | |
| 1.6 | Tapping OK dismisses consent and does not reappear after kill + reopen | | |
| 1.7 | Me → About still links to Terms & Privacy | | |

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
| 3.6a | Return to a completed Pick question: tapping any image reveals and speaks that option's English name without changing the recorded answer | | |
| 3.7 | Speech does not interrupt mid-word on question change | | |
| 3.8 |「再听一次」replays English only | | |
| 3.9 | Wrong answer shows feedback; can retry | | |
| 3.10 | Completing quiz shows celebration | | |
| 3.11 | Next round starts with new board | | |

---

## 4. Game modes

### 4a. Adventure (闯关)

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 4.1 | Starts with 20 moves; HUD shows 当前组 (= cleared+1) and stamina as hearts + n/5; the first matching move spends 1 stamina, including the player's first-ever Adventure | | |
| 4.2 | Normal 3-match costs 1 move; 4+/line clear nets 0 (−1+1) | | |
| 4.3 | At ≤6 moves, unfinished words drop more often | | |
| 4.4 | Out of moves → revive: 6 words ×2 hits, 3 misses = fail | | |
| 4.4a | If Revive appears before Review, its first timed target pauses and shows the same guided swap hand; completing it prevents the tutorial from repeating in Review | | |
| 4.5 | Every 3 cleared sets → mandatory review from a random mix of those 3 sets (not only the latest); leaving keeps 「待完成复习」 | | |
| 4.6 | Quiz skip confirms restart and does not count as cleared | | |
| 4.7 | No stamina → dead-machine sheet with Review CTA | | |

### 4b. Category mode (分类)

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 4.8 | Hidden until 3 adventure clears; after mandatory review, Learned guide/tour runs first; only after it completes does the hand point to the mode picker and then Category mode | | |
| 4.9 | Category list shows; picking one starts that pool | | |
| 4.9a | First Category entry recommends Tools and Home Items (🔧), not Emotional Expression | | |
| 4.10 | Board uses only emojis from selected category | | |
| 4.11 | Free play (no moves / stamina) | | |

### 4c. Review mode (复习)

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 4.12 | Hidden until 1 adventure clear | | |
| 4.13 | Timed-target banner (8s); only target clears count | | |
| 4.14 | Empty review pool shows CTA to Adventure | | |
| 4.15 | Quiz success advances Ebbinghaus stage; miss/timeout regresses | | |
| 4.15b | Voluntary / continue review prefers overdue & oldest lastReviewAt (not just-finished set) | | |
| 4.16 | Pending forced review banner + resume CTA when owed | | |

### 4d. Mode switching

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 4.17 | Switch adventure ↔ review ↔ category without crash | | |
| 4.18 |「换一组词」is free until you make a matching move (then −1 energy);「重排棋盘」is free | | |
| 4.19 | Leaving forced review mid-way keeps pending until a review quiz finishes | | |

---

## 5. Learned & word list tabs

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 5.1 | After the third-clear mandatory review, the hand points to Learned; first entry shows the 3-step collection, memory-shield, and review-timing tour | | |
| 5.2 | Tap learned word opens detail modal | | |
| 5.3 | Play pronunciation from modal | | |
| 5.4 | Words / Emoji tab browses full pool | | |
| 5.5 | Due-for-review indicators accurate | | |

---

## 6. Profile, auth & settings

| # | Test | Pass? | Notes |
|---|------|-------|-------|
| 6.1 | Profile shows guest name +「本地存档」badge | | |
| 6.2 |「登录 / 注册」opens sheet; Apple / Google / email work (Firebase enabled) | | |
| 6.3 | After sign-in: display name +「已登录」; progress syncs across devices | | |
| 6.4 |「删除账号」确认后无法再登录；云端进度清除 | | |
| 6.5 |「隐私政策」打开公网 HTTPS 页（或包内 privacy.html） | | |
| 6.6 | SFX toggle works immediately | | |
| 6.7 | BGM toggle works immediately | | |
| 6.8 | BGM ducks during word playback | | |
| 6.9 | Language switch (中 / EN / ES / FR / DE) updates UI | | |
| 6.10 | Stats (completed emojis) match gameplay | | |
| 6.11 | Version string visible in About | | |

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
| 11.3 | Display name「LingoMatch」correct | | |
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
