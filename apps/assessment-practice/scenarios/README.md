# Assessment Scenarios

Alternative challenges using the same scaffolding. Each scenario tests different skills
and uses different combinations of @astacinco packages.

---

## Available Scenarios

| # | Scenario | Time | Difficulty | Packages |
|---|----------|------|------------|----------|
| 1 | [Link Management](../CHALLENGE.md) | 90 min | Medium | 4 |
| 2 | [Settings Screen](./SCENARIO_2_SETTINGS.md) | 60 min | Easy | 3 |
| 3 | [Login Form](./SCENARIO_3_LOGIN.md) | 75 min | Medium | 3 |
| 4 | [Analytics Dashboard](./SCENARIO_4_DASHBOARD.md) | 90 min | Hard | 4 |

---

## Package Coverage

| Package | S1 | S2 | S3 | S4 |
|---------|----|----|----|----|
| rn-primitives | ✅ | ✅ | ✅ | ✅ |
| rn-theming | ✅ | ✅ | ✅ | ✅ |
| rn-i18n | ✅ | ✅ | - | ✅ |
| rn-performance | ✅ | - | ✅ | ✅ |

---

## Skill Focus

| Scenario | Primary Skills |
|----------|----------------|
| Link Management | CRUD, search, toggle, lists |
| Settings Screen | Theme, i18n, toggles, profile |
| Login Form | Validation, debounce, loading states |
| Dashboard | Metrics, formatting, composition |

---

## How to Use

1. Pick a scenario matching your skill level
2. Read the scenario requirements
3. Use `CHEATSHEET.md` for package reference
4. Set timer and complete in `App.tsx`
5. Compare with solution (when available)

---

## Creating New Scenarios

Each scenario needs:
1. Requirements document (this folder)
2. Mock data file (optional, can use existing)
3. Translation keys (if using i18n)
4. Solution file (optional)

Template:
```markdown
# Scenario N: [Name]

**Time Limit:** X minutes
**Difficulty:** Easy/Medium/Hard
**Packages:** N (list them)

## Scenario
[Business context]

## What You're Building
[Feature list]

## Functional Requirements
[Checklist of features]

## Technical Requirements
[Required imports]

## Mock Data
[TypeScript interfaces and sample data]

## Grading Rubric
[Point breakdown]

## Tips
[Helpful hints]
```
