---
name: dependabot-review
description: Review and handle open Dependabot PRs. Use when the user wants to process, triage, merge, or plan upgrades for Dependabot PRs. Also triggered by "dependabot," "dependency updates," "review deps," or "upgrade dependencies."
disable-model-invocation: true
allowed-tools: Bash(gh pr *), Bash(gh api *), Bash(git checkout *), Bash(git fetch *), Bash(git stash *), Bash(git diff *), Bash(git status *), Bash(git log *), Bash(bun install*), Bash(bun run check), Bash(bun run test), Bash(bun run build), Bash(mkdir *), Read, Write, Edit, Grep, Glob, Agent, WebFetch, WebSearch
argument-hint: "[--dry-run] [--major-only] [--minor-only] [--patch-only]"
---

# Dependabot PR Review

You are an expert dependency manager. Your goal is to triage, review, and handle open Dependabot PRs — merging safe updates and generating upgrade plans for complex ones.

## Arguments

Parse the user's invocation for these optional flags:
- `--dry-run` — Skip all merges, only report recommendations
- `--major-only` — Only process major version bumps
- `--minor-only` — Only process minor version bumps
- `--patch-only` — Only process patch version bumps

If no flags are provided, process all open Dependabot PRs.

## Procedure

Follow these 6 steps in order. Do not skip steps.

### Step 1: Fetch & Categorize PRs

1. Fetch all open Dependabot PRs:
   ```bash
   gh pr list --author "app/dependabot" --state open --json number,title,body,headRefName,labels,url
   ```

2. Parse each PR title to extract package name, old version, and new version. Use the patterns documented in `references/semver-parsing.md`.

3. Categorize each PR as **major**, **minor**, or **patch** using semver rules:
   - Major: first number changed (e.g., 2.x.x → 3.x.x)
   - Minor: second number changed, first same (e.g., 2.1.x → 2.2.x)
   - Patch: only third number changed (e.g., 2.1.1 → 2.1.2)
   - **Special**: For 0.x.y packages, minor bumps (0.1.x → 0.2.x) are treated as **major** (breaking by convention)

4. Handle grouped PRs by parsing the PR body for individual package lines.

5. Apply filter flags (`--major-only`, `--minor-only`, `--patch-only`) if provided.

6. Present a summary table to the user:

   ```
   | # | PR | Package | From → To | Level | Group |
   |---|-----|---------|-----------|-------|-------|
   | 1 | #42 | next    | 15.0.0 → 16.0.0 | major | — |
   | 2 | #43 | vitest  | 3.1.0 → 3.2.0   | minor | — |
   | 3 | #44 | zod     | 3.23.1 → 3.23.2 | patch | — |
   ```

7. **Confirmation gate**: Ask the user to confirm before proceeding. If no Dependabot PRs are found, report that and stop.

### Step 2: Dispatch Review Agents

For each PR, spawn a sub-agent to perform a detailed review. Use the `Agent` tool with `subagent_type: "general-purpose"`.

- For **4+ PRs**: dispatch up to 5 agents in parallel
- For **3 or fewer PRs**: process sequentially to avoid overhead

Each agent should:

1. **Get the PR diff**:
   ```bash
   gh pr diff {number}
   ```

2. **Read the PR body** for Dependabot's changelog excerpts and release notes.

3. **Fetch GitHub releases** for detailed changelogs:
   ```bash
   gh api repos/{owner}/{repo}/releases --jq '.[0:5]'
   ```
   Extract the owner/repo from the PR body or package registry.

4. **Research official documentation** — Use `WebSearch` to find migration guides and breaking change docs:
   - Search: `"{package} migration guide v{old} to v{new}"`
   - Search: `"{package} breaking changes v{new}"`
   - Search: `"{package} upgrade guide v{new}"`
   - For major upgrades, use `WebFetch` on the most relevant migration page to extract specific required code changes, deprecated APIs, and new patterns.

5. **Search the codebase** for usage of the dependency:
   - Use `Grep` to find import/require statements for the package
   - Use `Glob` to find config files referencing the package
   - Cross-reference found usage with documented breaking changes to identify **which specific code in this project needs to change**

6. **Return a structured assessment** in this exact format:
   ```
   ## Assessment: {package} {old} → {new}

   - **Package**: {package name}
   - **Level**: {major|minor|patch}
   - **Breaking changes**: {yes|no}
   - **Migration required**: {yes|no}
   - **Risk**: {low|medium|high}
   - **Recommendation**: {merge|needs-review|plan-needed}
   - **Documentation links**: {list of migration guides found, or "none"}
   - **Codebase impact**:
     - Files using package: {count}
     - Specific changes needed: {list of file + what to change, or "none — lockfile only"}
   - **Notes**: {any additional context}
   ```

### Step 3: Compile Results

Aggregate all agent assessments into three groups:

1. **Safe to merge** — All of these must be true:
   - Patch or minor version bump
   - Low risk
   - No breaking changes
   - No migration required
   - Diff is lockfile-only or trivial

2. **Needs review** — Minor bumps with potential issues:
   - Minor version with medium risk
   - Minor with some breaking changes but low codebase impact

3. **Needs upgrade plan** — Any of these:
   - Major version bump
   - Breaking changes requiring code modifications
   - Migration required
   - High risk regardless of semver level

Present the compiled results to the user in a clear summary.

### Step 4: Handle Safe Updates

**Skip this step entirely if `--dry-run` flag was provided.** Report what would have been merged instead.

For each PR in the "Safe to merge" group:

1. **Confirmation gate**: Present the list of safe PRs and ask the user for batch confirmation before merging any.

2. For each confirmed PR:
   ```bash
   git fetch origin
   git stash --include-untracked
   gh pr checkout {number}
   bun install
   bun run check
   bun run test
   ```

3. If all checks pass:
   ```bash
   gh pr merge {number} --squash --delete-branch
   ```

4. If any check fails, move the PR to the "Needs upgrade plan" group.

5. Return to the main branch after each PR:
   ```bash
   git checkout main
   git stash pop 2>/dev/null || true
   ```

### Step 5: Generate Upgrade Plans

For each PR in the "Needs upgrade plan" group:

1. Create the output directory if it doesn't exist:
   ```bash
   mkdir -p docs/dependencies/updates
   ```

2. Generate an upgrade plan file at `docs/dependencies/updates/{package-name}.md` using the template from `references/upgrade-plan-template.md`.

3. Fill in all sections with data gathered from the agent assessments in Step 2:
   - Summary from the assessment
   - Breaking changes from release notes and migration docs
   - Migration steps derived from official documentation (with specific code diffs)
   - Files using the package from codebase search
   - Documentation links found during research
   - Testing checklist tailored to the specific changes

### Step 6: Final Summary

Present a final report:

```
## Dependabot Review Complete

### Merged ({count})
- #{number} {package} {old} → {new} ✓

### Upgrade Plans Created ({count})
- #{number} {package} {old} → {new} → docs/dependencies/updates/{package}.md

### Failed ({count})
- #{number} {package} — {reason}

### Skipped ({count})
- #{number} {package} — {reason}
```

If `--dry-run` was used, prefix the report with: **[DRY RUN — no PRs were merged]**
