/**
 * Link Management Assessment Content
 *
 * Embedded markdown content for in-app display using MarkdownViewer.
 */

export const challengeContent = `# 🔗 Link Management Screen

| ⏱️ Time | 📊 Difficulty | 📦 Packages |
|---------|---------------|-------------|
| 90 min  | Medium        | 4 of 5 free |

---

## 📖 Scenario

You're building the Link Management screen for a "link in bio" app (similar to Linktree).
Creators use this screen to manage their profile links - view, add, toggle visibility,
and search through their links.

---

## 🏗️ Assessment Structure

| Section | Time | Status |
|---------|------|--------|
| 🎯 **Core Domain Tasks** | ~45 min | Required |
| ⚡ **Required Challenges** | ~30 min | Required |
| ⭐ **Bonus Challenges** | ~15+ min | Optional |

---

## 🎯 Core Domain Tasks (Required)

These are specific to the Linktree use case.

### 📋 Task 1: Link List Display

| Requirement | Done? |
|-------------|:-----:|
| Display links from provided mock data as cards | ⬜ |
| Each card shows: title, URL, and enabled status | ⬜ |
| Cards should be visually distinct (use Card component) | ⬜ |

### 🔀 Task 2: Toggle Link Visibility

| Requirement | Done? |
|-------------|:-----:|
| Each card has a toggle switch (use \`Switch\`) | ⬜ |
| Toggling updates the link's \`enabled\` state | ⬜ |
| Visual feedback when toggled (styling change) | ⬜ |

### 🔢 Task 3: Link Count with Pluralization

| Requirement | Done? |
|-------------|:-----:|
| Display "Showing X of Y links" text | ⬜ |
| Must use i18n pluralization | ⬜ |
| Examples: "1 link" vs "5 links" | ⬜ |

### ➕ Task 4: Add Link

| Requirement | Done? |
|-------------|:-----:|
| Button to add a new link | ⬜ |
| Simple form with title and URL inputs | ⬜ |
| New link appears in the list | ⬜ |

---

## ⚡ Required Challenges

These generic challenges must be completed for this assessment.

### 🔍 Debounced Search

| Requirement | Done? |
|-------------|:-----:|
| Search input at top of screen | ⬜ |
| Filters links by title (case-insensitive) | ⬜ |
| Search MUST be debounced (300ms) | ⬜ |
| Show filtered results after debounce | ⬜ |

### 🌓 Dark Mode Toggle

| Requirement | Done? |
|-------------|:-----:|
| Toggle button to switch light/dark mode | ⬜ |
| All components adapt to theme | ⬜ |
| Background, text, cards all change | ⬜ |

---

## ⭐ Bonus Challenges (Optional)

Complete these if you finish early!

### 📝 Form Validation

| Requirement | Done? |
|-------------|:-----:|
| Validate title and URL non-empty | ⬜ |
| Show error states on invalid inputs | ⬜ |
| Prevent submission until valid | ⬜ |

### ⏳ Loading States

| Requirement | Done? |
|-------------|:-----:|
| Show loading indicator when adding | ⬜ |
| Simulate async delay (500ms) | ⬜ |
| Disable form during loading | ⬜ |

### 📭 Empty States

| Requirement | Done? |
|-------------|:-----:|
| Show "No links yet" when empty | ⬜ |
| Show "No results found" for search | ⬜ |
| Include call-to-action | ⬜ |

---

## 🛠️ Technical Requirements

### 📦 Use Package Components

\`\`\`tsx
// REQUIRED imports
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';
import { Text, Button, Card, VStack, HStack, Input, Switch } from '@astacinco/rn-primitives';
import { I18nProvider, ConsoleAdapter, useTranslation } from '@astacinco/rn-i18n';
import { useDebounce } from '@astacinco/rn-performance';
\`\`\`

### 📘 TypeScript

- All code must be TypeScript
- Define proper interfaces for Link type
- No \`any\` types
- Props should be typed

---

## 📊 Mock Data Structure

\`\`\`typescript
interface Link {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  enabled: boolean;
  clicks: number;
}
\`\`\`

---

## 🏆 Grading Rubric

| Criteria | Points | What We're Looking For |
|----------|:------:|------------------------|
| 🎯 **Core Tasks** | 35 | List, toggle, add, count |
| ⚡ **Required Challenges** | 30 | Debounce, theme toggle |
| 📦 **Package Integration** | 15 | Correct hook/component usage |
| 📘 **TypeScript Quality** | 10 | Types, interfaces, no \`any\` |
| ⭐ **Bonus Challenges** | 10 | Validation, loading, empty |

---

## 💡 Tips

> 🚀 **Start with rendering** - Get the list displaying first

> 🎯 **Core tasks first** - Complete all core domain tasks before challenges

> 🔄 **Test as you go** - Run the app frequently

> 📖 **Use the cheatsheet** - Don't waste time remembering imports

> ⭐ **Bonus is bonus** - Only attempt if core + required are done

---

**Good luck! You've got this! 🎉**
`;

export const cheatsheetContent = `# React Native Toolkit Cheatsheet

Quick reference for all \`@astacinco\` packages. Copy-paste ready.

---

## 1. Setup (App.tsx root)

\`\`\`tsx
import { ThemeProvider } from '@astacinco/rn-theming';
import { I18nProvider, ConsoleAdapter } from '@astacinco/rn-i18n';

// Create adapters
const i18nAdapter = new ConsoleAdapter({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es'],
  resources: { en: { /* translations */ } }
});

// Wrap app
<ThemeProvider mode="auto">
  <I18nProvider adapter={i18nAdapter}>
    <App />
  </I18nProvider>
</ThemeProvider>
\`\`\`

---

## 2. @astacinco/rn-primitives

### Imports
\`\`\`tsx
import {
  Text, Button, Card, VStack, HStack,
  Container, Input, Divider, Switch,
  Avatar, Badge, Tag, Timer, Tabs, MarkdownViewer
} from '@astacinco/rn-primitives';
\`\`\`

### Text
\`\`\`tsx
<Text variant="title">Title</Text>
<Text variant="body">Body text</Text>
<Text variant="caption">Caption</Text>
// variants: 'title' | 'subtitle' | 'body' | 'caption' | 'label'
\`\`\`

### Button
\`\`\`tsx
<Button
  label="Click Me"
  onPress={() => {}}
  variant="primary"  // 'primary' | 'secondary' | 'outline' | 'ghost'
  size="md"          // 'sm' | 'md' | 'lg'
/>
\`\`\`

### Card
\`\`\`tsx
<Card variant="elevated">
  <Text>Card content</Text>
</Card>
// variants: 'filled' | 'outlined' | 'elevated'
\`\`\`

### Stacks
\`\`\`tsx
<VStack spacing="md" align="center">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</VStack>

<HStack spacing="sm" justify="space-between">
  <Button label="Left" onPress={() => {}} />
  <Button label="Right" onPress={() => {}} />
</HStack>
// spacing: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
\`\`\`

### Input
\`\`\`tsx
<Input
  value={text}
  onChangeText={setText}
  placeholder="Enter text"
  label="Field Label"
  error="Error message"
/>
\`\`\`

### Switch
\`\`\`tsx
<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  size="md"
  label="Enable feature"
  labelPosition="right"
/>
\`\`\`

---

## 3. @astacinco/rn-theming

\`\`\`tsx
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';

// In component:
const { mode, colors, setMode } = useTheme();

// Toggle theme
<Button
  label={mode === 'light' ? 'Dark Mode' : 'Light Mode'}
  onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
/>

// Color tokens
colors.background, colors.surface, colors.text
colors.primary, colors.secondary, colors.error
colors.textSecondary, colors.textMuted, colors.border
\`\`\`

---

## 4. @astacinco/rn-i18n

\`\`\`tsx
import { useTranslation } from '@astacinco/rn-i18n';

const { t, tp } = useTranslation();

// Simple translation
<Text>{t('common.welcome', { name: 'John' })}</Text>

// Pluralization
<Text>{tp('common.items', count)}</Text>
// count=1: "1 item", count=5: "5 items"
\`\`\`

---

## 5. @astacinco/rn-performance

\`\`\`tsx
import { useDebounce } from '@astacinco/rn-performance';

const [searchText, setSearchText] = useState('');
const debouncedSearch = useDebounce(searchText, 300);

// Filter based on debounced value
const filtered = items.filter(item =>
  item.title.includes(debouncedSearch)
);
\`\`\`

---

## Common Patterns

### Search with Debounce
\`\`\`tsx
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

const filtered = items.filter(item =>
  item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
);

<Input value={search} onChangeText={setSearch} placeholder="Search..." />
<Text>{tp('results', filtered.length)}</Text>
\`\`\`

### Theme Toggle
\`\`\`tsx
const { mode, setMode } = useTheme();

<Button
  label={mode === 'light' ? '🌙 Dark' : '☀️ Light'}
  variant="outline"
  onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
/>
\`\`\`
`;

export const solutionContent = `# Solution Reference

**DO NOT READ THIS UNTIL YOU'VE COMPLETED THE CHALLENGE!**

---

## Complete App.tsx Solution

\`\`\`tsx
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Package imports
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';
import { Text, Button, Card, VStack, HStack, Container, Input, Divider, Switch } from '@astacinco/rn-primitives';
import { I18nProvider, ConsoleAdapter, useTranslation } from '@astacinco/rn-i18n';
import { useDebounce } from '@astacinco/rn-performance';

// Data and translations
import { mockLinks, createLink, type Link } from './data/links';
import { en, es } from './i18n/en';

// i18n Adapter Setup
const i18nAdapter = new ConsoleAdapter({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es'],
  resources: { en, es },
});

// LinkCard Component
function LinkCard({ link, onToggle }: { link: Link; onToggle: (id: string) => void }) {
  const { colors } = useTheme();
  const { tp } = useTranslation();

  return (
    <Card variant="elevated" style={{ opacity: link.enabled ? 1 : 0.5 }}>
      <HStack spacing="md" justify="space-between" align="center">
        <VStack spacing="xs" style={{ flex: 1 }}>
          <Text variant="subtitle">{link.title}</Text>
          <Text variant="caption" color={colors.textMuted}>{link.url}</Text>
          <Text variant="caption" color={colors.textSecondary}>
            {tp('links.clicks', link.clicks)}
          </Text>
        </VStack>
        <Switch value={link.enabled} onValueChange={() => onToggle(link.id)} />
      </HStack>
    </Card>
  );
}

// Main Screen
function LinkManagementScreen() {
  const { colors, mode, setMode } = useTheme();
  const { t, tp } = useTranslation();

  const [links, setLinks] = useState<Link[]>(mockLinks);
  const [searchText, setSearchText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Debounced search
  const debouncedSearch = useDebounce(searchText, 300);

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const handleToggle = (id: string) => {
    setLinks(prev =>
      prev.map(link =>
        link.id === id ? { ...link, enabled: !link.enabled } : link
      )
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Container>
          <VStack spacing="lg">
            {/* Header */}
            <HStack justify="space-between" align="center">
              <Text variant="title">{t('links.title')}</Text>
              <Button
                label={mode === 'light' ? '🌙' : '☀️'}
                variant="outline"
                size="sm"
                onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
              />
            </HStack>

            {/* Search */}
            <Input
              value={searchText}
              onChangeText={setSearchText}
              placeholder={t('common.search')}
            />

            {/* Link count */}
            <Text variant="caption" color={colors.textSecondary}>
              {tp('links.showing', filteredLinks.length, { total: links.length })}
            </Text>

            <Divider />

            {/* Links List */}
            <VStack spacing="md">
              {filteredLinks.map(link => (
                <LinkCard key={link.id} link={link} onToggle={handleToggle} />
              ))}
            </VStack>
          </VStack>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider mode="auto">
      <I18nProvider adapter={i18nAdapter}>
        <LinkManagementScreen />
      </I18nProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
});
\`\`\`

---

## Key Implementation Notes

### 1. Debounced Search
\`\`\`tsx
const debouncedSearch = useDebounce(searchText, 300);

const filteredLinks = links.filter(link =>
  link.title.toLowerCase().includes(debouncedSearch.toLowerCase())
);
\`\`\`
The \`searchText\` updates immediately (for responsive input), but filtering waits 300ms.

### 2. Toggle Handler (Immutable Update)
\`\`\`tsx
const handleToggle = (id: string) => {
  setLinks(prev =>
    prev.map(link =>
      link.id === id ? { ...link, enabled: !link.enabled } : link
    )
  );
};
\`\`\`

### 3. Theme-Aware Switch
\`\`\`tsx
<Switch value={link.enabled} onValueChange={() => onToggle(link.id)} />
\`\`\`
Uses \`@astacinco/rn-primitives\` Switch which is automatically theme-aware.
`;

// Native versions
export const nativeChallengeContent = `# Assessment: Link Management Screen (Native)

**Time Limit:** 120 minutes
**Difficulty:** Hard
**Approach:** Native React Native only (no external UI packages)

---

## Scenario

You're building the Link Management screen for a "link in bio" app.
**This is the NATIVE version** - build everything from scratch using only React Native's built-in components.

---

## What You Need to Build

### 1. Theme System (from scratch)
- Define color tokens (light/dark)
- Create ThemeContext
- Create ThemeProvider
- Create useTheme hook

### 2. Debounce Hook (from scratch)
\`\`\`tsx
function useDebounce<T>(value: T, delay: number): T {
  // Implement using useState and useEffect
}
\`\`\`

### 3. Reusable Components
- Card with shadow/elevation
- Input with label and error state
- Button with variants

---

## Technical Requirements

### TR1: Native Components Only
\`\`\`tsx
import {
  View, Text, TextInput, Pressable, Switch,
  ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';

// NOT ALLOWED: @astacinco/* packages or UI libraries
\`\`\`

---

## Comparison: Native vs Packaged

| Task | Native | With @astacinco |
|------|--------|-----------------|
| Theme system | Build context (~40 lines) | \`useTheme()\` |
| Debounce | Build hook (~15 lines) | \`useDebounce(value, 300)\` |
| Cards | Style View manually | \`<Card variant="elevated">\` |
| Pluralization | \`count === 1 ? 'link' : 'links'\` | \`tp('key', count)\` |

**Estimated extra code:** ~150-200 lines more than packaged version
`;

export const nativeCheatsheetContent = `# React Native Native Cheatsheet

Build everything from scratch using native React Native only.

---

## 1. Building a Theme System

\`\`\`tsx
const lightColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A1A',
  primary: '#007AFF',
  border: '#E5E5E5',
};

const darkColors = {
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  primary: '#0A84FF',
  border: '#38383A',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }) {
  const [mode, setMode] = useState('light');
  const colors = mode === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
\`\`\`

---

## 2. Building useDebounce Hook

\`\`\`tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

---

## 3. Manual Pluralization

\`\`\`tsx
const linkText = count === 1 ? '1 link' : \`\${count} links\`;
\`\`\`

---

## 4. Switch with Theme Colors

\`\`\`tsx
<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  trackColor={{ false: colors.border, true: colors.primary }}
  thumbColor={isEnabled ? colors.surface : colors.textMuted}
/>
\`\`\`
`;

export const nativeSolutionContent = `# Solution Reference (Native Version)

**DO NOT READ UNTIL YOU'VE COMPLETED THE CHALLENGE!**

This solution uses **native React Native only** - no external packages.

---

## Line Count Comparison

| Section | Native | With @astacinco |
|---------|--------|-----------------|
| Theme System | ~45 lines | 0 (imported) |
| useDebounce | ~15 lines | 0 (imported) |
| Components | ~100 lines | 0 (imported) |
| Business Logic | ~100 lines | ~100 lines |
| **Total** | **~340 lines** | **~150 lines** |

**Result:** Native version is **2.3x more code** than packaged version.

---

## What This Demonstrates

Building this challenge natively shows:
1. **Understanding fundamentals** - You know how React context and hooks work
2. **Package value** - The ~190 extra lines are what packages abstract away
3. **Maintenance burden** - Native components need updates across projects
4. **Consistency** - Packages ensure consistent styling/behavior

This is exactly why you build reusable packages!
`;
