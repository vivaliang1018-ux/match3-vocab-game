export type MembershipPlan = 'monthly' | 'annual';

export type MembershipOffering = {
  plan: MembershipPlan;
  /** Final IDs are configured before the App Store products are created. */
  productId: string;
  /** StoreKit/RevenueCat replaces this fallback with the storefront price. */
  displayPrice: string;
};

export type MembershipOfferings = Record<MembershipPlan, MembershipOffering>;

/**
 * Development fallback only. Production purchase integration must replace
 * displayPrice with the store-returned localized price string.
 */
export const FALLBACK_MEMBERSHIP_OFFERINGS: MembershipOfferings = {
  monthly: {
    plan: 'monthly',
    productId: 'plus_monthly_placeholder',
    displayPrice: 'US$2.99',
  },
  annual: {
    plan: 'annual',
    productId: 'plus_annual_placeholder',
    displayPrice: 'US$19.99',
  },
};
