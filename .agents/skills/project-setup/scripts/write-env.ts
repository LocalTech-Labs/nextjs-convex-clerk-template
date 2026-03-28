#!/usr/bin/env bun
/**
 * Write a single env var to .env.local
 * Usage: bun run write-env.ts <KEY> <VALUE>
 * Creates .env.local if it doesn't exist.
 * Updates existing key or appends new one.
 */

import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";

const key = process.argv[2];
const value = process.argv[3];

if (!key || value === undefined) {
	console.error("Usage: bun run write-env.ts <KEY> <VALUE>");
	process.exit(2);
}

const ENV_FILE = ".env.local";

if (!existsSync(ENV_FILE)) {
	writeFileSync(ENV_FILE, `${key}="${value}"\n`, "utf-8");
	console.log(`Created ${ENV_FILE} with ${key}`);
	process.exit(0);
}

const content = readFileSync(ENV_FILE, "utf-8");
const lines = content.split("\n");
let found = false;

const updated = lines.map((line) => {
	const trimmed = line.trim();
	if (!trimmed || trimmed.startsWith("#")) return line;
	const eqIndex = trimmed.indexOf("=");
	if (eqIndex === -1) return line;
	const lineKey = trimmed.slice(0, eqIndex).trim();
	if (lineKey === key) {
		found = true;
		return `${key}="${value}"`;
	}
	return line;
});

if (found) {
	writeFileSync(ENV_FILE, updated.join("\n"), "utf-8");
	console.log(`Updated ${key} in ${ENV_FILE}`);
} else {
	const suffix = content.endsWith("\n") ? "" : "\n";
	appendFileSync(ENV_FILE, `${suffix}${key}="${value}"\n`, "utf-8");
	console.log(`Added ${key} to ${ENV_FILE}`);
}
