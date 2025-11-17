# Template Sync Guide

Use this workflow in downstream projects that were bootstrapped from this template to pull in documentation/structure updates without recloning the repo. It’s designed for AI assistants (Cursor, Claude Code, Codex CLI) to follow so they can make judgment calls instead of blindly overwriting files.

---

## 1. Agent-First Update Flow

When an AI assistant is asked to refresh a project from the template:

1. **Confirm the template remote**
   ```bash
   git remote get-url template || git remote add template git@github.com:your-org/next-convex-template.git
   ```
2. **Fetch the latest template branch**
   ```bash
   git fetch template main
   ```
3. **Review before applying**
   - For each recommended file listed below, run  
     `git diff template/main -- <path>`  
     and summarize the changes.
   - Decide whether the update conflicts with local customizations. If it does, plan a targeted merge instead of wholesale checkout.
4. **Apply intentionally**
   - Use `git checkout template/main -- <path>` when the template version should fully replace the local one.
   - Or, copy snippets / use editor tooling to merge only the relevant sections.
5. **Document decisions**
   - In PR descriptions or commit messages, note which template changes were adopted, skipped, or modified.

This review-first workflow keeps the agent in the loop so important local tweaks are preserved.

---

## 2. One-time Setup in Each Project

1. **Add the template as a remote** (name is configurable; `template` is the recommended default):
   ```bash
   git remote add template git@github.com:your-org/next-convex-template.git
   ```
2. **Optionally pin the docs you care about**
   - Keep a short list (README, docs/, `.cursor/rules/`, etc.) so every assistant knows what to diff.
3. **Load the `/template-sync` slash command**
   - In Cursor or Claude Code, run `/template-sync` to follow the interactive workflow automatically. The command already pauses between files and asks for approval before applying changes.

---

## 3. Files to Audit First

These paths are most likely to change when the template evolves:

- `AGENTS.md`, `CLAUDE.md`
- `docs/ai/README.md`, `docs/architecture/OVERVIEW.md`, `docs/template-sync.md`
- `.cursor/rules/` (auto-loaded guardrails)
- Other shared guides (`TESTING.md`, `README.md`)

Example commands for an assistant:

```bash
git diff template/main -- AGENTS.md CLAUDE.md
git diff template/main -- docs/
git diff template/main -- .cursor/rules
```

Use the diffs to decide whether to copy the template version verbatim (`git checkout template/main -- path`) or port individual sections manually.

---

## 4. Conflict Resolution Tips

- When conflicts arise, prefer resolving them in your local branch rather than force-overwriting from the template.
- If a file is heavily customized, copy relevant snippets instead of checking it out wholesale.
- To cherry-pick a single file (after reviewing the diff), run `git checkout template/main -- path/to/file`, then re-apply any local customizations as needed.
