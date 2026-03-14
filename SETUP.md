# Bootstrap Guide

How to take this template and turn it into a live micro-SaaS. Estimated time: 30-45 minutes.

## Prerequisites

- [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`)
- A [Clerk](https://clerk.com) account (free tier works)
- A [Convex](https://convex.dev) account (free tier works)
- A [Stripe](https://stripe.com) account (for Clerk Billing)
- Optional: [PostHog](https://posthog.com) account, [Cloudflare](https://cloudflare.com) account

## Step 1: Clone and Install

```bash
git clone <your-repo-url> my-saas
cd my-saas
bun install
```

## Step 2: Set Up Environment Variables

```bash
cp .env.example .env.local
```

You'll fill in values during the steps below. The minimum required variables are:

```
NEXT_PUBLIC_CONVEX_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_FRONTEND_API_URL
CLERK_JWT_ISSUER_DOMAIN
CLERK_WEBHOOK_SECRET
```

## Step 3: Set Up Convex

1. Run the Convex dev server:

```bash
bunx convex dev
```

2. It will prompt you to log in and create a new project. Follow the prompts.
3. Once created, it automatically sets `NEXT_PUBLIC_CONVEX_URL` in `.env.local`.
4. Leave this terminal running - it watches `convex/` for changes and syncs your schema and functions to the cloud.

## Step 4: Set Up Clerk

### 4a. Create a Clerk Project

1. Go to [clerk.com](https://clerk.com) and create a new project
2. From the Clerk dashboard, copy these into `.env.local`:
   - **Publishable Key** -> `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** -> `CLERK_SECRET_KEY`

### 4b. Set Up the Convex JWT Template

1. In the Clerk dashboard, go to **JWT Templates**
2. Click **New template** and choose the **Convex** template
3. Copy the **Issuer URL** (e.g. `https://your-instance.clerk.accounts.dev`)
4. Set this as both values in `.env.local`:
   - `NEXT_PUBLIC_CLERK_FRONTEND_API_URL` (used by the client)
   - `CLERK_JWT_ISSUER_DOMAIN` (used by Convex server)
5. Also add `CLERK_JWT_ISSUER_DOMAIN` to your **Convex dashboard** environment variables:
   - Go to [dashboard.convex.dev](https://dashboard.convex.dev) > your project > **Settings** > **Environment Variables**
   - Add `CLERK_JWT_ISSUER_DOMAIN` with the same issuer URL

### 4c. Set Up the Clerk Webhook

This webhook keeps users in sync between Clerk and your Convex database.

1. In the Clerk dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Set the endpoint URL to: `<your-convex-url>/clerk-users-webhook`
   - Your Convex URL is in `.env.local` as `NEXT_PUBLIC_CONVEX_URL`
   - Example: `https://happy-animal-123.convex.site/clerk-users-webhook`
   - Note: use `.convex.site` (not `.convex.cloud`) for HTTP endpoints
4. Subscribe to these events: `user.created`, `user.updated`, `user.deleted`
5. Copy the **Signing Secret** -> `CLERK_WEBHOOK_SECRET` in `.env.local`
6. Also add `CLERK_WEBHOOK_SECRET` to your Convex dashboard environment variables

## Step 5: Set Up Billing (Clerk Billing)

Clerk Billing wraps Stripe so you don't need a direct Stripe integration.

1. In the Clerk dashboard, go to **Billing** (or **Configure > Billing**)
2. Connect your Stripe account through Clerk's guided setup
   - For development: Clerk provides a shared test gateway
   - For production: connect your own Stripe account
3. Create your plans:
   - **Free** plan - set as the default
   - **Pro** plan - set your price (e.g., $9/month)
4. Add features to each plan in the Clerk dashboard
5. That's it. Clerk handles:
   - Checkout sessions
   - Subscription management and renewals
   - Plan upgrades/downgrades
   - Billing portal for customers

Plan data syncs to Convex automatically through the existing Clerk user webhook. When a user subscribes to Pro, Clerk updates their `public_metadata.plan`, which triggers a `user.updated` webhook event, and the Convex `users` table gets updated.

## Step 6: Verify the Dev Server

Open a new terminal (keep the `convex dev` terminal running) and start Next.js:

```bash
bun run dev
```

Or run both together:

```bash
bun run dev
```

This uses `concurrently` to start both Convex and Next.js. Visit [http://localhost:3000](http://localhost:3000).

### What to check:

| Page | URL | What you should see |
|------|-----|---------------------|
| Landing page | `/` | Hero, features, pricing preview, CTA |
| Pricing | `/pricing` | Clerk PricingTable with your plans |
| Sign up | Click "Get Started" | Clerk sign-up modal |
| Dashboard | `/dashboard` | Your plan, usage card, quick actions |
| Settings | `/settings` | Profile info, PricingTable for plan management |
| Terms | `/terms` | Terms of Service (placeholder text) |
| Privacy | `/privacy` | Privacy Policy (placeholder text) |
| Changelog | `/changelog` | Changelog timeline |

## Step 7: Rebrand for Your App

### App Name and Branding

Edit `lib/config.ts` to set your app name, description, URL, support email, and social links. All headers, footers, metadata, and SEO files read from this single file.

You can also override `APP_NAME` and `APP_URL` at deploy time via `NEXT_PUBLIC_APP_NAME` and `NEXT_PUBLIC_APP_URL` environment variables.

### Colors

Edit `app/globals.css`. The theme uses OKLCH color values in `:root` (light) and `.dark` (dark mode). Key variables:

```css
:root {
  --primary: oklch(0.795 0.184 86.047);    /* Main brand color */
  --background: oklch(1 0 0);               /* Page background */
  --foreground: oklch(0.141 0.005 285.823); /* Text color */
  --accent: oklch(0.967 0.001 286.375);     /* Accent/highlight */
  --destructive: oklch(0.577 0.245 27.325); /* Error/danger */
}
```

Tip: Use [oklch.com](https://oklch.com/) to pick colors. Change the `--primary` hue to instantly rebrand.

### Fonts

In `app/layout.tsx`, replace the `Geist` and `Geist_Mono` imports:

```tsx
// Change this:
import { Geist, Geist_Mono } from "next/font/google";

// To your preferred fonts, e.g.:
import { Inter, JetBrains_Mono } from "next/font/google";
```

### Logo

In both `components/layout/header.tsx` and `components/marketing/marketing-header.tsx`, replace the text logo with your SVG or image:

```tsx
// Replace:
<span className="font-bold text-lg">YourApp</span>

// With:
<Image src="/logo.svg" alt="MyApp" width={120} height={28} />
```

### Landing Page Content

Edit `app/(marketing)/page.tsx`:
- **Hero section**: Update headline, subheading, CTA text
- **FEATURES array**: Replace the 6 feature cards with your actual features
- **PRICING array**: Update the static preview cards (the real pricing is on `/pricing` via Clerk)

### Legal Pages

These contain placeholder text with `[YourApp]` and `[Your Company]` markers:
- `app/(marketing)/terms/page.tsx` - Terms of Service
- `app/(marketing)/privacy/page.tsx` - Privacy Policy

Replace all bracketed placeholders with your actual company/app details.

### Pricing FAQ

Edit `app/(marketing)/pricing/pricing-faq.tsx` to update the FAQ questions and answers for your specific product.

### Plan Limits

Edit `convex/lib/constants.ts` to set your actual plan limits:

```typescript
export const PLANS = {
  free: { name: "Free", maxProjects: 1, maxStorage: 100, maxTeamMembers: 1 },
  pro: { name: "Pro", maxProjects: 50, maxStorage: 10_000, maxTeamMembers: 10 },
} as const;
```

## Step 8: Set Up PostHog (Optional)

1. Create a project at [posthog.com](https://posthog.com)
2. Add to `.env.local`:
   - `NEXT_PUBLIC_POSTHOG_KEY` - your project API key
   - `NEXT_PUBLIC_POSTHOG_HOST` - defaults to `https://us.i.posthog.com`

If these vars are not set, PostHog gracefully does nothing. No errors, no code changes needed.

## Step 9: Build Your Features

### Adding a new feature end-to-end:

1. **Schema** - Define your table in `convex/schema.ts`:
```typescript
projects: defineTable({
  name: v.string(),
  ownerId: v.string(),
  // ...
}).index("byOwner", ["ownerId"]),
```

2. **Backend** - Add queries/mutations in a new `convex/projects.ts`:
```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    return await ctx.db
      .query("projects")
      .withIndex("byOwner", (q) => q.eq("ownerId", identity.subject))
      .collect();
  },
});
```

3. **Page** - Create `app/(app)/projects/page.tsx`:
```tsx
"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function ProjectsPage() {
  const projects = useQuery(api.projects.list);
  // ...
}
```

4. **UI Components** - Use existing shadcn/ui components:
```bash
# Already have 46 components. Need more?
bunx shadcn@latest add data-table
```

5. **Pro gating** - Use the subscription helpers:
```typescript
// In Convex backend:
import { requirePro } from "./subscriptions";

export const proFeature = query({
  args: {},
  handler: async (ctx) => {
    await requirePro(ctx); // Throws if not pro
    // ... pro-only logic
  },
});
```

```tsx
// In frontend (declarative):
import { Protect } from "@clerk/nextjs";

<Protect plan="pro" fallback={<UpgradePrompt />}>
  <ProContent />
</Protect>
```

### Adding public routes

If you add new marketing pages, update `middleware.ts` to make them public:

```typescript
const isPublicRoute = createRouteMatcher([
  "/",
  "/pricing",
  "/terms",
  "/privacy",
  "/changelog",
  "/your-new-page",  // Add here
]);
```

Also add them to `app/sitemap.ts` for SEO.

## Step 10: Lint and Test

```bash
bun run check        # Biome lint + format (MUST pass before committing)
bun run test         # Unit tests (Vitest)
bun run test:e2e     # E2E tests (Playwright, requires `bun run playwright:install` first)
```

## Step 11: Deploy to Cloudflare Workers

1. Install and configure [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/):
```bash
bunx wrangler login
```

2. Build and deploy:
```bash
bun run build:worker
bun run deploy
```

3. Set your production environment variables in the Convex dashboard and Cloudflare dashboard.

4. Update `NEXT_PUBLIC_APP_URL` to your production domain.

5. In Clerk, update your webhook endpoint URL to use your production Convex URL.

6. Preview locally before deploying:
```bash
bun run preview
```

## Quick Reference: File Map

```
app/
  layout.tsx                          # Root layout, metadata, fonts
  globals.css                         # OKLCH theme colors (light + dark)
  providers.tsx                       # Clerk + Convex + PostHog providers
  sitemap.ts                          # Dynamic sitemap
  robots.ts                           # Crawl rules
  (marketing)/                        # Public pages (no auth required)
    layout.tsx                        # Marketing header + footer
    page.tsx                          # Landing page
    pricing/page.tsx                  # Clerk PricingTable + FAQ
    terms/page.tsx                    # Terms of Service
    privacy/page.tsx                  # Privacy Policy
    changelog/page.tsx                # Changelog timeline
  (app)/                              # Authenticated pages
    layout.tsx                        # App header
    dashboard/page.tsx                # User dashboard with plan info
    settings/page.tsx                 # Profile + subscription management
components/
  layout/header.tsx                   # App header (dashboard/settings nav)
  marketing/marketing-header.tsx      # Marketing header (features/pricing nav)
  marketing/footer.tsx                # Site footer
  marketing/structured-data.tsx       # JSON-LD SEO
  ui/                                 # 46 shadcn/ui components
convex/
  schema.ts                           # Database schema (users table)
  users.ts                            # User CRUD + Clerk webhook sync
  subscriptions.ts                    # Plan queries (currentPlan, isPro)
  http.ts                             # HTTP routes (Clerk webhook)
  lib/constants.ts                    # Plan limits and feature comparison
  auth.config.ts                      # Clerk JWT config for Convex
middleware.ts                         # Auth middleware (public vs protected routes)
```
