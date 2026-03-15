/**
 * TabView Types
 *
 * TabView combines tab selector with content panels.
 */

import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export type TabViewVariant = 'pills' | 'underline' | 'filled';
export type TabViewSize = 'sm' | 'md' | 'lg';

export interface TabPanelProps {
  /** Unique identifier for this panel */
  id: string;
  /** Label shown in the tab selector */
  label: string;
  /** Whether this tab is disabled */
  disabled?: boolean;
  /** Content to render when this tab is active */
  children: ReactNode;
}

export interface TabViewProps {
  /** TabPanel children */
  children: ReactElement<TabPanelProps> | ReactElement<TabPanelProps>[];
  /** ID of the initially selected tab */
  defaultTab?: string;
  /** Visual variant for the tab selector */
  variant?: TabViewVariant;
  /** Size of the tab selector */
  size?: TabViewSize;
  /** Called when the selected tab changes */
  onChange?: (tabId: string) => void;
  /** Custom style for the container */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}
