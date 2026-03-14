/**
 * Assessment Challenge: Link Management Screen
 *
 * Time: 90 minutes
 * See CHALLENGE.md for full requirements
 * See CHEATSHEET.md for package reference
 *
 * START YOUR TIMER NOW!
 */

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// TODO 1: Import from @astacinco/rn-theming
// import { ThemeProvider, useTheme } from '@astacinco/rn-theming';

// TODO 2: Import from @astacinco/rn-primitives
// import { Text, Button, Card, VStack, HStack, Container, Input, Divider, Switch } from '@astacinco/rn-primitives';

// TODO 3: Import from @astacinco/rn-i18n
// import { I18nProvider, ConsoleAdapter, useTranslation } from '@astacinco/rn-i18n';

// TODO 4: Import from @astacinco/rn-performance
// import { useDebounce } from '@astacinco/rn-performance';

// Mock data - already imported for you
import { mockLinks, createLink, type Link } from './data/links';
import { en, es } from './i18n/en';

// ============================================================================
// TODO 5: Create i18n adapter
// ============================================================================
// const i18nAdapter = new ConsoleAdapter({
//   defaultLocale: 'en',
//   supportedLocales: ['en', 'es'],
//   resources: { en, es },
// });

// ============================================================================
// TODO 6: Create LinkCard component
// ============================================================================
// interface LinkCardProps {
//   link: Link;
//   onToggle: (id: string) => void;
// }
//
// function LinkCard({ link, onToggle }: LinkCardProps) {
//   // Use Card, HStack, VStack, Text, Switch from primitives
//   return null;
// }

// ============================================================================
// TODO 7: Create AddLinkForm component
// ============================================================================
// interface AddLinkFormProps {
//   onAdd: (title: string, url: string) => void;
//   onCancel: () => void;
// }
//
// function AddLinkForm({ onAdd, onCancel }: AddLinkFormProps) {
//   // Use Input, Button, VStack from primitives
//   return null;
// }

// ============================================================================
// TODO 8: Create main LinkManagement screen
// ============================================================================
// function LinkManagementScreen() {
//   const { colors, mode, setMode } = useTheme();
//   const { t, tp } = useTranslation();
//
//   // State
//   const [links, setLinks] = useState<Link[]>(mockLinks);
//   const [searchText, setSearchText] = useState('');
//   const [showAddForm, setShowAddForm] = useState(false);
//
//   // TODO: Use debounced search
//   // const debouncedSearch = useDebounce(searchText, 300);
//
//   // TODO: Filter links based on debounced search
//   // const filteredLinks = ...
//
//   // TODO: Handle toggle
//   // const handleToggle = (id: string) => { ... };
//
//   // TODO: Handle add link
//   // const handleAddLink = (title: string, url: string) => { ... };
//
//   return null;
// }

// ============================================================================
// App Entry Point - Wrap with providers
// ============================================================================
export default function App() {
  // TODO 9: Wrap with ThemeProvider, I18nProvider
  // <ThemeProvider mode="auto">
  //   <I18nProvider adapter={i18nAdapter}>
  //     <LinkManagementScreen />
  //   </I18nProvider>
  // </ThemeProvider>

  // Placeholder - remove when implementing
  return (
    <SafeAreaView style={styles.placeholder}>
      <StatusBar style="auto" />
      {/* Remove this placeholder and implement the challenge */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});

// ============================================================================
// HINTS (read if stuck, try without first!)
// ============================================================================
/*

HINT 1 - Provider Structure:
<ThemeProvider mode="auto">
  <I18nProvider adapter={i18nAdapter}>
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinkManagementScreen />
    </SafeAreaView>
  </I18nProvider>
</ThemeProvider>

HINT 2 - Debounced Search:
const debouncedSearch = useDebounce(searchText, 300);
const filteredLinks = links.filter(link =>
  link.title.toLowerCase().includes(debouncedSearch.toLowerCase())
);

HINT 3 - Pluralization:
// In your translations, use: { one: '...', other: '...' }
// Then: tp('links.showing', filteredLinks.length, { total: links.length })

HINT 4 - Toggle Handler:
const handleToggle = (id: string) => {
  setLinks(prev => prev.map(link =>
    link.id === id ? { ...link, enabled: !link.enabled } : link
  ));
};

HINT 5 - Card Styling for disabled:
style={{ opacity: link.enabled ? 1 : 0.5 }}

*/
