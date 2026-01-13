<div align="center">
  <a href="https://etnecosystem.org/">
    <img src="https://account.etnecosystem.org/etn_ident_darkmode_logo.png" alt="ETN Identity SDK Logo" width="200" />
  </a>
  <h1>ETN Identity SDK</h1>
  <p><strong>Version 1.0.0</strong> | Released: <strong>January 13, 2026</strong></p>
  <p><em>"The Official React SDK for Integrating ETN Identity."</em></p>

<p align="center">
  <a href="https://etnecosystem.org/" target="_blank">
    <img src="https://img.shields.io/badge/ETN%20Ecosystem-133A2A" alt="ETN Ecosystem"/>
  </a>
  <a href="https://ton.org/" target="_blank">
    <img src="https://img.shields.io/badge/Built%20on-TON-0088CC?logo=ton&logoColor=white" alt="Built on TON"/>
  </a>
  <a href="https://docs.etnecosystem.org/" target="_blank">
    <img src="https://img.shields.io/badge/Read%20the-Docs-133A2A?logo=readthedocs&labelColor=FFB400" alt="Documentation"/>
  </a>
  <a href="http://etn-learn.ethio-tech.com/" target="_blank">
    <img src="https://img.shields.io/badge/ETN-Learn-133A2A?logo=gitbook&labelColor=FFB400" alt="ETN Learn"/>
  </a>
</p>

<p align="center">
  <a href="https://x.com/etnetsa" target="_blank">
    <img src="https://img.shields.io/badge/Follow%20on-X-133A2A?logo=x&labelColor=FFB400" alt="Follow on X"/>
  </a>
  <a href="https://www.youtube.com/@ETNetsaCoin?sub_confirmation=1" target="_blank">
    <img src="https://img.shields.io/badge/Subscribe-YouTube-133A2A?logo=youtube&labelColor=FFB400" alt="Subscribe on YouTube"/>
  </a>
  <a href="https://www.tiktok.com/@etneco" target="_blank">
    <img src="https://img.shields.io/badge/Follow%20on-TikTok-133A2A?logo=tiktok&labelColor=FFB400" alt="Follow on TikTok"/>
  </a>
  <a href="https://t.me/et_apps" target="_blank">
    <img src="https://img.shields.io/badge/Community-Chat-133A2A?logo=telegram&labelColor=FFB400" alt="Community Chat on Telegram"/>
  </a>
  <a href="https://t.me/etnetsacoin" target="_blank">
    <img src="https://img.shields.io/badge/Project-Announcements-133A2A?logo=telegram&labelColor=FFB400" alt="Announcements on Telegram"/>
  </a>
</p>

<p align="center">
  <a href="https://www.geckoterminal.com/ton/pools/EQBt7drPhWyQRIVnSkDzThhiVcq1lwPT371DYX-gGHzN9bwh" target="_blank">
    <img src="https://img.shields.io/badge/Gecko-Terminal-133A2A?labelColor=FFB400" alt="GeckoTerminal Price Chart"/>
  </a>
  <a href="https://jvault.xyz/staking/v2/stake/ETN-ECO" target="_blank">
    <img src="https://img.shields.io/badge/Stake%20on-jVault-133A2A?labelColor=FFB400" alt="Stake on jVault"/>
  </a>
  <a href="https://tonviewer.com/EQAz_XrD0hA4cqlprWkpS7TIAhCG4CknAfob1VQm-2mBf5Vl" target="_blank">
    <img src="https://img.shields.io/badge/Jetton-Master-133A2A?logo=ton&logoColor=white&labelColor=FFB400" alt="Jetton Master on Tonviewer"/>
  </a>
  <a href="https://tonviewer.com/UQA7KhoTClG9QR7DwN1RGAkWIRU0dNp_R8F615y5PiEGQDEK" target="_blank">
    <img src="https://img.shields.io/badge/Donate%20TON-UQA7...QDEK-133A2A?logo=ton&logoColor=white&labelColor=FFB400" alt="Donate TON"/>
  </a>
</p>
</div>

# ETN Identity SDK Documentation

## Overview
This SDK helps developers integrate "Sign in with ETN" into their applications. It follows the **OIDC Authorization Code Flow** with **Token Rotation**, which is the standard security pattern used in the ETN Ecosystem (e.g., ETN Vibe).

The integration consists of two parts:
1.  **Frontend (Client)**: Redirecting the user to the ETN Identity Provider.
2.  **Backend (Server)**: Exchanging the code for tokens and managing the session.

## Installation

```bash
npm install @etn-ecosystem/identity-sdk iron-session
```

*(Note: `iron-session` is recommended for secure cookie management).*

## 1. Client-Side: Redirect to Login

Use the SDK to construct the authorization URL.

```typescript
// src/lib/auth-client.ts
import { ETNAuthClient } from '@etn-ecosystem/identity-sdk';

export const authClient = new ETNAuthClient({
  clientId: process.env.ETN_CLIENT_ID!,
  redirectUri: process.env.ETN_REDIRECT_URI!,
  // Default scope is 'openid profile offline_access'
});

export function signIn() {
  // Generate a random state for CSRF protection
  const state = crypto.randomUUID(); 
  const url = authClient.buildAuthorizeUrl(state);
  window.location.href = url; // Or use Next.js redirect()
}
```

## 2. Server-Side: Handle Callback & Exchange Tokens

Create a route handler (e.g., `app/api/auth/callback/route.ts` in Next.js) to handle the redirect from ETN Identity.

```typescript
// app/api/auth/callback/route.ts
import { getSession } from '@/lib/session'; // See Step 3
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { code } = await req.json(); // Or get from searchParams if GET

  // Exchange Code for Tokens
  const tokenResponse = await fetch('https://auth.etnecosystem.org/api/v1/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.ETN_CLIENT_ID,
        client_secret: process.env.ETN_CLIENT_SECRET, // NEVER expose this to client
        redirect_uri: process.env.ETN_REDIRECT_URI,
    }),
  });

  const tokens = await tokenResponse.json();

  if (tokens.error) {
     return NextResponse.json({ error: tokens.error_description }, { status: 400 });
  }

  // Save to Session
  const session = await getSession();
  session.isLoggedIn = true;
  session.token = tokens.access_token;
  session.refreshToken = tokens.refresh_token; 
  // Calculate expiration: Now + expires_in - 1 minute buffer
  session.expiresAt = Date.now() + (tokens.expires_in * 1000) - 60000;
  
  await session.save();

  return NextResponse.json({ success: true });
}
```

## 3. Session Management & Token Rotation

It is critical to implement **Token Rotation** to keep the user logged in securely. The Access Token expires in 1 hour; use the Refresh Token to get a new one without forcing the user to log in again.

Create a helper `src/lib/session.ts` (using `iron-session`):

```typescript
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

// ... Session Data Interface ...

export async function getValidSession({ redirectOnExpire = false } = {}) {
  const session = await getSession();

  if (!session.isLoggedIn || !session.expiresAt) return session;

  // Check if Access Token is expired
  if (Date.now() > session.expiresAt) {
    if (redirectOnExpire) {
       // In Server Components, we cannot set cookies, so we redirect to a route that can.
       const { redirect } = await import('next/navigation');
       redirect('/api/auth/refresh'); 
    }

    // Attempt Refresh (Server Actions / Route Handlers only)
    try {
        const res = await fetch("https://auth.etnecosystem.org/api/v1/oauth/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                grant_type: "refresh_token",
                refresh_token: session.refreshToken,
                client_id: process.env.ETN_CLIENT_ID,
                client_secret: process.env.ETN_CLIENT_SECRET,
            }),
        });
        
        const newTokens = await res.json();
        // Update Session with NEW tokens
        session.token = newTokens.access_token;
        if (newTokens.refresh_token) session.refreshToken = newTokens.refresh_token;
        session.expiresAt = Date.now() + (newTokens.expires_in * 1000) - 60000;
        await session.save();
    } catch (e) {
        session.isLoggedIn = false;
        // Handle error
    }
  }
  return session;
}
```

## 4. Protecting Pages

In your Protected Pages (Server Components), always call `getValidSession` with `redirectOnExpire: true`.

```typescript
// app/dashboard/page.tsx
export default async function Dashboard() {
  // This will check expiration and redirect to refresh if needed
  const session = await getValidSession({ redirectOnExpire: true });

  if (!session.isLoggedIn) redirect('/');

  // ...
}
```
