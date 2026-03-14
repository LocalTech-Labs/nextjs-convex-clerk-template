#!/usr/bin/env bun
/**
 * Pre-dev environment check — warns about missing required vars.
 * Runs before `bun run dev` via the `predev` script.
 * Exits 0 (warn only) so the dev server still starts.
 */

import { existsSync, readFileSync } from "node:fs";

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const CYAN = "\x1b[36m";

const ENV_FILE = ".env.local";

const REQUIRED_VARS = [
	"NEXT_PUBLIC_CONVEX_URL",
	"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
	"CLERK_SECRET_KEY",
	"NEXT_PUBLIC_CLERK_FRONTEND_API_URL",
	"CLERK_JWT_ISSUER_DOMAIN",
	"CLERK_WEBHOOK_SECRET",
];

function readEnvFile(): Map<string, string> {
	const vars = new Map<string, string>();
	if (!existsSync(ENV_FILE)) return vars;
	const content = readFileSync(ENV_FILE, "utf-8");
	for (const line of content.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		const eqIndex = trimmed.indexOf("=");
		if (eqIndex === -1) continue;
		const key = trimmed.slice(0, eqIndex).trim();
		let value = trimmed.slice(eqIndex + 1).trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		if (value) vars.set(key, value);
	}
	return vars;
}

function isPlaceholder(value: string | undefined): boolean {
	if (!value) return true;
	return value.includes("your-") || value.includes("YOUR_") || value === "" || value === "...";
}

if (!existsSync(ENV_FILE)) {
	console.log(
		`\n  ${RED}${BOLD}Missing ${ENV_FILE}${RESET}\n` +
			`  Run ${CYAN}${BOLD}bun run setup${RESET} to configure your environment.\n`,
	);
	process.exit(0);
}

const vars = readEnvFile();
const missing: string[] = [];

for (const key of REQUIRED_VARS) {
	const value = vars.get(key);
	if (!value || isPlaceholder(value)) {
		missing.push(key);
	}
}

if (missing.length > 0) {
	console.log(`\n  ${YELLOW}${BOLD}Missing environment variables:${RESET}`);
	for (const key of missing) {
		console.log(`  ${RED}  - ${key}${RESET}`);
	}
	console.log(
		`\n  Run ${CYAN}${BOLD}bun run setup${RESET} or edit ${BOLD}${ENV_FILE}${RESET} to fix.\n`,
	);
} else {
	console.log(`  ${GREEN}Environment check passed.${RESET}`);
}
