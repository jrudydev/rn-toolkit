# Patron Onboarding Guide

Welcome to @rn-toolkit! This guide helps Patreon supporters access the paid packages.

---

## Tier Structure

| Tier | Price | Access |
|------|-------|--------|
| **Supporter** | $5/mo | Discord access, early updates |
| **Pro Developer** | $15/mo | All paid packages, showcase-pro app |
| **Enterprise** | $50/mo | Priority support, architecture reviews |

---

## Getting Access (Pro Developer+)

### Step 1: Link Your GitHub

After subscribing on Patreon:
1. Go to [Patreon Settings](https://www.patreon.com/settings/apps)
2. Connect your GitHub account
3. DM your GitHub username on Discord or Patreon

### Step 2: Accept Repository Invite

Within 24 hours, you'll receive a GitHub invitation to:
- `sparklabs343/rn-toolkit-pro` (access repo with setup instructions)

### Step 3: Generate GitHub Token

1. Go to [GitHub Tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Select scopes:
   - `read:packages`
4. Copy the token (you won't see it again!)

### Step 4: Configure npm

Create or edit `~/.npmrc` in your home directory:

```ini
# GitHub Packages authentication
@rn-toolkit:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

**For project-specific setup**, add `.npmrc` to your project root:
```ini
@rn-toolkit:registry=https://npm.pkg.github.com
```

Then set the token as an environment variable:
```bash
export NPM_TOKEN=your_github_token
```

### Step 5: Install Paid Packages

```bash
# Now you can install paid packages!
npm install @rn-toolkit/sdui
npm install @rn-toolkit/auth
npm install @rn-toolkit/analytics
# etc.
```

---

## Accessing showcase-pro

The showcase-pro app demonstrates all paid features:

```bash
# Clone the pro access repo
git clone https://github.com/sparklabs343/rn-toolkit-pro.git

# Navigate to showcase
cd rn-toolkit-pro/showcase-pro

# Install dependencies
npm install

# Start the app
npm start
```

---

## Troubleshooting

### "404 Not Found" when installing
- Verify your GitHub token has `read:packages` scope
- Check your `.npmrc` is correctly configured
- Ensure you accepted the repository invitation

### "401 Unauthorized"
- Your token may have expired - generate a new one
- Make sure there are no extra spaces in `.npmrc`

### Token Security
- **Never commit tokens to git**
- Add `.npmrc` to `.gitignore` if it contains tokens
- Use environment variables in CI/CD

---

## Support

- **Discord**: [Spark Labs Server](https://discord.gg/sparklabs)
- **GitHub Issues**: For bugs and feature requests
- **Patreon DM**: For account/access issues

---

## Cancellation

If you cancel your Patreon subscription:
- GitHub access is revoked at end of billing period
- Installed packages continue to work
- You won't receive updates or new versions

---

## FAQ

**Q: Can I use paid packages in commercial projects?**
A: Yes! Your subscription includes a commercial license.

**Q: Can I share my access with my team?**
A: The Pro tier is per-developer. For teams, contact us about Enterprise pricing.

**Q: Do I need to configure this on every machine?**
A: Yes, each development machine needs the `.npmrc` setup.

**Q: What if I need help with implementation?**
A: Enterprise tier includes architecture reviews and priority support.
