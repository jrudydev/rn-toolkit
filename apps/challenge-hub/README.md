# Challenge Hub

A React Native app for browsing and completing coding challenges using @astacinco packages.

> **Status:** Design Phase
> **Patreon:** Challenges will be available to supporters

---

## Project Overview

This initiative creates a complete assessment practice system:

1. **Assessment Challenges** - Timed tasks similar to CodeSignal assessments
2. **Cheatsheets** - Quick reference for all packages (printable)
3. **Challenge Hub App** - Browse, attempt, and track challenges
4. **New Components** - Built based on actual challenge needs

### Key Design Principles

- **Minimize Claude dependency:** Pre-built components, just import and use
- **Native mobile dev friendly:** Explicit explanations for RN-specific patterns
- **Realistic timing:** 60-90 minute challenges like real CodeSignal
- **Reusable:** Swap scenarios without rebuilding infrastructure
- **Dogfooding:** Challenge Hub uses our own packages

---

## Progress Tracker

### Phase 1: Assessment Practice App ✅ COMPLETE

Location: `apps/assessment-practice/`

| File | Status | Description |
|------|--------|-------------|
| `CHEATSHEET.md` | ✅ | Complete reference for all 4 free packages |
| `CHALLENGE.md` | ✅ | Link Management Screen requirements |
| `App.tsx` | ✅ | Starter code with numbered TODOs |
| `data/links.ts` | ✅ | Mock link data (8 Linktree-style links) |
| `i18n/en.ts` | ✅ | English + Spanish translations |
| `SOLUTION.md` | ✅ | Reference solution (view after attempt) |
| `package.json` | ✅ | Pre-configured with all packages |

**Challenge 1: Link Management Screen**
- Time: 90 minutes
- Difficulty: Medium
- Packages: rn-primitives, rn-theming, rn-i18n, rn-performance
- Aligned with: Linktree Senior Mobile Engineer role

### Phase 2: Build Missing Components ⏳ PENDING

Components identified during Phase 1 challenge design:

| Component | Package | Use Case | Priority |
|-----------|---------|----------|----------|
| **Switch** | rn-primitives | Link visibility toggle | High |
| **Avatar** | rn-primitives | Link thumbnails, user profiles | High |
| **Badge** | rn-primitives | Click counts, notifications | High |
| **Icon** | rn-primitives | UI icons throughout | Medium |
| **Modal** | rn-primitives | Add link form, confirmations | Medium |

**Badge Component Notes:**
Based on PayPal navigation badge SDUI framework experience:
- Bottom nav badges
- Top nav badges
- Sub nav badges
- Flexible positioning
- Applies to: click counts, notifications, "new" indicators

### Phase 3: Alternative Scenarios ⏳ PENDING

Location: `apps/assessment-practice/scenarios/`

| Scenario | Difficulty | Packages | Description |
|----------|------------|----------|-------------|
| Link Management | Medium | 4 | ✅ Current challenge |
| Settings Screen | Easy | 3 | Theme toggle, language selector, profile card |
| Login Form | Medium | 3 | Form validation, debounced API, error states |
| Dashboard | Hard | 4 | Metrics cards, performance tracking, charts |

### Phase 4: Challenge Hub App ⏳ PENDING

A standalone app for browsing and completing challenges.

```
apps/challenge-hub/
├── App.tsx
├── screens/
│   ├── ChallengeListScreen.tsx    # Browse by package/difficulty
│   ├── CheatsheetScreen.tsx       # View package reference docs
│   ├── ChallengeDetailScreen.tsx  # Requirements, timer, start
│   ├── ChallengeWorkspaceScreen.tsx  # Code editor (future)
│   └── SolutionScreen.tsx         # Revealed after attempt
├── components/
│   ├── ChallengeCard.tsx
│   ├── PackageFilter.tsx
│   ├── DifficultyBadge.tsx
│   ├── Timer.tsx
│   └── ProgressIndicator.tsx
├── data/
│   └── challenges.ts              # Challenge metadata
└── hooks/
    └── useProgress.ts             # Track completed challenges
```

**Features:**
- Filter challenges by package or difficulty
- Built-in countdown timer (60/90 min)
- Progress tracking (not started, attempted, completed)
- Lock solutions until timer ends or user submits
- Markdown rendering for cheatsheets/requirements
- Dark/light theme support

**Patreon Tiers:**
- Free: 1-2 sample challenges
- Paid: Full challenge library + new monthly challenges

---

## Theme Enhancements ⏳ PENDING

### Border Radius Tokens

Current: Card has hardcoded `borderRadius: 12`

Enhancement: Add radius tokens to theme:
```typescript
radius: {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 9999,
}
```

### Nested Border Radius Utility

**Problem:** Linktree's nested cards have misaligned corners because inner/outer elements use the same radius without accounting for padding.

**Solution:** `innerRadius = outerRadius - padding`

**Implementation Options:**
1. Utility function: `getNestedRadius(outer: number, padding: number) => number`
2. Card prop: `<Card nested>` auto-calculates inner radius
3. Hook: `useNestedRadius(outerRadius)` returns calculated inner

**Example:**
```tsx
const { spacing } = useTheme();
const outerRadius = 16;
const innerRadius = outerRadius - spacing.md; // 16 - 12 = 4
```

Great interview talking point - shows attention to design system details!

### Squircle Support (Future)

Linktree uses superellipse/"squircle" corners (iOS-style).
React Native doesn't support natively. Would need:
- `react-native-svg` with custom path
- Or `@shopify/react-native-skia` for smooth curves

Low priority for assessment, but good talking point in interview.

---

## Iterative Development Approach

```
Round 1: Complete challenge with current components + RN Switch fallback
    ↓
Phase 2: Build Switch, Badge, Avatar based on actual needs
    ↓
Round 2: Redo challenge using packaged components
    ↓
Compare: Document improvement in developer experience
    ↓
Phase 3: Add more scenarios
    ↓
Phase 4: Build Challenge Hub app
```

---

## Interview Alignment

**Linktree Senior Mobile Engineer ($200-220k)**
- React Native + TypeScript ✅
- GraphQL (future challenge)
- Statsig (feature flags - future challenge)
- Design system thinking ✅
- Performance optimization ✅

**Talking Points:**
1. Built reusable component library (shows initiative)
2. Created assessment system (shows teaching ability)
3. Nested border radius solution (shows design attention)
4. Badge system from PayPal (shows enterprise experience)

---

## Quick Start

### Attempt Challenge 1

```bash
cd apps/assessment-practice

# 1. Open CHEATSHEET.md for reference
# 2. Read CHALLENGE.md for requirements
# 3. Set a 90-minute timer
# 4. Implement in App.tsx
# 5. Compare with SOLUTION.md after
```

### Run the App

```bash
cd apps/assessment-practice
npm install
npx expo start
```

---

## Contributing

This is part of the @astacinco toolkit. Challenges and components are designed to be:
- Self-contained (no external dependencies beyond our packages)
- Well-documented (cheatsheets, hints, solutions)
- Realistic (aligned with actual job requirements)
- Iterative (build components based on real needs)
