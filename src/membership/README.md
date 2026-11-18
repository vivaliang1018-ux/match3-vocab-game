# Membership and daily limits

- Free accounts have three shared stamina across courses and board modes. A Say & Blast run restores one stamina only when the player survives the full 60 seconds and earns three stars with at least 70% accuracy; there is no minimum target count. Rewarded ads reset stamina to 3, up to twice per local calendar day. Unfinished Adventure, Category, and Mood boards resume without a second charge.
- Mood Board allows one start per day for free accounts and three for Plus. These are shared across courses; a free Mood start also spends one stamina.
- On iOS, StoreKit 2 loads one non-consumable lifetime product, purchases it once, restores it, and refreshes verified current entitlements. Its public App Store Connect product ID is configured in `.env.production`; release builds must include that file or provide an equivalent build-environment value. The Plus panel offers Restore Purchase even if the product catalog fails to load; checkout and price remain hidden until the product loads. Entitlements refresh independently of catalog loading.
- The development plan override and local seven-day trial are not available in production. The prototype trial is separate from an App Store introductory offer and does not auto-renew.
- Cross-device daily quota is opt-in with `VITE_CLOUD_DAILY_QUOTA=1`, a signed-in Firebase account, and deployed `firestore.rules`. Local quota is account-scoped; guest usage is claimed by the next signed-in account once. The Firestore transaction is authoritative after its daily document exists; the first document seeds from that account's local usage. On sync failure, a cloud-enabled board charge or Say & Blast reward does not silently fall back to local usage. Say & Blast shows a retry action.

## Before enabling paid checkout or cross-device quotas

Use the scenario matrix in `docs/membership-launch-qa.md` for Sandbox/TestFlight verification.

1. Create the lifetime Plus item in App Store Connect as a **Non-Consumable** with product ID `com.matchingo.game.plus.lifetime`. Set the U.S. storefront price to **US$9.99**. Do not advertise a later price until a real price-change date has been scheduled. Apple supplies the corresponding localized prices for other storefronts.
2. Deploy and verify the Firestore rules, then enable `VITE_CLOUD_DAILY_QUOTA=1` for the signed-in build.
3. Test purchase, restore, refund/revocation, and reinstall in App Store Sandbox/TestFlight, plus quota use on two devices and account switching.
4. Use a trusted backend for abuse-resistant cross-device quotas and entitlement validation. Current owner-writable rules support normal clients, not a tamper-proof paid limit. The daily key follows each device's local time zone; travel across time zones needs a product policy before strict enforcement.
5. Decide whether the seven-day local trial should be replaced by an account-scoped trial before a paid launch.
