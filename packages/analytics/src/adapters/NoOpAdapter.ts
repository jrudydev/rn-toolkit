/**
 * NoOp Analytics Adapter
 *
 * A no-operation adapter that does nothing. Useful for:
 * - Testing without real analytics
 * - Development mode
 * - Environments where analytics is disabled
 */

import type { AnalyticsAdapter, EventParams, UserProperties, EcommerceItem } from '../types';

export class NoOpAdapter implements AnalyticsAdapter {
  readonly name = 'noop';

  async initialize(): Promise<void> {
    // No-op
  }

  async logEvent(_name: string, _params?: EventParams): Promise<void> {
    // No-op
  }

  async logScreenView(_screenName: string, _screenClass?: string): Promise<void> {
    // No-op
  }

  async setUserId(_userId: string | null): Promise<void> {
    // No-op
  }

  async setUserProperties(_properties: UserProperties): Promise<void> {
    // No-op
  }

  async setUserProperty(_name: string, _value: string | null): Promise<void> {
    // No-op
  }

  async setAnalyticsCollectionEnabled(_enabled: boolean): Promise<void> {
    // No-op
  }

  async resetAnalyticsData(): Promise<void> {
    // No-op
  }

  async getSessionId(): Promise<string | null> {
    return null;
  }

  async getAppInstanceId(): Promise<string | null> {
    return null;
  }

  async logAppOpen(): Promise<void> {
    // No-op
  }

  async logSignUp(_method: string): Promise<void> {
    // No-op
  }

  async logLogin(_method: string): Promise<void> {
    // No-op
  }

  async logShare(_contentType: string, _itemId: string, _method?: string): Promise<void> {
    // No-op
  }

  async logSearch(_searchTerm: string): Promise<void> {
    // No-op
  }

  async logSelectContent(_contentType: string, _itemId: string): Promise<void> {
    // No-op
  }

  async logPurchase(
    _value: number,
    _currency: string,
    _items: EcommerceItem[],
    _transactionId?: string
  ): Promise<void> {
    // No-op
  }

  async logAddToCart(_value: number, _currency: string, _items: EcommerceItem[]): Promise<void> {
    // No-op
  }

  async logBeginCheckout(
    _value: number,
    _currency: string,
    _items: EcommerceItem[]
  ): Promise<void> {
    // No-op
  }
}
