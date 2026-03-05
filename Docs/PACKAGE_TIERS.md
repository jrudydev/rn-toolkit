# Package Tiers

## Overview

The toolkit follows an **open core** model:
- **Free packages** are MIT licensed and publicly available
- **Paid packages** require a subscription (Patreon or similar)

This allows users to evaluate the toolkit with free packages while supporting development through paid advanced features.

---

## Tier Breakdown

### Free Tier (MIT License)

| Package | Description | Why Free |
|---------|-------------|----------|
| `@rn-toolkit/theming` | Theme system with dark/light mode | Table stakes for any UI library |
| `@rn-toolkit/primitives` | Basic UI components (Text, Button, Card, etc.) | Needed to use other packages |
| `@rn-toolkit/testing` (basic) | `renderWithTheme()`, `createThemeSnapshot()`, mocks | Users must test free packages |

**What's included in free testing:**
- `renderWithTheme(component)` - Render with ThemeProvider
- `renderWithProviders(component)` - Render with all providers
- `createThemeSnapshot(component)` - Generate light/dark snapshots
- `mockNavigation()` - Navigation mock for testing
- `mockSDUISchema()` - SDUI schema mock

### Paid Tier (Subscription Required)

| Package | Description | Why Paid |
|---------|-------------|----------|
| `@rn-toolkit/sdui` | Server-Driven UI engine | Core value - dynamic UI from JSON |
| `@rn-toolkit/deeplink` | Type-safe navigation & deep linking | Advanced navigation features |
| `@rn-toolkit/testing/dsl` | Declarative test DSL | Developer experience enhancement |

**What's included in paid testing DSL:**
```typescript
// Fluent, declarative API
dsl.screen('Profile')
  .hasComponent('Avatar')
  .withProps({ size: 'large' })
  .isVisible()
  .matchesSnapshot();

dsl.component('Button')
  .when({ pressed: true })
  .hasStyle({ opacity: 0.8 });
```

---

## Repository Strategy

### Option A: Separate Repos (Chosen)

```
rn-toolkit-core/        # Free packages (public, MIT)
├── packages/theming
├── packages/primitives
└── packages/testing (basic)

rn-toolkit-pro/         # Paid packages (private, subscription)
├── packages/sdui
├── packages/deeplink
└── packages/testing/dsl
```

**Pros:**
- Clear separation of concerns
- Easy to manage access control
- Public repo gets community contributions

**Cons:**
- Two repos to maintain
- Cross-repo dependencies need care

### Implementation Plan

1. **Now**: Keep everything in one private repo (`rn-sdui-toolkit`)
2. **Before public release**:
   - Extract free packages to `rn-toolkit-core` (public)
   - Keep paid packages in `rn-toolkit-pro` (private)
3. **Distribution**:
   - Free: npm public registry
   - Paid: npm private registry or GitHub Packages

---

## Access Control

### Free Packages
- Published to npm public registry
- MIT license
- Open source contributions welcome
- No authentication required

### Paid Packages
- Distributed via:
  - npm private registry (organization-based)
  - OR GitHub Packages (repo-based)
  - OR direct download with license key
- Subscription validated at install or runtime
- Updates included with active subscription

---

## Pricing Model (Future)

| Tier | Price | Access |
|------|-------|--------|
| Free | $0 | theming, primitives, basic testing |
| Individual | $X/month | All packages, personal use |
| Team | $Y/month | All packages, team use, priority support |
| Enterprise | Custom | All packages, SLA, custom features |

---

## Migration Path

Users can start with free packages and upgrade:

```bash
# Start free
npm install @rn-toolkit/theming @rn-toolkit/primitives

# Add paid when ready
npm install @rn-toolkit/sdui @rn-toolkit/deeplink --registry=https://npm.rn-toolkit.dev
```

---

## FAQ

**Q: Can I use free packages commercially?**
A: Yes, MIT license allows commercial use.

**Q: What happens if my subscription lapses?**
A: You keep the version you have, but won't receive updates.

**Q: Can I contribute to free packages?**
A: Yes! PRs welcome on the public repo.

**Q: Do paid packages depend on free packages?**
A: Yes, `@rn-toolkit/sdui` uses primitives and theming internally.
