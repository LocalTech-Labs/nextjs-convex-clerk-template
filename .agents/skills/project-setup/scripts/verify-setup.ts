#!/usr/bin/env bun
/**
 * Verify the complete project setup.
 * Checks env vars, Clerk API connectivity, JWT template, and webhook.
 *
 * Usage: bun run verify-setup.ts
 */

import { existsSync, readFileSync } from "node:fs";

const ENV_FILE = ".env.local";

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

// ── Checks ───────────────────────────────────────────────────────────────

interface CheckResult {
	name: string;
	status: "pass" | "fail" | "warn";
	detail: string;
}

const results: CheckResult[] = [];
const vars = readEnvFile();

// 1. Check required env vars
const required = [
	"NEXT_PUBLIC_CONVEX_URL",
	"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
	"CLERK_SECRET_KEY",
	"NEXT_PUBLIC_CLERK_FRONTEND_API_URL",
	"CLERK_JWT_ISSUER_DOMAIN",
	"CLERK_WEBHOOK_SECRET",
];

for (const key of required) {
	const value = vars.get(key);
	if (value && !isPlaceholder(value)) {
		const display = key.includes("SECRET") ? `${value.slice(0, 12)}...` : value;
		results.push({ name: `env:${key}`, status: "pass", detail: display });
	} else {
		results.push({ name: `env:${key}`, status: "fail", detail: "not set or placeholder" });
	}
}

// 2. Check Clerk API connectivity
const secretKey = vars.get("CLERK_SECRET_KEY");
if (secretKey && !isPlaceholder(secretKey)) {
	try {
		const res = await fetch("https://api.clerk.com/v1/jwt_templates", {
			headers: { Authorization: `Bearer ${secretKey}` },
		});

		if (res.ok) {
			results.push({ name: "clerk:api", status: "pass", detail: "API reachable" });

			// Check JWT template
			const templates = (await res.json()) as { name?: string }[];
			const hasConvex = Array.isArray(templates) && templates.some((t) => t.name === "convex");
			if (hasConvex) {
				results.push({ name: "clerk:jwt-template", status: "pass", detail: '"convex" template exists' });
			} else {
				results.push({ name: "clerk:jwt-template", status: "fail", detail: '"convex" template not found' });
			}
		} else if (res.status === 401) {
			results.push({ name: "clerk:api", status: "fail", detail: "Invalid secret key (401)" });
		} else {
			results.push({ name: "clerk:api", status: "warn", detail: `HTTP ${res.status}` });
		}
	} catch (e) {
		results.push({
			name: "clerk:api",
			status: "fail",
			detail: `Connection error: ${e instanceof Error ? e.message : e}`,
		});
	}

	// Check webhook
	try {
		const res = await fetch("https://api.clerk.com/v1/webhooks", {
			headers: { Authorization: `Bearer ${secretKey}` },
		});

		if (res.ok) {
			const convexUrl = vars.get("NEXT_PUBLIC_CONVEX_URL");
			const expectedHost = convexUrl?.replace(".convex.cloud", ".convex.site");
			const webhooks = (await res.json()) as { data?: { url?: string }[] };
			const list = webhooks.data ?? (Array.isArray(webhooks) ? webhooks : []);
			const hasConvexWebhook = list.some(
				(w: { url?: string }) => w.url?.includes("clerk-users-webhook")
			);
			if (hasConvexWebhook) {
				results.push({ name: "clerk:webhook", status: "pass", detail: "Webhook endpoint registered" });
			} else {
				results.push({
					name: "clerk:webhook",
					status: "fail",
					detail: `No webhook found for clerk-users-webhook (expected host: ${expectedHost})`,
				});
			}
		}
	} catch {
		results.push({ name: "clerk:webhook", status: "warn", detail: "Could not check webhooks" });
	}
} else {
	results.push({ name: "clerk:api", status: "fail", detail: "No secret key to test with" });
}

// 3. Check optional vars
const optional = [
	"NEXT_PUBLIC_APP_NAME",
	"NEXT_PUBLIC_APP_URL",
	"NEXT_PUBLIC_POSTHOG_KEY",
];

for (const key of optional) {
	const value = vars.get(key);
	if (value && !isPlaceholder(value)) {
		results.push({ name: `optional:${key}`, status: "pass", detail: value });
	} else {
		results.push({ name: `optional:${key}`, status: "warn", detail: "not set (optional)" });
	}
}

// ── Output ───────────────────────────────────────────────────────────────

const allPass = results.filter((r) => r.name.startsWith("env:") || r.name.startsWith("clerk:")).every((r) => r.status === "pass");

console.log(allPass ? "OVERALL: PASS" : "OVERALL: INCOMPLETE");
console.log("---");

for (const r of results) {
	const icon = r.status === "pass" ? "✔" : r.status === "fail" ? "✖" : "○";
	console.log(`${icon} ${r.name}: ${r.detail}`);
}

process.exit(allPass ? 0 : 1);
