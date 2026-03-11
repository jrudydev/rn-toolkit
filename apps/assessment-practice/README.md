# Assessment Practice

A realistic CodeSignal-style timed coding assessment for practicing React Native development with @astacinco packages.

## Overview

This app simulates a real technical assessment you might encounter in job interviews. It's designed for:

- **Interview Prep**: Practice under timed conditions
- **Package Learning**: Learn @astacinco packages by using them
- **Skill Building**: Build real features from requirements

## The Assessment: Link Management Screen

Build a Linktree-style link management screen with:
- Link list display with cards
- Toggle switch for link visibility
- Add new link form
- Search with debouncing
- Dark/light mode toggle
- i18n pluralization

**Time Limit:** 90 minutes
**Difficulty:** Medium
**Aligned With:** Linktree Senior Mobile Engineer role

## Files

| File | Purpose |
|------|---------|
| `CHALLENGE.md` | Assessment requirements (packaged version) |
| `CHALLENGE_NATIVE.md` | Requirements for native version |
| `CHEATSHEET.md` | Quick reference for packages |
| `CHEATSHEET_NATIVE.md` | React Native API reference |
| `SOLUTION.md` | Reference solution (view after) |
| `SOLUTION_NATIVE.md` | Native solution without packages |
| `App.tsx` | Starter code - your work goes here |
| `data/links.ts` | Mock link data |
| `i18n/en.ts` | Translation strings |

## Two Versions

### Packaged Version (90 min)
Uses @astacinco packages - focus on integration and speed.

```bash
npm start
# Open CHALLENGE.md and CHEATSHEET.md
```

### Native Version (120 min)
Build from scratch without packages - shows React Native fundamentals.

```bash
npm start
# Open CHALLENGE_NATIVE.md and CHEATSHEET_NATIVE.md
```

## How to Practice

### First Attempt
1. Read `CHALLENGE.md` completely
2. Open `CHEATSHEET.md` for reference
3. Set a 90-minute timer
4. Code in `App.tsx`
5. Compare against `SOLUTION.md` when done

### Redo for Comparison
Try the native version to understand the value of packaged components:
1. Reset `App.tsx` to starter code
2. Use `CHALLENGE_NATIVE.md` and `CHEATSHEET_NATIVE.md`
3. Set a 120-minute timer
4. Compare experience and time difference

## Packages Used

- `@astacinco/rn-primitives` - UI components
- `@astacinco/rn-theming` - Dark/light mode
- `@astacinco/rn-i18n` - Pluralization
- `@astacinco/rn-performance` - useDebounce

## Quick Start

```bash
# Install dependencies
npm install

# Start development
npm start

# Or run on specific platform
npm run ios
npm run android
```

## Related

- **Challenge Hub App**: Browse all assessments and challenges
- **Scaffold App**: Template for creating new practice apps
