# Upgrade Plan Template

Use this template when generating files in `docs/dependencies/updates/`. Replace all `{placeholders}` with actual values from the PR assessment.

---

```markdown
# Upgrade Plan: {package}

| Field | Value |
|-------|-------|
| **Package** | `{package}` |
| **Current Version** | `{old_version}` |
| **Target Version** | `{new_version}` |
| **Semver Level** | {major\|minor\|patch} |
| **Risk** | {low\|medium\|high} |
| **Estimated Effort** | {low\|medium\|high} |
| **PR** | #{pr_number} — {pr_url} |
| **Date** | {YYYY-MM-DD} |

## Summary

{One paragraph describing what this upgrade involves, why it was flagged for manual review, and the overall impact on the project.}

## Breaking Changes

{List each breaking change from the release notes and migration docs. For each:}

- **{Change title}**: {Description of what changed and why it breaks existing code}

{If no breaking changes, write: "No breaking changes documented, but flagged for review due to {reason}."}

## Migration Steps

{Numbered steps to complete the upgrade. Each step should be specific and actionable.}

1. **{Step title}**
   - What to do: {description}
   - Files affected: `{file_path}`
   - Before:
     ```{lang}
     {old code}
     ```
   - After:
     ```{lang}
     {new code}
     ```

{Include as many steps as needed. Derive code changes from official migration docs.}

## Files Using This Package

{List all files in the codebase that import or reference this package.}

| File | Usage |
|------|-------|
| `{file_path}` | {how it uses the package — import, config, etc.} |

## Documentation & References

{Links to official migration guides, upgrade docs, and relevant API change pages found during research.}

- [{Title}]({url}) — {brief description of what this page covers}

## Changelog Highlights

{Key entries from the changelog between old and new versions. Focus on breaking changes, deprecations, and notable new features.}

### {version}
- {changelog entry}

## Related Dependencies

{List any dependencies that may also need updating as part of this upgrade, or that could conflict.}

- `{related_package}` — {reason for relation, e.g., "peer dependency", "companion package"}

{If none, write: "No related dependency changes required."}

## Testing Checklist

{Tailored checklist based on the specific changes and codebase usage.}

- [ ] Update package version in `package.json`
- [ ] Run `bun install` to update lockfile
- [ ] Run `bun run check` — Biome lint and format pass
- [ ] Run `bun run test` — All unit tests pass
- [ ] Run `bun run build` — Production build succeeds
- [ ] {Specific test for breaking change 1}
- [ ] {Specific test for breaking change 2}
- [ ] Manual smoke test of {affected feature}
- [ ] Run `bun run test:e2e` — E2E tests pass
```
