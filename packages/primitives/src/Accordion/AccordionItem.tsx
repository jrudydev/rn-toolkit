/**
 * AccordionItem
 *
 * A single expandable/collapsible section within an Accordion.
 */

import React from 'react';
import { View, Pressable, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import { HStack } from '../Stack';
import type { AccordionItemProps } from './types';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function AccordionItem({
  id,
  title,
  icon,
  disabled = false,
  children,
  _expanded = false,
  _onToggle,
}: AccordionItemProps): React.ReactElement {
  const { colors, spacing } = useTheme();

  const handlePress = () => {
    if (disabled) return;
    // Animate the layout change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    _onToggle?.();
  };

  const chevron = _expanded ? '▼' : '▶';

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.border,
          borderRadius: 8,
          backgroundColor: colors.surface,
        },
      ]}
      testID={`accordion-item-${id}`}
    >
      {/* Header */}
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.header,
          {
            padding: spacing.md,
            opacity: disabled ? 0.5 : pressed ? 0.7 : 1,
          },
        ]}
        testID={`accordion-header-${id}`}
      >
        <HStack spacing="sm" align="center" style={styles.headerContent}>
          <Text
            variant="body"
            style={[styles.chevron, { color: colors.textSecondary }]}
          >
            {chevron}
          </Text>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            variant="label"
            style={[
              styles.title,
              { color: disabled ? colors.textSecondary : colors.text },
            ]}
          >
            {title}
          </Text>
        </HStack>
      </Pressable>

      {/* Content */}
      {_expanded && (
        <View
          style={[
            styles.content,
            {
              padding: spacing.md,
              paddingTop: 0,
              borderTopWidth: 1,
              borderTopColor: colors.border,
            },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    width: '100%',
  },
  headerContent: {
    flex: 1,
  },
  chevron: {
    fontSize: 12,
    width: 16,
  },
  icon: {
    marginRight: 4,
  },
  title: {
    flex: 1,
  },
  content: {
    // Content styles
  },
});

export default AccordionItem;
