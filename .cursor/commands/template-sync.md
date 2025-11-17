# /template-sync

Goal: help the user sync this project with the upstream template interactively, asking for approval before applying each file update.

## Procedure

1. **Verify template remote**
   ```bash
   git remote get-url template || git remote add template git@github.com:your-org/next-convex-template.git
   ```
2. **Fetch the latest template branch**
   ```bash
   git fetch template main
   ```
3. **For each high-priority path** (`AGENTS.md`, `CLAUDE.md`, `docs/`, `.cursor/rules/`, `README.md`, `TESTING.md`, plus any user-provided list):
   1. Run `git diff template/main -- <path>` and summarize what changed.
   2. Ask the user: _“Apply the template changes from `<path>`? (yes/no)”_
   3. If **yes**:
      - Execute `git checkout template/main -- <path>`
      - Show the resulting diff (`git diff -- <path>`) so the user can inspect.
   4. If **no**, skip and move to the next path.
4. After processing all files, run `git status` and report overall progress, calling out any files the user chose to skip.
5. Remind the user to run lint/tests and commit the accepted changes.

Important: never apply a file automatically. Always pause for user confirmation between files.
