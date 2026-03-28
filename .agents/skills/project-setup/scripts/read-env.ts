#!/usr/bin/env bun
/**
 * Read a single env var from .env.local
 * Usage: bun run read-env.ts <KEY>
 * Exits 0 with the value on stdout, or exits 1 if not found/placeholder.
 */

import { existsSync, readFileSync } from "node:fs";

const key = process.argv[2];
if (!key) {
	console.error("Usage: bun run read-env.ts <KEY>");
	process.exit(2);
}

const ENV_FILE = ".env.local";

if (!existsSync(ENV_FILE)) {
	console.error(`No ${ENV_FILE} file found`);
	process.exit(1);
}

const content = readFileSync(ENV_FILE, "utf-8");
for (const line of content.split("\n")) {
	const trimmed = line.trim();
	if (!trimmed || trimmed.startsWith("#")) continue;
	const eqIndex = trimmed.indexOf("=");
	if (eqIndex === -1) continue;
	const lineKey = trimmed.slice(0, eqIndex).trim();
	if (lineKey !== key) continue;
	let value = trimmed.slice(eqIndex + 1).trim();
	if (
		(value.startsWith('"') && value.endsWith('"')) ||
		(value.startsWith("'") && value.endsWith("'"))
	) {
		value = value.slice(1, -1);
	}
	if (value && !value.includes("your-") && !value.includes("YOUR_")) {
		console.log(value);
		process.exit(0);
	}
}

console.error(`${key} not found or is a placeholder`);
process.exit(1);
