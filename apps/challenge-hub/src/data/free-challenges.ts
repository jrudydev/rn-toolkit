/**
 * Free tier assessments and challenges
 *
 * These use the free @astacinco packages:
 * - rn-primitives
 * - rn-theming
 * - rn-i18n
 * - rn-performance
 */

import type { ChallengeRegistry, Package, Assessment, GenericChallenge } from '../types';
import {
  challengeContent,
  cheatsheetContent,
  solutionContent,
  nativeChallengeContent,
  nativeCheatsheetContent,
  nativeSolutionContent,
} from './content';

export const freePackages: Package[] = [
  {
    id: 'primitives',
    name: '@astacinco/rn-primitives',
    displayName: 'Primitives',
    tier: 'free',
  },
  {
    id: 'theming',
    name: '@astacinco/rn-theming',
    displayName: 'Theming',
    tier: 'free',
  },
  {
    id: 'i18n',
    name: '@astacinco/rn-i18n',
    displayName: 'i18n',
    tier: 'free',
  },
  {
    id: 'performance',
    name: '@astacinco/rn-performance',
    displayName: 'Performance',
    tier: 'free',
  },
  {
    id: 'logging',
    name: '@astacinco/rn-logging',
    displayName: 'Logging',
    tier: 'free',
  },
];

// =============================================================================
// ASSESSMENTS - Full timed challenges with specific use cases
// =============================================================================

export const freeAssessments: Assessment[] = [
  {
    type: 'assessment',
    id: 'link-management',
    title: 'Link Management Screen',
    description: 'Build a Linktree-style link management screen with search, toggle, and add functionality.',
    scenario: 'You\'re building the Link Management screen for a "link in bio" app. Creators use this to manage their profile links.',
    difficulty: 'medium',
    timeMinutes: 90,
    packages: ['primitives', 'theming', 'i18n', 'performance'],
    tier: 'free',
    appFolder: 'assessment-practice',
    challengeFile: 'CHALLENGE.md',
    cheatsheetFile: 'CHEATSHEET.md',
    solutionFile: 'SOLUTION.md',
    // Inline content for in-app display
    challengeContent,
    cheatsheetContent,
    solutionContent,
    hasNativeVersion: true,
    nativeChallengeFile: 'CHALLENGE_NATIVE.md',
    nativeCheatsheetFile: 'CHEATSHEET_NATIVE.md',
    nativeSolutionFile: 'SOLUTION_NATIVE.md',
    // Native inline content
    nativeChallengeContent,
    nativeCheatsheetContent,
    nativeSolutionContent,
    requiredChallenges: ['debounced-search', 'dark-mode-toggle'],
    bonusChallenges: ['form-validation', 'loading-states', 'empty-states'],
    skills: ['CRUD operations', 'Search/filter', 'Toggle state', 'Form handling'],
    alignedWith: 'Linktree Senior Mobile Engineer',
  },
];

// =============================================================================
// GENERIC CHALLENGES - Reusable features for any assessment
// =============================================================================

export const freeChallenges: GenericChallenge[] = [
  // --- Required for Link Management ---
  {
    type: 'challenge',
    id: 'debounced-search',
    title: 'Debounced Search',
    description: 'Implement a search input that debounces user input before filtering results.',
    difficulty: 'easy',
    timeMinutes: 15,
    packages: ['primitives', 'performance'],
    tier: 'free',
    instructions: `
## Debounced Search

Add a search input that filters a list with debouncing to prevent excessive re-renders.

### Requirements
- Add a search Input at the top of your screen
- Use \`useDebounce\` from \`@astacinco/rn-performance\`
- Set debounce delay to 300ms
- Filter results case-insensitively
- Show filtered count

### Acceptance Criteria
- [ ] Search input is visible
- [ ] Typing triggers debounce (no immediate filter)
- [ ] Results filter after 300ms delay
- [ ] Filter is case-insensitive
    `,
    solution: `
## Solution: Debounced Search

\`\`\`tsx
import React, { useState, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { Text, Input, VStack, Card } from '@astacinco/rn-primitives';
import { useDebounce } from '@astacinco/rn-performance';
import { useTheme } from '@astacinco/rn-theming';

interface Item {
  id: string;
  title: string;
}

interface DebouncedSearchProps {
  items: Item[];
}

export function DebouncedSearch({ items }: DebouncedSearchProps) {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  // Debounce the search term - waits 300ms after user stops typing
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter items based on debounced search term
  const filteredItems = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return items;
    }
    return items.filter(item =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [items, debouncedSearch]);

  return (
    <VStack spacing="md">
      <Input
        label="Search"
        placeholder="Search items..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <Text variant="caption" color={colors.textMuted}>
        Showing {filteredItems.length} of {items.length} items
      </Text>

      <ScrollView>
        <VStack spacing="sm">
          {filteredItems.map(item => (
            <Card key={item.id} variant="outlined">
              <Text variant="body">{item.title}</Text>
            </Card>
          ))}
        </VStack>
      </ScrollView>
    </VStack>
  );
}
\`\`\`
    `,
    cheatsheet: `
### useDebounce Hook
\`\`\`tsx
import { useDebounce } from '@astacinco/rn-performance';

// Returns debounced value after delay (ms)
const debouncedValue = useDebounce(value, 300);
\`\`\`

### Input Component
\`\`\`tsx
<Input
  label="Label"
  placeholder="Placeholder..."
  value={value}
  onChangeText={setValue}
/>
\`\`\`
    `,
    nativeTimeMinutes: 20,
    nativeSolution: `
## Native Solution: Debounced Search

Without the \`useDebounce\` hook, you need to implement debouncing manually using \`useEffect\` and \`setTimeout\`.

\`\`\`tsx
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, TextInput, Text, ScrollView, StyleSheet } from 'react-native';

interface Item {
  id: string;
  title: string;
}

interface DebouncedSearchProps {
  items: Item[];
}

// Custom hook to replace @astacinco/rn-performance's useDebounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if value changes before delay completes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function DebouncedSearch({ items }: DebouncedSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Use our custom debounce hook
  const debouncedSearch = useDebounce(searchTerm, 300);

  // Filter items based on debounced search term
  const filteredItems = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return items;
    }
    return items.filter(item =>
      item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [items, debouncedSearch]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Search</Text>
      <TextInput
        style={styles.input}
        placeholder="Search items..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <Text style={styles.count}>
        Showing {filteredItems.length} of {items.length} items
      </Text>

      <ScrollView>
        {filteredItems.map(item => (
          <View key={item.id} style={styles.card}>
            <Text>{item.title}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  count: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginTop: 8,
  },
});
\`\`\`

### Key Differences from Packaged Version
- Must implement \`useDebounce\` hook manually
- Need to manage \`setTimeout\` and cleanup
- Manual styling instead of theme-aware components
- More boilerplate code
    `,
    nativeCheatsheet: `
### Manual Debounce Pattern
\`\`\`tsx
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedValue(value);
  }, delay);

  return () => clearTimeout(timer);
}, [value, delay]);
\`\`\`

### TextInput (React Native)
\`\`\`tsx
import { TextInput } from 'react-native';

<TextInput
  style={styles.input}
  placeholder="..."
  value={value}
  onChangeText={setValue}
/>
\`\`\`
    `,
    skills: ['Debouncing', 'Search UX', 'Performance optimization'],
  },
  {
    type: 'challenge',
    id: 'dark-mode-toggle',
    title: 'Dark Mode Toggle',
    description: 'Add a toggle to switch between light and dark themes.',
    difficulty: 'easy',
    timeMinutes: 10,
    packages: ['primitives', 'theming'],
    tier: 'free',
    instructions: `
## Dark Mode Toggle

Add a button or switch to toggle between light and dark themes.

### Requirements
- Add a theme toggle button in the header
- Use \`useTheme\` from \`@astacinco/rn-theming\`
- All components should adapt to theme change
- Persist theme choice (optional bonus)

### Acceptance Criteria
- [ ] Toggle button is visible
- [ ] Pressing toggles between light/dark
- [ ] Background color changes
- [ ] Text colors adapt
- [ ] All Card/Button components update
    `,
    solution: `
## Solution: Dark Mode Toggle

\`\`\`tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, VStack, HStack, Card } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';

export function DarkModeToggle() {
  const { mode, setMode, colors } = useTheme();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VStack spacing="lg">
        {/* Header with toggle */}
        <HStack justify="space-between" align="center">
          <Text variant="title">Settings</Text>
          <Button
            label={mode === 'light' ? '🌙 Dark' : '☀️ Light'}
            variant="ghost"
            size="sm"
            onPress={toggleTheme}
          />
        </HStack>

        {/* Theme indicator */}
        <Card variant="filled">
          <VStack spacing="sm">
            <Text variant="label">Current Theme</Text>
            <Text variant="body" color={colors.textSecondary}>
              {mode === 'light' ? 'Light Mode' : 'Dark Mode'}
            </Text>
          </VStack>
        </Card>

        {/* Demo content to show theme working */}
        <Card variant="outlined">
          <Text variant="body">
            This card adapts to the current theme automatically.
          </Text>
        </Card>

        <Button
          label="Primary Button"
          variant="primary"
          onPress={() => {}}
        />

        <Button
          label="Outline Button"
          variant="outline"
          onPress={() => {}}
        />
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
\`\`\`
    `,
    cheatsheet: `
### useTheme Hook
\`\`\`tsx
import { useTheme } from '@astacinco/rn-theming';

const { mode, setMode, colors, spacing } = useTheme();

// mode: 'light' | 'dark'
// setMode: (mode) => void
// colors: { background, text, primary, ... }
\`\`\`

### Theme Colors Available
- \`colors.background\` - Main background
- \`colors.text\` - Primary text
- \`colors.textSecondary\` - Secondary text
- \`colors.textMuted\` - Muted text
- \`colors.primary\` - Primary brand color
- \`colors.surface\` - Card/surface background
    `,
    nativeTimeMinutes: 15,
    nativeSolution: `
## Native Solution: Dark Mode Toggle

Without @astacinco/rn-theming, you need to create your own theme context and color definitions.

\`\`\`tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';

// Define theme colors
const lightColors = {
  background: '#ffffff',
  text: '#1a1a1a',
  textSecondary: '#666666',
  primary: '#1a73e8',
  surface: '#f5f5f5',
  border: '#e0e0e0',
};

const darkColors = {
  background: '#0a0a0a',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  primary: '#8ab4f8',
  surface: '#1a1a1a',
  border: '#333333',
};

type ThemeMode = 'light' | 'dark';
type Colors = typeof lightColors;

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: Colors;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// Theme Provider
export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemColorScheme ?? 'light');

  const colors = mode === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ mode, setMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// The actual component
export function DarkModeToggle() {
  const { mode, setMode, colors } = useTheme();

  const toggleTheme = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header with toggle */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Pressable
          onPress={toggleTheme}
          style={[styles.button, { borderColor: colors.border }]}
        >
          <Text style={{ color: colors.text }}>
            {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
          </Text>
        </Pressable>
      </View>

      {/* Theme indicator card */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.label, { color: colors.text }]}>Current Theme</Text>
        <Text style={{ color: colors.textSecondary }}>
          {mode === 'light' ? 'Light Mode' : 'Dark Mode'}
        </Text>
      </View>

      {/* Demo card */}
      <View style={[styles.card, { borderColor: colors.border, borderWidth: 1, backgroundColor: 'transparent' }]}>
        <Text style={{ color: colors.text }}>
          This card adapts to the current theme.
        </Text>
      </View>

      {/* Primary button */}
      <Pressable style={[styles.primaryButton, { backgroundColor: colors.primary }]}>
        <Text style={styles.primaryButtonText}>Primary Button</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});
\`\`\`

### Key Differences from Packaged Version
- Must define color tokens manually
- Must create ThemeContext and ThemeProvider
- No automatic system theme detection (manual with useColorScheme)
- Manual button/card styling instead of pre-built components
- More code to maintain
    `,
    nativeCheatsheet: `
### React Context Pattern
\`\`\`tsx
const ThemeContext = createContext<Value | null>(null);

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('...');
  return ctx;
}
\`\`\`

### useColorScheme (System Theme)
\`\`\`tsx
import { useColorScheme } from 'react-native';

const systemTheme = useColorScheme(); // 'light' | 'dark' | null
\`\`\`

### Define Color Tokens
\`\`\`tsx
const lightColors = {
  background: '#ffffff',
  text: '#1a1a1a',
  // ...
};
const darkColors = { ... };
\`\`\`
    `,
    skills: ['Theming', 'State management', 'UX'],
  },

  // --- Bonus Challenges ---
  {
    type: 'challenge',
    id: 'form-validation',
    title: 'Form Validation',
    description: 'Add input validation with error states and submission prevention.',
    difficulty: 'easy',
    timeMinutes: 15,
    packages: ['primitives'],
    tier: 'free',
    instructions: `
## Form Validation

Add validation to form inputs with visual error feedback.

### Requirements
- Validate required fields are not empty
- Show error message below invalid inputs
- Disable submit button until form is valid
- Use Input component's \`error\` prop

### Acceptance Criteria
- [ ] Empty fields show error on blur/submit
- [ ] Error message appears below input
- [ ] Submit button disabled when invalid
- [ ] Errors clear when corrected
    `,
    solution: `
## Solution: Form Validation

\`\`\`tsx
import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Input, Button, VStack, Card } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';

interface FormData {
  title: string;
  url: string;
}

interface FormErrors {
  title?: string;
  url?: string;
}

export function FormValidation() {
  const { colors } = useTheme();
  const [formData, setFormData] = useState<FormData>({ title: '', url: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.trim().length < 3) return 'Title must be at least 3 characters';
        return undefined;
      case 'url':
        if (!value.trim()) return 'URL is required';
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          return 'URL must start with http:// or https://';
        }
        return undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Validate on change if field was already touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const isFormValid = useMemo(() => {
    const titleError = validateField('title', formData.title);
    const urlError = validateField('url', formData.url);
    return !titleError && !urlError;
  }, [formData]);

  const handleSubmit = () => {
    // Validate all fields
    const newErrors: FormErrors = {
      title: validateField('title', formData.title),
      url: validateField('url', formData.url),
    };
    setErrors(newErrors);
    setTouched({ title: true, url: true });

    if (!newErrors.title && !newErrors.url) {
      console.log('Form submitted:', formData);
      // Reset form
      setFormData({ title: '', url: '' });
      setTouched({});
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card variant="elevated">
        <VStack spacing="md">
          <Text variant="subtitle">Add New Link</Text>

          <Input
            label="Title"
            placeholder="My awesome link"
            value={formData.title}
            onChangeText={(v) => handleChange('title', v)}
            onBlur={() => handleBlur('title')}
            error={errors.title}
          />

          <Input
            label="URL"
            placeholder="https://example.com"
            value={formData.url}
            onChangeText={(v) => handleChange('url', v)}
            onBlur={() => handleBlur('url')}
            error={errors.url}
            autoCapitalize="none"
            keyboardType="url"
          />

          <Button
            label="Add Link"
            variant="primary"
            disabled={!isFormValid}
            onPress={handleSubmit}
          />
        </VStack>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
\`\`\`
    `,
    cheatsheet: `
### Input with Error
\`\`\`tsx
<Input
  label="Title"
  value={value}
  onChangeText={setValue}
  onBlur={handleBlur}
  error={errorMessage}  // Shows red border + error text
/>
\`\`\`

### Button Disabled State
\`\`\`tsx
<Button
  label="Submit"
  disabled={!isValid}  // Grays out button
  onPress={handleSubmit}
/>
\`\`\`
    `,
    nativeTimeMinutes: 20,
    nativeSolution: `
## Native Solution: Form Validation

Without @astacinco/rn-primitives, you need to build your own Input with error state and styled Button.

\`\`\`tsx
import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

interface FormData {
  title: string;
  url: string;
}

interface FormErrors {
  title?: string;
  url?: string;
}

// Custom Input component with error state
function Input({
  label,
  value,
  onChangeText,
  onBlur,
  error,
  placeholder,
  ...props
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  [key: string]: any;
}) {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder={placeholder}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

export function FormValidation() {
  const [formData, setFormData] = useState<FormData>({ title: '', url: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.trim().length < 3) return 'Title must be at least 3 characters';
        return undefined;
      case 'url':
        if (!value.trim()) return 'URL is required';
        if (!value.startsWith('http://') && !value.startsWith('https://')) {
          return 'URL must start with http:// or https://';
        }
        return undefined;
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, formData[field]) }));
  };

  const isFormValid = useMemo(() => {
    return !validateField('title', formData.title) && !validateField('url', formData.url);
  }, [formData]);

  const handleSubmit = () => {
    if (isFormValid) {
      console.log('Submitted:', formData);
      setFormData({ title: '', url: '' });
      setTouched({});
      setErrors({});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.subtitle}>Add New Link</Text>

        <Input
          label="Title"
          placeholder="My awesome link"
          value={formData.title}
          onChangeText={(v) => handleChange('title', v)}
          onBlur={() => handleBlur('title')}
          error={errors.title}
        />

        <Input
          label="URL"
          placeholder="https://example.com"
          value={formData.url}
          onChangeText={(v) => handleChange('url', v)}
          onBlur={() => handleBlur('url')}
          error={errors.url}
          autoCapitalize="none"
          keyboardType="url"
        />

        <Pressable
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Add Link</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 2 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  inputError: { borderColor: '#dc2626' },
  errorText: { color: '#dc2626', fontSize: 12, marginTop: 4 },
  button: { backgroundColor: '#1a73e8', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
\`\`\`
    `,
    nativeCheatsheet: `
### TextInput with Error Border
\`\`\`tsx
<TextInput
  style={[styles.input, error && styles.inputError]}
  ...
/>
{error && <Text style={styles.errorText}>{error}</Text>}
\`\`\`

### Disabled Pressable
\`\`\`tsx
<Pressable
  disabled={!isValid}
  style={[styles.button, !isValid && styles.buttonDisabled]}
>
\`\`\`
    `,
    skills: ['Form handling', 'Validation', 'Error states'],
  },
  {
    type: 'challenge',
    id: 'loading-states',
    title: 'Loading States',
    description: 'Add loading indicators during async operations.',
    difficulty: 'easy',
    timeMinutes: 10,
    packages: ['primitives'],
    tier: 'free',
    instructions: `
## Loading States

Show loading feedback during async operations.

### Requirements
- Show loading indicator when submitting
- Disable form inputs during loading
- Simulate async delay (500ms)
- Clear loading state on completion

### Acceptance Criteria
- [ ] Button shows "Loading..." or similar
- [ ] Button is disabled during loading
- [ ] Inputs are disabled during loading
- [ ] Loading clears after operation
    `,
    solution: `
## Solution: Loading States

\`\`\`tsx
import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text, Input, Button, VStack, HStack, Card } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';

interface Link {
  id: string;
  title: string;
  url: string;
}

export function LoadingStates() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState<Link[]>([]);

  const handleSubmit = async () => {
    if (!title.trim() || !url.trim()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      // Add the new link
      const newLink: Link = {
        id: Date.now().toString(),
        title: title.trim(),
        url: url.trim(),
      };
      setLinks(prev => [...prev, newLink]);

      // Clear form
      setTitle('');
      setUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VStack spacing="lg">
        <Text variant="title">Add Link</Text>

        <Card variant="elevated">
          <VStack spacing="md">
            <Input
              label="Title"
              placeholder="Link title"
              value={title}
              onChangeText={setTitle}
              editable={!isLoading}
            />

            <Input
              label="URL"
              placeholder="https://..."
              value={url}
              onChangeText={setUrl}
              editable={!isLoading}
              autoCapitalize="none"
            />

            <Button
              label={isLoading ? 'Adding...' : 'Add Link'}
              variant="primary"
              disabled={isLoading || !title.trim() || !url.trim()}
              onPress={handleSubmit}
            />

            {isLoading && (
              <HStack justify="center" spacing="sm">
                <ActivityIndicator size="small" color={colors.primary} />
                <Text variant="caption" color={colors.textMuted}>
                  Saving link...
                </Text>
              </HStack>
            )}
          </VStack>
        </Card>

        {/* Display added links */}
        {links.length > 0 && (
          <VStack spacing="sm">
            <Text variant="label">Added Links ({links.length})</Text>
            {links.map(link => (
              <Card key={link.id} variant="outlined">
                <Text variant="body">{link.title}</Text>
                <Text variant="caption" color={colors.textMuted}>{link.url}</Text>
              </Card>
            ))}
          </VStack>
        )}
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
\`\`\`
    `,
    cheatsheet: `
### Loading Pattern
\`\`\`tsx
const [isLoading, setIsLoading] = useState(false);

const handleAsync = async () => {
  setIsLoading(true);
  try {
    await doAsyncWork();
  } finally {
    setIsLoading(false);  // Always clears loading
  }
};
\`\`\`

### Disable During Loading
\`\`\`tsx
<Input editable={!isLoading} ... />
<Button disabled={isLoading} ... />
\`\`\`

### ActivityIndicator
\`\`\`tsx
import { ActivityIndicator } from 'react-native';
<ActivityIndicator size="small" color={colors.primary} />
\`\`\`
    `,
    nativeTimeMinutes: 12,
    nativeSolution: `
## Native Solution: Loading States

The loading pattern is similar - main difference is styling components manually.

\`\`\`tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';

interface Link {
  id: string;
  title: string;
  url: string;
}

export function LoadingStates() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState<Link[]>([]);

  const handleSubmit = async () => {
    if (!title.trim() || !url.trim()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newLink: Link = {
        id: Date.now().toString(),
        title: title.trim(),
        url: url.trim(),
      };
      setLinks(prev => [...prev, newLink]);
      setTitle('');
      setUrl('');
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = title.trim() && url.trim();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Link</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Link title"
          value={title}
          onChangeText={setTitle}
          editable={!isLoading}
        />

        <Text style={styles.label}>URL</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          value={url}
          onChangeText={setUrl}
          editable={!isLoading}
          autoCapitalize="none"
        />

        <Pressable
          style={[styles.button, (!isValid || isLoading) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Adding...' : 'Add Link'}
          </Text>
        </Pressable>

        {isLoading && (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#1a73e8" />
            <Text style={styles.loadingText}>Saving link...</Text>
          </View>
        )}
      </View>

      {links.length > 0 && (
        <View style={styles.linksList}>
          <Text style={styles.label}>Added Links ({links.length})</Text>
          {links.map(link => (
            <View key={link.id} style={styles.linkCard}>
              <Text style={styles.linkTitle}>{link.title}</Text>
              <Text style={styles.linkUrl}>{link.url}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  button: { backgroundColor: '#1a73e8', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16 },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontWeight: '600' },
  loadingRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 12, gap: 8 },
  loadingText: { color: '#666', fontSize: 12 },
  linksList: { marginTop: 24 },
  linkCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  linkTitle: { fontWeight: '500' },
  linkUrl: { color: '#666', fontSize: 12, marginTop: 4 },
});
\`\`\`
    `,
    nativeCheatsheet: `
### editable prop
\`\`\`tsx
<TextInput editable={!isLoading} ... />
\`\`\`

### ActivityIndicator
\`\`\`tsx
<ActivityIndicator size="small" color="#1a73e8" />
\`\`\`

### try/finally for loading
\`\`\`tsx
setIsLoading(true);
try {
  await work();
} finally {
  setIsLoading(false);
}
\`\`\`
    `,
    skills: ['Async handling', 'UX feedback', 'State management'],
  },
  {
    type: 'challenge',
    id: 'empty-states',
    title: 'Empty States',
    description: 'Show helpful messages when lists are empty or searches have no results.',
    difficulty: 'easy',
    timeMinutes: 10,
    packages: ['primitives'],
    tier: 'free',
    instructions: `
## Empty States

Handle empty lists and no-results gracefully.

### Requirements
- Show message when list is empty
- Show different message when search has no results
- Include call-to-action where appropriate

### Acceptance Criteria
- [ ] Empty list shows "No items" message
- [ ] No search results shows "No results for X"
- [ ] CTA button is present
- [ ] Messages are styled appropriately
    `,
    solution: `
## Solution: Empty States

\`\`\`tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Input, Button, VStack, Card } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';

interface Link {
  id: string;
  title: string;
}

interface EmptyStateProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

function EmptyState({ message, actionLabel, onAction }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.emptyContainer}>
      <VStack spacing="md" align="center">
        <Text variant="body" color={colors.textMuted} style={styles.emptyText}>
          {message}
        </Text>
        {actionLabel && onAction && (
          <Button
            label={actionLabel}
            variant="outline"
            size="sm"
            onPress={onAction}
          />
        )}
      </VStack>
    </View>
  );
}

export function EmptyStates() {
  const { colors } = useTheme();
  const [links, setLinks] = useState<Link[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLink = (title: string) => {
    setLinks(prev => [...prev, { id: Date.now().toString(), title }]);
    setShowAddForm(false);
  };

  const clearSearch = () => setSearchTerm('');

  // Determine which empty state to show
  const renderContent = () => {
    // Case 1: No links at all
    if (links.length === 0) {
      return (
        <EmptyState
          message="No links yet. Add your first link to get started!"
          actionLabel="Add your first link"
          onAction={() => setShowAddForm(true)}
        />
      );
    }

    // Case 2: Has links but search has no results
    if (filteredLinks.length === 0 && searchTerm) {
      return (
        <EmptyState
          message={\`No results for "\${searchTerm}"\`}
          actionLabel="Clear search"
          onAction={clearSearch}
        />
      );
    }

    // Case 3: Show the filtered links
    return (
      <ScrollView>
        <VStack spacing="sm">
          {filteredLinks.map(link => (
            <Card key={link.id} variant="outlined">
              <Text variant="body">{link.title}</Text>
            </Card>
          ))}
        </VStack>
      </ScrollView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <VStack spacing="md" style={styles.content}>
        <Text variant="title">My Links</Text>

        {/* Only show search if we have links */}
        {links.length > 0 && (
          <Input
            placeholder="Search links..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        )}

        {renderContent()}

        {/* Add link button (when we have links) */}
        {links.length > 0 && (
          <Button
            label="+ Add Link"
            variant="primary"
            onPress={() => setShowAddForm(true)}
          />
        )}
      </VStack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
  },
});
\`\`\`
    `,
    cheatsheet: `
### Empty State Pattern
\`\`\`tsx
// No items at all
{items.length === 0 && !searchTerm && (
  <EmptyState message="No items yet" />
)}

// Search has no results
{items.length === 0 && searchTerm && (
  <EmptyState message={\`No results for "\${searchTerm}"\`} />
)}
\`\`\`

### Center Content
\`\`\`tsx
const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});
\`\`\`
    `,
    nativeTimeMinutes: 12,
    nativeSolution: `
## Native Solution: Empty States

Very similar logic - just manual styling for the empty state component.

\`\`\`tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';

interface Link {
  id: string;
  title: string;
}

function EmptyState({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{message}</Text>
      {actionLabel && onAction && (
        <Pressable style={styles.outlineButton} onPress={onAction}>
          <Text style={styles.outlineButtonText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function EmptyStates() {
  const [links, setLinks] = useState<Link[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLink = (title: string) => {
    setLinks(prev => [...prev, { id: Date.now().toString(), title }]);
    setShowAddForm(false);
  };

  const renderContent = () => {
    // No links at all
    if (links.length === 0) {
      return (
        <EmptyState
          message="No links yet. Add your first link to get started!"
          actionLabel="Add your first link"
          onAction={() => setShowAddForm(true)}
        />
      );
    }

    // Has links but search has no results
    if (filteredLinks.length === 0 && searchTerm) {
      return (
        <EmptyState
          message={\`No results for "\${searchTerm}"\`}
          actionLabel="Clear search"
          onAction={() => setSearchTerm('')}
        />
      );
    }

    // Show filtered links
    return (
      <ScrollView>
        {filteredLinks.map(link => (
          <View key={link.id} style={styles.linkCard}>
            <Text>{link.title}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Links</Text>

      {links.length > 0 && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search links..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
      )}

      <View style={styles.content}>{renderContent()}</View>

      {links.length > 0 && (
        <Pressable style={styles.addButton} onPress={() => setShowAddForm(true)}>
          <Text style={styles.addButtonText}>+ Add Link</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  content: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  searchInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#fff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#666', textAlign: 'center', marginBottom: 16 },
  outlineButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#1a73e8' },
  outlineButtonText: { color: '#1a73e8' },
  linkCard: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  addButton: { backgroundColor: '#1a73e8', padding: 16, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontWeight: '600' },
});
\`\`\`
    `,
    nativeCheatsheet: `
### Conditional Empty States
\`\`\`tsx
if (items.length === 0) {
  return <EmptyState message="..." />;
}
if (filtered.length === 0 && searchTerm) {
  return <EmptyState message="No results" />;
}
return <List items={filtered} />;
\`\`\`

### Center with Flex
\`\`\`tsx
{
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
}
\`\`\`
    `,
    skills: ['UX design', 'Conditional rendering', 'Edge cases'],
  },

  // --- Additional Generic Challenges (from scenarios) ---
  {
    type: 'challenge',
    id: 'settings-screen',
    title: 'Settings Screen',
    description: 'Build a settings screen with preferences, profile card, and notification toggles.',
    difficulty: 'easy',
    timeMinutes: 45,
    packages: ['primitives', 'theming', 'i18n'],
    tier: 'free',
    instructions: `
## Settings Screen

Build a complete settings screen with multiple preference sections.

### Requirements
- Theme toggle (light/dark/auto)
- Language selector with i18n
- Notification preference toggles
- User profile card
- About section with version info

### Sections to Build
1. **Profile Card** - Avatar, name, email
2. **Appearance** - Theme toggle
3. **Language** - Language selector
4. **Notifications** - Push, email, marketing toggles
5. **About** - Version, privacy, terms links

### Acceptance Criteria
- [ ] All sections render
- [ ] Theme toggle works
- [ ] Language changes text (if i18n configured)
- [ ] Toggles persist state
- [ ] Clean visual hierarchy
    `,
    solution: `
## Solution: Settings Screen

\`\`\`tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { Text, Button, VStack, HStack, Card, Divider } from '@astacinco/rn-primitives';
import { useTheme, ThemeMode } from '@astacinco/rn-theming';

interface NotificationSettings {
  push: boolean;
  email: boolean;
  marketing: boolean;
}

export function SettingsScreen() {
  const { mode, setMode, colors } = useTheme();
  const [notifications, setNotifications] = useState<NotificationSettings>({
    push: true,
    email: true,
    marketing: false,
  });

  const toggleNotification = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ThemeButton = ({ value, label }: { value: ThemeMode; label: string }) => (
    <Button
      label={label}
      variant={mode === value ? 'primary' : 'outline'}
      size="sm"
      onPress={() => setMode(value)}
    />
  );

  const SettingRow = ({
    label,
    description,
    value,
    onToggle,
  }: {
    label: string;
    description?: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <HStack justify="space-between" align="center">
      <VStack spacing="xs" style={{ flex: 1 }}>
        <Text variant="body">{label}</Text>
        {description && (
          <Text variant="caption" color={colors.textMuted}>
            {description}
          </Text>
        )}
      </VStack>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.surface, true: colors.primary }}
      />
    </HStack>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <VStack spacing="lg" style={styles.content}>
        {/* Profile Card */}
        <Card variant="elevated">
          <HStack spacing="md" align="center">
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text variant="title" style={{ color: '#fff' }}>JD</Text>
            </View>
            <VStack spacing="xs">
              <Text variant="subtitle">John Doe</Text>
              <Text variant="caption" color={colors.textMuted}>
                john.doe@example.com
              </Text>
            </VStack>
          </HStack>
        </Card>

        {/* Appearance */}
        <Card variant="filled">
          <VStack spacing="md">
            <Text variant="label">Appearance</Text>
            <HStack spacing="sm">
              <ThemeButton value="light" label="☀️ Light" />
              <ThemeButton value="dark" label="🌙 Dark" />
              <ThemeButton value="auto" label="🔄 Auto" />
            </HStack>
          </VStack>
        </Card>

        {/* Notifications */}
        <Card variant="filled">
          <VStack spacing="md">
            <Text variant="label">Notifications</Text>

            <SettingRow
              label="Push Notifications"
              description="Receive alerts on your device"
              value={notifications.push}
              onToggle={() => toggleNotification('push')}
            />

            <Divider />

            <SettingRow
              label="Email Notifications"
              description="Receive updates via email"
              value={notifications.email}
              onToggle={() => toggleNotification('email')}
            />

            <Divider />

            <SettingRow
              label="Marketing"
              description="Receive promotional content"
              value={notifications.marketing}
              onToggle={() => toggleNotification('marketing')}
            />
          </VStack>
        </Card>

        {/* About */}
        <Card variant="outlined">
          <VStack spacing="md">
            <Text variant="label">About</Text>
            <HStack justify="space-between">
              <Text variant="body">Version</Text>
              <Text variant="body" color={colors.textMuted}>1.0.0</Text>
            </HStack>
            <Divider />
            <Button label="Privacy Policy" variant="ghost" size="sm" onPress={() => {}} />
            <Button label="Terms of Service" variant="ghost" size="sm" onPress={() => {}} />
          </VStack>
        </Card>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
\`\`\`
    `,
    cheatsheet: `
### Switch Component (React Native)
\`\`\`tsx
import { Switch } from 'react-native';

<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  trackColor={{ false: colors.surface, true: colors.primary }}
/>
\`\`\`

### Theme Mode Options
\`\`\`tsx
type ThemeMode = 'light' | 'dark' | 'auto';
setMode('auto');  // Follow system
\`\`\`

### Section Pattern
\`\`\`tsx
<Card variant="filled">
  <VStack spacing="md">
    <Text variant="label">Section Title</Text>
    {/* Section content */}
  </VStack>
</Card>
\`\`\`
    `,
    nativeTimeMinutes: 60,
    nativeSolution: `
## Native Solution: Settings Screen

Requires building theme context, styled sections, and toggle rows from scratch.

\`\`\`tsx
import React, { useState, createContext, useContext, ReactNode } from 'react';
import { View, Text, ScrollView, Switch, Pressable, StyleSheet, useColorScheme } from 'react-native';

// Theme setup (same as dark-mode-toggle native solution)
const lightColors = {
  background: '#f5f5f5', surface: '#ffffff', text: '#1a1a1a',
  textSecondary: '#666', textMuted: '#999', primary: '#1a73e8', border: '#e0e0e0',
};
const darkColors = {
  background: '#0a0a0a', surface: '#1a1a1a', text: '#ffffff',
  textSecondary: '#a0a0a0', textMuted: '#666', primary: '#8ab4f8', border: '#333',
};

type ThemeMode = 'light' | 'dark' | 'auto';
const ThemeContext = createContext<{
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  colors: typeof lightColors;
} | null>(null);

function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('auto');
  const effectiveMode = mode === 'auto' ? (system ?? 'light') : mode;
  const colors = effectiveMode === 'light' ? lightColors : darkColors;
  return (
    <ThemeContext.Provider value={{ mode, setMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme requires ThemeProvider');
  return ctx;
}

// Reusable components
function Section({ title, children, colors }: { title: string; children: ReactNode; colors: typeof lightColors }) {
  return (
    <View style={[styles.section, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function SettingRow({ label, description, value, onToggle, colors }: {
  label: string; description?: string; value: boolean; onToggle: () => void; colors: typeof lightColors;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text }}>{label}</Text>
        {description && <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>}
      </View>
      <Switch value={value} onValueChange={onToggle} trackColor={{ false: colors.border, true: colors.primary }} />
    </View>
  );
}

function Divider({ colors }: { colors: typeof lightColors }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

// Main component
function SettingsContent() {
  const { mode, setMode, colors } = useTheme();
  const [notifications, setNotifications] = useState({ push: true, email: true, marketing: false });

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const ThemeBtn = ({ value, label }: { value: ThemeMode; label: string }) => (
    <Pressable
      style={[styles.themeBtn, { borderColor: colors.border }, mode === value && { backgroundColor: colors.primary }]}
      onPress={() => setMode(value)}
    >
      <Text style={{ color: mode === value ? '#fff' : colors.text }}>{label}</Text>
    </Pressable>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Profile */}
      <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <View>
          <Text style={[styles.profileName, { color: colors.text }]}>John Doe</Text>
          <Text style={{ color: colors.textMuted }}>john.doe@example.com</Text>
        </View>
      </View>

      {/* Appearance */}
      <Section title="Appearance" colors={colors}>
        <View style={styles.themeBtnRow}>
          <ThemeBtn value="light" label="☀️ Light" />
          <ThemeBtn value="dark" label="🌙 Dark" />
          <ThemeBtn value="auto" label="🔄 Auto" />
        </View>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" colors={colors}>
        <SettingRow label="Push Notifications" description="Receive alerts" value={notifications.push} onToggle={() => toggleNotif('push')} colors={colors} />
        <Divider colors={colors} />
        <SettingRow label="Email Notifications" description="Receive updates" value={notifications.email} onToggle={() => toggleNotif('email')} colors={colors} />
        <Divider colors={colors} />
        <SettingRow label="Marketing" description="Promotional content" value={notifications.marketing} onToggle={() => toggleNotif('marketing')} colors={colors} />
      </Section>

      {/* About */}
      <Section title="About" colors={colors}>
        <View style={styles.aboutRow}>
          <Text style={{ color: colors.text }}>Version</Text>
          <Text style={{ color: colors.textMuted }}>1.0.0</Text>
        </View>
      </Section>
    </ScrollView>
  );
}

export function SettingsScreen() {
  return (
    <ThemeProvider>
      <SettingsContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 16, margin: 16, borderRadius: 12, gap: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  profileName: { fontSize: 18, fontWeight: '600' },
  section: { margin: 16, marginTop: 0, padding: 16, borderRadius: 12 },
  sectionTitle: { fontSize: 12, fontWeight: '600', marginBottom: 12, textTransform: 'uppercase' },
  themeBtnRow: { flexDirection: 'row', gap: 8 },
  themeBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  description: { fontSize: 12, marginTop: 2 },
  divider: { height: 1, marginVertical: 8 },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between' },
});
\`\`\`
    `,
    nativeCheatsheet: `
### Switch with custom colors
\`\`\`tsx
<Switch
  value={value}
  onValueChange={toggle}
  trackColor={{ false: '#ccc', true: '#1a73e8' }}
/>
\`\`\`

### Section pattern
\`\`\`tsx
<View style={styles.section}>
  <Text style={styles.sectionTitle}>Title</Text>
  {children}
</View>
\`\`\`

### useColorScheme
\`\`\`tsx
const system = useColorScheme(); // 'light' | 'dark' | null
\`\`\`
    `,
    skills: ['Settings UI', 'Multiple toggles', 'Section layout', 'Profile display'],
  },
  {
    type: 'challenge',
    id: 'login-form',
    title: 'Login Form',
    description: 'Build a login form with validation, password visibility toggle, and error handling.',
    difficulty: 'medium',
    timeMinutes: 45,
    packages: ['primitives', 'theming', 'performance'],
    tier: 'free',
    instructions: `
## Login Form

Build a complete login form with proper validation and UX.

### Requirements
- Email and password inputs
- Email format validation
- Password minimum length (8 chars)
- Show/hide password toggle
- Remember me checkbox
- Loading state on submit
- Error message display
- Debounced email validation

### Implementation Notes
- Use Input component with \`secureTextEntry\`
- Validate email with regex
- Show inline errors
- Disable submit until valid

### Acceptance Criteria
- [ ] Email validates format
- [ ] Password validates length
- [ ] Password visibility toggle works
- [ ] Submit disabled until valid
- [ ] Loading state shows on submit
- [ ] Errors display appropriately
    `,
    solution: `
## Solution: Login Form

\`\`\`tsx
import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Input, Button, VStack, HStack, Card, Divider } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';
import { useDebounce } from '@astacinco/rn-performance';

const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

export function LoginForm() {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>();

  // Debounced email for validation (don't validate on every keystroke)
  const debouncedEmail = useDebounce(email, 300);

  // Validation
  const emailError = useMemo(() => {
    if (!debouncedEmail) return undefined;
    if (!EMAIL_REGEX.test(debouncedEmail)) return 'Invalid email format';
    return undefined;
  }, [debouncedEmail]);

  const passwordError = useMemo(() => {
    if (!password) return undefined;
    if (password.length < 8) return 'Password must be at least 8 characters';
    return undefined;
  }, [password]);

  const isFormValid = email && password && !emailError && !passwordError;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setLoginError(undefined);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate random failure for demo
      if (Math.random() > 0.7) {
        throw new Error('Invalid credentials');
      }

      console.log('Login success:', { email, rememberMe });
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Card variant="elevated">
        <VStack spacing="lg">
          <Text variant="title">Sign In</Text>

          {loginError && (
            <Card variant="filled" style={{ backgroundColor: colors.error + '20' }}>
              <Text variant="body" color={colors.error}>{loginError}</Text>
            </Card>
          )}

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />

          <VStack spacing="xs">
            <Input
              label="Password"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              error={passwordError}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Text variant="caption" color={colors.primary}>
                {showPassword ? 'Hide password' : 'Show password'}
              </Text>
            </Pressable>
          </VStack>

          <HStack spacing="sm" align="center">
            <Pressable
              onPress={() => setRememberMe(!rememberMe)}
              style={[styles.checkbox, { borderColor: colors.border }, rememberMe && { backgroundColor: colors.primary }]}
            >
              {rememberMe && <Text style={{ color: '#fff' }}>✓</Text>}
            </Pressable>
            <Text variant="body">Remember me</Text>
          </HStack>

          <Button
            label={isLoading ? 'Signing in...' : 'Sign In'}
            variant="primary"
            disabled={!isFormValid || isLoading}
            onPress={handleSubmit}
          />

          <Divider />

          <Button
            label="Forgot password?"
            variant="ghost"
            size="sm"
            onPress={() => {}}
          />
        </VStack>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
});
\`\`\`
    `,
    cheatsheet: `
### Email Validation Regex
\`\`\`tsx
const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
EMAIL_REGEX.test(email); // true/false
\`\`\`

### secureTextEntry (password)
\`\`\`tsx
<Input secureTextEntry={!showPassword} ... />
\`\`\`

### Debounced Validation
\`\`\`tsx
const debouncedEmail = useDebounce(email, 300);
const error = useMemo(() => validate(debouncedEmail), [debouncedEmail]);
\`\`\`
    `,
    nativeTimeMinutes: 60,
    nativeSolution: `
## Native Solution: Login Form

\`\`\`tsx
import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';

const EMAIL_REGEX = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>();

  const debouncedEmail = useDebounce(email, 300);

  const emailError = useMemo(() => {
    if (!debouncedEmail) return undefined;
    if (!EMAIL_REGEX.test(debouncedEmail)) return 'Invalid email format';
    return undefined;
  }, [debouncedEmail]);

  const passwordError = useMemo(() => {
    if (!password) return undefined;
    if (password.length < 8) return 'Password must be at least 8 characters';
    return undefined;
  }, [password]);

  const isFormValid = email && password && !emailError && !passwordError;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsLoading(true);
    setLoginError(undefined);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (Math.random() > 0.7) throw new Error('Invalid credentials');
      console.log('Login success');
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Sign In</Text>

        {loginError && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{loginError}</Text>
          </View>
        )}

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[styles.input, passwordError && styles.inputError]}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          editable={!isLoading}
        />
        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.togglePassword}>{showPassword ? 'Hide' : 'Show'} password</Text>
        </Pressable>

        {/* Remember me */}
        <Pressable style={styles.checkboxRow} onPress={() => setRememberMe(!rememberMe)}>
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text>Remember me</Text>
        </Pressable>

        {/* Submit */}
        <Pressable
          style={[styles.button, (!isFormValid || isLoading) && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', padding: 24, borderRadius: 12, elevation: 3 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', marginTop: 16, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12 },
  inputError: { borderColor: '#dc2626' },
  errorText: { color: '#dc2626', fontSize: 12, marginTop: 4 },
  errorBanner: { backgroundColor: '#fee2e2', padding: 12, borderRadius: 8, marginBottom: 16 },
  errorBannerText: { color: '#dc2626' },
  togglePassword: { color: '#1a73e8', fontSize: 12, marginTop: 4 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 8 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: '#ccc', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#1a73e8', borderColor: '#1a73e8' },
  checkmark: { color: '#fff', fontSize: 12 },
  button: { backgroundColor: '#1a73e8', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontWeight: '600' },
});
\`\`\`
    `,
    nativeCheatsheet: `
### secureTextEntry
\`\`\`tsx
<TextInput secureTextEntry={!showPassword} />
\`\`\`

### Email Regex
\`\`\`tsx
/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)
\`\`\`

### Custom checkbox
\`\`\`tsx
<Pressable onPress={toggle}>
  <View style={[styles.box, checked && styles.checked]}>
    {checked && <Text>✓</Text>}
  </View>
</Pressable>
\`\`\`
    `,
    skills: ['Form validation', 'Password handling', 'Email validation', 'Error states'],
  },
  {
    type: 'challenge',
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Build a dashboard with metric cards, time filters, and activity feed.',
    difficulty: 'hard',
    timeMinutes: 60,
    packages: ['primitives', 'theming', 'i18n', 'performance'],
    tier: 'free',
    instructions: `
## Analytics Dashboard

Build a dashboard displaying metrics and activity.

### Requirements
- Summary cards (views, clicks, revenue)
- Time period filter (Today, Week, Month, Year)
- Activity feed/timeline
- Number formatting with i18n
- Currency formatting
- Refresh functionality

### Sections to Build
1. **Summary Row** - 3-4 metric cards
2. **Time Filter** - Button group for period
3. **Chart Area** - Placeholder or simple bar
4. **Activity Feed** - Recent events list

### Acceptance Criteria
- [ ] Metric cards show values
- [ ] Time filter updates data
- [ ] Numbers are formatted (1,234)
- [ ] Currency shows symbol
- [ ] Activity feed scrolls
- [ ] Theme adapts all sections
    `,
    solution: `
## Solution: Analytics Dashboard

\`\`\`tsx
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, VStack, HStack, Card, Divider } from '@astacinco/rn-primitives';
import { useTheme } from '@astacinco/rn-theming';
import { useTranslation } from '@astacinco/rn-i18n';
import { useDebounce } from '@astacinco/rn-performance';

type TimePeriod = 'today' | 'week' | 'month' | 'year';

interface MetricData {
  views: number;
  clicks: number;
  revenue: number;
  conversionRate: number;
}

interface ActivityEvent {
  id: string;
  type: 'click' | 'purchase' | 'signup';
  description: string;
  timestamp: Date;
}

// Mock data generator based on time period
const generateMetrics = (period: TimePeriod): MetricData => {
  const multiplier = { today: 1, week: 7, month: 30, year: 365 }[period];
  return {
    views: Math.floor(1234 * multiplier),
    clicks: Math.floor(567 * multiplier),
    revenue: Math.floor(2345.67 * multiplier),
    conversionRate: 3.2 + Math.random() * 2,
  };
};

const generateActivity = (): ActivityEvent[] => [
  { id: '1', type: 'purchase', description: 'New purchase from John D.', timestamp: new Date() },
  { id: '2', type: 'click', description: 'Link "Portfolio" clicked', timestamp: new Date(Date.now() - 3600000) },
  { id: '3', type: 'signup', description: 'New subscriber added', timestamp: new Date(Date.now() - 7200000) },
  { id: '4', type: 'click', description: 'Link "Shop" clicked 5 times', timestamp: new Date(Date.now() - 10800000) },
  { id: '5', type: 'purchase', description: 'New purchase from Sarah M.', timestamp: new Date(Date.now() - 14400000) },
];

// Metric Card Component
function MetricCard({
  label,
  value,
  format = 'number',
  trend,
}: {
  label: string;
  value: number;
  format?: 'number' | 'currency' | 'percent';
  trend?: number;
}) {
  const { colors } = useTheme();
  const { formatNumber, formatCurrency } = useTranslation();

  const formattedValue = format === 'currency'
    ? formatCurrency(value)
    : format === 'percent'
    ? \`\${value.toFixed(1)}%\`
    : formatNumber(value);

  return (
    <Card variant="filled" style={styles.metricCard}>
      <VStack spacing="xs">
        <Text variant="caption" color={colors.textMuted}>{label}</Text>
        <Text variant="title">{formattedValue}</Text>
        {trend !== undefined && (
          <Text
            variant="caption"
            color={trend >= 0 ? colors.success : colors.error}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          </Text>
        )}
      </VStack>
    </Card>
  );
}

// Time Filter Component
function TimeFilter({
  selected,
  onSelect
}: {
  selected: TimePeriod;
  onSelect: (period: TimePeriod) => void;
}) {
  const periods: TimePeriod[] = ['today', 'week', 'month', 'year'];
  const labels = { today: 'Today', week: 'Week', month: 'Month', year: 'Year' };

  return (
    <HStack spacing="sm">
      {periods.map(period => (
        <Button
          key={period}
          label={labels[period]}
          variant={selected === period ? 'primary' : 'outline'}
          size="sm"
          onPress={() => onSelect(period)}
        />
      ))}
    </HStack>
  );
}

// Activity Item Component
function ActivityItem({ event }: { event: ActivityEvent }) {
  const { colors } = useTheme();

  const typeIcon = {
    click: '👆',
    purchase: '💰',
    signup: '👤',
  }[event.type];

  const timeAgo = (date: Date) => {
    const mins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (mins < 60) return \`\${mins}m ago\`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return \`\${hours}h ago\`;
    return \`\${Math.floor(hours / 24)}d ago\`;
  };

  return (
    <HStack spacing="sm" align="center">
      <Text variant="body">{typeIcon}</Text>
      <VStack spacing="xs" style={{ flex: 1 }}>
        <Text variant="body">{event.description}</Text>
        <Text variant="caption" color={colors.textMuted}>{timeAgo(event.timestamp)}</Text>
      </VStack>
    </HStack>
  );
}

export function AnalyticsDashboard() {
  const { colors, mode, setMode } = useTheme();
  const [period, setPeriod] = useState<TimePeriod>('week');
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState(() => generateMetrics('week'));
  const [activity] = useState(generateActivity);

  // Debounce period changes to prevent rapid re-fetching
  const debouncedPeriod = useDebounce(period, 200);

  const handlePeriodChange = (newPeriod: TimePeriod) => {
    setPeriod(newPeriod);
    setMetrics(generateMetrics(newPeriod));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMetrics(generateMetrics(period));
    setRefreshing(false);
  }, [period]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <VStack spacing="lg" style={styles.content}>
        {/* Header */}
        <HStack justify="space-between" align="center">
          <Text variant="title">Dashboard</Text>
          <Button
            label={mode === 'light' ? '🌙' : '☀️'}
            variant="ghost"
            size="sm"
            onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
          />
        </HStack>

        {/* Time Filter */}
        <TimeFilter selected={period} onSelect={handlePeriodChange} />

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard label="Total Views" value={metrics.views} trend={12.5} />
          <MetricCard label="Clicks" value={metrics.clicks} trend={-3.2} />
          <MetricCard label="Revenue" value={metrics.revenue} format="currency" trend={8.7} />
          <MetricCard label="Conversion" value={metrics.conversionRate} format="percent" />
        </View>

        {/* Simple Chart Placeholder */}
        <Card variant="outlined">
          <VStack spacing="md">
            <Text variant="label">Performance Overview</Text>
            <View style={styles.chartPlaceholder}>
              <HStack spacing="sm" align="flex-end" style={{ height: 100 }}>
                {[0.4, 0.6, 0.3, 0.8, 0.5, 0.7, 0.9].map((height, i) => (
                  <View
                    key={i}
                    style={[
                      styles.chartBar,
                      { height: \`\${height * 100}%\`, backgroundColor: colors.primary }
                    ]}
                  />
                ))}
              </HStack>
            </View>
            <HStack justify="space-between">
              <Text variant="caption" color={colors.textMuted}>Mon</Text>
              <Text variant="caption" color={colors.textMuted}>Sun</Text>
            </HStack>
          </VStack>
        </Card>

        {/* Activity Feed */}
        <Card variant="filled">
          <VStack spacing="md">
            <HStack justify="space-between" align="center">
              <Text variant="label">Recent Activity</Text>
              <Text variant="caption" color={colors.primary}>View All</Text>
            </HStack>
            <VStack spacing="sm">
              {activity.map((event, index) => (
                <React.Fragment key={event.id}>
                  <ActivityItem event={event} />
                  {index < activity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </VStack>
          </VStack>
        </Card>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
  },
  chartPlaceholder: {
    height: 120,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  chartBar: {
    flex: 1,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
\`\`\`
    `,
    cheatsheet: `
### formatNumber / formatCurrency
\`\`\`tsx
import { useTranslation } from '@astacinco/rn-i18n';

const { formatNumber, formatCurrency } = useTranslation();
formatNumber(1234);     // "1,234"
formatCurrency(99.99);  // "$99.99"
\`\`\`

### RefreshControl
\`\`\`tsx
import { RefreshControl, ScrollView } from 'react-native';

<ScrollView
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
\`\`\`

### Time Period Pattern
\`\`\`tsx
type TimePeriod = 'today' | 'week' | 'month' | 'year';
const [period, setPeriod] = useState<TimePeriod>('week');
\`\`\`

### Metric Card Pattern
\`\`\`tsx
<Card variant="filled">
  <VStack spacing="xs">
    <Text variant="caption">{label}</Text>
    <Text variant="title">{value}</Text>
    <Text color={trend >= 0 ? colors.success : colors.error}>
      {trend >= 0 ? '↑' : '↓'} {trend}%
    </Text>
  </VStack>
</Card>
\`\`\`
    `,
    nativeTimeMinutes: 80,
    nativeSolution: `
## Native Solution: Analytics Dashboard

Requires implementing number formatting, building metric cards, and creating the activity feed from scratch.

\`\`\`tsx
import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, StyleSheet, useColorScheme } from 'react-native';

// Theme setup
const lightColors = {
  background: '#f5f5f5', surface: '#ffffff', text: '#1a1a1a',
  textSecondary: '#666', textMuted: '#999', primary: '#1a73e8',
  border: '#e0e0e0', success: '#16a34a', error: '#dc2626',
};
const darkColors = {
  background: '#0a0a0a', surface: '#1a1a1a', text: '#ffffff',
  textSecondary: '#a0a0a0', textMuted: '#666', primary: '#8ab4f8',
  border: '#333', success: '#22c55e', error: '#f87171',
};

type ThemeMode = 'light' | 'dark';
const ThemeContext = createContext<{
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  colors: typeof lightColors;
} | null>(null);

function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(system ?? 'light');
  const colors = mode === 'light' ? lightColors : darkColors;
  return (
    <ThemeContext.Provider value={{ mode, setMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme requires ThemeProvider');
  return ctx;
}

// Number formatting utilities
function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

type TimePeriod = 'today' | 'week' | 'month' | 'year';

interface MetricData {
  views: number;
  clicks: number;
  revenue: number;
  conversionRate: number;
}

interface ActivityEvent {
  id: string;
  type: 'click' | 'purchase' | 'signup';
  description: string;
  timestamp: Date;
}

// Mock data
const generateMetrics = (period: TimePeriod): MetricData => {
  const mult = { today: 1, week: 7, month: 30, year: 365 }[period];
  return {
    views: Math.floor(1234 * mult),
    clicks: Math.floor(567 * mult),
    revenue: Math.floor(2345.67 * mult),
    conversionRate: 3.2 + Math.random() * 2,
  };
};

const generateActivity = (): ActivityEvent[] => [
  { id: '1', type: 'purchase', description: 'New purchase from John D.', timestamp: new Date() },
  { id: '2', type: 'click', description: 'Link "Portfolio" clicked', timestamp: new Date(Date.now() - 3600000) },
  { id: '3', type: 'signup', description: 'New subscriber added', timestamp: new Date(Date.now() - 7200000) },
];

// Metric Card
function MetricCard({ label, value, format = 'number', trend, colors }: {
  label: string;
  value: number;
  format?: 'number' | 'currency' | 'percent';
  trend?: number;
  colors: typeof lightColors;
}) {
  const formatted = format === 'currency'
    ? formatCurrency(value)
    : format === 'percent'
    ? \`\${value.toFixed(1)}%\`
    : formatNumber(value);

  return (
    <View style={[styles.metricCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.metricLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: colors.text }]}>{formatted}</Text>
      {trend !== undefined && (
        <Text style={{ color: trend >= 0 ? colors.success : colors.error, fontSize: 12 }}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
        </Text>
      )}
    </View>
  );
}

// Time Filter
function TimeFilter({ selected, onSelect, colors }: {
  selected: TimePeriod;
  onSelect: (p: TimePeriod) => void;
  colors: typeof lightColors;
}) {
  const periods: TimePeriod[] = ['today', 'week', 'month', 'year'];
  const labels = { today: 'Today', week: 'Week', month: 'Month', year: 'Year' };

  return (
    <View style={styles.filterRow}>
      {periods.map(p => (
        <Pressable
          key={p}
          style={[
            styles.filterBtn,
            { borderColor: colors.border },
            selected === p && { backgroundColor: colors.primary },
          ]}
          onPress={() => onSelect(p)}
        >
          <Text style={{ color: selected === p ? '#fff' : colors.text }}>{labels[p]}</Text>
        </Pressable>
      ))}
    </View>
  );
}

// Activity Item
function ActivityItem({ event, colors }: { event: ActivityEvent; colors: typeof lightColors }) {
  const icon = { click: '👆', purchase: '💰', signup: '👤' }[event.type];
  const mins = Math.floor((Date.now() - event.timestamp.getTime()) / 60000);
  const timeAgo = mins < 60 ? \`\${mins}m ago\` : \`\${Math.floor(mins / 60)}h ago\`;

  return (
    <View style={styles.activityItem}>
      <Text style={styles.activityIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text }}>{event.description}</Text>
        <Text style={{ color: colors.textMuted, fontSize: 12 }}>{timeAgo}</Text>
      </View>
    </View>
  );
}

// Main Dashboard Content
function DashboardContent() {
  const { colors, mode, setMode } = useTheme();
  const [period, setPeriod] = useState<TimePeriod>('week');
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState(() => generateMetrics('week'));
  const [activity] = useState(generateActivity);

  const handlePeriodChange = (p: TimePeriod) => {
    setPeriod(p);
    setMetrics(generateMetrics(p));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setMetrics(generateMetrics(period));
    setRefreshing(false);
  }, [period]);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
          <Pressable onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}>
            <Text style={{ fontSize: 24 }}>{mode === 'light' ? '🌙' : '☀️'}</Text>
          </Pressable>
        </View>

        {/* Time Filter */}
        <TimeFilter selected={period} onSelect={handlePeriodChange} colors={colors} />

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <MetricCard label="Total Views" value={metrics.views} trend={12.5} colors={colors} />
          <MetricCard label="Clicks" value={metrics.clicks} trend={-3.2} colors={colors} />
          <MetricCard label="Revenue" value={metrics.revenue} format="currency" trend={8.7} colors={colors} />
          <MetricCard label="Conversion" value={metrics.conversionRate} format="percent" colors={colors} />
        </View>

        {/* Simple Chart */}
        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Performance Overview</Text>
          <View style={styles.chartArea}>
            {[0.4, 0.6, 0.3, 0.8, 0.5, 0.7, 0.9].map((h, i) => (
              <View key={i} style={[styles.bar, { height: \`\${h * 100}%\`, backgroundColor: colors.primary }]} />
            ))}
          </View>
        </View>

        {/* Activity Feed */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Recent Activity</Text>
          {activity.map((event, i) => (
            <React.Fragment key={event.id}>
              <ActivityItem event={event} colors={colors} />
              {i < activity.length - 1 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
            </React.Fragment>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

export function AnalyticsDashboard() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  metricCard: { padding: 16, borderRadius: 12, minWidth: '45%', flex: 1 },
  metricLabel: { fontSize: 12, marginBottom: 4 },
  metricValue: { fontSize: 24, fontWeight: 'bold' },
  card: { padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12 },
  chartArea: { height: 100, flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bar: { flex: 1, borderRadius: 4 },
  activityItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  activityIcon: { fontSize: 20 },
  divider: { height: 1, marginVertical: 4 },
});
\`\`\`
    `,
    nativeCheatsheet: `
### Number Formatting
\`\`\`tsx
// Basic number
num.toLocaleString('en-US'); // "1,234"

// Currency
new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
}).format(99.99); // "$99.99"
\`\`\`

### RefreshControl
\`\`\`tsx
<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  }
>
\`\`\`

### Flex Grid (2 columns)
\`\`\`tsx
{
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 12,
}
// Each child: { minWidth: '45%', flex: 1 }
\`\`\`

### Trend Color
\`\`\`tsx
<Text style={{ color: trend >= 0 ? '#16a34a' : '#dc2626' }}>
  {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
</Text>
\`\`\`
    `,
    skills: ['Dashboard layout', 'Data visualization', 'Number formatting', 'Filtering'],
  },
];

// =============================================================================
// REGISTRY EXPORT
// =============================================================================

export const freeRegistry: ChallengeRegistry = {
  packages: freePackages,
  assessments: freeAssessments,
  challenges: freeChallenges,
};
