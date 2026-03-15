/**
 * Accordion
 *
 * Container for expandable/collapsible AccordionItem sections.
 * Supports multiple items open simultaneously.
 */

import React, { useState, Children, isValidElement, cloneElement } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@astacinco/rn-theming';
import type { AccordionProps, AccordionItemProps } from './types';

export function Accordion({
  children,
  defaultExpanded = [],
  allowMultiple = true,
  onChange,
  style,
  testID,
}: AccordionProps): React.ReactElement {
  const { spacing } = useTheme();
  const [expanded, setExpanded] = useState<string[]>(defaultExpanded);

  const handleToggle = (id: string) => {
    setExpanded((prev) => {
      let next: string[];

      if (prev.includes(id)) {
        // Collapse
        next = prev.filter((i) => i !== id);
      } else if (allowMultiple) {
        // Expand (allow multiple)
        next = [...prev, id];
      } else {
        // Expand (single only)
        next = [id];
      }

      onChange?.(next);
      return next;
    });
  };

  // Clone children with expanded state and toggle handler
  const items = Children.map(children, (child) => {
    if (isValidElement<AccordionItemProps>(child)) {
      const { id } = child.props;
      return cloneElement(child, {
        _expanded: expanded.includes(id),
        _onToggle: () => handleToggle(id),
      });
    }
    return child;
  });

  return (
    <View style={[styles.container, { gap: spacing.sm }, style]} testID={testID}>
      {items}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});

export default Accordion;
