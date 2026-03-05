/**
 * Firebase Analytics Adapter
 *
 * Adapter for Firebase Analytics (@react-native-firebase/analytics).
 * Requires @react-native-firebase/app and @react-native-firebase/analytics
 * as peer dependencies.
 *
 * @example
 * ```typescript
 * import { FirebaseAdapter } from '@rn-toolkit/analytics';
 *
 * <AnalyticsProvider adapter={new FirebaseAdapter()}>
 *   <App />
 * </AnalyticsProvider>
 * ```
 */

import type { AnalyticsAdapter, EventParams, UserProperties, EcommerceItem } from '../types';

// Firebase Analytics types (optional peer dependency)
type FirebaseAnalyticsModule = {
  logEvent: (name: string, params?: Record<string, unknown>) => Promise<void>;
  logScreenView: (params: { screen_name: string; screen_class?: string }) => Promise<void>;
  setUserId: (id: string | null) => Promise<void>;
  setUserProperties: (properties: Record<string, string | null>) => Promise<void>;
  setUserProperty: (name: string, value: string | null) => Promise<void>;
  setAnalyticsCollectionEnabled: (enabled: boolean) => Promise<void>;
  resetAnalyticsData: () => Promise<void>;
  getSessionId: () => Promise<number | null>;
  getAppInstanceId: () => Promise<string | null>;
  logAppOpen: () => Promise<void>;
  logSignUp: (params: { method: string }) => Promise<void>;
  logLogin: (params: { method: string }) => Promise<void>;
  logShare: (params: { content_type: string; item_id: string; method?: string }) => Promise<void>;
  logSearch: (params: { search_term: string }) => Promise<void>;
  logSelectContent: (params: { content_type: string; item_id: string }) => Promise<void>;
  logPurchase: (params: {
    value: number;
    currency: string;
    items: Array<Record<string, unknown>>;
    transaction_id?: string;
  }) => Promise<void>;
  logAddToCart: (params: {
    value: number;
    currency: string;
    items: Array<Record<string, unknown>>;
  }) => Promise<void>;
  logBeginCheckout: (params: {
    value: number;
    currency: string;
    items: Array<Record<string, unknown>>;
  }) => Promise<void>;
};

export class FirebaseAdapter implements AnalyticsAdapter {
  readonly name = 'firebase';
  private analytics: FirebaseAnalyticsModule | null = null;

  private getAnalytics(): FirebaseAnalyticsModule | null {
    if (this.analytics) return this.analytics;
    try {
      // Dynamic import to avoid hard dependency
      const firebaseAnalytics = require('@react-native-firebase/analytics').default;
      this.analytics = firebaseAnalytics();
      return this.analytics;
    } catch {
      console.warn(
        '[@rn-toolkit/analytics] Firebase Analytics not available. ' +
          'Install @react-native-firebase/analytics to use this adapter.'
      );
      return null;
    }
  }

  private toFirebaseItem(item: EcommerceItem): Record<string, unknown> {
    return {
      item_id: item.itemId,
      item_name: item.itemName,
      item_category: item.itemCategory,
      item_brand: item.itemBrand,
      item_variant: item.itemVariant,
      price: item.price,
      quantity: item.quantity,
      currency: item.currency,
    };
  }

  async initialize(): Promise<void> {
    this.getAnalytics();
  }

  async logEvent(name: string, params?: EventParams): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.logEvent(name, params as Record<string, unknown>);
  }

  async logScreenView(screenName: string, screenClass?: string): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.logScreenView({
      screen_name: screenName,
      screen_class: screenClass,
    });
  }

  async setUserId(userId: string | null): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.setUserId(userId);
  }

  async setUserProperties(properties: UserProperties): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    const stringProperties: Record<string, string | null> = {};
    for (const [key, value] of Object.entries(properties)) {
      stringProperties[key] = value === null ? null : String(value);
    }
    await analytics.setUserProperties(stringProperties);
  }

  async setUserProperty(name: string, value: string | null): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.setUserProperty(name, value);
  }

  async setAnalyticsCollectionEnabled(enabled: boolean): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.setAnalyticsCollectionEnabled(enabled);
  }

  async resetAnalyticsData(): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.resetAnalyticsData();
  }

  async getSessionId(): Promise<string | null> {
    const analytics = this.getAnalytics();
    if (!analytics) return null;
    const sessionId = await analytics.getSessionId();
    return sessionId ? String(sessionId) : null;
  }

  async getAppInstanceId(): Promise<string | null> {
    const analytics = this.getAnalytics();
    if (!analytics) return null;
    return await analytics.getAppInstanceId();
  }

  async logAppOpen(): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.logAppOpen();
  }

  async logSignUp(method: string): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.logSignUp({ method });
  }

  async logLogin(method: string): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.logLogin({ method });
  }

  async logShare(contentType: string, itemId: string, method?: string): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.logShare({
      content_type: contentType,
      item_id: itemId,
      method,
    });
  }

  async logSearch(searchTerm: string): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.logSearch({ search_term: searchTerm });
  }

  async logSelectContent(contentType: string, itemId: string): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.logSelectContent({
      content_type: contentType,
      item_id: itemId,
    });
  }

  async logPurchase(
    value: number,
    currency: string,
    items: EcommerceItem[],
    transactionId?: string
  ): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.logPurchase({
      value,
      currency,
      items: items.map(this.toFirebaseItem),
      transaction_id: transactionId,
    });
  }

  async logAddToCart(value: number, currency: string, items: EcommerceItem[]): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.logAddToCart({
      value,
      currency,
      items: items.map(this.toFirebaseItem),
    });
  }

  async logBeginCheckout(value: number, currency: string, items: EcommerceItem[]): Promise<void> {
    const analytics = this.getAnalytics();
    if (!analytics) return;
    await analytics.logBeginCheckout({
      value,
      currency,
      items: items.map(this.toFirebaseItem),
    });
  }
}
