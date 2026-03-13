# Follow-Up Tasks

Tracks pending work for the Challenge Hub Pro enhancement and related updates.

---

## After Pro Hub Ships

### Sites to Update
- [ ] astacinco.com - Update package list, add auth package
- [ ] Patreon perks - Update tier descriptions to reflect auth moving to free

### npm Publishing
- [ ] Publish `@astacinco/rn-auth` to npm
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
| `rn-auth` | Free | - | Needed for apps to check membership |
| `rn-analytics` | Pro | Free? | Good candidate for free tier |
| `rn-sdui` | Pro | Split? | Basic renderer free, advanced pro |
| `rn-deeplink` | Pro | - | Keep pro |
| `rn-notifications` | Pro | - | Keep pro |

---

## Infrastructure

- [ ] Cloudflare Access - Not needed for now (using in-app auth only)
- [ ] Domain/SSL verification for OAuth redirect

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
