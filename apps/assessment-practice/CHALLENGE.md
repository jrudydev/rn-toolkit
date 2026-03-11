# Assessment Challenge: Link Management Screen

**Time Limit:** 90 minutes
**Difficulty:** Medium
**Packages:** 4 of 5 free packages

---

## Scenario

You're building the Link Management screen for a "link in bio" app (similar to Linktree).
Creators use this screen to manage their profile links - view, add, toggle visibility,
and search through their links.

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
- [ ] Cards should be visually distinct (use Card component)

### FR2: Toggle Link Visibility
- [ ] Each card has a toggle switch (use RN's Switch for now)
- [ ] Toggling updates the link's `enabled` state
- [ ] Visual feedback when toggled (styling change)

### FR3: Search/Filter
- [ ] Search input at top of screen
- [ ] Filters links by title (case-insensitive)
- [ ] Search MUST be debounced (300ms)
- [ ] Show filtered results immediately after debounce

### FR4: Link Count with Pluralization
- [ ] Display "Showing X of Y links" text
- [ ] Must use i18n pluralization
- [ ] Examples: "Showing 1 of 5 links", "Showing 3 of 5 links"

### FR5: Add Link
- [ ] Button to add a new link
- [ ] Simple form with title and URL inputs
- [ ] New link appears in the list
- [ ] Basic validation (non-empty fields)

### FR6: Theme Support
- [ ] Toggle button to switch light/dark mode
- [ ] All components adapt to theme
- [ ] Background, text, cards all change

---

## Technical Requirements

### TR1: Use Package Components
```tsx
// REQUIRED imports
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';
import { Text, Button, Card, VStack, HStack, Container, Input, Divider } from '@astacinco/rn-primitives';
import { I18nProvider, ConsoleAdapter, useTranslation } from '@astacinco/rn-i18n';
import { useDebounce } from '@astacinco/rn-performance';

// For toggle (fallback until we build Switch)
import { Switch } from 'react-native';
```

### TR2: TypeScript
- All code must be TypeScript
- Define proper interfaces for Link type
- No `any` types
- Props should be typed

### TR3: State Management
- Use React hooks (useState, useEffect)
- Links state should be array of Link objects
- Search term state with debounced value

### TR4: File Structure
```
App.tsx           <- Main file (your work here)
data/links.ts     <- Mock data (provided)
i18n/en.ts        <- Translations (provided)
```

---

## Mock Data Structure

```typescript
interface Link {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  enabled: boolean;
  clicks: number;
}
```

See `data/links.ts` for sample data.

---

## Grading Rubric

| Criteria | Points | What We're Looking For |
|----------|--------|------------------------|
| **Core Functionality** | 40 | List renders, search filters, toggle works, add works |
| **Package Integration** | 25 | Correct use of primitives, hooks, providers |
| **TypeScript Quality** | 15 | Proper types, interfaces, no `any` |
| **Theme Support** | 10 | Dark/light works, colors adapt correctly |
| **Edge Cases** | 10 | Empty state, no results, form validation |

---

## Getting Started

1. **Read the cheatsheet** - `CHEATSHEET.md` has all imports and patterns
2. **Check the mock data** - `data/links.ts`
3. **Check translations** - `i18n/en.ts`
4. **Start in App.tsx** - Basic structure is provided
5. **Use the timer** - Set a 90-minute timer!

---

## Tips

- **Start with rendering** - Get the list displaying first
- **Add features incrementally** - Don't try to do everything at once
- **Test as you go** - Run the app frequently
- **Use the cheatsheet** - Don't waste time remembering imports
- **Handle edge cases last** - Get core functionality working first

---

## After Completion

1. Review your solution against `SOLUTION.md`
2. Note what was easy vs. hard
3. Identify components that would have helped
4. This feedback drives Phase 2 component building

---

## Start the Timer!

Ready? Set a 90-minute timer and begin in `App.tsx`.

Good luck!
