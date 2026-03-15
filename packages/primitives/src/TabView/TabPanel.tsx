/**
 * TabPanel
 *
 * Defines a tab panel within a TabView.
 * This component is used to structure tabs but doesn't render directly.
 * TabView extracts the props to build the tab selector.
 */

import React from 'react';
import type { TabPanelProps } from './types';

export function TabPanel({ children }: TabPanelProps): React.ReactElement {
  // TabPanel just renders its children when active
  // The actual visibility logic is handled by TabView
  return <>{children}</>;
}

export default TabPanel;
