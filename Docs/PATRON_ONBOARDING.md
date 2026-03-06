# Patron Onboarding Guide

Welcome to @rn-toolkit premium! This guide helps Patreon supporters get access to premium packages.

---

## Patreon Tiers

| Tier | Price | Access |
|------|-------|--------|
| **Supporter** | $5/mo | Discord access, early updates |
| **Pro Developer** | $15/mo | All premium packages + showcase-pro |
| **Enterprise** | $50/mo | Priority support, architecture reviews |

---

## Getting Access (Pro Developer+)

### Step 1: Subscribe on Patreon

Subscribe at [patreon.com/SparkLabs343](https://patreon.com/SparkLabs343)

### Step 2: Share Your GitHub Username

Send your GitHub username via:
- Patreon DM
- Discord (if you've joined)

### Step 3: Accept Repository Invite

Within 24 hours, you'll receive a GitHub invitation to:
- `github.com/jrudydev/rn-toolkit-pro`

### Step 4: Clone and Use

```bash
# Clone the premium repo
git clone https://github.com/jrudydev/rn-toolkit-pro.git
cd rn-toolkit-pro

# Install dependencies
npm install

# Run the showcase app
cd apps/showcase-pro
npm start
```

---

## Using Premium Packages

### Option A: Clone and Link Locally

```bash
# In your project
npm link ../rn-toolkit-pro/packages/sdui
```

### Option B: Install from GitHub

```bash
npm install github:jrudydev/rn-toolkit-pro#packages/sdui
```

### Option C: Copy Package into Your Project

Some developers prefer to copy the package source directly.

---

## What's Included

### Premium Packages

| Package | Description |
|---------|-------------|
| `@rn-toolkit/sdui` | Server-Driven UI engine |
| `@rn-toolkit/auth` | Multi-provider authentication |
| `@rn-toolkit/analytics` | Event tracking with adapters |
| `@rn-toolkit/deeplink` | Type-safe navigation |
| `@rn-toolkit/notifications` | Push notifications |
| `@rn-toolkit/security` | Secure storage & validation |
| `@rn-toolkit/testing/dsl` | Declarative test DSL |

### Showcase App

`apps/showcase-pro` demonstrates all packages working together.

---

## Free Dependencies

Premium packages use free packages internally. Install them from npm:

```bash
npm install @rn-toolkit/theming @rn-toolkit/primitives
```

---

## Support

- **Discord**: Link in Patreon
- **GitHub Issues**: For bugs and feature requests
- **Patreon DM**: For account/access issues

---

## Cancellation

If you cancel your Patreon subscription:
- GitHub access is revoked at end of billing period
- Code you've already cloned continues to work
- You won't receive future updates

---

## FAQ

**Q: Can I use premium packages in commercial projects?**
A: Yes! Your subscription includes a commercial license.

**Q: Can I share access with my team?**
A: Pro tier is per-developer. Contact for team pricing.

**Q: Can I fork the private repo?**
A: You can clone it, but please don't redistribute.

---

<div align="center">

**Built at [Spark Labs](https://patreon.com/SparkLabs343)**

[Patreon](https://patreon.com/SparkLabs343) · [GitHub](https://github.com/jrudydev)

</div>
