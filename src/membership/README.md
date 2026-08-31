# Membership integration status

## Implemented locally

- A seven-day, non-billing Plus experience starts after legal consent when the
  player first enters the game.
- Category mode requires three Adventure clears and active Plus access.
- The Learned tab requires active Plus access.
- Guests can use the trial. Selecting a paid plan requires account creation or
  sign-in first.
- Trial progress remains on the device when the guest signs in.
- The paywall accepts store-provided display-price strings.

## Do not ship paid checkout yet

`membershipOfferings.ts` contains development fallback prices and placeholder
product IDs. Before enabling purchases:

1. Finalize the app brand and bundle ID.
2. Finalize the App Store product IDs. Product IDs should be treated as
   permanent after products are created.
3. Create monthly and annual auto-renewable subscriptions in App Store Connect.
4. Connect StoreKit or RevenueCat.
5. Replace fallback `displayPrice` values with the localized price returned by
   the customer's storefront.
6. Implement purchase, restore, renewal, expiration, billing-retry, and refund
   handling.
7. Sync the guest trial to a trusted server when an account is created. Do not
   trust client-written trial timestamps for production entitlement checks.

The seven-day in-app experience is separate from an App Store introductory
offer: it does not ask for payment details and never auto-renews.
