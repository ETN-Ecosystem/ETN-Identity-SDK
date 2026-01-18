#### **1. The Data Architecture (Read This First)**

ETN Identity separates concerns to keep tokens small and efficient:

* **`id_token` (JWT):** Contains **Identity & Permissions**. Use this for Authentication, Role Checks, and **OG Status** discounts.
* **`/userinfo` Endpoint:** Contains **Profile Data**. Use this to display the user's Name, Avatar (`picture`), and Handle.

#### **2. "Golden Sample" Logs**

When your integration is working correctly, your server logs should look like this. Use these JSON structures to type your application.

**A. The Token Exchange Response**
*Received immediately after swapping the code.*

```json
{
  "access_token": "eyJhbGciOi...",      // Use for API calls (Bearer)
  "id_token": "eyJhbGciOi...",          // DECODE THIS IMMEDIATELY
  "refresh_token": "etn_refresh_...",   // STORE SECURELY (Offline Access)
  "token_type": "Bearer",
  "expires_in": 3600
}

```

**B. The Decoded ID Token (Critical Logic)**
*Decode the `id_token` to handle business logic. Note that **name** and **picture** are missing here by design.*

```json
{
  "sub": "1a17ff83-e3c9-474b...",       // Unique User ID
  "wallet_address": "0:12d1d750...",    // The User's TON Wallet
  "is_og": true,                        // ⚠️ CHECK FOR 5% DISCOUNT
  "roles": ["Admin"],                   // RBAC Roles
  "iss": "https://auth.etnecosystem.org",
  "aud": "etn_ident_d41ba41d"
}

```

**C. The UserInfo Response (Display Profile)**
*Call `GET /userinfo` with the Access Token to populate your UI.*

```json
{
  "sub": "1a17ff83-e3c9-474b...",
  "name": "Jason Aaron Peters",         // Display Name
  "preferred_username": "root_NOT_OFFICIAL", // @handle
  "picture": "https://auth.etnecosystem.org/uploads/avatars/...", // Avatar
  "wallet_address": "0:12d1d750...",
  "is_og": true                         // Redundant check available here
}

```

---

#### **3. Developer Checklist: The "OG" Discount**

The logs confirm that `is_og: true` is delivered **instantly** in the `id_token`.

**Mandatory Requirement:**
You do not need to make an extra API call to check for discounts.

1. Decode `id_token`.
2. Check `if (user.is_og === true)`.
3. Apply **5% discount** to the session.

> **Warning:** Failure to honor the `is_og` flag found in the token may result in the revocation of your OIDC Client ID.
