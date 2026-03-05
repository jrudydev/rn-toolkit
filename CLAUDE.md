# RN SDUI Toolkit

Modular React Native toolkit with Server-Driven UI, deep linking, theming, and testing DSL.

## Project Structure

```
packages/
├── theming/      # Theme system (dark/light mode, tokens)
├── sdui/         # Server-Driven UI engine
├── deeplink/     # Type-safe navigation + deep linking
├── testing/      # Test DSL + snapshot utilities
└── primitives/   # Generic UI building blocks

apps/
└── scaffold/     # Ready-to-use app template
```

## Key Patterns

### Doc-First Approach
Create README.md before implementing each package.

### Theme-Aware Components
All components must use `useTheme()` hook for colors/spacing.

### Test-Driven Development
Write tests first. Every component needs:
- Unit tests for logic
- Snapshot tests for both dark/light modes

### Type-Safe Navigation
Use enums for route definitions, not strings.

## Commands

```bash
npm install           # Install dependencies
npm test              # Run tests
npm run test:coverage # Run tests with coverage
npm run lint          # Check linting
npm run typecheck     # TypeScript check
```

## Package Naming

All packages use `@rn-toolkit/` scope:
- `@rn-toolkit/theming`
- `@rn-toolkit/sdui`
- `@rn-toolkit/deeplink`
- `@rn-toolkit/testing`
- `@rn-toolkit/primitives`
