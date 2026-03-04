# Semver Parsing Reference

## Dependabot Title Patterns

Dependabot uses consistent title formats. Match these patterns to extract package and version info.

### Single Package PRs

Primary pattern:
```
Bump {package} from {old_version} to {new_version}
```

With optional `v` prefix on versions:
```
Bump {package} from v{old_version} to v{new_version}
```

Scoped packages (npm):
```
Bump @{scope}/{package} from {old_version} to {new_version}
```

With directory context:
```
Bump {package} from {old_version} to {new_version} in /{directory}
```

### Extraction Regex

Use this regex to extract package name, old version, and new version:

```
Bump (.+) from v?(\d+\.\d+\.\d+\S*) to v?(\d+\.\d+\.\d+\S*)
```

Capture groups:
1. Package name (may include scope like `@types/node`)
2. Old version (without `v` prefix)
3. New version (without `v` prefix)

### Grouped PR Patterns

Dependabot can group multiple dependency updates into a single PR. The title format is:

```
Bump the {group-name} group with {N} updates
Bump the {group-name} group across {N} directories with {N} updates
```

For grouped PRs, parse the **PR body** to find individual packages. Look for lines matching:

```
Updates `{package}` from {old_version} to {new_version}
```

Or table rows in the body:
```
| Package | From | To |
| {package} | {old_version} | {new_version} |
```

## Semver Comparison Rules

Given old version `A.B.C` and new version `X.Y.Z`:

### Major Bump
- `X > A` — First number increased
- Example: `2.3.1` → `3.0.0`

### Minor Bump
- `X == A` and `Y > B` — Second number increased, first unchanged
- Example: `2.3.1` → `2.4.0`

### Patch Bump
- `X == A` and `Y == B` and `Z > C` — Only third number increased
- Example: `2.3.1` → `2.3.2`

## Special Cases

### Pre-1.0 Packages (0.x.y)
By semver convention, **any** change in 0.x.y can be breaking. Treat these conservatively:
- `0.1.x` → `0.2.x` — Treat as **major** (breaking by convention)
- `0.1.1` → `0.1.2` — Treat as **minor** (still potentially breaking)

### Pre-release Versions
Versions may include pre-release suffixes:
- `1.0.0-alpha.1` → `1.0.0-alpha.2`
- `1.0.0-beta` → `1.0.0-rc.1`

Strip pre-release suffixes for semver level comparison, but note them in the assessment.

### Build Metadata
Versions may include build metadata after `+`:
- `1.0.0+build.123`

Strip build metadata before comparison. It has no semver precedence.

### Version Ranges in Grouped PRs
Some grouped PRs update a package across multiple lockfiles with different starting versions. Use the lowest old version and highest new version for categorization.

## Implementation Notes

When parsing fails (unusual title format, missing versions), flag the PR for manual review rather than guessing. Include the raw title in the output so the user can categorize it.
