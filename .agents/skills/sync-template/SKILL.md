---
name: sync-template
description: Sync infrastructure updates from the sibling template repo into this project. The template repo must be cloned alongside this repo at ../nextjs-convex-clerk-template.
disable-model-invocation: true
allowed-tools: Bash(bash *), Bash(diff *), Bash(cp *), Read, Grep, Glob
argument-hint: "[template-dir-path]"
---

# Sync Template Infrastructure

Sync infrastructure files from the template repo into this child project. This only touches tooling, CI, and config — never app code.

## Procedure

### Step 1: Verify template directory

Set the template directory. If `$ARGUMENTS` is provided and non-empty, use it as the template path. Otherwise default to `../nextjs-convex-clerk-template`.

Confirm the directory exists and show the latest commit:

```bash
ls -d <template-dir>
git -C <template-dir> log --oneline -1
```

If the directory does not exist, tell the user and stop.

### Step 2: Scan for differences

Run the scan command to compare files:

```bash
bash .claude/skills/sync-template/scripts/sync-template.sh scan <template-dir>
```

### Step 3: Present summary

Show the scan results to the user as a formatted table. Highlight files with status `changed` or `new`. If nothing has changed, tell the user everything is up to date and stop.

### Step 4: Apply Category A (safe infrastructure files)

These files are safe to batch-copy: `.devcontainer/`, `.claude/settings.json`, `.claude/skills/`, `.agents/skills/`, `.github/workflows/test.yml`, `biome.json`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `postcss.config.mjs`, `components.json`, `wrangler.jsonc`, `open-next.config.ts`, `test/setup.ts`, `test/mocks/convex.ts`, `test/fixtures/index.ts`, `test/utils/test-utils.tsx`, `.gitignore`.

Ask the user for confirmation, then apply:

```bash
bash .claude/skills/sync-template/scripts/sync-template.sh apply-category-a <template-dir>
```

### Step 5: Review Category B (caution files)

For each Category B file (`CLAUDE.md`, `SETUP.md`, `next.config.ts`) that has status `changed` or `new`:

1. Show a short diff summary:
   ```bash
   bash .claude/skills/sync-template/scripts/sync-template.sh diff-file <path> <template-dir>
   ```

2. Ask the user: **Apply**, **Skip**, or **Show full diff** (then ask again)

3. If the user chooses Apply:
   ```bash
   bash .claude/skills/sync-template/scripts/sync-template.sh apply-file <path> <template-dir>
   ```

### Step 6: Final status

Show what changed:

```bash
git diff --stat
```

Remind the user to run:
- `bun run check` — verify formatting and linting
- `bun run test` — verify tests still pass
