/**
 * Analytics Provider
 *
 * Provides analytics context with adapter pattern for swappable providers.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AnalyticsContext } from './AnalyticsContext';
import { NoOpAdapter } from './adapters/NoOpAdapter';
import type {
  AnalyticsAdapter,
  AnalyticsConfig,
  AnalyticsContextValue,
  EventParams,
  UserProperties,
  EcommerceItem,
} from './types';

export interface AnalyticsProviderProps {
  children: ReactNode;
  /** Analytics adapter (Firebase, Mixpanel, Console, etc.) */
  adapter: AnalyticsAdapter;
  /** Configuration options */
  config?: AnalyticsConfig;
}

export function AnalyticsProvider({
  children,
  adapter,
  config = {},
}: AnalyticsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);
  const adapterRef = useRef<AnalyticsAdapter>(adapter);
  const configRef = useRef<AnalyticsConfig>(config);

  // Update refs when props change
  useEffect(() => {
    adapterRef.current = adapter;
    configRef.current = config;
  }, [adapter, config]);

  // Initialize adapter
  useEffect(() => {
    const init = async () => {
      try {
        await adapterRef.current.initialize();
        if (configRef.current.debug) {
          console.log(`[Analytics] Initialized with ${adapterRef.current.name} adapter`);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('[Analytics] Failed to initialize:', error);
      }
    };
    init();
  }, []);

  // Helper to merge default params
  const mergeParams = useCallback((params?: EventParams): EventParams | undefined => {
    if (!configRef.current.defaultParams && !params) return undefined;
    return { ...configRef.current.defaultParams, ...params };
  }, []);

  // Helper for debug logging
  const debugLog = useCallback((type: string, data: Record<string, unknown>) => {
    if (configRef.current.debug && configRef.current.logToConsole) {
      console.log(`[Analytics] ${type}:`, data);
    }
  }, []);

  const logEvent = useCallback(async (name: string, params?: EventParams): Promise<void> => {
    if (!isEnabled) return;
    const mergedParams = mergeParams(params);
    debugLog('EVENT', { name, params: mergedParams });
    await adapterRef.current.logEvent(name, mergedParams);
  }, [isEnabled, mergeParams, debugLog]);

  const logScreenView = useCallback(async (screenName: string, screenClass?: string): Promise<void> => {
    if (!isEnabled) return;
    debugLog('SCREEN_VIEW', { screenName, screenClass });
    await adapterRef.current.logScreenView(screenName, screenClass);
  }, [isEnabled, debugLog]);

  const setUserId = useCallback(async (userId: string | null): Promise<void> => {
    debugLog('SET_USER_ID', { userId });
    await adapterRef.current.setUserId(userId);
  }, [debugLog]);

  const setUserProperties = useCallback(async (properties: UserProperties): Promise<void> => {
    debugLog('SET_USER_PROPERTIES', { properties });
    await adapterRef.current.setUserProperties(properties);
  }, [debugLog]);

  const setUserProperty = useCallback(async (name: string, value: string | null): Promise<void> => {
    debugLog('SET_USER_PROPERTY', { name, value });
    await adapterRef.current.setUserProperty(name, value);
  }, [debugLog]);

  const setEnabled = useCallback(async (enabled: boolean): Promise<void> => {
    setIsEnabled(enabled);
    debugLog('SET_ENABLED', { enabled });
    await adapterRef.current.setAnalyticsCollectionEnabled(enabled);
  }, [debugLog]);

  const reset = useCallback(async (): Promise<void> => {
    debugLog('RESET', {});
    await adapterRef.current.resetAnalyticsData();
  }, [debugLog]);

  const logAppOpen = useCallback(async (): Promise<void> => {
    if (!isEnabled) return;
    debugLog('APP_OPEN', {});
    await adapterRef.current.logAppOpen();
  }, [isEnabled, debugLog]);

  const logSignUp = useCallback(async (method: string): Promise<void> => {
    if (!isEnabled) return;
    debugLog('SIGN_UP', { method });
    await adapterRef.current.logSignUp(method);
  }, [isEnabled, debugLog]);

  const logLogin = useCallback(async (method: string): Promise<void> => {
    if (!isEnabled) return;
    debugLog('LOGIN', { method });
    await adapterRef.current.logLogin(method);
  }, [isEnabled, debugLog]);

  const logShare = useCallback(async (contentType: string, itemId: string, method?: string): Promise<void> => {
    if (!isEnabled) return;
    debugLog('SHARE', { contentType, itemId, method });
    await adapterRef.current.logShare(contentType, itemId, method);
  }, [isEnabled, debugLog]);

  const logSearch = useCallback(async (searchTerm: string): Promise<void> => {
    if (!isEnabled) return;
    debugLog('SEARCH', { searchTerm });
    await adapterRef.current.logSearch(searchTerm);
  }, [isEnabled, debugLog]);

  const logSelectContent = useCallback(async (contentType: string, itemId: string): Promise<void> => {
    if (!isEnabled) return;
    debugLog('SELECT_CONTENT', { contentType, itemId });
    await adapterRef.current.logSelectContent(contentType, itemId);
  }, [isEnabled, debugLog]);

  const logPurchase = useCallback(async (
    value: number,
    currency: string,
    items: EcommerceItem[],
    transactionId?: string
  ): Promise<void> => {
    if (!isEnabled) return;
    debugLog('PURCHASE', { value, currency, items, transactionId });
    await adapterRef.current.logPurchase(value, currency, items, transactionId);
  }, [isEnabled, debugLog]);

  const logAddToCart = useCallback(async (
    value: number,
    currency: string,
    items: EcommerceItem[]
  ): Promise<void> => {
    if (!isEnabled) return;
    debugLog('ADD_TO_CART', { value, currency, items });
    await adapterRef.current.logAddToCart(value, currency, items);
  }, [isEnabled, debugLog]);

  const logBeginCheckout = useCallback(async (
    value: number,
    currency: string,
    items: EcommerceItem[]
  ): Promise<void> => {
    if (!isEnabled) return;
    debugLog('BEGIN_CHECKOUT', { value, currency, items });
    await adapterRef.current.logBeginCheckout(value, currency, items);
  }, [isEnabled, debugLog]);

  const contextValue = useMemo<AnalyticsContextValue>(() => ({
    isInitialized,
    isEnabled,
    adapterName: adapterRef.current.name,
    logEvent,
    logScreenView,
    setUserId,
    setUserProperties,
    setUserProperty,
    setEnabled,
    reset,
    logAppOpen,
    logSignUp,
    logLogin,
    logShare,
    logSearch,
    logSelectContent,
    logPurchase,
    logAddToCart,
    logBeginCheckout,
  }), [
    isInitialized,
    isEnabled,
    logEvent,
    logScreenView,
    setUserId,
    setUserProperties,
    setUserProperty,
    setEnabled,
    reset,
    logAppOpen,
    logSignUp,
    logLogin,
    logShare,
    logSearch,
    logSelectContent,
    logPurchase,
    logAddToCart,
    logBeginCheckout,
  ]);

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
}
