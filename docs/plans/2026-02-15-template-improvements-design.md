# Template Improvements Design

**Date:** 2026-02-15
**Approach:** Incremental Enhancement (Approach A)

## Goal

Transform this repo into a production-ready micro-SaaS template optimized for AI agent workflows. Stack: Next.js 16, React 19, Tailwind v4, shadcn/ui, Convex, Clerk, PostHog, Cloudflare Workers.

## Decisions Made

- **Convex scope:** Auth-only skeleton (no business logic)
- **Cloudflare:** Full setup with @opennextjs/cloudflare adapter
- **CLAUDE.md:** Project-focused rewrite, no Task Master content
- **Linting/formatting:** Biome replaces ESLint + adds formatting
- **PostHog:** Full client setup with pageviews, feature flags, user identification
- **Task Master:** Remove all references (not used)

---

## Section 1: Remove Task Master

**Remove files:**
- `AGENTS.md` (duplicate of CLAUDE.md, all Task Master content)
- `.taskmaster/` directory if it exists

**Remove references from:**
- `CLAUDE.md` (will be fully rewritten)
- `.cursor/mcp.json` (remove task-master-ai MCP server entry)
- `.vscode/mcp.json` (remove task-master-ai MCP server entry)
- `README.md` (remove any Task Master mentions)
- `.env.example` (remove Task Master-related API keys if any)

---

## Section 2: Convex Auth Skeleton

**New files:**
- `convex/auth.config.ts` - Clerk JWT issuer configuration
- `convex/schema.ts` - Users table (clerkId, email, name, imageUrl, createdAt)
- `convex/users.ts` - `getUser` query (by auth identity), `syncUser` internal mutation
- `convex/http.ts` - HTTP router with Clerk webhook endpoint for user sync

**Pattern:** Users are synced from Clerk to Convex via webhooks. The `getUser` query looks up the current user by their Clerk identity.

---

## Section 3: PostHog Integration

**New dependencies:** `posthog-js`

**New files:**
- `app/posthog-provider.tsx` - Client-side PostHog provider, auto pageview tracking via Next.js router events, user identification from Clerk
- `hooks/use-feature-flag.ts` - Typed wrapper around PostHog feature flags

**Modified files:**
- `app/providers.tsx` - Add PostHogProvider to the provider tree
- `.env.example` - Add `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`

**Behavior:** PostHog initializes only when env vars are present. Pageviews tracked automatically. Clerk user ID linked to PostHog on auth.

---

## Section 4: Cloudflare Workers Deployment

**New dependencies:** `@opennextjs/cloudflare`

**New files:**
- `wrangler.toml` - Workers/Pages configuration (name, compatibility date, bindings)
- `open-next.config.ts` - OpenNext adapter configuration

**Modified files:**
- `package.json` - Add scripts: `build:worker`, `deploy`, `deploy:preview`
- `next.config.ts` - Add any edge runtime configuration needed
- `.env.example` - Add Cloudflare-related vars if needed

---

## Section 5: Biome (Replace ESLint)

**Remove:**
- `eslint.config.mjs`
- Dependencies: `eslint`, `eslint-config-next`, `@eslint/eslintrc`

**New dependencies:** `@biomejs/biome`

**New files:**
- `biome.json` - Formatter (2-space indent, double quotes, trailing commas) + linter (recommended rules, import sorting) + Next.js/React-aware rules

**Modified files:**
- `package.json` - Replace `lint` script, add `format`, `check` scripts
- `.github/workflows/test.yml` - Replace ESLint step with Biome check
- `.vscode/settings.json` - Update default formatter to Biome

---

## Section 6: CLAUDE.md Rewrite

**Replace entirely** with project-focused content (~150 lines):

1. **Stack & Versions** - Next.js 16, React 19, Tailwind v4, Convex, Clerk, PostHog, Biome
2. **Directory Map** - What each top-level directory contains
3. **Patterns & Conventions**
   - `cn()` for className merging
   - Convex function patterns (query/mutation with validators)
   - shadcn/ui component usage
   - Clerk auth patterns (middleware, providers, components)
   - PostHog tracking patterns
4. **Commands** - dev, test, lint, format, deploy
5. **Environment Setup** - All required env vars with descriptions
6. **Coding Conventions** - Biome rules, naming, imports, file structure

---

## Section 7: Next.js Patterns & Cleanup

**New files:**
- `app/error.tsx` - Global error boundary (client component, reset button)
- `app/loading.tsx` - Global loading skeleton
- `app/not-found.tsx` - 404 page with link home

**Cleanup:**
- Remove `AGENTS.md`
- Consolidate testing docs: keep `TESTING.md`, remove `TESTING_QUICKSTART.md` and `TESTING_SETUP_SUMMARY.md` (merge essential content into TESTING.md)
- Update `.env.example` with all new environment variables
- Update `README.md` to reflect new stack and remove Task Master references

---

## Implementation Order

1. Remove Task Master (unblocks CLAUDE.md rewrite)
2. Biome setup (replaces ESLint, needed before other changes for consistent formatting)
3. Convex auth skeleton
4. PostHog integration
5. Cloudflare Workers deployment
6. Next.js patterns (error/loading/not-found)
7. CLAUDE.md rewrite (last, so it accurately documents everything)
8. README and docs cleanup
