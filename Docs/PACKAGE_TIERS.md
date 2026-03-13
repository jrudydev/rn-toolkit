# Package Tiers

## Overview

The toolkit follows a **three-repo model**:
- **Free packages** are MIT licensed and publicly available on GitHub (`rn-sdui-toolkit`)
- **Premium packages** are available to [Patreon](https://patreon.com/SparkLabs343) supporters (`rn-toolkit-pro`)
- **Internal apps** live in a private repo (`rn-astacinco`)

This allows developers to evaluate the toolkit with free packages while supporting development through premium features.

---

## Tier Breakdown

### Free Tier (MIT License) - Public Repo

| Package | Description |
|---------|-------------|
| `@astacinco/rn-theming` | Theme system with dark/light mode, tokens, scopes |
| `@astacinco/rn-primitives` | Theme-aware UI components (Text, Button, Card, etc.) |
| `@astacinco/rn-i18n` | Internationalization with adapter pattern |
| `@astacinco/rn-performance` | Performance monitoring, render tracking |
| `@astacinco/rn-testing` | Theme snapshots, mocks, test utilities |

### Premium Tier (Patreon) - Private Repo

| Package | Description |
|---------|-------------|
| `@astacinco/rn-auth` | Multi-provider authentication (Patreon OAuth, unlock codes) |
| `@astacinco/rn-sdui` | Server-Driven UI engine |
| `@astacinco/rn-analytics` | Event tracking with adapter pattern |
| `@astacinco/rn-deeplink` | Type-safe navigation & deep linking |
| `@astacinco/rn-notifications` | Push notifications |
| `@astacinco/rn-security` | Secure storage & validation |
| `@astacinco/rn-testing/dsl` | Declarative test DSL |

---

## Repository Structure

```
PUBLIC: github.com/jrudydev/rn-sdui-toolkit
├── packages/
│   ├── theming/        ✅ Free
│   ├── primitives/     ✅ Free
│   ├── i18n/           ✅ Free
│   ├── performance/    ✅ Free
│   └── testing/        ✅ Free (basic)
├── apps/
│   └── showcase/       ✅ Free component demo
└── README.md           → Links to Patreon

PRIVATE (Patreon): github.com/jrudydev/rn-toolkit-pro
├── packages/
│   ├── auth/           💎 Premium (Patreon OAuth)
│   ├── sdui/           💎 Premium
│   ├── analytics/      💎 Premium
│   ├── deeplink/       💎 Premium
│   ├── notifications/  💎 Premium
│   ├── security/       💎 Premium
│   └── testing/dsl/    💎 Premium
├── apps/
│   └── showcase-pro/   💎 Premium demo
└── README.md           → Setup instructions

PRIVATE (Internal): github.com/jrudydev/rn-astacinco
├── packages/
│   └── effects/        🔒 Internal (GPU effects, starfield)
├── apps/
│   ├── showcase/       🔒 Internal effects demo
│   └── challenge-hub/  🔒 Main product app
├── site/               🔒 Marketing site source
├── dist/               🔒 Built output (Cloudflare serves)
└── build.sh            → Build orchestration
```

---

## Getting Access

### Free Packages

```bash
# Install from npm (public)
npm install @astacinco/rn-theming @astacinco/rn-primitives
```

### Premium Packages

1. Subscribe on [Patreon](https://patreon.com/SparkLabs343) (Pro Developer tier)
2. Share your GitHub username
3. Accept the repository invite
4. Clone and use directly:

```bash
git clone https://github.com/jrudydev/rn-toolkit-pro.git
```

Or install from GitHub:

```bash
npm install github:jrudydev/rn-toolkit-pro#packages/sdui
```

---

## Patreon Tiers

| Tier | Price | Access |
|------|-------|--------|
| **Supporter** | $5/mo | Discord, early updates, thanks! |
| **Pro Developer** | $15/mo | All premium packages + showcase-pro |
| **Enterprise** | $50/mo | Priority support, architecture reviews |

---

## Split Packages (Free + Premium Tiers)

Some packages offer both free core functionality and premium extensions:

### Currently Split

| Package | Free (npm) | Premium (GitHub) |
|---------|------------|------------------|
| `@astacinco/rn-testing` | `renderWithTheme`, snapshots, mocks | DSL (`dsl.component()`, `dsl.matrix()`) |

### Future Considerations

| Package | Potential Free Tier | Potential Premium Tier |
|---------|---------------------|------------------------|
| `@astacinco/rn-sdui` | Basic renderer | Advanced containers, templates |
| `@astacinco/rn-deeplink` | Basic routing | Smart navigation, badging |

**Why split packages?**
- Lowers barrier to entry for free users
- Showcases toolkit quality
- Natural upgrade path to premium

**Implementation:**
- Free tier published to npm from public repo
- Premium tier adds features via the private repo
- Premium imports extend (not replace) free functionality

---

## FAQ

**Q: Can I use free packages commercially?**
A: Yes, MIT license allows commercial use.

**Q: What happens if my subscription ends?**
A: You keep the code you have, but lose access to the private repo for updates.

**Q: Do premium packages depend on free packages?**
A: Yes! `@astacinco/rn-sdui` uses primitives and theming internally. You'll install free packages from npm.

**Q: Can I contribute to free packages?**
A: Yes! PRs welcome on the public repo.

**Q: Can potential employers see the premium code?**
A: Yes, we can add them as temporary collaborators for review.

---

<div align="center">

**Built at [Spark Labs](https://patreon.com/SparkLabs343)**

[Patreon](https://patreon.com/SparkLabs343) · [GitHub](https://github.com/jrudydev)

</div>
