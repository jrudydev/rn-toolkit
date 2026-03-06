# Publishing Guide

## Overview

Free packages are published to npm public registry. Premium packages stay in a private GitHub repo.

---

## Free Packages → npm Public

### Packages

- `@rn-toolkit/theming`
- `@rn-toolkit/primitives`
- `@rn-toolkit/i18n`
- `@rn-toolkit/performance`
- `@rn-toolkit/testing`

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

<div align="center">

**Built at [Spark Labs](https://patreon.com/SparkLabs343)**

[Patreon](https://patreon.com/SparkLabs343) · [GitHub](https://github.com/jrudydev)

</div>
