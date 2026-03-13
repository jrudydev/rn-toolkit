# Publishing Guide

## Overview

Free packages are published to npm public registry. Premium packages stay in a private GitHub repo.

---

## Free Packages → npm Public

### Packages

- `@astacinco/rn-theming`
- `@astacinco/rn-primitives`
- `@astacinco/rn-i18n`
- `@astacinco/rn-performance`
- `@astacinco/rn-testing`

### Prerequisites

```bash
# Login to npm
npm login

# Verify you're logged in
npm whoami
```

### Publishing

```bash
# From package directory
cd packages/theming
npm version patch  # or minor, major
npm publish --access public
```

### All Free Packages at Once

```bash
npm run publish:free
```

---

## Premium Packages → Private Repo

Premium packages live in `github.com/jrudydev/rn-toolkit-pro`.

Patrons install directly from GitHub:

```bash
# Clone the repo
git clone https://github.com/jrudydev/rn-toolkit-pro.git

# Or install specific package
npm install github:jrudydev/rn-toolkit-pro#packages/sdui
```

No npm publishing required - access is controlled via GitHub collaborator invites.

---

## Version Management

We use independent versioning (each package has its own version).

### Versioning Convention

- `0.x.x` - Pre-release / beta
- `1.0.0` - First stable release
- Patch: Bug fixes
- Minor: New features (backward compatible)
- Major: Breaking changes

---

## Pre-Publish Checklist

- [ ] All tests pass: `npm test`
- [ ] TypeScript compiles: `npm run typecheck`
- [ ] No lint errors: `npm run lint`
- [ ] CHANGELOG updated
- [ ] Version bumped
- [ ] Git committed and pushed

---

## Updating App Dependencies

After publishing new package versions, update the apps:

### 1. Update Package Versions

```bash
# Update specific app
cd apps/challenge-hub
npm update @astacinco/rn-primitives @astacinco/rn-theming

# Or update all apps at once (from root)
npm update -w apps/challenge-hub -w apps/showcase
```

### 2. Reinstall Dependencies

```bash
# From root
npm install
```

### 3. Test Locally

```bash
# Test each app
cd apps/showcase && npx expo start
cd apps/challenge-hub && npx expo start
```

### 4. Rebuild and Deploy

```bash
# From sites/astacinco directory
bash build.sh

# Commit dist folder and push
git add dist
git commit -m "Rebuild apps with updated packages"
git push
```

Cloudflare Pages will automatically deploy from the `dist` folder.

---

## Full Release Checklist

When releasing a new version:

- [ ] Bump package versions
- [ ] Run tests
- [ ] Publish to npm: `npm run publish:free`
- [ ] Update app dependencies
- [ ] Test apps locally
- [ ] Run build script
- [ ] Commit and push
- [ ] Verify Cloudflare deployment
- [ ] Update astacinco.com if package list changed
- [ ] Update Patreon perks if tiers changed

---

<div align="center">

**Built at [Spark Labs](https://patreon.com/SparkLabs343)**

[Patreon](https://patreon.com/SparkLabs343) · [GitHub](https://github.com/jrudydev)

</div>
