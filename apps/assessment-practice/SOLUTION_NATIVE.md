# Solution Reference (Native Version)

**DO NOT READ THIS UNTIL YOU'VE COMPLETED THE CHALLENGE!**

This is the reference solution using **native React Native only** - no external packages.

---

## Complete App.tsx Solution (~280 lines)

```tsx
/**
 * Assessment Challenge: Link Management Screen (Native)
 * SOLUTION - No external packages, everything built from scratch
 */

import React, { useState, useEffect, useContext, createContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { mockLinks, createLink, type Link } from './data/links';

// ============================================================================
// THEME SYSTEM (built from scratch)
// ============================================================================

interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  error: string;
  success: string;
  warning: string;
  border: string;
}

const lightColors: ThemeColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceElevated: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  primary: '#007AFF',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FF9500',
  border: '#E5E5E5',
};

const darkColors: ThemeColors = {
  background: '#000000',
  surface: '#1C1C1E',
  surfaceElevated: '#2C2C2E',
  text: '#FFFFFF',
  textSecondary: '#EBEBF5',
  textMuted: '#8E8E93',
  primary: '#0A84FF',
  error: '#FF453A',
  success: '#32D74B',
  warning: '#FF9F0A',
  border: '#38383A',
};

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  colors: ThemeColors;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme ?? 'light');
  const colors = mode === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// ============================================================================
// DEBOUNCE HOOK (built from scratch)
// ============================================================================

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ============================================================================
// REUSABLE COMPONENTS (built from scratch)
// ============================================================================

interface CardProps {
  children: React.ReactNode;
  style?: object;
}

function Card({ children, style }: CardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'ghost';
  disabled?: boolean;
}

function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  const { colors } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { bg: colors.primary, text: '#FFFFFF', border: colors.primary };
      case 'outline':
        return { bg: 'transparent', text: colors.primary, border: colors.primary };
      case 'ghost':
        return { bg: 'transparent', text: colors.primary, border: 'transparent' };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: variantStyles.bg,
          borderColor: variantStyles.border,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text style={[styles.buttonLabel, { color: variantStyles.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}

function Input({ value, onChangeText, placeholder, label, error }: InputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.inputContainer}>
      {label && (
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      />
      {error && (
        <Text style={[styles.inputError, { color: colors.error }]}>{error}</Text>
      )}
    </View>
  );
}

// ============================================================================
// LINK CARD COMPONENT
// ============================================================================

interface LinkCardProps {
  link: Link;
  onToggle: (id: string) => void;
}

function LinkCard({ link, onToggle }: LinkCardProps) {
  const { colors } = useTheme();

  // Manual pluralization
  const clicksText = link.clicks === 1 ? '1 click' : `${link.clicks} clicks`;

  return (
    <Card style={{ opacity: link.enabled ? 1 : 0.5 }}>
      <View style={styles.linkCardContent}>
        <View style={styles.linkCardInfo}>
          <Text style={[styles.linkTitle, { color: colors.text }]}>
            {link.title}
          </Text>
          <Text style={[styles.linkUrl, { color: colors.textMuted }]}>
            {link.url}
          </Text>
          <Text style={[styles.linkClicks, { color: colors.textSecondary }]}>
            {clicksText}
          </Text>
        </View>
        <View style={styles.linkCardToggle}>
          <Switch
            value={link.enabled}
            onValueChange={() => onToggle(link.id)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={link.enabled ? colors.surface : colors.textMuted}
            ios_backgroundColor={colors.border}
          />
          <Text style={[styles.toggleLabel, { color: colors.textSecondary }]}>
            {link.enabled ? 'Visible' : 'Hidden'}
          </Text>
        </View>
      </View>
    </Card>
  );
}

// ============================================================================
// ADD LINK FORM COMPONENT
// ============================================================================

interface AddLinkFormProps {
  onAdd: (title: string, url: string) => void;
  onCancel: () => void;
}

function AddLinkForm({ onAdd, onCancel }: AddLinkFormProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [titleError, setTitleError] = useState('');
  const [urlError, setUrlError] = useState('');

  const handleSubmit = () => {
    let valid = true;

    if (!title.trim()) {
      setTitleError('This field is required');
      valid = false;
    } else {
      setTitleError('');
    }

    if (!url.trim()) {
      setUrlError('This field is required');
      valid = false;
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrlError('Please enter a valid URL');
      valid = false;
    } else {
      setUrlError('');
    }

    if (valid) {
      onAdd(title.trim(), url.trim());
    }
  };

  return (
    <Card>
      <Text style={[styles.formTitle, { color: colors.text }]}>Add Link</Text>
      <View style={{ gap: 12 }}>
        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="Link Title"
          label="Link Title"
          error={titleError}
        />
        <Input
          value={url}
          onChangeText={setUrl}
          placeholder="https://..."
          label="Link URL"
          error={urlError}
        />
        <View style={styles.formButtons}>
          <Button label="Cancel" variant="ghost" onPress={onCancel} />
          <Button label="Save" variant="primary" onPress={handleSubmit} />
        </View>
      </View>
    </Card>
  );
}

// ============================================================================
// MAIN SCREEN
// ============================================================================

function LinkManagementScreen() {
  const { colors, mode, setMode } = useTheme();

  const [links, setLinks] = useState<Link[]>(mockLinks);
  const [searchText, setSearchText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Debounced search (our custom hook)
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

  const handleAddLink = (title: string, url: string) => {
    const newLink = createLink(title, url);
    setLinks(prev => [newLink, ...prev]);
    setShowAddForm(false);
  };

  // Manual pluralization
  const showingText = `Showing ${filteredLinks.length} of ${links.length} ${
    links.length === 1 ? 'link' : 'links'
  }`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>My Links</Text>
          <Button
            label={mode === 'light' ? 'Dark Mode' : 'Light Mode'}
            variant="outline"
            onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
          />
        </View>

        {/* Search */}
        <Input
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search links..."
        />

        {/* Count */}
        <Text style={[styles.count, { color: colors.textSecondary }]}>
          {showingText}
        </Text>

        {/* Add Button / Form */}
        {showAddForm ? (
          <AddLinkForm
            onAdd={handleAddLink}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <Button
            label="Add Link"
            variant="primary"
            onPress={() => setShowAddForm(true)}
          />
        )}

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Links List */}
        {filteredLinks.length === 0 ? (
          <Card>
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>
              {searchText ? 'No links match your search' : 'No links yet'}
            </Text>
          </Card>
        ) : (
          <View style={{ gap: 12 }}>
            {filteredLinks.map(link => (
              <LinkCard key={link.id} link={link} onToggle={handleToggle} />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// APP ENTRY POINT
// ============================================================================

export default function App() {
  return (
    <ThemeProvider>
      <LinkManagementScreen />
    </ThemeProvider>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  count: {
    fontSize: 14,
  },
  divider: {
    height: 1,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputError: {
    fontSize: 12,
    marginTop: 4,
  },
  linkCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkCardInfo: {
    flex: 1,
    gap: 4,
  },
  linkCardToggle: {
    alignItems: 'flex-end',
    gap: 4,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  linkUrl: {
    fontSize: 14,
  },
  linkClicks: {
    fontSize: 12,
  },
  toggleLabel: {
    fontSize: 12,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  emptyText: {
    textAlign: 'center',
    padding: 24,
  },
});
```

---

## Line Count Comparison

| Section | Native | With @astacinco |
|---------|--------|-----------------|
| Theme System | ~45 lines | 0 (imported) |
| useDebounce | ~15 lines | 0 (imported) |
| Card Component | ~25 lines | 0 (imported) |
| Button Component | ~35 lines | 0 (imported) |
| Input Component | ~40 lines | 0 (imported) |
| Business Logic | ~100 lines | ~100 lines |
| Styles | ~80 lines | ~20 lines |
| **Total** | **~340 lines** | **~150 lines** |

**Result:** Native version is **2.3x more code** than packaged version.

---

## Key Differences

### 1. Theme System
**Native:** 45 lines to create context, provider, hook, and color definitions.
**Packaged:** `import { ThemeProvider, useTheme } from '@astacinco/rn-theming'`

### 2. Debounce
**Native:** Build useDebounce hook with useState/useEffect.
**Packaged:** `import { useDebounce } from '@astacinco/rn-performance'`

### 3. Components
**Native:** Build Card, Button, Input from scratch.
**Packaged:** Import ready-to-use, theme-aware components.

### 4. Pluralization
**Native:** `links.length === 1 ? 'link' : 'links'`
**Packaged:** `tp('links.showing', count, { total })`

### 5. Layout
**Native:** Manual `flexDirection`, `gap`, `justifyContent`
**Packaged:** `<VStack spacing="md">`, `<HStack justify="space-between">`

---

## What This Demonstrates

Building this challenge natively shows:

1. **Understanding fundamentals** - You know how React context, hooks, and RN work
2. **Package value** - The ~190 extra lines are what packages abstract away
3. **Maintenance burden** - Native components need updates across projects
4. **Consistency** - Packages ensure consistent styling/behavior

This is exactly why you build reusable packages!
