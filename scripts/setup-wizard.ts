#!/usr/bin/env bun
/**
 * Interactive setup wizard for the Micro-SaaS template.
 * Configures Convex, Clerk, webhook wiring, and environment variables.
 *
 * Usage: bun run setup
 */

import { execFileSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";

// ── ANSI Colors ──────────────────────────────────────────────────────────────

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const MAGENTA = "\x1b[35m";

const CHECK = `${GREEN}✔${RESET}`;
const WARN = `${YELLOW}⚠${RESET}`;
const CROSS = `${RED}✖${RESET}`;
const ARROW = `${CYAN}→${RESET}`;

// ── Helpers ──────────────────────────────────────────────────────────────────

const ENV_FILE = ".env.local";

function box(title: string): void {
	const line = "─".repeat(title.length + 4);
	console.log(`\n${CYAN}┌${line}┐${RESET}`);
	console.log(`${CYAN}│${RESET}  ${BOLD}${title}${RESET}  ${CYAN}│${RESET}`);
	console.log(`${CYAN}└${line}┘${RESET}\n`);
}

function info(msg: string): void {
	console.log(`  ${ARROW} ${msg}`);
}

function success(msg: string): void {
	console.log(`  ${CHECK} ${msg}`);
}

function warn(msg: string): void {
	console.log(`  ${WARN} ${YELLOW}${msg}${RESET}`);
}

function error(msg: string): void {
	console.log(`  ${CROSS} ${RED}${msg}${RESET}`);
}

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
		// Strip surrounding quotes
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

function getEnvVar(key: string): string | undefined {
	return readEnvFile().get(key);
}

function setEnvVar(key: string, value: string): void {
	if (!existsSync(ENV_FILE)) {
		writeFileSync(ENV_FILE, "", "utf-8");
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
	} else {
		// Append with a newline if file doesn't end with one
		const suffix = content.endsWith("\n") ? "" : "\n";
		appendFileSync(ENV_FILE, `${suffix}${key}="${value}"\n`, "utf-8");
	}
}

function prompt(question: string): Promise<string> {
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	return new Promise((resolve) => {
		rl.question(`  ${MAGENTA}?${RESET} ${question} `, (answer) => {
			rl.close();
			resolve(answer.trim());
		});
	});
}

function runCmd(cmd: string, args: string[], options?: { silent?: boolean }): string {
	try {
		return execFileSync(cmd, args, {
			encoding: "utf-8",
			stdio: options?.silent ? "pipe" : "inherit",
		}) as string;
	} catch (e: unknown) {
		const err = e as { stdout?: string; stderr?: string; message?: string };
		return err.stdout ?? err.stderr ?? err.message ?? "";
	}
}

function openBrowser(url: string): void {
	try {
		const platform = process.platform;
		if (platform === "darwin") {
			execFileSync("open", [url], { stdio: "ignore" });
		} else if (platform === "linux") {
			execFileSync("xdg-open", [url], { stdio: "ignore" });
		} else if (platform === "win32") {
			execFileSync("cmd", ["/c", "start", url], { stdio: "ignore" });
		}
	} catch {
		warn(`Could not open browser. Please visit: ${url}`);
	}
}

function isPlaceholder(value: string | undefined): boolean {
	if (!value) return true;
	return (
		value.includes("your-") ||
		value.includes("YOUR_") ||
		value === "" ||
		value === '""' ||
		value === "''"
	);
}

// ── Phase 1: Convex Setup ────────────────────────────────────────────────────

async function phaseConvex(): Promise<void> {
	box("Phase 1 / 4 — Convex Setup");

	const existing = getEnvVar("NEXT_PUBLIC_CONVEX_URL");
	if (existing && !isPlaceholder(existing)) {
		success(`NEXT_PUBLIC_CONVEX_URL already set: ${DIM}${existing}${RESET}`);
		return;
	}

	info("Running Convex project setup...");
	info("This will create a new Convex project or link to an existing one.\n");

	runCmd("npx", ["convex", "dev", "--once"]);

	// Check if the env var was written
	const convexUrl = getEnvVar("NEXT_PUBLIC_CONVEX_URL");
	if (convexUrl && !isPlaceholder(convexUrl)) {
		success(`Convex configured: ${DIM}${convexUrl}${RESET}`);
	} else {
		// Try to read from convex.json as fallback
		try {
			if (existsSync("convex.json")) {
				const convexConfig = JSON.parse(readFileSync("convex.json", "utf-8"));
				const deploymentUrl = convexConfig.prodUrl || convexConfig.url;
				if (deploymentUrl) {
					setEnvVar("NEXT_PUBLIC_CONVEX_URL", deploymentUrl);
					success(`Convex configured from convex.json: ${DIM}${deploymentUrl}${RESET}`);
					return;
				}
			}
		} catch {
			// ignore parse errors
		}
		warn("Could not detect Convex URL automatically.");
		const manualUrl = await prompt("Paste your NEXT_PUBLIC_CONVEX_URL:");
		if (manualUrl) {
			setEnvVar("NEXT_PUBLIC_CONVEX_URL", manualUrl);
			success("Convex URL saved.");
		} else {
			error("Skipping Convex URL — you'll need to set it manually in .env.local");
		}
	}
}

// ── Phase 2: Clerk Setup ─────────────────────────────────────────────────────

async function phaseClerk(): Promise<void> {
	box("Phase 2 / 4 — Clerk Setup");

	const requiredKeys = [
		{
			key: "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
			label: "Publishable Key (starts with pk_)",
			hint: "Clerk Dashboard > API Keys > Publishable Key",
		},
		{
			key: "CLERK_SECRET_KEY",
			label: "Secret Key (starts with sk_)",
			hint: "Clerk Dashboard > API Keys > Secret Key",
		},
		{
			key: "NEXT_PUBLIC_CLERK_FRONTEND_API_URL",
			label: "Frontend API URL (e.g., https://your-domain.clerk.accounts.dev)",
			hint: "Clerk Dashboard > API Keys > Advanced > Clerk Frontend API URL",
		},
	];

	// Check which keys are already set
	const missing: typeof requiredKeys = [];
	for (const entry of requiredKeys) {
		const value = getEnvVar(entry.key);
		if (value && !isPlaceholder(value)) {
			success(`${entry.key} already set`);
		} else {
			missing.push(entry);
		}
	}

	if (missing.length === 0) {
		// Also ensure CLERK_JWT_ISSUER_DOMAIN is set
		const frontendUrl = getEnvVar("NEXT_PUBLIC_CLERK_FRONTEND_API_URL");
		if (frontendUrl && !getEnvVar("CLERK_JWT_ISSUER_DOMAIN")) {
			setEnvVar("CLERK_JWT_ISSUER_DOMAIN", frontendUrl);
			success("CLERK_JWT_ISSUER_DOMAIN set to match Frontend API URL");
		}
		return;
	}

	info("Opening Clerk Dashboard in your browser...");
	openBrowser("https://dashboard.clerk.com");
	console.log();
	info("Please copy the following values from the Clerk Dashboard.\n");

	for (const entry of missing) {
		console.log(`  ${DIM}${entry.hint}${RESET}`);
		const value = await prompt(`${entry.label}:`);
		if (value) {
			setEnvVar(entry.key, value);
			success(`${entry.key} saved`);
		} else {
			warn(`Skipped ${entry.key} — set it manually in .env.local`);
		}
		console.log();
	}

	// Set CLERK_JWT_ISSUER_DOMAIN = NEXT_PUBLIC_CLERK_FRONTEND_API_URL
	const frontendUrl = getEnvVar("NEXT_PUBLIC_CLERK_FRONTEND_API_URL");
	if (frontendUrl && !isPlaceholder(frontendUrl)) {
		setEnvVar("CLERK_JWT_ISSUER_DOMAIN", frontendUrl);
		success("CLERK_JWT_ISSUER_DOMAIN set to match Frontend API URL");
	}
}

// ── Phase 3: Automated Wiring ────────────────────────────────────────────────

async function phaseWiring(): Promise<void> {
	box("Phase 3 / 4 — Automated Wiring");

	const clerkSecret = getEnvVar("CLERK_SECRET_KEY");
	if (!clerkSecret || isPlaceholder(clerkSecret)) {
		warn("CLERK_SECRET_KEY not set — skipping automated wiring.");
		warn("Re-run the wizard after setting your Clerk keys.\n");
		return;
	}

	const convexUrl = getEnvVar("NEXT_PUBLIC_CONVEX_URL");
	const issuerDomain = getEnvVar("CLERK_JWT_ISSUER_DOMAIN");

	// ── 3a: Create JWT template ──────────────────────────────────────────────

	info("Creating Clerk JWT template for Convex...");
	try {
		const jwtRes = await fetch("https://api.clerk.com/v1/jwt_templates", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${clerkSecret}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: "convex",
				claims: {},
				lifetime: 60,
				allowed_clock_skew: 5,
			}),
		});

		if (jwtRes.ok) {
			success('JWT template "convex" created');
		} else if (jwtRes.status === 422) {
			// Already exists
			success('JWT template "convex" already exists');
		} else {
			const body = await jwtRes.text();
			throw new Error(`HTTP ${jwtRes.status}: ${body}`);
		}
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : String(e);
		warn(`Could not create JWT template automatically: ${msg}`);
		console.log();
		info("Manual step: Create a JWT template in Clerk Dashboard:");
		info("  1. Go to JWT Templates > New Template");
		info('  2. Select "Convex" template');
		info("  3. Save (defaults are fine)\n");
	}

	// ── 3b: Create webhook endpoint ──────────────────────────────────────────

	info("Creating Clerk webhook endpoint...");

	let webhookSecret = getEnvVar("CLERK_WEBHOOK_SECRET");
	if (webhookSecret && !isPlaceholder(webhookSecret)) {
		success("CLERK_WEBHOOK_SECRET already set — skipping webhook creation");
	} else if (!convexUrl || isPlaceholder(convexUrl)) {
		warn("NEXT_PUBLIC_CONVEX_URL not set — cannot create webhook endpoint.");
		warn("Set it manually and re-run the wizard.\n");
	} else {
		const webhookUrl = `${convexUrl.replace(".cloud", ".site")}/clerk-users-webhook`;
		info(`Webhook URL: ${DIM}${webhookUrl}${RESET}`);

		try {
			const whRes = await fetch("https://api.clerk.com/v1/webhooks", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${clerkSecret}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					url: webhookUrl,
					events: ["user.created", "user.updated", "user.deleted"],
				}),
			});

			if (whRes.ok) {
				const whData = (await whRes.json()) as {
					signing_secret?: string;
					secret?: string;
				};
				webhookSecret = whData.signing_secret || whData.secret || "";
				if (webhookSecret) {
					setEnvVar("CLERK_WEBHOOK_SECRET", webhookSecret);
					success("Webhook endpoint created and secret saved");
				} else {
					success("Webhook endpoint created");
					warn("Could not extract signing secret from response.");
					warn(
						"Get it from Clerk Dashboard > Webhooks and set CLERK_WEBHOOK_SECRET in .env.local\n",
					);
				}
			} else {
				const body = await whRes.text();
				throw new Error(`HTTP ${whRes.status}: ${body}`);
			}
		} catch (e: unknown) {
			const msg = e instanceof Error ? e.message : String(e);
			warn(`Could not create webhook automatically: ${msg}`);
			console.log();
			info("Manual step: Create a webhook in Clerk Dashboard > Webhooks:");
			info(`  URL: ${webhookUrl}`);
			info("  Events: user.created, user.updated, user.deleted");
			info("  Then copy the Signing Secret to .env.local as CLERK_WEBHOOK_SECRET\n");

			const manualSecret = await prompt("Paste CLERK_WEBHOOK_SECRET (or press Enter to skip):");
			if (manualSecret) {
				setEnvVar("CLERK_WEBHOOK_SECRET", manualSecret);
				webhookSecret = manualSecret;
				success("CLERK_WEBHOOK_SECRET saved");
			}
		}
	}

	// ── 3c: Set Convex env vars via CLI ──────────────────────────────────────

	info("Setting Convex environment variables...");

	webhookSecret = getEnvVar("CLERK_WEBHOOK_SECRET");
	if (webhookSecret && !isPlaceholder(webhookSecret)) {
		try {
			runCmd("npx", ["convex", "env", "set", "CLERK_WEBHOOK_SECRET", webhookSecret], {
				silent: true,
			});
			success("CLERK_WEBHOOK_SECRET set in Convex");
		} catch {
			warn("Could not set CLERK_WEBHOOK_SECRET in Convex.");
			info("Run manually: npx convex env set CLERK_WEBHOOK_SECRET <value>\n");
		}
	} else {
		warn("CLERK_WEBHOOK_SECRET not available — skipping Convex env var.");
	}

	if (issuerDomain && !isPlaceholder(issuerDomain)) {
		try {
			runCmd("npx", ["convex", "env", "set", "CLERK_JWT_ISSUER_DOMAIN", issuerDomain], {
				silent: true,
			});
			success("CLERK_JWT_ISSUER_DOMAIN set in Convex");
		} catch {
			warn("Could not set CLERK_JWT_ISSUER_DOMAIN in Convex.");
			info("Run manually: npx convex env set CLERK_JWT_ISSUER_DOMAIN <value>\n");
		}
	} else {
		warn("CLERK_JWT_ISSUER_DOMAIN not available — skipping Convex env var.");
	}
}

// ── Phase 4: Verification ────────────────────────────────────────────────────

function phaseVerify(): void {
	box("Phase 4 / 4 — Verification");

	const required = [
		"NEXT_PUBLIC_CONVEX_URL",
		"NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
		"CLERK_SECRET_KEY",
		"NEXT_PUBLIC_CLERK_FRONTEND_API_URL",
		"CLERK_JWT_ISSUER_DOMAIN",
		"CLERK_WEBHOOK_SECRET",
	];

	const optional = [
		"NEXT_PUBLIC_POSTHOG_KEY",
		"NEXT_PUBLIC_POSTHOG_HOST",
		"NEXT_PUBLIC_APP_URL",
		"NEXT_PUBLIC_APP_NAME",
	];

	let allGood = true;

	console.log(`  ${BOLD}Required:${RESET}`);
	for (const key of required) {
		const value = getEnvVar(key);
		if (value && !isPlaceholder(value)) {
			const display = key.includes("SECRET") ? `${value.slice(0, 8)}...` : value;
			console.log(`  ${CHECK} ${key} = ${DIM}${display}${RESET}`);
		} else {
			console.log(`  ${CROSS} ${key} ${RED}— not set${RESET}`);
			allGood = false;
		}
	}

	console.log(`\n  ${BOLD}Optional:${RESET}`);
	for (const key of optional) {
		const value = getEnvVar(key);
		if (value && !isPlaceholder(value)) {
			console.log(`  ${CHECK} ${key} = ${DIM}${value}${RESET}`);
		} else {
			console.log(`  ${DIM}  ${key} — not set (optional)${RESET}`);
		}
	}

	console.log();

	if (allGood) {
		console.log(`  ${GREEN}${BOLD}All required variables are configured!${RESET}\n`);
		console.log(`  Next step: run ${CYAN}${BOLD}bun run dev${RESET} to start development.\n`);
	} else {
		console.log(`  ${YELLOW}${BOLD}Some required variables are missing.${RESET}`);
		console.log(
			`  Set them in ${BOLD}.env.local${RESET} and re-run ${CYAN}bun run setup${RESET}.\n`,
		);
	}
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
	console.log();
	console.log(`  ${BOLD}${CYAN}Micro-SaaS Template Setup Wizard${RESET}`);
	console.log(`  ${DIM}Configures Convex, Clerk, webhooks, and environment variables.${RESET}`);

	await phaseConvex();
	await phaseClerk();
	await phaseWiring();
	phaseVerify();
}

main().catch((e) => {
	error(`Setup wizard failed: ${e instanceof Error ? e.message : String(e)}`);
	process.exit(1);
});
