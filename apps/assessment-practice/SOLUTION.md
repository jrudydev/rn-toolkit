# Solution Reference

**DO NOT READ THIS UNTIL YOU'VE COMPLETED THE CHALLENGE!**

This is the reference solution for the Link Management Screen challenge.

---

## Complete App.tsx Solution

```tsx
/**
 * Assessment Challenge: Link Management Screen
 * SOLUTION - Do not read until you've attempted the challenge!
 */

import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Switch, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Package imports
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';
import { Text, Button, Card, VStack, HStack, Container, Input, Divider } from '@astacinco/rn-primitives';
import { I18nProvider, ConsoleAdapter, useTranslation } from '@astacinco/rn-i18n';
import { useDebounce } from '@astacinco/rn-performance';

// Data and translations
import { mockLinks, createLink, type Link } from './data/links';
import { en, es } from './i18n/en';

// ============================================================================
// i18n Adapter Setup
// ============================================================================
const i18nAdapter = new ConsoleAdapter({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es'],
  resources: { en, es },
});

// ============================================================================
// LinkCard Component
// ============================================================================
interface LinkCardProps {
  link: Link;
  onToggle: (id: string) => void;
}

function LinkCard({ link, onToggle }: LinkCardProps) {
  const { colors } = useTheme();
  const { t, tp } = useTranslation();

  return (
    <Card
      variant="elevated"
      style={{ opacity: link.enabled ? 1 : 0.5 }}
    >
      <HStack spacing="md" justify="space-between" align="center">
        <VStack spacing="xs" style={{ flex: 1 }}>
          <Text variant="subtitle">{link.title}</Text>
          <Text variant="caption" color={colors.textMuted}>
            {link.url}
          </Text>
          <Text variant="caption" color={colors.textSecondary}>
            {tp('links.clicks', link.clicks)}
          </Text>
        </VStack>
        <VStack spacing="xs" align="end">
          <Switch
            value={link.enabled}
            onValueChange={() => onToggle(link.id)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={link.enabled ? colors.surface : colors.textMuted}
          />
          <Text variant="caption" color={colors.textSecondary}>
            {link.enabled ? t('links.enabled') : t('links.disabled')}
          </Text>
        </VStack>
      </HStack>
    </Card>
  );
}

// ============================================================================
// AddLinkForm Component
// ============================================================================
interface AddLinkFormProps {
  onAdd: (title: string, url: string) => void;
  onCancel: () => void;
}

function AddLinkForm({ onAdd, onCancel }: AddLinkFormProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [titleError, setTitleError] = useState('');
  const [urlError, setUrlError] = useState('');

  const handleSubmit = () => {
    let valid = true;

    if (!title.trim()) {
      setTitleError(t('validation.required'));
      valid = false;
    } else {
      setTitleError('');
    }

    if (!url.trim()) {
      setUrlError(t('validation.required'));
      valid = false;
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrlError(t('validation.invalidUrl'));
      valid = false;
    } else {
      setUrlError('');
    }

    if (valid) {
      onAdd(title.trim(), url.trim());
      setTitle('');
      setUrl('');
    }
  };

  return (
    <Card variant="outlined">
      <VStack spacing="md">
        <Text variant="subtitle">{t('links.addLink')}</Text>
        <Input
          value={title}
          onChangeText={setTitle}
          placeholder={t('links.linkTitle')}
          label={t('links.linkTitle')}
          error={titleError}
        />
        <Input
          value={url}
          onChangeText={setUrl}
          placeholder="https://..."
          label={t('links.linkUrl')}
          error={urlError}
          autoCapitalize="none"
          keyboardType="url"
        />
        <HStack spacing="sm" justify="end">
          <Button
            label={t('common.cancel')}
            variant="ghost"
            onPress={onCancel}
          />
          <Button
            label={t('common.save')}
            variant="primary"
            onPress={handleSubmit}
          />
        </HStack>
      </VStack>
    </Card>
  );
}

// ============================================================================
// LinkManagementScreen Component
// ============================================================================
function LinkManagementScreen() {
  const { colors, mode, setMode, spacing } = useTheme();
  const { t, tp } = useTranslation();

  // State
  const [links, setLinks] = useState<Link[]>(mockLinks);
  const [searchText, setSearchText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Debounced search
  const debouncedSearch = useDebounce(searchText, 300);

  // Filter links based on debounced search
  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Handlers
  const handleToggle = (id: string) => {
    setLinks(prev =>
      prev.map(link =>
        link.id === id ? { ...link, enabled: !link.enabled } : link
      )
    );
  };

  const handleAddLink = (title: string, url: string) => {
    const newLink = createLink(title, url);
    setLinks(prev => [newLink, ...prev]);
    setShowAddForm(false);
  };

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Container>
          <VStack spacing="lg">
            {/* Header */}
            <HStack justify="space-between" align="center">
              <Text variant="title">{t('links.title')}</Text>
              <Button
                label={mode === 'light' ? t('theme.dark') : t('theme.light')}
                variant="outline"
                size="sm"
                onPress={toggleTheme}
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

            {/* Add Link Button / Form */}
            {showAddForm ? (
              <AddLinkForm
                onAdd={handleAddLink}
                onCancel={() => setShowAddForm(false)}
              />
            ) : (
              <Button
                label={t('links.addLink')}
                variant="primary"
                onPress={() => setShowAddForm(true)}
              />
            )}

            <Divider />

            {/* Links List */}
            {filteredLinks.length === 0 ? (
              <Card variant="filled">
                <Text variant="body" color={colors.textMuted} style={styles.emptyText}>
                  {searchText ? t('links.noResults') : t('links.noLinks')}
                </Text>
              </Card>
            ) : (
              <VStack spacing="md">
                {filteredLinks.map(link => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    onToggle={handleToggle}
                  />
                ))}
              </VStack>
            )}
          </VStack>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// App Entry Point
// ============================================================================
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
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    padding: 24,
  },
});
```

---

## Key Implementation Notes

### 1. Provider Structure
The providers are nested correctly:
```tsx
<ThemeProvider mode="auto">
  <I18nProvider adapter={i18nAdapter}>
    <LinkManagementScreen />
  </I18nProvider>
</ThemeProvider>
```

### 2. Debounced Search
```tsx
const debouncedSearch = useDebounce(searchText, 300);

const filteredLinks = links.filter(link =>
  link.title.toLowerCase().includes(debouncedSearch.toLowerCase())
);
```
The `searchText` updates immediately (for responsive input), but filtering waits 300ms.

### 3. Pluralization
```tsx
{tp('links.showing', filteredLinks.length, { total: links.length })}
```
Uses `tp()` with count as second argument and additional variables as third.

### 4. Toggle Handler (Immutable Update)
```tsx
const handleToggle = (id: string) => {
  setLinks(prev =>
    prev.map(link =>
      link.id === id ? { ...link, enabled: !link.enabled } : link
    )
  );
};
```

### 5. Theme-Aware Switch
```tsx
<Switch
  value={link.enabled}
  onValueChange={() => onToggle(link.id)}
  trackColor={{ false: colors.border, true: colors.primary }}
  thumbColor={link.enabled ? colors.surface : colors.textMuted}
/>
```

### 6. Visual Feedback for Disabled
```tsx
<Card style={{ opacity: link.enabled ? 1 : 0.5 }}>
```

### 7. Form Validation
- Check for empty fields
- Validate URL format (starts with http:// or https://)
- Show error messages using Input's `error` prop

### 8. Empty States
- Different message for "no links" vs "no search results"
- Uses translations for both states

---

## Common Mistakes to Avoid

1. **Forgetting to wrap with providers** - Components won't have access to theme/i18n
2. **Using `t()` instead of `tp()` for pluralization** - Won't pluralize correctly
3. **Not debouncing search** - Requirement explicitly states 300ms debounce
4. **Mutating state directly** - Always use immutable updates with `map()`
5. **Forgetting TypeScript types** - Props interfaces, Link type, etc.
6. **Not handling empty states** - Should show appropriate messages

---

## Bonus Points

Things that would score extra:

1. **URL validation with regex** - More robust than just checking prefix
2. **Keyboard dismiss on submit** - Better UX
3. **Haptic feedback on toggle** - Native feel
4. **Animated opacity change** - Smooth transitions
5. **Pull to refresh** - Common pattern in list views
6. **Swipe to delete** - Advanced gesture handling

---

## Self-Assessment Questions

After completing, ask yourself:

1. Did I use all 4 required packages?
2. Is my search debounced correctly?
3. Does pluralization work for 1 vs many?
4. Does dark/light mode toggle work?
5. Are there any TypeScript errors or `any` types?
6. Did I handle edge cases (empty, no results)?
7. Is the code clean and readable?

---

## What to Practice Next

Based on how the challenge went:

| If you struggled with... | Practice with... |
|--------------------------|------------------|
| Provider setup | Re-read CHEATSHEET.md setup section |
| Debouncing | Build a search autocomplete component |
| Pluralization | Add more plural strings (clicks, results) |
| State management | Try adding edit/delete functionality |
| TypeScript | Add more explicit types, remove any |

---

## Phase 2: Component Building

After completing the challenge, identify what would have helped:

- **Switch component** - Theme-aware, proper styling
- **Avatar component** - For link thumbnails
- **Badge component** - For click counts
- **Modal component** - For add link form

Build these components, then redo the challenge using them!
