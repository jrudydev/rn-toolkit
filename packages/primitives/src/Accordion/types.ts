/**
 * Accordion Types
 *
 * Expandable/collapsible content sections.
 */

import type { ReactElement, ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

export interface AccordionItemProps {
  /** Unique identifier for this item */
  id: string;
  /** Title shown in the header */
  title: string;
  /** Optional icon before the title */
  icon?: ReactNode;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Content to render when expanded */
  children: ReactNode;
  /** Internal: whether this item is expanded (set by Accordion) */
  _expanded?: boolean;
  /** Internal: toggle handler (set by Accordion) */
  _onToggle?: () => void;
}

export interface AccordionProps {
  /** AccordionItem children */
  children: ReactElement<AccordionItemProps> | ReactElement<AccordionItemProps>[];
  /** IDs of items that start expanded */
  defaultExpanded?: string[];
  /** Allow multiple items to be expanded simultaneously */
  allowMultiple?: boolean;
  /** Called when expanded items change */
  onChange?: (expanded: string[]) => void;
  /** Custom style for the container */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}
