---
name: pre-commit
description: Pre-commit checklist - typecheck, lint, test, check for console.logs. Run before committing code.
allowed-tools: Bash, Grep, Read, Glob
---

# 🔍 Pre-Commit Checklist

Run before committing to verify code is ready.

## 0. ⚠️ FIRST: Check for Leftover Changes (CRITICAL)

**ALWAYS run this first to catch uncommitted work from previous sessions:**

```bash
# Show ALL uncommitted changes (staged + unstaged)
git status --short

# Count changes by folder to identify separate features
git status --short | cut -c4- | cut -d'/' -f1-3 | sort | uniq -c | sort -rn
```

**If you see changes in MULTIPLE unrelated areas, STOP and ask:**
- "There are uncommitted changes in X, Y, Z - which should we commit?"
- Don't let old changes pile up across sessions

**Red flags:**
- Changes in multiple packages (e.g., `packages/theming/` AND `packages/sdui/`)
- Mix of `apps/` and `packages/` changes that seem unrelated
- More than ~20 changed files

## 1. ✅ TypeScript Check (ZERO ERRORS)

```bash
npm run typecheck
```

- [ ] No TypeScript errors
- [ ] All types properly defined
- [ ] No `any` types (unless explicitly justified)

## 2. 🔍 ESLint Check (ZERO ERRORS)

```bash
npm run lint
```

- [ ] No ESLint errors
- [ ] No ESLint warnings (preferred)

**Auto-fix available:**
```bash
npm run lint:fix
```

## 3. 🧪 Tests Pass (ALL GREEN)

```bash
npm test
```

- [ ] All tests pass
- [ ] No skipped tests (unless explicitly justified)
- [ ] Theme tests cover both light and dark modes

## 4. 🚫 No Console Logs (ZERO TOLERANCE)

```bash
# Find console statements in changed files
git diff --name-only | xargs grep -l "console.log\|console.warn\|console.error" 2>/dev/null

# Find in all source files
grep -r "console.log\|console.warn\|console.error" packages/*/src apps/*/src 2>/dev/null | grep -v node_modules
```

**Policy:** NO console.log in committed code. Period.

- [ ] No `console.log()` statements
- [ ] No `console.warn()` statements
- [ ] No `console.error()` statements
- [ ] No `console.debug()` statements

**Exception:** Proper error boundaries with `console.error` for production error tracking.

## 5. 📦 Package.json Checks

```bash
# Check for mismatched versions
git diff --name-only | grep "package.json"
```

- [ ] No accidental dependency changes
- [ ] Version numbers consistent across packages
- [ ] No `package-lock.json` conflicts

## 6. 📁 All Related Files Staged Together

```bash
git status --short
```

- [ ] All related `.ts/.tsx` files staged
- [ ] Test files staged with their components
- [ ] Documentation staged with features

## 7. 🏷️ Commit Message Format

Follow conventional commits:

```
<type>: <description>

[optional body]

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `test:` Adding tests
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `chore:` Maintenance tasks

## Quick Commands

```bash
# Run all checks
npm run typecheck && npm run lint && npm test

# Stage all changes except lock files
git add $(git diff --name-only | grep -v 'package-lock.json')

# Unstage node_modules (if accidentally staged)
git reset HEAD -- node_modules/
```

## Checklist Summary

- [ ] No leftover changes from previous sessions
- [ ] TypeScript: PASS
- [ ] ESLint: PASS
- [ ] Tests: PASS
- [ ] No console.logs
- [ ] Related files staged together
- [ ] Commit message follows format
