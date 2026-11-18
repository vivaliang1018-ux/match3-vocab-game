export type MembershipPlan = 'lifetime';

export type MembershipOffering = {
  plan: MembershipPlan;
  /** App Store Connect Product ID, configured at build time. */
  productId: string;
  /** Always replaced by StoreKit's localized storefront price before checkout. */
  displayPrice: string;
};

export type MembershipOfferings = Record<MembershipPlan, MembershipOffering>;

/**
 * No guessed prices: StoreKit must provide a real localized price before checkout.
 */
export const FALLBACK_MEMBERSHIP_OFFERINGS: MembershipOfferings = {
  lifetime: {
    plan: 'lifetime',
    productId: '',
    displayPrice: '—',
  },
};
