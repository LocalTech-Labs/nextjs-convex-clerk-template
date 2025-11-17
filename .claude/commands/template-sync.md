# /template-sync

Interactively audit and apply template updates without losing local customizations.

## Steps

1. **Ensure the template remote exists**
   ```bash
   git remote get-url template || git remote add template git@github.com:your-org/next-convex-template.git
   ```
2. **Fetch template changes**
   ```bash
   git fetch template main
   ```
3. **Work through the recommended files one by one** (default list: `AGENTS.md`, `CLAUDE.md`, `docs/`, `.cursor/rules/`, `README.md`, `TESTING.md`):
   - Run `git diff template/main -- <path>` and summarize the changes for the user.
   - Ask:  
     _“Apply the template changes from `<path>`? (yes/no)”_
   - If the user says **yes**, run `git checkout template/main -- <path>`, then show the resulting diff (`git diff -- <path>`).
   - If **no**, skip the file and note that it was intentionally left unchanged.
4. **After all paths are reviewed**, display `git status` and remind the user to run tests/lint before committing.

Always stop after each file to confirm with the user before applying changes. Document which updates were applied or skipped in the final response.
