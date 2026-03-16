# Testing Issues & Known Limitations

## React 19 + React Native Jest Mock Incompatibility

**Status:** Tests skipped as of March 2026
**Affects:** 12 test suites, ~94 individual tests
**Root cause:** React Native's `jest/mockComponent.js` incompatible with React 19

### The Problem

When running tests that render React Native components (Text, View, etc.), Jest fails with:

```
TypeError: Cannot read properties of undefined (reading 'constructor')

at constructor (node_modules/react-native/jest/mockComponent.js:42:29)
```

### Technical Details

React Native's `mockComponent.js` line 42 does:
```javascript
RealComponent.prototype.constructor instanceof React.Component
```

In React 19, functional components don't have a `prototype` property defined the same way, causing `prototype` to be `undefined` and the check to fail.

### What Works

- Hook tests (useTheme, etc.)
- Adapter tests
- Logic/utility tests
- Any test that doesn't render RN components

### What's Skipped

Tests that render React Native components:
- `packages/primitives/__tests__/Button.test.tsx`
- `packages/primitives/__tests__/Card.test.tsx`
- `packages/primitives/__tests__/Container.test.tsx`
- `packages/primitives/__tests__/Input.test.tsx`
- `packages/primitives/__tests__/Stack.test.tsx`
- `packages/primitives/__tests__/Tabs.test.tsx`
- `packages/primitives/__tests__/Tag.test.tsx`
- `packages/primitives/__tests__/Text.test.tsx`
- `packages/primitives/__tests__/Timer.test.tsx`
- `packages/testing/__tests__/renderWithProviders.test.tsx`
- `packages/testing/__tests__/renderWithTheme.test.tsx`
- `packages/theming/__tests__/ThemeProvider.test.tsx`

### Why We're on React 19

Expo SDK 54 requires React 19 + React Native 0.81.5. Downgrading would break the demo app.

### Potential Solutions to Explore

1. **Wait for React Native fix**
   - Monitor: https://github.com/facebook/react-native/issues
   - The mockComponent.js needs to handle functional components properly

2. **Custom Jest transformer**
   - Replace react-native's mock system with a custom one
   - Complexity: High

3. **Alternative testing approaches**
   - Use Detox for E2E tests instead of unit tests
   - Use React Native Web + jsdom for component tests
   - Complexity: Medium

4. **Manual component mocks**
   - Create `__mocks__/react-native.js` with React 19-compatible mocks
   - Previous attempt caused circular dependency issues
   - May need more careful implementation

5. **Downgrade React (not recommended)**
   - Would require downgrading Expo SDK
   - Loses React 19 features

### Current Workaround

Tests are skipped using `describe.skip()`. The component code works correctly - only the test infrastructure is affected.

### Re-enabling Tests

When React Native releases a fix:

1. Remove `describe.skip` from affected test files
2. Remove the skip comment
3. Run `npm test` to verify
4. Update this document

### References

- [React Native Issue #52152](https://github.com/facebook/react-native/issues/52152) - Related Jest setup issues
- [Expo Issue #37842](https://github.com/expo/expo/issues/37842) - Similar prototype undefined errors
- Expo SDK 54 requires React 19

---

*Last updated: March 2026*
