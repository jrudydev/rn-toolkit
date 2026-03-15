# Link Management Assessment (Native) - Step-by-Step Solution

Build everything from scratch using only React Native's built-in components.

**Time:** 120 minutes | **Difficulty:** Hard

---

## Challenge Requirements Map

| Step | Challenge Requirement |
|------|----------------------|
| 1-2 | **Setup:** Imports and basic structure |
| 3-5 | **Native Build:** Theme System |
| 6 | **Native Build:** useDebounce Hook |
| 7-9 | **Native Build:** Reusable Components |
| 10 | **Native Build:** Pluralization Helper |
| 11-12 | **Core Task 1:** Link List Display |
| 13-14 | **Core Task 2:** Toggle Link Visibility |
| 15 | **Core Task 3:** Link Count |
| 16-17 | **Required Challenge:** Debounced Search |
| 18 | **Required Challenge:** Dark Mode Toggle |
| 19-21 | **Core Task 4:** Add Link |
| 22-23 | **Bonus:** Form Validation |
| 24-25 | **Bonus:** Loading States |
| 26 | **Bonus:** Empty States |

---

## Setup Steps

### Step 1: Verify project runs
```bash
npx expo start
```
**Test:** App loads without errors

---

### Step 2: Import native components
```tsx
import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { mockLinks, createLink, type Link } from './data/links';
```

**Note:** NO @astacinco packages allowed - we build everything from scratch.

**Test:** No import errors

---

## Native Build: Theme System

### Step 3: Define color tokens

> **Native Implementation:** Replaces `@astacinco/rn-theming` colors

```tsx
const lightColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A1A',
  textSecondary: '#666666',
  textMuted: '#999999',
  primary: '#007AFF',
  border: '#E5E5E5',
  error: '#FF3B30',
};

const darkColors = {
  background: '#000000',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  textSecondary: '#ABABAB',
  textMuted: '#666666',
  primary: '#0A84FF',
  border: '#38383A',
  error: '#FF453A',
};

type ThemeMode = 'light' | 'dark';
type Colors = typeof lightColors;
```

**Why this matters:** ~20 lines to define what the package provides built-in.

**Test:** No errors (used in next step)

---

### Step 4: Create ThemeContext and ThemeProvider

> **Native Implementation:** Replaces `ThemeProvider` from `@astacinco/rn-theming`

```tsx
interface ThemeContextType {
  mode: ThemeMode;
  colors: Colors;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(systemScheme === 'dark' ? 'dark' : 'light');
  const colors = mode === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ mode, colors, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

**Why this matters:** ~15 lines of context boilerplate.

**Test:** No errors (used in next step)

---

### Step 5: Create useTheme hook

> **Native Implementation:** Replaces `useTheme` from `@astacinco/rn-theming`

```tsx
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

**Why this matters:** Must remember error handling pattern every time.

**Test:** No errors (theme system complete!)

---

## Native Build: Hooks

### Step 6: Create useDebounce hook

> **Native Implementation:** Replaces `useDebounce` from `@astacinco/rn-performance`

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

**Why this matters:** ~10 lines you'd copy-paste into every project.

**Test:** No errors (used later for search)

---

## Native Build: Reusable Components

### Step 7: Create Card component

> **Native Implementation:** Replaces `Card` from `@astacinco/rn-primitives`

```tsx
function Card({ children, style, variant = 'elevated' }: {
  children: ReactNode;
  style?: object;
  variant?: 'elevated' | 'outlined';
}) {
  const { colors } = useTheme();

  return (
    <View style={[
      styles.card,
      { backgroundColor: colors.surface },
      variant === 'outlined' && { borderWidth: 1, borderColor: colors.border },
      variant === 'elevated' && styles.cardElevated,
      style,
    ]}>
      {children}
    </View>
  );
}
```

**Add to StyleSheet:**
```tsx
const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12 },
  cardElevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
```

**Why this matters:** ~25 lines for a basic card with shadow.

**Test:** No errors (used later)

---

### Step 8: Create Input component

> **Native Implementation:** Replaces `Input` from `@astacinco/rn-primitives`

```tsx
function Input({
  value,
  onChangeText,
  placeholder,
  label,
  error,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
}) {
  const { colors } = useTheme();

  return (
    <View>
      {label && (
        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
      />
      {error && (
        <Text style={[styles.errorText, { color: colors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
}
```

**Add to StyleSheet:**
```tsx
input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
inputLabel: { fontSize: 14, fontWeight: '500', marginBottom: 4 },
errorText: { fontSize: 12, marginTop: 4 },
```

**Why this matters:** ~35 lines for themed input with error state.

**Test:** No errors (used later)

---

### Step 9: Create Button component

> **Native Implementation:** Replaces `Button` from `@astacinco/rn-primitives`

```tsx
function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  size?: 'sm' | 'md';
}) {
  const { colors } = useTheme();
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={[
        styles.button,
        size === 'sm' && styles.buttonSm,
        {
          backgroundColor: isPrimary ? colors.primary : 'transparent',
          borderColor: colors.primary,
          borderWidth: isPrimary ? 0 : 1,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.buttonText,
        size === 'sm' && styles.buttonTextSm,
        { color: isPrimary ? '#FFFFFF' : colors.primary },
      ]}>
        {label}
      </Text>
    </Pressable>
  );
}
```

**Add to StyleSheet:**
```tsx
button: { paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8, alignItems: 'center' },
buttonSm: { paddingVertical: 8, paddingHorizontal: 12 },
buttonText: { fontSize: 16, fontWeight: '600' },
buttonTextSm: { fontSize: 14 },
```

**Why this matters:** ~30 lines for themed button with variants.

**Test:** No errors (used later)

---

### Step 10: Create pluralization helper

> **Native Implementation:** Replaces `tp()` from `@astacinco/rn-i18n`

```tsx
function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
```

**Why this matters:** Manual pluralization every time vs `tp('key', count)`.

**Test:** No errors

---

## Core Tasks

### Step 11: Create LinkCard component

> **Completes: Core Task 1 - Link List Display (Part 1)**

```tsx
function LinkCard({ link, onToggle }: { link: Link; onToggle: (id: string) => void }) {
  const { colors } = useTheme();

  return (
    <Card style={{ opacity: link.enabled ? 1 : 0.5 }}>
      <View style={styles.linkCardContent}>
        <View style={styles.linkCardText}>
          <Text style={[styles.subtitle, { color: colors.text }]}>{link.title}</Text>
          <Text style={[styles.caption, { color: colors.textMuted }]}>{link.url}</Text>
          <Text style={[styles.caption, { color: colors.textSecondary }]}>
            {pluralize(link.clicks, 'click', 'clicks')}
          </Text>
        </View>
        <Switch
          value={link.enabled}
          onValueChange={() => onToggle(link.id)}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.surface}
        />
      </View>
    </Card>
  );
}
```

**Add to StyleSheet:**
```tsx
subtitle: { fontSize: 17, fontWeight: '600' },
caption: { fontSize: 13 },
linkCardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
linkCardText: { flex: 1 },
```

**Test:** No errors (used in next step)

---

### Step 12: Create LinkManagementScreen structure

> **Completes: Core Task 1 - Link List Display (Part 2)**

```tsx
function LinkManagementScreen() {
  const { colors, mode } = useTheme();
  const [links, setLinks] = useState<Link[]>(mockLinks);

  // No-op placeholder - implement in Step 14
  const handleToggle = (_id: string) => {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={mode === 'light' ? 'dark' : 'light'} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Links */}
        {links.map(link => (
          <View key={link.id} style={{ marginBottom: 12 }}>
            <LinkCard link={link} onToggle={handleToggle} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
```

**Add to StyleSheet:**
```tsx
scrollContent: { padding: 16 },
```

**Test:** See 8 link cards displayed

---

### Step 13: Wrap App with ThemeProvider

```tsx
export default function App() {
  return (
    <ThemeProvider>
      <LinkManagementScreen />
    </ThemeProvider>
  );
}
```

**Test:** App renders with themed cards

---

### Step 14: Implement handleToggle

> **Completes: Core Task 2 - Toggle Link Visibility**

Replace the no-op:
```tsx
const handleToggle = (id: string) => {
  setLinks(prev =>
    prev.map(link =>
      link.id === id ? { ...link, enabled: !link.enabled } : link
    )
  );
};
```

**Test:** Tap switch → opacity toggles

---

### Step 15: Add link count

> **Completes: Core Task 3 - Link Count**

Add above the links list:
```tsx
<Text style={[styles.caption, { color: colors.textSecondary, marginBottom: 12 }]}>
  Showing {links.length} of {links.length} {links.length === 1 ? 'link' : 'links'}
</Text>
```

**Test:** Shows "Showing 8 of 8 links"

---

## Required Challenges

### Step 16: Add search state and input

> **Completes: Required Challenge - Debounced Search (Part 1)**

**16a. Add state:**
```tsx
const [searchText, setSearchText] = useState('');
```

**16b. Add Input above count:**
```tsx
<Input
  value={searchText}
  onChangeText={setSearchText}
  placeholder="Search links..."
/>
```

**Test:** Input appears, you can type

---

### Step 17: Add debounced filtering

> **Completes: Required Challenge - Debounced Search (Part 2)**

**17a. Create debounced value:**
```tsx
const debouncedSearch = useDebounce(searchText, 300);
```

**17b. Filter links:**
```tsx
const filteredLinks = links.filter(link =>
  link.title.toLowerCase().includes(debouncedSearch.toLowerCase())
);
```

**17c. Update count and list to use filteredLinks:**
```tsx
<Text style={[styles.caption, { color: colors.textSecondary, marginBottom: 12 }]}>
  Showing {filteredLinks.length} of {links.length} {links.length === 1 ? 'link' : 'links'}
</Text>

{filteredLinks.map(link => (
  // ...
))}
```

**Test:** Type "pod" → 300ms delay → only "Podcast" shows

---

### Step 18: Add header with theme toggle

> **Completes: Required Challenge - Dark Mode Toggle**

**18a. Get setMode:**
```tsx
const { colors, mode, setMode } = useTheme();
```

**18b. Add header:**
```tsx
<View style={styles.header}>
  <Text style={[styles.title, { color: colors.text }]}>My Links</Text>
  <Button
    label={mode === 'light' ? '🌙' : '☀️'}
    variant="outline"
    size="sm"
    onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
  />
</View>
```

**Add to StyleSheet:**
```tsx
header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
title: { fontSize: 28, fontWeight: '700' },
```

**Test:** Tap → theme switches

---

## Add Link Feature

### Step 19: Add showAddForm state and + button

> **Completes: Core Task 4 - Add Link (Part 1)**

**19a. Add state:**
```tsx
const [showAddForm, setShowAddForm] = useState(false);
```

**19b. Update header with + button:**
```tsx
<View style={styles.header}>
  <Text style={[styles.title, { color: colors.text }]}>My Links</Text>
  <View style={styles.headerButtons}>
    <Button label="+" variant="primary" size="sm" onPress={() => setShowAddForm(true)} />
    <View style={{ width: 8 }} />
    <Button
      label={mode === 'light' ? '🌙' : '☀️'}
      variant="outline"
      size="sm"
      onPress={() => setMode(mode === 'light' ? 'dark' : 'light')}
    />
  </View>
</View>
```

**Add to StyleSheet:**
```tsx
headerButtons: { flexDirection: 'row' },
```

**Test:** + button visible

---

### Step 20: Create AddLinkForm component

> **Completes: Core Task 4 - Add Link (Part 2)**

```tsx
function AddLinkForm({
  onAdd,
  onCancel
}: {
  onAdd: (title: string, url: string) => void;
  onCancel: () => void;
}) {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    if (title.trim() && url.trim()) {
      onAdd(title.trim(), url.trim());
      setTitle('');
      setUrl('');
    }
  };

  return (
    <Card variant="outlined">
      <Text style={[styles.subtitle, { color: colors.text, marginBottom: 12 }]}>Add Link</Text>
      <Input value={title} onChangeText={setTitle} placeholder="Link Title" label="Title" />
      <View style={{ height: 12 }} />
      <Input value={url} onChangeText={setUrl} placeholder="Link URL" label="URL" />
      <View style={styles.formButtons}>
        <Button label="Cancel" variant="outline" size="sm" onPress={onCancel} />
        <View style={{ width: 8 }} />
        <Button label="Add" variant="primary" size="sm" onPress={handleSubmit} />
      </View>
    </Card>
  );
}
```

**Add to StyleSheet:**
```tsx
formButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
```

**Render conditionally:**
```tsx
{showAddForm && (
  <View style={{ marginBottom: 16 }}>
    <AddLinkForm onAdd={handleAddLink} onCancel={() => setShowAddForm(false)} />
  </View>
)}
```

**No-op handler:**
```tsx
const handleAddLink = (_title: string, _url: string) => {};
```

**Test:** Tap + → form appears

---

### Step 21: Implement handleAddLink

> **Completes: Core Task 4 - Add Link (Part 3)**

Replace no-op:
```tsx
const handleAddLink = (title: string, url: string) => {
  const newLink = createLink(title, url);
  setLinks(prev => [...prev, newLink]);
  setShowAddForm(false);
};
```

**Test:** Submit form → new link appears

---

## Bonus Challenges

### Step 22: Add validation state

> **Completes: Bonus - Form Validation (Part 1)**

In AddLinkForm, add:
```tsx
const [titleError, setTitleError] = useState('');
const [urlError, setUrlError] = useState('');
```

Update inputs:
```tsx
<Input value={title} onChangeText={setTitle} placeholder="Link Title" label="Title" error={titleError || undefined} />
<Input value={url} onChangeText={setUrl} placeholder="Link URL" label="URL" error={urlError || undefined} />
```

**Note:** Use `|| undefined` to avoid passing empty string, which causes "text node cannot be a child of View" error.

**Test:** No visible change yet

---

### Step 23: Add validation logic

> **Completes: Bonus - Form Validation (Part 2)**

Replace handleSubmit:
```tsx
const handleSubmit = () => {
  let hasError = false;

  if (!title.trim()) {
    setTitleError('Title is required');
    hasError = true;
  } else {
    setTitleError('');
  }

  if (!url.trim()) {
    setUrlError('URL is required');
    hasError = true;
  } else {
    setUrlError('');
  }

  if (!hasError) {
    onAdd(title.trim(), url.trim());
    setTitle('');
    setUrl('');
  }
};
```

**Test:** Submit empty → errors appear

---

### Step 24: Add loading state

> **Completes: Bonus - Loading States (Part 1)**

```tsx
const [isLoading, setIsLoading] = useState(false);
```

Update button:
```tsx
<Button
  label={isLoading ? 'Adding...' : 'Add'}
  variant="primary"
  size="sm"
  onPress={handleSubmit}
/>
```

**Test:** No visible change yet

---

### Step 25: Add async delay

> **Completes: Bonus - Loading States (Part 2)**

Update handleSubmit:
```tsx
const handleSubmit = async () => {
  // ... validation ...

  if (!hasError) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onAdd(title.trim(), url.trim());
    setIsLoading(false);
  }
};
```

**Test:** Submit → "Adding..." for 500ms → completes

---

### Step 26: Add empty states

> **Completes: Bonus - Empty States**

Replace links list with conditional:
```tsx
{filteredLinks.length === 0 ? (
  <Card variant="outlined">
    <View style={{ alignItems: 'center', padding: 16 }}>
      <Text style={[styles.caption, { color: colors.textSecondary }]}>
        {searchText ? 'No results found' : 'No links yet'}
      </Text>
      {!searchText && (
        <View style={{ marginTop: 12 }}>
          <Button
            label="Add your first link"
            variant="primary"
            size="sm"
            onPress={() => setShowAddForm(true)}
          />
        </View>
      )}
    </View>
  </Card>
) : (
  filteredLinks.map(link => (
    <View key={link.id} style={{ marginBottom: 12 }}>
      <LinkCard link={link} onToggle={handleToggle} />
    </View>
  ))
)}
```

**Test:** Search gibberish → "No results found"

---

## Code Comparison

| Section | Native | With @astacinco |
|---------|--------|-----------------|
| Theme System | ~45 lines | 0 (imported) |
| useDebounce | ~10 lines | 0 (imported) |
| Card Component | ~25 lines | 0 (imported) |
| Input Component | ~35 lines | 0 (imported) |
| Button Component | ~30 lines | 0 (imported) |
| Pluralization | ~3 lines | 0 (use `tp()`) |
| Business Logic | ~100 lines | ~100 lines |
| Styles | ~40 lines | ~5 lines |
| **Total** | **~290 lines** | **~170 lines** |

**Result:** Native version is **2x more code** than packaged version.

---

## Final Checklist

| Task | Status |
|------|:------:|
| Theme system built | ⬜ |
| useDebounce hook built | ⬜ |
| Card/Input/Button components built | ⬜ |
| Links display as cards | ⬜ |
| Toggle switch works | ⬜ |
| Link count shows | ⬜ |
| Search filters with debounce | ⬜ |
| Theme toggle works | ⬜ |
| Add link form works | ⬜ |
| (Bonus) Form validation | ⬜ |
| (Bonus) Loading states | ⬜ |
| (Bonus) Empty states | ⬜ |
