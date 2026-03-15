/**
 * TabView
 *
 * Combines tab selector with content panels.
 * Uses the existing Tabs component for the selector bar.
 */

import React, { useState, Children, isValidElement, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import { Tabs } from '../Tabs';
import type { TabOption } from '../Tabs';
import type { TabViewProps, TabPanelProps } from './types';

export function TabView({
  children,
  defaultTab,
  variant = 'pills',
  size = 'md',
  onChange,
  style,
  testID,
}: TabViewProps): React.ReactElement {
  const { spacing } = useTheme();

  // Extract tab options from TabPanel children
  const { tabOptions, panels } = useMemo(() => {
    const options: TabOption<string>[] = [];
    const panelMap = new Map<string, React.ReactNode>();

    Children.forEach(children, (child) => {
      if (isValidElement<TabPanelProps>(child)) {
        const { id, label, disabled, children: panelContent } = child.props;
        options.push({ value: id, label, disabled });
        panelMap.set(id, panelContent);
      }
    });

    return { tabOptions: options, panels: panelMap };
  }, [children]);

  // Determine initial tab
  const initialTab = defaultTab ?? tabOptions[0]?.value ?? '';
  const [selectedTab, setSelectedTab] = useState(initialTab);

  // Handle tab selection
  const handleSelect = (tabId: string) => {
    setSelectedTab(tabId);
    onChange?.(tabId);
  };

  // Get active panel content
  const activeContent = panels.get(selectedTab);

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Tabs
        options={tabOptions}
        selected={selectedTab}
        onSelect={handleSelect}
        variant={variant === 'underline' ? 'outlined' : variant}
        size={size}
        scrollable={false}
      />
      <View style={[styles.content, { marginTop: spacing.md }]}>
        {activeContent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    width: '100%',
  },
});

export default TabView;
