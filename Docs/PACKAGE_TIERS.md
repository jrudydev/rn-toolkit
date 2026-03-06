# Package Tiers

## Overview

The toolkit follows a **two-repo model**:
- **Free packages** are MIT licensed and publicly available on GitHub
- **Premium packages** are available to [Patreon](https://patreon.com/SparkLabs343) supporters

This allows developers to evaluate the toolkit with free packages while supporting development through premium features.

---

## Tier Breakdown

### Free Tier (MIT License) - Public Repo

| Package | Description |
|---------|-------------|
| `@rn-toolkit/theming` | Theme system with dark/light mode, tokens, scopes |
| `@rn-toolkit/primitives` | Theme-aware UI components (Text, Button, Card, etc.) |
| `@rn-toolkit/i18n` | Internationalization with adapter pattern |
| `@rn-toolkit/performance` | Performance monitoring, render tracking |
| `@rn-toolkit/testing` | Theme snapshots, mocks, test utilities |

### Premium Tier (Patreon) - Private Repo

| Package | Description |
|---------|-------------|
| `@rn-toolkit/sdui` | Server-Driven UI engine |
| `@rn-toolkit/auth` | Multi-provider authentication |
| `@rn-toolkit/analytics` | Event tracking with adapter pattern |
| `@rn-toolkit/deeplink` | Type-safe navigation & deep linking |
| `@rn-toolkit/notifications` | Push notifications |
| `@rn-toolkit/security` | Secure storage & validation |
| `@rn-toolkit/testing/dsl` | Declarative test DSL |

---

## Repository Structure

```
PUBLIC: github.com/jrudydev/rn-toolkit
├── packages/
│   ├── theming/        ✅ Free
│   ├── primitives/     ✅ Free
│   ├── i18n/           ✅ Free
│   ├── performance/    ✅ Free
│   └── testing/        ✅ Free (basic)
├── apps/
│   └── scaffold/       ✅ Free demo app
└── README.md           → Links to Patreon

PRIVATE: github.com/jrudydev/rn-toolkit-pro
├── packages/
│   ├── sdui/           💎 Premium
│   ├── auth/           💎 Premium
│   ├── analytics/      💎 Premium
│   ├── deeplink/       💎 Premium
│   ├── notifications/  💎 Premium
│   ├── security/       💎 Premium
│   └── testing/dsl/    💎 Premium
├── apps/
│   └── showcase-pro/   💎 Premium demo
└── README.md           → Setup instructions
```

---

## Getting Access

### Free Packages

```bash
# Install from npm (public)
npm install @rn-toolkit/theming @rn-toolkit/primitives
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

## FAQ

**Q: Can I use free packages commercially?**
A: Yes, MIT license allows commercial use.

**Q: What happens if my subscription ends?**
A: You keep the code you have, but lose access to the private repo for updates.

**Q: Do premium packages depend on free packages?**
A: Yes! `@rn-toolkit/sdui` uses primitives and theming internally. You'll install free packages from npm.

**Q: Can I contribute to free packages?**
A: Yes! PRs welcome on the public repo.

**Q: Can potential employers see the premium code?**
A: Yes, we can add them as temporary collaborators for review.

---

<div align="center">

**Built at [Spark Labs](https://patreon.com/SparkLabs343)**

[Patreon](https://patreon.com/SparkLabs343) · [GitHub](https://github.com/jrudydev)

</div>
