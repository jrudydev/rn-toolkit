# Assessment Solution Template

Use this template when creating step-by-step solutions for assessments and challenges.

---

## Structure Overview

```
SOLUTION-STEPS.md        # Packaged version (uses @astacinco packages)
SOLUTION-STEPS-NATIVE.md # Native version (built from scratch)
```

---

## Required Sections

### 1. Title and Instructions
```markdown
# [Assessment Name] - Step-by-Step Solution

Work through each step. Test before moving on.
```

### 2. Challenge Requirements Map
Map each step to the original challenge requirement:

```markdown
## Challenge Requirements Map

| Step | Challenge Requirement |
|------|----------------------|
| 5-6 | **Core Task 1:** [Task name] |
| 7-8 | **Core Task 2:** [Task name] |
| ... | ... |
| 16-17 | **Bonus:** [Bonus name] |
```

### 3. Steps Format
Each step should follow this format:

```markdown
### Step N: [Short descriptive title]

> **Completes: [Challenge Requirement Name]** (if applicable)

**Na. [Sub-step description]:**
\`\`\`tsx
// Code snippet
\`\`\`

**Nb. [Sub-step description]:**
\`\`\`tsx
// Code snippet
\`\`\`

**Test:** [How to verify this step works]
```

### 4. Final Checklist
```markdown
## Final Checklist

| Task | Status |
|------|:------:|
| [Requirement 1] | ⬜ |
| [Requirement 2] | ⬜ |
| (Bonus) [Bonus 1] | ⬜ |
```

---

## Step Guidelines

### Keep Steps Small and Testable
- Each step should produce a visible/testable result
- User should be able to run the app after each step
- Avoid combining multiple concepts in one step

### Use No-Op Placeholders
When a step requires a handler that isn't implemented yet:
```tsx
// No-op placeholder - implement in Step N
const handleSomething = (_param: string) => {};
```

### Group Related Steps
Organize steps into logical sections:
- **Setup Steps** (1-4): Imports, providers, basic structure
- **Core Tasks** (5-N): Main functionality
- **Required Challenges** (N-M): Additional required features
- **Bonus Challenges** (M-end): Optional enhancements

### Include Import Reminders
When introducing new components, show the import:
```tsx
// Add to imports at top:
import { NewComponent } from '@astacinco/rn-primitives';
```

---

## Native Version Differences

For SOLUTION-STEPS-NATIVE.md, include additional steps for:

1. **Building Theme System** (Steps N-M)
   - Define color tokens
   - Create ThemeContext
   - Create ThemeProvider
   - Create useTheme hook

2. **Building Hooks** (Steps M-O)
   - useDebounce implementation
   - Other custom hooks

3. **Building Components** (Steps O-P)
   - Card component
   - Input component
   - Button component

### Native Step Example
```markdown
### Step N: Create useDebounce hook

> **Native Implementation:** This replaces `@astacinco/rn-performance`

\`\`\`tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
\`\`\`

**Why this matters:** This is ~15 lines you'd write every project without the package.

**Test:** No errors (used in next step)
```

---

## Metrics to Track

At the end of native solutions, include comparison:

```markdown
## Code Comparison

| Section | Native | With @astacinco |
|---------|--------|-----------------|
| Theme System | ~45 lines | 0 (imported) |
| useDebounce | ~15 lines | 0 (imported) |
| Components | ~100 lines | 0 (imported) |
| Business Logic | ~100 lines | ~100 lines |
| Styles | ~40 lines | 0 (theme-aware) |
| **Total** | **~300 lines** | **~170 lines** |

**Result:** Native version is **2x more code** than packaged version.
```

---

## Checklist for New Solutions

- [ ] Requirements map at top
- [ ] Steps numbered sequentially
- [ ] Each step has test criteria
- [ ] No-op placeholders where needed
- [ ] Imports shown when introducing components
- [ ] SafeAreaView/ScrollView/StatusBar in setup
- [ ] Final checklist at bottom
- [ ] (Native) Code comparison metrics
