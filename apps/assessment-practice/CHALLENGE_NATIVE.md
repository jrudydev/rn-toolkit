# Assessment Challenge: Link Management Screen (Native)

**Time Limit:** 120 minutes
**Difficulty:** Hard
**Approach:** Native React Native only (no external UI packages)

---

## Scenario

You're building the Link Management screen for a "link in bio" app (similar to Linktree).
Creators use this screen to manage their profile links - view, add, toggle visibility,
and search through their links.

**This is the NATIVE version** - you'll build everything from scratch using only
React Native's built-in components. No UI libraries allowed.

---

## What You're Building

A mobile screen that displays:
1. A header with theme toggle
2. A search bar to filter links
3. A count showing "X of Y links"
4. A scrollable list of link cards
5. An "Add Link" button/form

---

## Functional Requirements

### FR1: Link List Display
- [ ] Display links from provided mock data as cards
- [ ] Each card shows: title, URL, and enabled status
- [ ] Cards should have elevation/shadow styling

### FR2: Toggle Link Visibility
- [ ] Each card has a toggle switch (use RN's Switch)
- [ ] Toggling updates the link's `enabled` state
- [ ] Visual feedback when toggled (opacity change)

### FR3: Search/Filter
- [ ] Search input at top of screen
- [ ] Filters links by title (case-insensitive)
- [ ] Search MUST be debounced (300ms) - **implement yourself**
- [ ] Show filtered results immediately after debounce

### FR4: Link Count with Pluralization
- [ ] Display "Showing X of Y links" text
- [ ] Handle pluralization manually ("1 link" vs "5 links")

### FR5: Add Link
- [ ] Button to add a new link
- [ ] Simple form with title and URL inputs
- [ ] New link appears in the list
- [ ] Basic validation (non-empty fields)

### FR6: Theme Support
- [ ] Toggle button to switch light/dark mode
- [ ] **Build your own ThemeContext** from scratch
- [ ] All components adapt to theme
- [ ] Background, text, cards all change

---

## Technical Requirements

### TR1: Native Components Only
```tsx
// ALLOWED imports
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// NOT ALLOWED
// - @astacinco/* packages
// - Any UI component libraries
// - i18n libraries (handle strings manually)
```

### TR2: Build These Yourself
1. **ThemeContext** - Create context with light/dark colors
2. **useDebounce hook** - Implement debounce from scratch
3. **Card component** - Styled View with shadow/elevation
4. **Button component** - Pressable with styling
5. **Pluralization** - Manual string handling

### TR3: TypeScript
- All code must be TypeScript
- Define proper interfaces
- No `any` types
- Props should be typed

### TR4: File Structure
```
App.tsx              <- Main file (your work here)
data/links.ts        <- Mock data (provided)
```

---

## What You Need to Build

### 1. Theme System (from scratch)
```tsx
// Define your color tokens
const lightColors = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#1A1A1A',
  textSecondary: '#666666',
  primary: '#007AFF',
  border: '#E0E0E0',
  // ... etc
};

const darkColors = {
  background: '#1A1A1A',
  surface: '#2A2A2A',
  text: '#FFFFFF',
  // ... etc
};

// Create ThemeContext
// Create ThemeProvider
// Create useTheme hook
```

### 2. Debounce Hook (from scratch)
```tsx
function useDebounce<T>(value: T, delay: number): T {
  // Implement using useState and useEffect
  // Return debounced value
}
```

### 3. Reusable Components
- Card with shadow/elevation
- Input with label and error state
- Button with variants

---

## Grading Rubric

| Criteria | Points | What We're Looking For |
|----------|--------|------------------------|
| **Core Functionality** | 35 | List renders, search filters, toggle works, add works |
| **Theme System** | 20 | Context setup, provider, hook, colors apply correctly |
| **Debounce Implementation** | 15 | Correct hook, proper cleanup, 300ms delay |
| **Component Quality** | 15 | Reusable Card, Input, Button components |
| **TypeScript Quality** | 10 | Proper types, interfaces, no `any` |
| **Edge Cases** | 5 | Empty state, no results, validation |

---

## Comparison: Native vs Packaged

| Task | Native (this challenge) | With @astacinco |
|------|-------------------------|-----------------|
| Theme system | Build ThemeContext (~40 lines) | `<ThemeProvider>` + `useTheme()` |
| Debounce | Build useDebounce hook (~15 lines) | `useDebounce(value, 300)` |
| Cards | Style View with shadows manually | `<Card variant="elevated">` |
| Stacks | Manual flexbox styling | `<VStack spacing="md">` |
| Pluralization | `count === 1 ? 'link' : 'links'` | `tp('links.showing', count)` |
| Switch theming | Manual trackColor/thumbColor | `<Switch />` (auto-themed) |

**Estimated extra code:** ~150-200 lines more than packaged version

---

## Tips

1. **Start with ThemeContext** - Everything depends on it
2. **Build useDebounce early** - You'll need it for search
3. **Create a Card component first** - Reuse it for all cards
4. **Test theme toggle frequently** - Easy to miss color tokens
5. **Don't over-engineer** - Keep it simple, it's timed

---

## Getting Started

1. Read `CHEATSHEET_NATIVE.md` for patterns
2. Check `data/links.ts` for mock data
3. Start in `App.tsx`
4. Set a **120-minute timer**!

---

## After Completion

1. Compare your solution with `SOLUTION_NATIVE.md`
2. Then look at `SOLUTION.md` (packaged version)
3. Note the difference in:
   - Lines of code
   - Time spent
   - Complexity
   - Reusability

This comparison demonstrates the value of building reusable packages!

---

## Start the Timer!

Ready? Set a **120-minute timer** and begin in `App.tsx`.

Good luck - this one's harder!
