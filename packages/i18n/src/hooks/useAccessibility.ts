/**
 * useAccessibility Hook
 *
 * Hook for accessibility features and screen reader support.
 */

import { useContext, useEffect, useState, useCallback } from 'react';
import { AccessibilityInfo } from 'react-native';
import { I18nContext } from '../I18nContext';
import type { AccessibilitySettings, AnnouncementPriority } from '../types';

export interface UseAccessibilityResult {
  /** Whether screen reader is enabled */
  isScreenReaderEnabled: boolean;
  /** Whether reduce motion is enabled */
  isReduceMotionEnabled: boolean;
  /** Whether bold text is enabled */
  isBoldTextEnabled: boolean;
  /** Current font scale */
  fontScale: number;
  /** Announce a message to screen readers */
  announce: (message: string, priority?: AnnouncementPriority) => void;
  /** Full accessibility settings */
  settings: AccessibilitySettings | null;
}

/**
 * Hook for accessibility features
 *
 * @returns Accessibility settings and functions
 *
 * @example
 * ```tsx
 * import { useAccessibility } from '@astacinco/rn-i18n';
 *
 * function AccessibleButton({ label, onPress }) {
 *   const { announce, isScreenReaderEnabled } = useAccessibility();
 *
 *   const handlePress = () => {
 *     onPress();
 *     if (isScreenReaderEnabled) {
 *       announce('Action completed successfully');
 *     }
 *   };
 *
 *   return (
 *     <Pressable
 *       onPress={handlePress}
 *       accessibilityLabel={label}
 *       accessibilityRole="button"
 *     >
 *       <Text>{label}</Text>
 *     </Pressable>
 *   );
 * }
 *
 * // Respect reduce motion preference
 * function AnimatedComponent() {
 *   const { isReduceMotionEnabled } = useAccessibility();
 *
 *   return (
 *     <Animated.View
 *       entering={isReduceMotionEnabled ? undefined : FadeIn}
 *     >
 *       <Content />
 *     </Animated.View>
 *   );
 * }
 *
 * // Adjust font sizes
 * function ScaledText({ children }) {
 *   const { fontScale } = useAccessibility();
 *   const baseFontSize = 16;
 *
 *   return (
 *     <Text style={{ fontSize: baseFontSize * fontScale }}>
 *       {children}
 *     </Text>
 *   );
 * }
 * ```
 */
export function useAccessibility(): UseAccessibilityResult {
  const context = useContext(I18nContext);

  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState(false);
  const [isBoldTextEnabled, setIsBoldTextEnabled] = useState(false);
  const [fontScale] = useState(1); // TODO: Add font scale listener when needed
  const [settings, setSettings] = useState<AccessibilitySettings | null>(null);

  // Listen for accessibility changes
  useEffect(() => {
    // Initial fetch
    const fetchSettings = async () => {
      const [screenReader, reduceMotion, boldText] = await Promise.all([
        AccessibilityInfo.isScreenReaderEnabled(),
        AccessibilityInfo.isReduceMotionEnabled(),
        AccessibilityInfo.isBoldTextEnabled(),
      ]);

      setIsScreenReaderEnabled(screenReader);
      setIsReduceMotionEnabled(reduceMotion);
      setIsBoldTextEnabled(boldText);

      setSettings({
        screenReaderEnabled: screenReader,
        reduceMotionEnabled: reduceMotion,
        boldTextEnabled: boldText,
        grayscaleEnabled: false,
        invertColorsEnabled: false,
        fontScale: 1,
      });
    };

    fetchSettings();

    // Subscribe to changes
    const screenReaderSubscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (enabled) => {
        setIsScreenReaderEnabled(enabled);
        setSettings((prev) => (prev ? { ...prev, screenReaderEnabled: enabled } : null));
      }
    );

    const reduceMotionSubscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        setIsReduceMotionEnabled(enabled);
        setSettings((prev) => (prev ? { ...prev, reduceMotionEnabled: enabled } : null));
      }
    );

    const boldTextSubscription = AccessibilityInfo.addEventListener(
      'boldTextChanged',
      (enabled) => {
        setIsBoldTextEnabled(enabled);
        setSettings((prev) => (prev ? { ...prev, boldTextEnabled: enabled } : null));
      }
    );

    return () => {
      screenReaderSubscription.remove();
      reduceMotionSubscription.remove();
      boldTextSubscription.remove();
    };
  }, []);

  // Announce message
  const announce = useCallback(
    (message: string, priority?: AnnouncementPriority): void => {
      context.announce(message, priority);
    },
    [context]
  );

  return {
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    isBoldTextEnabled,
    fontScale,
    announce,
    settings,
  };
}
