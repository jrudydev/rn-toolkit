/**
 * Free tier challenges
 *
 * These challenges use the free @astacinco packages:
 * - rn-primitives
 * - rn-theming
 * - rn-i18n
 * - rn-performance
 */

import type { ChallengeRegistry, Package, Challenge } from '../types';

export const freePackages: Package[] = [
  {
    id: 'primitives',
    name: '@astacinco/rn-primitives',
    displayName: 'Primitives',
    tier: 'free',
  },
  {
    id: 'theming',
    name: '@astacinco/rn-theming',
    displayName: 'Theming',
    tier: 'free',
  },
  {
    id: 'i18n',
    name: '@astacinco/rn-i18n',
    displayName: 'i18n',
    tier: 'free',
  },
  {
    id: 'performance',
    name: '@astacinco/rn-performance',
    displayName: 'Performance',
    tier: 'free',
  },
];

export const freeChallenges: Challenge[] = [
  {
    id: 'link-management',
    title: 'Link Management Screen',
    description: 'Build a Linktree-style link management screen with search, toggle, and add functionality.',
    scenario: 'You\'re building the Link Management screen for a "link in bio" app. Creators use this to manage their profile links.',
    difficulty: 'medium',
    timeMinutes: 90,
    packages: ['primitives', 'theming', 'i18n', 'performance'],
    tier: 'free',
    challengeFile: 'CHALLENGE.md',
    cheatsheetFile: 'CHEATSHEET.md',
    solutionFile: 'SOLUTION.md',
    hasNativeVersion: true,
    nativeChallengeFile: 'CHALLENGE_NATIVE.md',
    nativeCheatsheetFile: 'CHEATSHEET_NATIVE.md',
    nativeSolutionFile: 'SOLUTION_NATIVE.md',
    skills: ['CRUD operations', 'Search/filter', 'Toggle state', 'Form handling', 'Debounce'],
    alignedWith: 'Linktree Senior Mobile Engineer',
  },
  {
    id: 'settings-screen',
    title: 'Settings Screen',
    description: 'Build a settings screen with theme toggle, language selector, and notification preferences.',
    scenario: 'You\'re building the Settings screen for a mobile app where users customize their experience.',
    difficulty: 'easy',
    timeMinutes: 60,
    packages: ['primitives', 'theming', 'i18n'],
    tier: 'free',
    challengeFile: 'scenarios/SCENARIO_2_SETTINGS.md',
    cheatsheetFile: 'CHEATSHEET.md',
    skills: ['Theme switching', 'Language selection', 'Toggle preferences', 'Profile display'],
  },
  {
    id: 'login-form',
    title: 'Login Form',
    description: 'Build a login form with validation, debounced API calls, and loading states.',
    scenario: 'You\'re building the login screen for a mobile app with proper validation and UX.',
    difficulty: 'medium',
    timeMinutes: 75,
    packages: ['primitives', 'theming', 'performance'],
    tier: 'free',
    challengeFile: 'scenarios/SCENARIO_3_LOGIN.md',
    cheatsheetFile: 'CHEATSHEET.md',
    skills: ['Form validation', 'Debounced API', 'Loading states', 'Error handling'],
  },
  {
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Build an analytics dashboard with metrics cards, time filters, and activity feed.',
    scenario: 'You\'re building a dashboard for creators to view their link analytics and performance.',
    difficulty: 'hard',
    timeMinutes: 90,
    packages: ['primitives', 'theming', 'i18n', 'performance'],
    tier: 'free',
    challengeFile: 'scenarios/SCENARIO_4_DASHBOARD.md',
    cheatsheetFile: 'CHEATSHEET.md',
    skills: ['Data visualization', 'Filtering', 'Currency formatting', 'Performance tracking'],
    alignedWith: 'Linktree Senior Mobile Engineer',
  },
];

export const freeRegistry: ChallengeRegistry = {
  packages: freePackages,
  challenges: freeChallenges,
};
