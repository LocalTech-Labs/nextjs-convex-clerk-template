---
name: sync-template
description: Sync infrastructure updates from the GitHub template repo (LocalTech-Labs/nextjs-convex-clerk-template) into this project. Fetches the latest main branch by default.
disable-model-invocation: true
allowed-tools: Bash(bash *), Bash(diff *), Bash(cp *), Bash(git clone *), Read, Grep, Glob
argument-hint: "[branch-name or local-dir-path]"
---

# Sync Template Infrastructure

Sync infrastructure files from the GitHub template repo into this child project. This only touches tooling, CI, and config — never app code.

## Procedure

### Step 1: Verify template source

The script fetches from `https://github.com/LocalTech-Labs/nextjs-convex-clerk-template` (main branch by default). If `$ARGUMENTS` is provided, it is passed through — if it's an existing local directory it will be used directly, otherwise it's treated as a branch name.

Run a quick scan to confirm connectivity:

```bash
bash .claude/skills/sync-template/scripts/sync-template.sh scan $ARGUMENTS
```

If the clone fails, tell the user and stop.

### Step 2: Present summary

Show the scan results to the user as a formatted table. Highlight files with status `changed` or `new`. If nothing has changed, tell the user everything is up to date and stop.

### Step 3: Apply Category A (safe infrastructure files)

These files are safe to batch-copy: `.devcontainer/`, `.claude/settings.json`, `.claude/skills/`, `.agents/skills/`, `.github/workflows/test.yml`, `biome.json`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `postcss.config.mjs`, `components.json`, `wrangler.jsonc`, `open-next.config.ts`, `test/setup.ts`, `test/mocks/convex.ts`, `test/fixtures/index.ts`, `test/utils/test-utils.tsx`, `.gitignore`.

Ask the user for confirmation, then apply:

```bash
bash .claude/skills/sync-template/scripts/sync-template.sh apply-category-a $ARGUMENTS
```

### Step 4: Review Category B (caution files)

For each Category B file (`CLAUDE.md`, `SETUP.md`, `next.config.ts`) that has status `changed` or `new`:

1. Show a short diff summary:
   ```bash
   bash .claude/skills/sync-template/scripts/sync-template.sh diff-file <path> $ARGUMENTS
   ```

2. Ask the user: **Apply**, **Skip**, or **Show full diff** (then ask again)

3. If the user chooses Apply:
   ```bash
   bash .claude/skills/sync-template/scripts/sync-template.sh apply-file <path> $ARGUMENTS
   ```

### Step 5: Final status

Show what changed:

```bash
git diff --stat
```

Remind the user to run:
- `bun run check` — verify formatting and linting
- `bun run test` — verify tests still pass
