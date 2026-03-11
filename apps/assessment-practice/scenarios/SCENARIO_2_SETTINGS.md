# Scenario 2: Settings Screen

**Time Limit:** 60 minutes
**Difficulty:** Easy
**Packages:** 3 (rn-primitives, rn-theming, rn-i18n)

---

## Scenario

You're building the Settings screen for a mobile app. Users can customize their
experience, change language, toggle notifications, and switch themes.

---

## What You're Building

A settings screen with:
1. User profile card at top
2. Theme toggle (light/dark)
3. Language selector (English/Spanish)
4. Notification preferences (toggles)
5. About section with app version

---

## Functional Requirements

### FR1: Profile Card
- [ ] Display user avatar (use Avatar component)
- [ ] Show user name and email
- [ ] "Edit Profile" button (no functionality needed)

### FR2: Theme Toggle
- [ ] Switch between light and dark mode
- [ ] All components adapt immediately
- [ ] Persist choice (use state, no storage needed)

### FR3: Language Selector
- [ ] Show current language
- [ ] Button to switch between English/Spanish
- [ ] All text updates immediately (use i18n)

### FR4: Notification Settings
- [ ] Push notifications toggle
- [ ] Email notifications toggle
- [ ] Marketing emails toggle
- [ ] Each toggle shows current state

### FR5: About Section
- [ ] App name and version
- [ ] Links to Terms and Privacy (just Text, no navigation)

---

## Technical Requirements

```tsx
// Required imports
import { ThemeProvider, useTheme } from '@astacinco/rn-theming';
import { Text, Button, Card, VStack, HStack, Switch, Avatar, Divider } from '@astacinco/rn-primitives';
import { I18nProvider, ConsoleAdapter, useTranslation, useLocale } from '@astacinco/rn-i18n';
```

---

## Mock Data

```typescript
const user = {
  name: 'Jane Creator',
  email: 'jane@example.com',
  avatar: 'https://via.placeholder.com/80',
};

const appInfo = {
  name: 'LinkTree Clone',
  version: '1.0.0',
};
```

---

## Translations to Create

```typescript
const en = {
  settings: {
    title: 'Settings',
    profile: 'Profile',
    editProfile: 'Edit Profile',
    appearance: 'Appearance',
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    language: 'Language',
    notifications: 'Notifications',
    pushNotifications: 'Push Notifications',
    emailNotifications: 'Email Notifications',
    marketingEmails: 'Marketing Emails',
    about: 'About',
    version: 'Version {{version}}',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
  },
};

const es = {
  settings: {
    title: 'Configuración',
    profile: 'Perfil',
    editProfile: 'Editar Perfil',
    // ... etc
  },
};
```

---

## Grading Rubric

| Criteria | Points |
|----------|--------|
| Profile Card | 15 |
| Theme Toggle | 20 |
| Language Switching | 25 |
| Notification Toggles | 20 |
| About Section | 10 |
| TypeScript Quality | 10 |

---

## Tips

1. Start with the layout structure
2. Add theme toggle early (affects everything)
3. Set up i18n with both languages
4. Use VStack/HStack for clean layouts
5. Use Divider to separate sections
