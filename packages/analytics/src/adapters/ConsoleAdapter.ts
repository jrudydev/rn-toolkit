/**
 * Console Analytics Adapter
 *
 * Logs all analytics events to the console. Useful for:
 * - Development and debugging
 * - Testing event flow
 * - Environments without real analytics
 */

import type { AnalyticsAdapter, EventParams, UserProperties, EcommerceItem } from '../types';

export interface ConsoleAdapterOptions {
  /** Prefix for console logs */
  prefix?: string;
  /** Whether to include timestamps */
  timestamps?: boolean;
  /** Whether to use colors (console.log styling) */
  colors?: boolean;
}

export class ConsoleAdapter implements AnalyticsAdapter {
  readonly name = 'console';
  private prefix: string;
  private timestamps: boolean;
  private userId: string | null = null;
  private userProperties: UserProperties = {};

  constructor(options: ConsoleAdapterOptions = {}) {
    this.prefix = options.prefix ?? '[Analytics]';
    this.timestamps = options.timestamps ?? true;
  }

  private log(type: string, data: Record<string, unknown>): void {
    const timestamp = this.timestamps ? new Date().toISOString() : '';
    const prefix = this.timestamps ? `${this.prefix} ${timestamp}` : this.prefix;
    console.log(`${prefix} ${type}:`, data);
  }

  async initialize(): Promise<void> {
    this.log('INIT', { adapter: this.name });
  }

  async logEvent(name: string, params?: EventParams): Promise<void> {
    this.log('EVENT', { name, params, userId: this.userId });
  }

  async logScreenView(screenName: string, screenClass?: string): Promise<void> {
    this.log('SCREEN_VIEW', { screenName, screenClass, userId: this.userId });
  }

  async setUserId(userId: string | null): Promise<void> {
    this.userId = userId;
    this.log('SET_USER_ID', { userId });
  }

  async setUserProperties(properties: UserProperties): Promise<void> {
    this.userProperties = { ...this.userProperties, ...properties };
    this.log('SET_USER_PROPERTIES', { properties, all: this.userProperties });
  }

  async setUserProperty(name: string, value: string | null): Promise<void> {
    if (value === null) {
      delete this.userProperties[name];
    } else {
      this.userProperties[name] = value;
    }
    this.log('SET_USER_PROPERTY', { name, value });
  }

  async setAnalyticsCollectionEnabled(enabled: boolean): Promise<void> {
    this.log('SET_COLLECTION_ENABLED', { enabled });
  }

  async resetAnalyticsData(): Promise<void> {
    this.userId = null;
    this.userProperties = {};
    this.log('RESET', {});
  }

  async getSessionId(): Promise<string | null> {
    return `console-session-${Date.now()}`;
  }

  async getAppInstanceId(): Promise<string | null> {
    return `console-instance-${Date.now()}`;
  }

  async logAppOpen(): Promise<void> {
    this.log('APP_OPEN', { userId: this.userId });
  }

  async logSignUp(method: string): Promise<void> {
    this.log('SIGN_UP', { method, userId: this.userId });
  }

  async logLogin(method: string): Promise<void> {
    this.log('LOGIN', { method, userId: this.userId });
  }

  async logShare(contentType: string, itemId: string, method?: string): Promise<void> {
    this.log('SHARE', { contentType, itemId, method, userId: this.userId });
  }

  async logSearch(searchTerm: string): Promise<void> {
    this.log('SEARCH', { searchTerm, userId: this.userId });
  }

  async logSelectContent(contentType: string, itemId: string): Promise<void> {
    this.log('SELECT_CONTENT', { contentType, itemId, userId: this.userId });
  }

  async logPurchase(
    value: number,
    currency: string,
    items: EcommerceItem[],
    transactionId?: string
  ): Promise<void> {
    this.log('PURCHASE', { value, currency, items, transactionId, userId: this.userId });
  }

  async logAddToCart(value: number, currency: string, items: EcommerceItem[]): Promise<void> {
    this.log('ADD_TO_CART', { value, currency, items, userId: this.userId });
  }

  async logBeginCheckout(value: number, currency: string, items: EcommerceItem[]): Promise<void> {
    this.log('BEGIN_CHECKOUT', { value, currency, items, userId: this.userId });
  }
}
