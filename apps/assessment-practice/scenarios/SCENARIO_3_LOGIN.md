# Scenario 3: Login Form

**Time Limit:** 75 minutes
**Difficulty:** Medium
**Packages:** 3 (rn-primitives, rn-theming, rn-performance)

---

## Scenario

You're building the login screen for a mobile app. The form needs validation,
loading states, and should debounce API calls during email validation.

---

## What You're Building

A login screen with:
1. Email input with real-time validation
2. Password input with show/hide toggle
3. "Remember me" checkbox
4. Login button with loading state
5. Error message display
6. "Forgot Password" and "Sign Up" links

---

## Functional Requirements

### FR1: Email Input
- [ ] Text input for email
- [ ] Real-time validation (debounced 500ms)
- [ ] Show error for invalid email format
- [ ] Show checkmark for valid email

### FR2: Password Input
- [ ] Secure text input
- [ ] Toggle to show/hide password
- [ ] Minimum 8 characters validation
- [ ] Show error when too short

### FR3: Form Validation
- [ ] Validate on blur and on submit
- [ ] Disable submit until form is valid
- [ ] Show inline errors below inputs

### FR4: Submit Flow
- [ ] Show loading state on button
- [ ] Simulate API call (2 second delay)
- [ ] Show success or error message
- [ ] Clear form on success

### FR5: Additional Links
- [ ] "Forgot Password?" link
- [ ] "Don't have an account? Sign Up" link
- [ ] Links don't need to navigate

---

## Technical Requirements

```tsx
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';
import { Text, Button, Card, VStack, Input } from '@astacinco/rn-primitives';
import { useDebounce, useDebouncedCallback } from '@astacinco/rn-performance';
```

---

## Validation Rules

```typescript
// Email validation
const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Password validation
const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};
```

---

## Mock API

```typescript
// Simulate login API
async function mockLogin(email: string, password: string): Promise<{ success: boolean; message: string }> {
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate different responses
  if (email === 'error@test.com') {
    return { success: false, message: 'Invalid credentials' };
  }

  return { success: true, message: 'Login successful!' };
}
```

---

## Grading Rubric

| Criteria | Points |
|----------|--------|
| Email Validation (debounced) | 25 |
| Password Input + Toggle | 15 |
| Form Validation | 20 |
| Loading States | 15 |
| Error Handling | 15 |
| TypeScript Quality | 10 |

---

## Tips

1. Use `useDebounce` for email validation
2. Track touched state for each field
3. Keep validation logic separate from UI
4. Test both success and error flows
5. Use `secureTextEntry` prop for password
