# Challenge Hub

A React Native app for browsing and completing coding challenges using @astacinco packages.

## Features

- **Challenge Browser** - Filter by tier (free/pro) and difficulty
- **Built-in Timer** - Countdown with pause/resume
- **Version Toggle** - Switch between packaged and native versions
- **Progress Tracking** - Track completed challenges (coming soon)
- **Extensible** - Pro repo can add its own challenges

## Screenshots

Coming soon...

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
│   │   ├── free-challenges.ts  # Free tier challenges
│   │   └── index.ts            # Registry merger
│   └── types/
│       └── challenge.ts        # TypeScript interfaces
└── package.json
```

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
  challenges: [
    {
      id: 'analytics-integration',
      title: 'Analytics Integration',
      tier: 'pro',
      // ...
    },
  ],
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

## Challenge Data Structure

```typescript
interface Challenge {
  id: string;
  title: string;
  description: string;
  scenario: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeMinutes: number;
  packages: string[];
  tier: 'free' | 'pro';

  // File references
  challengeFile: string;
  cheatsheetFile: string;
  solutionFile?: string;

  // Native version
  hasNativeVersion?: boolean;
  nativeChallengeFile?: string;

  // Metadata
  skills: string[];
  alignedWith?: string;
}
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
Card for list display:

```tsx
<ChallengeCard
  challenge={challenge}
  status="not_started"
  onPress={() => navigate('Detail', { id: challenge.id })}
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

- [ ] Markdown viewer for challenge files
- [ ] Persistent progress storage
- [ ] Challenge completion stats
- [ ] Share challenge results
- [ ] Code editor integration (web)
