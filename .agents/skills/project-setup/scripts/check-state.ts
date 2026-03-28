#!/usr/bin/env bun
/**
 * Checks the current state of project setup.
 * Reads .env.local and reports which services are configured.
 */

import { existsSync, readFileSync } from "node:fs";

const ENV_FILE = ".env.local";

const REQUIRED = [
	{ key: "NEXT_PUBLIC_CONVEX_URL", label: "Convex URL", group: "convex" },
	{ key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", label: "Clerk Publishable Key", group: "clerk" },
	{ key: "CLERK_SECRET_KEY", label: "Clerk Secret Key", group: "clerk" },
	{ key: "NEXT_PUBLIC_CLERK_FRONTEND_API_URL", label: "Clerk Frontend API URL", group: "clerk" },
	{ key: "CLERK_JWT_ISSUER_DOMAIN", label: "Clerk JWT Issuer Domain", group: "wiring" },
	{ key: "CLERK_WEBHOOK_SECRET", label: "Clerk Webhook Secret", group: "wiring" },
];

const OPTIONAL = [
	{ key: "NEXT_PUBLIC_APP_NAME", label: "App Name", group: "branding" },
	{ key: "NEXT_PUBLIC_APP_URL", label: "App URL", group: "branding" },
	{ key: "NEXT_PUBLIC_POSTHOG_KEY", label: "PostHog Key", group: "posthog" },
	{ key: "NEXT_PUBLIC_POSTHOG_HOST", label: "PostHog Host", group: "posthog" },
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

// ── Main ─────────────────────────────────────────────────────────────────

if (!existsSync(ENV_FILE)) {
	console.log("STATUS: no-env-file");
	console.log("No .env.local file found. Starting from scratch.");
	process.exit(0);
}

const vars = readEnvFile();
const results: { key: string; label: string; group: string; status: string; value?: string }[] = [];

for (const entry of REQUIRED) {
	const value = vars.get(entry.key);
	if (value && !isPlaceholder(value)) {
		const display = entry.key.includes("SECRET") ? `${value.slice(0, 12)}...` : value;
		results.push({ ...entry, status: "set", value: display });
	} else {
		results.push({ ...entry, status: "missing" });
	}
}

for (const entry of OPTIONAL) {
	const value = vars.get(entry.key);
	if (value && !isPlaceholder(value)) {
		results.push({ ...entry, status: "set", value });
	} else {
		results.push({ ...entry, status: "not-set" });
	}
}

// Summary
const requiredSet = results.filter((r) => REQUIRED.some((req) => req.key === r.key) && r.status === "set").length;
const requiredTotal = REQUIRED.length;

const convexReady = results.some((r) => r.group === "convex" && r.status === "set");
const clerkReady = results.filter((r) => r.group === "clerk" && r.status === "set").length === 2;
const wiringReady = results.filter((r) => r.group === "wiring" && r.status === "set").length === 2;

console.log(`STATUS: ${requiredSet === requiredTotal ? "complete" : "incomplete"}`);
console.log(`Required: ${requiredSet}/${requiredTotal}`);
console.log(`Convex: ${convexReady ? "configured" : "needs-setup"}`);
console.log(`Clerk: ${clerkReady ? "configured" : "needs-setup"}`);
console.log(`Wiring: ${wiringReady ? "configured" : "needs-setup"}`);
console.log("---");

for (const r of results) {
	const icon = r.status === "set" ? "✔" : r.status === "missing" ? "✖" : "○";
	const val = r.value ? ` = ${r.value}` : "";
	console.log(`${icon} [${r.group}] ${r.label} (${r.key})${val}`);
}
