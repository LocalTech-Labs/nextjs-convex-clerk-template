# Template Sync Guide

Use this workflow in downstream projects that were bootstrapped from this template to pull in documentation/structure updates without recloning the repo.

---

## 1. One-time Setup in Each Project

1. **Add the template as a remote** (name is configurable; `template` is the default in `template-sync.json`):
   ```bash
   git remote add template git@github.com:your-org/next-convex-template.git
   ```
2. **Keep the helper files intact**:
   - `template-sync.json`
   - `scripts/sync-template.mjs`
   - Documentation directories listed in the manifest (`docs/`, `.cursor/rules/`, etc.)

---

## 2. Pulling Updates

```bash
npm run sync:template
# or
node scripts/sync-template.mjs
```

What the script does:
1. Fetches the template branch (`template/main` by default).
2. Runs `git checkout template/main -- <path>` for every entry in `template-sync.json`.
3. Leaves the results staged in your working tree so you can review/merge just like any other change.

If you modify the list of synced paths in your project, update `template-sync.json` accordingly so future runs behave consistently.

---

## 3. Conflict Resolution Tips

- The script will stop on merge conflicts; resolve them manually, then re-run for the remaining files if needed.
- When local customizations should *not* be overwritten by template changes, remove those paths from `template-sync.json`.
- To cherry-pick a single file, you can run `git checkout template/main -- path/to/file` directly.

---

## 4. CI / Automation

- Optionally add a scheduled workflow that runs `npm run sync:template`, commits changes, and opens a pull request.
- Keep the template remote URL in a repo secret if it’s private.

---

## 5. Updating the Sync Script Itself

Because `scripts/sync-template.mjs` and `template-sync.json` are both listed in the manifest, running the sync command automatically keeps them in sync with the template. Downstream projects only need to pull the latest template commit to inherit improvements.
