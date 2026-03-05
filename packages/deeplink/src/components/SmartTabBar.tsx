/**
 * SmartTabBar Component
 *
 * A tab bar component that integrates with deep linking and badge counts.
 */

import React, { useCallback, useMemo } from 'react';
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
import { useAllBadges } from '../hooks/useBadgeCount';
import type { RouteParams } from '../types';

/**
 * Tab definition
 */
export interface TabDefinition<P extends RouteParams = RouteParams> {
  /** Route ID to navigate to */
  routeId: string;
  /** Tab label */
  label: string;
  /** Icon component or render function */
  icon?: React.ReactNode | ((active: boolean, color: string) => React.ReactNode);
  /** Route params */
  params?: P;
  /** Whether to show badge */
  showBadge?: boolean;
  /** Custom badge color */
  badgeColor?: string;
  /** Test ID */
  testID?: string;
}

/**
 * SmartTabBar props
 */
export interface SmartTabBarProps {
  /** Tab definitions */
  tabs: TabDefinition[];
  /** Container style */
  style?: ViewStyle;
  /** Tab style */
  tabStyle?: ViewStyle;
  /** Active tab style */
  activeTabStyle?: ViewStyle;
  /** Label style */
  labelStyle?: TextStyle;
  /** Active label style */
  activeLabelStyle?: TextStyle;
  /** Badge style */
  badgeStyle?: ViewStyle;
  /** Badge text style */
  badgeTextStyle?: TextStyle;
  /** Whether to show labels */
  showLabels?: boolean;
  /** Maximum badge count to display */
  maxBadgeCount?: number;
  /** Callback when tab is pressed */
  onTabPress?: (routeId: string) => void;
}

/**
 * SmartTabBar component
 *
 * @example
 * ```tsx
 * import { SmartTabBar } from '@rn-toolkit/deeplink';
 *
 * const tabs = [
 *   { routeId: 'home', label: 'Home', icon: <HomeIcon /> },
 *   { routeId: 'notifications', label: 'Alerts', showBadge: true },
 *   { routeId: 'profile', label: 'Profile' },
 * ];
 *
 * function TabBar() {
 *   return <SmartTabBar tabs={tabs} />;
 * }
 * ```
 */
export function SmartTabBar({
  tabs,
  style,
  tabStyle,
  activeTabStyle,
  labelStyle,
  activeLabelStyle,
  badgeStyle,
  badgeTextStyle,
  showLabels = true,
  maxBadgeCount = 99,
  onTabPress,
}: SmartTabBarProps) {
  const { colors, spacing } = useTheme();
  const { navigate, currentRoute, registry } = useDeepLink();
  const { badges } = useAllBadges();

  // Check if a tab is active
  const isTabActive = useCallback(
    (routeId: string): boolean => {
      if (!currentRoute) return false;
      const definition = registry.get(routeId);
      if (!definition) return false;
      return currentRoute.pattern === definition.path;
    },
    [currentRoute, registry]
  );

  // Handle tab press
  const handleTabPress = useCallback(
    (tab: TabDefinition) => {
      onTabPress?.(tab.routeId);
      navigate(tab.routeId, tab.params);
    },
    [navigate, onTabPress]
  );

  // Format badge count
  const formatBadgeCount = useCallback(
    (count: number): string => {
      return count > maxBadgeCount ? `${maxBadgeCount}+` : String(count);
    },
    [maxBadgeCount]
  );

  // Styles
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flexDirection: 'row',
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingBottom: spacing.sm,
          ...((style as object) || {}),
        },
        tab: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.xs,
          ...((tabStyle as object) || {}),
        },
        activeTab: {
          ...((activeTabStyle as object) || {}),
        },
        iconContainer: {
          position: 'relative',
          marginBottom: showLabels ? spacing.xs : 0,
        },
        label: {
          fontSize: 12,
          color: colors.textSecondary,
          ...((labelStyle as object) || {}),
        },
        activeLabel: {
          color: colors.primary,
          fontWeight: '600',
          ...((activeLabelStyle as object) || {}),
        },
        badge: {
          position: 'absolute',
          top: -4,
          right: -8,
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          backgroundColor: colors.error,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 4,
          ...((badgeStyle as object) || {}),
        },
        badgeText: {
          fontSize: 10,
          fontWeight: '700',
          color: colors.onError,
          ...((badgeTextStyle as object) || {}),
        },
      }),
    [
      colors,
      spacing,
      style,
      tabStyle,
      activeTabStyle,
      labelStyle,
      activeLabelStyle,
      badgeStyle,
      badgeTextStyle,
      showLabels,
    ]
  );

  return (
    <View style={styles.container} testID="smart-tab-bar">
      {tabs.map((tab) => {
        const isActive = isTabActive(tab.routeId);
        const badgeCount = tab.showBadge ? badges.get(tab.routeId) || 0 : 0;
        const iconColor = isActive ? colors.primary : colors.textSecondary;

        return (
          <TouchableOpacity
            key={tab.routeId}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => handleTabPress(tab)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={tab.label}
            testID={tab.testID || `tab-${tab.routeId}`}
          >
            <View style={styles.iconContainer}>
              {/* Render icon */}
              {typeof tab.icon === 'function'
                ? tab.icon(isActive, iconColor)
                : tab.icon}

              {/* Badge */}
              {badgeCount > 0 && (
                <View
                  style={[
                    styles.badge,
                    tab.badgeColor && { backgroundColor: tab.badgeColor },
                  ]}
                  testID={`badge-${tab.routeId}`}
                >
                  <Text style={styles.badgeText}>
                    {formatBadgeCount(badgeCount)}
                  </Text>
                </View>
              )}
            </View>

            {/* Label */}
            {showLabels && (
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {tab.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
