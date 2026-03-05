/**
 * SmartHeader Component
 *
 * A header component that integrates with deep linking navigation.
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
} from 'react-native';
import { useTheme } from '@rn-toolkit/theming';
import { useDeepLink } from '../hooks/useDeepLink';
import { useRoute } from '../hooks/useRoute';

/**
 * SmartHeader props
 */
export interface SmartHeaderProps {
  /** Title to display (overrides route name) */
  title?: string;
  /** Whether to show back button */
  showBackButton?: boolean;
  /** Custom back button icon */
  backIcon?: React.ReactNode;
  /** Right side actions */
  rightActions?: React.ReactNode;
  /** Left side actions (appears after back button) */
  leftActions?: React.ReactNode;
  /** Container style */
  style?: ViewStyle;
  /** Title style */
  titleStyle?: TextStyle;
  /** Callback when back is pressed */
  onBackPress?: () => void;
  /** Whether header is transparent */
  transparent?: boolean;
  /** Custom back button label */
  backLabel?: string;
  /** Show back label */
  showBackLabel?: boolean;
  /** Center title */
  centerTitle?: boolean;
}

/**
 * Default back arrow component
 */
function DefaultBackIcon({ color }: { color: string }) {
  return (
    <Text style={{ fontSize: 24, color, fontWeight: '300' }}>{'‹'}</Text>
  );
}

/**
 * SmartHeader component
 *
 * @example
 * ```tsx
 * import { SmartHeader } from '@rn-toolkit/deeplink';
 *
 * function ScreenHeader() {
 *   return (
 *     <SmartHeader
 *       title="Profile"
 *       rightActions={<SettingsButton />}
 *     />
 *   );
 * }
 * ```
 */
export function SmartHeader({
  title,
  showBackButton = true,
  backIcon,
  rightActions,
  leftActions,
  style,
  titleStyle,
  onBackPress,
  transparent = false,
  backLabel = 'Back',
  showBackLabel = false,
  centerTitle = true,
}: SmartHeaderProps) {
  const { colors, spacing } = useTheme();
  const { goBack, canGoBack } = useDeepLink();
  const { name } = useRoute();

  // Determine if back button should be shown
  const shouldShowBack = showBackButton && canGoBack;

  // Display title (prop takes precedence over route name)
  const displayTitle = title ?? name;

  // Handle back press
  const handleBackPress = () => {
    onBackPress?.();
    goBack();
  };

  // Styles
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: transparent ? 'transparent' : colors.surface,
          borderBottomWidth: transparent ? 0 : 1,
          borderBottomColor: colors.border,
          minHeight: 56,
          ...((style as object) || {}),
        },
        leftContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          flex: centerTitle ? 1 : 0,
        },
        centerContainer: {
          flex: centerTitle ? 2 : 1,
          alignItems: centerTitle ? 'center' : 'flex-start',
          paddingHorizontal: spacing.sm,
        },
        rightContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flex: centerTitle ? 1 : 0,
        },
        backButton: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: spacing.xs,
          paddingRight: spacing.sm,
          marginLeft: -spacing.xs,
        },
        backLabel: {
          fontSize: 16,
          color: colors.primary,
          marginLeft: spacing.xs,
        },
        title: {
          fontSize: 18,
          fontWeight: '600',
          color: colors.text,
          ...((titleStyle as object) || {}),
        },
      }),
    [colors, spacing, style, titleStyle, transparent, centerTitle]
  );

  return (
    <View style={styles.container} testID="smart-header">
      {/* Left side */}
      <View style={styles.leftContainer}>
        {shouldShowBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel={backLabel}
            testID="header-back-button"
          >
            {backIcon || <DefaultBackIcon color={colors.primary} />}
            {showBackLabel && (
              <Text style={styles.backLabel}>{backLabel}</Text>
            )}
          </TouchableOpacity>
        )}
        {leftActions}
      </View>

      {/* Center - Title */}
      <View style={styles.centerContainer}>
        {displayTitle && (
          <Text style={styles.title} numberOfLines={1} testID="header-title">
            {displayTitle}
          </Text>
        )}
      </View>

      {/* Right side */}
      <View style={styles.rightContainer}>{rightActions}</View>
    </View>
  );
}
