# RN Toolkit (Free)

Free React Native toolkit: theming, primitives, i18n, performance monitoring, and testing utilities.

## Project Structure

```
packages/
├── theming/      # Theme system (dark/light mode, tokens)
├── primitives/   # Theme-aware UI components
├── i18n/         # Internationalization (adapter pattern)
├── performance/  # Performance monitoring (adapter pattern)
└── testing/      # Test utilities & snapshots

apps/
└── scaffold/     # Demo app
```

## Key Patterns

### Theme-Aware Components
All components must use `useTheme()` hook for colors/spacing.

### Adapter Pattern
i18n and Performance packages support swappable backends:
- Production adapters (i18next, Firebase)
- Console adapters (debug logging)
- NoOp adapters (testing)

### Test-Driven Development
Write tests first. Every component needs:
- Unit tests for logic
- Snapshot tests for both dark/light modes

## Commands

```bash
npm install           # Install dependencies
npm test              # Run tests
npm run test:coverage # Run tests with coverage
npm run lint          # Check linting
npm run typecheck     # TypeScript check
```

## Package Naming

All packages use `@astacinco/rn-` scope:
- `@astacinco/rn-theming`
- `@astacinco/rn-primitives`
- `@astacinco/rn-i18n`
- `@astacinco/rn-performance`
- `@astacinco/rn-testing`

## Premium Packages

Premium packages (SDUI, Auth, Analytics, etc.) are available on Patreon:
https://patreon.com/SparkLabs343
