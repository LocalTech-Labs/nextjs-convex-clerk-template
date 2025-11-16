# Architecture Overview

This document explains how the template’s pieces fit together so that both humans and AI assistants can reason about changes quickly. Pair it with the [AI Agent Playbook](../ai/README.md) for workflows, and the main [README](../../README.md) for setup details.

---

## 1. Layered View

```
┌─────────────────────────────────────────────┐
│ Presentation: Next.js App Router (app/)     │
│  - React Server Components + Client pages   │
│  - shadcn/ui primitives (components/ui)     │
│  - Layout shell + Providers (app/layout.tsx)│
├─────────────────────────────────────────────┤
│ Domain / State                              │
│  - Hooks (hooks/) for UI state (e.g., media)│
│  - Shared libs (lib/) like class helpers    │
│  - Providers (app/providers.tsx) wiring     │
├─────────────────────────────────────────────┤
│ Platform                                     │
│  - Convex backend (convex/) + scheduler      │
│  - Clerk authentication (middleware.ts)      │
│  - Task Master automation (.cursor/, docs/)  │
├─────────────────────────────────────────────┤
│ Tooling / QA                                 │
│  - Vitest + RTL (test/, __tests__ dirs)      │
│  - Playwright e2e (e2e/, playwright.config)  │
│  - Linting & formatting (eslint.config.mjs)  │
└─────────────────────────────────────────────┘
```

---

## 2. Data & Auth Flow

1. `middleware.ts` applies Clerk protection to every route except `/`.
2. Client-side renders happen within `app/providers.tsx`, which wraps `ClerkProvider` + `ConvexProviderWithClerk`.
3. Convex functions (queries/mutations/actions) live in `convex/` and are invoked via the generated client inside React components or hooks (not yet included in this template, but the wiring is ready).
4. Real-time updates propagate through Convex’s React client to any subscribed component.

Key contracts:

- `ClerkProvider` supplies auth context for client components.
- `ConvexReactClient` requires `NEXT_PUBLIC_CONVEX_URL`; fail-fast logic ensures misconfiguration is caught early.
- UI shells (e.g., `components/layout/header.tsx`) assume Clerk state availability for showing `SignInButton` or `UserButton`.

---

## 3. Directory Responsibilities

| Path | Role | Notes |
| --- | --- | --- |
| `app/` | File-based routing, layout composition, per-page data fetching. | Pages are server components by default; use `"use client"` where needed. |
| `components/` | Presentational + layout components. `components/ui/*` mirrors shadcn structure; `components/layout/*` embeds business logic (auth). | Keep UI primitives stateless; state goes to hooks. |
| `hooks/` | Reusable logic (e.g., `useIsMobile`). | Browser APIs must be guarded/tested with `test/setup.ts` mocks. |
| `lib/` | Framework-agnostic helpers (e.g., `cn`). | Safe to import anywhere, including Convex functions if they stay pure. |
| `test/` | Source of truth for Vitest global setup, fixtures, and mocks. | Exposed through `@/test/...` alias for consistency. |
| `e2e/` | Playwright specs covering smoke flows + accessibility. | `playwright.config.ts` handles local vs CI server commands. |
| `.cursor/`, `AGENTS.md`, `CLAUDE.md` | Agent orchestration & rules. | Keep these updated when workflows change. |

---

## 4. Dependency Guidelines

- **UI → Hooks/Libs**: Components can import from `hooks/` and `lib/` freely. Avoid importing from `app/` into `components/` to keep components reusable.
- **Hooks → UI**: Hooks should not import UI components; they must return data/state only.
- **Convex → UI**: Convex functions should avoid referencing React-specific modules. They can import from `lib/` if the utilities are platform agnostic.
- **Tests**: Feature tests should live near their targets (`__tests__` folders). Shared helpers belong under `test/`.
- **Docs**: `docs/ai` and `docs/architecture` should reference root files, not duplicate content. When behavior changes, prefer updating these docs over spreading instructions elsewhere.

---

## 5. Extending the Template

### Add a Feature Page
1. Create `app/<feature>/page.tsx` (server component by default).
2. If client interactivity is required, mark the component with `"use client"` and encapsulate logic inside dedicated hooks.
3. Use existing shadcn components (`components/ui/`) rather than duplicating markup.
4. Add route-specific tests (`app/__tests__/`) and, if it’s critical, an e2e spec.

### Add Convex Data
1. Define schema changes in `convex/schema.ts` and run `npx convex dev` to regenerate types.
2. Implement functions via the new API (see `.cursor/rules/convex_rules.mdc` for syntax).
3. Consume them in React via the Convex React client or server-side via actions/mutations.
4. Document any required env vars or scheduled jobs in `README` or a dedicated `docs/` note.

### Customize Authentication
1. Update `middleware.ts` route matcher to expose additional public pages.
2. Adjust layout components to reflect new auth flows (e.g., onboarding).
3. Consider adding Clerk webhooks/convex actions if automations are needed.

---

## 6. Testing Strategy Recap

- **Unit/Component**: Vitest + RTL; rely on `test/utils/test-utils.tsx` for provider-wrapped renders.
- **Hooks**: `renderHook` from RTL, with browser APIs mocked in `test/setup.ts`.
- **E2E**: Playwright for smoke, accessibility, and interactive flows. The config already differentiates between local dev (`bun run dev`) and CI (`bun run build && bun run start`).
- **Accessibility**: `e2e/accessibility.spec.ts` is the baseline; integrate `@axe-core/playwright` when feasible.

---

## 7. Observability & Troubleshooting

- Convex CLI (`npx convex dev`) logs server function output and schema issues in real time.
- Clerk issues manifest either in `middleware.ts` (protected routes) or within components using `Authenticated/Unauthenticated`.
- When environment variables are missing, `app/providers.tsx` throws early—keep that behavior to prevent silent failures.
- Playwright traces/videos are retained on failure; inspect `playwright-report/` artifacts in CI.

---

## 8. AI-Friendly Practices

- Keep new documents inside `docs/` with clear ownership sections so assistants can ingest targeted context.
- When adding broader rules, place them in `.cursor/rules/` to ensure Cursor/Copilot automatically load them.
- Prefer deterministic scripts (`npm run ...`) over ad-hoc shell commands; agents rely on them for reproducible steps.
- Update Task Master tasks whenever architecture or workflow changes so future agents stay aligned.

This overview should reduce the number of files an agent must open before contributing, and it defines the guardrails for future structural changes.
