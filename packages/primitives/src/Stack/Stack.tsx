import React from 'react';
import { View, StyleSheet, FlexAlignType } from 'react-native';
import { useTheme } from '@rn-toolkit/theming';
import type { StackProps, StackAlign, StackJustify } from './types';

const alignMap: Record<StackAlign, FlexAlignType> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const justifyMap: Record<StackJustify, 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-between': 'space-between',
  'space-around': 'space-around',
};

interface InternalStackProps extends StackProps {
  direction: 'column' | 'row';
}

function BaseStack({
  children,
  direction,
  spacing = 'none',
  align = 'stretch',
  justify = 'start',
  style,
  testID,
  ...props
}: InternalStackProps) {
  const { spacing: themeSpacing } = useTheme();

  const gap = spacing === 'none' ? 0 : themeSpacing[spacing];

  return (
    <View
      testID={testID}
      style={[
        styles.base,
        {
          flexDirection: direction,
          alignItems: alignMap[align],
          justifyContent: justifyMap[justify],
          gap,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

/**
 * Vertical stack - arranges children in a column
 */
export function VStack(props: StackProps) {
  return <BaseStack {...props} direction="column" />;
}

/**
 * Horizontal stack - arranges children in a row
 */
export function HStack(props: StackProps) {
  return <BaseStack {...props} direction="row" />;
}

const styles = StyleSheet.create({
  base: {
    // Base stack styles
  },
});
