---
name: project-setup
description: Interactive setup wizard for the Micro-SaaS template. Configures Convex, Clerk, auth wiring, webhooks, and environment variables. Use when the user wants to initialize a new project from this template, set up auth, or wire Clerk and Convex together.
---

# Project Setup Wizard

You are guiding a user through the complete setup of a Micro-SaaS application built with Next.js, Convex, and Clerk. Follow these phases sequentially. At each phase, explain what you're doing and why. When you need user input, ask clearly and wait for their response.

**Important behavior rules:**
- Run each script using `bun run <script-path>` (scripts are TypeScript for Bun)
- After every automated step, check the exit code and output before proceeding
- If something fails, explain the error and offer manual instructions as a fallback
- If the user already has something configured (e.g., env vars already set), skip that step and tell them
- Always show the user what values were written to `.env.local` after each phase
- Resolve all script paths relative to this skill directory: use the absolute path to `scripts/` based on where this SKILL.md file lives

## Phase 0: Prerequisites & Current State

1. Check that `bun` is available:
   ```bash
   bun --version
   ```

2. Check that `node_modules/` exists. If not, run `bun install`.

3. Read the current `.env.local` (if it exists) to understand what's already configured:
   ```bash
   bun run <skill-dir>/scripts/check-state.ts
   ```

4. Present a summary to the user:
   - Which services are already configured
   - Which phases they can skip
   - Ask if they want to start fresh or continue from current state

## Phase 1: App Naming & Branding

Ask the user: **"What would you like to name your app?"**

Once they respond:

1. Update `package.json` name field (kebab-case version)
2. Set `NEXT_PUBLIC_APP_NAME` in `.env.local`
3. Update `lib/config.ts` — change the `APP_NAME` default fallback string and `APP_DESCRIPTION`

Tell the user: "You can customize colors, fonts, and other branding later. For now, let's get the infrastructure wired up."

## Phase 2: Convex Setup

Tell the user: "Now we'll set up Convex — your real-time database and backend. This will open an interactive prompt."

1. Run the Convex setup:
   ```bash
   npx convex dev --once
   ```
   **This is interactive** — the user will need to:
   - Log in to Convex (if not already authenticated)
   - Choose to create a new project or link an existing one
   - Name their project

2. After it completes, verify `NEXT_PUBLIC_CONVEX_URL` was written to `.env.local`:
   ```bash
   bun run <skill-dir>/scripts/read-env.ts NEXT_PUBLIC_CONVEX_URL
   ```

3. If the URL is set, tell the user the Convex URL and confirm success.
   If not, ask them to paste it manually.

**Important:** The Convex URL will look like `https://something-something-123.convex.cloud`. The HTTP endpoint URL (used for webhooks) is the same but with `.convex.site` instead of `.convex.cloud`.

## Phase 3: Clerk Setup

Tell the user:

> "Now we need to set up Clerk for authentication. This requires creating a Clerk project in their dashboard — this is the one step that can't be automated.
>
> **Please do the following:**
> 1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
> 2. Create a new application (or select an existing one)
> 3. Once in the project, go to **API Keys** (in the sidebar)
> 4. Copy the **Publishable Key** (starts with `pk_test_` or `pk_live_`)
> 5. Copy the **Secret Key** (starts with `sk_test_` or `sk_live_`)
>
> Paste both keys here when you have them."

Wait for the user to provide both keys. They may paste them one at a time or together.

Once you have both keys:

1. Validate the format:
   - Publishable key must start with `pk_test_` or `pk_live_`
   - Secret key must start with `sk_test_` or `sk_live_`

2. Derive the Frontend API URL from the publishable key:
   ```bash
   bun run <skill-dir>/scripts/derive-clerk-url.ts "<publishable-key>"
   ```
   This base64-decodes the domain from the key. The output is the FAPI URL like `https://boss-cheetah-96.clerk.accounts.dev`.

3. Write all four Clerk env vars to `.env.local`:
   ```bash
   bun run <skill-dir>/scripts/write-env.ts NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY "<publishable-key>"
   bun run <skill-dir>/scripts/write-env.ts CLERK_SECRET_KEY "<secret-key>"
   bun run <skill-dir>/scripts/write-env.ts NEXT_PUBLIC_CLERK_FRONTEND_API_URL "<derived-url>"
   bun run <skill-dir>/scripts/write-env.ts CLERK_JWT_ISSUER_DOMAIN "<derived-url>"
   ```

4. Tell the user: "From just those 2 keys, I derived 4 environment variables. The Frontend API URL is encoded inside the publishable key."

## Phase 4: Automated Wiring

Tell the user: "Now I'll wire everything together automatically — creating the JWT template, webhook, and setting Convex environment variables."

### Step 4a: Create Clerk JWT Template

```bash
bun run <skill-dir>/scripts/clerk-create-jwt.ts "<secret-key>"
```

This creates a JWT template named "convex" in Clerk, which Convex uses to verify authentication tokens. Tell the user the result.

If it fails (e.g., 401), tell the user:
> "The automated JWT template creation failed. Please create it manually:
> 1. In Clerk Dashboard → JWT Templates → New Template
> 2. Select the **Convex** preset
> 3. Click Save (defaults are fine)"

### Step 4b: Create Clerk Webhook

First, read the Convex URL:
```bash
bun run <skill-dir>/scripts/read-env.ts NEXT_PUBLIC_CONVEX_URL
```

Then create the webhook:
```bash
bun run <skill-dir>/scripts/clerk-create-webhook.ts "<secret-key>" "<convex-site-url>/clerk-users-webhook"
```

Note: Convert the Convex URL from `.convex.cloud` to `.convex.site` for the webhook URL.

The script outputs the webhook signing secret. Write it to `.env.local`:
```bash
bun run <skill-dir>/scripts/write-env.ts CLERK_WEBHOOK_SECRET "<signing-secret>"
```

If it fails, tell the user the manual steps:
> "Please create the webhook manually:
> 1. In Clerk Dashboard → Webhooks → Add Endpoint
> 2. URL: `<convex-site-url>/clerk-users-webhook`
> 3. Events: `user.created`, `user.updated`, `user.deleted`
> 4. Copy the Signing Secret and paste it here"

Then wait for them to paste the signing secret.

### Step 4c: Set Convex Environment Variables

Convex needs two env vars set on its server (separate from `.env.local`):

```bash
npx convex env set CLERK_WEBHOOK_SECRET "<webhook-secret>"
npx convex env set CLERK_JWT_ISSUER_DOMAIN "<issuer-domain>"
```

Tell the user what was set.

### Step 4d: Re-deploy Convex

The auth config in `convex/auth.config.ts` reads `CLERK_JWT_ISSUER_DOMAIN` at deploy time. Now that it's set, re-push:

```bash
npx convex dev --once
```

This deploys the schema, functions, and auth config with the real issuer domain.

## Phase 5: Verification

Run the full verification:
```bash
bun run <skill-dir>/scripts/verify-setup.ts
```

This checks:
- All 6 required env vars are set in `.env.local`
- Clerk API is reachable (verifies the secret key)
- JWT template "convex" exists
- Webhook endpoint is registered
- Convex env vars are set

Present the results as a checklist. If anything is missing, offer to fix it.

## Phase 6: Summary & Next Steps

Present this to the user:

> **Setup complete! Here's what was configured:**
>
> | Component | Status | Detail |
> |-----------|--------|--------|
> | Convex | ✅ | Database, backend functions, HTTP endpoints |
> | Clerk | ✅ | Authentication provider |
> | JWT Template | ✅ | Convex can verify Clerk auth tokens |
> | Webhook | ✅ | User events sync from Clerk → Convex |
> | Env Vars | ✅ | `.env.local` + Convex server vars |
>
> **What works out of the box:**
> - Sign up, sign in, sign out (Clerk handles the UI)
> - Protected routes (`/dashboard`, `/settings`)
> - Public routes (`/`, `/pricing`, `/terms`, `/privacy`, `/changelog`)
> - User sync: when someone signs up in Clerk, they're automatically created in your Convex database
>
> **Start your dev server:**
> ```bash
> bun run dev
> ```
>
> **Optional next steps:**
> - **Billing**: Clerk Dashboard → Billing → Connect Stripe
> - **Analytics**: Set `NEXT_PUBLIC_POSTHOG_KEY` in `.env.local`
> - **Branding**: Edit `app/globals.css` for colors, `app/layout.tsx` for fonts
> - **Deploy**: `bun run build:worker && bun run deploy` (Cloudflare Workers)
