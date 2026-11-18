import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdmobConsentStatus,
  MaxAdContentRating,
} from '@capacitor-community/admob';

const IOS_REWARDED_TEST_AD_UNIT_ID = 'ca-app-pub-3940256099942544/1712485313';

let initialization: Promise<void> | null = null;

function productionAdUnitId(): string {
  return import.meta.env.VITE_ADMOB_REWARDED_AD_UNIT_ID?.trim() ?? '';
}

export function rewardedAdsTestMode(): boolean {
  return import.meta.env.DEV || productionAdUnitId() === IOS_REWARDED_TEST_AD_UNIT_ID;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, stage: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeout = window.setTimeout(
      () => reject(new Error(`rewarded-ad-${stage}-timeout`)),
      timeoutMs,
    );
    promise.then(
      (value) => {
        window.clearTimeout(timeout);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(timeout);
        reject(error);
      },
    );
  });
}

export function rewardedAdsSupported(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios' &&
    (import.meta.env.DEV || productionAdUnitId().length > 0);
}

async function initializeRewardedAds(): Promise<void> {
  if (!initialization) {
    initialization = (async () => {
      await AdMob.initialize({
        initializeForTesting: rewardedAdsTestMode(),
        maxAdContentRating: MaxAdContentRating.General,
      });

      // Google's demo rewarded unit is used only in local QA builds. Skipping
      // the remote UMP refresh here lets developers verify the SDK/load/reward
      // chain on networks where the UMP endpoint is unavailable. Production
      // ad units always run the consent flow below before requesting an ad.
      if (rewardedAdsTestMode()) return;

      let consent = await withTimeout(AdMob.requestConsentInfo(), 15_000, 'consent');
      if (
        consent.status === AdmobConsentStatus.REQUIRED &&
        consent.isConsentFormAvailable
      ) {
        consent = await withTimeout(AdMob.showConsentForm(), 60_000, 'consent-form');
      }
      if (!consent.canRequestAds) throw new Error('ad-consent-required');
    })().catch((error) => {
      initialization = null;
      throw error;
    });
  }
  return initialization;
}

export async function adPrivacyOptionsRequired(): Promise<boolean> {
  if (!rewardedAdsSupported()) return false;
  try {
    await AdMob.initialize({
      initializeForTesting: rewardedAdsTestMode(),
      maxAdContentRating: MaxAdContentRating.General,
    });
    const consent = await AdMob.requestConsentInfo();
    // The plugin types include this enum but v8.1.0 does not re-export it.
    return String(consent.privacyOptionsRequirementStatus) === 'REQUIRED';
  } catch {
    return false;
  }
}

export async function showAdPrivacyOptions(): Promise<void> {
  if (!rewardedAdsSupported()) throw new Error('ad-privacy-options-unavailable');
  await AdMob.initialize({
    initializeForTesting: rewardedAdsTestMode(),
    maxAdContentRating: MaxAdContentRating.General,
  });
  await AdMob.requestConsentInfo();
  await AdMob.showPrivacyOptionsForm();
  // Consent may have changed, so re-evaluate it before the next ad request.
  initialization = null;
}

/** Resolves only after Google reports that the user earned the reward. */
export async function showStaminaRewardedAd(): Promise<void> {
  if (!rewardedAdsSupported()) throw new Error('rewarded-ads-unavailable');
  await initializeRewardedAds();

  const adId = import.meta.env.DEV
    ? IOS_REWARDED_TEST_AD_UNIT_ID
    : productionAdUnitId();
  const loaded = await withTimeout(
    AdMob.prepareRewardVideoAd({
      adId,
      isTesting: rewardedAdsTestMode(),
      // LingoMatch intentionally does not request personalized ads or ATT access.
      npa: true,
    }),
    20_000,
    'load',
  );
  await withTimeout(
    AdMob.showRewardVideoAd({ adId: loaded.adUnitId }),
    120_000,
    'reward',
  );
}
