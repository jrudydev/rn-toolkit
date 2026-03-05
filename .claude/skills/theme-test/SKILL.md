---
name: theme-test
description: Run tests with theme snapshots for both light and dark modes. Verifies theme consistency.
allowed-tools: Bash, Read, Grep
---

# 🌓 Theme Testing

Runs tests and verifies theme consistency across light and dark modes.

## Usage

```
/theme-test [component-name]
```

Examples:
- `/theme-test` - Run all theme tests
- `/theme-test Button` - Run tests for Button component only

## Quick Commands

### Run All Theme Tests

```bash
npm test
```

### Run Specific Component Tests

```bash
npm test -- --testPathPattern="<ComponentName>"
```

### Update Snapshots

```bash
npm test -- --updateSnapshot
```

### Run with Coverage

```bash
npm run test:coverage
```

## Theme Testing Requirements

Every visual component MUST have:

### 1. Light Mode Test

```typescript
it('renders_correctly_inLightMode', () => {
  const { getByTestId } = renderWithTheme(<Component />, 'light');
  expect(getByTestId('component')).toBeTruthy();
});
```

### 2. Dark Mode Test

```typescript
it('renders_correctly_inDarkMode', () => {
  const { getByTestId } = renderWithTheme(<Component />, 'dark');
  expect(getByTestId('component')).toBeTruthy();
});
```

### 3. Light Snapshot

```typescript
it('matches_lightTheme_snapshot', () => {
  const { toJSON } = renderWithTheme(<Component />, 'light');
  expect(toJSON()).toMatchSnapshot();
});
```

### 4. Dark Snapshot

```typescript
it('matches_darkTheme_snapshot', () => {
  const { toJSON } = renderWithTheme(<Component />, 'dark');
  expect(toJSON()).toMatchSnapshot();
});
```

## Verify Theme Token Usage

Check that components use theme tokens, not hardcoded values:

```bash
# Find hardcoded colors (should use colors.* instead)
grep -r "#[0-9A-Fa-f]\{6\}" packages/primitives/src --include="*.tsx" | grep -v "\.test\."

# Find hardcoded spacing (should use spacing.* instead)
grep -r "padding: [0-9]" packages/primitives/src --include="*.tsx"
grep -r "margin: [0-9]" packages/primitives/src --include="*.tsx"
```

**Expected:** No hardcoded colors or spacing values in component files.

## Theme Color Verification

Verify that critical colors change between themes:

```typescript
describe('Theme Consistency', () => {
  it('background_changes_betweenThemes', () => {
    const lightResult = renderWithTheme(<Component />, 'light');
    const darkResult = renderWithTheme(<Component />, 'dark');

    const lightBg = lightResult.getByTestId('component').props.style.backgroundColor;
    const darkBg = darkResult.getByTestId('component').props.style.backgroundColor;

    expect(lightBg).not.toBe(darkBg);
  });
});
```

## Snapshot Location

Snapshots are stored in:
```
packages/<package>/__tests__/__snapshots__/
├── ComponentName.test.tsx.snap
```

Each snapshot file contains both theme variants:
- `renders correctly in light mode 1`
- `renders correctly in dark mode 1`

## Common Issues

### Snapshot Mismatch

If snapshots don't match:

1. Review the changes:
   ```bash
   npm test -- --verbose
   ```

2. If changes are intentional, update:
   ```bash
   npm test -- --updateSnapshot
   ```

3. If changes are unintentional, fix the component.

### Missing Theme Tokens

If component doesn't respond to theme changes:

1. Ensure `useTheme()` is called:
   ```typescript
   const { colors, spacing } = useTheme();
   ```

2. Use tokens in styles:
   ```typescript
   style={{ backgroundColor: colors.surface }}
   ```

3. Re-run theme tests.

## Checklist

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] Light mode snapshot exists
- [ ] Dark mode snapshot exists
- [ ] No hardcoded colors in components
- [ ] No hardcoded spacing in components
- [ ] Background changes between themes
- [ ] Text color changes between themes
