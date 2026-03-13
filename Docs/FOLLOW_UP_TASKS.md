# Follow-Up Tasks

Tracks pending work for the Challenge Hub Pro enhancement and related updates.

---

## Repository Migration (In Progress)

### Completed
- [x] Rename `rn-effects-private` → `rn-astacinco` on GitHub
- [x] Update plan with new architecture
- [x] Delete duplicate auth package from free repo

### Pending
- [ ] Move `challenge-hub` from `rn-sdui-toolkit` → `rn-astacinco`
- [ ] Copy marketing site from `astacinco` → `rn-astacinco/site/`
- [ ] Set up build script in `rn-astacinco`
- [ ] Update Cloudflare to point to `rn-astacinco`
- [ ] Archive old `astacinco` repo

---

## After Pro Hub Ships

### Sites to Update
- [ ] astacinco.com - Update package list on marketing site
- [ ] Patreon perks - Update tier descriptions

### npm Publishing
- [ ] Publish `@astacinco/rn-auth` to npm (from rn-toolkit-pro)
- [ ] Update all package versions if needed
- [ ] Run `npm run publish:free` for batch publish

### Patreon Developer App Setup
- [ ] Go to https://www.patreon.com/portal/registration/register-clients
- [ ] Create new OAuth client for Challenge Hub
- [ ] Set redirect URI (dev): `exp://localhost:8081/--/auth/callback`
- [ ] Set redirect URI (prod): `https://astacinco.com/hub/auth/callback`
- [ ] Copy Client ID and Client Secret
- [ ] Get Tier IDs from Patreon dashboard (Pro Developer, Enterprise)
- [ ] Store secrets securely (environment variables, not in repo)

---

## Content to Add

### Company Dossiers (Pro)
- [ ] Linktree - https://linktr.ee
  - Job posting: https://jobs.gem.com/linktree/am9icG9zdDoau1t59ieqPX6VCL7M8WF2
  - Tech stack research
  - Interview process
  - Glassdoor insights
  - Salary ranges
- [ ] Additional target companies (TBD)

### Interview Follow-up Questions (Pro)
- [ ] Linktree technical questions
- [ ] Linktree behavioral questions
- [ ] System design questions

### Pro Assessment (Pairs with Free Linktree Assessment)
- [ ] Create pro assessment that uses pro packages (auth, etc.)
- [ ] Same Linktree scenario but demonstrates pro tooling
- [ ] Free assessment = free packages only
- [ ] Pro assessment = free + pro packages (auth, analytics, etc.)
- [ ] Shows value proposition of upgrading to pro tier

---

## Package Tier Audit (Future)

Review which packages should be free vs pro:

| Package | Current | Consider | Notes |
|---------|---------|----------|-------|
| `rn-auth` | Pro | - | Stays in rn-toolkit-pro |
| `rn-analytics` | Pro | Free? | Good candidate for free tier |
| `rn-sdui` | Pro | Split? | Basic renderer free, advanced pro |
| `rn-deeplink` | Pro | - | Keep pro |
| `rn-notifications` | Pro | - | Keep pro |

---

## Architecture Summary

```
Three Repos:
=============
rn-sdui-toolkit (public/free)
├── packages/          # Free packages (primitives, theming, i18n, etc.)
└── apps/showcase/     # Public demo app

rn-toolkit-pro (paid/Patreon)
├── packages/          # Pro packages (auth, analytics, sdui, etc.)
└── apps/showcase-pro/ # Pro demo app

rn-astacinco (private)
├── apps/challenge-hub/  # Main product app
├── site/                # Marketing site
├── dist/                # Built output (Cloudflare serves this)
└── build.sh             # Orchestrates builds
```

---

## Reference URLs

| Resource | URL |
|----------|-----|
| Linktree Main Site | https://linktr.ee |
| Linktree Job Posting | https://jobs.gem.com/linktree/am9icG9zdDoau1t59ieqPX6VCL7M8WF2 |
| Patreon Developer Portal | https://www.patreon.com/portal/registration/register-clients |
| SparkLabs Patreon | https://patreon.com/SparkLabs343 |
| Astacinco Site | https://astacinco.com |
| Challenge Hub (Live) | https://astacinco.com/hub |
| Showcase (Live) | https://astacinco.com/showcase |

---

<div align="center">

**Built at [Spark Labs](https://patreon.com/SparkLabs343)**

</div>
