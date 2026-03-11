/**
 * Filter tabs for challenge list
 */

import React from 'react';
import { ScrollView, Pressable, StyleSheet } from 'react-native';
import { Text, HStack } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';

export interface FilterOption<T> {
  value: T;
  label: string;
}

interface FilterTabsProps<T> {
  options: FilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

export function FilterTabs<T extends string>({
  options,
  selected,
  onSelect,
}: FilterTabsProps<T>) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <HStack spacing="sm">
        {options.map(option => {
          const isSelected = option.value === selected;

          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              style={[
                styles.tab,
                {
                  backgroundColor: isSelected ? colors.primary : colors.surface,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                variant="body"
                color={isSelected ? '#FFFFFF' : colors.text}
                style={styles.tabText}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </HStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tabText: {
    fontWeight: '500',
  },
});
