# AI Agent Playbook

> A single jumping-off point for any AI assistant (Claude, GPT, Gemini, etc.) that touches this codebase.

This document complements the high-level [README](../../README.md), testing guide, and the agent instruction files (`AGENTS.md`, `CLAUDE.md`). It favors short, actionable sections so agents can keep context density high.

---

## 1. System Overview

- **Frontend**: Next.js 15 (App Router) + React 19, Tailwind CSS v4, shadcn/ui components.
- **Backend**: Convex (serverless data + functions) with Clerk auth enforced through `middleware.ts`.
- **Testing**: Vitest (`test/`, feature-level `__tests__`) and Playwright (`e2e/`) with shared setup utilities.
- **AI Enablement**: Agent quickstart docs (`AGENTS.md`, `CLAUDE.md`), Cursor rules in `.cursor/rules/`, and testing quickstarts in `TESTING*.md`.

---

## 2. Repository Map

| Path | Purpose | Related Tests / Notes |
| --- | --- | --- |
| `app/` | Next.js routes, layouts, global providers. Prefer colocated tests in `app/__tests__/`. | `app/__tests__/page.test.tsx` |
| `components/ui/` | shadcn/ui primitives (pure presentational). | `components/__tests__` |
| `components/layout/` | Shared shells (headers, nav, etc.) wired to auth. | Unit tests should render via `test/utils/test-utils.tsx`. |
| `hooks/` | Reusable client hooks (`useIsMobile`). | `hooks/__tests__` |
| `lib/` | Framework-agnostic helpers (e.g., `cn`). | `lib/__tests__` |
| `test/` | Vitest setup, fixtures, mocks. Import via `@/test/...`. | Configured in `vitest.config.ts`. |
| `e2e/` | Playwright specs (home, accessibility, examples). | See `playwright.config.ts`. |
| `public/` | Static assets. | Keep small & named. |
| `.cursor/`, `AGENTS.md`, `CLAUDE.md` | Agent instructions, rule files. | Load before coding. |

> Tip: The repo uses the `@/*` alias for the workspace root. Prefer it for predictable imports.

---

## 3. Workflow Cheat Sheet

1. **Install & Dev Server**
   ```bash
   npm install
   npm run dev        # runs Convex + Next concurrently
   ```
2. **Environment**: Copy `.env.example` → `.env.local` (or use Replit secrets). Filling Convex + Clerk secrets is required before auth flows run.
3. **Lint & Type Safety**
   ```bash
   npm run lint
   ```
4. **Unit / Component Tests**
   ```bash
   npm run test
   npm run test:watch
   npm run test:coverage
   ```
5. **E2E**
   ```bash
   npm run playwright:install  # first time
   npm run test:e2e
   ```
6. **CI-friendly build**
   ```bash
   npm run build && npm run start
   ```

Always note whether Convex needs to be running (`npm run dev` already handles it). On CI, Playwright falls back to `bun run build && bun run start`; ensure the Clerk/Convex env vars exist there too.

---

## 4. Planning & Collaboration

- **Agent instruction files**: `AGENTS.md` and `CLAUDE.md` summarize workflows, commands, and expectations. Load them alongside this playbook before editing.
- **Runbooks & docs**: Capture non-obvious reasoning in `docs/` (architecture notes, feature ADRs) instead of burying it in commits. Future agents read these first.
- **Status tracking**: Use issue trackers, PR descriptions, or inline TODO comments—there’s no built-in task CLI. Always include “next steps” when pausing work.
- **Rules enforcement**: `.cursor/rules/*.mdc` are loaded automatically in Cursor/Copilot to enforce Convex patterns, formatting, and file-structure conventions.

---

## 5. Implementation Patterns

### Add / Edit a Route
1. Create/update a file in `app/<route>/page.tsx`.
2. Wire providers through `app/providers.tsx` if new context is needed.
3. Update associated layout metadata in `app/layout.tsx`.
4. Co-locate a test in `app/__tests__/` or extend Playwright coverage.

### Add a Convex Function
1. Define schema updates in `convex/schema.ts` (requires `npx convex dev` running).
2. Use the new Convex function syntax (`query`, `mutation`, `action`) per `.cursor/rules/convex_rules.mdc`.
3. Type-safe clients via generated files in `convex/_generated/`.
4. Document usage in the relevant README section or a feature doc inside `docs/`.

### Add/Extend UI Components
1. Create component in `components/ui/` (presentation) or `components/<feature>/`.
2. Use `cn` helper for Tailwind class merging.
3. Add Story/visual context (optional) or tests under `components/__tests__/`.

### Common Integration Steps
- **Auth-aware pages**: Guard via `middleware.ts` or inline `SignedIn/SignedOut` components.
- **Form validation**: Pair `react-hook-form` with `zod`.
- **Stateful hooks**: Keep pure logic in `hooks/` and ensure tests stub browser APIs via `test/setup.ts`.

---

## 6. Testing & QA Expectations

- Unit tests prefer `@/test/utils/test-utils` to inherit providers/mocks.
- Convex mocking helpers live under `test/mocks/convex.ts`.
- Playwright specs should:
  - Cover accessibility basics (landmarks, titles).
  - Exercise auth flows once Clerk secrets are wired.
  - Record traces on retry (already configured).
- Before merging, run:
  ```bash
  npm run lint
  npm run test
  npm run test:e2e   # or targeted subset if faster
  ```
- Coverage targets: ≥80% on critical UI/helper modules.

---

## 7. Quality Checklist for Agents

- [ ] Confirm design surface: does the change touch shared layout/header?
- [ ] Update `README` or feature docs when behavior/contracts change.
- [ ] Keep shadcn components unmodified unless absolutely necessary—prefer wrappers.
- [ ] Verify both unit and e2e suites relevant to the change.
- [ ] For Convex updates, regenerate types (`npx convex dev`) and note schema migration steps.
- [ ] Leave breadcrumbs (docs, TODOs, PR notes) so subsequent agents inherit context.

---

## 8. Additional References

- [README](../../README.md) – stack overview & scripts
- [TESTING.md](../../TESTING.md) – exhaustive testing instructions
- [TESTING_QUICKSTART.md](../../TESTING_QUICKSTART.md) – minimal setup
- [AGENTS.md](../../AGENTS.md) & [CLAUDE.md](../../CLAUDE.md) – AI assistant expectations & workflows
- [Template Sync Guide](../template-sync.md) – keep downstream projects aligned with template updates
- [.cursor/rules/cursor_rules.mdc](../../.cursor/rules/cursor_rules.mdc) – formatting/rule file conventions
- [.cursor/rules/convex_rules.mdc](../../.cursor/rules/convex_rules.mdc) – Convex coding standards

Use this playbook as the first stop before diving into code. It should answer “where do I change X?” and “what else must I touch/test?” within a single context window.
