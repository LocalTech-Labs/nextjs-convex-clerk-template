# Template Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform this Next.js/Convex template repo into a production-ready micro-SaaS starter optimized for AI agent workflows, adding Convex auth, PostHog, Cloudflare Workers deployment, and Biome.

**Architecture:** Incremental enhancement — each task is independent and committed separately. Existing code preserved. New integrations added in layers: cleanup first, then tooling, then features, then docs.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, shadcn/ui, Convex, Clerk, PostHog, Biome, @opennextjs/cloudflare

---

### Task 1: Remove Task Master & AGENTS.md

**Files:**
- Delete: `AGENTS.md`
- Modify: `.cursor/mcp.json`
- Modify: `.vscode/mcp.json`

**Step 1: Delete AGENTS.md**

```bash
rm AGENTS.md
```

**Step 2: Replace `.cursor/mcp.json` with Convex-only MCP**

Replace the entire contents of `.cursor/mcp.json` with:

```json
{
  "mcpServers": {
    "convex": {
      "command": "npx",
      "args": ["-y", "convex@latest", "mcp", "start"]
    }
  }
}
```

**Step 3: Replace `.vscode/mcp.json` with Convex-only MCP**

Replace the entire contents of `.vscode/mcp.json` with:

```json
{
  "servers": {
    "convex-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "convex@latest", "mcp", "start"]
    }
  }
}
```

**Step 4: Remove ANTHROPIC_API_KEY from .env.example**

Remove the last 4 lines from `.env.example` (the Anthropic API key section). The file should end after `CLERK_SECRET_KEY`.

**Step 5: Commit**

```bash
git add AGENTS.md .cursor/mcp.json .vscode/mcp.json .env.example
git commit -m "chore: remove Task Master references and AGENTS.md"
```

---

### Task 2: Replace ESLint with Biome

**Files:**
- Delete: `eslint.config.mjs`
- Create: `biome.json`
- Modify: `package.json`
- Modify: `.github/workflows/test.yml`
- Modify: `.vscode/settings.json`

**Step 1: Install Biome, remove ESLint packages**

```bash
bun add -d @biomejs/biome
bun remove eslint eslint-config-next @eslint/eslintrc
```

**Step 2: Delete ESLint config**

```bash
rm eslint.config.mjs
```

**Step 3: Create `biome.json`**

Create `biome.json` in project root:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedImports": "warn",
        "useExhaustiveDependencies": "warn"
      },
      "style": {
        "noNonNullAssertion": "off"
      },
      "suspicious": {
        "noExplicitAny": "off"
      }
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "trailingCommas": "all",
      "semicolons": "always"
    }
  },
  "files": {
    "ignore": [
      "node_modules",
      ".next",
      "convex/_generated",
      "coverage",
      "playwright-report",
      "test-results",
      "bun.lock"
    ]
  },
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  }
}
```

**Step 4: Update package.json scripts**

Replace the `"lint"` script and add `format` and `check`:

```json
"lint": "biome lint .",
"format": "biome format --write .",
"check": "biome check --write .",
```

**Step 5: Update `.github/workflows/test.yml`**

In the `unit-tests` job, add a Biome check step after "Install dependencies" and before "Run unit tests":

```yaml
      - name: Check code with Biome
        run: bunx biome check .
```

**Step 6: Update `.vscode/settings.json`**

Replace the entire file with:

```json
{
  "testing.automaticallyOpenPeekView": "never",
  "vitest.enable": true,
  "vitest.commandLine": "bun run test",
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports.biome": "explicit"
  },
  "files.associations": {
    "*.test.ts": "typescript",
    "*.test.tsx": "typescriptreact",
    "*.spec.ts": "typescript",
    "*.spec.tsx": "typescriptreact"
  }
}
```

**Step 7: Run Biome to format existing code**

```bash
bunx biome check --write .
```

Review the output to ensure no breakage.

**Step 8: Run tests to verify nothing broke**

```bash
bun run test -- --run
```

Expected: All 13 tests pass.

**Step 9: Commit**

```bash
git add -A
git commit -m "chore: replace ESLint with Biome for linting and formatting"
```

---

### Task 3: Add Convex Auth Skeleton

**Files:**
- Create: `convex/auth.config.ts`
- Create: `convex/schema.ts`
- Create: `convex/users.ts`
- Create: `convex/http.ts`
- Modify: `.env.example`
- Modify: `package.json` (add `svix` and `@clerk/backend` dependencies)

**Step 1: Install dependencies**

```bash
bun add svix @clerk/backend
```

**Step 2: Create `convex/auth.config.ts`**

```typescript
import type { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
```

**Step 3: Create `convex/schema.ts`**

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
});
```

**Step 4: Create `convex/users.ts`**

```typescript
import type { UserJSON } from "@clerk/backend";
import type { Validator } from "convex/values";
import { v } from "convex/values";
import type { QueryCtx } from "./_generated/server";
import { internalMutation, query } from "./_generated/server";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> },
  async handler(ctx, { data }) {
    const userAttributes = {
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      externalId: data.id,
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", userAttributes);
    } else {
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);
    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(`Can't delete user, none found for Clerk ID: ${clerkUserId}`);
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}
```

**Step 5: Create `convex/http.ts`**

```typescript
import type { WebhookEvent } from "@clerk/backend";
import { httpRouter } from "convex/server";
import { Webhook } from "svix";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);
    if (!event) {
      return new Response("Invalid webhook signature", { status: 400 });
    }
    switch (event.type) {
      case "user.created":
      case "user.updated":
        await ctx.runMutation(internal.users.upsertFromClerk, {
          data: event.data,
        });
        break;
      case "user.deleted": {
        const clerkUserId = event.data.id!;
        await ctx.runMutation(internal.users.deleteFromClerk, { clerkUserId });
        break;
      }
      default:
        console.log("Ignored Clerk webhook event", event.type);
    }
    return new Response(null, { status: 200 });
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();
  const svixHeaders = {
    "svix-id": req.headers.get("svix-id")!,
    "svix-timestamp": req.headers.get("svix-timestamp")!,
    "svix-signature": req.headers.get("svix-signature")!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

export default http;
```

**Step 6: Update `.env.example`**

Add after the existing Clerk keys:

```bash
# Clerk Webhook Secret (for Convex user sync)
# Get this from Clerk Dashboard > Webhooks > your webhook endpoint
CLERK_WEBHOOK_SECRET="whsec_..."

# Clerk JWT Issuer Domain (for Convex auth.config.ts)
# Same as NEXT_PUBLIC_CLERK_FRONTEND_API_URL but used server-side by Convex
CLERK_JWT_ISSUER_DOMAIN="https://your-clerk-frontend-api-url.clerk.accounts.dev"
```

**Step 7: Run tests to verify nothing broke**

```bash
bun run test -- --run
```

Expected: All tests pass (Convex files don't affect unit tests).

**Step 8: Commit**

```bash
git add convex/auth.config.ts convex/schema.ts convex/users.ts convex/http.ts .env.example package.json bun.lock
git commit -m "feat: add Convex auth skeleton with Clerk webhook sync"
```

---

### Task 4: Add PostHog Integration

**Files:**
- Create: `app/posthog-provider.tsx`
- Create: `hooks/use-feature-flag.ts`
- Modify: `app/providers.tsx`
- Modify: `.env.example`
- Modify: `package.json` (add posthog-js)

**Step 1: Install PostHog**

```bash
bun add posthog-js
```

**Step 2: Create `app/posthog-provider.tsx`**

```tsx
"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { Suspense, useEffect } from "react";

if (
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_KEY
) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview: false, // We capture manually below
    capture_pageleave: true,
  });
}

function PostHogPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthogClient = usePostHog();

  useEffect(() => {
    if (pathname && posthogClient) {
      let url = window.origin + pathname;
      if (searchParams.toString()) {
        url = url + "?" + searchParams.toString();
      }
      posthogClient.capture("$pageview", { $current_url: url });
    }
  }, [pathname, searchParams, posthogClient]);

  return null;
}

function PostHogIdentify() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const posthogClient = usePostHog();

  useEffect(() => {
    if (isSignedIn && user && posthogClient) {
      posthogClient.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
      });
    } else if (!isSignedIn && posthogClient) {
      posthogClient.reset();
    }
  }, [isSignedIn, user, posthogClient]);

  return null;
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  return (
    <PHProvider client={posthog}>
      <Suspense fallback={null}>
        <PostHogPageview />
      </Suspense>
      <PostHogIdentify />
      {children}
    </PHProvider>
  );
}
```

**Step 3: Create `hooks/use-feature-flag.ts`**

```typescript
"use client";

import { useFeatureFlagEnabled } from "posthog-js/react";

export function useFeatureFlag(flag: string): boolean {
  return useFeatureFlagEnabled(flag) ?? false;
}
```

**Step 4: Update `app/providers.tsx`**

Replace the entire file:

```tsx
"use client";

import { ReactNode } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { PostHogProvider } from "@/app/posthog-provider";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <PostHogProvider>
          {children}
        </PostHogProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
```

**Step 5: Update `.env.example`**

Add after the Convex section at the top:

```bash
# PostHog Analytics
# Get these from your PostHog project settings: https://app.posthog.com/
NEXT_PUBLIC_POSTHOG_KEY=""
NEXT_PUBLIC_POSTHOG_HOST="https://us.i.posthog.com"
```

**Step 6: Run tests to verify nothing broke**

```bash
bun run test -- --run
```

Expected: All tests pass. PostHog provider is a no-op when env var is empty.

**Step 7: Commit**

```bash
git add app/posthog-provider.tsx hooks/use-feature-flag.ts app/providers.tsx .env.example package.json bun.lock
git commit -m "feat: add PostHog analytics with pageview tracking and feature flags"
```

---

### Task 5: Add Cloudflare Workers Deployment

**Files:**
- Create: `wrangler.jsonc`
- Create: `open-next.config.ts`
- Modify: `package.json`

**Step 1: Install OpenNext Cloudflare adapter**

```bash
bun add -d @opennextjs/cloudflare
```

**Step 2: Run the migrate command to scaffold config files**

```bash
bunx opennextjs-cloudflare migrate --forceInstall
```

This creates `wrangler.jsonc` and `open-next.config.ts` if they don't exist, and updates `package.json` scripts. Review the output and adjust as needed.

**Step 3: Verify/update `wrangler.jsonc`**

Ensure it contains at minimum:

```jsonc
{
  "name": "template-app",
  "main": ".open-next/worker.js",
  "compatibility_date": "2025-03-14",
  "compatibility_flags": ["nodejs_compat"]
}
```

**Step 4: Verify/update `open-next.config.ts`**

Ensure it contains:

```typescript
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
```

**Step 5: Ensure package.json has deploy scripts**

Add or verify these scripts exist in `package.json`:

```json
"build:worker": "opennextjs-cloudflare build",
"preview": "opennextjs-cloudflare preview",
"deploy": "opennextjs-cloudflare deploy"
```

**Step 6: Verify the build works**

```bash
bun run build
```

Expected: Next.js build succeeds. (Full `build:worker` requires wrangler auth, so just verify the Next.js build isn't broken.)

**Step 7: Commit**

```bash
git add wrangler.jsonc open-next.config.ts package.json bun.lock
git commit -m "feat: add Cloudflare Workers deployment with @opennextjs/cloudflare"
```

---

### Task 6: Add Next.js Error/Loading/Not-Found Pages

**Files:**
- Create: `app/error.tsx`
- Create: `app/loading.tsx`
- Create: `app/not-found.tsx`

**Step 1: Create `app/error.tsx`**

```tsx
"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
```

**Step 2: Create `app/loading.tsx`**

```tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-4 w-32" />
    </div>
  );
}
```

**Step 3: Create `app/not-found.tsx`**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold">Not Found</h2>
      <p className="text-muted-foreground">The page you're looking for doesn't exist.</p>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  );
}
```

**Step 4: Run tests**

```bash
bun run test -- --run
```

Expected: All tests pass.

**Step 5: Commit**

```bash
git add app/error.tsx app/loading.tsx app/not-found.tsx
git commit -m "feat: add error boundary, loading skeleton, and 404 page"
```

---

### Task 7: Rewrite CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Replace CLAUDE.md entirely**

Write the following content to `CLAUDE.md`:

```markdown
# Next.js + Convex Micro-SaaS Template

## Stack

- **Next.js 16** (App Router, React 19) - Frontend framework
- **Convex** - Serverless backend with real-time database
- **Clerk** - Authentication and user management
- **shadcn/ui** (new-york style) - Component library on Radix UI
- **Tailwind CSS v4** - Utility-first styling with OKLCH colors
- **PostHog** - Product analytics and feature flags
- **Biome** - Linting and formatting (replaces ESLint + Prettier)
- **Vitest + Playwright** - Unit and E2E testing
- **Cloudflare Workers** - Deployment via @opennextjs/cloudflare

## Directory Structure

```
app/                  # Next.js pages and layouts (App Router)
  providers.tsx       # Clerk + Convex + PostHog provider tree
  posthog-provider.tsx # PostHog initialization and pageview tracking
components/
  layout/             # App-level layout components (header)
  ui/                 # shadcn/ui components (46 components)
convex/               # Convex backend
  schema.ts           # Database schema (users table)
  users.ts            # User queries and mutations
  http.ts             # HTTP routes (Clerk webhook)
  auth.config.ts      # Clerk JWT auth configuration
hooks/                # Custom React hooks
lib/                  # Utility functions (cn() for classNames)
test/                 # Test utilities, mocks, fixtures
e2e/                  # Playwright E2E tests
```

## Commands

```bash
bun run dev            # Start Convex + Next.js dev servers
bun run build          # Production build
bun run check          # Biome lint + format check
bun run format         # Auto-format with Biome
bun run test           # Unit tests (Vitest)
bun run test:watch     # Unit tests in watch mode
bun run test:coverage  # Unit tests with coverage
bun run test:e2e       # E2E tests (Playwright)
bun run test:all       # All tests
bun run build:worker   # Build for Cloudflare Workers
bun run deploy         # Deploy to Cloudflare Workers
```

## Patterns

### Convex Functions

```typescript
// Query pattern
import { query } from "./_generated/server";
export const myQuery = query({
  args: { id: v.id("tableName") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutation pattern
import { mutation } from "./_generated/server";
export const myMutation = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tableName", { name: args.name });
  },
});
```

### Clerk Auth in Components

```tsx
import { Authenticated, Unauthenticated } from "convex/react";
// Use <Authenticated> and <Unauthenticated> to conditionally render

// Access current user from Convex:
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
const user = useQuery(api.users.current);
```

### shadcn/ui Components

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// All 46 components available in components/ui/
// Add new: bunx shadcn@latest add <component-name>
```

### PostHog Tracking

```tsx
import { usePostHog } from "posthog-js/react";
const posthog = usePostHog();
posthog.capture("event_name", { property: "value" });

// Feature flags:
import { useFeatureFlag } from "@/hooks/use-feature-flag";
const isEnabled = useFeatureFlag("my-flag");
```

### Utility: className Merging

```tsx
import { cn } from "@/lib/utils";
<div className={cn("base-class", conditional && "extra-class")} />
```

## Environment Variables

```bash
# Required - Convex
NEXT_PUBLIC_CONVEX_URL              # Convex deployment URL

# Required - Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY   # Clerk frontend key
CLERK_SECRET_KEY                    # Clerk backend secret
NEXT_PUBLIC_CLERK_FRONTEND_API_URL  # Clerk issuer URL (for client)
CLERK_JWT_ISSUER_DOMAIN             # Clerk issuer URL (for Convex auth)
CLERK_WEBHOOK_SECRET                # Clerk webhook signing secret

# Optional - PostHog
NEXT_PUBLIC_POSTHOG_KEY             # PostHog project API key
NEXT_PUBLIC_POSTHOG_HOST            # PostHog API host (default: us.i.posthog.com)
```

## Conventions

- **Formatting:** Biome handles all formatting. Run `bun run check` before committing.
- **Imports:** Biome auto-sorts imports. Use `@/` path alias for all project imports.
- **Components:** Follow shadcn/ui composition patterns. Use `cn()` for conditional classes.
- **Naming:** kebab-case files, PascalCase components, camelCase functions/variables.
- **Tests:** Co-locate in `__tests__/` directories. Use custom render from `@/test/utils/test-utils`.
- **Convex:** All server functions use typed validators from `convex/values`. Never manually edit `convex/_generated/`.
```

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: rewrite CLAUDE.md with project-specific AI agent guidance"
```

---

### Task 8: Clean Up README and Docs

**Files:**
- Delete: `TESTING_QUICKSTART.md`
- Delete: `TESTING_SETUP_SUMMARY.md`
- Modify: `README.md`

**Step 1: Remove redundant testing docs**

```bash
rm TESTING_QUICKSTART.md TESTING_SETUP_SUMMARY.md
```

**Step 2: Rewrite README.md**

Replace with updated content reflecting the full stack. Key changes:
- Update stack overview to include PostHog and Biome
- Remove all Replit-specific instructions (this deploys to Cloudflare)
- Remove Task Master / AI assistant rule file references
- Add Cloudflare deployment section
- Add PostHog setup section
- Update scripts table to reflect Biome commands
- Simplify - remove excessive emoji and verbose troubleshooting
- Update "Next.js 15" references to "Next.js 16"
- Replace `npm` commands with `bun` throughout

The README should cover:
1. One-line description
2. Stack overview (all 9 technologies)
3. Prerequisites (Convex, Clerk, PostHog accounts)
4. Quickstart (clone, env vars, run)
5. Environment variables table
6. Available scripts
7. Deployment to Cloudflare Workers
8. Testing (link to TESTING.md)
9. Customization notes (rename TemplateApp)
10. License

**Step 3: Run all tests one final time**

```bash
bun run test -- --run
```

Expected: All tests pass.

**Step 4: Commit**

```bash
git add TESTING_QUICKSTART.md TESTING_SETUP_SUMMARY.md README.md
git commit -m "docs: update README for full stack, remove redundant testing docs"
```

---

## Post-Implementation Verification

After all 8 tasks:

1. `bun run check` - Biome passes
2. `bun run test -- --run` - All unit tests pass
3. `bun run build` - Next.js build succeeds
4. Verify no Task Master references remain: `grep -r "task-master\|taskmaster\|Task Master" --include="*.md" --include="*.json" --include="*.ts" --include="*.tsx" .`
5. Verify all new files exist: `convex/schema.ts`, `convex/users.ts`, `convex/http.ts`, `convex/auth.config.ts`, `app/posthog-provider.tsx`, `app/error.tsx`, `app/loading.tsx`, `app/not-found.tsx`, `biome.json`, `wrangler.jsonc`, `open-next.config.ts`
