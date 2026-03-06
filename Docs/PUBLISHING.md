# Publishing Guide

This guide covers how to publish @rn-toolkit packages to npm.

## Package Tiers

### FREE Packages (npm public)
- `@rn-toolkit/theming` - Theme system
- `@rn-toolkit/primitives` - UI components
- `@rn-toolkit/i18n` - Internationalization (NoOp + Console adapters)
- `@rn-toolkit/performance` - Performance monitoring (NoOp + Console adapters)
- `@rn-toolkit/testing` - Basic test utilities

### PAID Packages (GitHub Packages - private)
- `@rn-toolkit/sdui` - Server-Driven UI engine
- `@rn-toolkit/auth` - Authentication system
- `@rn-toolkit/analytics` - Analytics (Firebase adapter)
- `@rn-toolkit/deeplink` - Deep linking + navigation
- `@rn-toolkit/notifications` - Push notifications
- `@rn-toolkit/security` - Secure storage + biometrics

---

## Prerequisites

### 1. npm Account Setup
```bash
# Login to npm
npm login

# Verify you're logged in
npm whoami
```

### 2. GitHub Packages Setup (for PAID packages)
```bash
# Create a GitHub Personal Access Token with:
# - read:packages
# - write:packages
# - delete:packages

# Add to ~/.npmrc (for publishing)
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

---

## Publishing FREE Packages

### Step 1: Update Version
```bash
# From package directory
cd packages/theming
npm version patch  # or minor, major
```

### Step 2: Build (if applicable)
```bash
npm run build
```

### Step 3: Publish
```bash
# Publish to npm public registry
npm publish --access public
```

### All FREE packages at once:
```bash
# From repo root
npm run publish:free
```

---

## Publishing PAID Packages

### Step 1: Update Version
```bash
cd packages/sdui
npm version patch
```

### Step 2: Publish to GitHub Packages
```bash
npm publish --registry=https://npm.pkg.github.com
```

### All PAID packages at once:
```bash
npm run publish:paid
```

---

## Version Management

We use independent versioning (each package has its own version).

### Versioning Convention
- `0.x.x` - Pre-release / beta
- `1.0.0` - First stable release
- Patch: Bug fixes
- Minor: New features (backward compatible)
- Major: Breaking changes

### Checking Versions
```bash
# See all package versions
npm run versions
```

---

## Pre-Publish Checklist

- [ ] All tests pass: `npm test`
- [ ] TypeScript compiles: `npm run typecheck`
- [ ] No lint errors: `npm run lint`
- [ ] CHANGELOG updated
- [ ] Version bumped
- [ ] Git committed and pushed

---

## CI/CD Publishing (Future)

When ready, we can automate publishing via GitHub Actions:

```yaml
# .github/workflows/publish.yml
name: Publish Packages
on:
  push:
    tags:
      - 'v*'
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm test
      - run: npm run publish:free
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## Troubleshooting

### "You must be logged in to publish"
```bash
npm login
```

### "Package name already exists"
Ensure you're using the `@rn-toolkit/` scope and have access.

### "402 Payment Required"
Public packages are free, but private packages on npm require a paid plan.
Use GitHub Packages for paid packages instead.
