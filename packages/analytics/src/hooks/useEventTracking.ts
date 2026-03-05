/**
 * useEventTracking Hook
 *
 * Hook for creating pre-configured event trackers.
 */

import { useCallback, useMemo } from 'react';
import { useAnalytics } from './useAnalytics';
import type { EventParams } from '../types';

export interface UseEventTrackingOptions {
  /** Event name prefix */
  prefix?: string;
  /** Default parameters to include with all events */
  defaultParams?: EventParams;
}

export interface EventTracker {
  /** Track a custom event */
  track: (name: string, params?: EventParams) => Promise<void>;
  /** Track a button press */
  trackButtonPress: (buttonName: string, params?: EventParams) => Promise<void>;
  /** Track a link click */
  trackLinkClick: (linkUrl: string, params?: EventParams) => Promise<void>;
  /** Track a form submission */
  trackFormSubmit: (formName: string, params?: EventParams) => Promise<void>;
  /** Track an error */
  trackError: (errorMessage: string, errorCode?: string, params?: EventParams) => Promise<void>;
  /** Track a timing event */
  trackTiming: (category: string, variable: string, timeMs: number, params?: EventParams) => Promise<void>;
}

/**
 * Hook to create pre-configured event trackers
 *
 * @param options - Event tracking options
 * @returns Event tracker object
 *
 * @example
 * ```tsx
 * import { useEventTracking } from '@rn-toolkit/analytics';
 *
 * function MyComponent() {
 *   const { trackButtonPress, trackError } = useEventTracking({
 *     prefix: 'home_screen',
 *     defaultParams: { component: 'HomeScreen' },
 *   });
 *
 *   const handleSubmit = async () => {
 *     try {
 *       await submitForm();
 *       trackButtonPress('submit');
 *     } catch (error) {
 *       trackError(error.message, 'SUBMIT_ERROR');
 *     }
 *   };
 *
 *   return <Button onPress={handleSubmit} title="Submit" />;
 * }
 * ```
 */
export function useEventTracking(options: UseEventTrackingOptions = {}): EventTracker {
  const { logEvent } = useAnalytics();
  const { prefix, defaultParams } = options;

  const mergeParams = useCallback((params?: EventParams): EventParams => {
    return { ...defaultParams, ...params };
  }, [defaultParams]);

  const formatName = useCallback((name: string): string => {
    return prefix ? `${prefix}_${name}` : name;
  }, [prefix]);

  const track = useCallback(async (name: string, params?: EventParams): Promise<void> => {
    await logEvent(formatName(name), mergeParams(params));
  }, [logEvent, formatName, mergeParams]);

  const trackButtonPress = useCallback(async (buttonName: string, params?: EventParams): Promise<void> => {
    await logEvent(formatName('button_press'), mergeParams({
      button_name: buttonName,
      ...params,
    }));
  }, [logEvent, formatName, mergeParams]);

  const trackLinkClick = useCallback(async (linkUrl: string, params?: EventParams): Promise<void> => {
    await logEvent(formatName('link_click'), mergeParams({
      link_url: linkUrl,
      ...params,
    }));
  }, [logEvent, formatName, mergeParams]);

  const trackFormSubmit = useCallback(async (formName: string, params?: EventParams): Promise<void> => {
    await logEvent(formatName('form_submit'), mergeParams({
      form_name: formName,
      ...params,
    }));
  }, [logEvent, formatName, mergeParams]);

  const trackError = useCallback(async (
    errorMessage: string,
    errorCode?: string,
    params?: EventParams
  ): Promise<void> => {
    await logEvent(formatName('error'), mergeParams({
      error_message: errorMessage,
      error_code: errorCode,
      ...params,
    }));
  }, [logEvent, formatName, mergeParams]);

  const trackTiming = useCallback(async (
    category: string,
    variable: string,
    timeMs: number,
    params?: EventParams
  ): Promise<void> => {
    await logEvent(formatName('timing'), mergeParams({
      timing_category: category,
      timing_variable: variable,
      timing_value: timeMs,
      ...params,
    }));
  }, [logEvent, formatName, mergeParams]);

  return useMemo(() => ({
    track,
    trackButtonPress,
    trackLinkClick,
    trackFormSubmit,
    trackError,
    trackTiming,
  }), [track, trackButtonPress, trackLinkClick, trackFormSubmit, trackError, trackTiming]);
}
