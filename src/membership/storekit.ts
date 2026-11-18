import { Capacitor, registerPlugin, type PluginListenerHandle } from '@capacitor/core';

type StoreProduct = { id: string; displayPrice: string; displayName: string };
type StoreProducts = { products: StoreProduct[] };
type StoreEntitlements = { productIds: string[] };
type StorePurchase = StoreEntitlements & { status: 'purchased' | 'pending' | 'cancelled' };

type StorePlugin = {
  products(options: { productIds: string[] }): Promise<StoreProducts>;
  entitlements(): Promise<StoreEntitlements>;
  purchase(options: { productId: string }): Promise<StorePurchase>;
  restore(): Promise<StoreEntitlements>;
  addListener(eventName: 'entitlementsChanged', listener: () => void): Promise<PluginListenerHandle>;
};

const plugin = registerPlugin<StorePlugin>('LingoMatchStore');

export const storeProductIds = {
  lifetime: (import.meta.env.VITE_PLUS_LIFETIME_PRODUCT_ID || '').trim(),
};

export function isStoreKitReady(): boolean {
  return Capacitor.getPlatform() === 'ios' &&
    Boolean(storeProductIds.lifetime);
}

export async function loadStoreProducts(): Promise<StoreProduct[]> {
  if (!isStoreKitReady()) return [];
  const result = await plugin.products({ productIds: Object.values(storeProductIds) });
  return result.products;
}

export async function loadStoreEntitlements(): Promise<string[]> {
  if (!isStoreKitReady()) return [];
  return (await plugin.entitlements()).productIds;
}

export async function buyStoreProduct(productId: string): Promise<StorePurchase> {
  if (!isStoreKitReady() || !Object.values(storeProductIds).includes(productId)) {
    throw new Error('store-not-configured');
  }
  return plugin.purchase({ productId });
}

export async function restoreStorePurchases(): Promise<string[]> {
  if (!isStoreKitReady()) throw new Error('store-not-configured');
  return (await plugin.restore()).productIds;
}

export async function listenForStoreChanges(listener: () => void): Promise<PluginListenerHandle | null> {
  if (!isStoreKitReady()) return null;
  return plugin.addListener('entitlementsChanged', listener);
}
