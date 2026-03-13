# Patreon OAuth Setup Guide

This guide covers setting up Patreon OAuth for the Challenge Hub app to authenticate users and check their membership tier.

---

## Prerequisites

- Patreon creator account (https://patreon.com/SparkLabs343)
- Access to Patreon Developer Portal

---

## Step 1: Create OAuth Client

1. Go to https://www.patreon.com/portal/registration/register-clients
2. Click "Create Client"
3. Fill in the details:
   - **App Name**: Challenge Hub
   - **Description**: React Native assessment practice app
   - **App Category**: Developer Tools
   - **Redirect URIs**: See Step 2

---

## Step 2: Configure Redirect URIs

Add both development and production redirect URIs:

### Development
```
exp://localhost:8081/--/auth/callback
```

### Production
```
https://astacinco.com/hub/auth/callback
```

> **Note**: Expo uses the `exp://` scheme in development. For production builds, you may need a custom URL scheme or universal link.

---

## Step 3: Get Credentials

After creating the client, copy:

- **Client ID**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Client Secret**: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

> **IMPORTANT**: Never commit the Client Secret to the repo!

---

## Step 4: Get Tier IDs

From your Patreon campaign dashboard, get the tier IDs:

1. Go to your campaign settings
2. Navigate to "Tiers"
3. Each tier has an ID in the URL when you edit it

### SparkLabs Tier Mapping

| Patreon Tier | Tier ID | App Tier |
|--------------|---------|----------|
| Pro Developer ($15/mo) | `TBD` | `pro` |
| Enterprise ($50/mo) | `TBD` | `pro` |
| Supporter ($5/mo) | `TBD` | `free` |
| No subscription | - | `free` |

---

## Step 5: Environment Variables

Store credentials as environment variables:

```bash
# .env.local (never commit this file!)
PATREON_CLIENT_ID=your_client_id_here
PATREON_CLIENT_SECRET=your_client_secret_here
```

For Expo, use `app.config.js` with environment variables:

```javascript
export default {
  // ...
  extra: {
    patreonClientId: process.env.PATREON_CLIENT_ID,
  },
};
```

---

## Step 6: OAuth Scopes

The app requests these Patreon OAuth scopes:

| Scope | Purpose |
|-------|---------|
| `identity` | Get user's basic profile info |
| `identity.memberships` | Check campaign membership and tier |

---

## Step 7: API Endpoints Used

### Get Current User
```
GET https://www.patreon.com/api/oauth2/v2/identity
```

### Get User Memberships
```
GET https://www.patreon.com/api/oauth2/v2/identity?include=memberships&fields[member]=patron_status,currently_entitled_tiers
```

---

## Unlock Codes (Alternative Access)

For interviewers, beta testers, or demo purposes, the app supports unlock codes that bypass Patreon auth:

```typescript
<AuthProvider
  unlockCodes={['INTERVIEW2024', 'BETATESTER']}
>
```

Users enter these codes on the Profile screen to get pro access without a Patreon subscription.

**Rotate codes periodically for security.**

---

## Troubleshooting

### "Invalid redirect URI"
- Ensure the redirect URI in your OAuth client matches exactly
- Check for trailing slashes
- Development URIs use `exp://`, not `https://`

### "Access denied"
- User may not be a patron or at the wrong tier
- Check tier ID mapping is correct

### Token expired
- The app should handle token refresh automatically
- If issues persist, sign out and sign in again

---

## Resources

- [Patreon API Documentation](https://docs.patreon.com/)
- [OAuth 2.0 Flow](https://docs.patreon.com/#oauth)
- [Expo AuthSession](https://docs.expo.dev/versions/latest/sdk/auth-session/)

---

<div align="center">

**Built at [Spark Labs](https://patreon.com/SparkLabs343)**

</div>
