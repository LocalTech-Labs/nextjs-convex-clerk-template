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

app/                  # Next.js pages and layouts (App Router)
  providers.tsx       # Clerk + Convex + PostHog provider tree
  posthog-provider.tsx # PostHog initialization and pageview tracking
  error.tsx           # Global error boundary
  loading.tsx         # Global loading skeleton
  not-found.tsx       # 404 page
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

## Commands

bun run dev            # Start Convex + Next.js dev servers
bun run build          # Production build
bun run check          # Biome lint + format check
bun run format         # Auto-format with Biome
bun run lint           # Biome lint only
bun run test           # Unit tests (Vitest)
bun run test:watch     # Unit tests in watch mode
bun run test:coverage  # Unit tests with coverage
bun run test:e2e       # E2E tests (Playwright)
bun run test:all       # All tests
bun run build:worker   # Build for Cloudflare Workers
bun run deploy         # Deploy to Cloudflare Workers

## Patterns

### Convex Functions

Queries:
  import { query } from "./_generated/server";
  import { v } from "convex/values";
  export const myQuery = query({
    args: { id: v.id("tableName") },
    handler: async (ctx, args) => {
      return await ctx.db.get(args.id);
    },
  });

Mutations:
  import { mutation } from "./_generated/server";
  import { v } from "convex/values";
  export const myMutation = mutation({
    args: { name: v.string() },
    handler: async (ctx, args) => {
      return await ctx.db.insert("tableName", { name: args.name });
    },
  });

### Clerk Auth in Components

  import { Authenticated, Unauthenticated } from "convex/react";
  // Use <Authenticated> and <Unauthenticated> to conditionally render

  // Access current user from Convex:
  import { useQuery } from "convex/react";
  import { api } from "@/convex/_generated/api";
  const user = useQuery(api.users.current);

### shadcn/ui Components

  import { Button } from "@/components/ui/button";
  import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
  // All 46 components available in components/ui/
  // Add new: bunx shadcn@latest add <component-name>

### PostHog Tracking

  import { usePostHog } from "posthog-js/react";
  const posthog = usePostHog();
  posthog.capture("event_name", { property: "value" });

  // Feature flags:
  import { useFeatureFlag } from "@/hooks/use-feature-flag";
  const isEnabled = useFeatureFlag("my-flag");

### Utility: className Merging

  import { cn } from "@/lib/utils";
  <div className={cn("base-class", conditional && "extra-class")} />

## Environment Variables

Required - Convex:
  NEXT_PUBLIC_CONVEX_URL              # Convex deployment URL

Required - Clerk:
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY   # Clerk frontend key
  CLERK_SECRET_KEY                    # Clerk backend secret
  NEXT_PUBLIC_CLERK_FRONTEND_API_URL  # Clerk issuer URL (for client)
  CLERK_JWT_ISSUER_DOMAIN             # Clerk issuer URL (for Convex auth)
  CLERK_WEBHOOK_SECRET                # Clerk webhook signing secret

Optional - PostHog:
  NEXT_PUBLIC_POSTHOG_KEY             # PostHog project API key
  NEXT_PUBLIC_POSTHOG_HOST            # PostHog API host (default: us.i.posthog.com)

## Conventions

- **Formatting:** Biome handles all formatting (tabs, double quotes). Run `bun run check` before committing.
- **Imports:** Biome auto-sorts imports. Use `@/` path alias for all project imports.
- **Components:** Follow shadcn/ui composition patterns. Use `cn()` for conditional classes.
- **Naming:** kebab-case files, PascalCase components, camelCase functions/variables.
- **Tests:** Co-locate in `__tests__/` directories. Use custom render from `@/test/utils/test-utils`.
- **Convex:** All server functions use typed validators from `convex/values`. Never manually edit `convex/_generated/`.
