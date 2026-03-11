/**
 * Free tier assessments and challenges
 *
 * These use the free @astacinco packages:
 * - rn-primitives
 * - rn-theming
 * - rn-i18n
 * - rn-performance
 */

import type { ChallengeRegistry, Package, Assessment, GenericChallenge } from '../types';

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
  {
    id: 'logging',
    name: '@astacinco/rn-logging',
    displayName: 'Logging',
    tier: 'free',
  },
];

// =============================================================================
// ASSESSMENTS - Full timed challenges with specific use cases
// =============================================================================

export const freeAssessments: Assessment[] = [
  {
    type: 'assessment',
    id: 'link-management',
    title: 'Link Management Screen',
    description: 'Build a Linktree-style link management screen with search, toggle, and add functionality.',
    scenario: 'You\'re building the Link Management screen for a "link in bio" app. Creators use this to manage their profile links.',
    difficulty: 'medium',
    timeMinutes: 90,
    packages: ['primitives', 'theming', 'i18n', 'performance'],
    tier: 'free',
    appFolder: 'assessment-practice',
    challengeFile: 'CHALLENGE.md',
    cheatsheetFile: 'CHEATSHEET.md',
    solutionFile: 'SOLUTION.md',
    hasNativeVersion: true,
    nativeChallengeFile: 'CHALLENGE_NATIVE.md',
    nativeCheatsheetFile: 'CHEATSHEET_NATIVE.md',
    nativeSolutionFile: 'SOLUTION_NATIVE.md',
    requiredChallenges: ['debounced-search', 'dark-mode-toggle'],
    bonusChallenges: ['form-validation', 'loading-states', 'empty-states'],
    skills: ['CRUD operations', 'Search/filter', 'Toggle state', 'Form handling'],
    alignedWith: 'Linktree Senior Mobile Engineer',
  },
];

// =============================================================================
// GENERIC CHALLENGES - Reusable features for any assessment
// =============================================================================

export const freeChallenges: GenericChallenge[] = [
  // --- Required for Link Management ---
  {
    type: 'challenge',
    id: 'debounced-search',
    title: 'Debounced Search',
    description: 'Implement a search input that debounces user input before filtering results.',
    difficulty: 'easy',
    timeMinutes: 15,
    packages: ['primitives', 'performance'],
    tier: 'free',
    instructions: `
## Debounced Search

Add a search input that filters a list with debouncing to prevent excessive re-renders.

### Requirements
- Add a search Input at the top of your screen
- Use \`useDebounce\` from \`@astacinco/rn-performance\`
- Set debounce delay to 300ms
- Filter results case-insensitively
- Show filtered count

### Implementation
\`\`\`tsx
import { useDebounce } from '@astacinco/rn-performance';

const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);

const filteredItems = items.filter(item =>
  item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
);
\`\`\`

### Acceptance Criteria
- [ ] Search input is visible
- [ ] Typing triggers debounce (no immediate filter)
- [ ] Results filter after 300ms delay
- [ ] Filter is case-insensitive
    `,
    skills: ['Debouncing', 'Search UX', 'Performance optimization'],
  },
  {
    type: 'challenge',
    id: 'dark-mode-toggle',
    title: 'Dark Mode Toggle',
    description: 'Add a toggle to switch between light and dark themes.',
    difficulty: 'easy',
    timeMinutes: 10,
    packages: ['primitives', 'theming'],
    tier: 'free',
    instructions: `
## Dark Mode Toggle

Add a button or switch to toggle between light and dark themes.

### Requirements
- Add a theme toggle button in the header
- Use \`useTheme\` from \`@astacinco/rn-theming\`
- All components should adapt to theme change
- Persist theme choice (optional bonus)

### Implementation
\`\`\`tsx
import { useTheme } from '@astacinco/rn-theming';

const { mode, setMode, colors } = useTheme();

const toggleTheme = () => {
  setMode(mode === 'light' ? 'dark' : 'light');
};

<Button
  label={\`Switch to \${mode === 'light' ? 'Dark' : 'Light'}\`}
  onPress={toggleTheme}
/>
\`\`\`

### Acceptance Criteria
- [ ] Toggle button is visible
- [ ] Pressing toggles between light/dark
- [ ] Background color changes
- [ ] Text colors adapt
- [ ] All Card/Button components update
    `,
    skills: ['Theming', 'State management', 'UX'],
  },

  // --- Bonus Challenges ---
  {
    type: 'challenge',
    id: 'form-validation',
    title: 'Form Validation',
    description: 'Add input validation with error states and submission prevention.',
    difficulty: 'easy',
    timeMinutes: 15,
    packages: ['primitives'],
    tier: 'free',
    instructions: `
## Form Validation

Add validation to form inputs with visual error feedback.

### Requirements
- Validate required fields are not empty
- Show error message below invalid inputs
- Disable submit button until form is valid
- Use Input component's \`error\` prop

### Implementation
\`\`\`tsx
const [title, setTitle] = useState('');
const [titleError, setTitleError] = useState<string>();

const validateTitle = (value: string) => {
  setTitle(value);
  if (value.trim().length === 0) {
    setTitleError('Title is required');
  } else {
    setTitleError(undefined);
  }
};

<Input
  label="Title"
  value={title}
  onChangeText={validateTitle}
  error={titleError}
/>

<Button
  label="Submit"
  disabled={!!titleError || title.length === 0}
  onPress={handleSubmit}
/>
\`\`\`

### Acceptance Criteria
- [ ] Empty fields show error on blur/submit
- [ ] Error message appears below input
- [ ] Submit button disabled when invalid
- [ ] Errors clear when corrected
    `,
    skills: ['Form handling', 'Validation', 'Error states'],
  },
  {
    type: 'challenge',
    id: 'loading-states',
    title: 'Loading States',
    description: 'Add loading indicators during async operations.',
    difficulty: 'easy',
    timeMinutes: 10,
    packages: ['primitives'],
    tier: 'free',
    instructions: `
## Loading States

Show loading feedback during async operations.

### Requirements
- Show loading indicator when submitting
- Disable form inputs during loading
- Simulate async delay (500ms)
- Clear loading state on completion

### Implementation
\`\`\`tsx
const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async () => {
  setIsLoading(true);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  // Do the actual work
  addItem(newItem);
  setIsLoading(false);
};

<Button
  label={isLoading ? 'Adding...' : 'Add'}
  disabled={isLoading}
  onPress={handleSubmit}
/>
\`\`\`

### Acceptance Criteria
- [ ] Button shows "Loading..." or similar
- [ ] Button is disabled during loading
- [ ] Inputs are disabled during loading
- [ ] Loading clears after operation
    `,
    skills: ['Async handling', 'UX feedback', 'State management'],
  },
  {
    type: 'challenge',
    id: 'empty-states',
    title: 'Empty States',
    description: 'Show helpful messages when lists are empty or searches have no results.',
    difficulty: 'easy',
    timeMinutes: 10,
    packages: ['primitives'],
    tier: 'free',
    instructions: `
## Empty States

Handle empty lists and no-results gracefully.

### Requirements
- Show message when list is empty
- Show different message when search has no results
- Include call-to-action where appropriate

### Implementation
\`\`\`tsx
{items.length === 0 && !searchTerm && (
  <VStack spacing="md" align="center">
    <Text variant="body">No items yet</Text>
    <Button label="Add your first item" onPress={showAddForm} />
  </VStack>
)}

{items.length === 0 && searchTerm && (
  <VStack spacing="md" align="center">
    <Text variant="body">No results for "{searchTerm}"</Text>
    <Button label="Clear search" variant="ghost" onPress={() => setSearchTerm('')} />
  </VStack>
)}
\`\`\`

### Acceptance Criteria
- [ ] Empty list shows "No items" message
- [ ] No search results shows "No results for X"
- [ ] CTA button is present
- [ ] Messages are styled appropriately
    `,
    skills: ['UX design', 'Conditional rendering', 'Edge cases'],
  },

  // --- Additional Generic Challenges (from scenarios) ---
  {
    type: 'challenge',
    id: 'settings-screen',
    title: 'Settings Screen',
    description: 'Build a settings screen with preferences, profile card, and notification toggles.',
    difficulty: 'easy',
    timeMinutes: 45,
    packages: ['primitives', 'theming', 'i18n'],
    tier: 'free',
    instructions: `
## Settings Screen

Build a complete settings screen with multiple preference sections.

### Requirements
- Theme toggle (light/dark/auto)
- Language selector with i18n
- Notification preference toggles
- User profile card
- About section with version info

### Sections to Build
1. **Profile Card** - Avatar, name, email
2. **Appearance** - Theme toggle
3. **Language** - Language selector
4. **Notifications** - Push, email, marketing toggles
5. **About** - Version, privacy, terms links

### Acceptance Criteria
- [ ] All sections render
- [ ] Theme toggle works
- [ ] Language changes text (if i18n configured)
- [ ] Toggles persist state
- [ ] Clean visual hierarchy
    `,
    skills: ['Settings UI', 'Multiple toggles', 'Section layout', 'Profile display'],
  },
  {
    type: 'challenge',
    id: 'login-form',
    title: 'Login Form',
    description: 'Build a login form with validation, password visibility toggle, and error handling.',
    difficulty: 'medium',
    timeMinutes: 45,
    packages: ['primitives', 'theming', 'performance'],
    tier: 'free',
    instructions: `
## Login Form

Build a complete login form with proper validation and UX.

### Requirements
- Email and password inputs
- Email format validation
- Password minimum length (8 chars)
- Show/hide password toggle
- Remember me checkbox
- Loading state on submit
- Error message display
- Debounced email validation

### Implementation Notes
- Use Input component with \`secureTextEntry\`
- Validate email with regex
- Show inline errors
- Disable submit until valid

### Acceptance Criteria
- [ ] Email validates format
- [ ] Password validates length
- [ ] Password visibility toggle works
- [ ] Submit disabled until valid
- [ ] Loading state shows on submit
- [ ] Errors display appropriately
    `,
    skills: ['Form validation', 'Password handling', 'Email validation', 'Error states'],
  },
  {
    type: 'challenge',
    id: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description: 'Build a dashboard with metric cards, time filters, and activity feed.',
    difficulty: 'hard',
    timeMinutes: 60,
    packages: ['primitives', 'theming', 'i18n', 'performance'],
    tier: 'free',
    instructions: `
## Analytics Dashboard

Build a dashboard displaying metrics and activity.

### Requirements
- Summary cards (views, clicks, revenue)
- Time period filter (Today, Week, Month, Year)
- Activity feed/timeline
- Number formatting with i18n
- Currency formatting
- Refresh functionality

### Sections to Build
1. **Summary Row** - 3-4 metric cards
2. **Time Filter** - Button group for period
3. **Chart Area** - Placeholder or simple bar
4. **Activity Feed** - Recent events list

### Acceptance Criteria
- [ ] Metric cards show values
- [ ] Time filter updates data
- [ ] Numbers are formatted (1,234)
- [ ] Currency shows symbol
- [ ] Activity feed scrolls
- [ ] Theme adapts all sections
    `,
    skills: ['Dashboard layout', 'Data visualization', 'Number formatting', 'Filtering'],
  },
];

// =============================================================================
// REGISTRY EXPORT
// =============================================================================

export const freeRegistry: ChallengeRegistry = {
  packages: freePackages,
  assessments: freeAssessments,
  challenges: freeChallenges,
};
