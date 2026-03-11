/**
 * Filter tabs for challenge list
 * Wrapper around the packaged Tabs component
 */

import React from 'react';
import { Tabs, type TabOption } from '@astacinco/rn-primitives';

// Re-export TabOption as FilterOption for backwards compatibility
export type FilterOption<T> = TabOption<T>;

interface FilterTabsProps<T extends string> {
  options: FilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

export function FilterTabs<T extends string>({
  options,
  selected,
  onSelect,
}: FilterTabsProps<T>) {
  return (
    <Tabs
      options={options}
      selected={selected}
      onSelect={onSelect}
      variant="pills"
      size="md"
    />
  );
}
