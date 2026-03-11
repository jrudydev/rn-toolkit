# Assessment: Link Management Screen

**Time Limit:** 90 minutes
**Difficulty:** Medium
**Packages:** 4 of 5 free packages

---

## Scenario

You're building the Link Management screen for a "link in bio" app (similar to Linktree).
Creators use this screen to manage their profile links - view, add, toggle visibility,
and search through their links.

---

## Assessment Structure

| Section | Time | Status |
|---------|------|--------|
| **Core Domain Tasks** | ~45 min | Required |
| **Required Challenges** | ~30 min | Required |
| **Bonus Challenges** | ~15+ min | Optional |

---

## Core Domain Tasks (Required)

These are specific to the Linktree use case.

### Task 1: Link List Display
- [ ] Display links from provided mock data as cards
- [ ] Each card shows: title, URL, and enabled status
- [ ] Cards should be visually distinct (use Card component)

### Task 2: Toggle Link Visibility
- [ ] Each card has a toggle switch (use RN's Switch for now)
- [ ] Toggling updates the link's `enabled` state
- [ ] Visual feedback when toggled (styling change)

### Task 3: Link Count with Pluralization
- [ ] Display "Showing X of Y links" text
- [ ] Must use i18n pluralization
- [ ] Examples: "Showing 1 of 5 links", "Showing 3 of 5 links"

### Task 4: Add Link
- [ ] Button to add a new link
- [ ] Simple form with title and URL inputs
- [ ] New link appears in the list

---

## Required Challenges (Required)

These are generic challenges that must be completed for this assessment.
See the Companion App for detailed instructions.

### Challenge: Debounced Search
- [ ] Search input at top of screen
- [ ] Filters links by title (case-insensitive)
- [ ] Search MUST be debounced (300ms) using `useDebounce`
- [ ] Show filtered results immediately after debounce

### Challenge: Dark Mode Toggle
- [ ] Toggle button to switch light/dark mode
- [ ] All components adapt to theme
- [ ] Background, text, cards all change appropriately

---

## Bonus Challenges (Optional)

Complete these if you finish early or want extra practice.

### Challenge: Form Validation
- [ ] Validate title and URL fields are non-empty
- [ ] Show error states on invalid inputs
- [ ] Prevent form submission until valid

### Challenge: Loading States
- [ ] Show loading indicator when adding a link
- [ ] Simulate async delay (500ms)
- [ ] Disable form during loading

### Challenge: Empty States
- [ ] Show "No links yet" when list is empty
- [ ] Show "No results found" when search has no matches
- [ ] Include call-to-action in empty states

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
| **Core Domain Tasks** | 35 | List renders, toggle works, add works, count shows |
| **Required Challenges** | 30 | Debounced search works, theme toggle works |
| **Package Integration** | 15 | Correct use of primitives, hooks, providers |
| **TypeScript Quality** | 10 | Proper types, interfaces, no `any` |
| **Bonus Challenges** | 10 | Form validation, loading states, empty states |

---

## Getting Started

1. **Read the cheatsheet** - `CHEATSHEET.md` has all imports and patterns
2. **Open Companion App** - Have it ready on your phone for reference
3. **Check the mock data** - `data/links.ts`
4. **Check translations** - `i18n/en.ts`
5. **Start in App.tsx** - Basic structure is provided
6. **Start the timer** - 90 minutes!

---

## Tips

- **Start with rendering** - Get the list displaying first
- **Core tasks first** - Complete all core domain tasks before challenges
- **Test as you go** - Run the app frequently
- **Use the cheatsheet** - Don't waste time remembering imports
- **Bonus is bonus** - Only attempt if core + required are done

---

## After Completion

1. Review your solution against `SOLUTION.md`
2. Note what was easy vs. hard
3. Identify components that would have helped
4. Try the bonus challenges if time permits

---

## Start the Timer!

Ready? Set a 90-minute timer and begin in `App.tsx`.

Good luck!
