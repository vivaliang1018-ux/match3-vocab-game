# Plus and daily-limit launch QA

This is a release gate, not a claim that live billing or Firestore quotas have been verified.

## Configuration to supply

- One App Store Connect **Non-Consumable** product with ID `com.matchingo.game.plus.lifetime`. Its public ID is in `.env.production`; confirm the archive build uses that file or an equivalent build-environment value. Set the U.S. storefront price to **US$9.99** and let App Store Connect calculate localized storefront prices. Do not advertise a later price until a real price-change date has been scheduled. Do not put account credentials or API keys in source control.
- Deploy the reviewed `firestore.rules` to the intended Firebase project, then set `VITE_CLOUD_DAILY_QUOTA=1` for the signed-in build. Do not enable the flag before rules are deployed.
- Confirm the Terms of Use and Privacy Policy URLs shown on the purchase sheet are the intended public pages.

## Sandbox / TestFlight purchase matrix

| Scenario | Expected result |
| --- | --- |
| Lifetime product catalog loads | One buyout option displays the localized App Store price; no placeholder price appears. |
| Product catalog fails or device is offline | Purchase choices are hidden; Restore Purchases remains available and existing verified entitlement is checked independently. |
| Lifetime purchase succeeds | Plus access appears and the free stamina limit no longer blocks new boards. |
| Purchase cancelled or pending approval | No Plus access is granted until StoreKit reports a verified current entitlement. |
| App restart, reinstall, refund or revocation | Access follows the verified current entitlement, including after a foreground refresh. |
| Restore on another device using the same Apple Account | Plus returns without a second purchase. |
| Restore without a prior purchase | Clear empty-result message; no Plus access. |

## Daily-limit matrix

| Scenario | Expected result |
| --- | --- |
| Free player switches between courses and Adventure / Category | Three shared stamina, charged only on the first valid match of each new board. |
| Free player earns three stars in Say & Blast with stamina below 3 | Three stars require surviving 60 seconds with at least 70% accuracy; there is no minimum target count. One stamina is restored, up to 3/3. |
| Free player completes a rewarded ad | Stamina resets to 3; a third reset on the same day is refused. |
| Free Mood Board | One start per day across courses, consuming a board entry. |
| Plus Mood Board | Three starts per day across courses; no free board-entry charge. |
| Leave and resume an unfinished Adventure / Category / Mood board | Same board returns without a second charge. |
| Two signed-in devices spend or earn at nearly the same time | Firestore transaction preserves a single account-wide total; neither device exceeds limits. |
| Offline during first board charge | Board does not begin without a confirmed cloud charge; an error is shown. |
| Offline after a qualifying three-star Say & Blast result | Score shows immediately, reward reports sync failure, and Retry can claim it once. |
| Sign out, play as guest, then sign in | Guest local usage is claimed once by that account; a different account's local quota is isolated. |
| Delete account | Account-local stamina and Mood usage are removed, and cloud quota documents are removed when cloud quota is enabled. |

## Outstanding release decisions

- The present Firestore rules are owner-writable. They prevent ordinary client races but are not tamper-proof; a trusted backend is needed for abuse-resistant paid entitlement and quota enforcement.
- Daily reset uses each device's local calendar day. Define a stable account time zone or server-day policy before promising identical reset time while travelling.
- Confirm whether free players should see locked Plus modes before live products are available. Do not ship a build that blocks features without an obtainable purchase path.
- Google AdMob rewarded ads are configured with the production iOS App ID and rewarded unit ID. Development builds use Google's official test unit. Verify a physical-device TestFlight run, UMP consent messaging, payment profile, and app-ads.txt before release. Grant stamina only from the provider's verified reward callback; never from button tap or ad-open events.
