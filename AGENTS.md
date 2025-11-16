# AI Assistant Integration Guide

This repository is optimized for autonomous or human-in-the-loop AI agents. Use this file as the “how to work here” cheat sheet. For a deeper tour, read the [AI Agent Playbook](./docs/ai/README.md) and [Architecture Overview](./docs/architecture/OVERVIEW.md).

---

## 1. Quick Orientation

- **Stack**: Next.js 15 (App Router, React 19), Convex backend, Clerk auth, Tailwind v4, shadcn/ui components.
- **Testing**: Vitest (unit/component) + Playwright (e2e). Helpers live in `test/`.
- **Docs**: `README.md` (setup), `docs/ai/README.md` (flow), `docs/architecture/OVERVIEW.md` (system map), `docs/template-sync.md` (template update playbook), `TESTING*.md` (detailed QA).
- **Rules**: `.cursor/rules/*.mdc` apply automatically inside Cursor/Copilot-like tools.
- **Template updates**: Run `npm run sync:template` (uses `template-sync.json`) to pull documentation/structure changes from the canonical template.

---

## 2. Common Commands

```bash
# Install dependencies
npm install

# Run Next.js + Convex dev servers together
npm run dev

# Lint
npm run lint

# Unit / component tests
npm run test
npm run test:watch
npm run test:coverage

# Playwright (install browsers once, then run tests)
npm run playwright:install
npm run test:e2e
```

Environment setup:
1. Copy `.env.example` → `.env.local`.
2. Fill Convex + Clerk keys (see README for guidance).
3. Restart dev server after changing env vars.

---

## 3. Collaboration Workflow

1. **Understand the task**  
   - Skim `docs/ai/README.md` for repo map & expectations.  
   - Use `docs/architecture/OVERVIEW.md` to see how layers interact.
2. **Plan before coding**  
   - Outline changes, list files to touch, note required tests.  
   - Prefer colocated tests (`__tests__`) or `test/` utilities.
3. **Implement incrementally**  
   - Keep components declarative; push logic into hooks/lib helpers.  
   - Follow shadcn conventions for UI additions.
4. **Validate**  
   - `npm run lint`, `npm run test`, and targeted Playwright specs.  
   - Document any gaps or manual steps in PR/message.
5. **Document**  
   - Update README/docs when behavior or configuration changes.  
   - Use commit/PR descriptions that reference the affected area.

---

## 4. Testing Expectations

- Prefer the custom `render` from `@/test/utils/test-utils` to ensure providers are wired.  
- Mock browser APIs via `test/setup.ts` instead of per-test hacks.  
- Keep e2e specs short (smoke, accessibility, navigation). See `e2e/accessibility.spec.ts` for examples.  
- Attach artifacts (Playwright trace/video) when running in CI.  
- Aim for ≥80% coverage on critical helpers/components; justify exceptions in docs.

---

## 5. AI-Specific Tips

- Load this file plus the AI Playbook before writing code to minimize repetitive clarification.  
- Use deterministic commands (the scripts above) rather than bespoke shell pipelines.  
- Record assumptions, caveats, or follow-up work directly in docs or TODO comments—future agents rely on that breadcrumb trail.  
- Prefer editing ASCII files; keep formatting consistent with Prettier/ESLint defaults.  
- When unsure where logic belongs, consult the Architecture doc’s layered breakdown.

---

## 6. Reference Checklist

- [ ] Environment variables configured?  
- [ ] Feature located in correct directory (`app/`, `components/`, `hooks/`, etc.)?  
- [ ] Unit tests updated/added and passing?  
- [ ] Relevant e2e scenarios covered or noted as TODO?  
- [ ] Documentation and release notes (if any) updated?  
- [ ] Lint/type checks run?  
- [ ] Manual verification steps (if required) documented?

Use this checklist before handing work off to another agent or opening a PR.

---

Need more depth? Jump to:
- [`docs/ai/README.md`](./docs/ai/README.md) – workflows, repo map, QA expectations.
- [`docs/architecture/OVERVIEW.md`](./docs/architecture/OVERVIEW.md) – system diagram, extension guidance.
- [`TESTING.md`](./TESTING.md) – Vitest + Playwright details.

Happy shipping!
