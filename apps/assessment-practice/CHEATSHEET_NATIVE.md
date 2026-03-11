# React Native Native Cheatsheet

Quick reference for building with **native React Native only** - no external packages.

---

## 1. Core Imports

```tsx
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
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
```

---

## 2. Building a Theme System

### Define Color Tokens
```tsx
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
```

### Create Theme Context
```tsx
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

function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

---

## 3. Building useDebounce Hook

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage:
const [searchText, setSearchText] = useState('');
const debouncedSearch = useDebounce(searchText, 300);
```

---

## 4. Building Common Components

### Card Component
```tsx
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

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
});
```

### Button Component
```tsx
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
}

function Button({ label, onPress, variant = 'primary', disabled }: ButtonProps) {
  const { colors } = useTheme();

  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: colors.primary,
          text: '#FFFFFF',
          border: 'transparent',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: colors.primary,
          border: colors.primary,
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: colors.primary,
          border: 'transparent',
        };
      default:
        return {
          bg: colors.surface,
          text: colors.text,
          border: colors.border,
        };
    }
  };

  const variantStyles = getStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        buttonStyles.base,
        {
          backgroundColor: variantStyles.bg,
          borderColor: variantStyles.border,
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text style={[buttonStyles.label, { color: variantStyles.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### Input Component
```tsx
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
    <View style={inputStyles.container}>
      {label && (
        <Text style={[inputStyles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[
          inputStyles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      />
      {error && (
        <Text style={[inputStyles.error, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const inputStyles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  label: {
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
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
```

---

## 5. Layout Patterns

### VStack (Vertical Stack)
```tsx
// Manual approach - just use View with flexDirection
<View style={{ gap: 12 }}>
  <Text>Item 1</Text>
  <Text>Item 2</Text>
</View>

// Or create a component:
function VStack({ children, spacing = 12 }: { children: React.ReactNode; spacing?: number }) {
  return <View style={{ gap: spacing }}>{children}</View>;
}
```

### HStack (Horizontal Stack)
```tsx
<View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>

// Space between:
<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
  <Text>Left</Text>
  <Text>Right</Text>
</View>
```

### Centering
```tsx
<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  <Text>Centered</Text>
</View>
```

---

## 6. Switch with Theme Colors

```tsx
const { colors } = useTheme();

<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  trackColor={{
    false: colors.border,
    true: colors.primary,
  }}
  thumbColor={isEnabled ? colors.surface : colors.textMuted}
  ios_backgroundColor={colors.border}
/>
```

---

## 7. Manual Pluralization

```tsx
// Simple approach
const linkText = count === 1 ? '1 link' : `${count} links`;

// With interpolation
const showingText = `Showing ${filtered} of ${total} ${total === 1 ? 'link' : 'links'}`;

// Helper function
function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? `${count} ${singular}` : `${count} ${plural}`;
}

// Usage
pluralize(5, 'link', 'links'); // "5 links"
pluralize(1, 'link', 'links'); // "1 link"
```

---

## 8. Common Patterns

### Screen Layout
```tsx
function MyScreen() {
  const { colors, mode } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Content */}
      </ScrollView>
    </SafeAreaView>
  );
}
```

### Theme Toggle
```tsx
function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <Button
      label={mode === 'light' ? 'Dark Mode' : 'Light Mode'}
      variant="outline"
      onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
    />
  );
}
```

### Filtered List with Debounce
```tsx
const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 300);

const filtered = items.filter(item =>
  item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
);
```

---

## 9. Spacing Constants

```tsx
const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Usage
<View style={{ padding: spacing.lg, gap: spacing.md }}>
```

---

## 10. Shadow Styles (Cross-Platform)

```tsx
const shadow = {
  // iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  // Android
  elevation: 3,
};

// Usage
<View style={[{ backgroundColor: colors.surface }, shadow]}>
```

---

## 11. Form Validation

```tsx
const [title, setTitle] = useState('');
const [titleError, setTitleError] = useState('');

const validate = (): boolean => {
  let valid = true;

  if (!title.trim()) {
    setTitleError('Title is required');
    valid = false;
  } else {
    setTitleError('');
  }

  return valid;
};

const handleSubmit = () => {
  if (validate()) {
    // Submit form
  }
};
```

---

## Quick Reference: Package vs Native

| Task | With @astacinco | Native Equivalent |
|------|-----------------|-------------------|
| `<ThemeProvider>` | Import and use | Build context (~30 lines) |
| `useTheme()` | Import and use | Build hook (~10 lines) |
| `useDebounce()` | Import and use | Build hook (~15 lines) |
| `<Card>` | `<Card variant="elevated">` | Build component (~25 lines) |
| `<VStack spacing="md">` | Import and use | `<View style={{ gap: 12 }}>` |
| `<Button>` | `<Button label="..." />` | Build component (~40 lines) |
| `<Input>` | `<Input label="..." />` | Build component (~35 lines) |
| `t('key')` | Translation lookup | Hardcode strings |
| `tp('key', count)` | Pluralization | Manual: `count === 1 ? ...` |

**Total extra code for native:** ~150-200 lines

---

## Tips

1. **Build ThemeContext first** - Everything depends on colors
2. **Create useDebounce early** - Copy the pattern above
3. **Use `gap` for spacing** - Cleaner than margins (RN 0.71+)
4. **Keep components simple** - Don't over-engineer
5. **Test both themes** - Easy to miss a hardcoded color
