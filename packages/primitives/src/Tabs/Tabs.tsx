import React from 'react';
import { ScrollView, Pressable, View, StyleSheet } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Text } from '../Text';
import { HStack } from '../Stack';
import type { TabsProps, TabOption, TabsSize, TabsVariant } from './types';

const sizeConfig: Record<TabsSize, { paddingH: number; paddingV: number; fontSize: number }> = {
  sm: { paddingH: 12, paddingV: 6, fontSize: 12 },
  md: { paddingH: 16, paddingV: 8, fontSize: 14 },
  lg: { paddingH: 20, paddingV: 10, fontSize: 16 },
};

export function Tabs<T extends string>({
  options,
  selected,
  onSelect,
  size = 'md',
  variant = 'pills',
  scrollable = true,
  style,
  testID,
}: TabsProps<T>) {
  const { colors } = useTheme();
  const config = sizeConfig[size];

  const getTabStyles = (isSelected: boolean, isDisabled: boolean) => {
    const opacity = isDisabled ? 0.5 : 1;

    switch (variant) {
      case 'filled':
        return {
          backgroundColor: isSelected ? colors.primary : colors.surface,
          borderWidth: 0,
          textColor: isSelected ? '#FFFFFF' : colors.text,
          opacity,
        };
      case 'outlined':
        return {
          backgroundColor: isSelected ? colors.primary + '10' : 'transparent',
          borderWidth: 1,
          borderColor: isSelected ? colors.primary : colors.border,
          textColor: isSelected ? colors.primary : colors.text,
          opacity,
        };
      case 'pills':
      default:
        return {
          backgroundColor: isSelected ? colors.primary : colors.surface,
          borderWidth: 1,
          borderColor: isSelected ? colors.primary : colors.border,
          textColor: isSelected ? '#FFFFFF' : colors.text,
          opacity,
        };
    }
  };

  const renderTab = (option: TabOption<T>) => {
    const isSelected = option.value === selected;
    const isDisabled = option.disabled ?? false;
    const tabStyle = getTabStyles(isSelected, isDisabled);

    return (
      <Pressable
        key={option.value}
        onPress={() => !isDisabled && onSelect(option.value)}
        disabled={isDisabled}
        style={[
          styles.tab,
          {
            backgroundColor: tabStyle.backgroundColor,
            borderWidth: tabStyle.borderWidth,
            borderColor: tabStyle.borderColor,
            paddingHorizontal: config.paddingH,
            paddingVertical: config.paddingV,
            opacity: tabStyle.opacity,
          },
        ]}
      >
        <Text
          variant="body"
          style={{
            color: tabStyle.textColor,
            fontSize: config.fontSize,
            fontWeight: '500',
          }}
        >
          {option.label}
        </Text>
      </Pressable>
    );
  };

  const tabsContent = (
    <HStack spacing="sm">
      {options.map(renderTab)}
    </HStack>
  );

  if (scrollable) {
    return (
      <ScrollView
        testID={testID}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        style={style}
      >
        {tabsContent}
      </ScrollView>
    );
  }

  return (
    <View testID={testID} style={style}>
      {tabsContent}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 4,
  },
  tab: {
    borderRadius: 20,
  },
});
