#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(__filename), "..");
const manifestPath = path.join(repoRoot, "template-sync.json");

const log = (msg) => process.stdout.write(`${msg}\n`);
const warn = (msg) => process.stderr.write(`\x1b[33m${msg}\x1b[0m\n`);
const error = (msg) => process.stderr.write(`\x1b[31m${msg}\x1b[0m\n`);

function runGit(args, { silent = false } = {}) {
  const result = spawnSync("git", args, {
    cwd: repoRoot,
    stdio: silent ? "ignore" : "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`git ${args.join(" ")} failed`);
  }
}

async function main() {
  let manifest;
  try {
    const raw = await readFile(manifestPath, "utf-8");
    manifest = JSON.parse(raw);
  } catch (err) {
    error(`Unable to read ${manifestPath}: ${err.message}`);
    process.exit(1);
  }

  const { remote, branch, paths } = manifest;
  if (!remote || !branch || !Array.isArray(paths) || paths.length === 0) {
    error(
      "template-sync.json must contain remote, branch, and a non-empty paths array.",
    );
    process.exit(1);
  }

  try {
    runGit(["rev-parse", "--is-inside-work-tree"], { silent: true });
  } catch {
    error("This script must be run from within a Git repository.");
    process.exit(1);
  }

  const remoteCheck = spawnSync(
    "git",
    ["remote", "get-url", remote],
    { cwd: repoRoot, stdio: "ignore" },
  );
  if (remoteCheck.status !== 0) {
    error(
      `Remote "${remote}" not found.\n\n` +
        `Add it with:\n  git remote add ${remote} <git@github.com:your-org/your-template.git>\n`,
    );
    process.exit(remoteCheck.status ?? 1);
  }

  log(`Fetching ${remote}/${branch}...`);
  runGit(["fetch", remote, branch]);

  log("Syncing files:");
  for (const relPath of paths) {
    log(`  • ${relPath}`);
    runGit(["checkout", `${remote}/${branch}`, "--", relPath]);
  }

  warn(
    "\nTemplate files updated. Review changes, resolve any merge conflicts, then run tests/lint before committing.",
  );
}

main().catch((err) => {
  error(err.message);
  process.exit(1);
});
