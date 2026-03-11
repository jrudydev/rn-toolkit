# Challenge Hub

A React Native app for browsing and completing coding challenges using @astacinco packages. Features a two-tier challenge system with full assessments and reusable generic challenges.

## Two-Tier Challenge System

### Assessments
Full timed challenges with specific use cases:
- Have their own app folder (e.g., `assessment-practice/`)
- Include requirements, cheatsheet, and solution files
- Reference required and bonus generic challenges
- Support both packaged and native versions
- Aligned with real job roles (e.g., "Linktree Senior Mobile Engineer")

### Generic Challenges
Reusable features that can be applied to any assessment:
- Self-contained with inline instructions and solutions
- Include both packaged and native implementations
- Can be practiced standalone or as part of assessments
- Examples: debounced search, dark mode toggle, form validation

## Features

- **Challenge Browser** - Filter by type (assessment/challenge), tier (free/pro), and difficulty
- **Built-in Timer** - Countdown with pause/resume
- **Version Toggle** - Switch between packaged and native versions
- **Inline Solutions** - View cheatsheets and solutions directly in the app
- **Progress Tracking** - Track completed challenges (coming soon)
- **Extensible** - Pro repo can add its own challenges

## Architecture

```
apps/challenge-hub/
├── App.tsx                    # Navigation setup
├── src/
│   ├── components/
│   │   ├── Timer.tsx          # Countdown timer
│   │   ├── ChallengeCard.tsx  # Challenge list item
│   │   ├── DifficultyBadge.tsx
│   │   └── FilterTabs.tsx
│   ├── screens/
│   │   ├── ChallengeListScreen.tsx
│   │   └── ChallengeDetailScreen.tsx
│   ├── data/
│   │   ├── free-challenges.ts  # Free tier data
│   │   └── index.ts            # Registry merger
│   └── types/
│       └── challenge.ts        # TypeScript interfaces
└── package.json
```

## Data Types

### Assessment
```typescript
interface Assessment {
  type: 'assessment';
  id: string;
  title: string;
  description: string;
  scenario: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeMinutes: number;
  packages: string[];
  tier: 'free' | 'pro';

  // App folder reference
  appFolder: string; // e.g., 'assessment-practice'

  // File references (relative to app folder)
  challengeFile: string;
  cheatsheetFile: string;
  solutionFile?: string;

  // Native version support
  hasNativeVersion?: boolean;
  nativeChallengeFile?: string;
  nativeCheatsheetFile?: string;
  nativeSolutionFile?: string;

  // Required generic challenges
  requiredChallenges: string[];
  bonusChallenges?: string[];

  // Metadata
  skills: string[];
  alignedWith?: string;
}
```

### Generic Challenge
```typescript
interface GenericChallenge {
  type: 'challenge';
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeMinutes: number;
  packages: string[];
  tier: 'free' | 'pro';

  // Instructions (shared)
  instructions: string;

  // Packaged solution
  solution: string;
  cheatsheet?: string;

  // Native solution
  nativeTimeMinutes?: number;
  nativeSolution?: string;
  nativeCheatsheet?: string;

  // Metadata
  skills: string[];
}
```

## Available Challenges

### Free Tier Assessments
| Assessment | Difficulty | Time | Packages |
|------------|------------|------|----------|
| Link Management Screen | Medium | 90 min | 4 |

### Free Tier Generic Challenges
| Challenge | Difficulty | Time | Native Time |
|-----------|------------|------|-------------|
| Debounced Search | Easy | 15 min | 20 min |
| Dark Mode Toggle | Easy | 10 min | 15 min |
| Form Validation | Easy | 15 min | 20 min |
| Loading States | Easy | 10 min | 12 min |
| Empty States | Easy | 10 min | 12 min |
| Settings Screen | Easy | 45 min | 60 min |
| Login Form | Medium | 45 min | 60 min |
| Analytics Dashboard | Hard | 60 min | 80 min |

## Extending with Pro Challenges

The pro repo can add its own challenges:

```typescript
// In rn-toolkit-pro/data/pro-challenges.ts
import type { ChallengeRegistry } from '@astacinco/challenge-hub';

export const proRegistry: ChallengeRegistry = {
  packages: [
    { id: 'analytics', name: '@astacinco/rn-analytics', ... },
    { id: 'sdui', name: '@astacinco/rn-sdui', ... },
  ],
  assessments: [...],
  challenges: [...],
};
```

Then merge in the hub:

```typescript
// In challenge-hub/src/data/index.ts
import { proRegistry } from '@astacinco/rn-toolkit-pro/challenges';

export const challengeRegistry = mergeRegistries(
  freeRegistry,
  proRegistry,
);
```

## Running the App

```bash
cd apps/challenge-hub
npm install
npx expo start
```

## Components

### Timer
Countdown timer with pause, resume, and reset:

```tsx
<Timer
  durationMinutes={90}
  onStart={() => console.log('Started!')}
  onComplete={() => console.log('Time up!')}
/>
```

### ChallengeCard
Card for list display (handles both Assessment and GenericChallenge):

```tsx
<ChallengeCard
  item={challengeItem}
  status="not_started"
  onPress={() => navigate('Detail', { itemId, itemType })}
/>
```

### FilterTabs
Horizontal filter selector:

```tsx
<FilterTabs
  options={[{ value: 'all', label: 'All' }, ...]}
  selected="all"
  onSelect={setFilter}
/>
```

## Packages Used

This app dogfoods the @astacinco packages:

- `@astacinco/rn-primitives` - UI components
- `@astacinco/rn-theming` - Dark/light mode
- `@react-navigation/native` - Navigation

## Future Enhancements

- [ ] Markdown viewer for inline solutions
- [ ] Persistent progress storage
- [ ] Challenge completion stats
- [ ] Share challenge results
- [ ] Code editor integration (web)
- [ ] Reactive framework solutions (RxJS, MobX)
